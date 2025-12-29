# Notification Email Service - Quick Setup Guide

Follow these steps to get the notification email service running.

## Prerequisites

- PostgreSQL database (Neon or similar)
- Resend account with API key
- Vercel deployment (for cron jobs) or custom cron setup

## Step 1: Database Migration

Run the notification preferences migration to add email tracking columns:

```bash
# Using psql
psql $DATABASE_URL -f scripts/migrations/009_notification_preferences.sql

# Or using your migration tool
npm run db:migrate
```

Verify the migration:

```sql
-- Check that email columns exist
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'notifications'
  AND column_name IN ('email_sent', 'email_sent_at', 'email_error');
```

Expected output:
```
 column_name
--------------
 email_sent
 email_sent_at
 email_error
```

## Step 2: Environment Variables

Add these to your `.env.local` (development) and Vercel environment (production):

```env
# Required
RESEND_API_KEY=re_your_key_here
API_SECRET_KEY=your-random-secret-key-here
CRON_SECRET=your-cron-secret-here

# Optional (defaults shown)
EMAIL_FROM=A Startup Biz <noreply@astartupbiz.com>
SUPPORT_EMAIL=support@astartupbiz.com
```

### Generate secrets:

```bash
# Generate API_SECRET_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Set in Vercel:

```bash
vercel env add API_SECRET_KEY
vercel env add CRON_SECRET
```

## Step 3: Test Email Templates

Verify Resend integration works:

```bash
# Create a test notification
psql $DATABASE_URL <<EOF
INSERT INTO notifications (user_id, type, title, message, data)
SELECT
  id,
  'account_approved',
  'Test: Partner Account Approved',
  'This is a test notification',
  jsonb_build_object(
    'partnerName', 'Test Partner',
    'commissionRate', 20,
    'referralCode', 'TEST123'
  )
FROM users
WHERE role = 'partner'
LIMIT 1;
EOF

# Send the email
npm run notify:send

# Check if it was sent
psql $DATABASE_URL -c "
  SELECT
    type,
    title,
    email_sent,
    email_error
  FROM notifications
  WHERE created_at > NOW() - INTERVAL '1 minute';
"
```

Expected output:
```
      type        |            title            | email_sent | email_error
------------------+-----------------------------+------------+-------------
 account_approved | Test: Partner Account...    | t          |
```

## Step 4: Deploy to Vercel

Push to your repository and deploy:

```bash
git add .
git commit -m "Add notification email service"
git push

# Deploy
vercel --prod
```

The `vercel.json` file already configures the cron job to run every 5 minutes.

## Step 5: Verify Cron Job

### Option A: Wait for automatic run

Cron jobs run every 5 minutes. Check Vercel logs:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Cron Jobs" tab
4. View logs for `/api/notifications/send-email`

### Option B: Manually trigger

```bash
# Using curl (requires CRON_SECRET)
curl -X POST https://your-domain.vercel.app/api/notifications/send-email \
  -H "x-cron-secret: $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"send_pending": true, "limit": 10}'
```

## Step 6: Create First Real Notification

Test with a real notification workflow:

```typescript
// Example: Approve a partner
import { sql } from '@/lib/db'

async function approvePartner(partnerId: string) {
  // Update partner status
  await sql`
    UPDATE partners
    SET status = 'active', approved_at = NOW()
    WHERE id = ${partnerId}
  `

  // Get partner details
  const partner = await sql`
    SELECT * FROM partners WHERE id = ${partnerId}
  `

  // Create notification (email will be sent by cron)
  await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      ${partner[0].user_id},
      'account_approved',
      'Partner Account Approved!',
      'Congratulations! Your partner account has been approved.',
      ${JSON.stringify({
        partnerId: partner[0].id,
        partnerName: partner[0].name,
        companyName: partner[0].company_name,
        commissionRate: partner[0].commission_rate,
        referralCode: partner[0].referral_code,
        portalUrl: 'https://astartupbiz.com/partner-portal'
      })}
    )
  `
}
```

## Verification Checklist

- [ ] Database migration completed
- [ ] Email columns added to `notifications` table
- [ ] Environment variables set
- [ ] Resend API key verified
- [ ] Test email sent successfully
- [ ] Vercel deployment completed
- [ ] Cron job running (check logs)
- [ ] Real notification created and email sent

## Common Issues

### Issue: "No email template for notification type"

**Solution**: Check that notification `type` matches one of:
- `account_approved`
- `payout_completed`
- `payout_failed`
- `lead_converted`

### Issue: "User email not found"

