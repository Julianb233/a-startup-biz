-- Voice Calls tracking tables
-- Created: 2025-12-29

-- Voice calls table
CREATE TABLE IF NOT EXISTS voice_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name VARCHAR(255) NOT NULL,
    caller_id VARCHAR(255) NOT NULL,
    callee_id VARCHAR(255),
    call_type VARCHAR(50) DEFAULT 'support', -- 'support', 'user-to-user', 'conference'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'ringing', 'connected', 'completed', 'missed', 'failed'
    started_at TIMESTAMP WITH TIME ZONE,
    connected_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    recording_url TEXT,
    transcript TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call participants table (for conference calls)
CREATE TABLE IF NOT EXISTS call_participants (
    id SERIAL PRIMARY KEY,
    call_id UUID REFERENCES voice_calls(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    participant_name VARCHAR(255),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    is_muted BOOLEAN DEFAULT FALSE,
    UNIQUE(call_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voice_calls_caller ON voice_calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_callee ON voice_calls(callee_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_status ON voice_calls(status);
CREATE INDEX IF NOT EXISTS idx_voice_calls_created ON voice_calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_participants_call ON call_participants(call_id);
CREATE INDEX IF NOT EXISTS idx_call_participants_user ON call_participants(user_id);

-- Add comments
COMMENT ON TABLE voice_calls IS 'Voice call records for WebRTC calls';
COMMENT ON TABLE call_participants IS 'Participants in voice calls';
