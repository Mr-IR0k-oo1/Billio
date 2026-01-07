const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get company settings for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const result = await pool.query(
      'SELECT * FROM company_settings WHERE user_id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        company_name: '',
        company_email: '',
        company_phone: '',
        company_address: '',
        company_website: '',
        tax_id: '',
        logo_url: '',
        invoice_prefix: 'INV',
        invoice_starting_number: 1000,
        estimate_prefix: 'EST',
        estimate_starting_number: 1000,
        default_payment_terms: 30,
        default_tax_rate: 0,
        default_currency: 'USD',
        default_notes: '',
        default_terms: ''
      });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update company settings
router.put('/', auth, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const {
      company_name,
      company_email,
      company_phone,
      company_address,
      company_website,
      tax_id,
      logo_url,
      invoice_prefix,
      invoice_starting_number,
      estimate_prefix,
      estimate_starting_number,
      default_payment_terms,
      default_tax_rate,
      default_currency,
      default_notes,
      default_terms
    } = req.body;

    // Check if settings exist
    const existing = await pool.query(
      'SELECT id FROM company_settings WHERE user_id = $1',
      [req.user.id]
    );

    let result;
    if (existing.rows.length === 0) {
      // Create new settings
      result = await pool.query(
        `INSERT INTO company_settings (
          user_id, company_name, company_email, company_phone, company_address,
          company_website, tax_id, logo_url, invoice_prefix, invoice_starting_number,
          estimate_prefix, estimate_starting_number, default_payment_terms,
          default_tax_rate, default_currency, default_notes, default_terms
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          req.user.id, company_name, company_email, company_phone, company_address,
          company_website, tax_id, logo_url, invoice_prefix, invoice_starting_number,
          estimate_prefix, estimate_starting_number, default_payment_terms,
          default_tax_rate, default_currency, default_notes, default_terms
        ]
      );
    } else {
      // Update existing settings
      result = await pool.query(
        `UPDATE company_settings SET
          company_name = $1, company_email = $2, company_phone = $3, company_address = $4,
          company_website = $5, tax_id = $6, logo_url = $7, invoice_prefix = $8,
          invoice_starting_number = $9, estimate_prefix = $10, estimate_starting_number = $11,
          default_payment_terms = $12, default_tax_rate = $13, default_currency = $14,
          default_notes = $15, default_terms = $16, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $17
        RETURNING *`,
        [
          company_name, company_email, company_phone, company_address,
          company_website, tax_id, logo_url, invoice_prefix, invoice_starting_number,
          estimate_prefix, estimate_starting_number, default_payment_terms,
          default_tax_rate, default_currency, default_notes, default_terms,
          req.user.id
        ]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload company logo
router.post('/logo', auth, async (req, res) => {
  try {
    const { logo_url } = req.body;
    
    if (!logo_url) {
      return res.status(400).json({ error: 'Logo URL is required' });
    }

    const pool = req.app.get('pool');
    
    // Update or create settings with logo
    const existing = await pool.query(
      'SELECT id FROM company_settings WHERE user_id = $1',
      [req.user.id]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO company_settings (user_id, logo_url) VALUES ($1, $2)',
        [req.user.id, logo_url]
      );
    } else {
      await pool.query(
        'UPDATE company_settings SET logo_url = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
        [logo_url, req.user.id]
      );
    }

    res.json({ logo_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
