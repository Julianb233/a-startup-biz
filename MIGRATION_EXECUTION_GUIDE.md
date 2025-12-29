# Database Migration Execution Guide

**A Startup Biz - Stripe Connect & Partner Onboarding Deployment**

---

## Overview

This guide walks through executing two critical database migrations:
1. **Migration 006** - Stripe Connect Integration (Payout Infrastructure)
2. **Migration 007** - Partner Onboarding System (Complete Workflow)

Both migrations have been prepared and are ready for execution against the Neon PostgreSQL database.

---

## Pre-Execution Checklist

- [ ] Database credentials verified in `.env.local`
- [ ] Network connectivity to Neon database confirmed
- [ ] No other migrations or schema changes in progress
- [ ] Backup of database has been created (optional but recommended)
- [ ] Development team notified of migration window
- [ ] Rollback procedure reviewed and understood

---

## Step 1: Verify Database Connection

### Using the provided test script:
```bash
cd /Users/julianbradley/github-repos/a-startup-biz
npm install  # Ensure dependencies are installed
```

### Test connection:
```bash
# Using existing migration framework
npx tsx scripts/check-db-schema.ts
```

**Expected Output:**
```
✅ Database connected successfully
📊 Current tables: [list of existing tables]
```

---

## Step 2: Execute Migrations

### Method 1: Using the Node.js Runner (Recommended)

```bash
cd /Users/julianbradley/github-repos/a-startup-biz

# Set environment variable
export DATABASE_URL="postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Run migrations
node scripts/run-migrations.js
```

**Expected Output:**
```
🚀 A Startup Biz - Database Migration Runner

🔗 Database: postgresql://neondb_owner:****@ep-super-cell-ahv3o7y6-pooler...

📊 Ensuring migration tracking table exists...
   ✅ Migration tracking table ready

✅ Already applied migrations: None

📄 Running migration: 006_stripe_connect
   Found 58 SQL statements
   ✅ Successfully executed 58 statements
   📝 Recorded in schema_migrations table

📄 Running migration: 007_partner_onboarding
   Found 63 SQL statements
   ✅ Successfully executed 63 statements
   📝 Recorded in schema_migrations table

============================================================
📊 MIGRATION SUMMARY
============================================================
✅ 006_stripe_connect
✅ 007_partner_onboarding
============================================================

Results: 2 successful, 0 failed

🔍 Verifying database state...

✅ Stripe Connect tables created:
   - partner_payouts
   - partner_transfers
   - stripe_connect_events

✅ Partner Onboarding tables created:
   - microsite_leads
   - partner_agreement_acceptances
   - partner_agreements
   - partner_bank_details
   - partner_email_logs
   - partner_microsites

✅ Verifying partners table enhancements...
✅ New columns in partners table:
   - agreements_completed
   - microsite_id
   - onboarding_step
   - stripe_account_id

✅ All migrations completed successfully!

📋 Next steps:
   1. Deploy the application code changes
   2. Test Stripe Connect integration endpoints
   3. Test partner onboarding workflow
   4. Monitor database performance and connections
```

### Method 2: Using TypeScript Runner

```bash
cd /Users/julianbradley/github-repos/a-startup-biz

npx tsx scripts/execute-pending-migrations.ts
```

### Method 3: Manual Execution (For Debugging)

If automated runners have issues, execute migrations manually:

```bash
# Using the existing migration runner
npx tsx scripts/run-migration.ts 006_stripe_connect
npx tsx scripts/run-migration.ts 007_partner_onboarding
```

---

## Step 3: Verify Migration Success

### Check Migration Tracking Table
```bash
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT migration_name, executed_at FROM schema_migrations ORDER BY executed_at"
```

**Expected Output:**
```
        migration_name       |           executed_at
-----------------------------+-------------------------------
 006_stripe_connect          | 2025-12-29 14:30:15.123456+00
 007_partner_onboarding      | 2025-12-29 14:30:45.234567+00
(2 rows)
```

### Verify Stripe Connect Tables
```bash
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('partner_transfers', 'partner_payouts', 'stripe_connect_events') ORDER BY table_name"
```

**Expected Output:**
```
         table_name
-----------------------
 partner_payouts
 partner_transfers
 stripe_connect_events
(3 rows)
```

### Verify Partner Onboarding Tables
```bash
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('partner_microsites', 'partner_agreements', 'partner_agreement_acceptances', 'microsite_leads', 'partner_bank_details', 'partner_email_logs') ORDER BY table_name"
```

**Expected Output:**
```
             table_name
---------------------------------
 microsite_leads
 partner_agreement_acceptances
 partner_agreements
 partner_bank_details
 partner_email_logs
 partner_microsites
(6 rows)
```

### Verify Partners Table Enhancements
```bash
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name IN ('stripe_account_id', 'onboarding_step', 'microsite_id', 'agreements_completed') ORDER BY column_name"
```

