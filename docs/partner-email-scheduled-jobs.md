# Partner Email Scheduled Jobs

This document explains how to set up scheduled jobs for partner email notifications using Vercel Cron Jobs.

## Overview

The partner email system includes the following notifications:

1. **Partner Approved** - Sent when partner application is approved (triggered by admin action)
2. **Lead Converted** - Sent when a referral converts to paying customer (triggered by order)
3. **Payout Sent** - Sent when payout is initiated (triggered by payout system)
4. **Payout Completed** - Sent when payout reaches bank (triggered by payout system)
5. **Weekly Summary** - Sent every Monday with earnings summary (scheduled job)

## Setting Up Vercel Cron Jobs

### 1. Create API Route for Weekly Summaries

Create file: `app/api/cron/partner-weekly-summary/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { sendWeeklySummaryEmail } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

// Verify this request is from Vercel Cron
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Get all active partners
    const { data: partners, error } = await supabase
      .from('partners')
      .select('*')
      .eq('status', 'active')
      .eq('email_notifications', true)

    if (error) throw error

    // Calculate date range for last week
    const today = new Date()
    const weekEnd = new Date(today)
    weekEnd.setDate(today.getDate() - 1) // Yesterday
    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() - 6) // 7 days ago

    const results = []

    for (const partner of partners || []) {
      // Get partner stats for the week
      const { data: weekStats } = await supabase
        .rpc('get_partner_weekly_stats', {
          partner_id: partner.id,
          start_date: weekStart.toISOString(),
          end_date: weekEnd.toISOString(),
        })

      // Get month-to-date stats
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const { data: monthStats } = await supabase
        .rpc('get_partner_monthly_stats', {
          partner_id: partner.id,
          start_date: monthStart.toISOString(),
        })

      // Send email
      const result = await sendWeeklySummaryEmail({
        email: partner.email,
        partnerName: partner.name,
        weekStart: weekStart.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        weekEnd: weekEnd.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        totalClicks: weekStats?.total_clicks || 0,
        totalLeads: weekStats?.total_leads || 0,
        totalConversions: weekStats?.total_conversions || 0,
        weeklyEarnings: weekStats?.weekly_earnings || 0,
        monthToDateEarnings: monthStats?.month_earnings || 0,
        conversionRate: weekStats?.conversion_rate || 0,
        topReferralSource: weekStats?.top_source,
        pendingPayout: monthStats?.pending_payout || 0,
      })

      results.push({
        partner: partner.email,
        success: result.success,
      })
    }

    return NextResponse.json({
      success: true,
      sent: results.length,
      results,
    })
  } catch (error) {
    console.error('Weekly summary cron error:', error)
    return NextResponse.json(
      { error: 'Failed to send weekly summaries' },
      { status: 500 }
    )
  }
}
```

### 2. Create Vercel Cron Configuration

Create file: `vercel.json` in project root

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

This runs every Monday at 9:00 AM UTC.

**Schedule Format:**
- `* * * * *` = minute hour day month weekday
- `0 9 * * 1` = At 9:00 AM every Monday

### 3. Set Environment Variables

Add to `.env.local` and Vercel:

