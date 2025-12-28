# Database Migrations

This directory contains SQL migration files for the A Startup Biz database schema.

## Overview

The database uses **Neon PostgreSQL** with migrations managed through numbered SQL files.

## Migration Files

| File | Description | Status |
|------|-------------|--------|
| `001_full_schema.sql` | Initial database schema with all tables | ✅ Base |
| `003_query_optimization.sql` | Query performance optimizations | ✅ Active |
| `004_enhanced_onboarding.sql` | Enhanced onboarding with JSONB storage | ✅ **New** |

## Running Migrations

### Prerequisites

1. Ensure `DATABASE_URL` is set in your `.env` file:
   ```bash
   DATABASE_URL=postgresql://user:password@host/database
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Run a Specific Migration

```bash
pnpm tsx scripts/run-migration.ts 004_enhanced_onboarding
```

### Run All Migrations

```bash
pnpm tsx scripts/run-migration.ts all
```

### Manual Execution

You can also run migrations manually using `psql` or your database client:

```bash
psql $DATABASE_URL -f scripts/migrations/004_enhanced_onboarding.sql
```

## Migration 004: Enhanced Onboarding

### What This Migration Does

1. **Adds `form_data` JSONB column** - Stores the complete onboarding form data in a structured, queryable format
2. **Adds tracking columns**:
   - `source` - Where the submission came from (e.g., 'onboarding_form')
   - `ip_address` - Client IP for analytics and fraud prevention
   - `user_agent` - Device/browser information
   - `referral_code` - Referral tracking
   - `completion_percentage` - Track partial vs complete submissions

3. **Performance indexes**:
   - GIN index on `form_data` for fast JSON queries
   - Index on `contact_email` for lookups
   - Composite index on `status` + `created_at` for admin dashboard

4. **Data integrity constraints**:
   - Email format validation
   - Completion percentage bounds (0-100)

5. **Helper functions**:
   - `get_onboarding_stats()` - Get submission statistics
   - `search_onboarding_by_service(TEXT)` - Search by service interest

6. **Views**:
   - `onboarding_submissions_detailed` - Expanded view with extracted JSON fields

### Schema Changes

#### New Columns Added to `onboarding_submissions`

```sql
form_data JSONB              -- Complete form data (see structure below)
source VARCHAR(100)          -- Submission source
ip_address VARCHAR(45)       -- Client IP address
user_agent TEXT              -- User agent string
referral_code VARCHAR(50)    -- Referral tracking code
completion_percentage INT    -- 0-100 completion status
```

#### Form Data Structure

The `form_data` JSONB column contains:

```json
{
  "companyName": "Example Corp",
  "companySize": "2-5 employees",
  "revenueRange": "$100k - $500k",
  "yearsInBusiness": "3",
  "website": "https://example.com",
  "industry": "Adventure & Outdoor Recreation",
  "businessGoals": ["Increase online visibility", "Generate more leads"],
  "primaryChallenge": "Need better online presence",
  "timeline": "Short-term (1-3 months)",
  "currentTools": ["CRM", "Email Marketing"],
  "teamSize": "5",
  "budgetRange": "$10,000 - $25,000",
  "servicesInterested": ["Web Design & Development", "Marketing & SEO"],
  "priorityLevel": "High - Important",
  "brandStyle": "Modern & Minimal",
  "primaryColor": "#3B82F6",
  "secondaryColor": "#10B981",
  "businessCategory": "Climbing Gym",
  "socialMedia": {
    "facebook": "https://facebook.com/example",
    "instagram": "@example",
    "linkedin": "company/example"
  },
  "contactName": "John Doe",
  "contactEmail": "john@example.com",
  "contactPhone": "+1-555-0123",
  "bestTimeToCall": "Morning (8am-12pm)",
  "timezone": "Eastern (ET)",
  "communicationPreference": "Email",
  "selectedPlan": "growth",
  "paymentMethod": "full"
}
```

### Querying the New Schema

#### Get all submissions with specific service interest

```sql
SELECT * FROM search_onboarding_by_service('Web Design & Development');
```

#### Get onboarding statistics

```sql
SELECT * FROM get_onboarding_stats();
```

#### Query by JSON fields

```sql
-- Find submissions with specific budget range
SELECT
  business_name,
  contact_email,
  form_data->>'budgetRange' as budget
FROM onboarding_submissions
WHERE form_data->>'budgetRange' = '$10,000 - $25,000';

-- Find submissions interested in multiple services
SELECT
  business_name,
  form_data->'servicesInterested' as services
FROM onboarding_submissions
WHERE form_data->'servicesInterested' @> '["Marketing & SEO"]';

-- Get all submissions with social media links
SELECT
  business_name,
  form_data->'socialMedia'->>'instagram' as instagram,
  form_data->'socialMedia'->>'facebook' as facebook
FROM onboarding_submissions
WHERE form_data->'socialMedia' IS NOT NULL;
```

#### Use the detailed view

```sql
SELECT
  business_name,
  contact_name,
  contact_email,
  company_size,
  revenue_range,
  priority_level,
  selected_plan,
  status
FROM onboarding_submissions_detailed
WHERE status = 'submitted'
ORDER BY created_at DESC;
```

### Application Integration

The API route (`/app/api/onboarding/route.ts`) now automatically:

1. Captures the complete form data in the `form_data` JSONB field
2. Tracks IP address and user agent for analytics
3. Stores referral codes for attribution
4. Maintains backward compatibility with `additional_info` field

### Rollback

If you need to rollback this migration:

```sql
-- See the commented rollback section at the end of 004_enhanced_onboarding.sql
-- Or run:
DROP VIEW IF EXISTS onboarding_submissions_detailed;
DROP FUNCTION IF EXISTS get_onboarding_stats();
DROP FUNCTION IF EXISTS search_onboarding_by_service(TEXT);
ALTER TABLE onboarding_submissions DROP COLUMN IF EXISTS form_data CASCADE;
-- ... (see full rollback in migration file)
```

## Best Practices

1. **Always backup before running migrations** - Especially in production
2. **Test migrations locally first** - Use a development database
3. **Run migrations during low-traffic periods** - Minimize impact
4. **Monitor performance after migration** - Check query performance
5. **Keep migrations idempotent** - Use `IF NOT EXISTS` and `IF EXISTS`

## Troubleshooting

### Migration Already Applied

If you see "already exists" errors, the migration may have already been applied. This is safe to ignore.

### Connection Errors

Ensure your `DATABASE_URL` is correct and the database is accessible:

```bash
psql $DATABASE_URL -c "SELECT version();"
```

### Permission Errors

Ensure your database user has sufficient permissions:

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

## Testing After Migration

After running the migration, test the onboarding flow:

1. Submit a test onboarding form
2. Check the data was saved correctly:
   ```sql
   SELECT
     business_name,
     contact_email,
     form_data,
     source,
     completion_percentage
   FROM onboarding_submissions
   ORDER BY created_at DESC
   LIMIT 1;
   ```

3. Verify JSON queries work:
   ```sql
   SELECT * FROM get_onboarding_stats();
   ```

## Support

For issues or questions:
- Check the main project README
- Review the migration SQL comments
- Contact: julian@aiacrobatics.com
