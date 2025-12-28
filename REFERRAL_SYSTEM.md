# Referral Tracking System

A complete referral tracking system with commission calculation, payout management, and comprehensive analytics.

## Overview

This referral system allows users to refer others and earn commissions on their first qualifying purchase. The system tracks referrals, calculates commissions, and manages payouts with a 30-day tracking window.

## Commission Rules

- **Commission Rate**: 10% of first purchase OR $25 flat (whichever is higher)
- **Minimum Purchase**: $100 to qualify for commission
- **Payout Threshold**: $50 minimum before withdrawal
- **Tracking Window**: 30-day cookie window from first visit

## Files Created

### Database Schema
- `/lib/db-schema-referral.sql` - Complete database schema with tables, indexes, RLS policies, triggers, and views

### TypeScript Types
- `/lib/types/referral.ts` - All TypeScript interfaces and types for the referral system

### Business Logic
- `/lib/referral.ts` - Core utility functions for referral tracking and commission calculation

### API Routes
- `/app/api/referral/code/route.ts` - Get or generate referral codes
- `/app/api/referral/track/route.ts` - Track referral signups
- `/app/api/referral/convert/route.ts` - Convert referrals to commissions
- `/app/api/referral/stats/route.ts` - Get referral statistics

## Database Schema

### Tables