```bash
# Cron job authentication
CRON_SECRET=your-random-secret-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

Add to Vercel:
```bash
vercel env add CRON_SECRET
```

### 4. Deploy to Vercel

```bash
vercel --prod
```

## Database Functions Required

Create these PostgreSQL functions in Supabase:

### get_partner_weekly_stats

```sql
CREATE OR REPLACE FUNCTION get_partner_weekly_stats(
  partner_id UUID,
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
RETURNS TABLE (
  total_clicks INTEGER,
  total_leads INTEGER,
  total_conversions INTEGER,
  weekly_earnings DECIMAL,
  conversion_rate DECIMAL,
  top_source TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT pc.id)::INTEGER as total_clicks,
    COUNT(DISTINCT pl.id)::INTEGER as total_leads,
    COUNT(DISTINCT CASE WHEN pl.status = 'converted' THEN pl.id END)::INTEGER as total_conversions,
    COALESCE(SUM(CASE WHEN pl.status = 'converted' THEN c.amount ELSE 0 END), 0)::DECIMAL as weekly_earnings,
    CASE
      WHEN COUNT(DISTINCT pl.id) > 0
      THEN (COUNT(DISTINCT CASE WHEN pl.status = 'converted' THEN pl.id END)::DECIMAL / COUNT(DISTINCT pl.id)::DECIMAL * 100)
      ELSE 0
    END as conversion_rate,
    (
      SELECT source
      FROM partner_clicks
      WHERE partner_id = $1
        AND created_at BETWEEN $2 AND $3
      GROUP BY source
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as top_source
  FROM partner_clicks pc
  LEFT JOIN partner_leads pl ON pl.partner_id = pc.partner_id
  LEFT JOIN commissions c ON c.lead_id = pl.id
  WHERE pc.partner_id = $1
    AND pc.created_at BETWEEN $2 AND $3;
END;
$$ LANGUAGE plpgsql;
```

### get_partner_monthly_stats

```sql
CREATE OR REPLACE FUNCTION get_partner_monthly_stats(
  partner_id UUID,
  start_date TIMESTAMP
)
RETURNS TABLE (
  month_earnings DECIMAL,
  pending_payout DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(c.amount), 0)::DECIMAL as month_earnings,
    COALESCE(SUM(CASE WHEN c.payout_status = 'pending' THEN c.amount ELSE 0 END), 0)::DECIMAL as pending_payout
  FROM commissions c
  JOIN partner_leads pl ON pl.id = c.lead_id
  WHERE pl.partner_id = $1
    AND c.created_at >= $2;
END;
$$ LANGUAGE plpgsql;
```

## Testing Cron Jobs Locally

You can't test Vercel Cron locally, but you can test the endpoint:

```bash
# Set CRON_SECRET in .env.local
# Then make a request:
curl http://localhost:3000/api/cron/partner-weekly-summary \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Alternative Scheduling Options

### Using Vercel Cron (Recommended for Production)
- Pros: Built-in, serverless, no extra services
- Cons: Only available on Vercel, limited to 1 request per cron

### Using Supabase Edge Functions
```typescript
// Create a Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Same logic as above
})
```

Schedule with Supabase:
```bash
supabase functions deploy partner-weekly-summary
# Then use Supabase's cron configuration
```

### Using GitHub Actions
```yaml
# .github/workflows/partner-emails.yml
name: Partner Weekly Emails
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC

jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger cron endpoint
        run: |
          curl -X GET https://your-domain.com/api/cron/partner-weekly-summary \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Monitoring

### View Cron Logs in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Click "Cron Jobs" tab
4. View execution history

### Add Error Monitoring

```typescript
// In your cron route
import * as Sentry from '@sentry/nextjs'

try {
  // ... send emails
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

## Email Preferences

Partners should be able to opt out of weekly summaries:

```typescript
// Add to partner settings page
const { data, error } = await supabase
  .from('partners')
  .update({ email_notifications: false })
  .eq('id', partnerId)
```

Check this flag in the cron job:
```typescript
.eq('email_notifications', true)
```

## Best Practices

1. **Rate Limiting**: Send emails in batches to avoid rate limits
2. **Error Handling**: Log failures but don't stop the entire job
3. **Idempotency**: Track which emails were sent to avoid duplicates
4. **Testing**: Test with a small group before rolling out
5. **Monitoring**: Set up alerts for job failures

## Example Usage in Partner Events

### When Partner is Approved

```typescript
// In admin approval handler
await sendPartnerApprovedEmail({
  email: partner.email,
  partnerName: partner.name,
  companyName: partner.company_name,
  commissionRate: partner.commission_rate,
  referralCode: partner.referral_code,
})
```

### When Lead Converts

```typescript
// In order confirmation handler
if (order.referral_partner_id) {
  const { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('id', order.referral_partner_id)
    .single()

  if (partner) {
    await sendLeadConvertedEmail({
      email: partner.email,
      partnerName: partner.name,
      leadName: order.customer_name,
      orderValue: order.total,
      commissionAmount: order.total * (partner.commission_rate / 100),
      commissionRate: partner.commission_rate,
      orderId: order.id,
    })
  }
}
```

### When Payout is Sent

```typescript
// In payout initiation handler
await sendPayoutEmail({
  email: partner.email,
  partnerName: partner.name,
  payoutId: payout.id,
  amount: payout.amount,
  payoutMethod: payout.method,
  transactionCount: payout.transaction_count,
  type: 'sent',
  periodStart: formatDate(payout.period_start),
  periodEnd: formatDate(payout.period_end),
})
```

### When Payout Completes

```typescript
// In payout webhook handler (from Stripe/bank)
await sendPayoutEmail({
  email: partner.email,
  partnerName: partner.name,
  payoutId: payout.id,
  amount: payout.amount,
  payoutMethod: payout.method,
  transactionCount: payout.transaction_count,
  type: 'completed',
})
```