**Solution**: Verify user exists and has email:
```sql
SELECT id, email FROM users WHERE id = 'user-id-here';
```

### Issue: "RESEND_API_KEY is not set"

**Solution**: Check environment variables:
```bash
vercel env ls
```

Add if missing:
```bash
vercel env add RESEND_API_KEY
```

### Issue: Emails not sending after 5+ minutes

**Solutions**:

1. Check cron logs in Vercel
2. Verify cron job is enabled
3. Check for pending notifications:
   ```sql
   SELECT COUNT(*) FROM notifications
   WHERE email_sent = false AND email_error IS NULL;
   ```
4. Manually trigger:
   ```bash
   npm run notify:send
   ```

### Issue: All emails failing with same error

**Solutions**:

1. Check Resend dashboard for API errors
2. Verify email template syntax
3. Check `email_error` for pattern:
   ```sql
   SELECT email_error, COUNT(*)
   FROM notifications
   WHERE email_error IS NOT NULL
   GROUP BY email_error;
   ```

## Monitoring Setup

### Daily Email Statistics

Create a monitoring query:

```sql
-- Save this as a view or run daily
CREATE OR REPLACE VIEW notification_email_stats AS
SELECT
  DATE(created_at) as date,
  type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE email_sent = true) as sent,
  COUNT(*) FILTER (WHERE email_sent = false AND email_error IS NULL) as pending,
  COUNT(*) FILTER (WHERE email_error IS NOT NULL) as failed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE email_sent = true) / COUNT(*), 2) as success_rate
FROM notifications
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), type
ORDER BY date DESC, type;
```

View stats:
```sql
SELECT * FROM notification_email_stats;
```

### Set Up Alerts

Create alerts for high failure rates:

```sql
-- Find days with >10% failure rate
SELECT *
FROM notification_email_stats
WHERE success_rate < 90
  AND total > 10;
```

### Monitor Queue Depth

Check if notifications are piling up:

```sql
-- Alert if >100 pending
SELECT COUNT(*) as pending_count
FROM notifications
WHERE email_sent = false
  AND email_error IS NULL
  AND created_at > NOW() - INTERVAL '1 hour';
```

## Production Recommendations

1. **Set up monitoring**: Use Vercel alerts for cron failures
2. **Monitor Resend quota**: Check monthly email limits
3. **Review failed emails weekly**: Check `email_error` patterns
4. **Clean up old notifications**: Run cleanup function monthly
5. **Test new notification types**: Always test in staging first

## Testing Checklist

Before deploying new notification types:

- [ ] Create test notification in development
- [ ] Verify email template renders correctly
- [ ] Check data mapping is correct
- [ ] Test user preference filtering
- [ ] Verify failure handling
- [ ] Test retry logic
- [ ] Check mobile/desktop rendering
- [ ] Verify links work correctly

## Rollback Procedure

If you need to disable the email service:

1. **Disable cron job**:
   - Remove `vercel.json` or comment out cron configuration
   - Redeploy: `vercel --prod`

2. **Stop manual sends**:
   ```bash
   # Don't run notify:send scripts
   ```

3. **Revert migration** (if needed):
   ```sql
   ALTER TABLE notifications DROP COLUMN email_sent;
   ALTER TABLE notifications DROP COLUMN email_sent_at;
   ALTER TABLE notifications DROP COLUMN email_error;
   DROP TABLE notification_preferences;
   ```

## Next Steps

After setup is complete:

1. **Review documentation**:
   - `lib/notification-email-service.README.md` - Full reference
   - `lib/notification-email-service.EXAMPLES.md` - Code examples

2. **Customize email templates**:
   - Edit files in `lib/email/templates/`
   - Test changes before deploying

3. **Add new notification types**:
   - Follow guide in README
   - Create new templates as needed

4. **Set up analytics**:
   - Track email open rates in Resend dashboard
   - Monitor conversion rates

5. **Optimize performance**:
   - Adjust cron frequency if needed
   - Increase batch size for high volume

## Support

If you encounter issues:

1. Check `NOTIFICATION_EMAIL_SERVICE.md` for overview
2. Review `notification-email-service.README.md` for details
3. See `notification-email-service.EXAMPLES.md` for code examples
4. Check Vercel logs for errors
5. Review Resend dashboard for delivery status

## Resources

- **Resend Documentation**: https://resend.com/docs
- **Vercel Cron Documentation**: https://vercel.com/docs/cron-jobs
- **Email Templates**: `lib/email/templates/`
- **API Endpoint**: `app/api/notifications/send-email/route.ts`

---

**Setup Complete!** Your notification email service is now ready to use.
