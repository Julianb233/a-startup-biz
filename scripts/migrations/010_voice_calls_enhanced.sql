-- ============================================
-- Voice Calls Enhanced Schema
-- Migration: 010_voice_calls_enhanced
-- Created: 2025-12-29
-- Description: Complete voice call tracking with LiveKit integration,
--              AI agent support, and comprehensive message history
-- ============================================

-- ============================================
-- ENUM TYPES
-- ============================================

-- Drop existing types if they exist (for clean re-runs)
DROP TYPE IF EXISTS call_status CASCADE;
DROP TYPE IF EXISTS message_role CASCADE;

-- Call status enum aligned with LiveKit workflow
CREATE TYPE call_status AS ENUM (
  'pending',    -- Call initiated but not yet connected
  'active',     -- Call in progress
  'completed',  -- Call ended successfully
  'failed'      -- Call failed to connect or encountered error
);

-- Message role enum for conversation tracking
CREATE TYPE message_role AS ENUM (
  'user',       -- Human user message
  'assistant',  -- AI agent message
  'system'      -- System notifications (joined, left, etc.)
);

-- ============================================
-- VOICE CALLS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS voice_calls (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User relationship (references users table from 001_full_schema.sql)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- LiveKit session tracking
  session_id VARCHAR(255) UNIQUE NOT NULL, -- LiveKit room name for tracking
  room_name VARCHAR(255) NOT NULL,         -- Human-readable room name

  -- Call status and lifecycle
  status call_status DEFAULT 'pending',
  started_at TIMESTAMPTZ,                  -- When call was initiated
  connected_at TIMESTAMPTZ,                -- When call was connected
  ended_at TIMESTAMPTZ,                    -- When call was ended
  duration_seconds INTEGER,                -- Total call duration

  -- Recording and transcription
  recording_url TEXT,                      -- URL to call recording (S3/CloudFlare)
  transcript TEXT,                         -- Full call transcript

  -- AI Agent tracking
  ai_agent_used BOOLEAN DEFAULT false,     -- Whether AI agent participated
  agent_identity VARCHAR(255),             -- LiveKit identity of AI agent

  -- Metadata and analytics
  metadata JSONB DEFAULT '{}',             -- Flexible data (quality metrics, errors, etc.)
  total_tokens_used INTEGER DEFAULT 0,     -- Total AI tokens consumed

  -- Audit timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add table comments
COMMENT ON TABLE voice_calls IS 'Voice call sessions with LiveKit integration and AI agent support';
COMMENT ON COLUMN voice_calls.session_id IS 'Unique LiveKit room identifier for session tracking';
COMMENT ON COLUMN voice_calls.user_id IS 'Primary user who initiated or received the call';
COMMENT ON COLUMN voice_calls.metadata IS 'JSONB field for quality metrics, error details, participant info, etc.';
COMMENT ON COLUMN voice_calls.total_tokens_used IS 'Cumulative AI tokens used across all messages in this call';

-- ============================================
-- VOICE MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS voice_messages (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Call relationship
  call_id UUID NOT NULL REFERENCES voice_calls(id) ON DELETE CASCADE,

  -- Message metadata
  role message_role NOT NULL,              -- Who sent the message (user/assistant/system)
  content TEXT NOT NULL,                   -- Message content/transcription

  -- Audio tracking
  audio_url TEXT,                          -- URL to audio snippet for this message
  audio_duration_ms INTEGER,               -- Duration of audio in milliseconds

  -- Timing
  timestamp TIMESTAMPTZ DEFAULT NOW(),     -- When message was sent
  sequence_number INTEGER,                 -- Order within conversation

  -- AI metrics (for assistant messages)
  tokens_used INTEGER DEFAULT 0,           -- Tokens used for this specific message
  model_used VARCHAR(100),                 -- AI model used (e.g., 'gpt-4-turbo')

  -- Metadata
  metadata JSONB DEFAULT '{}'              -- Additional data (confidence scores, etc.)
);

-- Add table comments
COMMENT ON TABLE voice_messages IS 'Individual messages within voice call conversations';
COMMENT ON COLUMN voice_messages.sequence_number IS 'Sequential order of messages within the call';
COMMENT ON COLUMN voice_messages.tokens_used IS 'AI tokens consumed for this individual message';
COMMENT ON COLUMN voice_messages.metadata IS 'Message-level metadata like confidence scores, language detection, etc.';

-- ============================================
-- CALL PARTICIPANTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS call_participants (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  call_id UUID NOT NULL REFERENCES voice_calls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Participant info
  participant_identity VARCHAR(255) NOT NULL, -- LiveKit participant identity
  participant_name VARCHAR(255),              -- Display name
  participant_type VARCHAR(50) DEFAULT 'user', -- 'user', 'agent', 'admin'

  -- Session tracking
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  duration_seconds INTEGER,

  -- State
  is_muted BOOLEAN DEFAULT false,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Ensure one entry per participant per call
  UNIQUE(call_id, participant_identity)
);

-- Add table comments
COMMENT ON TABLE call_participants IS 'Tracks all participants in voice calls including users and AI agents';
COMMENT ON COLUMN call_participants.participant_type IS 'Type of participant: user, agent, or admin';

-- ============================================
-- INDEXES
-- ============================================

-- Voice Calls indexes
CREATE INDEX IF NOT EXISTS idx_voice_calls_user_id
  ON voice_calls(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_voice_calls_session_id
  ON voice_calls(session_id);

CREATE INDEX IF NOT EXISTS idx_voice_calls_status
  ON voice_calls(status);

CREATE INDEX IF NOT EXISTS idx_voice_calls_created_at
  ON voice_calls(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_voice_calls_active
  ON voice_calls(status, created_at DESC)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_voice_calls_ai_agent
  ON voice_calls(ai_agent_used, created_at DESC)
  WHERE ai_agent_used = true;

-- Voice Messages indexes
CREATE INDEX IF NOT EXISTS idx_voice_messages_call_id
  ON voice_messages(call_id);

CREATE INDEX IF NOT EXISTS idx_voice_messages_call_sequence
  ON voice_messages(call_id, sequence_number);

CREATE INDEX IF NOT EXISTS idx_voice_messages_timestamp
  ON voice_messages(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_voice_messages_role
  ON voice_messages(call_id, role);

-- Call Participants indexes
CREATE INDEX IF NOT EXISTS idx_call_participants_call_id
  ON call_participants(call_id);

CREATE INDEX IF NOT EXISTS idx_call_participants_user_id
  ON call_participants(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_call_participants_identity
  ON call_participants(participant_identity);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_participants ENABLE ROW LEVEL SECURITY;

-- Voice Calls RLS Policies

-- Users can view their own calls
CREATE POLICY voice_calls_select_own
  ON voice_calls
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id
      FROM call_participants
      WHERE call_id = voice_calls.id
    )
  );

-- Users can insert their own calls
CREATE POLICY voice_calls_insert_own
  ON voice_calls
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own calls
CREATE POLICY voice_calls_update_own
  ON voice_calls
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin users can view all calls (assuming role='admin' in users table)
CREATE POLICY voice_calls_admin_all
  ON voice_calls
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Voice Messages RLS Policies

-- Users can view messages from their calls
CREATE POLICY voice_messages_select_own
  ON voice_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voice_calls
      WHERE id = voice_messages.call_id
      AND (
        user_id = auth.uid() OR
        id IN (
          SELECT call_id
          FROM call_participants
          WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Users can insert messages to their calls
CREATE POLICY voice_messages_insert_own
  ON voice_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voice_calls
      WHERE id = voice_messages.call_id
      AND (
        user_id = auth.uid() OR
        id IN (
          SELECT call_id
          FROM call_participants
          WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Admin can manage all messages
CREATE POLICY voice_messages_admin_all
  ON voice_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Call Participants RLS Policies

-- Users can view participants from their calls
CREATE POLICY call_participants_select_own
  ON call_participants
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM voice_calls
      WHERE id = call_participants.call_id
      AND user_id = auth.uid()
    )
  );

-- Users can insert themselves as participants
CREATE POLICY call_participants_insert_own
  ON call_participants
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admin can manage all participants
CREATE POLICY call_participants_admin_all
  ON call_participants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_voice_calls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on voice_calls
CREATE TRIGGER voice_calls_updated_at_trigger
  BEFORE UPDATE ON voice_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_calls_updated_at();

-- Function to calculate call duration on end
CREATE OR REPLACE FUNCTION calculate_call_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND NEW.connected_at IS NOT NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.connected_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate duration
CREATE TRIGGER voice_calls_calculate_duration_trigger
  BEFORE UPDATE ON voice_calls
  FOR EACH ROW
  WHEN (NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL)
  EXECUTE FUNCTION calculate_call_duration();

-- Function to calculate participant duration
CREATE OR REPLACE FUNCTION calculate_participant_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.left_at IS NOT NULL AND NEW.joined_at IS NOT NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.left_at - NEW.joined_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate participant duration
CREATE TRIGGER call_participants_calculate_duration_trigger
  BEFORE UPDATE ON call_participants
  FOR EACH ROW
  WHEN (NEW.left_at IS NOT NULL AND OLD.left_at IS NULL)
  EXECUTE FUNCTION calculate_participant_duration();

-- Function to update total tokens used on voice_calls
CREATE OR REPLACE FUNCTION update_call_tokens()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE voice_calls
  SET total_tokens_used = (
    SELECT COALESCE(SUM(tokens_used), 0)
    FROM voice_messages
    WHERE call_id = NEW.call_id
  )
  WHERE id = NEW.call_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update total tokens when messages are added/updated
CREATE TRIGGER voice_messages_update_tokens_trigger
  AFTER INSERT OR UPDATE ON voice_messages
  FOR EACH ROW
  WHEN (NEW.tokens_used > 0)
  EXECUTE FUNCTION update_call_tokens();

-- ============================================
-- UTILITY VIEWS
-- ============================================

-- View for active calls with participant count
CREATE OR REPLACE VIEW active_calls_summary AS
SELECT
  vc.id,
  vc.session_id,
  vc.room_name,
  vc.user_id,
  u.name as user_name,
  u.email as user_email,
  vc.status,
  vc.started_at,
  vc.ai_agent_used,
  COUNT(cp.id) as participant_count,
  ARRAY_AGG(cp.participant_name) FILTER (WHERE cp.participant_name IS NOT NULL) as participants
FROM voice_calls vc
LEFT JOIN users u ON u.id = vc.user_id
LEFT JOIN call_participants cp ON cp.call_id = vc.id AND cp.left_at IS NULL
WHERE vc.status = 'active'
GROUP BY vc.id, u.name, u.email;

COMMENT ON VIEW active_calls_summary IS 'Summary of all currently active voice calls with participant information';

-- View for call analytics
CREATE OR REPLACE VIEW call_analytics AS
SELECT
  vc.id,
  vc.session_id,
  vc.user_id,
  vc.status,
  vc.duration_seconds,
  vc.ai_agent_used,
  vc.total_tokens_used,
  COUNT(DISTINCT vm.id) as message_count,
  COUNT(DISTINCT vm.id) FILTER (WHERE vm.role = 'user') as user_message_count,
  COUNT(DISTINCT vm.id) FILTER (WHERE vm.role = 'assistant') as assistant_message_count,
  vc.created_at,
  vc.ended_at
FROM voice_calls vc
LEFT JOIN voice_messages vm ON vm.call_id = vc.id
GROUP BY vc.id;

COMMENT ON VIEW call_analytics IS 'Analytics view for voice call metrics and usage statistics';

-- ============================================
-- SAMPLE DATA (for testing - comment out in production)
-- ============================================

-- Uncomment below for development/testing

-- INSERT INTO voice_calls (user_id, session_id, room_name, status, started_at, ai_agent_used)
-- VALUES (
--   (SELECT id FROM users LIMIT 1),
--   'test-session-' || gen_random_uuid()::text,
--   'Test Support Call',
--   'active',
--   NOW(),
--   true
-- );

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Add migration tracking comment
COMMENT ON TABLE voice_calls IS 'Voice call sessions - Enhanced schema v2 (2025-12-29)';
