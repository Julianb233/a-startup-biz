# Onboarding Database Setup Guide

## Overview

This guide covers the database setup for the enhanced onboarding system in the A Startup Biz project.

## What Was Done

### 1. Enhanced Database Schema

A new migration (`004_enhanced_onboarding.sql`) was created that adds:

- **`form_data` JSONB column** - Stores complete onboarding form data in a queryable format
- **Tracking columns** - IP address, user agent, source, referral code
- **Performance indexes** - Fast queries on JSON data and common lookups
- **Helper functions** - Statistics and search capabilities
- **Database views** - Easy access to expanded onboarding data

### 2. Updated Application Code

The following files were modified:

- **`/lib/db.ts`** - Added new fields to `OnboardingSubmission` interface
- **`/lib/db-queries.ts`** - Updated `createOnboardingSubmission` function to support new schema
- **`/app/api/onboarding/route.ts`** - Enhanced to store complete form data in `form_data` JSONB field

### 3. Migration Infrastructure

Created migration tools:

- **`/scripts/migrations/004_enhanced_onboarding.sql`** - The migration SQL file
- **`/scripts/run-migration.ts`** - TypeScript migration runner
- **`/scripts/migrations/README.md`** - Comprehensive migration documentation

## How to Deploy

### Step 1: Verify Environment

Ensure your `.env` file has the database connection:

```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
```

### Step 2: Run the Migration

Choose one of these methods:

**Option A: Using the migration runner (Recommended)**

```bash
cd /root/github-repos/a-startup-biz
pnpm tsx scripts/run-migration.ts 004_enhanced_onboarding
```

**Option B: Using psql directly**

```bash
psql $DATABASE_URL -f scripts/migrations/004_enhanced_onboarding.sql
```

**Option C: Copy and paste into Neon console**

1. Go to https://console.neon.tech/
2. Select your project
3. Go to SQL Editor
4. Copy contents of `scripts/migrations/004_enhanced_onboarding.sql`
5. Paste and execute

### Step 3: Verify Migration

Test that the migration was successful:

```sql
-- Check if new columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'onboarding_submissions'
  AND column_name IN ('form_data', 'source', 'ip_address', 'referral_code');

-- Test the stats function
SELECT * FROM get_onboarding_stats();

-- Check the view
SELECT * FROM onboarding_submissions_detailed LIMIT 1;
```

### Step 4: Test the Application

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to the onboarding page

3. Fill out and submit the form

4. Check the database to verify data was saved:
   ```sql
   SELECT
     id,
     business_name,
     contact_email,
     form_data->>'companySize' as company_size,
     form_data->>'priorityLevel' as priority,
     form_data->'servicesInterested' as services,
     source,
     completion_percentage,
     created_at
   FROM onboarding_submissions
   ORDER BY created_at DESC
   LIMIT 1;
   ```

## Database Schema

### Onboarding Submissions Table

```sql
onboarding_submissions
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key to users)
├── business_name (VARCHAR)
├── business_type (VARCHAR)
├── business_stage (VARCHAR)
├── goals (TEXT[])
├── challenges (TEXT[])
├── contact_email (VARCHAR)
├── contact_phone (VARCHAR)
├── timeline (VARCHAR)
├── budget_range (VARCHAR)
├── additional_info (TEXT) -- Legacy field
├── form_data (JSONB) -- NEW: Complete form data
├── status (ENUM: submitted, reviewed, in_progress, completed)
├── source (VARCHAR) -- NEW: Submission source
├── ip_address (VARCHAR) -- NEW: Client IP
├── user_agent (TEXT) -- NEW: Browser info
├── referral_code (VARCHAR) -- NEW: Referral tracking
├── completion_percentage (INTEGER) -- NEW: 0-100
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### Form Data Structure

The `form_data` JSONB field contains all onboarding form fields:

```json
{
  "companyName": "string",
  "companySize": "string",
  "revenueRange": "string",
  "yearsInBusiness": "string",
  "website": "string",
  "industry": "string",
  "businessGoals": ["string"],
  "primaryChallenge": "string",
  "timeline": "string",
  "currentTools": ["string"],
  "teamSize": "string",
  "budgetRange": "string",
  "servicesInterested": ["string"],
  "priorityLevel": "string",
  "brandStyle": "string",
  "primaryColor": "#hex",
  "secondaryColor": "#hex",
  "businessCategory": "string",
  "socialMedia": {
    "facebook": "url",
    "instagram": "handle",
    "linkedin": "url"
  },
  "contactName": "string",
  "contactEmail": "email",
  "contactPhone": "phone",
  "bestTimeToCall": "string",
  "timezone": "string",
  "communicationPreference": "string",
  "selectedPlan": "starter|growth|enterprise",
  "paymentMethod": "full|deposit"
}
```

## Querying Onboarding Data

### Get All Submissions with Rich Data

```sql
SELECT
  business_name,
  contact_name,
  contact_email,
  company_size,
  revenue_range,
  priority_level,
  services_interested,
  selected_plan,
  status
