# Referral System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     REFERRAL TRACKING SYSTEM                    │
│                                                                 │
│  Track referrals • Calculate commissions • Manage payouts      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │───▶│  API Routes  │───▶│   Database   │
│  Components  │◀───│  (Next.js)   │◀───│  (Postgres)  │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Business     │
                    │ Logic Layer  │
                    └──────────────┘
```

## File Structure

```
a-startup-biz/
├── lib/
│   ├── db-schema-referral.sql      # Database schema
│   ├── referral.ts                  # Business logic functions
│   └── types/
│       └── referral.ts              # TypeScript types
│
├── app/api/referral/
│   ├── code/route.ts                # Get/generate codes
│   ├── track/route.ts               # Track signups
│   ├── convert/route.ts             # Convert to commission
│   └── stats/route.ts               # Get statistics
│
└── Documentation/
    ├── REFERRAL_SYSTEM.md           # Complete documentation
    ├── REFERRAL_IMPLEMENTATION_SUMMARY.md
    └── REFERRAL_SYSTEM_ARCHITECTURE.md (this file)
```

## Data Flow

### 1. Code Generation Flow

```
User Dashboard
      │
      ▼
GET /api/referral/code?userId=xxx
      │
      ▼
getOrCreateReferralCode(userId, email)
      │
      ├─▶ Check existing code
      │   └─▶ Return if exists
      │
      └─▶ Generate new code
          ├─▶ Format: REF-{SHORT_ID}-{RANDOM}
          ├─▶ Check uniqueness
          └─▶ Insert to database
              │
              ▼
        Return code to user
```

### 2. Referral Tracking Flow

```
New User Signup (with ?ref=XXX)
      │
      ▼
POST /api/referral/track
      │
      ├─▶ Validate referral code
      │
      ├─▶ Get referrer info
      │
      └─▶ Create referral record
          ├─▶ Status: 'signed_up'
          ├─▶ Store UTM params
          ├─▶ Track IP, user agent
          └─▶ Set 30-day expiry
              │
              ▼
        Referral tracked ✓
```

### 3. Conversion Flow

```
Referred User Makes Purchase
      │
      ▼
POST /api/referral/convert
      │
      ├─▶ Find referral record
      │
      ├─▶ Validate purchase amount
      │   └─▶ Minimum: $100
      │
      ├─▶ Calculate commission
      │   ├─▶ 10% of purchase
      │   ├─▶ OR $25 flat
      │   └─▶ Whichever is higher
      │
      ├─▶ Update referral
      │   ├─▶ Status: 'converted'
      │   ├─▶ Set conversion_date
      │   └─▶ Store commission_amount
      │
      └─▶ Create payout record
          ├─▶ Status: 'pending'
          └─▶ Link to referral
              │
              ▼
        Commission earned ✓
```

### 4. Statistics Flow

```
User Views Dashboard
      │
      ▼
GET /api/referral/stats?userId=xxx
      │
      ├─▶ Query referrer_stats view
      │   ├─▶ Total referrals
      │   ├─▶ Signups count
      │   ├─▶ Conversions count
      │   ├─▶ Total commissions
      │   ├─▶ Paid commissions
      │   └─▶ Pending commissions
      │
      ├─▶ Get recent referrals (optional)
      │
      └─▶ Get payout history (optional)
          │
          ▼
    Display comprehensive stats
```

## Database Schema

```sql
┌─────────────────────────────────────────┐
│            REFERRALS TABLE              │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ referrer_id         ─┐                  │
│ referrer_email       │  Referrer Info   │
│ referred_email      ─┘                  │
│ referred_user_id    ─┐                  │
│ referral_code        │  Tracking        │
│ status              ─┘                  │
│ conversion_date     ─┐                  │
│ conversion_value     │  Conversion      │
│ commission_amount   ─┘                  │
│ utm_source          ─┐                  │
│ utm_medium           │  Attribution     │
│ utm_campaign        ─┘                  │
│ created_at                              │
│ expires_at (created_at + 30 days)       │
└─────────────────────────────────────────┘
                │
                │ 1:N
                ▼
┌─────────────────────────────────────────┐
│       REFERRAL_PAYOUTS TABLE            │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ referral_id (FK)                        │
│ referrer_id                             │
│ amount                                  │
│ status (pending/processing/paid)        │
│ payment_method                          │
│ payment_reference                       │
│ paid_at                                 │
│ created_at                              │
└─────────────────────────────────────────┘
```

## Status State Machine

### Referral Status

```
┌─────────┐
│ pending │ (Code created, not used yet)
└────┬────┘
     │
     ▼
