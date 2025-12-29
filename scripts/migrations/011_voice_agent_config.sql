-- Voice Agent Configuration Tables
-- Created: 2025-12-29
-- Purpose: Store configurable settings for AI voice agents

-- Voice Agent Configuration (main settings)
CREATE TABLE IF NOT EXISTS voice_agent_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL DEFAULT 'Default Agent',
    is_active BOOLEAN DEFAULT true,

    -- Agent Identity
    system_prompt TEXT NOT NULL DEFAULT 'You are a helpful AI assistant.',
    greeting_message TEXT DEFAULT 'Hello! How can I help you today?',
    voice VARCHAR(20) DEFAULT 'alloy', -- alloy, echo, fable, onyx, nova, shimmer

    -- Behavior Settings
    max_response_length INTEGER DEFAULT 150, -- words
    response_style VARCHAR(20) DEFAULT 'professional', -- professional, friendly, casual
    language VARCHAR(10) DEFAULT 'en',

    -- Business Hours (JSON: {"monday": {"start": "09:00", "end": "17:00"}, ...})
    business_hours JSONB DEFAULT '{
        "monday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "tuesday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "wednesday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "thursday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "friday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "saturday": {"enabled": false, "start": "10:00", "end": "14:00"},
        "sunday": {"enabled": false, "start": "10:00", "end": "14:00"}
    }',
    timezone VARCHAR(50) DEFAULT 'America/New_York',

    -- After Hours Behavior
    after_hours_behavior VARCHAR(20) DEFAULT 'voicemail', -- voicemail, limited, offline
    after_hours_message TEXT DEFAULT 'Our office is currently closed. Please leave a message and we will get back to you during business hours.',

    -- Fallback Settings
    fallback_message TEXT DEFAULT 'I apologize, but I am unable to help with that request. Would you like to speak with a human agent?',

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),

    CONSTRAINT valid_voice CHECK (voice IN ('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer')),
    CONSTRAINT valid_style CHECK (response_style IN ('professional', 'friendly', 'casual')),
    CONSTRAINT valid_after_hours CHECK (after_hours_behavior IN ('voicemail', 'limited', 'offline'))
);

-- Escalation Rules (when to transfer to human)
CREATE TABLE IF NOT EXISTS escalation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID REFERENCES voice_agent_config(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Higher = checked first

    -- Trigger Conditions
    trigger_type VARCHAR(30) NOT NULL, -- keyword, sentiment, time_limit, intent, custom

    -- Keyword triggers (comma-separated)
    trigger_keywords TEXT[], -- ['manager', 'supervisor', 'complaint', 'cancel']

    -- Sentiment threshold (0-100, lower = more negative)
    sentiment_threshold INTEGER, -- e.g., 30 means escalate if sentiment < 30

    -- Time limit in seconds before offering escalation
    time_limit_seconds INTEGER,

    -- Intent detection (what user is trying to do)
    trigger_intents TEXT[], -- ['cancel_account', 'file_complaint', 'refund_request']

    -- Custom condition (for advanced rules)
    custom_condition JSONB,

    -- Action to take
    action VARCHAR(30) NOT NULL DEFAULT 'offer_transfer', -- offer_transfer, auto_transfer, schedule_callback, send_email

    -- Action configuration
    transfer_to VARCHAR(255), -- Phone number or email
    action_message TEXT DEFAULT 'I understand you would like to speak with a human. Let me connect you.',

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_trigger_type CHECK (trigger_type IN ('keyword', 'sentiment', 'time_limit', 'intent', 'custom')),
    CONSTRAINT valid_action CHECK (action IN ('offer_transfer', 'auto_transfer', 'schedule_callback', 'send_email'))
);

-- Knowledge Base (FAQs and documents)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID REFERENCES voice_agent_config(id) ON DELETE CASCADE,

    -- Entry type
    entry_type VARCHAR(20) NOT NULL DEFAULT 'faq', -- faq, document, product, custom

    -- FAQ fields
    question TEXT,
    answer TEXT,

    -- Document fields
    document_title VARCHAR(255),
    document_content TEXT,
    document_url TEXT,

    -- Product/Service fields
    product_name VARCHAR(255),
    product_description TEXT,
    product_price DECIMAL(10, 2),
    product_features TEXT[],

    -- Categorization
    category VARCHAR(100),
    tags TEXT[],

    -- Search optimization
    search_keywords TEXT[],
    -- embedding VECTOR(1536), -- For semantic search (requires pgvector extension)

    -- Status
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),

    CONSTRAINT valid_entry_type CHECK (entry_type IN ('faq', 'document', 'product', 'custom'))
);

-- Call Transcripts (enhanced with sentiment)
ALTER TABLE voice_calls
ADD COLUMN IF NOT EXISTS sentiment_scores JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS topics_detected TEXT[],
ADD COLUMN IF NOT EXISTS escalation_triggered BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS escalation_reason TEXT,
ADD COLUMN IF NOT EXISTS agent_config_id UUID REFERENCES voice_agent_config(id);

