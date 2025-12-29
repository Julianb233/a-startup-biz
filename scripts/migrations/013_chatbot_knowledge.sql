-- Chatbot Knowledge Base
-- Stores training documents, FAQs, and knowledge that the AI chatbot uses to respond

-- Main knowledge documents table
CREATE TABLE IF NOT EXISTS chatbot_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[], -- Array of keywords for matching
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Higher priority = more important
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories for organizing knowledge
CREATE TABLE IF NOT EXISTS chatbot_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat conversation logs for analytics
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    page_path VARCHAR(500),
    user_message TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    matched_knowledge_ids UUID[],
    response_quality INTEGER, -- 1-5 rating if user provides feedback
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO chatbot_categories (name, description, icon, sort_order) VALUES
    ('About', 'Information about Tory and A Startup Biz', 'User', 1),
    ('Services', 'Service descriptions and pricing', 'Briefcase', 2),
    ('Pricing', 'Pricing information and packages', 'DollarSign', 3),
    ('Process', 'How things work, onboarding process', 'Workflow', 4),
    ('FAQ', 'Frequently asked questions', 'HelpCircle', 5),
    ('Policies', 'Terms, privacy, refund policies', 'FileText', 6),
    ('Contact', 'Contact information and hours', 'Phone', 7),
    ('Testimonials', 'Client success stories', 'Star', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert initial knowledge documents
INSERT INTO chatbot_knowledge (title, category, content, keywords, priority) VALUES
(
    'About Tory Zweigle',
    'About',
    'Tory R. Zweigle is a serial entrepreneur who has built over 100 businesses since he was 11 years old. With 46+ years of real-world experience, he has mastered everything from startup launches to absentee ownership. Tory is not a traditional consultant - he teaches from actual experience, not textbooks. He shares lessons from real failures and successes, and is a master of absentee ownership which is the holy grail of running a business.',
    ARRAY['tory', 'about', 'founder', 'background', 'experience', 'entrepreneur', 'who is'],
    10
),
(
    'Clarity Call Overview',
    'Services',
    'The $1,000 Clarity Call is a 90-minute deep-dive session with Tory. You get a personalized roadmap for your business, identification of blind spots and hidden opportunities, clear next steps and an action plan. This is worth $10,000 or more in avoided mistakes. This is NOT a sales pitch - you walk away with actionable insights whether you hire us for anything else or not. Think of it as hiring Tory''s brain for 90 minutes to solve your biggest challenges.',
    ARRAY['clarity call', 'consultation', '1000', 'thousand', 'session', 'strategy', 'roadmap'],
    10
),
(
    'EIN Filing Service',
    'Services',
    'Our EIN Filing Service costs $160. We submit your application the same day you sign up, and you will have your EIN in 24 to 48 hours. Tory has filed EINs for over 100 of his own businesses, so we know exactly how to do this right. We have never had one rejected. You need an EIN for opening a business bank account, hiring employees, and building business credit. It is basically your business''s social security number.',
    ARRAY['ein', 'tax id', 'federal id', '160', 'filing'],
    8
),
(
    'Legal Services',
    'Services',
    'Our legal services range from $500 to $5,000 depending on what you need. We handle entity formation (LLCs, Corporations, Partnerships), operating agreements and bylaws, contract drafting and review, trademark and IP protection, and ongoing compliance support. Tory has structured over 100 businesses, so he knows exactly what can go wrong if you don''t have the right foundation. One bad contract or wrong structure can cost you everything.',
    ARRAY['legal', 'llc', 'corporation', 'contract', 'entity', 'formation'],
    8
),
(
    'What Makes Us Different',
    'About',
    'Traditional consultants teach from textbooks and theory. They have often never started a business themselves. They use generic frameworks and focus on billable hours. Tory started his first business at age 11. He has built over 100 businesses in 46+ years. He is a master of absentee ownership. He shares real lessons from real failures and successes. When you work with Tory, you are getting advice from someone who has actually lived it - not just studied it in business school. Real experience beats theory every time.',
    ARRAY['different', 'why', 'unique', 'compared', 'versus', 'better'],
    9
),
(
    'Pricing Overview',
    'Pricing',
    'Our pricing varies by service and complexity. Entry-level services include EIN Filing at $160 one-time and Virtual Assistants from $25 to $75 per hour. Monthly services include Bookkeeping from $300 to $1,500, Accounting from $500 to $2,500, Coaching from $500 to $2,500, Social Media from $1,200 to $5,000, and Marketing from $1,500 to $10,000. Project-based services include Legal from $500 to $5,000, CRM from $1,500 to $8,000, Website from $3,000 to $20,000, and AI Solutions from $2,500 to $15,000. The best first step is the $1,000 Clarity Call.',
    ARRAY['price', 'pricing', 'cost', 'how much', 'afford', 'budget', 'expensive'],
    9
),
(
    'Getting Started',
    'Process',
    'Ready to get started? You have a few options. First, you could book a $1,000 Clarity Call which is the best first step for strategic guidance. You will get 90 minutes with Tory and walk away with a clear roadmap. Second, you could explore our services on the website to see what fits your needs. Third, you could contact our team directly for a custom quote. We are here to help you succeed.',
    ARRAY['start', 'begin', 'book', 'schedule', 'appointment', 'next step'],
    7
),
(
    'Partner Program',
    'Services',
    'Our partner program lets you earn commissions by referring clients to our services. It is a great way to add value while helping businesses succeed. Partners can earn ongoing commissions on referred clients. We provide marketing materials, tracking dashboards, and regular payouts. To become a partner, visit the Get Approved page and fill out the application.',
    ARRAY['partner', 'referral', 'commission', 'affiliate', 'earn'],
    6
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_category ON chatbot_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_active ON chatbot_knowledge(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_keywords ON chatbot_knowledge USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session ON chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created ON chatbot_conversations(created_at);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_chatbot_knowledge_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chatbot_knowledge_updated ON chatbot_knowledge;
CREATE TRIGGER chatbot_knowledge_updated
    BEFORE UPDATE ON chatbot_knowledge
    FOR EACH ROW
    EXECUTE FUNCTION update_chatbot_knowledge_timestamp();