┌───────────┐
│ signed_up │ (Referred user created account)
└─────┬─────┘
      │
      ▼
┌───────────┐
│ converted │ (Referred user made purchase)
└─────┬─────┘
      │
      ▼
┌──────────┐
│ paid_out │ (Commission paid)
└──────────┘

Alternative paths:
pending ──▶ expired (30 days passed)
   any  ──▶ invalid (fraud detected)
```

### Payout Status

```
┌─────────┐
│ pending │ (Commission earned, below threshold)
└────┬────┘
     │
     ▼
┌────────────┐
│ processing │ (Payment initiated)
└──────┬─────┘
       │
       ├─▶ paid ✓
       │
       └─▶ failed ──▶ cancelled
```

## API Endpoints

```
┌────────────────────────────────────────────────────────┐
│                    API ROUTES                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  GET  /api/referral/code?userId=xxx                   │
│       ├─▶ Returns: code, referrals, stats             │
│       └─▶ Auth: Required (Clerk)                      │
│                                                        │
│  POST /api/referral/code                              │
│       ├─▶ Body: { userId, email }                     │
│       ├─▶ Returns: referralCode                       │
│       └─▶ Auth: Required (Clerk)                      │
│                                                        │
│  POST /api/referral/track                             │
│       ├─▶ Body: { referralCode, referredEmail }       │
│       ├─▶ Returns: referralId                         │
│       └─▶ Auth: Public (tracked users)                │
│                                                        │
│  POST /api/referral/convert                           │
│       ├─▶ Body: { referralCode, purchaseValue }       │
│       ├─▶ Returns: referralId, commissionAmount       │
│       └─▶ Auth: Backend/Webhook                       │
│                                                        │
│  GET  /api/referral/stats?userId=xxx                  │
│       ├─▶ Returns: stats, referrals, payouts          │
│       └─▶ Auth: Required (Clerk)                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Core Functions

```typescript
// Code Generation
generateReferralCode(userId, config?)
  ├─▶ Format: REF-{SHORT_ID}-{RANDOM}
  └─▶ Returns: "REF-USE-A7B2C9"

validateReferralCode(code)
  ├─▶ Check format
  └─▶ Returns: boolean

// Database Operations
getOrCreateReferralCode(userId, email)
  ├─▶ Check existing
  ├─▶ Generate if needed
  └─▶ Returns: code

trackReferralSignup(code, email, metadata)
  ├─▶ Validate code
  ├─▶ Create record
  └─▶ Returns: referralId

convertReferral({ code, email, purchaseValue })
  ├─▶ Find referral
  ├─▶ Calculate commission
  ├─▶ Update status
  ├─▶ Create payout
  └─▶ Returns: { referralId, commissionAmount }

// Statistics
getReferralStats(userId)
  ├─▶ Query database view
  ├─▶ Calculate rates
  └─▶ Returns: ReferralStats

// Commission
calculateCommission(purchaseValue, config?)
  ├─▶ Check minimum ($100)
  ├─▶ Calculate 10%
  ├─▶ Compare to flat $25
  └─▶ Returns: higher amount
```

## Commission Calculation

```
Purchase Value: $199.99
       │
       ▼
┌──────────────────┐
│ Check Minimum    │
│ Must be ≥ $100   │
└────────┬─────────┘
         │ ✓
         ▼
┌──────────────────┐     ┌──────────────────┐
│ Calculate 10%    │     │ Flat Amount      │
│ $199.99 × 0.10   │     │ $25.00           │
│ = $19.99         │     │                  │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         └────────┬───────────────┘
                  ▼
         ┌─────────────────┐
         │ MAX($19.99, $25)│
         │ = $25.00         │
         └─────────────────┘
                  │
                  ▼
         Commission: $25.00 ✓
```

## Security Architecture

```
┌─────────────────────────────────────────────┐
│           SECURITY LAYERS                   │
├─────────────────────────────────────────────┤
│                                             │
│  1. Authentication (Clerk)                  │
│     └─▶ Verify user identity               │
│                                             │
│  2. Authorization (RLS)                     │
│     ├─▶ Users access own data only         │
│     └─▶ Database-level enforcement          │
│                                             │
│  3. Input Validation                        │
│     ├─▶ Code format check                   │
│     ├─▶ Email validation                    │
│     └─▶ Amount validation                   │
│                                             │
│  4. Rate Limiting (IMPLEMENTED)             │
│     ├─▶ 10 requests per hour per IP         │
│     ├─▶ Applied to all referral endpoints   │
│     └─▶ Upstash Redis with in-memory fallback│
│                                             │
│  5. Fraud Detection (TODO)                  │
│     ├─▶ IP tracking                         │
│     ├─▶ Pattern analysis                    │
│     └─▶ Manual review                       │
│                                             │
└─────────────────────────────────────────────┘
```

