# Referral System - Quick Start Guide

Get the referral tracking system up and running in 5 minutes.

## Step 1: Database Setup (2 minutes)

### Option A: Supabase (Recommended)

1. Open Supabase SQL Editor
2. Copy the entire contents of `/lib/db-schema-referral.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Verify tables created:

```sql
SELECT tablename FROM pg_tables
WHERE schemaname='public'
AND tablename LIKE 'referral%';

-- Should show: referrals, referral_payouts
```

### Option B: PostgreSQL (Alternative)

```bash
# Connect to your database
psql $DATABASE_URL

# Run the schema
\i /root/github-repos/a-startup-biz/lib/db-schema-referral.sql

# Verify
\dt referral*
```

## Step 2: Test API Endpoints (2 minutes)

### 1. Generate a Referral Code

```bash
curl -X POST http://localhost:3000/api/referral/code \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_test123",
    "email": "test@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "referralCode": "REF-USE-A7B2C9",
  "message": "Referral code generated successfully"
}
```

### 2. Track a Referral Signup

```bash
curl -X POST http://localhost:3000/api/referral/track \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "REF-USE-A7B2C9",
    "referredEmail": "newuser@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "referralId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Referral tracked successfully"
}
```

### 3. Convert to Commission

```bash
curl -X POST http://localhost:3000/api/referral/convert \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "REF-USE-A7B2C9",
    "referredEmail": "newuser@example.com",
    "purchaseValue": 199.99
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "referralId": "550e8400-e29b-41d4-a716-446655440000",
  "commissionAmount": 25.00,
  "message": "Referral converted! Commission: $25.00"
}
```

### 4. Get Statistics

```bash
curl http://localhost:3000/api/referral/stats?userId=user_test123
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "referrer_id": "user_test123",
    "referrer_email": "test@example.com",
    "total_referrals": 1,
    "signups": 1,
    "conversions": 1,
    "total_commissions": 25.00,
    "paid_commissions": 0.00,
    "pending_commissions": 25.00,
    "conversion_rate": 1.00,
    "signup_rate": 1.00,
    "avg_commission": 25.00
  },
  "recentReferrals": [...],
  "payouts": [...]
}
```

## Step 3: Verify in Database (1 minute)

```sql
-- Check referrals
SELECT
  referrer_email,
  referred_email,
  referral_code,
  status,
  commission_amount
FROM referrals
ORDER BY created_at DESC
LIMIT 5;

-- Check payouts
SELECT
  referrer_id,
  amount,
  status,
  created_at
FROM referral_payouts
ORDER BY created_at DESC
LIMIT 5;

-- Check stats view
SELECT * FROM referrer_stats;
```

## Step 4: Integration Examples

### Frontend: Display Referral Code

```typescript
// components/ReferralCard.tsx
'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

export function ReferralCard() {
  const { user } = useUser()
  const [code, setCode] = useState<string>('')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetch(`/api/referral/code?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setCode(data.referralCode)
          setStats(data.stats)
        })
    }
  }, [user])

  const shareUrl = `${window.location.origin}/signup?ref=${code}`

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Referral Code</h2>

      <div className="mb-4">
        <code className="text-3xl font-mono bg-gray-100 p-3 rounded">
          {code || 'Loading...'}
        </code>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="w-full p-2 border rounded"
          onClick={(e) => e.currentTarget.select()}
        />
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Total Referrals</div>
            <div className="text-2xl font-bold">{stats.total_referrals}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Conversions</div>
            <div className="text-2xl font-bold">{stats.conversions}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Pending Commission</div>
            <div className="text-2xl font-bold">${stats.pending_commissions}</div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Backend: Track on Signup

```typescript
// app/api/register/route.ts
import { trackReferralSignup } from '@/lib/referral'

export async function POST(request: Request) {
  const { email, password, referralCode } = await request.json()

  // ... create user account ...

  // Track referral if code provided
  if (referralCode) {
    try {
      await trackReferralSignup(referralCode, email, {
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })
    } catch (error) {
      console.error('Failed to track referral:', error)
      // Don't fail signup if referral tracking fails
    }
  }

  return Response.json({ success: true })
}
```

### Backend: Convert on Purchase

```typescript
// app/api/webhooks/stripe/route.ts
import { convertReferral } from '@/lib/referral'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Convert referral if exists
    try {
      await convertReferral({
        referredEmail: session.customer_email!,
        referredUserId: session.client_reference_id!,
        purchaseValue: session.amount_total! / 100,
        orderId: session.id,
      })
    } catch (error) {
      // Referral might not exist, that's ok
      console.log('No referral to convert')
    }
  }

  return Response.json({ received: true })
}
```

## Common Issues & Solutions

### Issue: "Referral code not found"

**Solution:** Check that the code exists in the database:

```sql
SELECT * FROM referrals WHERE referral_code = 'REF-XXX-XXXXX';
```

### Issue: "Purchase does not meet minimum"

**Solution:** Ensure purchase value is ≥ $100:

```typescript
// Commission only applies to purchases $100+
purchaseValue: 199.99  // ✓ Works
purchaseValue: 50.00   // ✗ Below minimum
```

### Issue: "Commission is $0"

**Solution:** Check commission calculation:

```typescript
import { calculateCommission } from '@/lib/referral'

