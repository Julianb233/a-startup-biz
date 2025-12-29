-- ============================================
-- Partner Onboarding & Microsite System Schema
-- Migration: 007_partner_onboarding
-- Purpose: Complete partner onboarding workflow
-- ============================================

-- ============================================
-- Partner Microsites Table
-- Template-based landing pages for partners
-- ============================================
CREATE TABLE IF NOT EXISTS partner_microsites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL UNIQUE,

  -- Content from scraping/partner input
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#ff6a1a',
  secondary_color VARCHAR(7) DEFAULT '#1a1a2e',
  hero_headline TEXT,
  hero_subheadline TEXT,
  description TEXT,

  -- Partner's website for scraping
  source_website TEXT,

  -- Scraped images from partner website (JSONB array)
  -- Example: [{"url": "...", "alt": "...", "position": 1}]
  images JSONB DEFAULT '[]'::jsonb,

  -- Configuration
  template_id VARCHAR(50) DEFAULT 'default',
  custom_css TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Form configuration
  form_title VARCHAR(255) DEFAULT 'Get Started Today',
  form_subtitle TEXT DEFAULT 'Fill out the form below and we''ll be in touch shortly.',
  form_fields JSONB DEFAULT '["name", "email", "phone"]'::jsonb,
  form_button_text VARCHAR(100) DEFAULT 'Submit',
  success_message TEXT DEFAULT 'Thank you! We''ll be in touch soon.',

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Stats
  page_views INTEGER DEFAULT 0,
  lead_submissions INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  last_scraped_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_microsites_slug ON partner_microsites(slug);
CREATE INDEX IF NOT EXISTS idx_microsites_partner ON partner_microsites(partner_id);
CREATE INDEX IF NOT EXISTS idx_microsites_active ON partner_microsites(is_active);

-- ============================================
-- Partner Agreements Table
-- Agreement document templates
-- ============================================
CREATE TABLE IF NOT EXISTS partner_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Agreement type
  agreement_type VARCHAR(50) NOT NULL,
  -- 'partner_agreement' | 'nda' | 'commission_structure'

  title VARCHAR(255) NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',

  -- Content stored as HTML for rendering
  content TEXT NOT NULL,

  -- Summary for quick preview
  summary TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT true,

  -- Order for display
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  effective_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agreements_type ON partner_agreements(agreement_type);
CREATE INDEX IF NOT EXISTS idx_agreements_active ON partner_agreements(is_active, is_required);

-- ============================================
-- Partner Agreement Acceptances Table
-- Click-to-accept records with legal tracking
-- ============================================
CREATE TABLE IF NOT EXISTS partner_agreement_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  agreement_id UUID NOT NULL REFERENCES partner_agreements(id) ON DELETE CASCADE,

  -- Acceptance details
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_by_user_id VARCHAR(255), -- Clerk user ID
  accepted_by_name VARCHAR(255),
  accepted_by_email VARCHAR(255),

  -- Legal tracking
  ip_address INET,
  user_agent TEXT,

  -- The exact version/content at time of acceptance
  agreement_version VARCHAR(20) NOT NULL,
  agreement_content_hash VARCHAR(64), -- SHA-256 of content

  -- Signature confirmation
  signature_text TEXT DEFAULT 'I have read and agree to the terms and conditions',

  -- Unique constraint - one acceptance per partner per agreement
  UNIQUE(partner_id, agreement_id)
);

CREATE INDEX IF NOT EXISTS idx_acceptances_partner ON partner_agreement_acceptances(partner_id);
CREATE INDEX IF NOT EXISTS idx_acceptances_agreement ON partner_agreement_acceptances(agreement_id);

