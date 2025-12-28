-- ============================================
-- REFERRAL TRACKING SYSTEM - DATABASE SCHEMA
-- ============================================
-- Purpose: Track referrals, conversions, and commissions
-- Commission Rules:
--   - 10% of first purchase OR $25 flat (whichever is higher)
--   - Minimum conversion value: $100
--   - Payout threshold: $50 minimum before withdrawal
--   - 30-day cookie window for tracking
-- ============================================

-- Drop existing tables if they exist (for development only)
-- DROP TABLE IF EXISTS referral_payouts CASCADE;
-- DROP TABLE IF EXISTS referrals CASCADE;

-- ============================================
-- REFERRALS TABLE
-- ============================================
-- Tracks all referral relationships and their status
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Referrer information
  referrer_id VARCHAR(255) NOT NULL,  -- User ID who owns the referral code
  referrer_email VARCHAR(255) NOT NULL,

  -- Referred user information
  referred_email VARCHAR(255) NOT NULL,
  referred_user_id VARCHAR(255) NULL,  -- Set when referred user signs up

  -- Referral tracking
  referral_code VARCHAR(50) NOT NULL UNIQUE,

  -- Status tracking
  -- 'pending': Code created but not used
  -- 'signed_up': Referred user created account
  -- 'converted': Referred user made qualifying purchase
  -- 'paid_out': Commission has been paid
  -- 'expired': Referral expired (30-day window passed)
  -- 'invalid': Referral invalidated (fraud, refund, etc.)
  status VARCHAR(50) NOT NULL DEFAULT 'pending',

  -- Conversion tracking
  conversion_date TIMESTAMP NULL,  -- When referred user made first purchase
  conversion_value DECIMAL(10, 2) NULL,  -- Value of first qualifying purchase
  commission_amount DECIMAL(10, 2) NULL,  -- Commission earned (calculated)

  -- Cookie and tracking
  cookie_expiry TIMESTAMP NULL,  -- 30-day window from initial visit
  first_visit_at TIMESTAMP NULL,  -- When referred user first visited
  signup_date TIMESTAMP NULL,  -- When referred user signed up

  -- Metadata
  utm_source VARCHAR(255) NULL,
  utm_medium VARCHAR(255) NULL,
  utm_campaign VARCHAR(255) NULL,
  ip_address VARCHAR(45) NULL,  -- IPv6 support
  user_agent TEXT NULL,
  referrer_url TEXT NULL,

  -- Additional tracking
  notes TEXT NULL,
  metadata JSONB NULL,  -- Flexible storage for additional data

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NULL  -- Auto-set to created_at + 30 days
);

-- ============================================
-- REFERRAL_PAYOUTS TABLE
-- ============================================
-- Tracks commission payouts to referrers
CREATE TABLE IF NOT EXISTS referral_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Referral relationship
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  referrer_id VARCHAR(255) NOT NULL,  -- Denormalized for easier queries

  -- Payout details
  amount DECIMAL(10, 2) NOT NULL,  -- Commission amount

  -- Payment status
  -- 'pending': Commission earned, waiting to reach threshold
  -- 'processing': Payment being processed
  -- 'paid': Successfully paid out
  -- 'failed': Payment failed
  -- 'cancelled': Payout cancelled (refund, fraud, etc.)
  status VARCHAR(50) NOT NULL DEFAULT 'pending',

  -- Payment method and details
  payment_method VARCHAR(50) NULL,  -- 'stripe', 'paypal', 'bank_transfer', etc.
  payment_reference VARCHAR(255) NULL,  -- External payment ID
  payment_details JSONB NULL,  -- Flexible storage for payment info

  -- Payout tracking
  paid_at TIMESTAMP NULL,
  failed_at TIMESTAMP NULL,
  failure_reason TEXT NULL,

  -- Metadata
  notes TEXT NULL,
  metadata JSONB NULL,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Referrals indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_email ON referrals(referred_email);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_conversion_date ON referrals(conversion_date);
CREATE INDEX IF NOT EXISTS idx_referrals_expires_at ON referrals(expires_at);

