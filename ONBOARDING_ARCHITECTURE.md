# Onboarding System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ONBOARDING FLOW                             │
└─────────────────────────────────────────────────────────────────┘

  User Browser                API Layer              Database Layer
       │                          │                        │
       │  1. Submit Form          │                        │
       ├──────────────────────────>                        │
       │                          │                        │
       │                     [Validate]                    │
       │                     (Zod Schema)                  │
       │                          │                        │
       │                     [Capture]                     │
       │                    IP + UserAgent                 │
       │                          │                        │
       │                     [Transform]                   │
       │                   Form Data → JSONB               │
       │                          │                        │
       │                          │  2. Insert to DB       │
       │                          ├────────────────────────>
       │                          │                        │
       │                          │        [Store]         │
       │                          │    onboarding_         │
       │                          │    submissions         │
       │                          │                        │
       │                          │  3. Return ID          │
       │                          <────────────────────────┤
       │                          │                        │
       │  4. Send Confirmation    │                        │
       │<─────────────────────────┤                        │
       │  (Email)                 │                        │
       │                          │                        │
       │                     [Send Admin]                  │
       │                     Notification                  │
       │                          │                        │
       ▼                          ▼                        ▼
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    ONBOARDING FORM (8 STEPS)                     │
├──────────────────────────────────────────────────────────────────┤
│ Step 1: Business Info    │  Step 5: Branding & Content          │
│ Step 2: Goals & Challenges│  Step 6: Online Presence            │
│ Step 3: Current Situation │  Step 7: Contact Preferences        │
│ Step 4: Service Prefs     │  Step 8: Payment/Subscription       │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 │ All form data
                 ▼
    ┌────────────────────────────┐
    │   Zod Schema Validation    │
    │  (onboardingSchema.parse)  │
    └────────────┬───────────────┘
                 │ Validated data
                 ▼
    ┌────────────────────────────┐
    │   Data Transformation      │
    │  • Map to DB schema        │
    │  • Create JSONB object     │
    │  • Capture IP/UserAgent    │
    │  • Add tracking data       │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────┐
    │            PostgreSQL Database                     │
    │                                                    │
    │  onboarding_submissions                            │
    │  ┌──────────────────────────────────────────────┐ │
    │  │ Core Fields (Legacy)                         │ │
    │  │  • business_name                             │ │
    │  │  • contact_email                             │ │
    │  │  • goals[]                                   │ │
    │  │  • challenges[]                              │ │
    │  │  • status                                    │ │
    │  ├──────────────────────────────────────────────┤ │
    │  │ Enhanced Fields (New)                        │ │
    │  │  • form_data (JSONB) ← All 40+ fields        │ │
    │  │  • source                                    │ │
    │  │  • ip_address                                │ │
    │  │  • user_agent                                │ │
    │  │  • referral_code                             │ │
    │  │  • completion_percentage                     │ │
    │  └──────────────────────────────────────────────┘ │
    │                                                    │
    │  Indexes:                                          │
    │  • GIN index on form_data (fast JSON queries)     │
    │  • Index on contact_email (lookups)               │
    │  • Index on status + created_at (admin queries)   │
    └────────────────────────────────────────────────────┘