**Expected Output:**
```
       column_name      | data_type
------------------------+-----------
 agreements_completed   | boolean
 microsite_id           | uuid
 onboarding_step        | character varying
 stripe_account_id      | character varying
(4 rows)
```

### Verify Seed Data (Agreement Templates)
```bash
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT agreement_type, title, version FROM partner_agreements ORDER BY sort_order"
```

**Expected Output:**
```
    agreement_type     |         title          | version
-----------------------+------------------------+---------
 partner_agreement     | Partner Program Agreement | 1.0
 nda                   | Non-Disclosure Agreement | 1.0
 commission_structure  | Commission Structure Agreement | 1.0
(3 rows)
```

---

## Step 4: Post-Migration Testing

### Test 1: Stripe Connect Flow
```bash
# Create a test partner record with Stripe Connect fields
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "
    INSERT INTO partners (id, name, email, stripe_account_id, stripe_account_status)
    VALUES (gen_random_uuid(), 'Test Partner', 'test@example.com', 'acct_test123', 'pending')
    RETURNING id, stripe_account_id, stripe_account_status
  "
```

**Expected:** Record created with Stripe fields populated

### Test 2: Partner Onboarding Workflow
```bash
# Create a test partner and microsite
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "
    WITH partner AS (
      INSERT INTO partners (id, name, email, onboarding_step)
      VALUES (gen_random_uuid(), 'Test Partner 2', 'test2@example.com', 'pending_approval')
      RETURNING id
    )
    INSERT INTO partner_microsites (partner_id, slug, company_name)
    VALUES ((SELECT id FROM partner), 'test-partner-2', 'Test Company Inc')
    RETURNING id, slug
  "
```

**Expected:** Microsite record created

### Test 3: Agreement Acceptance Trigger
```bash
# Verify agreement acceptance trigger works
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "
    SELECT COUNT(*) as required_agreements
    FROM partner_agreements
    WHERE is_active = true AND is_required = true
  "
```

**Expected:** 3 required agreements

### Test 4: Lead Submission
```bash
# Test microsite lead submission
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "
    -- First get a valid microsite ID
    WITH ms AS (SELECT id, partner_id FROM partner_microsites LIMIT 1)
    INSERT INTO microsite_leads (microsite_id, partner_id, name, email, status)
    SELECT ms.id, ms.partner_id, 'John Doe', 'john@example.com', 'new'
    FROM ms
    RETURNING id, status
  "
```

**Expected:** Lead record created with 'new' status

---

## Troubleshooting

### Issue: Database connection fails
**Solution:**
1. Verify DATABASE_URL environment variable is set correctly
2. Check that Neon PostgreSQL database is accessible
3. Verify firewall rules allow outbound connections to Neon
4. Try connection with detailed error output:
   ```bash
   psql -v ON_ERROR_STOP=on "postgresql://..." -c "SELECT 1"
   ```

### Issue: "Table already exists" error
**Solution:**
- This is expected if running migrations multiple times
- The migration runner handles this with "IF NOT EXISTS" clauses
- Continue running - idempotent operations will be skipped

### Issue: Foreign key constraint violations
**Solution:**
1. Ensure parent tables exist (partners table must exist)
2. Verify no data integrity issues
3. Check that previous migrations (001-005) have been applied
4. Review /Users/julianbradley/github-repos/a-startup-biz/MIGRATION_REPORT.md for dependencies

### Issue: Trigger or function creation fails
**Solution:**
1. Check for syntax errors in migration SQL
2. Verify PostgreSQL version supports trigger syntax
3. Check that required tables exist
4. Review Neon PostgreSQL documentation for compatibility

### Issue: Permission denied for schema modification
**Solution:**
1. Verify database user has ALTER TABLE permissions
2. Check that user is not restricted by RLS policies
3. Try with unpooled connection if using pooled:
   ```bash
   DATABASE_URL_UNPOOLED="..." node scripts/run-migrations.js
   ```

---

## Rollback Procedure (If Needed)

### Full Rollback to Pre-Migration State