#### `referrals`
Tracks all referral relationships and their status.

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id VARCHAR(255),      -- User who owns the code
  referrer_email VARCHAR(255),
  referred_email VARCHAR(255),   -- Person who used the code
  referred_user_id VARCHAR(255), -- Set when they sign up
  referral_code VARCHAR(50) UNIQUE,
  status VARCHAR(50),            -- pending, signed_up, converted, paid_out, expired, invalid
  conversion_date TIMESTAMP,
  conversion_value DECIMAL(10, 2),
  commission_amount DECIMAL(10, 2),
  -- Cookie tracking
  cookie_expiry TIMESTAMP,
  first_visit_at TIMESTAMP,
  signup_date TIMESTAMP,
  -- UTM tracking
  utm_source, utm_medium, utm_campaign VARCHAR(255),
  -- Technical tracking
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer_url TEXT,
  -- Metadata
  notes TEXT,
  metadata JSONB,
  -- Timestamps
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  expires_at TIMESTAMP           -- created_at + 30 days
)
```

#### `referral_payouts`
Tracks commission payouts to referrers.

```sql
CREATE TABLE referral_payouts (
  id UUID PRIMARY KEY,
  referral_id UUID REFERENCES referrals(id),
  referrer_id VARCHAR(255),
  amount DECIMAL(10, 2),
  status VARCHAR(50),            -- pending, processing, paid, failed, cancelled
  payment_method VARCHAR(50),    -- stripe, paypal, bank_transfer, etc.
  payment_reference VARCHAR(255),
  payment_details JSONB,
  paid_at TIMESTAMP,
  failed_at TIMESTAMP,
  failure_reason TEXT,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Views

#### `referrer_stats`
Aggregated statistics for each referrer.

#### `active_referrals`
All active referrals with pending commissions.

### Indexes

Performance indexes created for:
- User lookups (referrer_id, referred_email)
- Code validation (referral_code)
- Status filtering
- Date-based queries

### Row Level Security (RLS)

Policies ensure users can only:
- View their own referrals
- Insert referrals for themselves
- Update their own referrals

## API Documentation

### 1. Get Referral Code

**GET** `/api/referral/code?userId={userId}`

Get user's referral code and statistics.

**Response:**
```json
{
  "success": true,
  "referralCode": "REF-U3K-A7B2C9",
  "referrals": [...],
  "stats": {
    "total_referrals": 10,
    "signups": 7,
    "conversions": 3,
    "total_commissions": 150.00,
    "paid_commissions": 100.00,
    "pending_commissions": 50.00
  }
}
```

### 2. Generate Referral Code

**POST** `/api/referral/code`

Generate a new referral code for a user.

**Request:**
```json
{
  "userId": "user_abc123",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "referralCode": "REF-USE-A7B2C9",
  "message": "Referral code generated successfully"
}
```

### 3. Track Referral Signup

**POST** `/api/referral/track`

Track when someone signs up using a referral code.

**Request:**
```json
{
  "referralCode": "REF-USE-A7B2C9",
  "referredEmail": "newuser@example.com",
  "utmSource": "twitter",
  "utmMedium": "social",
  "utmCampaign": "spring2024"
}
```

**Response:**
```json
{
  "success": true,
  "referralId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Referral tracked successfully"
}
```

### 4. Convert Referral

**POST** `/api/referral/convert`

Mark referral as converted when referred user makes qualifying purchase.

**Request:**
```json
{
  "referralCode": "REF-USE-A7B2C9",
  "referredEmail": "newuser@example.com",
  "referredUserId": "user_xyz789",
  "purchaseValue": 199.99,
  "orderId": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "referralId": "550e8400-e29b-41d4-a716-446655440000",
  "commissionAmount": 25.00,
  "message": "Referral converted! Commission: $25.00"
}
```

### 5. Get Referral Statistics

**GET** `/api/referral/stats?userId={userId}&includeReferrals=true&includePayouts=true&limit=20`

Get comprehensive referral statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "referrer_id": "user_abc123",
    "referrer_email": "user@example.com",
    "total_referrals": 10,
    "signups": 7,
    "conversions": 3,
    "total_commissions": 150.00,
    "paid_commissions": 100.00,
    "pending_commissions": 50.00,
    "conversion_rate": 0.30,
    "signup_rate": 0.70,
    "avg_commission": 50.00
  },
  "recentReferrals": [...],
  "payouts": [...]
}
```

## Core Functions

### `generateReferralCode(userId, config?)`
Generate a unique referral code.

```typescript
const code = generateReferralCode('user_123')
// Returns: "REF-USE-A7B2C9"
```

### `validateReferralCode(code)`
Validate referral code format.

```typescript
const isValid = validateReferralCode('REF-USE-A7B2C9')
// Returns: true
```

### `calculateCommission(purchaseValue, config?)`
Calculate commission based on purchase value.

```typescript
const commission = calculateCommission(199.99)
// Returns: 25.00 (higher of 10% or $25 flat)
```

### `getOrCreateReferralCode(userId, email)`
Get existing or create new referral code for user.

```typescript
const code = await getOrCreateReferralCode('user_123', 'user@example.com')
// Returns: "REF-USE-A7B2C9"
```

### `trackReferralSignup(code, email, metadata?)`
Track when someone signs up with a referral code.

```typescript
const referralId = await trackReferralSignup(
  'REF-USE-A7B2C9',
  'newuser@example.com',
  {
    utmSource: 'twitter',
    ipAddress: '192.168.1.1'
  }
)
```

### `convertReferral(params, config?)`
Convert a referral when referred user makes qualifying purchase.

```typescript
const result = await convertReferral({
  referralCode: 'REF-USE-A7B2C9',
  referredEmail: 'newuser@example.com',
  referredUserId: 'user_xyz',
  purchaseValue: 199.99,
  orderId: 'order_123'
})
// Returns: { referralId, commissionAmount }
```

### `getReferralStats(userId)`
Get aggregated statistics for a referrer.

```typescript
const stats = await getReferralStats('user_123')
// Returns: ReferralStats object
```

### `getUserReferrals(userId, limit?)`
Get all referrals for a user.

```typescript
const referrals = await getUserReferrals('user_123', 50)
// Returns: Referral[]
```

### `getUserPayouts(userId, limit?)`
Get all payouts for a user.

```typescript
const payouts = await getUserPayouts('user_123', 50)
// Returns: ReferralPayout[]
```

## Installation & Setup

### 1. Database Setup

Run the schema in your Supabase SQL editor:

```bash
# Copy the SQL schema
cat lib/db-schema-referral.sql

# Paste into Supabase SQL Editor and execute
```

### 2. Environment Variables

No additional environment variables needed. Uses existing `DATABASE_URL`.

### 3. Verify Installation

```bash
# Check tables created
psql $DATABASE_URL -c "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'referral%';"

# Should show: referrals, referral_payouts
```

## Usage Examples

### Frontend Integration

#### 1. Display User's Referral Code

```typescript
// In a dashboard component
const { data } = await fetch('/api/referral/code?userId=user_123')
const { referralCode, stats } = await data.json()

