-- Migration 009: Notification Preferences
-- Allows users to customize their notification settings

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- In-app notification preferences
  in_app_lead_converted BOOLEAN DEFAULT TRUE,
  in_app_lead_qualified BOOLEAN DEFAULT TRUE,
  in_app_payout_completed BOOLEAN DEFAULT TRUE,
  in_app_payout_failed BOOLEAN DEFAULT TRUE,
  in_app_account_updates BOOLEAN DEFAULT TRUE,

  -- Email notification preferences
  email_lead_converted BOOLEAN DEFAULT TRUE,
  email_lead_qualified BOOLEAN DEFAULT FALSE,
  email_payout_completed BOOLEAN DEFAULT TRUE,
  email_payout_failed BOOLEAN DEFAULT TRUE,
  email_account_updates BOOLEAN DEFAULT TRUE,

  -- Digest preferences
  email_weekly_digest BOOLEAN DEFAULT TRUE,
  digest_day VARCHAR(10) DEFAULT 'monday', -- monday, tuesday, etc.
  digest_time TIME DEFAULT '09:00:00',

  -- Global settings
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON notification_preferences(user_id);

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create preferences for new users
DROP TRIGGER IF EXISTS trigger_create_notification_prefs ON users;
CREATE TRIGGER trigger_create_notification_prefs
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_prefs();

-- Function to check if user wants notification (used by other triggers)
CREATE OR REPLACE FUNCTION should_send_notification(
  p_user_id UUID,
  p_notification_type VARCHAR,
  p_channel VARCHAR -- 'in_app' or 'email'
) RETURNS BOOLEAN AS $$
DECLARE
  prefs notification_preferences%ROWTYPE;
  should_send BOOLEAN := TRUE;
BEGIN
  SELECT * INTO prefs FROM notification_preferences WHERE user_id = p_user_id;

  -- If no preferences, default to sending
  IF NOT FOUND THEN
    RETURN TRUE;
  END IF;

  -- Check global settings
  IF NOT prefs.notifications_enabled THEN
    RETURN FALSE;
  END IF;

  IF p_channel = 'email' AND NOT prefs.email_enabled THEN
    RETURN FALSE;
  END IF;

  -- Check specific notification type
  IF p_channel = 'in_app' THEN
    CASE p_notification_type
      WHEN 'lead_converted' THEN should_send := prefs.in_app_lead_converted;
      WHEN 'lead_qualified' THEN should_send := prefs.in_app_lead_qualified;
      WHEN 'payout_completed' THEN should_send := prefs.in_app_payout_completed;
      WHEN 'payout_failed' THEN should_send := prefs.in_app_payout_failed;
      WHEN 'account_approved', 'account_suspended' THEN should_send := prefs.in_app_account_updates;
      ELSE should_send := TRUE;
    END CASE;
  ELSIF p_channel = 'email' THEN
    CASE p_notification_type
      WHEN 'lead_converted' THEN should_send := prefs.email_lead_converted;
      WHEN 'lead_qualified' THEN should_send := prefs.email_lead_qualified;
      WHEN 'payout_completed' THEN should_send := prefs.email_payout_completed;
      WHEN 'payout_failed' THEN should_send := prefs.email_payout_failed;
      WHEN 'account_approved', 'account_suspended' THEN should_send := prefs.email_account_updates;
      ELSE should_send := TRUE;
    END CASE;
  END IF;

  RETURN should_send;
END;
$$ LANGUAGE plpgsql;

-- Add email_sent tracking to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_error TEXT;

-- Comments
COMMENT ON TABLE notification_preferences IS 'User preferences for notification delivery channels and types';
COMMENT ON FUNCTION should_send_notification IS 'Helper function to check if a notification should be sent based on user preferences';
