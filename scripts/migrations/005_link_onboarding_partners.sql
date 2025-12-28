-- ============================================
-- Link Onboarding to Partners Migration
-- Migration: 005_link_onboarding_partners
-- Created: 2025-12-28
-- Description: Add columns to link onboarding submissions to partner accounts
-- ============================================

-- ============================================
-- ADD PARTNER_ID TO ONBOARDING_SUBMISSIONS
-- ============================================

-- Add partner_id column to track which partner referred this onboarding
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES partners(id) ON DELETE SET NULL;

-- Add index for partner lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_partner_id
ON onboarding_submissions(partner_id) WHERE partner_id IS NOT NULL;

-- Add column to track if onboarding should create a partner account
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS create_partner_account BOOLEAN DEFAULT FALSE;

-- Add column to track if partner account was created from this onboarding
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS partner_account_created BOOLEAN DEFAULT FALSE;

-- Add column to store partner-specific metadata
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS partner_metadata JSONB;

-- ============================================
-- ADD ONBOARDING_ID TO PARTNERS
-- ============================================

-- Add onboarding_submission_id to partners table (optional - for tracking origin)
ALTER TABLE partners
ADD COLUMN IF NOT EXISTS onboarding_submission_id UUID REFERENCES onboarding_submissions(id) ON DELETE SET NULL;

-- Create index for reverse lookup
CREATE INDEX IF NOT EXISTS idx_partners_onboarding_submission_id
ON partners(onboarding_submission_id) WHERE onboarding_submission_id IS NOT NULL;

-- ============================================
-- FUNCTION: AUTO-CREATE PARTNER FROM ONBOARDING
-- ============================================

-- Function to automatically create a partner account from onboarding data
CREATE OR REPLACE FUNCTION create_partner_from_onboarding(
  p_onboarding_id UUID,
  p_commission_rate DECIMAL(5,2) DEFAULT 10.00
)
RETURNS UUID AS $$
DECLARE
  v_onboarding onboarding_submissions%ROWTYPE;
  v_user_id UUID;
  v_partner_id UUID;
  v_company_name VARCHAR(255);
BEGIN
  -- Get onboarding submission
  SELECT * INTO v_onboarding
  FROM onboarding_submissions
  WHERE id = p_onboarding_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Onboarding submission not found: %', p_onboarding_id;
  END IF;

  -- Check if already converted to partner
  IF v_onboarding.partner_account_created THEN
    RAISE EXCEPTION 'Partner account already created for onboarding: %', p_onboarding_id;
  END IF;

  -- Get or create user_id
  v_user_id := v_onboarding.user_id;

  -- If no user_id, try to find user by email or create placeholder
  IF v_user_id IS NULL THEN
    -- Try to find existing user
    SELECT id INTO v_user_id
    FROM users
    WHERE email = v_onboarding.contact_email
    LIMIT 1;

    -- If still no user, we'll need to wait for Clerk user creation
    -- Partner will be created with NULL user_id temporarily
  END IF;

  -- Determine company name
  v_company_name := v_onboarding.business_name;
  IF v_company_name IS NULL OR v_company_name = '' THEN
    v_company_name := v_onboarding.contact_email;
  END IF;

  -- Create partner record
  INSERT INTO partners (
    user_id,
    company_name,
    status,
    commission_rate,
    onboarding_submission_id
  ) VALUES (
    v_user_id,
    v_company_name,
    'pending', -- Start as pending until approved
    p_commission_rate,
    p_onboarding_id
  )
  RETURNING id INTO v_partner_id;

  -- Create default partner profile
  INSERT INTO partner_profiles (
    partner_id,
    contact_name,
    contact_email,
    contact_phone,
    country
  ) VALUES (
    v_partner_id,
    COALESCE(
      (v_onboarding.form_data->>'contactName')::TEXT,
      v_onboarding.contact_email
    ),
    v_onboarding.contact_email,
    v_onboarding.contact_phone,
    'US'
  );

  -- Update onboarding submission
  UPDATE onboarding_submissions
  SET
    partner_id = v_partner_id,
    partner_account_created = TRUE,
    updated_at = NOW()
  WHERE id = p_onboarding_id;

  RETURN v_partner_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: LINK EXISTING PARTNER TO ONBOARDING
-- ============================================

