-- A Startup Biz: Missing Tables Migration
-- Date: 2025-12-28
-- Adds quote_line_items, quote_activities, and availability_configs tables

-- ============================================================================
-- QUOTE LINE ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS quote_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category VARCHAR(100),
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quote_line_items_quote_id ON quote_line_items(quote_id);
CREATE INDEX idx_quote_line_items_sort_order ON quote_line_items(quote_id, sort_order);
CREATE INDEX idx_quote_line_items_category ON quote_line_items(category);

-- ============================================================================
-- QUOTE ACTIVITIES TABLE (Audit Trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS quote_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
    'created',
    'updated',
    'sent',
    'viewed',
    'accepted',
    'rejected',
    'expired',
    'pdf_generated',
    'email_sent',
    'reminder_sent'
  )),
  description TEXT,
  performed_by VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quote_activities_quote_id ON quote_activities(quote_id);
CREATE INDEX idx_quote_activities_type ON quote_activities(activity_type);
CREATE INDEX idx_quote_activities_created ON quote_activities(created_at DESC);
CREATE INDEX idx_quote_activities_performed_by ON quote_activities(performed_by);

-- ============================================================================
-- AVAILABILITY CONFIGS TABLE (Calendar Configuration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS availability_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  working_hours JSONB NOT NULL,
  slot_duration INTEGER NOT NULL DEFAULT 60,
  buffer_time INTEGER NOT NULL DEFAULT 15,
  min_advance_notice INTEGER NOT NULL DEFAULT 24,
  max_advance_days INTEGER NOT NULL DEFAULT 90,
  timezone VARCHAR(100) NOT NULL DEFAULT 'America/New_York',
  excluded_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded_time_ranges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_id_unique UNIQUE (user_id)
);

CREATE INDEX idx_availability_configs_user_id ON availability_configs(user_id);

-- Insert default system-wide configuration
INSERT INTO availability_configs (
  user_id,
  working_hours,
  slot_duration,
  buffer_time,
  min_advance_notice,
  max_advance_days,
  timezone,
  excluded_dates,
  excluded_time_ranges
) VALUES (
  NULL,
  '[
    {"dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00", "enabled": true},
    {"dayOfWeek": 2, "startTime": "09:00", "endTime": "17:00", "enabled": true},
    {"dayOfWeek": 3, "startTime": "09:00", "endTime": "17:00", "enabled": true},
    {"dayOfWeek": 4, "startTime": "09:00", "endTime": "17:00", "enabled": true},
    {"dayOfWeek": 5, "startTime": "09:00", "endTime": "17:00", "enabled": true},
    {"dayOfWeek": 6, "startTime": "09:00", "endTime": "17:00", "enabled": false},
    {"dayOfWeek": 0, "startTime": "09:00", "endTime": "17:00", "enabled": false}
  ]'::jsonb,
  60,
  15,
  24,
  90,
  'America/New_York',
  '[]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_availability_configs_updated_at
BEFORE UPDATE ON availability_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Quote Line Items
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quote line items"
ON quote_line_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quotes
    WHERE quotes.id = quote_line_items.quote_id
    AND quotes.customer_email = (SELECT email FROM users WHERE id = auth.uid())
  )
);

CREATE POLICY "Admins can manage all quote line items"
ON quote_line_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Quote Activities
ALTER TABLE quote_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quote activities"
ON quote_activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quotes
    WHERE quotes.id = quote_activities.quote_id
    AND quotes.customer_email = (SELECT email FROM users WHERE id = auth.uid())
  )
);

CREATE POLICY "Admins can manage all quote activities"
ON quote_activities FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Availability Configs
ALTER TABLE availability_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own availability config"
ON availability_configs FOR SELECT
USING (user_id IS NULL OR user_id = auth.uid()::text);

CREATE POLICY "Users can manage own availability config"
ON availability_configs FOR ALL
USING (user_id = auth.uid()::text);

CREATE POLICY "Admins can manage all availability configs"
ON availability_configs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
