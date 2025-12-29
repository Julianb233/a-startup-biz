-- ============================================
-- Stripe Connect Integration Schema
-- Migration: 006_stripe_connect
-- Purpose: Enable partner payouts via Stripe Connect Express
-- ============================================

-- Add Stripe Connect fields to partners table
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_account_status VARCHAR(50) DEFAULT 'not_connected';
-- Status: 'not_connected', 'pending', 'active', 'restricted', 'disabled'
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN DEFAULT FALSE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_connected_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS available_balance DECIMAL(10,2) DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS pending_balance DECIMAL(10,2) DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS minimum_payout_threshold DECIMAL(10,2) DEFAULT 50.00;

-- Create index for Stripe account lookups
CREATE INDEX IF NOT EXISTS idx_partners_stripe_account ON partners(stripe_account_id);

-- ============================================
-- Partner Transfers Table
-- Tracks commission transfers from platform to connected accounts
-- ============================================
CREATE TABLE IF NOT EXISTS partner_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  partner_lead_id UUID REFERENCES partner_leads(id) ON DELETE SET NULL,

  -- Stripe Transfer details
  stripe_transfer_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',

  -- Status: 'pending', 'processing', 'paid', 'failed', 'reversed'
  status VARCHAR(50) DEFAULT 'pending',

  -- Transfer metadata
  description TEXT,
  transfer_group VARCHAR(255),
  source_type VARCHAR(50) DEFAULT 'commission',

  -- Error handling
  error_code VARCHAR(100),
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_transfers_partner ON partner_transfers(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_transfers_status ON partner_transfers(status);
CREATE INDEX IF NOT EXISTS idx_partner_transfers_stripe ON partner_transfers(stripe_transfer_id);

-- ============================================
-- Partner Payouts Table
-- Tracks bank withdrawals from connected accounts
-- ============================================
CREATE TABLE IF NOT EXISTS partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- Stripe Payout details
  stripe_payout_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',

  -- Status: 'pending', 'in_transit', 'paid', 'failed', 'canceled'
  status VARCHAR(50) DEFAULT 'pending',

  -- Payout details
  arrival_date TIMESTAMP WITH TIME ZONE,
  method VARCHAR(50) DEFAULT 'standard',

  -- Destination info
  destination_type VARCHAR(50),
  destination_last4 VARCHAR(4),

  -- Error handling
  failure_code VARCHAR(100),
  failure_message TEXT,

  -- Request tracking
  requested_by VARCHAR(50) DEFAULT 'manual',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  initiated_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_payouts_partner ON partner_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_status ON partner_payouts(status);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_stripe ON partner_payouts(stripe_payout_id);

-- ============================================
-- Stripe Connect Events Log
-- For webhook idempotency and debugging
-- ============================================
CREATE TABLE IF NOT EXISTS stripe_connect_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  stripe_account_id VARCHAR(255),

  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,

  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_connect_events_account ON stripe_connect_events(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_connect_events_type ON stripe_connect_events(event_type);
CREATE INDEX IF NOT EXISTS idx_connect_events_processed ON stripe_connect_events(processed);

-- ============================================
-- Update Triggers
-- ============================================

-- Create update_updated_at_column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_partner_transfers_updated_at ON partner_transfers;
CREATE TRIGGER update_partner_transfers_updated_at
    BEFORE UPDATE ON partner_transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_payouts_updated_at ON partner_payouts;
CREATE TRIGGER update_partner_payouts_updated_at
    BEFORE UPDATE ON partner_payouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Balance Calculation Function
-- Updates partner balance when transfers/payouts change
-- ============================================
CREATE OR REPLACE FUNCTION update_partner_balance()
RETURNS TRIGGER AS $$
DECLARE
  target_partner_id UUID;
BEGIN
  target_partner_id := COALESCE(NEW.partner_id, OLD.partner_id);

  UPDATE partners
  SET
    available_balance = (
      SELECT COALESCE(SUM(amount), 0)
      FROM partner_transfers
      WHERE partner_id = target_partner_id
        AND status = 'paid'
    ) - (
      SELECT COALESCE(SUM(amount), 0)
      FROM partner_payouts
      WHERE partner_id = target_partner_id
        AND status IN ('paid', 'in_transit', 'pending')
    ),
    pending_balance = (
      SELECT COALESCE(SUM(amount), 0)
      FROM partner_transfers
      WHERE partner_id = target_partner_id
        AND status = 'pending'
    ),
    updated_at = NOW()
  WHERE id = target_partner_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_balance_on_transfer ON partner_transfers;
CREATE TRIGGER update_balance_on_transfer
    AFTER INSERT OR UPDATE OR DELETE ON partner_transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_balance();

DROP TRIGGER IF EXISTS update_balance_on_payout ON partner_payouts;
CREATE TRIGGER update_balance_on_payout
    AFTER INSERT OR UPDATE OR DELETE ON partner_payouts
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_balance();

-- ============================================
-- Verification
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Migration 006_stripe_connect completed successfully';
END $$;
