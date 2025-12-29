-- HubSpot Integration Migration
-- Adds columns for HubSpot sync tracking to existing tables

-- Add HubSpot columns to contact_submissions
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS hubspot_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS hubspot_lifecycle_stage VARCHAR(50),
ADD COLUMN IF NOT EXISTS hubspot_lead_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS hubspot_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add unique index on hubspot_id for contact_submissions
CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_submissions_hubspot_id
ON contact_submissions(hubspot_id) WHERE hubspot_id IS NOT NULL;

-- Add HubSpot columns to orders (for deal sync)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS hubspot_deal_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS hubspot_deal_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS hubspot_deal_stage VARCHAR(100),
ADD COLUMN IF NOT EXISTS hubspot_pipeline VARCHAR(100),
ADD COLUMN IF NOT EXISTS hubspot_synced_at TIMESTAMP WITH TIME ZONE;

-- Add unique index on hubspot_deal_id for orders
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_hubspot_deal_id
ON orders(hubspot_deal_id) WHERE hubspot_deal_id IS NOT NULL;

-- Add HubSpot columns to users (for contact association)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS hubspot_contact_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS hubspot_synced_at TIMESTAMP WITH TIME ZONE;

-- Create HubSpot sync log table
CREATE TABLE IF NOT EXISTS hubspot_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'contacts', 'deals', 'companies'
  direction VARCHAR(20) NOT NULL, -- 'push', 'pull', 'both'
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'partial'
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient sync log queries
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_log_entity_status
ON hubspot_sync_log(entity_type, status, synced_at DESC);

-- Add comment for documentation
COMMENT ON TABLE hubspot_sync_log IS 'Tracks HubSpot CRM synchronization operations for audit and debugging';
