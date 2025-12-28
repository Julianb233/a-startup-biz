# Onboarding Wizard Database Connection - Summary

**Date:** December 28, 2025
**Database:** Neon PostgreSQL (Not Supabase)
**Status:** ✅ Fully Connected and Operational

---

## Executive Summary

The onboarding wizard is now **fully connected** to the Neon PostgreSQL database with enhanced JSONB storage capabilities. All form data is being saved properly with comprehensive tracking and analytics support.

---

## Database Configuration

### Connection Details
- **Provider:** Neon (Serverless PostgreSQL)
- **Client:** `@neondatabase/serverless`
- **Connection:** `/root/github-repos/a-startup-biz/lib/db.ts`
- **Environment Variable:** `DATABASE_URL` (configured in `.env.local`)

### Database URL
```
postgresql://neondb_owner:****@ep-super-cell-ahv3o7y6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## Table Schema: `onboarding_submissions`

### Core Fields
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to users table (nullable) |
| `business_name` | VARCHAR(255) | Company name |
| `business_type` | VARCHAR(100) | Industry/business category |
| `business_stage` | VARCHAR(100) | Company size/stage |
| `goals` | TEXT[] | Array of business goals |
| `challenges` | TEXT[] | Array of challenges |
| `contact_email` | VARCHAR(255) | Primary contact email |
| `contact_phone` | VARCHAR(50) | Phone number |
| `timeline` | VARCHAR(100) | Project timeline |
| `budget_range` | VARCHAR(100) | Budget range |
| `status` | VARCHAR(50) | Submission status |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### Enhanced Fields (Added)
| Field | Type | Description |
|-------|------|-------------|
| `form_data` | **JSONB** | Complete form data in JSON format |
| `source` | VARCHAR(100) | Submission source tracking |
| `ip_address` | VARCHAR(45) | Client IP address |
| `user_agent` | TEXT | Client user agent |
| `referral_code` | VARCHAR(50) | Referral tracking code |
| `completion_percentage` | INTEGER | Form completion % (0-100) |
| `additional_info` | TEXT | Legacy field (kept for compatibility) |

---

## JSONB Form Data Structure

The `form_data` column stores the complete onboarding form as structured JSON:

```json
{
  "companyName": "Adventure Company",
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
  "servicesInterested": ["Web Design", "Marketing & SEO"],
  "priorityLevel": "High - Important",
  "specificNeeds": "Custom text",
  "brandStyle": "Bold & Energetic",
  "primaryColor": "#ff6600",
  "secondaryColor": "#333333",
  "logoUrl": "https://...",
  "aboutBusiness": "Company description",
  "servicesDescription": "Services offered",
  "uniqueValue": "What makes us special",
  "targetAudience": "Our ideal customer",
  "businessCategory": "Adventure Sports",
  "businessHours": "Mon-Fri 9-5",
  "businessDescription": "GMB description",
  "socialMedia": {
    "facebook": "https://facebook.com/...",
    "instagram": "@company",
    "linkedin": "company-name"
  },
  "googleMapsUrl": "https://maps.google.com/...",
  "contactName": "John Doe",
  "contactEmail": "john@example.com",
  "contactPhone": "555-1234",
  "bestTimeToCall": "Morning (8am-12pm)",
  "timezone": "Eastern (ET)",
  "communicationPreference": "Email",
  "additionalNotes": "Extra information",
  "selectedPlan": "growth",
  "paymentMethod": "full"
}
```

---

## Database Indexes

Performance-optimized indexes for fast queries:

1. **Primary Key:** `onboarding_submissions_pkey` on `id`
2. **GIN Index:** `idx_onboarding_form_data_gin` on `form_data` (for JSON queries)
3. **Contact Email:** `idx_onboarding_contact_email` on `contact_email`
4. **Created At:** `idx_onboarding_created_at` on `created_at DESC`
5. **Composite:** `idx_onboarding_status_created` on `(status, created_at DESC)`

---

## Data Integrity Constraints

1. **Completion Percentage:** Must be between 0 and 100
2. **Email Format:** Validated using regex pattern
3. **Auto-update Trigger:** `updated_at` automatically updates on modification

---

## API Endpoint

### POST `/api/onboarding`

**Location:** `/root/github-repos/a-startup-biz/app/api/onboarding/route.ts`

**Features:**
- ✅ Zod schema validation
- ✅ Rate limiting protection
- ✅ IP address tracking
- ✅ User agent logging
- ✅ Referral code support
- ✅ Email notifications (customer + admin)
- ✅ Fallback handling (works even if DB is temporarily unavailable)
- ✅ Complete form data stored in JSONB

**Request Example:**
```typescript
POST /api/onboarding
Content-Type: application/json