FROM onboarding_submissions_detailed
WHERE status = 'submitted'
ORDER BY created_at DESC;
```

### Search by Service Interest

```sql
SELECT * FROM search_onboarding_by_service('Web Design & Development');
```

### Get Statistics

```sql
SELECT * FROM get_onboarding_stats();
```

### Query Specific JSON Fields

```sql
-- High priority submissions
SELECT
  business_name,
  contact_email,
  form_data->>'priorityLevel' as priority
FROM onboarding_submissions
WHERE form_data->>'priorityLevel' = 'Critical - Need ASAP';

-- Submissions in specific budget range
SELECT
  business_name,
  form_data->>'budgetRange' as budget
FROM onboarding_submissions
WHERE form_data->>'budgetRange' = '$25,000 - $50,000';

-- Submissions with social media presence
SELECT
  business_name,
  form_data->'socialMedia'->>'instagram' as instagram
FROM onboarding_submissions
WHERE form_data->'socialMedia'->>'instagram' IS NOT NULL;
```

## API Integration

The onboarding API endpoint (`/app/api/onboarding/route.ts`) now:

1. ✅ Validates form data using Zod schema
2. ✅ Captures complete form data in `form_data` JSONB
3. ✅ Tracks IP address and user agent
4. ✅ Stores referral codes
5. ✅ Sends confirmation emails
6. ✅ Sends admin notifications
7. ✅ Returns submission ID on success

### API Response Format

```json
{
  "success": true,
  "message": "Onboarding data submitted successfully",
  "submissionId": "uuid",
  "data": {
    "businessName": "Example Corp",
    "contactName": "John Doe",
    "contactEmail": "john@example.com",
    "servicesInterested": ["Web Design", "SEO"],
    "priorityLevel": "High - Important",
    "timeline": "Short-term (1-3 months)",
    "status": "submitted"
  }
}
```

## Backward Compatibility

The migration maintains backward compatibility:

- ✅ Existing columns remain unchanged
- ✅ `additional_info` field still populated (for legacy code)
- ✅ No breaking changes to existing queries
- ✅ New columns have sensible defaults

## Troubleshooting

### Migration Fails with "relation already exists"

This is normal if the migration was already run. The migration uses `IF NOT EXISTS` clauses to be idempotent.

### Can't connect to database

Verify your `DATABASE_URL`:

```bash
echo $DATABASE_URL
psql $DATABASE_URL -c "SELECT version();"
```

### TypeScript errors after migration

Restart your TypeScript server:

```bash
# In VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Form data not showing in JSONB column

Check that the API route is using the updated code:

```bash
grep -n "formData:" app/api/onboarding/route.ts
```

## Next Steps

After successful deployment:

1. **Monitor submissions** - Check that data is being saved correctly
2. **Review analytics** - Use the stats function to track conversion
3. **Build admin dashboard** - Create UI to view and manage submissions
4. **Set up alerts** - Notify team of high-priority submissions
5. **Export functionality** - Add CSV/Excel export for submissions

## Support

For questions or issues:

- Review migration README: `/scripts/migrations/README.md`
- Check API route: `/app/api/onboarding/route.ts`
- Contact: julian@aiacrobatics.com
