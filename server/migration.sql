-- Migration Script: Add New Tables and Extend Existing Tables
-- Run this on existing database to upgrade from v1 to v2

-- ============================================
-- STEP 1: Extend existing users table
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_format VARCHAR(50) DEFAULT 'MM/DD/YYYY';
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency_default VARCHAR(3) DEFAULT 'USD';

-- ============================================
-- STEP 2: Extend existing clients table
-- ============================================
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_terms INTEGER DEFAULT 30;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'clients_status_check'
    ) THEN
        ALTER TABLE clients ADD CONSTRAINT clients_status_check CHECK (status IN ('active', 'inactive'));
    END IF;
END $$;

-- ============================================
-- STEP 3: Extend existing products table
-- ============================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);

-- ============================================
-- STEP 4: Extend existing invoices table
-- ============================================
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5, 2) DEFAULT 0.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'fixed';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS terms TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS template_type VARCHAR(50) DEFAULT 'minimalist';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update status constraint
DO $$ 
BEGIN
    ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
    ALTER TABLE invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid'));
END $$;

-- Add unique constraint to invoice_number if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invoices_invoice_number_key'
    ) THEN
        -- Generate invoice numbers for existing invoices
        UPDATE invoices SET invoice_number = 'INV' || LPAD(id::text, 4, '0') WHERE invoice_number IS NULL;
        ALTER TABLE invoices ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);
        ALTER TABLE invoices ALTER COLUMN invoice_number SET NOT NULL;
    END IF;
END $$;

-- ============================================
-- STEP 5: Add total column to invoice_items (if not already computed)
-- ============================================
ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED;

-- The rest of the tables are created by running the full schema.sql on a fresh database
-- For existing databases, we need to check and create only if they don't exist

-- Create function for checking table existence
CREATE OR REPLACE FUNCTION create_table_if_not_exists(table_name text, create_statement text)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name) THEN
        EXECUTE create_statement;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Note: The full schema.sql should be run on a fresh database
-- For migrations, manually run CREATE TABLE IF NOT EXISTS statements from schema.sql