const commission = calculateCommission(199.99)
console.log(commission) // Should be 25.00 (max of 10% or $25)
```

### Issue: "Unauthorized access"

**Solution:** Ensure user is authenticated and accessing own data:

```typescript
// Users can only access their own referrals
const { userId } = await auth()
// Then use userId in API calls
```

## Quick Test Script

Save as `test-referral-system.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
USER_ID="user_test_$(date +%s)"
EMAIL="test_$(date +%s)@example.com"

echo "Testing Referral System..."
echo "User ID: $USER_ID"
echo "Email: $EMAIL"
echo ""

# 1. Generate code
echo "1. Generating referral code..."
CODE_RESPONSE=$(curl -s -X POST $BASE_URL/api/referral/code \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\",\"email\":\"$EMAIL\"}")

CODE=$(echo $CODE_RESPONSE | jq -r '.referralCode')
echo "   Code: $CODE"
echo ""

# 2. Track signup
echo "2. Tracking referral signup..."
TRACK_RESPONSE=$(curl -s -X POST $BASE_URL/api/referral/track \
  -H "Content-Type: application/json" \
  -d "{\"referralCode\":\"$CODE\",\"referredEmail\":\"referred@example.com\"}")

echo "   Response: $TRACK_RESPONSE"
echo ""

# 3. Convert
echo "3. Converting referral..."
CONVERT_RESPONSE=$(curl -s -X POST $BASE_URL/api/referral/convert \
  -H "Content-Type: application/json" \
  -d "{\"referralCode\":\"$CODE\",\"purchaseValue\":199.99}")

echo "   Response: $CONVERT_RESPONSE"
echo ""

# 4. Get stats
echo "4. Getting statistics..."
STATS_RESPONSE=$(curl -s "$BASE_URL/api/referral/stats?userId=$USER_ID")

echo "   Stats: $STATS_RESPONSE"
echo ""

echo "✓ Test complete!"
```

Run:
```bash
chmod +x test-referral-system.sh
./test-referral-system.sh
```

## Next Steps

1. **Build Frontend Components**
   - Referral dashboard
   - Share buttons
   - Statistics charts

2. **Set Up Background Jobs**
   - Daily: Mark expired referrals
   - Weekly: Process payouts
   - Monthly: Generate reports

3. **Add Email Notifications**
   - New referral signup
   - Commission earned
   - Payout processed

4. **Configure Monitoring**
   - Track conversion rates
   - Alert on failures
   - Monitor fraud patterns

## Resources

- **Full Documentation**: `/REFERRAL_SYSTEM.md`
- **Architecture Guide**: `/REFERRAL_SYSTEM_ARCHITECTURE.md`
- **Implementation Summary**: `/REFERRAL_IMPLEMENTATION_SUMMARY.md`
- **Database Schema**: `/lib/db-schema-referral.sql`
- **Business Logic**: `/lib/referral.ts`
- **TypeScript Types**: `/lib/types/referral.ts`

## Support

If you encounter issues:

1. Check database tables exist
2. Verify API endpoints are accessible
3. Review TypeScript types match your data
4. Check Clerk authentication is working
5. Review error logs in API routes

---

**Ready to go!** Run the database schema, test the endpoints, and start tracking referrals.