-- Function to link an existing partner to an onboarding submission
CREATE OR REPLACE FUNCTION link_partner_to_onboarding(
  p_partner_id UUID,
  p_onboarding_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Verify partner exists
  SELECT COUNT(*) INTO v_count
  FROM partners
  WHERE id = p_partner_id;

  IF v_count = 0 THEN
    RAISE EXCEPTION 'Partner not found: %', p_partner_id;
  END IF;

  -- Verify onboarding exists
  SELECT COUNT(*) INTO v_count
  FROM onboarding_submissions
  WHERE id = p_onboarding_id;

  IF v_count = 0 THEN
    RAISE EXCEPTION 'Onboarding submission not found: %', p_onboarding_id;
  END IF;

  -- Link partner to onboarding
  UPDATE onboarding_submissions
  SET
    partner_id = p_partner_id,
    updated_at = NOW()
  WHERE id = p_onboarding_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR EASIER QUERYING
-- ============================================

-- View: Partner onboarding details
CREATE OR REPLACE VIEW partner_onboarding_details AS
SELECT
  p.id AS partner_id,
  p.user_id,
  p.company_name,
  p.status AS partner_status,
  p.commission_rate,
  p.total_referrals,
  p.total_earnings,
  p.rank,
  os.id AS onboarding_id,
  os.business_name AS onboarding_business_name,
  os.business_type,
  os.contact_email,
  os.contact_phone,
  os.timeline,
  os.budget_range,
  os.goals,
  os.challenges,
  os.status AS onboarding_status,
  os.created_at AS onboarding_created_at,
  pp.payment_email,
  pp.payment_method,
  pp.website,
  pp.notifications_enabled
FROM partners p
LEFT JOIN onboarding_submissions os ON p.onboarding_submission_id = os.id
LEFT JOIN partner_profiles pp ON p.id = pp.partner_id;

-- View: Onboarding submissions with partner info
CREATE OR REPLACE VIEW onboarding_with_partner_info AS
SELECT
  os.id AS onboarding_id,
  os.business_name,
  os.business_type,
  os.contact_email,
  os.contact_phone,
  os.status AS onboarding_status,
  os.created_at AS onboarding_created_at,
  os.create_partner_account,
  os.partner_account_created,
  p.id AS partner_id,
  p.company_name AS partner_company_name,
  p.status AS partner_status,
  p.commission_rate,
  p.total_referrals,
  p.total_earnings
FROM onboarding_submissions os
LEFT JOIN partners p ON os.partner_id = p.id;

-- ============================================
-- EXAMPLE USAGE
-- ============================================

-- Example 1: Create partner from onboarding
-- SELECT create_partner_from_onboarding(
--   p_onboarding_id := 'your-onboarding-uuid',
--   p_commission_rate := 15.00
-- );

-- Example 2: Link existing partner to onboarding
-- SELECT link_partner_to_onboarding(
--   p_partner_id := 'your-partner-uuid',
--   p_onboarding_id := 'your-onboarding-uuid'
-- );

-- Example 3: Query partner onboarding details
-- SELECT * FROM partner_onboarding_details WHERE partner_id = 'your-partner-uuid';

-- Example 4: Query onboarding with partner info
-- SELECT * FROM onboarding_with_partner_info WHERE onboarding_id = 'your-onboarding-uuid';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '===============================================';
  RAISE NOTICE 'Onboarding-Partner Link Migration Complete';
  RAISE NOTICE '===============================================';
  RAISE NOTICE 'Added columns:';
  RAISE NOTICE '  - onboarding_submissions.partner_id';
  RAISE NOTICE '  - onboarding_submissions.create_partner_account';
  RAISE NOTICE '  - onboarding_submissions.partner_account_created';
  RAISE NOTICE '  - onboarding_submissions.partner_metadata';
  RAISE NOTICE '  - partners.onboarding_submission_id';
  RAISE NOTICE '';
  RAISE NOTICE 'Created functions:';
  RAISE NOTICE '  - create_partner_from_onboarding()';
  RAISE NOTICE '  - link_partner_to_onboarding()';
  RAISE NOTICE '';
  RAISE NOTICE 'Created views:';
  RAISE NOTICE '  - partner_onboarding_details';
  RAISE NOTICE '  - onboarding_with_partner_info';
  RAISE NOTICE '===============================================';
END $$;
