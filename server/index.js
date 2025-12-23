const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const { generateInvoicePdf } = require('./services/pdfService');
const { sendInvoiceEmail } = require('./services/emailService');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Invoicing API is running');
});

// Clients API
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  const { user_id, name, email, address } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clients (user_id, name, email, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, name, email, address]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, address } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clients SET name = $1, email = $2, address = $3 WHERE id = $4 RETURNING *',
      [name, email, address, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { user_id, name, unit_price, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (user_id, name, unit_price, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, name, unit_price, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, unit_price, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, unit_price = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, unit_price, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invoices API
app.get('/api/invoices', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, c.name as client_name 
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      ORDER BY i.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      WHERE i.id = $1
    `, [id]);
    
    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const itemsResult = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);
    
    const invoice = invoiceResult.rows[0];
    invoice.items = itemsResult.rows;
    
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  const { user_id, client_id, status, due_date, total, items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const invoiceResult = await client.query(
      'INSERT INTO invoices (user_id, client_id, status, due_date, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, client_id, status || 'draft', due_date, total || 0]
    );
    const invoiceId = invoiceResult.rows[0].id;

    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          'INSERT INTO invoice_items (invoice_id, description, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [invoiceId, item.description, item.quantity, item.unit_price]
        );
      }
    }

    await client.query('COMMIT');
    res.json(invoiceResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  const { client_id, status, due_date, total, items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const invoiceResult = await client.query(
      'UPDATE invoices SET client_id = $1, status = $2, due_date = $3, total = $4 WHERE id = $5 RETURNING *',
      [client_id, status, due_date, total, id]
    );

    if (items) {
      await client.query('DELETE FROM invoice_items WHERE invoice_id = $1', [id]);
      for (const item of items) {
        await client.query(
          'INSERT INTO invoice_items (invoice_id, description, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [id, item.description, item.quantity, item.unit_price]
        );
      }
    }

    await client.query('COMMIT');
    res.json(invoiceResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id/pdf', async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      WHERE i.id = $1
    `, [id]);
    
    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const itemsResult = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);
    const invoice = invoiceResult.rows[0];
    invoice.items = itemsResult.rows;

    const pdfBuffer = await generateInvoicePdf(invoice);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices/:id/send', async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      WHERE i.id = $1
    `, [id]);
    
    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const itemsResult = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);
    const invoice = invoiceResult.rows[0];
    invoice.items = itemsResult.rows;

    const pdfBuffer = await generateInvoicePdf(invoice);
    
    const subject = `Invoice ${id} from Intelligent Invoicing`;
    const html = `<p>Please find attached your invoice for ${invoice.total}.</p>`;
    
    await sendInvoiceEmail(invoice.client_email, subject, html, [
      {
        filename: `invoice-${id}.pdf`,
        content: pdfBuffer,
      }
    ]);

    // Store in emails table
    await pool.query(
      'INSERT INTO emails (invoice_id, type, content) VALUES ($1, $2, $3)',
      [id, 'invoice', html]
    );

    // Update invoice status
    await pool.query('UPDATE invoices SET status = $1 WHERE id = $2', ['sent', id]);

    res.json({ message: 'Invoice sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Endpoint
app.post('/api/ai/describe-line-items', async (req, res) => {
    const { notes } = req.body;
    if (!notes) return res.status(400).json({ error: 'Notes are required' });

    try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Or gpt-4
            messages: [
                {
                    role: "system",
                    content: "You are an invoicing assistant for freelancers.\nConvert short descriptions of work into clear, professional invoice line items.\nDo not include explanations or extra text.\nReturn valid JSON only."
                },
                {
                    role: "user",
                    content: `Convert the following work description into invoice line items suitable for a client invoice.\n\nWork description:\n${notes}\n\nReturn JSON in the following format:\n{\n  "items": [\n    {\n      "description": "",\n      "quantity": 1,\n      "unit_price": null\n    }\n  ]\n}`
                }
            ],
            temperature: 0.3,
        });

        const content = response.choices[0].message.content;
        try {
            const json = JSON.parse(content);
            res.json(json);
        } catch (e) {
            res.status(500).json({ error: "Failed to parse AI response as JSON", content });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