-- ============================================
-- Microsite Leads Table
-- Form submissions from partner microsites
-- ============================================
CREATE TABLE IF NOT EXISTS microsite_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microsite_id UUID NOT NULL REFERENCES partner_microsites(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- Lead information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255),

  -- Optional fields for different microsite templates
  message TEXT,
  service_interest VARCHAR(255),
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'new',
  -- 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

  -- Notes from follow-up
  notes TEXT,

  -- Conversion tracking
  converted_to_partner_lead_id UUID REFERENCES partner_leads(id),
  commission_eligible BOOLEAN DEFAULT true,

  -- Source tracking
  source_url TEXT,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  -- Device info
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(50), -- 'mobile' | 'tablet' | 'desktop'

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_microsite_leads_microsite ON microsite_leads(microsite_id);
CREATE INDEX IF NOT EXISTS idx_microsite_leads_partner ON microsite_leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_microsite_leads_status ON microsite_leads(status);
CREATE INDEX IF NOT EXISTS idx_microsite_leads_email ON microsite_leads(email);
CREATE INDEX IF NOT EXISTS idx_microsite_leads_created ON microsite_leads(created_at DESC);

-- ============================================
-- Partner Bank Details Table
-- Secure bank account storage for payouts
-- ============================================
CREATE TABLE IF NOT EXISTS partner_bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL UNIQUE REFERENCES partners(id) ON DELETE CASCADE,

  -- Account holder info
  account_holder_name VARCHAR(255) NOT NULL,
  account_holder_type VARCHAR(20) DEFAULT 'individual',
  -- 'individual' | 'business'

  -- Bank account (encrypted at application level)
  bank_name VARCHAR(255),
  routing_number_encrypted TEXT,
  account_number_encrypted TEXT,
  account_number_last4 VARCHAR(4),
  account_type VARCHAR(20) DEFAULT 'checking',
  -- 'checking' | 'savings'

  -- Status
  is_verified BOOLEAN DEFAULT false,
  verification_status VARCHAR(50) DEFAULT 'pending',
  -- 'pending' | 'verified' | 'failed'
  verification_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bank_details_partner ON partner_bank_details(partner_id);

-- ============================================
-- Partner Email Logs Table
-- Track email delivery for partners
-- ============================================
CREATE TABLE IF NOT EXISTS partner_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  email_type VARCHAR(100) NOT NULL,
  -- 'welcome' | 'agreement_reminder' | 'microsite_ready' | 'payout_notification' | 'lead_notification'

  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,

  -- Template and content tracking
  template_id VARCHAR(100),
  template_data JSONB,

  -- Delivery status
  status VARCHAR(50) DEFAULT 'sent',
  -- 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'

  -- Email service tracking
  resend_message_id VARCHAR(255), -- From Resend API

  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_email_logs_partner ON partner_email_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON partner_email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON partner_email_logs(status);

-- ============================================
-- Updates to Partners Table
-- Add onboarding tracking fields
-- ============================================
ALTER TABLE partners ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS microsite_id UUID REFERENCES partner_microsites(id);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS agreements_completed BOOLEAN DEFAULT false;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS agreements_completed_at TIMESTAMPTZ;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS payment_details_submitted BOOLEAN DEFAULT false;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS onboarding_step VARCHAR(50) DEFAULT 'pending_approval';
-- 'pending_approval' | 'sign_agreements' | 'payment_details' | 'completed'
ALTER TABLE partners ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT false;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Index for onboarding queries
CREATE INDEX IF NOT EXISTS idx_partners_onboarding_step ON partners(onboarding_step);

-- ============================================
-- Update Triggers
-- ============================================
DROP TRIGGER IF EXISTS update_microsites_updated_at ON partner_microsites;
CREATE TRIGGER update_microsites_updated_at
    BEFORE UPDATE ON partner_microsites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_microsite_leads_updated_at ON microsite_leads;
CREATE TRIGGER update_microsite_leads_updated_at
    BEFORE UPDATE ON microsite_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bank_details_updated_at ON partner_bank_details;
CREATE TRIGGER update_bank_details_updated_at
    BEFORE UPDATE ON partner_bank_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Trigger: Update microsite lead count
-- ============================================
CREATE OR REPLACE FUNCTION update_microsite_lead_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE partner_microsites
    SET lead_submissions = lead_submissions + 1
    WHERE id = NEW.microsite_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE partner_microsites
    SET lead_submissions = GREATEST(0, lead_submissions - 1)
    WHERE id = OLD.microsite_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lead_count_on_submission ON microsite_leads;
CREATE TRIGGER update_lead_count_on_submission
    AFTER INSERT OR DELETE ON microsite_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_microsite_lead_count();

