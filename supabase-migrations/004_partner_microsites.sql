-- Partner Microsites Table
-- Date: 2025-12-29
-- Adds partner_microsites table for partner landing pages

-- ============================================================================
-- PARTNER MICROSITES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_microsites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Branding & Content
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(50) DEFAULT '#ff6a1a',
  secondary_color VARCHAR(50) DEFAULT '#1a1a1a',
  hero_headline TEXT,
  hero_subheadline TEXT,
  description TEXT,
  source_website TEXT,
  images JSONB DEFAULT '[]'::jsonb,

  -- Template & Customization
  template_id VARCHAR(50) DEFAULT 'default',
  custom_css TEXT,

  -- Lead Form Configuration
  form_title VARCHAR(255) DEFAULT 'Get Started',
  form_subtitle TEXT DEFAULT 'Fill out the form below and we''ll get back to you shortly.',
  form_fields TEXT[] DEFAULT ARRAY['name', 'email', 'phone', 'message'],
  form_button_text VARCHAR(100) DEFAULT 'Submit',
  success_message TEXT DEFAULT 'Thank you! We''ll be in touch soon.',

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Status & Analytics
  is_active BOOLEAN DEFAULT true,
  page_views INTEGER DEFAULT 0,
  lead_submissions INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  last_scraped_at TIMESTAMPTZ
);

-- ============================================================================
-- PARTNER MICROSITE LEADS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_microsite_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microsite_id UUID NOT NULL REFERENCES partner_microsites(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- Lead Contact Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255),
  message TEXT,
  service_interest VARCHAR(255),
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Lead Status & Management
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  converted_to_partner_lead_id UUID REFERENCES partner_leads(id) ON DELETE SET NULL,
  commission_eligible BOOLEAN DEFAULT true,

  -- Tracking & Attribution
  source_url TEXT,
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_type VARCHAR(50) CHECK (device_type IN ('mobile', 'tablet', 'desktop')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- ============================================================================
-- PARTNER AGREEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_type VARCHAR(100) NOT NULL CHECK (agreement_type IN ('partner_agreement', 'nda', 'commission_structure')),
  title VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL DEFAULT '1.0',
  content TEXT NOT NULL,
  summary TEXT,
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  effective_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PARTNER AGREEMENT ACCEPTANCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_agreement_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  agreement_id UUID NOT NULL REFERENCES partner_agreements(id) ON DELETE CASCADE,
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_by_user_id VARCHAR(255),
  accepted_by_name VARCHAR(255),
  accepted_by_email VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  agreement_version VARCHAR(50),
  agreement_content_hash VARCHAR(255),
  signature_text VARCHAR(255),
  UNIQUE(partner_id, agreement_id)
);

-- ============================================================================
-- PARTNER BANK DETAILS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  account_holder_name VARCHAR(255) NOT NULL,
  account_holder_type VARCHAR(50) DEFAULT 'individual' CHECK (account_holder_type IN ('individual', 'business')),
  bank_name VARCHAR(255),
  account_number_last4 VARCHAR(4),
  account_type VARCHAR(50) DEFAULT 'checking' CHECK (account_type IN ('checking', 'savings')),
  routing_number_last4 VARCHAR(4),
  is_verified BOOLEAN DEFAULT false,
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed')),
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  UNIQUE(partner_id)
);

-- ============================================================================
-- PARTNER EMAIL LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  email_type VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  template_id VARCHAR(100),
  template_data JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  resend_message_id VARCHAR(255),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Partner Microsites
