-- ============================================
-- A Startup Biz - Admin Audit Log
-- Migration: 014_audit_log
-- Created: 2025-12-29
-- ============================================

-- Admin Audit Log Table
-- Tracks all admin actions for security and compliance
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON admin_audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON admin_audit_log(created_at DESC);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_audit_log_user_action ON admin_audit_log(user_id, action, created_at DESC);

-- ============================================
-- END OF MIGRATION
-- ============================================