```

---

## Database Schema Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│               onboarding_submissions Table                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Core Identity                                                  │
│  ├── id (UUID)                    ← Primary Key                │
│  ├── user_id (UUID)               ← FK to users (optional)     │
│  └── created_at, updated_at       ← Timestamps                 │
│                                                                 │
│  Business Information                                           │
│  ├── business_name (VARCHAR)      ← Company name               │
│  ├── business_type (VARCHAR)      ← Industry                   │
│  ├── business_stage (VARCHAR)     ← Company size               │
│  └── contact_email (VARCHAR)      ← Email (indexed)            │
│                                                                 │
│  Basic Fields (Arrays)                                          │
│  ├── goals (TEXT[])               ← Business goals             │
│  └── challenges (TEXT[])          ← Main challenges            │
│                                                                 │
│  Status & Workflow                                              │
│  ├── status (ENUM)                ← submitted/reviewed/...     │
│  ├── timeline (VARCHAR)           ← Project timeline           │
│  └── budget_range (VARCHAR)       ← Budget range               │
│                                                                 │
│  Enhanced Data (JSONB) ✨                                       │
│  └── form_data (JSONB)            ← Complete form data         │
│       ├── companySize                                           │
│       ├── revenueRange                                          │
│       ├── yearsInBusiness                                       │
│       ├── website                                               │
│       ├── businessGoals[]                                       │
│       ├── currentTools[]                                        │
│       ├── servicesInterested[]                                  │
│       ├── priorityLevel                                         │
│       ├── brandStyle                                            │
│       ├── primaryColor, secondaryColor                          │
│       ├── businessCategory                                      │
│       ├── socialMedia { facebook, instagram, ... }             │
│       ├── contactPreferences                                    │
│       └── selectedPlan, paymentMethod                           │
│                                                                 │
│  Analytics & Tracking ✨                                        │
│  ├── source (VARCHAR)             ← Submission source          │
│  ├── ip_address (VARCHAR)         ← Client IP                  │
│  ├── user_agent (TEXT)            ← Browser info               │
│  ├── referral_code (VARCHAR)      ← Referral tracking          │
│  └── completion_percentage (INT)  ← Progress (0-100)           │
│                                                                 │
│  Legacy Compatibility                                           │
│  └── additional_info (TEXT)       ← JSON string (deprecated)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Query Performance Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE INDEXES                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Primary Access Patterns                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. GIN Index on form_data                             │ │
│  │    → Fast JSON queries (O(log n))                     │ │
│  │    → Containment operators (@>, ?)                    │ │
│  │    → Path operators (->>, ->)                         │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 2. B-tree Index on contact_email                      │ │
│  │    → Email lookups                                    │ │
│  │    → Duplicate detection                              │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 3. B-tree Index on created_at DESC                    │ │
│  │    → Recent submissions                               │ │
│  │    → Time-based queries                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ 4. Composite Index on (status, created_at DESC)       │ │
│  │    → Admin dashboard queries                          │ │
│  │    → Filter by status + sort by date                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Helper Functions                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ get_onboarding_stats()                                │ │
│  │  → Aggregate statistics                               │ │
│  │  → Counts by status                                   │ │
│  │  → Weekly/monthly metrics                             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ search_onboarding_by_service(TEXT)                    │ │
│  │  → Find by service interest                           │ │
│  │  → Uses GIN index for performance                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Views                                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ onboarding_submissions_detailed                       │ │
│  │  → Pre-joined with users table                        │ │
│  │  → Extracted JSON fields as columns                   │ │
│  │  → Easier querying for common fields                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Application Integration Points

```
┌──────────────────────────────────────────────────────────────┐
│                     CODE ARCHITECTURE                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend                                                    │
│  /lib/onboarding-data.ts                                    │
│  ├── Zod schema (onboardingSchema)                          │
│  ├── Validation helpers (validateStep)                      │
│  └── Progress tracking (getStepCompletionPercentage)        │
│                                                              │
│  ▼                                                           │
│                                                              │
│  API Layer                                                   │
│  /app/api/onboarding/route.ts                               │
│  ├── POST /api/onboarding                                   │
│  │   ├── Rate limiting                                      │
│  │   ├── Zod validation                                     │
│  │   ├── IP/UserAgent capture                              │
│  │   ├── Data transformation                               │
│  │   ├── Database insert                                   │
│  │   ├── Email notifications                               │
│  │   └── Response with submission ID                       │
│  └── GET /api/onboarding?email=...                          │
│      └── Check existing submissions                         │
│                                                              │
│  ▼                                                           │
│                                                              │
│  Database Layer                                              │
│  /lib/db-queries.ts                                         │
│  ├── createOnboardingSubmission()                           │
│  ├── getOnboardingSubmissionByEmail()                       │
│  ├── getAllOnboardingSubmissions()                          │
│  └── updateOnboardingStatus()                               │
│                                                              │
│  ▼                                                           │
│                                                              │
│  Database Connection                                         │
│  /lib/db.ts                                                  │
│  ├── Neon serverless driver                                 │
│  ├── TypeScript interfaces                                  │
│  └── Type-safe query helpers                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Migration Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  MIGRATION WORKFLOW                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Migration Files                                             │
│  /scripts/migrations/                                        │
│  ├── 001_full_schema.sql        ← Initial schema            │
│  ├── 003_query_optimization.sql ← Performance               │
│  └── 004_enhanced_onboarding.sql ← Onboarding enhancement ✨│
│                                                              │
│  Migration Runner                                            │
│  /scripts/run-migration.ts                                   │
│  ├── Parse SQL file                                          │
│  ├── Split by statements                                     │
│  ├── Execute sequentially                                    │
│  ├── Error handling                                          │
│  └── Verification                                            │
│                                                              │
│  NPM Scripts                                                 │
│  package.json                                                │
│  ├── db:migrate:enhanced  → Run 004 migration                │
│  └── db:migrate:all       → Run all migrations               │
│                                                              │
│  Safety Features                                             │
│  ├── Idempotent (IF NOT EXISTS)                             │
│  ├── Rollback plans included                                │
│  ├── Transaction safety                                      │
│  └── Data validation constraints                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Security & Privacy Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Input Validation                                            │
│  ├── Zod schema validation                                   │
│  ├── Email format constraint (database)                      │
│  ├── Completion percentage bounds (0-100)                    │
│  └── Type safety (TypeScript)                                │
│                                                              │
│  Rate Limiting                                               │
│  ├── Per-IP rate limiting                                    │
│  └── Prevents spam/abuse                                     │
│                                                              │
│  Data Protection                                             │
│  ├── SSL/TLS for connections                                 │
│  ├── Environment variables for credentials                   │
│  ├── No sensitive data in logs                               │
│  └── JSONB for flexible PII storage                          │
│                                                              │
│  Tracking & Analytics                                        │
│  ├── IP address (anonymizable)                               │
│  ├── User agent (device info)                                │
│  ├── Source tracking (campaign attribution)                  │
│  └── Referral codes (privacy-safe)                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## System Capabilities