{
  "companyName": "Adventure Co",
  "industry": "Adventure & Outdoor Recreation",
  "companySize": "2-5 employees",
  // ... all other fields from onboarding-data.ts
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Onboarding data submitted successfully",
  "submissionId": "uuid-here",
  "data": {
    "businessName": "Adventure Co",
    "contactName": "John Doe",
    "contactEmail": "john@example.com",
    "servicesInterested": ["Web Design", "Marketing"],
    "priorityLevel": "High - Important",
    "timeline": "Short-term (1-3 months)",
    "status": "submitted"
  }
}
```

### GET `/api/onboarding?email=user@example.com`

Check if a submission already exists for an email address.

---

## Database Query Functions

**Location:** `/root/github-repos/a-startup-biz/lib/db-queries.ts`

### Available Functions

```typescript
// Create new submission
createOnboardingSubmission(data: OnboardingSubmissionData): Promise<OnboardingSubmission>

// Get by email
getOnboardingSubmissionByEmail(email: string): Promise<OnboardingSubmission | null>

// Get all submissions (with filtering)
getAllOnboardingSubmissions(filters?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<{ submissions: OnboardingSubmission[], total: number }>

// Update status
updateOnboardingStatus(
  submissionId: string,
  status: 'submitted' | 'reviewed' | 'in_progress' | 'completed'
): Promise<OnboardingSubmission | null>

// Get user's onboarding
getUserOnboarding(userId: string): Promise<OnboardingSubmission | null>
```

---

## Advanced JSONB Queries

### Query by Service Interest
```sql
SELECT *
FROM onboarding_submissions
WHERE form_data->'servicesInterested' @> '["Web Design & Development"]'::jsonb;
```

### Query by Priority Level
```sql
SELECT *
FROM onboarding_submissions
WHERE form_data->>'priorityLevel' = 'Critical - Need ASAP';
```

### Extract Specific Fields
```sql
SELECT
  business_name,
  form_data->>'contactName' as contact_name,
  form_data->>'brandStyle' as brand_style,
  form_data->'socialMedia'->>'facebook' as facebook_url
FROM onboarding_submissions;
```

### Search by Multiple Criteria
```sql
SELECT *
FROM onboarding_submissions
WHERE
  form_data @> '{"priorityLevel": "High - Important"}'::jsonb
  AND form_data->'servicesInterested' @> '["Marketing & SEO"]'::jsonb
  AND status = 'submitted';
```

---

## Testing & Verification

### Scripts Created
1. `scripts/check-db-schema.ts` - Verify table structure
2. `scripts/add-enhanced-fields.ts` - Add JSONB fields
3. `scripts/test-onboarding-flow.ts` - End-to-end test

### Run Tests
```bash
# Check schema
npm run tsx scripts/check-db-schema.ts

# Test complete flow
npm run tsx scripts/test-onboarding-flow.ts
```

### Test Results
✅ All tests passed
✅ Database connection verified
✅ JSONB queries working
✅ Data insertion successful
✅ Data retrieval successful
✅ Form data extraction working

---

## Migration History

| Migration | Date | Description | Status |
|-----------|------|-------------|--------|
| `001_full_schema.sql` | Initial | Base schema | ✅ Applied |
| `003_query_optimization.sql` | Prior | Performance | ✅ Applied |
| `004_enhanced_onboarding.sql` | 2025-12-28 | JSONB fields | ✅ Applied |

---

## Front-End Integration

### Component Location
`/root/github-repos/a-startup-biz/components/onboarding/onboarding-wizard.tsx`

### Data Validation
`/root/github-repos/a-startup-biz/lib/onboarding-data.ts`
- Zod schema validation
- Step-by-step validation
- LocalStorage progress saving
- 8-step wizard flow

### Form Steps
1. Business Information (company details, industry, size)
2. Goals & Challenges (objectives, timeline)
3. Current Situation (tools, team, budget)
4. Service Preferences (services needed, priority)
5. Branding & Content (style, colors, messaging)
6. Online Presence (GMB, social media)
7. Contact Preferences (best time, method)
8. Payment/Subscription (plan selection)

---

## Auto-save & Progress Tracking

- **LocalStorage:** Form progress auto-saved to browser
- **24-hour TTL:** Saved progress expires after 24 hours
- **Resume Support:** Users can resume incomplete forms
- **Completion %:** Tracked in `completion_percentage` field

---

## Email Notifications

### Customer Email
- Sent to: Submitted email address
- Template: `onboardingSubmittedEmail`
- Content: Confirmation + next steps

### Admin Email
- Sent to: `ADMIN_EMAIL` from env
- Template: `adminNewOnboardingEmail`
- Content: Full submission details
- Reply-to: Customer email

---

## Security Features

1. **Rate Limiting:** Via `@upstash/ratelimit`
2. **Email Validation:** Regex pattern constraint
3. **IP Tracking:** For fraud prevention
4. **SQL Injection Protection:** Parameterized queries via Neon client
5. **JSONB Validation:** Type-safe queries

---

## Performance Optimizations

1. **GIN Index:** Fast JSONB queries
2. **Composite Indexes:** Optimized for common query patterns
3. **Connection Pooling:** Neon pooler endpoint
4. **Serverless Architecture:** Auto-scaling
5. **Table Analysis:** Query planner optimization

---

## Maintenance Commands

```bash
# Run all migrations
npm run db:migrate:all

# Run specific migration
npm run db:migrate:enhanced

# Setup database from scratch
npm run db:setup

# Check database status
npm run tsx scripts/check-db-schema.ts
```

---

## Monitoring & Analytics

### Available Queries
```sql
-- Total submissions
SELECT COUNT(*) FROM onboarding_submissions;

-- By status
SELECT status, COUNT(*) as count
FROM onboarding_submissions
GROUP BY status;

-- By source
SELECT source, COUNT(*) as count
FROM onboarding_submissions
GROUP BY source;

-- Recent submissions
SELECT * FROM onboarding_submissions
ORDER BY created_at DESC
LIMIT 10;

-- High priority leads
SELECT business_name, contact_email, created_at
FROM onboarding_submissions
WHERE form_data->>'priorityLevel' IN ('Critical - Need ASAP', 'High - Important')
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Connection Issues
```bash
# Test database connection
echo $DATABASE_URL

# Verify environment variables
cat .env.local | grep DATABASE_URL
```

### Schema Issues
```bash
# Check table exists
npm run tsx scripts/check-db-schema.ts

# Re-run migration
npm run db:migrate:enhanced
```

### API Issues
- Check `/app/api/onboarding/route.ts`
- Verify Zod schema matches form data
- Check rate limiting configuration
- Review email service configuration

---

## Next Steps & Recommendations

### Immediate
- ✅ Database fully configured
- ✅ API endpoint operational
- ✅ Form wizard connected
- ✅ Email notifications working

### Short-term Enhancements
- [ ] Add admin dashboard for viewing submissions
- [ ] Implement submission search/filter interface
- [ ] Add export functionality (CSV, Excel)
- [ ] Create analytics dashboard

### Long-term Improvements
- [ ] Add automated lead scoring
- [ ] Implement CRM integration
- [ ] Add automated follow-up workflows
- [ ] Create submission analytics reports

---

## Support & Documentation

- **Database Queries:** `/lib/db-queries.ts`
- **API Route:** `/app/api/onboarding/route.ts`
- **Form Component:** `/components/onboarding/onboarding-wizard.tsx`
- **Validation Schema:** `/lib/onboarding-data.ts`
- **Database Schema:** `/lib/db-schema.sql`
- **Migrations:** `/scripts/migrations/`

---

## Conclusion

The onboarding wizard is **fully operational** and connected to the Neon PostgreSQL database. All data is being captured correctly in both structured columns and the JSONB `form_data` field for maximum flexibility and query performance.

**Status:** ✅ Production Ready

**Created by:** Dana-Database
**Date:** 2025-12-28
