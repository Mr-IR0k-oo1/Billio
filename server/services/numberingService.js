// Invoice and Estimate Numbering Service

/**
 * Generate the next invoice number for a user
 * Format: {PREFIX}{NUMBER} e.g. INV-1001
 */
async function generateInvoiceNumber(client, userId) {
  try {
    // Get company settings for prefix and starting number
    const settingsResult = await client.query(
      'SELECT invoice_prefix, invoice_starting_number FROM company_settings WHERE user_id = $1',
      [userId]
    );
    
    const prefix = settingsResult.rows[0]?.invoice_prefix || 'INV';
    const startingNumber = settingsResult.rows[0]?.invoice_starting_number || 1000;
    
    // Get the highest invoice number for this user
    const result = await client.query(
      `SELECT invoice_number FROM invoices 
       WHERE user_id = $1 AND invoice_number LIKE $2
       ORDER BY id DESC LIMIT 1`,
      [userId, `${prefix}%`]
    );
    
    let nextNumber = startingNumber;
    
    if (result.rows.length > 0) {
      const lastNumber = result.rows[0].invoice_number;
      const numberPart = lastNumber.replace(prefix, '').replace(/[^0-9]/g, '');
      nextNumber = parseInt(numberPart) + 1;
    }
    
    return `${prefix}${String(nextNumber).padStart(4, '0')}`;
  } catch (err) {
    console.error('Error generating invoice number:', err);
    // Fallback to timestamp-based number
    return `INV${Date.now()}`;
  }
}

/**
 * Generate the next estimate number for a user
 * Format: {PREFIX}{NUMBER} e.g. EST-1001
 */
async function generateEstimateNumber(client, userId) {
  try {
    // Get company settings for prefix and starting number
    const settingsResult = await client.query(
      'SELECT estimate_prefix, estimate_starting_number FROM company_settings WHERE user_id = $1',
      [userId]
    );
    
    const prefix = settingsResult.rows[0]?.estimate_prefix || 'EST';
    const startingNumber = settingsResult.rows[0]?.estimate_starting_number || 1000;
    
    // Get the highest estimate number for this user
    const result = await client.query(
      `SELECT estimate_number FROM estimates 
       WHERE user_id = $1 AND estimate_number LIKE $2
       ORDER BY id DESC LIMIT 1`,
      [userId, `${prefix}%`]
    );
    
    let nextNumber = startingNumber;
    
    if (result.rows.length > 0) {
      const lastNumber = result.rows[0].estimate_number;
      const numberPart = lastNumber.replace(prefix, '').replace(/[^0-9]/g, '');
      nextNumber = parseInt(numberPart) + 1;
    }
    
    return `${prefix}${String(nextNumber).padStart(4, '0')}`;
  } catch (err) {
    console.error('Error generating estimate number:', err);
    // Fallback to timestamp-based number
    return `EST${Date.now()}`;
  }
}

module.exports = {
  generateInvoiceNumber,
  generateEstimateNumber
};
