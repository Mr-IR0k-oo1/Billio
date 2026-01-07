-- Database Schema for Billio - Complete Invoice Management System
-- Version 2.0 - Full Feature Set

-- ============================================
-- CORE TABLES (Extended)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    profile_image VARCHAR(500),
    timezone VARCHAR(100) DEFAULT 'UTC',
    date_format VARCHAR(50) DEFAULT 'MM/DD/YYYY',
    currency_default VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    tax_id VARCHAR(100),
    payment_terms INTEGER DEFAULT 30,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_contacts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    sku VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid')),
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    discount_type VARCHAR(20) DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
    total DECIMAL(10, 2) DEFAULT 0.00,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    terms TEXT,
    template_type VARCHAR(50) DEFAULT 'minimalist' CHECK (template_type IN ('minimalist', 'professional', 'creative')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE TABLE IF NOT EXISTS invoice_history (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    changes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ESTIMATES/QUOTES
-- ============================================

CREATE TABLE IF NOT EXISTS estimates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    estimate_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired', 'converted')),
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    discount_type VARCHAR(20) DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
    total DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    terms TEXT,
    converted_to_invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estimate_items (
    id SERIAL PRIMARY KEY,
    estimate_id INTEGER REFERENCES estimates(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'check', 'bank_transfer', 'credit_card', 'paypal', 'stripe', 'other')),
    reference_number VARCHAR(255),
    notes TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- RECURRING INVOICES
-- ============================================

CREATE TABLE IF NOT EXISTS recurring_invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    template_name VARCHAR(255),
    frequency VARCHAR(50) CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    next_generation_date DATE,
    last_generated_date DATE,
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    discount_type VARCHAR(20) DEFAULT 'fixed',
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    terms TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    auto_send BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recurring_invoice_items (
    id SERIAL PRIMARY KEY,
    recurring_invoice_id INTEGER REFERENCES recurring_invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- ============================================
-- COMPANY SETTINGS
-- ============================================

CREATE TABLE IF NOT EXISTS company_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    company_name VARCHAR(255),
    company_email VARCHAR(255),
    company_phone VARCHAR(50),
    company_address TEXT,
    company_website VARCHAR(255),
    tax_id VARCHAR(100),
    logo_url VARCHAR(500),
    invoice_prefix VARCHAR(20) DEFAULT 'INV',
    invoice_starting_number INTEGER DEFAULT 1000,
    estimate_prefix VARCHAR(20) DEFAULT 'EST',
    estimate_starting_number INTEGER DEFAULT 1000,
    default_payment_terms INTEGER DEFAULT 30,
    default_tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    default_currency VARCHAR(3) DEFAULT 'USD',
    default_notes TEXT,
    default_terms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EMAIL & NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS emails (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    estimate_id INTEGER REFERENCES estimates(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('invoice', 'estimate', 'reminder', 'payment_received', 'verification', 'password_reset')),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'failed'))
);

CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('invoice', 'estimate', 'reminder', 'payment_received')),
    subject VARCHAR(500),
    body TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('invoice_overdue', 'payment_received', 'estimate_accepted', 'estimate_expired', 'system')),
    title VARCHAR(255),
    message TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ACTIVITY LOG
-- ============================================

CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) CHECK (entity_type IN ('invoice', 'estimate', 'client', 'product', 'payment', 'user', 'settings')),
    entity_id INTEGER,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

CREATE INDEX IF NOT EXISTS idx_estimates_user_id ON estimates(user_id);
CREATE INDEX IF NOT EXISTS idx_estimates_client_id ON estimates(client_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update invoice updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Demo user (password: demo123)
-- Note: Generate proper bcrypt hash via the registration endpoint
INSERT INTO users (email, password_hash, email_verified, company_name)
VALUES ('demo@example.com', '$2a$10$YourProperBcryptHashHere', TRUE, 'Demo Company')
ON CONFLICT (email) DO NOTHING;

-- Demo clients
INSERT INTO clients (user_id, name, email, address, phone, payment_terms)
SELECT id, 'Acme Corp', 'contact@acme.com', '123 Industrial Way, Looney Tunes, CA', '+1-555-0100', 30
FROM users WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO clients (user_id, name, email, address, phone, payment_terms)
SELECT id, 'Globex Corporation', 'hank@globex.com', '456 Cypress Creek, Springfield', '+1-555-0200', 15
FROM users WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO clients (user_id, name, email, address, phone, payment_terms)
SELECT id, 'Soylent Corp', 'people@soylent.green', '2022 Future St, NYC', '+1-555-0300', 45
FROM users WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;

-- Demo products
INSERT INTO products (user_id, name, unit_price, description, category)
SELECT id, 'Web Design', 1500.00, 'Full website design and mockup', 'Design'
FROM users WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO products (user_id, name, unit_price, description, category)
SELECT id, 'SEO Optimization', 500.00, 'Monthly SEO maintenance', 'Marketing'
FROM users WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO products (user_id, name, unit_price, description, category)
SELECT id, 'Consulting', 200.00, 'Hourly consulting rate', 'Consulting'
FROM users WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;

-- Demo company settings
INSERT INTO company_settings (user_id, company_name, company_email, invoice_prefix, estimate_prefix, default_payment_terms, default_tax_rate)
SELECT 
    id, 
    'Demo Company', 
    'demo@example.com', 
    'INV', 
    'EST', 
    30, 
    8.5
FROM users WHERE email = 'demo@example.com'
ON CONFLICT (user_id) DO NOTHING;
