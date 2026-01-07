const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateEstimateNumber } = require('../services/numberingService');

// Get all estimates for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const result = await pool.query(`
      SELECT e.*, c.name as client_name, c.email as client_email
      FROM estimates e
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE e.user_id = $1
      ORDER BY e.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single estimate
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.get('pool');
    
    const estimateResult = await pool.query(`
      SELECT e.*, c.name as client_name, c.email as client_email, c.address as client_address
      FROM estimates e
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE e.id = $1 AND e.user_id = $2
    `, [id, req.user.id]);
    
    if (estimateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Estimate not found' });
    }
    
    const itemsResult = await pool.query(
      'SELECT * FROM estimate_items WHERE estimate_id = $1',
      [id]
    );
    
    const estimate = estimateResult.rows[0];
    estimate.items = itemsResult.rows;
    
    res.json(estimate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new estimate
router.post('/', auth, async (req, res) => {
  const { 
    client_id, status, expiry_date, subtotal, tax_rate, tax_amount,
    discount, discount_type, total, currency, notes, terms, items 
  } = req.body;
  
  const pool = req.app.get('pool');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Generate estimate number
    const estimate_number = await generateEstimateNumber(client, req.user.id);
    
    // Create estimate
    const estimateResult = await client.query(
      `INSERT INTO estimates (
        user_id, client_id, estimate_number, status, expiry_date,
        subtotal, tax_rate, tax_amount, discount, discount_type, 
        total, currency, notes, terms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        req.user.id, client_id, estimate_number, status || 'draft', expiry_date,
        subtotal, tax_rate, tax_amount, discount, discount_type,
        total, currency || 'USD', notes, terms
      ]
    );
    
    const estimateId = estimateResult.rows[0].id;
    
    // Add items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          'INSERT INTO estimate_items (estimate_id, description, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [estimateId, item.description, item.quantity, item.unit_price]
        );
      }
    }
    
    // Log activity
    await client.query(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
       VALUES ($1, 'created', 'estimate', $2, $3)`,
      [req.user.id, estimateId, JSON.stringify({ estimate_number })]
    );
    
    await client.query('COMMIT');
    res.json(estimateResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Update estimate
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { 
    client_id, status, expiry_date, subtotal, tax_rate, tax_amount,
    discount, discount_type, total, currency, notes, terms, items 
  } = req.body;
  
  const pool = req.app.get('pool');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Verify ownership
    const checkResult = await client.query(
      'SELECT id, status FROM estimates WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Estimate not found' });
    }
    
    // Prevent editing converted estimates
    if (checkResult.rows[0].status === 'converted') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot edit converted estimate' });
    }
    
    // Update estimate
    const estimateResult = await client.query(
      `UPDATE estimates SET
        client_id = $1, status = $2, expiry_date = $3,
        subtotal = $4, tax_rate = $5, tax_amount = $6,
        discount = $7, discount_type = $8, total = $9,
        currency = $10, notes = $11, terms = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *`,
      [
        client_id, status, expiry_date, subtotal, tax_rate, tax_amount,
        discount, discount_type, total, currency, notes, terms, id
      ]
    );
    
    // Update items
    if (items) {
      await client.query('DELETE FROM estimate_items WHERE estimate_id = $1', [id]);
      for (const item of items) {
        await client.query(
          'INSERT INTO estimate_items (estimate_id, description, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [id, item.description, item.quantity, item.unit_price]
        );
      }
    }
    
    await client.query('COMMIT');
    res.json(estimateResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Delete estimate
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.get('pool');
    
    const result = await pool.query(
      'DELETE FROM estimates WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Estimate not found' });
    }
    
    res.json({ message: 'Estimate deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Convert estimate to invoice
router.post('/:id/convert', auth, async (req, res) => {
  const { id } = req.params;
  const pool = req.app.get('pool');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get estimate details
    const estimateResult = await client.query(
      'SELECT * FROM estimates WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (estimateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Estimate not found' });
    }
    
    const estimate = estimateResult.rows[0];
    
    if (estimate.status === 'converted') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Estimate already converted' });
    }
    
    // Get estimate items
    const itemsResult = await client.query(
      'SELECT * FROM estimate_items WHERE estimate_id = $1',
      [id]
    );
    
    // Generate invoice number
    const { generateInvoiceNumber } = require('../services/numberingService');
    const invoice_number = await generateInvoiceNumber(client, req.user.id);
    
    // Create invoice
    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        user_id, client_id, invoice_number, status, due_date,
        subtotal, tax_rate, tax_amount, discount, discount_type,
        total, currency, notes, terms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        req.user.id, estimate.client_id, invoice_number, 'draft',
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        estimate.subtotal, estimate.tax_rate, estimate.tax_amount,
        estimate.discount, estimate.discount_type, estimate.total,
        estimate.currency, estimate.notes, estimate.terms
      ]
    );
    
    const invoiceId = invoiceResult.rows[0].id;
    
    // Copy items to invoice
    for (const item of itemsResult.rows) {
      await client.query(
        'INSERT INTO invoice_items (invoice_id, description, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [invoiceId, item.description, item.quantity, item.unit_price]
      );
    }
    
    // Update estimate status
    await client.query(
      'UPDATE estimates SET status = $1, converted_to_invoice_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['converted', invoiceId, id]
    );
    
    await client.query('COMMIT');
    res.json({ 
      message: 'Estimate converted to invoice',
      invoice_id: invoiceId,
      invoice_number
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
