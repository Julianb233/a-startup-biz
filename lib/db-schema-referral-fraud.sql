-- ============================================
-- REFERRAL FRAUD DETECTION - DATABASE SCHEMA
-- ============================================
-- Purpose: Track fraud detection signals and patterns
-- Integrates with referral system for security monitoring
-- ============================================

-- ============================================
-- FRAUD_LOGS TABLE
-- ============================================
-- Comprehensive fraud detection logging
CREATE TABLE IF NOT EXISTS referral_fraud_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to referral (if exists)
  referral_id UUID NULL REFERENCES referrals(id) ON DELETE SET NULL,
  referral_code VARCHAR(50) NULL,

  -- Detection details
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  action VARCHAR(20) NOT NULL CHECK (action IN ('allow', 'monitor', 'review', 'block')),

  -- User/Request details
  referred_email VARCHAR(255) NULL,
  referrer_id VARCHAR(255) NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,

  -- Fraud signals (JSONB array)
  signals JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Additional metadata
  metadata JSONB NULL,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- FRAUD_PATTERNS TABLE
-- ============================================
-- Track known fraud patterns for learning
CREATE TABLE IF NOT EXISTS referral_fraud_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Pattern identification
  pattern_type VARCHAR(50) NOT NULL, -- 'ip_abuse', 'email_pattern', etc.
  pattern_value TEXT NOT NULL, -- IP address, email domain, etc.

  -- Detection stats
  times_detected INTEGER NOT NULL DEFAULT 1,
  first_detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_detected_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Risk assessment
  confirmed_fraud BOOLEAN NULL, -- NULL = unconfirmed, TRUE = confirmed fraud, FALSE = false positive
  manual_review_notes TEXT NULL,

  -- Status
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  blocked_at TIMESTAMP NULL,
  blocked_by VARCHAR(255) NULL,

  -- Metadata
  metadata JSONB NULL,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Fraud logs indexes
CREATE INDEX IF NOT EXISTS idx_fraud_logs_referral_id ON referral_fraud_logs(referral_id);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_referral_code ON referral_fraud_logs(referral_code);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_action ON referral_fraud_logs(action);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_risk_score ON referral_fraud_logs(risk_score);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_ip_address ON referral_fraud_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_created_at ON referral_fraud_logs(created_at);

-- Fraud patterns indexes
CREATE INDEX IF NOT EXISTS idx_fraud_patterns_type ON referral_fraud_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_fraud_patterns_value ON referral_fraud_patterns(pattern_value);
CREATE INDEX IF NOT EXISTS idx_fraud_patterns_blocked ON referral_fraud_patterns(is_blocked);
CREATE INDEX IF NOT EXISTS idx_fraud_patterns_confirmed ON referral_fraud_patterns(confirmed_fraud);

-- Compound indexes for common queries
CREATE INDEX IF NOT EXISTS idx_fraud_patterns_type_value ON referral_fraud_patterns(pattern_type, pattern_value);

-- Unique constraint to prevent duplicate patterns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_fraud_pattern'
  ) THEN
    ALTER TABLE referral_fraud_patterns ADD CONSTRAINT unique_fraud_pattern UNIQUE(pattern_type, pattern_value);
  END IF;
END $$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE TRIGGER update_fraud_patterns_updated_at
  BEFORE UPDATE ON referral_fraud_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- High-risk referrals requiring review
CREATE OR REPLACE VIEW high_risk_referrals AS
SELECT
  r.id,
  r.referral_code,
  r.referrer_email,
  r.referred_email,
  r.status,
  CAST(r.metadata->'fraud_detection'->>'risk_score' AS INTEGER) as risk_score,
  r.metadata->'fraud_detection'->>'action' as fraud_action,
  r.created_at,
  r.conversion_date,
  r.commission_amount
FROM referrals r
WHERE r.metadata->'fraud_detection' IS NOT NULL
  AND CAST(r.metadata->'fraud_detection'->>'risk_score' AS INTEGER) >= 61
ORDER BY CAST(r.metadata->'fraud_detection'->>'risk_score' AS INTEGER) DESC, r.created_at DESC;

-- Fraud statistics by referrer
CREATE OR REPLACE VIEW referrer_fraud_stats AS
SELECT
  r.referrer_id,
  r.referrer_email,
  COUNT(*) as total_referrals,
  COUNT(*) FILTER (
    WHERE r.metadata->'fraud_detection' IS NOT NULL
  ) as flagged_referrals,
  COUNT(*) FILTER (
    WHERE r.metadata->'fraud_detection'->>'action' = 'block'
  ) as blocked_referrals,
  AVG(
    CAST(r.metadata->'fraud_detection'->>'risk_score' AS NUMERIC)
  ) FILTER (
    WHERE r.metadata->'fraud_detection' IS NOT NULL
  ) as avg_risk_score,
  MAX(
    CAST(r.metadata->'fraud_detection'->>'risk_score' AS NUMERIC)
  ) FILTER (
    WHERE r.metadata->'fraud_detection' IS NOT NULL
  ) as max_risk_score
