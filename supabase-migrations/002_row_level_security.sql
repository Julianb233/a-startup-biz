-- A Startup Biz - Row Level Security Policies
-- Date: 2025-12-28

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_call_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is partner
CREATE OR REPLACE FUNCTION is_partner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM partners
    WHERE user_id = auth.uid()
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's partner ID
CREATE OR REPLACE FUNCTION get_partner_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM partners
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (is_admin());

-- ============================================================================
-- ONBOARDING & LEAD CAPTURE POLICIES
-- ============================================================================

-- Onboarding submissions - users can view/manage their own
CREATE POLICY "Users can view own onboarding"
ON onboarding_submissions FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create onboarding"
ON onboarding_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own onboarding"
ON onboarding_submissions FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view/manage all onboarding submissions
CREATE POLICY "Admins can view all onboarding"
ON onboarding_submissions FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can manage all onboarding"
ON onboarding_submissions FOR UPDATE
USING (is_admin());

-- Contact submissions - authenticated users can create, admins can view all
CREATE POLICY "Anyone can create contact submissions"
ON contact_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions"
ON contact_submissions FOR SELECT
USING (is_admin());

-- Book call submissions - users can view their own, admins can view all
CREATE POLICY "Users can view own book call"
ON book_call_submissions FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create book call"
ON book_call_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all book calls"
ON book_call_submissions FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can manage all book calls"
ON book_call_submissions FOR UPDATE
USING (is_admin());

-- ============================================================================
-- CONSULTATION & SERVICE MANAGEMENT POLICIES
-- ============================================================================

-- Consultations - users can view their own, admins can view all
CREATE POLICY "Users can view own consultations"
ON consultations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create consultations"
ON consultations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all consultations"
ON consultations FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can manage all consultations"
ON consultations FOR ALL
USING (is_admin());

-- Quotes - users can view their own, admins can manage all
CREATE POLICY "Users can view own quotes"
ON quotes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can accept quotes"
ON quotes FOR UPDATE
USING (auth.uid() = user_id AND status IN ('sent', 'viewed'));

CREATE POLICY "Admins can manage all quotes"
ON quotes FOR ALL
USING (is_admin());

-- Bookings - users can view their own, admins can manage all
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bookings"
ON bookings FOR ALL
USING (is_admin());

-- ============================================================================
-- ORDER & FULFILLMENT POLICIES
-- ============================================================================

-- Orders - users can view their own, admins can manage all
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
ON orders FOR ALL
USING (is_admin());

-- Service progress - users can view their order progress
CREATE POLICY "Users can view own service progress"
ON service_progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage service progress"
ON service_progress FOR ALL
USING (is_admin());

-- Fulfillment tasks - only admins can view/manage
CREATE POLICY "Admins can manage fulfillment tasks"
ON fulfillment_tasks FOR ALL
USING (is_admin());

-- Documents - users can view their own documents
CREATE POLICY "Users can view own documents"
ON documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all documents"
ON documents FOR ALL
USING (is_admin());

-- Action items - users can view/manage their own tasks
CREATE POLICY "Users can view own action items"
ON action_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own action items"
ON action_items FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all action items"
ON action_items FOR SELECT
USING (is_admin());

-- ============================================================================
-- PARTNER & REFERRAL POLICIES
-- ============================================================================

-- Partners - users can view their own partner profile
CREATE POLICY "Users can view own partner profile"
ON partners FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create partner profile"
ON partners FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own partner profile"
ON partners FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all partners"
ON partners FOR ALL
USING (is_admin());

-- Partner leads - partners can view/manage their own leads
CREATE POLICY "Partners can view own leads"
ON partner_leads FOR SELECT
USING (
  partner_id = get_partner_id()
  AND is_partner()
);

CREATE POLICY "Partners can create leads"
ON partner_leads FOR INSERT
WITH CHECK (
  partner_id = get_partner_id()
  AND is_partner()
);

CREATE POLICY "Partners can update own leads"
ON partner_leads FOR UPDATE
USING (
  partner_id = get_partner_id()
  AND is_partner()
);

CREATE POLICY "Admins can manage all partner leads"
ON partner_leads FOR ALL
USING (is_admin());

-- Partner profiles - partners can manage their own profile
CREATE POLICY "Partners can view own profile"
ON partner_profiles FOR SELECT
USING (
  partner_id = get_partner_id()
  AND is_partner()
);

CREATE POLICY "Partners can manage own profile"
ON partner_profiles FOR ALL
USING (
  partner_id = get_partner_id()
  AND is_partner()
);

CREATE POLICY "Admins can manage all partner profiles"
ON partner_profiles FOR ALL
USING (is_admin());

-- Referrals - users can view their own referrals
CREATE POLICY "Users can view own referrals"
ON referrals FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can create referrals"
ON referrals FOR INSERT
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can manage all referrals"
ON referrals FOR ALL
USING (is_admin());

-- Referral links - users can view/manage their own links
CREATE POLICY "Users can view own referral links"
ON referral_links FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create referral links"
ON referral_links FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own referral links"
ON referral_links FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================================================
-- ADMIN NOTES POLICIES
-- ============================================================================

-- Only admins can view/manage admin notes
CREATE POLICY "Admins can manage admin notes"
ON admin_notes FOR ALL
USING (is_admin());

-- ============================================================================
-- SERVICE ACCOUNT POLICIES
-- ============================================================================

-- Allow service role to bypass RLS for all operations
-- This is configured in Supabase settings, not via SQL policies
