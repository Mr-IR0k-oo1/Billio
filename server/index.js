const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const { generateInvoicePdf } = require('./services/pdfService');
const { sendInvoiceEmail } = require('./services/emailService');
const auth = require('./middleware/auth');
const authRouter = require('./routes/auth');
const companyRouter = require('./routes/company');
const paymentsRouter = require('./routes/payments');
const estimatesRouter = require('./routes/estimates');
const recurringRouter = require('./routes/recurring');
const reportsRouter = require('./routes/reports');

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

// Make pool available to routes
app.set('pool', pool);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/company', companyRouter);
app.use('/api/invoices', paymentsRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/recurring', recurringRouter);
app.use('/api/reports', reportsRouter);

// Basic Route for API Health
app.get('/api/health', (req, res) => {
  res.send('Billio Invoicing API v2.0 is running');
});

// Clients API (Scoped by User)
app.get('/api/clients', auth, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = 'SELECT * FROM clients WHERE user_id = $1';
    const params = [req.user.id];
    
    if (search) {
      query += ' AND (name ILIKE $2 OR email ILIKE $2)';
      params.push(`%${search}%`);
    }
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    query += ' ORDER BY name ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', auth, async (req, res) => {
  const { name, email, address, phone, tax_id, payment_terms, notes, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clients (user_id, name, email, address, phone, tax_id, payment_terms, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, name, email, address, phone, tax_id, payment_terms || 30, notes, status || 'active']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clients/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone, tax_id, payment_terms, notes, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE clients SET name = $1, email = $2, address = $3, phone = $4, tax_id = $5, 
       payment_terms = $6, notes = $7, status = $8 
       WHERE id = $9 AND user_id = $10 RETURNING *`,
      [name, email, address, phone, tax_id, payment_terms, notes, status, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/clients/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products API (Scoped by User)
app.get('/api/products', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE user_id = $1 ORDER BY name ASC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', auth, async (req, res) => {
  const { name, unit_price, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (user_id, name, unit_price, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, name, unit_price, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, unit_price, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, unit_price = $2, description = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, unit_price, description, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invoices API (Scoped by User)
app.get('/api/invoices', auth, async (req, res) => {
  try {
    const { search, status, client_id } = req.query;
    let query = `
      SELECT i.*, c.name as client_name 
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      WHERE i.user_id = $1
    `;
    const params = [req.user.id];
    
    if (search) {
      query += ` AND (i.invoice_number ILIKE $${params.length + 1} OR c.name ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }
    if (status) {
      query += ` AND i.status = $${params.length + 1}`;
      params.push(status);
    }
    if (client_id) {
      query += ` AND i.client_id = $${params.length + 1}`;
      params.push(client_id);
    }
    
    query += ' ORDER BY i.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      WHERE i.id = $1 AND i.user_id = $2
    `, [id, req.user.id]);
    
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

app.post('/api/invoices', auth, async (req, res) => {
  const { 
    client_id, status, due_date, subtotal, tax_rate, tax_amount, discount, 
    discount_type, total, currency, notes, terms, template_type, items 
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Generate invoice number
    const { generateInvoiceNumber } = require('./services/numberingService');
    const invoice_number = await generateInvoiceNumber(client, req.user.id);
    
    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        user_id, client_id, invoice_number, status, due_date, 
        subtotal, tax_rate, tax_amount, discount, discount_type, 
        total, currency, notes, terms, template_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        req.user.id, client_id, invoice_number, status || 'draft', due_date,
        subtotal || 0, tax_rate || 0, tax_amount || 0, discount || 0, discount_type || 'fixed',
        total || 0, currency || 'USD', notes, terms, template_type || 'minimalist'
      ]
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
    
    // Log activity
    await client.query(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
       VALUES ($1, 'created', 'invoice', $2, $3)`,
      [req.user.id, invoiceId, JSON.stringify({ invoice_number })]
    );

    await client.query('COMMIT');
    res.json(invoiceResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/invoices/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { 
    client_id, status, due_date, subtotal, tax_rate, tax_amount, discount,
    discount_type, total, currency, notes, terms, template_type, items 
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const checkRes = await client.query('SELECT id FROM invoices WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (checkRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoiceResult = await client.query(
      `UPDATE invoices SET 
        client_id = $1, status = $2, due_date = $3, 
        subtotal = $4, tax_rate = $5, tax_amount = $6, discount = $7, discount_type = $8,
        total = $9, currency = $10, notes = $11, terms = $12, template_type = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14 RETURNING *`,
      [
        client_id, status, due_date,
        subtotal, tax_rate, tax_amount, discount, discount_type,
        total, currency, notes, terms, template_type, id
      ]
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

app.delete('/api/invoices/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM invoices WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id/pdf', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      WHERE i.id = $1 AND i.user_id = $2
    `, [id, req.user.id]);
    
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

app.post('/api/invoices/:id/send', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address
      FROM invoices i 
      LEFT JOIN clients c ON i.client_id = c.id 
      WHERE i.id = $1 AND i.user_id = $2
    `, [id, req.user.id]);
    
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

    await pool.query(
      'INSERT INTO emails (invoice_id, type, content) VALUES ($1, $2, $3)',
      [id, 'invoice', html]
    );

    await pool.query('UPDATE invoices SET status = $1 WHERE id = $2', ['sent', id]);

    res.json({ message: 'Invoice sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Endpoint
app.post('/api/ai/describe-line-items', auth, async (req, res) => {
    const { notes } = req.body;
    if (!notes) return res.status(400).json({ error: 'Notes are required' });

    try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
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

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../micro/dist')));

// SPA Catch-all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../micro/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
