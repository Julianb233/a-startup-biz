const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  console.log('Running voice agent config migration...\n');

  // Run each table creation separately for better error handling
  const statements = [
    // Voice Agent Config table
    `CREATE TABLE IF NOT EXISTS voice_agent_config (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL DEFAULT 'Default Agent',
      is_active BOOLEAN DEFAULT true,
      system_prompt TEXT NOT NULL DEFAULT 'You are a helpful AI assistant.',
      greeting_message TEXT DEFAULT 'Hello! How can I help you today?',
      voice VARCHAR(20) DEFAULT 'alloy',
      max_response_length INTEGER DEFAULT 150,
      response_style VARCHAR(20) DEFAULT 'professional',
      language VARCHAR(10) DEFAULT 'en',
      business_hours JSONB DEFAULT '{"monday": {"enabled": true, "start": "09:00", "end": "17:00"}, "tuesday": {"enabled": true, "start": "09:00", "end": "17:00"}, "wednesday": {"enabled": true, "start": "09:00", "end": "17:00"}, "thursday": {"enabled": true, "start": "09:00", "end": "17:00"}, "friday": {"enabled": true, "start": "09:00", "end": "17:00"}, "saturday": {"enabled": false, "start": "10:00", "end": "14:00"}, "sunday": {"enabled": false, "start": "10:00", "end": "14:00"}}',
      timezone VARCHAR(50) DEFAULT 'America/New_York',
      after_hours_behavior VARCHAR(20) DEFAULT 'voicemail',
      after_hours_message TEXT DEFAULT 'Our office is currently closed. Please leave a message and we will get back to you during business hours.',
      fallback_message TEXT DEFAULT 'I apologize, but I am unable to help with that request. Would you like to speak with a human agent?',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by VARCHAR(255),
      CONSTRAINT valid_voice CHECK (voice IN ('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer')),
      CONSTRAINT valid_style CHECK (response_style IN ('professional', 'friendly', 'casual')),
      CONSTRAINT valid_after_hours CHECK (after_hours_behavior IN ('voicemail', 'limited', 'offline'))
    )`,

    // Escalation Rules table
    `CREATE TABLE IF NOT EXISTS escalation_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      config_id UUID REFERENCES voice_agent_config(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      priority INTEGER DEFAULT 0,
      trigger_type VARCHAR(30) NOT NULL,
      trigger_keywords TEXT[],
      sentiment_threshold INTEGER,
      time_limit_seconds INTEGER,
      trigger_intents TEXT[],
      custom_condition JSONB,
      action VARCHAR(30) NOT NULL DEFAULT 'offer_transfer',
      transfer_to VARCHAR(255),
      action_message TEXT DEFAULT 'I understand you would like to speak with a human. Let me connect you.',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT valid_trigger_type CHECK (trigger_type IN ('keyword', 'sentiment', 'time_limit', 'intent', 'custom')),
      CONSTRAINT valid_action CHECK (action IN ('offer_transfer', 'auto_transfer', 'schedule_callback', 'send_email'))
    )`,

    // Knowledge Base table
    `CREATE TABLE IF NOT EXISTS knowledge_base (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      config_id UUID REFERENCES voice_agent_config(id) ON DELETE CASCADE,
      entry_type VARCHAR(20) NOT NULL DEFAULT 'faq',
      question TEXT,
      answer TEXT,
      document_title VARCHAR(255),
      document_content TEXT,
      document_url TEXT,
      product_name VARCHAR(255),
      product_description TEXT,
      product_price DECIMAL(10, 2),
      product_features TEXT[],
      category VARCHAR(100),
      tags TEXT[],
      search_keywords TEXT[],
      is_active BOOLEAN DEFAULT true,
      priority INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by VARCHAR(255),
      CONSTRAINT valid_entry_type CHECK (entry_type IN ('faq', 'document', 'product', 'custom'))
    )`,

    // Voice Calls table (if not exists)
    `CREATE TABLE IF NOT EXISTS voice_calls (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_name VARCHAR(255) NOT NULL,
      caller_id VARCHAR(255),
      agent_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active',
      started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ended_at TIMESTAMP WITH TIME ZONE,
      duration_seconds INTEGER,
      transcript TEXT,
      recording_url TEXT,
      sentiment_scores JSONB DEFAULT '[]',
      topics_detected TEXT[],
      escalation_triggered BOOLEAN DEFAULT false,
      escalation_reason TEXT,
      agent_config_id UUID REFERENCES voice_agent_config(id),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,

    // Voice Agent Analytics table
    `CREATE TABLE IF NOT EXISTS voice_agent_analytics (
      id SERIAL PRIMARY KEY,
      config_id UUID REFERENCES voice_agent_config(id) ON DELETE CASCADE,
      period_start TIMESTAMP WITH TIME ZONE NOT NULL,
      period_end TIMESTAMP WITH TIME ZONE NOT NULL,
      period_type VARCHAR(20) NOT NULL DEFAULT 'daily',
      total_calls INTEGER DEFAULT 0,
      completed_calls INTEGER DEFAULT 0,
      missed_calls INTEGER DEFAULT 0,
      escalated_calls INTEGER DEFAULT 0,
      total_duration_seconds INTEGER DEFAULT 0,
      avg_duration_seconds INTEGER DEFAULT 0,
      avg_sentiment_score INTEGER,
      positive_calls INTEGER DEFAULT 0,
      neutral_calls INTEGER DEFAULT 0,
      negative_calls INTEGER DEFAULT 0,
      resolved_by_agent INTEGER DEFAULT 0,
      transferred_to_human INTEGER DEFAULT 0,
      top_topics JSONB DEFAULT '[]',
      calls_by_hour JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(config_id, period_start, period_type)
    )`,

    // Indexes
    `CREATE INDEX IF NOT EXISTS idx_escalation_rules_config ON escalation_rules(config_id)`,
    `CREATE INDEX IF NOT EXISTS idx_escalation_rules_active ON escalation_rules(is_active, priority DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_knowledge_base_config ON knowledge_base(config_id)`,
    `CREATE INDEX IF NOT EXISTS idx_knowledge_base_type ON knowledge_base(entry_type, is_active)`,
    `CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category)`,
    `CREATE INDEX IF NOT EXISTS idx_voice_analytics_config ON voice_agent_analytics(config_id)`,
    `CREATE INDEX IF NOT EXISTS idx_voice_analytics_period ON voice_agent_analytics(period_start, period_type)`,
    `CREATE INDEX IF NOT EXISTS idx_voice_calls_room ON voice_calls(room_name)`,
    `CREATE INDEX IF NOT EXISTS idx_voice_calls_status ON voice_calls(status)`
  ];

  for (let i = 0; i < statements.length; i++) {
    try {
      await sql(statements[i]);
      console.log(`✓ Statement ${i + 1}/${statements.length} completed`);
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log(`⚠ Statement ${i + 1}/${statements.length} skipped (already exists)`);
      } else {
        console.error(`✗ Statement ${i + 1}/${statements.length} failed:`, err.message.slice(0, 150));
      }
    }
  }

  // Insert default configuration
  console.log('\nInserting default configuration...');
  try {
    await sql`
      INSERT INTO voice_agent_config (name, system_prompt, greeting_message, voice, created_by)
      VALUES (
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
      )
      ON CONFLICT DO NOTHING
    `;
    console.log('✓ Default agent config inserted');
  } catch (err) {
    console.log('⚠ Default config:', err.message.slice(0, 100));
  }

  // Insert escalation rules
  console.log('\nInserting escalation rules...');
  const configResult = await sql`SELECT id FROM voice_agent_config WHERE name = 'A Startup Biz Support Agent' LIMIT 1`;

  if (configResult.length > 0) {
    const configId = configResult[0].id;

    const rules = [
      { name: 'Manager Request', trigger_type: 'keyword', trigger_keywords: ['manager', 'supervisor', 'speak to someone', 'human agent', 'real person'], action: 'offer_transfer', action_message: 'I understand you would like to speak with a team member. Let me connect you with someone who can help.', priority: 100 },
      { name: 'Complaint Handling', trigger_type: 'keyword', trigger_keywords: ['complaint', 'unhappy', 'terrible', 'awful', 'worst', 'sue', 'lawyer', 'refund'], action: 'auto_transfer', action_message: 'I apologize for your experience. Let me connect you with a team member right away to resolve this.', priority: 90 },
      { name: 'Negative Sentiment', trigger_type: 'sentiment', sentiment_threshold: 25, action: 'offer_transfer', action_message: 'I sense you may be frustrated. Would you like me to connect you with a team member?', priority: 80 },
      { name: 'Long Call', trigger_type: 'time_limit', time_limit_seconds: 300, action: 'offer_transfer', action_message: 'We have been talking for a while. Would you like me to connect you with a specialist who might be able to help more directly?', priority: 50 }
    ];

    for (const rule of rules) {
      try {
        if (rule.trigger_keywords) {
          await sql`
            INSERT INTO escalation_rules (config_id, name, trigger_type, trigger_keywords, action, action_message, priority)
            VALUES (${configId}, ${rule.name}, ${rule.trigger_type}, ${rule.trigger_keywords}, ${rule.action}, ${rule.action_message}, ${rule.priority})
            ON CONFLICT DO NOTHING
          `;
        } else if (rule.sentiment_threshold) {
          await sql`
            INSERT INTO escalation_rules (config_id, name, trigger_type, sentiment_threshold, action, action_message, priority)
            VALUES (${configId}, ${rule.name}, ${rule.trigger_type}, ${rule.sentiment_threshold}, ${rule.action}, ${rule.action_message}, ${rule.priority})
            ON CONFLICT DO NOTHING
          `;
        } else if (rule.time_limit_seconds) {
          await sql`
            INSERT INTO escalation_rules (config_id, name, trigger_type, time_limit_seconds, action, action_message, priority)
            VALUES (${configId}, ${rule.name}, ${rule.trigger_type}, ${rule.time_limit_seconds}, ${rule.action}, ${rule.action_message}, ${rule.priority})
            ON CONFLICT DO NOTHING
          `;
        }
        console.log(`✓ Rule "${rule.name}" inserted`);
      } catch (err) {
        console.log(`⚠ Rule "${rule.name}":`, err.message.slice(0, 80));
      }
    }

    // Insert knowledge base entries
    console.log('\nInserting knowledge base entries...');
    const faqs = [
      { question: 'What are your business hours?', answer: 'Our office is open Monday through Friday, 9 AM to 5 PM Eastern Time. You can reach us by phone during these hours or leave a message anytime.', category: 'General', tags: ['hours', 'schedule', 'availability'] },
      { question: 'How much does a consultation cost?', answer: 'Initial consultations are complimentary. Our ongoing business strategy consulting is $750 per hour. We also offer package deals for longer engagements.', category: 'Pricing', tags: ['cost', 'pricing', 'consultation', 'rate'] },
      { question: 'Do you offer web development services?', answer: 'Yes! Our web development services range from $1,500 for single-page sites to $7,500 for full 15-20 page websites. We specialize in Next.js, React, and modern web technologies.', category: 'Services', tags: ['web', 'development', 'website', 'design'] }
    ];

    for (const faq of faqs) {
      try {
        await sql`
          INSERT INTO knowledge_base (config_id, entry_type, question, answer, category, tags)
          VALUES (${configId}, 'faq', ${faq.question}, ${faq.answer}, ${faq.category}, ${faq.tags})
          ON CONFLICT DO NOTHING
        `;
        console.log(`✓ FAQ "${faq.question.slice(0, 30)}..." inserted`);
      } catch (err) {
        console.log(`⚠ FAQ:`, err.message.slice(0, 80));
      }
    }

    // Insert product entry
    try {
      await sql`
        INSERT INTO knowledge_base (config_id, entry_type, product_name, product_description, product_price, product_features, category)
        VALUES (${configId}, 'product', 'Business Strategy Consulting', 'One-on-one consulting sessions with experienced business strategists to help grow your business.', 750.00, ARRAY['Personalized strategy', 'Market analysis', 'Growth planning', 'Implementation support'], 'Services')
        ON CONFLICT DO NOTHING
      `;
      console.log('✓ Product entry inserted');
    } catch (err) {
      console.log('⚠ Product:', err.message.slice(0, 80));
    }
  }

  // Verify tables
  console.log('\n--- Migration Complete ---');
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND (table_name LIKE '%voice%' OR table_name LIKE '%escalation%' OR table_name LIKE '%knowledge%')
    ORDER BY table_name
  `;
  console.log('\nVoice agent tables created:', tables.map(t => t.table_name).join(', '));

  const configCount = await sql`SELECT COUNT(*) as count FROM voice_agent_config`;
  const rulesCount = await sql`SELECT COUNT(*) as count FROM escalation_rules`;
  const kbCount = await sql`SELECT COUNT(*) as count FROM knowledge_base`;

  console.log(`\nData summary:`);
  console.log(`  - Voice agent configs: ${configCount[0].count}`);
  console.log(`  - Escalation rules: ${rulesCount[0].count}`);
  console.log(`  - Knowledge base entries: ${kbCount[0].count}`);
}

runMigration().catch(console.error);