FROM referrals r
GROUP BY r.referrer_id, r.referrer_email
HAVING COUNT(*) FILTER (
  WHERE r.metadata->'fraud_detection' IS NOT NULL
) > 0
ORDER BY avg_risk_score DESC;

-- Daily fraud detection summary
CREATE OR REPLACE VIEW fraud_detection_daily_summary AS
SELECT
  DATE(created_at) as detection_date,
  action,
  COUNT(*) as count,
  AVG(risk_score) as avg_risk_score,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT referred_email) as unique_emails
FROM referral_fraud_logs
GROUP BY DATE(created_at), action
ORDER BY detection_date DESC, action;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Mark a fraud pattern as confirmed fraud
CREATE OR REPLACE FUNCTION confirm_fraud_pattern(
  p_pattern_type VARCHAR(50),
  p_pattern_value TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update or insert pattern
  INSERT INTO referral_fraud_patterns (
    pattern_type,
    pattern_value,
    confirmed_fraud,
    manual_review_notes,
    is_blocked,
    blocked_at,
    times_detected
  )
  VALUES (
    p_pattern_type,
    p_pattern_value,
    TRUE,
    p_notes,
    TRUE,
    NOW(),
    1
  )
  ON CONFLICT (pattern_type, pattern_value)
  DO UPDATE SET
    confirmed_fraud = TRUE,
    manual_review_notes = COALESCE(p_notes, referral_fraud_patterns.manual_review_notes),
    is_blocked = TRUE,
    blocked_at = NOW(),
    times_detected = referral_fraud_patterns.times_detected + 1,
    last_detected_at = NOW();

  -- Invalidate all referrals matching this pattern
  IF p_pattern_type = 'ip_abuse' THEN
    UPDATE referrals
    SET status = 'invalid',
        notes = COALESCE(notes || '\n', '') || 'Blocked due to confirmed fraud pattern: IP ' || p_pattern_value
    WHERE ip_address = p_pattern_value
      AND status NOT IN ('paid_out', 'invalid');
  ELSIF p_pattern_type = 'email_pattern' THEN
    UPDATE referrals
    SET status = 'invalid',
        notes = COALESCE(notes || '\n', '') || 'Blocked due to confirmed fraud pattern: Email ' || p_pattern_value
    WHERE referred_email LIKE '%' || p_pattern_value || '%'
      AND status NOT IN ('paid_out', 'invalid');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Mark a fraud pattern as false positive
CREATE OR REPLACE FUNCTION mark_false_positive(
  p_pattern_type VARCHAR(50),
  p_pattern_value TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE referral_fraud_patterns
  SET
    confirmed_fraud = FALSE,
    manual_review_notes = COALESCE(p_notes, manual_review_notes),
    is_blocked = FALSE,
    updated_at = NOW()
  WHERE pattern_type = p_pattern_type
    AND pattern_value = p_pattern_value;
END;
$$ LANGUAGE plpgsql;

-- Get fraud risk for an IP address
CREATE OR REPLACE FUNCTION get_ip_fraud_risk(p_ip_address VARCHAR(45))
RETURNS TABLE (
  is_blocked BOOLEAN,
  times_detected INTEGER,
  last_detected TIMESTAMP,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fp.is_blocked,
    fp.times_detected,
    fp.last_detected_at,
    fp.manual_review_notes
  FROM referral_fraud_patterns fp
  WHERE fp.pattern_type = 'ip_abuse'
    AND fp.pattern_value = p_ip_address
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE referral_fraud_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_fraud_patterns ENABLE ROW LEVEL SECURITY;

-- Only admins can view fraud logs
-- CREATE POLICY fraud_logs_admin_only ON referral_fraud_logs
--   FOR ALL
--   USING (current_setting('request.jwt.claim.role', true) = 'admin');

-- CREATE POLICY fraud_patterns_admin_only ON referral_fraud_patterns
--   FOR ALL
--   USING (current_setting('request.jwt.claim.role', true) = 'admin');

-- ============================================
-- SAMPLE USAGE
-- ============================================

-- Query high-risk referrals
-- SELECT * FROM high_risk_referrals LIMIT 10;

-- Query fraud stats by referrer
-- SELECT * FROM referrer_fraud_stats LIMIT 10;

-- Mark IP as confirmed fraud
-- SELECT confirm_fraud_pattern('ip_abuse', '192.168.1.100', 'Confirmed bot activity');

-- Mark email domain as false positive
-- SELECT mark_false_positive('suspicious_domain', 'example.com', 'Legitimate corporate domain');

-- Check if IP is blocked
-- SELECT * FROM get_ip_fraud_risk('192.168.1.100');

-- ============================================
-- MIGRATION NOTES
-- ============================================
-- 1. Run this schema after the main referral schema
-- 2. Ensure the referrals table exists first
-- 3. Admin role policies are commented out - configure based on your auth setup
-- 4. Consider adding unique constraints on fraud_patterns if needed:
--    ALTER TABLE referral_fraud_patterns ADD CONSTRAINT unique_pattern UNIQUE(pattern_type, pattern_value);
-- ============================================