-- ============================================
-- Trigger: Check all agreements signed
-- ============================================
CREATE OR REPLACE FUNCTION check_agreements_completion()
RETURNS TRIGGER AS $$
DECLARE
  required_count INTEGER;
  signed_count INTEGER;
BEGIN
  -- Count required agreements
  SELECT COUNT(*) INTO required_count
  FROM partner_agreements
  WHERE is_active = true AND is_required = true;

  -- Count signed agreements for this partner
  SELECT COUNT(*) INTO signed_count
  FROM partner_agreement_acceptances
  WHERE partner_id = NEW.partner_id;

  -- Update partner if all required agreements are signed
  IF signed_count >= required_count THEN
    UPDATE partners
    SET
      agreements_completed = true,
      agreements_completed_at = NOW(),
      onboarding_step = CASE
        WHEN payment_details_submitted = true THEN 'completed'
        ELSE 'payment_details'
      END
    WHERE id = NEW.partner_id AND agreements_completed = false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_agreements_on_acceptance ON partner_agreement_acceptances;
CREATE TRIGGER check_agreements_on_acceptance
    AFTER INSERT ON partner_agreement_acceptances
    FOR EACH ROW
    EXECUTE FUNCTION check_agreements_completion();

-- ============================================
-- Trigger: Update onboarding step on bank details
-- ============================================
CREATE OR REPLACE FUNCTION update_onboarding_on_bank_details()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE partners
  SET
    payment_details_submitted = true,
    onboarding_step = CASE
      WHEN agreements_completed = true THEN 'completed'
      ELSE onboarding_step
    END
  WHERE id = NEW.partner_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_onboarding_on_bank_insert ON partner_bank_details;
CREATE TRIGGER update_onboarding_on_bank_insert
    AFTER INSERT ON partner_bank_details
    FOR EACH ROW
    EXECUTE FUNCTION update_onboarding_on_bank_details();

