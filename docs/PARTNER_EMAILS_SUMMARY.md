# Partner Email System - Implementation Summary

## What Was Created

A complete email notification system for the partner program with 5 email templates and scheduled job setup.

## Files Created/Modified

### Email Templates (`lib/email/templates/`)
1. **partner-approved.tsx** - Approval notification with account details and getting started guide
2. **partner-lead-converted.tsx** - Conversion notification with commission breakdown
3. **partner-payout-sent.tsx** - Payout initiated notification with estimated arrival
4. **partner-payout-completed.tsx** - Payout completed confirmation
5. **partner-weekly-summary.tsx** - Weekly performance report with metrics

### Updated Files
- **lib/email.ts** - Added 4 new email functions:
  - `sendPartnerApprovedEmail()`
  - `sendLeadConvertedEmail()`
  - `sendPayoutEmail()` (handles both 'sent' and 'completed')
  - `sendWeeklySummaryEmail()`

### Documentation
- **docs/partner-email-system.md** - Complete usage guide with examples
- **docs/partner-email-scheduled-jobs.md** - Vercel cron setup instructions

## Email Functions

### 1. sendPartnerApprovedEmail()
**When to use**: After admin approves a partner application

```typescript
await sendPartnerApprovedEmail({
  email: partner.email,
  partnerName: partner.name,
  companyName: partner.company_name,
  commissionRate: partner.commission_rate,
  referralCode: partner.referral_code,
})
```

### 2. sendLeadConvertedEmail()
**When to use**: After a referred lead makes a purchase

```typescript
await sendLeadConvertedEmail({
  email: partner.email,
  partnerName: partner.name,
  leadName: order.customer_name,
  orderValue: order.total,
  commissionAmount: order.total * (partner.commission_rate / 100),
  commissionRate: partner.commission_rate,
  orderId: order.id,
})
```

### 3. sendPayoutEmail()
**When to use**: When initiating or completing a payout

```typescript
// When payout is sent
await sendPayoutEmail({
  email: partner.email,
  partnerName: partner.name,
  payoutId: payout.id,
  amount: payout.amount,
  payoutMethod: 'Bank Transfer',
  transactionCount: 5,
  type: 'sent',
  periodStart: 'Jan 1, 2024',
  periodEnd: 'Jan 31, 2024',
})

// When payout completes
await sendPayoutEmail({
  email: partner.email,
  partnerName: partner.name,
  payoutId: payout.id,
  amount: payout.amount,
  payoutMethod: 'Bank Transfer',
  transactionCount: 5,
  type: 'completed',
})
```

### 4. sendWeeklySummaryEmail()
**When to use**: Automated via cron job every Monday

```typescript
await sendWeeklySummaryEmail({
  email: partner.email,
  partnerName: partner.name,
  weekStart: 'Dec 22, 2024',
  weekEnd: 'Dec 28, 2024',
  totalClicks: 150,
  totalLeads: 12,
  totalConversions: 3,
  weeklyEarnings: 450.00,
  monthToDateEarnings: 1200.00,
  conversionRate: 25.0,
  topReferralSource: 'Blog',
  pendingPayout: 1200.00,
})
```

## Next Steps for Implementation

### 1. Set Up Vercel Cron Job (for weekly summaries)

Create `app/api/cron/partner-weekly-summary/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { sendWeeklySummaryEmail } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createClient()

  // Get active partners
  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .eq('status', 'active')
    .eq('email_notifications', true)

  // Send emails to each partner
  for (const partner of partners || []) {
    // Calculate stats and send email
    await sendWeeklySummaryEmail({
      email: partner.email,
      partnerName: partner.name,
      // ... stats data
    })
  }

  return NextResponse.json({ success: true })
}
```

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/partner-weekly-summary",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### 2. Add Database Functions

Create PostgreSQL functions in Supabase for calculating partner stats:
- `get_partner_weekly_stats(partner_id, start_date, end_date)`
- `get_partner_monthly_stats(partner_id, start_date)`

See `docs/partner-email-scheduled-jobs.md` for complete SQL.

### 3. Integrate Email Calls

**In partner approval flow:**
```typescript
// After updating partner status to 'active'
await sendPartnerApprovedEmail({ ... })
```

**In order completion webhook:**
```typescript
// After order is paid and partner_id exists
await sendLeadConvertedEmail({ ... })
```

**In payout processor:**
```typescript
// When initiating payout
await sendPayoutEmail({ ..., type: 'sent' })

// When payout webhook confirms completion
await sendPayoutEmail({ ..., type: 'completed' })
```

### 4. Add Email Preferences

Add to partners table:
```sql
ALTER TABLE partners
ADD COLUMN email_notifications BOOLEAN DEFAULT true;
```

Add toggle in partner settings page.

## Email Design Features

All templates include:
- Responsive design (600px max-width)
- Gradient icons and buttons
- Branded colors (#ff6a1a orange primary)
- Clean card-based layout
- Professional typography
- Call-to-action buttons
- Support contact links

## Testing

Test emails without sending:
```typescript
// Set RESEND_API_KEY to empty string in .env.local
// Emails will be logged to console instead of sent

await sendPartnerApprovedEmail({
  email: 'test@example.com',
  partnerName: 'Test Partner',
  commissionRate: 20,
  referralCode: 'TEST123',
})
```

## Environment Variables Required

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
CRON_SECRET=your-random-secret-here
```

## Documentation References

- Complete usage guide: `docs/partner-email-system.md`
- Cron job setup: `docs/partner-email-scheduled-jobs.md`

## Quick Reference

| Email Type | Function | Trigger |
|------------|----------|---------|
| Partner Approved | `sendPartnerApprovedEmail()` | Admin approves application |
| Lead Converted | `sendLeadConvertedEmail()` | Referral makes purchase |
| Payout Sent | `sendPayoutEmail(..., type: 'sent')` | Payout initiated |
| Payout Completed | `sendPayoutEmail(..., type: 'completed')` | Bank confirms receipt |
| Weekly Summary | `sendWeeklySummaryEmail()` | Cron job (Mondays 9 AM) |

## Ready to Use

All email templates and functions are ready to use. Just:
1. Call the appropriate function when events occur
2. Set up the cron job for weekly summaries
3. Test with your email address first
4. Monitor Resend dashboard for delivery

The system is fully functional and follows the existing A Startup Biz email design patterns.
