-- ============================================
-- Enhanced Onboarding Schema Migration
-- Migration: 004_enhanced_onboarding
-- Created: 2025-12-28
-- Purpose: Add JSONB column for comprehensive onboarding data
-- ============================================

-- Add form_data JSONB column to store the complete onboarding form
-- This allows us to store all the rich data from the multi-step form
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}'::jsonb;

-- Create a GIN index on form_data for efficient JSON queries
CREATE INDEX IF NOT EXISTS idx_onboarding_form_data_gin
ON onboarding_submissions USING GIN (form_data);

-- Add index for contact_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_contact_email
ON onboarding_submissions(contact_email);

-- Add index for created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_onboarding_created_at
ON onboarding_submissions(created_at DESC);

-- Add index for composite query (status + created_at)
CREATE INDEX IF NOT EXISTS idx_onboarding_status_created
ON onboarding_submissions(status, created_at DESC);

-- Add source tracking column (to know where the submission came from)
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'onboarding_form';

-- Add IP address for analytics and fraud prevention
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

-- Add user agent for device tracking
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add referral code tracking
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50);

-- Add completion percentage for partial submissions
ALTER TABLE onboarding_submissions
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 100;

-- Comment on the form_data column to document expected structure
COMMENT ON COLUMN onboarding_submissions.form_data IS
'JSONB field containing complete onboarding form data including:
- Business information (companySize, revenueRange, yearsInBusiness, website)
- Goals & challenges (businessGoals, primaryChallenge, timeline)
- Current situation (currentTools, teamSize, budgetRange, additionalContext, referralSource)
- Service preferences (servicesInterested, priorityLevel, specificNeeds)
- Branding & content (brandStyle, colors, logo, aboutBusiness, servicesDescription, uniqueValue, targetAudience)
- Online presence (businessCategory, businessHours, businessDescription, socialMedia)
- Contact preferences (contactName, bestTimeToCall, timezone, communicationPreference, additionalNotes)
- Payment/subscription (selectedPlan, paymentMethod)';

-- Update existing records to migrate additional_info to form_data
-- This is safe to run multiple times (idempotent)
UPDATE onboarding_submissions
SET form_data =
  CASE
    WHEN additional_info IS NOT NULL AND additional_info != ''
    THEN additional_info::jsonb
    ELSE '{}'::jsonb
  END
WHERE form_data = '{}'::jsonb
  AND additional_info IS NOT NULL
  AND additional_info != '';

-- Create a view for easy access to expanded onboarding data
CREATE OR REPLACE VIEW onboarding_submissions_detailed AS
SELECT
  os.id,
  os.user_id,
  os.business_name,
  os.business_type,
  os.business_stage,
  os.goals,
  os.challenges,
  os.contact_email,
  os.contact_phone,
  os.timeline,
  os.budget_range,
  os.status,
  os.source,
  os.referral_code,
  os.completion_percentage,
  os.created_at,
  os.updated_at,
  -- Extract commonly accessed fields from form_data
  os.form_data->>'companySize' as company_size,
  os.form_data->>'revenueRange' as revenue_range,
  os.form_data->>'yearsInBusiness' as years_in_business,
  os.form_data->>'website' as website,
  os.form_data->>'contactName' as contact_name,
  os.form_data->>'priorityLevel' as priority_level,
  os.form_data->'servicesInterested' as services_interested,
  os.form_data->'currentTools' as current_tools,
  os.form_data->>'brandStyle' as brand_style,
  os.form_data->>'primaryColor' as primary_color,
  os.form_data->>'businessCategory' as business_category,
  os.form_data->'socialMedia' as social_media,
  os.form_data->>'selectedPlan' as selected_plan,
  u.name as user_name,
  u.email as user_email
FROM onboarding_submissions os
LEFT JOIN users u ON os.user_id = u.id;

-- Create a function to get onboarding statistics
CREATE OR REPLACE FUNCTION get_onboarding_stats()
RETURNS TABLE(
  total_submissions BIGINT,
  submitted_count BIGINT,
  reviewed_count BIGINT,
  in_progress_count BIGINT,
  completed_count BIGINT,
  avg_completion_pct NUMERIC,
  submissions_this_week BIGINT,
  submissions_this_month BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_submissions,
    COUNT(*) FILTER (WHERE status = 'submitted')::BIGINT as submitted_count,
    COUNT(*) FILTER (WHERE status = 'reviewed')::BIGINT as reviewed_count,
    COUNT(*) FILTER (WHERE status = 'in_progress')::BIGINT as in_progress_count,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_count,
    AVG(completion_percentage)::NUMERIC as avg_completion_pct,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::BIGINT as submissions_this_week,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days')::BIGINT as submissions_this_month
  FROM onboarding_submissions;
END;
$$ LANGUAGE plpgsql;

-- Create a function to search onboarding submissions by JSON fields
CREATE OR REPLACE FUNCTION search_onboarding_by_service(service_name TEXT)
RETURNS TABLE(
  id UUID,
  business_name VARCHAR,
  contact_email VARCHAR,
  services_interested JSONB,
  status VARCHAR,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    os.id,
    os.business_name,
    os.contact_email,
    os.form_data->'servicesInterested' as services_interested,
    os.status::VARCHAR,
    os.created_at
  FROM onboarding_submissions os
  WHERE os.form_data->'servicesInterested' @> to_jsonb(ARRAY[service_name])
  ORDER BY os.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DATA INTEGRITY CHECKS
-- ============================================

-- Add check constraint to ensure valid completion percentage
ALTER TABLE onboarding_submissions
ADD CONSTRAINT check_completion_percentage
CHECK (completion_percentage >= 0 AND completion_percentage <= 100);

-- Add check constraint to ensure contact_email is valid
ALTER TABLE onboarding_submissions
ADD CONSTRAINT check_contact_email_format
CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ============================================
-- PERFORMANCE OPTIMIZATION
-- ============================================

-- Analyze the table to update statistics for query planner
ANALYZE onboarding_submissions;

-- ============================================
-- ROLLBACK PLAN (commented out - use if needed)
-- ============================================

/*
-- To rollback this migration:
DROP VIEW IF EXISTS onboarding_submissions_detailed;
DROP FUNCTION IF EXISTS get_onboarding_stats();
DROP FUNCTION IF EXISTS search_onboarding_by_service(TEXT);
DROP INDEX IF EXISTS idx_onboarding_form_data_gin;
DROP INDEX IF EXISTS idx_onboarding_contact_email;
DROP INDEX IF EXISTS idx_onboarding_created_at;
DROP INDEX IF EXISTS idx_onboarding_status_created;
ALTER TABLE onboarding_submissions DROP CONSTRAINT IF EXISTS check_completion_percentage;
ALTER TABLE onboarding_submissions DROP CONSTRAINT IF EXISTS check_contact_email_format;
ALTER TABLE onboarding_submissions DROP COLUMN IF EXISTS form_data;
ALTER TABLE onboarding_submissions DROP COLUMN IF EXISTS source;
ALTER TABLE onboarding_submissions DROP COLUMN IF EXISTS ip_address;
ALTER TABLE onboarding_submissions DROP COLUMN IF EXISTS user_agent;
ALTER TABLE onboarding_submissions DROP COLUMN IF EXISTS referral_code;
ALTER TABLE onboarding_submissions DROP COLUMN IF EXISTS completion_percentage;
*/

-- ============================================
-- END OF MIGRATION
-- ============================================
