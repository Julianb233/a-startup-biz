# Partner Email Notification System

Complete email notification system for the partner program with 5 automated email templates and scheduled weekly summaries.

## Overview

The partner email system automatically notifies partners about important events:

- Partner account approval
- Referral conversions to paying customers
- Payout initiation and completion
- Weekly earnings summaries (automated)

## Email Templates

All templates are located in `/lib/email/templates/`:

### 1. Partner Approved (`partner-approved.tsx`)

**Trigger**: When a partner application is approved
**Subject**: "Your Partner Application is Approved! 🎉"

**Includes**:
- Welcome message with approval confirmation
- Partner account details (name, company, commission rate)
- Unique referral code
- Getting started guide (3 steps)
- Commission structure explanation
- CTA to access partner portal

### 2. Lead Converted (`partner-lead-converted.tsx`)

**Trigger**: When a referred lead becomes a paying customer
**Subject**: "Great News! You Earned $XX.XX 💰"

**Includes**:
- Prominent commission amount display
- Conversion details (customer, order value, date)
- Commission calculation breakdown
- Payout timeline information
- Encouragement to share more
- CTA to view dashboard and share referral link

### 3. Payout Sent (`partner-payout-sent.tsx`)

**Trigger**: When payout is initiated to partner's bank
**Subject**: "Your Payout of $XX.XX is On Its Way! 💸"

**Includes**:
- Payout amount and transaction count
- Payout details (ID, period, method)
- Estimated arrival date
- Processing time expectations
- CTA to view payout details

### 4. Payout Completed (`partner-payout-completed.tsx`)

**Trigger**: When payout reaches partner's bank account
**Subject**: "Payment Received: $XX.XX ✅"

**Includes**:
- Payment confirmation with amount
- Completion details and status
- Celebration message
- Current month progress preview
- CTA to view receipt and dashboard

### 5. Weekly Summary (`partner-weekly-summary.tsx`)

**Trigger**: Automated every Monday at 9 AM UTC
**Subject**: "Your Weekly Partner Report: $XX.XX Earned 📊" or "Keep Sharing!"

**Includes**:
- Weekly earnings summary
- Key metrics grid (clicks, leads, conversions, conversion rate)
- Month-to-date earnings and pending payout
- Top referral source
- Performance tips
- Special messaging for inactive partners
- CTA to dashboard

## Usage

### Function Signatures

All functions are exported from `/lib/email.ts`:

```typescript
// Partner Approved
await sendPartnerApprovedEmail({
  email: string
  partnerName: string
  companyName?: string
  commissionRate: number
  referralCode: string
  portalUrl?: string
})

// Lead Converted
await sendLeadConvertedEmail({
  email: string
  partnerName: string
  leadName: string
  orderValue: number
  commissionAmount: number
  commissionRate: number
  orderId: string
  conversionDate?: string
  portalUrl?: string
})

// Payout Notification (both sent and completed)
await sendPayoutEmail({
  email: string
  partnerName: string
  payoutId: string
  amount: number
  payoutMethod: string
  transactionCount: number
  type: 'sent' | 'completed'
  periodStart?: string
  periodEnd?: string
  estimatedArrival?: string
  completedDate?: string
  portalUrl?: string
})

// Weekly Summary
await sendWeeklySummaryEmail({
  email: string
  partnerName: string
  weekStart: string
  weekEnd: string
  totalClicks: number
  totalLeads: number
  totalConversions: number
  weeklyEarnings: number
  monthToDateEarnings: number
  conversionRate: number
  topReferralSource?: string
  pendingPayout: number
  portalUrl?: string
})
```

### Example: Partner Approval Flow

```typescript
// In admin approval handler
import { sendPartnerApprovedEmail } from '@/lib/email'

async function approvePartner(partnerId: string) {
  const supabase = await createClient()

  // Update partner status
  const { data: partner, error } = await supabase
    .from('partners')
    .update({ status: 'active', approved_at: new Date() })
    .eq('id', partnerId)
    .select()
    .single()

  if (error) throw error

  // Send approval email
  await sendPartnerApprovedEmail({
    email: partner.email,
    partnerName: partner.name,
    companyName: partner.company_name,
    commissionRate: partner.commission_rate,
    referralCode: partner.referral_code,
  })

  return partner
}
```

### Example: Lead Conversion Flow

```typescript
// In order completion webhook
import { sendLeadConvertedEmail } from '@/lib/email'

async function handleOrderCompleted(orderId: string) {
  const supabase = await createClient()

  // Get order with partner info
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      partner_lead:partner_leads(
        id,
        partner:partners(*)
      )
    `)
    .eq('id', orderId)
    .single()

  if (order?.partner_lead?.partner) {
    const partner = order.partner_lead.partner
    const commissionAmount = order.total * (partner.commission_rate / 100)

    // Create commission record
    await supabase.from('commissions').insert({
      partner_id: partner.id,
      lead_id: order.partner_lead.id,
      order_id: order.id,
      amount: commissionAmount,
      status: 'pending',
    })

    // Send notification
    await sendLeadConvertedEmail({
      email: partner.email,
      partnerName: partner.name,
      leadName: order.customer_name,
      orderValue: order.total,
      commissionAmount,
      commissionRate: partner.commission_rate,
      orderId: order.id,
    })
  }
}
```

### Example: Payout Flow

```typescript
// In payout processor
import { sendPayoutEmail } from '@/lib/email'

