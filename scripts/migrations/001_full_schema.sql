-- ============================================
-- A Startup Biz - Complete Database Schema
-- Migration: 001_full_schema
-- Created: 2025-12-28
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

-- Drop existing types if they exist (for clean re-runs)
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS consultation_status CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS document_status CASCADE;
DROP TYPE IF EXISTS action_priority CASCADE;
DROP TYPE IF EXISTS referral_status CASCADE;
DROP TYPE IF EXISTS fulfillment_type CASCADE;
DROP TYPE IF EXISTS fulfillment_status CASCADE;
DROP TYPE IF EXISTS progress_status CASCADE;
DROP TYPE IF EXISTS entity_type CASCADE;
DROP TYPE IF EXISTS onboarding_status CASCADE;

-- Create enum types
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'completed', 'refunded');
CREATE TYPE consultation_status AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');
CREATE TYPE document_type AS ENUM ('deliverable', 'form', 'contract', 'invoice');
CREATE TYPE document_status AS ENUM ('pending', 'ready', 'viewed', 'downloaded');
CREATE TYPE action_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE referral_status AS ENUM ('pending', 'signed_up', 'converted', 'paid');
CREATE TYPE fulfillment_type AS ENUM ('website', 'crm', 'seo', 'content', 'branding');
CREATE TYPE fulfillment_status AS ENUM ('queued', 'in_progress', 'completed', 'blocked');
CREATE TYPE progress_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE entity_type AS ENUM ('user', 'order', 'consultation', 'referral');
CREATE TYPE onboarding_status AS ENUM ('submitted', 'reviewed', 'in_progress', 'completed');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status order_status DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  payment_method VARCHAR(50),
  stripe_session_id VARCHAR(255),
  coupon_code VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  service_type VARCHAR(255) NOT NULL,
  status consultation_status DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  meeting_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_at ON consultations(scheduled_at);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  type document_type NOT NULL,
  url VARCHAR(500),
  file_size INTEGER,
  mime_type VARCHAR(100),
  status document_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_order_id ON documents(order_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- ============================================
-- ACTION ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority action_priority DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_items_user_id ON action_items(user_id);
CREATE INDEX IF NOT EXISTS idx_action_items_order_id ON action_items(order_id);
CREATE INDEX IF NOT EXISTS idx_action_items_completed ON action_items(completed);
CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON action_items(due_date);

-- ============================================
-- SERVICE PROGRESS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS service_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  milestone VARCHAR(255) NOT NULL,
  description TEXT,
  status progress_status DEFAULT 'pending',
  sort_order INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_progress_order_id ON service_progress(order_id);
CREATE INDEX IF NOT EXISTS idx_service_progress_status ON service_progress(status);

-- ============================================
-- REFERRAL LINKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS referral_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(code);
CREATE INDEX IF NOT EXISTS idx_referral_links_user_id ON referral_links(user_id);

-- ============================================
-- REFERRALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_email VARCHAR(255) NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status referral_status DEFAULT 'pending',
  source VARCHAR(100),
  commission_rate DECIMAL(5,4) DEFAULT 0.10,
  commission_amount DECIMAL(10,2),
  commission_paid BOOLEAN DEFAULT false,
  commission_paid_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_email ON referrals(referred_email);

-- ============================================
-- FULFILLMENT TASKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS fulfillment_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  type fulfillment_type NOT NULL,
  status fulfillment_status DEFAULT 'queued',
  assignee VARCHAR(255),
  blockers TEXT[],
  automatable BOOLEAN DEFAULT false,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fulfillment_tasks_order_id ON fulfillment_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_tasks_status ON fulfillment_tasks(status);
CREATE INDEX IF NOT EXISTS idx_fulfillment_tasks_type ON fulfillment_tasks(type);

-- ============================================
-- ADMIN NOTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notes_entity ON admin_notes(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_author ON admin_notes(author_id);

-- ============================================
-- ONBOARDING SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  business_stage VARCHAR(100) NOT NULL,
  goals TEXT[],
  challenges TEXT[],
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  timeline VARCHAR(100),
  budget_range VARCHAR(100),
  additional_info TEXT,
  status onboarding_status DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON onboarding_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON onboarding_submissions(status);

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at DESC);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags TEXT[],
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);

-- ============================================
-- SESSIONS TABLE (for NextAuth)
-- ============================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- ============================================
-- ACCOUNTS TABLE (for OAuth providers)
-- ============================================

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(50),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- ============================================
-- VERIFICATION TOKENS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (identifier, token)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_verification_token ON verification_tokens(token);

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- Revenue Analytics View
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as order_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value,
  SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as completed_revenue
FROM orders
WHERE status IN ('paid', 'processing', 'completed')
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- User Growth View
CREATE OR REPLACE VIEW user_growth AS
SELECT
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as new_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('week', created_at)) as cumulative_users
FROM users
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week DESC;

-- Service Popularity View
CREATE OR REPLACE VIEW service_popularity AS
SELECT
  service_type,
  COUNT(*) as total_consultations,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
FROM consultations
GROUP BY service_type
ORDER BY total_consultations DESC;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_onboarding_updated_at ON onboarding_submissions;
CREATE TRIGGER update_onboarding_updated_at
  BEFORE UPDATE ON onboarding_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - Comment out in production)
-- ============================================

-- Insert admin user (password: admin123 - change in production!)
-- INSERT INTO users (email, name, password_hash, role, email_verified)
-- VALUES ('admin@astartupbiz.com', 'Admin User', '$2b$10$example_hash', 'admin', true)
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- GRANT PERMISSIONS (adjust for your setup)
-- ============================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- ============================================
-- END OF MIGRATION
-- ============================================
