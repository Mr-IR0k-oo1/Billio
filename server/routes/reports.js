const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Revenue over time report
router.get('/revenue', auth, async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    const pool = req.app.get('pool');
    
    let interval;
    let groupBy;
    
    switch(period) {
      case '30days':
        interval = '30 days';
        groupBy = 'day';
        break;
      case '3months':
        interval = '3 months';
        groupBy = 'week';
        break;
      case '12months':
        interval = '12 months';
        groupBy = 'month';
        break;
      default: // 6months
        interval = '6 months';
        groupBy = 'month';
    }
    
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC($1, issue_date) as period,
        SUM(total) as revenue,
        COUNT(*) as invoice_count,
        SUM(paid_amount) as collected
      FROM invoices
      WHERE user_id = $2 
        AND issue_date >= NOW() - INTERVAL '${interval}'
        AND status != 'cancelled'
      GROUP BY DATE_TRUNC($1, issue_date)
      ORDER BY period ASC
    `, [groupBy, req.user.id]);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invoice aging report
router.get('/invoice-aging', auth, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    
    const result = await pool.query(`
      SELECT
        c.name as client_name,
        i.invoice_number,
        i.issue_date,
        i.due_date,
        i.total,
        i.paid_amount,
        (i.total - i.paid_amount) as balance,
        CASE
          WHEN i.due_date >= CURRENT_DATE THEN 'current'
          WHEN i.due_date >= CURRENT_DATE - INTERVAL '30 days' THEN '1-30 days'
          WHEN i.due_date >= CURRENT_DATE - INTERVAL '60 days' THEN '31-60 days'
          WHEN i.due_date >= CURRENT_DATE - INTERVAL '90 days' THEN '61-90 days'
          ELSE '90+ days'
        END as age_bracket
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.user_id = $1
        AND i.status IN ('sent', 'overdue', 'partially_paid')
        AND (i.total - i.paid_amount) > 0
      ORDER BY i.due_date ASC
    `, [req.user.id]);
    
    // Group by age bracket
    const grouped = result.rows.reduce((acc, row) => {
      if (!acc[row.age_bracket]) {
        acc[row.age_bracket] = {
          bracket: row.age_bracket,
          invoices: [],
          total_balance: 0
        };
      }
      acc[row.age_bracket].invoices.push(row);
      acc[row.age_bracket].total_balance += parseFloat(row.balance);
      return acc;
    }, {});
    
    res.json({
      brackets: Object.values(grouped),
      all_invoices: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Client summary report
router.get('/client-summary', auth, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.email,
        COUNT(DISTINCT i.id) as total_invoices,
        COALESCE(SUM(i.total), 0) as total_billed,
        COALESCE(SUM(i.paid_amount), 0) as total_paid,
        COALESCE(SUM(i.total - i.paid_amount), 0) as outstanding_balance,
        MAX(i.issue_date) as last_invoice_date,
        COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as overdue_count
      FROM clients c
      LEFT JOIN invoices i ON c.id = i.client_id
      WHERE c.user_id = $1
      GROUP BY c.id, c.name, c.email
      ORDER BY total_billed DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard statistics
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    
    // Get various stats in parallel
    const [invoiceStats, revenueStats, clientStats, overdueStats] = await Promise.all([
      // Invoice counts by status
      pool.query(`
        SELECT 
          status,
          COUNT(*) as count,
          SUM(total) as total_amount
        FROM invoices
        WHERE user_id = $1
        GROUP BY status
      `, [req.user.id]),
      
      // Revenue this month vs last month
      pool.query(`
        SELECT
          DATE_TRUNC('month', issue_date) as month,
          SUM(total) as revenue,
          SUM(paid_amount) as collected
        FROM invoices
        WHERE user_id = $1
          AND issue_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND status != 'cancelled'
        GROUP BY DATE_TRUNC('month', issue_date)
      `, [req.user.id]),
      
      // Client stats
      pool.query(`
        SELECT
          COUNT(DISTINCT id) as total_clients,
          COUNT(DISTINCT CASE WHEN status = 'active' THEN id END) as active_clients
        FROM clients
        WHERE user_id = $1
      `, [req.user.id]),
      
      // Overdue invoices
      pool.query(`
        SELECT
          COUNT(*) as overdue_count,
          SUM(total - paid_amount) as overdue_amount
        FROM invoices
        WHERE user_id = $1
          AND status IN ('overdue', 'sent')
          AND due_date < CURRENT_DATE
          AND (total - paid_amount) > 0
      `, [req.user.id])
    ]);
    
    res.json({
      invoice_stats: invoiceStats.rows,
      revenue_stats: revenueStats.rows,
      client_stats: clientStats.rows[0],
      overdue_stats: overdueStats.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export data as CSV
router.get('/export', auth, async (req, res) => {
  try {
    const { type = 'invoices', format = 'csv' } = req.query;
    const pool = req.app.get('pool');
    
    let query, filename;
    
    switch(type) {
      case 'invoices':
        query = `
          SELECT 
            i.invoice_number,
            c.name as client_name,
            i.issue_date,
            i.due_date,
            i.status,
            i.subtotal,
            i.tax_amount,
            i.discount,
            i.total,
            i.paid_amount,
            (i.total - i.paid_amount) as balance
          FROM invoices i
          LEFT JOIN clients c ON i.client_id = c.id
          WHERE i.user_id = $1
          ORDER BY i.issue_date DESC
        `;
        filename = 'invoices_export.csv';
        break;
        
      case 'clients':
        query = `
          SELECT
            c.name,
            c.email,
            c.phone,
            c.address,
            c.payment_terms,
            c.status
          FROM clients c
          WHERE c.user_id = $1
          ORDER BY c.name ASC
        `;
        filename = 'clients_export.csv';
        break;
        
      case 'products':
        query = `
          SELECT
            name,
            unit_price,
            description,
            category
          FROM products
          WHERE user_id = $1
          ORDER BY name ASC
        `;
        filename = 'products_export.csv';
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }
    
    const result = await pool.query(query, [req.user.id]);
    
    if (format === 'json') {
      res.json(result.rows);
    } else {
      // Convert to CSV
      const { jsonToCSV } = require('../utils/csvHelper');
      const csv = jsonToCSV(result.rows);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