// Display code: REF-USE-A7B2C9
// Share link: https://yoursite.com/signup?ref=REF-USE-A7B2C9
```

#### 2. Track Signup with Referral Code

```typescript
// On signup page
const urlParams = new URLSearchParams(window.location.search)
const referralCode = urlParams.get('ref')

if (referralCode) {
  // Track the referral
  await fetch('/api/referral/track', {
    method: 'POST',
    body: JSON.stringify({
      referralCode,
      referredEmail: userEmail,
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
    })
  })
}
```

#### 3. Convert on Purchase

```typescript
// In your checkout success handler
await fetch('/api/referral/convert', {
  method: 'POST',
  body: JSON.stringify({
    referredEmail: purchaserEmail,
    referredUserId: purchaserId,
    purchaseValue: orderTotal,
    orderId: order.id
  })
})
```

#### 4. Display Statistics Dashboard

```typescript
// Referral dashboard component
const { data } = await fetch('/api/referral/stats?userId=user_123')
const { stats, recentReferrals, payouts } = await data.json()

// Display:
// - Total referrals: {stats.total_referrals}
// - Conversion rate: {stats.conversion_rate}%
// - Pending commissions: ${stats.pending_commissions}
// - Recent referrals table
// - Payout history
```

## Backend Integration

### Webhook for Stripe Purchases

```typescript
// In your Stripe webhook handler
import { convertReferral } from '@/lib/referral'

// When payment succeeds
if (event.type === 'checkout.session.completed') {
  const session = event.data.object

  // Convert referral if exists
  try {
    await convertReferral({
      referredEmail: session.customer_email,
      referredUserId: session.client_reference_id,
      purchaseValue: session.amount_total / 100,
      orderId: session.id
    })
  } catch (error) {
    // Referral might not exist, that's ok
    console.log('No referral to convert')
  }
}
```

### Background Job: Mark Expired Referrals

```typescript
// Run daily via cron
import { markExpiredReferrals } from '@/lib/referral'

// Cron job (Vercel Cron, AWS Lambda, etc.)
export async function markExpired() {
  const count = await markExpiredReferrals()
  console.log(`Marked ${count} referrals as expired`)
}
```

## Testing

### 1. Test Code Generation

```bash
curl -X POST http://localhost:3000/api/referral/code \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123","email":"test@example.com"}'
```

### 2. Test Tracking

```bash
curl -X POST http://localhost:3000/api/referral/track \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode":"REF-USE-A7B2C9",
    "referredEmail":"newuser@example.com"
  }'
```

### 3. Test Conversion

```bash
curl -X POST http://localhost:3000/api/referral/convert \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode":"REF-USE-A7B2C9",
    "referredEmail":"newuser@example.com",
    "purchaseValue":199.99
  }'
```

### 4. Test Statistics

```bash
curl http://localhost:3000/api/referral/stats?userId=user_123
```

## Security Considerations

1. **Authentication**: All endpoints verify user identity via Clerk
2. **Authorization**: Users can only access their own referral data
3. **RLS Policies**: Database-level security ensures data isolation
4. **Input Validation**: All inputs validated before processing
5. **Rate Limiting**: Consider adding rate limits to prevent abuse
6. **Fraud Prevention**: Track IP, user agent, and implement abuse detection

## Future Enhancements

- [ ] Referral tiers (bronze, silver, gold)
- [ ] Multi-level marketing (MLM) support
- [ ] Referral leaderboards
- [ ] Custom commission rules per user
- [ ] Automated payout processing
- [ ] Email notifications for conversions
- [ ] Analytics dashboard with charts
- [ ] Referral link shortener
- [ ] Social sharing integration
- [ ] Mobile app support

## Troubleshooting

### Common Issues

**Issue**: Referral code not found
- Check code format (REF-XXX-XXXXXX)
- Verify code exists in database
- Check if code is expired

**Issue**: Commission not calculated
- Verify purchase value meets minimum ($100)
- Check referral status (must be 'pending' or 'signed_up')
- Ensure referral not already converted

**Issue**: RLS policy blocking access
- Verify user authentication
- Check userId matches referrer_id
- Review Supabase RLS policies

## Support

For issues or questions:
1. Check the database logs in Supabase
2. Review API response error messages
3. Check the TypeScript types for correct data structures
4. Verify environment variables are set

## License

Part of the A-Startup-Biz project.
