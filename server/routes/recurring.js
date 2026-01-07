const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all recurring profiles
router.get('/', auth, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const result = await pool.query(`
      SELECT r.*, c.name as client_name 
      FROM recurring_invoices r
      LEFT JOIN clients c ON r.client_id = c.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single recurring profile
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const pool = req.app.get('pool');
    const result = await pool.query(
      'SELECT * FROM recurring_invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recurring profile not found' });
    }

    const itemsResult = await pool.query(
      'SELECT * FROM recurring_invoice_items WHERE recurring_invoice_id = $1',
      [id]
    );
    
    const profile = result.rows[0];
    profile.items = itemsResult.rows;
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create recurring profile
router.post('/', auth, async (req, res) => {
  const { 
    client_id, interval, interval_count, start_date, end_date, 
    total, items, send_automatically, status 
  } = req.body;
  
  const pool = req.app.get('pool');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Calculate next run date (same as start date initially)
    const next_run = start_date;

    const profileResult = await client.query(
      `INSERT INTO recurring_invoices (
        user_id, client_id, interval, interval_count, start_date, end_date, 
        next_run, last_run, status, total, send_automatically
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9, $10) RETURNING *`,
      [
        req.user.id, client_id, interval || 'month', interval_count || 1,
        start_date, end_date, next_run, status || 'active', total || 0,
        send_automatically || false
      ]
    );
    
    const profileId = profileResult.rows[0].id;

    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO recurring_invoice_items (
            recurring_invoice_id, description, quantity, unit_price
          ) VALUES ($1, $2, $3, $4)`,
          [profileId, item.description, item.quantity, item.unit_price]
        );
      }
    }

    await client.query('COMMIT');
    res.json(profileResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Update recurring profile
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { 
    client_id, interval, interval_count, start_date, end_date, 
    status, total, items, send_automatically 
  } = req.body;
  
  const pool = req.app.get('pool');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const check = await client.query(
      'SELECT id FROM recurring_invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (check.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Recurring profile not found' });
    }

    const profileResult = await client.query(
      `UPDATE recurring_invoices SET 
        client_id = $1, interval = $2, interval_count = $3, 
        start_date = $4, end_date = $5, status = $6, total = $7,
        send_automatically = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 RETURNING *`,
      [
        client_id, interval, interval_count, start_date, end_date,
        status, total, send_automatically, id
      ]
    );

    if (items) {
      await client.query('DELETE FROM recurring_invoice_items WHERE recurring_invoice_id = $1', [id]);
      for (const item of items) {
        await client.query(
          `INSERT INTO recurring_invoice_items (
            recurring_invoice_id, description, quantity, unit_price
          ) VALUES ($1, $2, $3, $4)`,
          [id, item.description, item.quantity, item.unit_price]
        );
      }
    }

    await client.query('COMMIT');
    res.json(profileResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Delete recurring profile
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const pool = req.app.get('pool');
    await pool.query(
      'DELETE FROM recurring_invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Recurring profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