### ✅ What You Can Do Now

1. **Store Complete Form Data**
   - All 40+ fields captured
   - JSONB format for flexibility
   - Queryable with SQL

2. **Advanced Filtering**
   - By service interest
   - By budget range
   - By priority level
   - By company size/revenue
   - By referral source

3. **Analytics & Reporting**
   - Submission statistics
   - Conversion tracking
   - Time-based analysis
   - Source attribution
   - Device/browser insights

4. **Lead Management**
   - Status tracking (submitted → completed)
   - Priority scoring
   - Email integration
   - Referral tracking

5. **Performance Optimization**
   - Fast JSON queries (GIN index)
   - Efficient lookups (B-tree indexes)
   - Pre-computed views
   - Helper functions

---

## Future Enhancements

### Potential Additions

1. **Automated Scoring**
   - Lead quality score based on form data
   - Budget + priority matrix
   - Auto-assignment to sales team

2. **Workflow Automation**
   - Trigger actions based on form data
   - Auto-send resources based on interests
   - Schedule follow-ups

3. **Advanced Analytics**
   - Conversion funnel analysis
   - A/B testing support
   - Cohort analysis
   - Revenue attribution

4. **Integration Ready**
   - CRM sync (HubSpot, Salesforce)
   - Email marketing (Mailchimp)
   - Analytics (Mixpanel, Amplitude)
   - Payment processing (Stripe)

---

**Architecture Status**: ✅ Production-Ready