## Integration Points

### 1. User Signup Integration

```typescript
// In your signup flow
const searchParams = new URLSearchParams(window.location.search)
const referralCode = searchParams.get('ref')

if (referralCode) {
  // Track after successful signup
  await fetch('/api/referral/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referralCode,
      referredEmail: user.email,
      utmSource: searchParams.get('utm_source'),
    })
  })
}
```

### 2. Checkout Integration

```typescript
// In your Stripe webhook or checkout success handler
import { convertReferral } from '@/lib/referral'

// After successful payment
await convertReferral({
  referredEmail: customer.email,
  referredUserId: customer.id,
  purchaseValue: amount / 100, // Stripe uses cents
  orderId: paymentIntent.id
})
```

### 3. Dashboard Integration

```typescript
// User dashboard component
const { data } = await fetch(`/api/referral/stats?userId=${user.id}`)
const { stats, recentReferrals } = await data.json()

// Display:
// - Your referral link
// - Total referrals: {stats.total_referrals}
// - Conversions: {stats.conversions}
// - Pending commissions: ${stats.pending_commissions}
```

## Background Jobs

```
┌────────────────────────────────────────┐
│        SCHEDULED JOBS                  │
├────────────────────────────────────────┤
│                                        │
│  Daily (00:00 UTC)                     │
│  ├─▶ markExpiredReferrals()            │
│  │   └─▶ Mark 30+ day old as expired   │
│  │                                      │
│  └─▶ generateDailyReport()             │
│      └─▶ Send stats to admins          │
│                                        │
│  Weekly (Monday 09:00)                 │
│  ├─▶ processPendingPayouts()           │
│  │   └─▶ Pay commissions ≥ $50         │
│  │                                      │
│  └─▶ sendWeeklySummary()               │
│      └─▶ Email to referrers            │
│                                        │
│  Monthly (1st of month)                │
│  └─▶ generateMonthlyStatements()       │
│      └─▶ Tax documents, reports        │
│                                        │
└────────────────────────────────────────┘
```

## Performance Optimizations

```
Database Indexes:
├─▶ idx_referrals_referrer_id
├─▶ idx_referrals_referred_email
├─▶ idx_referrals_referral_code
├─▶ idx_referrals_status
├─▶ idx_referrals_referrer_status (compound)
└─▶ idx_payouts_referrer_id

Views for Statistics:
├─▶ referrer_stats (pre-aggregated)
└─▶ active_referrals (filtered)

Caching Strategy:
├─▶ User stats (Redis, 5 min TTL)
├─▶ Referral codes (Application cache)
└─▶ Commission config (Static)
```

## Monitoring & Analytics

```
Key Metrics:
├─▶ Conversion Rate (conversions / total_referrals)
├─▶ Signup Rate (signups / total_referrals)
├─▶ Average Commission
├─▶ Total Payouts (monthly, yearly)
├─▶ Top Referrers
└─▶ Revenue Generated

Alerts:
├─▶ Failed payouts
├─▶ Suspicious activity
├─▶ High commission amounts
└─▶ Database errors
```

## Error Handling

```typescript
try {
  await convertReferral({ ... })
} catch (error) {
  if (error.message.includes('not found')) {
    // Referral doesn't exist
  } else if (error.message.includes('minimum')) {
    // Purchase below minimum
  } else if (error.message.includes('already converted')) {
    // Duplicate conversion attempt
  } else {
    // Other errors
  }
}
```

## Testing Strategy

```
Unit Tests:
├─▶ generateReferralCode()
├─▶ validateReferralCode()
├─▶ calculateCommission()
└─▶ All business logic functions

Integration Tests:
├─▶ API route handlers
├─▶ Database operations
└─▶ End-to-end flows

E2E Tests:
├─▶ Full signup with referral
├─▶ Purchase and conversion
└─▶ Payout processing
```

## Deployment Checklist

- [ ] Run database schema in production
- [ ] Verify RLS policies
- [ ] Test all API endpoints
- [ ] Set up monitoring
- [ ] Configure background jobs
- [ ] Enable fraud detection
- [ ] Test payout flow
- [ ] Create admin dashboard
- [ ] Document for team
- [ ] Monitor initial usage

## Summary

This referral system provides:
- ✅ Complete tracking from code generation to payout
- ✅ Flexible commission calculation
- ✅ Secure data access with RLS
- ✅ Comprehensive statistics
- ✅ Production-ready architecture
- ✅ Scalable design
- ✅ Full documentation

Ready for: Database setup → API testing → Frontend integration
