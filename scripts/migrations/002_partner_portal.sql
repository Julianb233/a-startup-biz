-- ============================================
-- Partner Portal Database Schema
-- Migration: 002_partner_portal
-- Created: 2025-12-28
-- Description: Partner program tables for referral tracking and commission management
-- ============================================

-- ============================================
-- PARTNERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'suspended', 'inactive'
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- percentage (e.g., 10.00 = 10%)
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  paid_earnings DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  rank VARCHAR(50) DEFAULT 'Bronze', -- 'Bronze', 'Silver', 'Gold', 'Platinum'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for partner lookups
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_created_at ON partners(created_at DESC);

-- ============================================
-- PARTNER LEADS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  service VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'contacted', 'qualified', 'converted', 'lost'
  commission DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_paid BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for lead management
CREATE INDEX IF NOT EXISTS idx_partner_leads_partner_id ON partner_leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_leads_status ON partner_leads(status);
CREATE INDEX IF NOT EXISTS idx_partner_leads_client_email ON partner_leads(client_email);
CREATE INDEX IF NOT EXISTS idx_partner_leads_created_at ON partner_leads(created_at DESC);

-- ============================================
-- PARTNER PROFILES TABLE (Extended settings)
-- ============================================

CREATE TABLE IF NOT EXISTS partner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- Payment Information
  payment_email VARCHAR(255),
  payment_method VARCHAR(50), -- 'stripe', 'paypal', 'bank_transfer'
  bank_account_last4 VARCHAR(4),
  tax_id VARCHAR(50),

  -- Contact Information
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website VARCHAR(500),

  -- Address
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100) DEFAULT 'US',

  -- Preferences
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  monthly_reports BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(partner_id)
);

-- Create index for profile lookups
CREATE INDEX IF NOT EXISTS idx_partner_profiles_partner_id ON partner_profiles(partner_id);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================

-- Partners table trigger
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Partner leads table trigger
DROP TRIGGER IF EXISTS update_partner_leads_updated_at ON partner_leads;
CREATE TRIGGER update_partner_leads_updated_at
    BEFORE UPDATE ON partner_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Partner profiles table trigger
DROP TRIGGER IF EXISTS update_partner_profiles_updated_at ON partner_profiles;
CREATE TRIGGER update_partner_profiles_updated_at
    BEFORE UPDATE ON partner_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTOMATIC STATS UPDATE TRIGGERS
-- ============================================

-- Function to update partner stats when leads change
CREATE OR REPLACE FUNCTION update_partner_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total referrals count
  UPDATE partners
  SET total_referrals = (
    SELECT COUNT(*) FROM partner_leads WHERE partner_id = COALESCE(NEW.partner_id, OLD.partner_id)
  )
  WHERE id = COALESCE(NEW.partner_id, OLD.partner_id);

  -- Update earnings (for converted leads)
  UPDATE partners
  SET
    total_earnings = (
      SELECT COALESCE(SUM(commission), 0)
      FROM partner_leads
      WHERE partner_id = COALESCE(NEW.partner_id, OLD.partner_id)
        AND status = 'converted'
    ),
    paid_earnings = (
      SELECT COALESCE(SUM(commission), 0)
      FROM partner_leads
      WHERE partner_id = COALESCE(NEW.partner_id, OLD.partner_id)
        AND commission_paid = TRUE
    ),
    pending_earnings = (
      SELECT COALESCE(SUM(commission), 0)
      FROM partner_leads
      WHERE partner_id = COALESCE(NEW.partner_id, OLD.partner_id)
        AND status = 'converted'
        AND commission_paid = FALSE
    )
  WHERE id = COALESCE(NEW.partner_id, OLD.partner_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to partner_leads table
DROP TRIGGER IF EXISTS update_partner_stats_trigger ON partner_leads;
CREATE TRIGGER update_partner_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON partner_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_stats();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- This section can be uncommented for local development/testing
-- COMMENT OUT FOR PRODUCTION DEPLOYMENT

/*
-- Create a test partner (requires existing user)
INSERT INTO partners (user_id, company_name, status, commission_rate, rank)
SELECT
  id,
  'Test Marketing Agency',
  'active',
  15.00,
  'Silver'
FROM users
WHERE email = 'partner@example.com'
LIMIT 1
ON CONFLICT (user_id) DO NOTHING;

-- Create test leads for the partner
INSERT INTO partner_leads (partner_id, client_name, client_email, service, status, commission)
SELECT
  p.id,
  'Test Client 1',
  'client1@example.com',
  'Website Development',
  'converted',
  500.00
FROM partners p
WHERE p.company_name = 'Test Marketing Agency'
LIMIT 1
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE 'Partner Portal Migration Complete';
  RAISE NOTICE 'Created tables: partners, partner_leads, partner_profiles';
  RAISE NOTICE 'Created indexes for optimized queries';
  RAISE NOTICE 'Created automatic stats update triggers';
END $$;