-- Voice Agent Analytics (aggregated metrics)
CREATE TABLE IF NOT EXISTS voice_agent_analytics (
    id SERIAL PRIMARY KEY,
    config_id UUID REFERENCES voice_agent_config(id) ON DELETE CASCADE,

    -- Time period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    period_type VARCHAR(20) NOT NULL DEFAULT 'daily', -- hourly, daily, weekly, monthly

    -- Call metrics
    total_calls INTEGER DEFAULT 0,
    completed_calls INTEGER DEFAULT 0,
    missed_calls INTEGER DEFAULT 0,
    escalated_calls INTEGER DEFAULT 0,

    -- Duration metrics
    total_duration_seconds INTEGER DEFAULT 0,
    avg_duration_seconds INTEGER DEFAULT 0,

    -- Sentiment metrics
    avg_sentiment_score INTEGER, -- 0-100
    positive_calls INTEGER DEFAULT 0,
    neutral_calls INTEGER DEFAULT 0,
    negative_calls INTEGER DEFAULT 0,

    -- Resolution metrics
    resolved_by_agent INTEGER DEFAULT 0,
    transferred_to_human INTEGER DEFAULT 0,

    -- Top topics (JSON array)
    top_topics JSONB DEFAULT '[]',

    -- Peak hours (JSON: {"09": 15, "10": 22, ...})
    calls_by_hour JSONB DEFAULT '{}',

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(config_id, period_start, period_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_escalation_rules_config ON escalation_rules(config_id);
CREATE INDEX IF NOT EXISTS idx_escalation_rules_active ON escalation_rules(is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_config ON knowledge_base(config_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_type ON knowledge_base(entry_type, is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_voice_analytics_config ON voice_agent_analytics(config_id);
CREATE INDEX IF NOT EXISTS idx_voice_analytics_period ON voice_agent_analytics(period_start, period_type);

-- Insert default configuration
INSERT INTO voice_agent_config (
    name,
    system_prompt,
    greeting_message,
    voice,
    created_by
) VALUES (
    'A Startup Biz Support Agent',
    'You are a helpful AI support assistant for A Startup Biz, a business consulting and services company.

Your role:
- Help users with questions about our services (business consulting, web development, marketing)
- Assist with scheduling consultations and appointments
- Answer general business inquiries
- Provide information about our partner program
- Help troubleshoot common issues

Guidelines:
- Be friendly, professional, and concise
- If you cannot help with something, offer to connect them with a human agent
- Keep responses focused and avoid unnecessary filler
- Acknowledge the user''s needs before providing information
- For complex issues, recommend scheduling a consultation

Services we offer:
1. Business Strategy Consulting - $750/hour
2. Web Development - $1,500-$7,500 per project
3. Marketing Services - $1,500/month retainer
4. SEO Optimization - Starting at $500/month

For emergencies or urgent matters, recommend calling our main line or emailing support@astartupbiz.com.',
    'Hello! Thank you for calling A Startup Biz. I''m your AI assistant. How can I help you today?',
    'alloy',
    'system'
) ON CONFLICT DO NOTHING;

-- Add default escalation rules
INSERT INTO escalation_rules (config_id, name, trigger_type, trigger_keywords, action, action_message, priority)
SELECT
    id,
    'Manager Request',
    'keyword',
    ARRAY['manager', 'supervisor', 'speak to someone', 'human agent', 'real person'],
    'offer_transfer',
    'I understand you would like to speak with a team member. Let me connect you with someone who can help.',
    100
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

INSERT INTO escalation_rules (config_id, name, trigger_type, trigger_keywords, action, action_message, priority)
SELECT
    id,
    'Complaint Handling',
    'keyword',
    ARRAY['complaint', 'unhappy', 'terrible', 'awful', 'worst', 'sue', 'lawyer', 'refund'],
    'auto_transfer',
    'I apologize for your experience. Let me connect you with a team member right away to resolve this.',
    90
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

INSERT INTO escalation_rules (config_id, name, trigger_type, sentiment_threshold, action, action_message, priority)
SELECT
    id,
    'Negative Sentiment',
    'sentiment',
    25,
    'offer_transfer',
    'I sense you may be frustrated. Would you like me to connect you with a team member?',
    80
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

INSERT INTO escalation_rules (config_id, name, trigger_type, time_limit_seconds, action, action_message, priority)
SELECT
    id,
    'Long Call',
    'time_limit',
    300,
    'offer_transfer',
    'We have been talking for a while. Would you like me to connect you with a specialist who might be able to help more directly?',
    50
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

-- Add default knowledge base entries
INSERT INTO knowledge_base (config_id, entry_type, question, answer, category, tags)
SELECT
    id,
    'faq',
    'What are your business hours?',
    'Our office is open Monday through Friday, 9 AM to 5 PM Eastern Time. You can reach us by phone during these hours or leave a message anytime.',
    'General',
    ARRAY['hours', 'schedule', 'availability']
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

INSERT INTO knowledge_base (config_id, entry_type, question, answer, category, tags)
SELECT
    id,
    'faq',
    'How much does a consultation cost?',
    'Initial consultations are complimentary. Our ongoing business strategy consulting is $750 per hour. We also offer package deals for longer engagements.',
    'Pricing',
    ARRAY['cost', 'pricing', 'consultation', 'rate']
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

INSERT INTO knowledge_base (config_id, entry_type, question, answer, category, tags)
SELECT
    id,
    'faq',
    'Do you offer web development services?',
    'Yes! Our web development services range from $1,500 for single-page sites to $7,500 for full 15-20 page websites. We specialize in Next.js, React, and modern web technologies.',
    'Services',
    ARRAY['web', 'development', 'website', 'design']
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

INSERT INTO knowledge_base (config_id, entry_type, product_name, product_description, product_price, product_features, category, entry_type)
SELECT
    id,
    'product',
    'Business Strategy Consulting',
    'One-on-one consulting sessions with experienced business strategists to help grow your business.',
    750.00,
    ARRAY['Personalized strategy', 'Market analysis', 'Growth planning', 'Implementation support'],
    'Services',
    'product'
FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent'
ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE voice_agent_config IS 'Configuration settings for AI voice agents';
COMMENT ON TABLE escalation_rules IS 'Rules defining when to escalate calls to human agents';
COMMENT ON TABLE knowledge_base IS 'FAQs, documents, and product info for agent reference';
COMMENT ON TABLE voice_agent_analytics IS 'Aggregated analytics for voice agent performance';