-- Compound indexes for common queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status ON referrals(referrer_id, status);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_status ON referrals(referred_email, status);

-- Payouts indexes
CREATE INDEX IF NOT EXISTS idx_payouts_referral_id ON referral_payouts(referral_id);
CREATE INDEX IF NOT EXISTS idx_payouts_referrer_id ON referral_payouts(referrer_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON referral_payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_paid_at ON referral_payouts(paid_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_payouts ENABLE ROW LEVEL SECURITY;

-- Referrals policies
-- Users can view their own referrals (as referrer)
CREATE POLICY referrals_select_own ON referrals
  FOR SELECT
  USING (referrer_id = current_setting('request.jwt.claim.sub', true));

-- Users can insert referrals for themselves
CREATE POLICY referrals_insert_own ON referrals
  FOR INSERT
  WITH CHECK (referrer_id = current_setting('request.jwt.claim.sub', true));

-- Users can update their own referrals (limited fields)
CREATE POLICY referrals_update_own ON referrals
  FOR UPDATE
  USING (referrer_id = current_setting('request.jwt.claim.sub', true));

-- Payouts policies
-- Users can view their own payouts
CREATE POLICY payouts_select_own ON referral_payouts
  FOR SELECT
  USING (referrer_id = current_setting('request.jwt.claim.sub', true));

-- Admin policies (if you have admin role)
-- CREATE POLICY referrals_admin_all ON referrals
--   FOR ALL
--   USING (current_setting('request.jwt.claim.role', true) = 'admin');

-- CREATE POLICY payouts_admin_all ON referral_payouts
--   FOR ALL
--   USING (current_setting('request.jwt.claim.role', true) = 'admin');

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at
  BEFORE UPDATE ON referral_payouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-set expiry date (30 days from creation)
CREATE OR REPLACE FUNCTION set_referral_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at = NEW.created_at + INTERVAL '30 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referrals_expiry
  BEFORE INSERT ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_expiry();

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- Active referrals with pending commissions
CREATE OR REPLACE VIEW active_referrals AS
SELECT
  r.id,
  r.referrer_id,
  r.referrer_email,
  r.referred_email,
  r.referral_code,
  r.status,
  r.commission_amount,
  r.conversion_date,
  r.created_at
FROM referrals r
WHERE r.status IN ('signed_up', 'converted')
  AND r.expires_at > NOW()
ORDER BY r.created_at DESC;

-- Referrer statistics view
CREATE OR REPLACE VIEW referrer_stats AS
SELECT
  r.referrer_id,
  r.referrer_email,
  COUNT(*) AS total_referrals,
  COUNT(*) FILTER (WHERE r.status = 'signed_up') AS signups,
  COUNT(*) FILTER (WHERE r.status = 'converted') AS conversions,
  SUM(r.commission_amount) FILTER (WHERE r.status = 'converted') AS total_commissions,
  SUM(CASE
    WHEN p.status = 'paid' THEN p.amount
    ELSE 0
  END) AS paid_commissions,
  SUM(CASE
    WHEN p.status = 'pending' THEN p.amount
    ELSE 0
  END) AS pending_commissions
FROM referrals r
LEFT JOIN referral_payouts p ON r.id = p.referral_id
GROUP BY r.referrer_id, r.referrer_email;

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Uncomment to insert sample data
-- INSERT INTO referrals (referrer_id, referrer_email, referred_email, referral_code, status)
-- VALUES
--   ('user_123', 'referrer@example.com', 'referred1@example.com', 'REF-123-ABC123', 'signed_up'),
--   ('user_123', 'referrer@example.com', 'referred2@example.com', 'REF-123-DEF456', 'converted');

-- ============================================
-- MIGRATION NOTES
-- ============================================
-- 1. Run this schema in your Supabase SQL editor
-- 2. Verify tables and indexes are created
-- 3. Test RLS policies with different user contexts
-- 4. Adjust policies based on your authentication setup
-- 5. Consider adding additional indexes based on query patterns
-- ============================================
