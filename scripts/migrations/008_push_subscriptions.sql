-- Push Subscriptions table for Web Push notifications
-- Created: 2025-12-29

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Add comment
COMMENT ON TABLE push_subscriptions IS 'Stores Web Push notification subscriptions for users';

-- Enable Row Level Security (optional)
-- ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only manage their own subscriptions
-- CREATE POLICY push_subscriptions_user_policy ON push_subscriptions
--     FOR ALL
--     USING (user_id = current_setting('app.current_user_id')::text);