```bash
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  << 'EOF'

-- Disable foreign key constraints temporarily
ALTER TABLE partner_agreement_acceptances DISABLE TRIGGER ALL;
ALTER TABLE microsite_leads DISABLE TRIGGER ALL;
ALTER TABLE partner_bank_details DISABLE TRIGGER ALL;

-- Drop Migration 007 tables
DROP TABLE IF EXISTS partner_email_logs CASCADE;
DROP TABLE IF EXISTS partner_bank_details CASCADE;
DROP TABLE IF EXISTS microsite_leads CASCADE;
DROP TABLE IF EXISTS partner_agreement_acceptances CASCADE;
DROP TABLE IF EXISTS partner_agreements CASCADE;
DROP TABLE IF EXISTS partner_microsites CASCADE;

-- Drop Migration 007 functions
DROP FUNCTION IF EXISTS check_agreements_completion() CASCADE;
DROP FUNCTION IF EXISTS update_onboarding_on_bank_details() CASCADE;
DROP FUNCTION IF EXISTS update_microsite_lead_count() CASCADE;

-- Drop Migration 006 tables
DROP TABLE IF EXISTS stripe_connect_events CASCADE;
DROP TABLE IF EXISTS partner_payouts CASCADE;
DROP TABLE IF EXISTS partner_transfers CASCADE;

-- Drop Migration 006 functions
DROP FUNCTION IF EXISTS update_partner_balance() CASCADE;

-- Remove Migration 007 columns from partners
ALTER TABLE partners DROP COLUMN IF EXISTS approved_at;
ALTER TABLE partners DROP COLUMN IF EXISTS approved_by;
ALTER TABLE partners DROP COLUMN IF EXISTS microsite_id;
ALTER TABLE partners DROP COLUMN IF EXISTS agreements_completed;
ALTER TABLE partners DROP COLUMN IF EXISTS agreements_completed_at;
ALTER TABLE partners DROP COLUMN IF EXISTS payment_details_submitted;
ALTER TABLE partners DROP COLUMN IF EXISTS onboarding_step;
ALTER TABLE partners DROP COLUMN IF EXISTS welcome_email_sent;
ALTER TABLE partners DROP COLUMN IF EXISTS welcome_email_sent_at;
ALTER TABLE partners DROP COLUMN IF EXISTS website_url;

-- Remove Migration 006 columns from partners
ALTER TABLE partners DROP COLUMN IF EXISTS stripe_account_id;
ALTER TABLE partners DROP COLUMN IF EXISTS stripe_account_status;
ALTER TABLE partners DROP COLUMN IF EXISTS stripe_onboarding_complete;
ALTER TABLE partners DROP COLUMN IF EXISTS stripe_payouts_enabled;
ALTER TABLE partners DROP COLUMN IF EXISTS stripe_charges_enabled;
ALTER TABLE partners DROP COLUMN IF EXISTS stripe_details_submitted;
ALTER TABLE partners DROP COLUMN IF EXISTS stripe_connected_at;
ALTER TABLE partners DROP COLUMN IF EXISTS available_balance;
ALTER TABLE partners DROP COLUMN IF EXISTS pending_balance;
ALTER TABLE partners DROP COLUMN IF EXISTS minimum_payout_threshold;

-- Remove migration records
DELETE FROM schema_migrations WHERE migration_name IN ('006_stripe_connect', '007_partner_onboarding');

COMMIT;
EOF
```

---

## Post-Deployment Tasks

### 1. Update Application Code
- Deploy Stripe Connect webhook handlers
- Deploy partner onboarding UI components
- Deploy microsite rendering system
- Deploy email notification system

### 2. Initialize System Data
- Load agreement templates into application
- Configure Stripe API keys
- Set up email templates

### 3. Test End-to-End Workflows
- Partner signup → approval → Stripe Connect
- Partner signup → agreement acceptance → bank details
- Microsite creation → lead capture → CRM sync

### 4. Monitor Database Performance
```bash
# Monitor query performance
psql "postgresql://neondb_owner:npg_5CFuZnlkSs7m@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10"
```

### 5. Set Up Monitoring Alerts
- Monitor failed transfers/payouts
- Alert on lead submission spike
- Track database connection pool usage
- Monitor query performance

---

## Support & References

**Files Created:**
- `/Users/julianbradley/github-repos/a-startup-biz/scripts/run-migrations.js` - Node.js migration runner
- `/Users/julianbradley/github-repos/a-startup-biz/scripts/execute-pending-migrations.ts` - TypeScript runner
- `/Users/julianbradley/github-repos/a-startup-biz/MIGRATION_REPORT.md` - Detailed technical report
- `/Users/julianbradley/github-repos/a-startup-biz/MIGRATION_EXECUTION_GUIDE.md` - This guide

**Database Credentials:** Stored in `/Users/julianbradley/github-repos/a-startup-biz/.env.local`

**Questions?** Review the migration files directly:
- `scripts/migrations/006_stripe_connect.sql`
- `scripts/migrations/007_partner_onboarding.sql`

---

## Final Checklist

- [ ] All verification queries return expected results
- [ ] schema_migrations table shows both migrations applied
- [ ] All 6 new tables exist in database
- [ ] All 10 new columns exist in partners table
- [ ] 3 agreement templates seeded successfully
- [ ] Test data insertion succeeds
- [ ] Application code changes deployed
- [ ] Monitoring and alerts configured
- [ ] Team notified of migration completion
- [ ] Rollback procedure documented and tested

**Migration Status:** READY FOR DEPLOYMENT ✅