-- ============================================
-- Seed Initial Agreement Templates
-- ============================================
INSERT INTO partner_agreements (agreement_type, title, version, content, summary, sort_order, is_required)
VALUES
  (
    'partner_agreement',
    'Partner Program Agreement',
    '1.0',
    '<h2>Partner Program Agreement</h2>
<p>This Partner Program Agreement ("Agreement") is entered into between A Startup Biz ("Company") and the Partner identified in the Partner Portal registration ("Partner").</p>

<h3>1. Program Participation</h3>
<p>Partner agrees to participate in the Company''s referral program and promote Company''s services to potential clients in accordance with the terms of this Agreement.</p>

<h3>2. Partner Responsibilities</h3>
<ul>
<li>Accurately represent Company''s services and capabilities</li>
<li>Provide qualified referrals that meet program criteria</li>
<li>Maintain professional standards in all client interactions</li>
<li>Comply with all applicable laws and regulations</li>
</ul>

<h3>3. Company Responsibilities</h3>
<ul>
<li>Provide Partner with necessary marketing materials</li>
<li>Process referrals in a timely manner</li>
<li>Pay commissions as outlined in the Commission Structure Agreement</li>
<li>Provide Partner Portal access for referral tracking</li>
</ul>

<h3>4. Term and Termination</h3>
<p>This Agreement begins upon acceptance and continues until terminated by either party with 30 days written notice. Company may terminate immediately for breach of any agreement terms.</p>

<h3>5. Intellectual Property</h3>
<p>Partner is granted a limited, non-exclusive license to use Company trademarks solely for referral activities. All intellectual property remains the property of Company.</p>

<h3>6. Limitation of Liability</h3>
<p>Company''s liability under this Agreement shall not exceed the total commissions paid to Partner in the 12 months preceding any claim.</p>

<h3>7. Governing Law</h3>
<p>This Agreement shall be governed by the laws of the State of Delaware.</p>',
    'Main agreement outlining partner program terms, responsibilities, and conditions.',
    1,
    true
  ),
  (
    'nda',
    'Non-Disclosure Agreement',
    '1.0',
    '<h2>Non-Disclosure Agreement</h2>
<p>This Non-Disclosure Agreement ("NDA") is entered into between A Startup Biz ("Disclosing Party") and the Partner ("Receiving Party").</p>

<h3>1. Definition of Confidential Information</h3>
<p>Confidential Information includes, but is not limited to:</p>
<ul>
<li>Client information and contact details</li>
<li>Business strategies and marketing plans</li>
<li>Pricing structures and commission rates</li>
<li>Proprietary processes and methodologies</li>
<li>Technical information and trade secrets</li>
</ul>

<h3>2. Obligations</h3>
<p>The Receiving Party agrees to:</p>
<ul>
<li>Maintain strict confidentiality of all Confidential Information</li>
<li>Use Confidential Information only for purposes of the partnership</li>
<li>Not disclose to third parties without written consent</li>
<li>Take reasonable measures to protect Confidential Information</li>
</ul>

<h3>3. Exclusions</h3>
<p>This NDA does not apply to information that:</p>
<ul>
<li>Is publicly available through no fault of Receiving Party</li>
<li>Was known to Receiving Party prior to disclosure</li>
<li>Is independently developed by Receiving Party</li>
<li>Is required to be disclosed by law</li>
</ul>

<h3>4. Term</h3>
<p>This NDA remains in effect for 3 years from the date of acceptance and survives termination of the Partner Agreement.</p>

<h3>5. Remedies</h3>
<p>Receiving Party acknowledges that breach may cause irreparable harm and agrees that Disclosing Party may seek injunctive relief in addition to other remedies.</p>',
    'Protects confidential business information shared during the partnership.',
    2,
    true
  ),
  (
    'commission_structure',
    'Commission Structure Agreement',
    '1.0',
    '<h2>Commission Structure Agreement</h2>
<p>This Commission Structure Agreement outlines the compensation terms for referrals made by Partner.</p>

<h3>1. Commission Rates</h3>
<table>
<tr><th>Service Category</th><th>Commission Rate</th></tr>
<tr><td>Business Formation Services</td><td>15% of first-year revenue</td></tr>
<tr><td>Web Development & Design</td><td>12% of project value</td></tr>
<tr><td>Marketing & SEO Services</td><td>10% of first 6 months</td></tr>
<tr><td>Consulting Services</td><td>10% of engagement value</td></tr>
<tr><td>Other Services</td><td>8% of contract value</td></tr>
</table>

<h3>2. Qualification Requirements</h3>
<p>Referrals must meet the following criteria to be commission-eligible:</p>
<ul>
<li>Client must be new to Company (not existing client)</li>
<li>Client must sign a service agreement within 90 days of referral</li>
<li>Partner must be in good standing at time of conversion</li>
<li>Referral must be properly submitted through Partner Portal</li>
</ul>

<h3>3. Payment Terms</h3>
<ul>
<li>Commissions are calculated upon client payment receipt</li>
<li>Payments processed monthly for amounts over $50</li>
<li>Balances under $50 roll over to next month</li>
<li>Payment via bank transfer to Partner''s designated account</li>
</ul>

<h3>4. Commission Adjustments</h3>
<ul>
<li>Refunded or cancelled orders result in commission reversal</li>
<li>Disputed charges may delay commission payment</li>
<li>Partial refunds result in proportional commission adjustment</li>
</ul>

<h3>5. Performance Bonuses</h3>
<table>
<tr><th>Monthly Referrals</th><th>Bonus</th></tr>
<tr><td>5-9 converted referrals</td><td>5% bonus on all commissions</td></tr>
<tr><td>10-19 converted referrals</td><td>10% bonus on all commissions</td></tr>
<tr><td>20+ converted referrals</td><td>15% bonus on all commissions</td></tr>
</table>

<h3>6. Tier Advancement</h3>
<p>Partners advance through tiers based on cumulative performance:</p>
<ul>
<li><strong>Bronze:</strong> 0-24 lifetime conversions</li>
<li><strong>Silver:</strong> 25-99 lifetime conversions (+2% base commission)</li>
<li><strong>Gold:</strong> 100-249 lifetime conversions (+5% base commission)</li>
<li><strong>Platinum:</strong> 250+ lifetime conversions (+8% base commission)</li>
</ul>',
    'Details commission rates, payment terms, and performance bonuses.',
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- Verification
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Migration 007_partner_onboarding completed successfully';
END $$;
