const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all payments for an invoice
router.get('/:invoiceId/payments', auth, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const pool = req.app.get('pool');
    
    // Verify invoice belongs to user
    const invoiceCheck = await pool.query(
      'SELECT id FROM invoices WHERE id = $1 AND user_id = $2',
      [invoiceId, req.user.id]
    );
    
    if (invoiceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const result = await pool.query(
      `SELECT pt.*, u.email as created_by_email
       FROM payment_transactions pt
       LEFT JOIN users u ON pt.created_by = u.id
       WHERE pt.invoice_id = $1
       ORDER BY pt.payment_date DESC, pt.created_at DESC`,
      [invoiceId]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record a payment for an invoice
router.post('/:invoiceId/payments', auth, async (req, res) => {
  const { invoiceId } = req.params;
  const { amount, payment_date, payment_method, reference_number, notes } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid payment amount is required' });
  }
  
  const pool = req.app.get('pool');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Verify invoice belongs to user and get current totals
    const invoiceResult = await client.query(
      'SELECT total, paid_amount, status FROM invoices WHERE id = $1 AND user_id = $2',
      [invoiceId, req.user.id]
    );
    
    if (invoiceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const invoice = invoiceResult.rows[0];
    const currentPaid = parseFloat(invoice.paid_amount) || 0;
    const total = parseFloat(invoice.total);
    const newPaidAmount = currentPaid + parseFloat(amount);
    
    if (newPaidAmount > total) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Payment amount exceeds invoice total',
        total: total,
        already_paid: currentPaid,
        max_payment: total - currentPaid
      });
    }
    
    // Record the payment
    const paymentResult = await client.query(
      `INSERT INTO payment_transactions 
       (invoice_id, amount, payment_date, payment_method, reference_number, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [invoiceId, amount, payment_date || new Date(), payment_method, reference_number, notes, req.user.id]
    );
    
    // Update invoice paid amount and status
    let newStatus = invoice.status;
    if (newPaidAmount >= total) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partially_paid';
    }
    
    await client.query(
      'UPDATE invoices SET paid_amount = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newPaidAmount, newStatus, invoiceId]
    );
    
    // Log activity
    await client.query(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
       VALUES ($1, 'payment_recorded', 'payment', $2, $3)`,
      [req.user.id, paymentResult.rows[0].id, JSON.stringify({ invoice_id: invoiceId, amount })]
    );
    
    await client.query('COMMIT');
    res.json({
      payment: paymentResult.rows[0],
      invoice: {
        paid_amount: newPaidAmount,
        status: newStatus,
        remaining: total - newPaidAmount
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Delete a payment
router.delete('/payments/:paymentId', auth, async (req, res) => {
  const { paymentId } = req.params;
  const pool = req.app.get('pool');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get payment details and verify ownership
    const paymentResult = await client.query(
      `SELECT pt.*, i.user_id, i.total, i.paid_amount
       FROM payment_transactions pt
       JOIN invoices i ON pt.invoice_id = i.id
       WHERE pt.id = $1`,
      [paymentId]
    );
    
    if (paymentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    const payment = paymentResult.rows[0];
    
    if (payment.user_id !== req.user.id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Delete the payment
    await client.query('DELETE FROM payment_transactions WHERE id = $1', [paymentId]);
    
    // Recalculate paid amount for the invoice
    const totalPaidResult = await client.query(
      'SELECT COALESCE(SUM(amount), 0) as total_paid FROM payment_transactions WHERE invoice_id = $1',
      [payment.invoice_id]
    );
    
    const newPaidAmount = parseFloat(totalPaidResult.rows[0].total_paid);
    const total = parseFloat(payment.total);
    
    // Update invoice status
    let newStatus = 'draft';
    if (newPaidAmount >= total) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partially_paid';
    } else if (payment.status === 'sent' || payment.status === 'overdue') {
      newStatus = payment.status; // Keep original status if no payments
    }
    
    await client.query(
      'UPDATE invoices SET paid_amount = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newPaidAmount, newStatus, payment.invoice_id]
    );
    
    await client.query('COMMIT');
    res.json({ 
      message: 'Payment deleted',
      invoice: {
        paid_amount: newPaidAmount,
        status: newStatus
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