CREATE INDEX IF NOT EXISTS idx_partner_microsites_partner_id ON partner_microsites(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_microsites_slug ON partner_microsites(slug);
CREATE INDEX IF NOT EXISTS idx_partner_microsites_is_active ON partner_microsites(is_active);
CREATE INDEX IF NOT EXISTS idx_partner_microsites_created ON partner_microsites(created_at DESC);

-- Partner Microsite Leads
CREATE INDEX IF NOT EXISTS idx_partner_microsite_leads_microsite_id ON partner_microsite_leads(microsite_id);
CREATE INDEX IF NOT EXISTS idx_partner_microsite_leads_partner_id ON partner_microsite_leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_microsite_leads_status ON partner_microsite_leads(status);
CREATE INDEX IF NOT EXISTS idx_partner_microsite_leads_email ON partner_microsite_leads(email);
CREATE INDEX IF NOT EXISTS idx_partner_microsite_leads_created ON partner_microsite_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_microsite_leads_custom_fields_gin ON partner_microsite_leads USING gin(custom_fields);

-- Partner Agreements
CREATE INDEX IF NOT EXISTS idx_partner_agreements_type ON partner_agreements(agreement_type);
CREATE INDEX IF NOT EXISTS idx_partner_agreements_active ON partner_agreements(is_active);
CREATE INDEX IF NOT EXISTS idx_partner_agreements_sort ON partner_agreements(sort_order);

-- Partner Agreement Acceptances
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_partner ON partner_agreement_acceptances(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_agreement ON partner_agreement_acceptances(agreement_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_accepted ON partner_agreement_acceptances(accepted_at);

-- Partner Bank Details
CREATE INDEX IF NOT EXISTS idx_partner_bank_details_partner ON partner_bank_details(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_bank_details_verified ON partner_bank_details(is_verified);

-- Partner Email Log
CREATE INDEX IF NOT EXISTS idx_partner_email_log_partner ON partner_email_log(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_email_log_type ON partner_email_log(email_type);
CREATE INDEX IF NOT EXISTS idx_partner_email_log_status ON partner_email_log(status);
CREATE INDEX IF NOT EXISTS idx_partner_email_log_created ON partner_email_log(created_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_partner_microsites_updated_at
BEFORE UPDATE ON partner_microsites
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_microsite_leads_updated_at
BEFORE UPDATE ON partner_microsite_leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_agreements_updated_at
BEFORE UPDATE ON partner_agreements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_bank_details_updated_at
BEFORE UPDATE ON partner_bank_details
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment lead submissions count
CREATE OR REPLACE FUNCTION increment_microsite_lead_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE partner_microsites
  SET lead_submissions = lead_submissions + 1
  WHERE id = NEW.microsite_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_microsite_lead_count_trigger
AFTER INSERT ON partner_microsite_leads
FOR EACH ROW EXECUTE FUNCTION increment_microsite_lead_count();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Partner Microsites
ALTER TABLE partner_microsites ENABLE ROW LEVEL SECURITY;

-- Public can view active microsites
CREATE POLICY "Anyone can view active microsites"
ON partner_microsites FOR SELECT
USING (is_active = true);

-- Partners can view their own microsites
CREATE POLICY "Partners can view own microsites"
ON partner_microsites FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_microsites.partner_id
    AND partners.user_id = auth.uid()::text
  )
);

-- Admins can manage all microsites
CREATE POLICY "Admins can manage all microsites"
ON partner_microsites FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Partner Microsite Leads
ALTER TABLE partner_microsite_leads ENABLE ROW LEVEL SECURITY;

-- Public can insert leads (form submissions)
CREATE POLICY "Anyone can submit leads"
ON partner_microsite_leads FOR INSERT
WITH CHECK (true);

-- Partners can view their own microsite leads
CREATE POLICY "Partners can view own microsite leads"
ON partner_microsite_leads FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_microsite_leads.partner_id
    AND partners.user_id = auth.uid()::text
  )
);

-- Admins can manage all microsite leads
CREATE POLICY "Admins can manage all microsite leads"
ON partner_microsite_leads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Partner Agreements
ALTER TABLE partner_agreements ENABLE ROW LEVEL SECURITY;

-- Partners can view active agreements
CREATE POLICY "Partners can view active agreements"
ON partner_agreements FOR SELECT
USING (
  is_active = true AND
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.user_id = auth.uid()::text
  )
);

-- Admins can manage all agreements
CREATE POLICY "Admins can manage all agreements"
ON partner_agreements FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Partner Agreement Acceptances
ALTER TABLE partner_agreement_acceptances ENABLE ROW LEVEL SECURITY;

-- Partners can view their own acceptances
CREATE POLICY "Partners can view own agreement acceptances"
ON partner_agreement_acceptances FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_agreement_acceptances.partner_id
    AND partners.user_id = auth.uid()::text
  )
);

-- Partners can insert their own acceptances
CREATE POLICY "Partners can insert own agreement acceptances"
ON partner_agreement_acceptances FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_id
    AND partners.user_id = auth.uid()::text
  )
);

-- Admins can manage all acceptances
CREATE POLICY "Admins can manage all agreement acceptances"
ON partner_agreement_acceptances FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Partner Bank Details
ALTER TABLE partner_bank_details ENABLE ROW LEVEL SECURITY;

-- Partners can view their own bank details
CREATE POLICY "Partners can view own bank details"
ON partner_bank_details FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_bank_details.partner_id
    AND partners.user_id = auth.uid()::text
  )
);

-- Partners can insert/update their own bank details
CREATE POLICY "Partners can manage own bank details"
ON partner_bank_details FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_id
    AND partners.user_id = auth.uid()::text
  )
);

CREATE POLICY "Partners can update own bank details"
ON partner_bank_details FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_bank_details.partner_id
    AND partners.user_id = auth.uid()::text
  )
);

-- Admins can manage all bank details
CREATE POLICY "Admins can manage all bank details"
ON partner_bank_details FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Partner Email Log
ALTER TABLE partner_email_log ENABLE ROW LEVEL SECURITY;

-- Partners can view their own email log
CREATE POLICY "Partners can view own email log"
ON partner_email_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partners
    WHERE partners.id = partner_email_log.partner_id
    AND partners.user_id = auth.uid()::text
  )
);

-- Admins can manage all email logs
CREATE POLICY "Admins can manage all email logs"
ON partner_email_log FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
