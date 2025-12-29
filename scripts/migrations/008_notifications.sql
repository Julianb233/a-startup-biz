-- Migration 008: Notification System
-- Creates notification system for partner portal

-- Run this migration against your Neon database
-- This creates the notifications table and automated triggers

\echo 'Running migration 008: Notification System...'

-- Partner Portal Notification System
-- Tracks notifications for partners about leads, payouts, and account changes

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(100) NOT NULL, -- 'lead_converted', 'payout_completed', 'payout_failed', 'account_approved', 'account_suspended', 'referral_signup', 'lead_qualified', 'commission_earned'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}', -- Additional metadata (lead_id, amount, etc.)
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Function to automatically create notification on lead conversion
CREATE OR REPLACE FUNCTION notify_partner_on_lead_conversion()
RETURNS TRIGGER AS $$
DECLARE
  partner_user_id UUID;
  commission_amount DECIMAL;
BEGIN
  -- Only trigger when status changes to 'converted'
  IF NEW.status = 'converted' AND (OLD.status IS NULL OR OLD.status != 'converted') THEN
    -- Get the partner's user_id
    SELECT user_id INTO partner_user_id
    FROM partners
    WHERE id = NEW.partner_id;

    IF partner_user_id IS NOT NULL THEN
      -- Create notification
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data
      ) VALUES (
        partner_user_id,
        'lead_converted',
        'Lead Converted!',
        format('Your lead %s has converted! Commission earned: $%s', NEW.client_name, NEW.commission),
        jsonb_build_object(
          'lead_id', NEW.id,
          'client_name', NEW.client_name,
          'commission', NEW.commission,
          'service', NEW.service,
          'converted_at', NEW.converted_at
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for lead conversion notifications
DROP TRIGGER IF EXISTS trigger_notify_lead_conversion ON partner_leads;
CREATE TRIGGER trigger_notify_lead_conversion
  AFTER UPDATE ON partner_leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_on_lead_conversion();

-- Function to notify partner when payout completes
CREATE OR REPLACE FUNCTION notify_partner_on_payout()
RETURNS TRIGGER AS $$
DECLARE
  partner_user_id UUID;
BEGIN
  -- Get the partner's user_id
  SELECT user_id INTO partner_user_id
  FROM partners
  WHERE id = NEW.partner_id;

  IF partner_user_id IS NOT NULL THEN
    -- Notify on payout completion
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data
      ) VALUES (
        partner_user_id,
        'payout_completed',
        'Payout Completed',
        format('Your payout of $%s has been processed successfully', NEW.amount),
        jsonb_build_object(
          'payout_id', NEW.id,
          'amount', NEW.amount,
          'method', NEW.method,
          'arrival_date', NEW.arrival_date,
          'paid_at', NEW.paid_at
        )
      );
    -- Notify on payout failure
    ELSIF NEW.status = 'failed' AND (OLD.status IS NULL OR OLD.status != 'failed') THEN
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data
      ) VALUES (
        partner_user_id,
        'payout_failed',
        'Payout Failed',
        format('Your payout of $%s failed. Reason: %s', NEW.amount, COALESCE(NEW.failure_message, 'Unknown error')),
        jsonb_build_object(
          'payout_id', NEW.id,
          'amount', NEW.amount,
          'failure_code', NEW.failure_code,
          'failure_message', NEW.failure_message
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for payout notifications
DROP TRIGGER IF EXISTS trigger_notify_payout ON partner_payouts;
CREATE TRIGGER trigger_notify_payout
  AFTER INSERT OR UPDATE ON partner_payouts
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_on_payout();

-- Function to notify partner on account status change
CREATE OR REPLACE FUNCTION notify_partner_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
  partner_user_id UUID;
BEGIN
  partner_user_id := NEW.user_id;

  IF partner_user_id IS NOT NULL THEN
    -- Notify when account approved
    IF NEW.status = 'active' AND OLD.status = 'pending' THEN
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data
      ) VALUES (
        partner_user_id,
        'account_approved',
        'Partner Account Approved!',
        format('Congratulations! Your partner account for %s has been approved. You can now start referring clients.', NEW.company_name),
        jsonb_build_object(
          'partner_id', NEW.id,
          'commission_rate', NEW.commission_rate,
          'approved_at', NOW()
        )
      );
    -- Notify when account suspended
    ELSIF NEW.status = 'suspended' AND OLD.status != 'suspended' THEN
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data
      ) VALUES (
        partner_user_id,
        'account_suspended',
        'Account Suspended',
        'Your partner account has been suspended. Please contact support for more information.',
        jsonb_build_object(
          'partner_id', NEW.id,
          'suspended_at', NOW()
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for partner status change notifications
DROP TRIGGER IF EXISTS trigger_notify_partner_status ON partners;
CREATE TRIGGER trigger_notify_partner_status
  AFTER UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_on_status_change();

-- Function to clean up old read notifications (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete read notifications older than 90 days
  DELETE FROM notifications
  WHERE read = true
    AND read_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE notifications IS 'Stores notifications for partner portal users about leads, payouts, and account changes';
COMMENT ON COLUMN notifications.type IS 'Notification type: lead_converted, payout_completed, payout_failed, account_approved, account_suspended, referral_signup, lead_qualified, commission_earned';
COMMENT ON COLUMN notifications.data IS 'JSONB field storing additional metadata like lead_id, commission amount, payout details, etc.';
COMMENT ON FUNCTION cleanup_old_notifications() IS 'Maintenance function to delete read notifications older than 90 days';

\echo 'Migration 008 completed successfully!'
\echo 'Notifications table created with automated triggers for:'
\echo '  - Lead conversions'
\echo '  - Payout completions/failures'
\echo '  - Partner account status changes'