async function initiatePayout(partnerId: string) {
  const supabase = await createClient()

  // Get partner and pending commissions
  const { data: partner } = await supabase
    .from('partners')
    .select('*, commissions(amount)')
    .eq('id', partnerId)
    .single()

  const amount = partner.commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0)

  // Create payout record
  const { data: payout } = await supabase
    .from('payouts')
    .insert({
      partner_id: partnerId,
      amount,
      status: 'processing',
      method: partner.payout_method,
    })
    .select()
    .single()

  // Send payout initiated email
  await sendPayoutEmail({
    email: partner.email,
    partnerName: partner.name,
    payoutId: payout.id,
    amount: payout.amount,
    payoutMethod: payout.method,
    transactionCount: partner.commissions.length,
    type: 'sent',
    periodStart: 'Jan 1, 2024',
    periodEnd: 'Jan 31, 2024',
  })

  // Process payout with Stripe/bank...

  // When payout completes (in webhook):
  await sendPayoutEmail({
    email: partner.email,
    partnerName: partner.name,
    payoutId: payout.id,
    amount: payout.amount,
    payoutMethod: payout.method,
    transactionCount: partner.commissions.length,
    type: 'completed',
  })
}
```

## Scheduled Jobs

Weekly summary emails are sent automatically every Monday. See `/docs/partner-email-scheduled-jobs.md` for complete setup instructions.

### Quick Setup

1. Create cron API route: `app/api/cron/partner-weekly-summary/route.ts`
2. Add Vercel cron config to `vercel.json`:
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
3. Set `CRON_SECRET` environment variable
4. Deploy to Vercel

## Email Design

All templates follow the A Startup Biz brand:

- **Primary Color**: `#ff6a1a` (orange)
- **Success Color**: `#10b981` (green)
- **Warning Color**: `#f59e0b` (amber)
- **Info Color**: `#3b82f6` (blue)
- **Payout Color**: `#8b5cf6` (purple)

### Common Elements

- Circular gradient icons (80x80px)
- White card design with shadow
- Responsive layout (max-width: 600px)
- Gradient CTA buttons
- Tables for data display
- Colored info boxes for highlights
- Consistent footer with links

### Typography

- **Headings**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Large Numbers**: 48px, font-weight: 800 (earnings, metrics)
- **Body Text**: 16px, line-height: 1.6, color: #666
- **Labels**: 14px, uppercase, letter-spacing: 1px

## Testing

Test emails locally:

```typescript
// In a test file or API route
import { sendPartnerApprovedEmail } from '@/lib/email'

await sendPartnerApprovedEmail({
  email: 'test@example.com',
  partnerName: 'John Doe',
  companyName: 'ACME Corp',
  commissionRate: 20,
  referralCode: 'JOHN123',
})
```

Check console output when `RESEND_API_KEY` is not set - it will log instead of sending.

## Email Preferences

Partners should be able to opt out of weekly summaries:

```typescript
// Add to partners table
ALTER TABLE partners
ADD COLUMN email_notifications BOOLEAN DEFAULT true;

// Update in partner settings
const { error } = await supabase
  .from('partners')
  .update({ email_notifications: false })
  .eq('id', partnerId)
```

Check this in the weekly cron job:
```typescript
.eq('email_notifications', true)
```

## Dependencies

- **Resend**: Email sending service
- **React**: Email template rendering
- **Next.js**: API routes and serverless functions
- **Supabase**: Data queries and partner stats

## Environment Variables

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
CRON_SECRET=random-secret-string-here
```

## Files Created

```
lib/email.ts                              # Main email functions (updated)
lib/email/templates/
  ├── partner-approved.tsx                # Approval notification
  ├── partner-lead-converted.tsx          # Conversion notification
  ├── partner-payout-sent.tsx             # Payout initiated
  ├── partner-payout-completed.tsx        # Payout completed
  └── partner-weekly-summary.tsx          # Weekly report
docs/
  ├── partner-email-system.md             # This file
  └── partner-email-scheduled-jobs.md     # Cron setup guide
```

## Next Steps

1. Set up Vercel cron job for weekly summaries
2. Create database functions for partner stats
3. Add email preference toggles to partner settings
4. Implement payout processing with Stripe
5. Set up error monitoring for email failures
6. Add partner portal pages referenced in emails

## Support

For email issues:
- Check Resend dashboard for delivery logs
- Verify environment variables are set
- Test with a personal email first
- Check spam folder
- Monitor Vercel cron job execution logs
