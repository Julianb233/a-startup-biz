# Notification Email Service - Implementation Summary

A complete email notification system for the A Startup Biz partner portal, automatically sending emails when notifications are created in the database.

## Overview

This implementation provides:

1. **Type-safe service layer** (`lib/notification-email-service.ts`) that maps notification types to email templates
2. **API endpoint** (`app/api/notifications/send-email/route.ts`) for triggering email sends via HTTP
3. **Automated cron job** (`vercel.json`) that processes pending emails every 5 minutes
4. **CLI tool** (`scripts/send-notification-emails.ts`) for manual execution
5. **Comprehensive documentation** with examples and best practices

## Files Created

### Core Service
- **`/Users/julianbradley/github-repos/a-startup-biz/lib/notification-email-service.ts`**
  - Main service handling email generation and sending
  - Maps notification types to email templates
  - Tracks email delivery status in database
  - Includes retry logic for failed emails

### API Endpoint
- **`/Users/julianbradley/github-repos/a-startup-biz/app/api/notifications/send-email/route.ts`**
  - POST endpoint for sending notification emails
  - GET endpoint for email statistics
  - Supports single/multiple/batch/retry operations
  - Authentication via API key or cron secret

### CLI Tool
- **`/Users/julianbradley/github-repos/a-startup-biz/scripts/send-notification-emails.ts`**
  - Command-line script for processing notifications
  - Supports dry-run mode
  - Can retry failed emails

### Configuration
- **`/Users/julianbradley/github-repos/a-startup-biz/vercel.json`**
  - Vercel cron configuration
  - Runs every 5 minutes automatically

### Documentation
- **`/Users/julianbradley/github-repos/a-startup-biz/lib/notification-email-service.README.md`**
  - Complete reference documentation
  - API usage guide
  - Database schema
  - Monitoring and troubleshooting

- **`/Users/julianbradley/github-repos/a-startup-biz/lib/notification-email-service.EXAMPLES.md`**
  - 20+ practical examples
  - Code snippets for all common use cases
  - Testing and debugging examples

### Package.json Updates
- Added `notify:send` script to send pending emails
- Added `notify:retry` script to retry failed emails

## Notification Types Supported

| Type | Template | When Sent |
|------|----------|-----------|
| `account_approved` | Partner Approved | When partner application is approved |
| `payout_completed` | Payout Completed | When payout reaches partner's account |
| `payout_failed` | Payout Sent (modified) | When payout fails |
| `lead_converted` | Lead Converted | When referred lead becomes customer |

## Database Schema

The service uses the `notifications` table with these email-specific columns:

```sql
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS email_error TEXT;
```

These columns were added in migration `009_notification_preferences.sql`.

## How It Works

### Automatic Email Flow

1. **Notification Created**
   - Application code or database trigger creates a notification record
   - Email is NOT sent immediately

2. **Cron Job Runs** (every 5 minutes)
   - Vercel triggers `/api/notifications/send-email`
   - API calls `getPendingNotificationEmails()` to fetch unsent notifications
   - Service checks user preferences to respect opt-outs

3. **Email Sent**
   - Service maps notification type to email template
   - Populates template with notification data
   - Sends via Resend API
   - Updates `email_sent` and `email_sent_at` on success
   - Updates `email_error` on failure

4. **Retry Logic**
   - Failed emails can be retried (max 3 attempts)
   - Retry count tracked in `data.retry_count`
   - Can be triggered manually or via cron

### Manual Email Flow

```typescript
// Create notification
await sql`INSERT INTO notifications (...) VALUES (...)`

// Send immediately (optional)
const result = await sendNotificationEmail(notification, userEmail)
```

## Usage Examples

### Send Pending Emails

```bash
# Via npm script
npm run notify:send

# Via curl (for cron jobs)
curl -X POST https://astartupbiz.com/api/notifications/send-email \
  -H "x-cron-secret: $CRON_SECRET" \
  -d '{"send_pending": true}'
```

### Retry Failed Emails

```bash
# Via npm script
npm run notify:retry

# Via API
curl -X POST https://astartupbiz.com/api/notifications/send-email \
  -H "Authorization: Bearer $API_SECRET_KEY" \
  -d '{"retry_failed": true}'
```

### Get Statistics

```bash
curl https://astartupbiz.com/api/notifications/send-email \
  -H "Authorization: Bearer $API_SECRET_KEY"
```

## Creating Notifications

### Example: Partner Approved

```typescript
await sql`
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    ${userId},
    'account_approved',
    'Partner Account Approved!',
    'Congratulations! Your partner account has been approved.',
    ${JSON.stringify({
      partnerName: 'John Doe',
      companyName: 'Acme Inc',
      commissionRate: 20,
      referralCode: 'JOHN2024',
      portalUrl: 'https://astartupbiz.com/partner-portal'
    })}
  )
`
```

### Example: Lead Converted

```typescript
await sql`
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    ${userId},
    'lead_converted',
    'Great News! You Earned a Commission',
    'Your referral Jane Smith just became a customer!',
    ${JSON.stringify({
      leadName: 'Jane Smith',
      orderValue: 2500.00,
      commissionAmount: 500.00,
      commissionRate: 20,
      orderId: 'order_123',
      conversionDate: new Date().toLocaleDateString()
    })}
  )
`
```

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://...

# Email Service (Resend)
RESEND_API_KEY=re_...

# API Authentication
API_SECRET_KEY=your-secret-key-here
CRON_SECRET=your-cron-secret-here

# Optional Email Configuration
EMAIL_FROM=A Startup Biz <noreply@astartupbiz.com>
SUPPORT_EMAIL=support@astartupbiz.com
```

## Deployment Checklist

1. **Database Migration**
   ```bash
   # Ensure migration 009 has been run
   psql $DATABASE_URL -f scripts/migrations/009_notification_preferences.sql
   ```

2. **Environment Variables**
   - Set `API_SECRET_KEY` in Vercel
   - Set `CRON_SECRET` in Vercel
   - Verify `RESEND_API_KEY` is set

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Test Cron Job**
   - Wait 5 minutes for first cron run, or
   - Manually trigger: `vercel env pull && npm run notify:send`

5. **Monitor**
   - Check Vercel cron logs
   - Query database for email statistics
   - Review failed emails in `notifications.email_error`

## Monitoring

### Check Email Queue

```sql
-- Pending emails
SELECT COUNT(*) FROM notifications
WHERE email_sent = false AND email_error IS NULL;

-- Failed emails
SELECT type, email_error, COUNT(*)
FROM notifications
WHERE email_error IS NOT NULL
GROUP BY type, email_error;

-- Success rate (last 24h)
SELECT
  COUNT(*) FILTER (WHERE email_sent = true) * 100.0 / COUNT(*) as success_rate
FROM notifications
WHERE created_at > NOW() - INTERVAL '24 hours';
```

### View Recent Activity

```sql
SELECT
  type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE email_sent = true) as sent,
  COUNT(*) FILTER (WHERE email_sent = false AND email_error IS NULL) as pending,
  COUNT(*) FILTER (WHERE email_error IS NOT NULL) as failed
FROM notifications
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY type;
```

## Testing

### Test in Development

```bash
# Create a test notification in your database
psql $DATABASE_URL -c "
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT
    id,
    'account_approved',
    'Test Notification',
    'This is a test',
    '{\"partnerName\":\"Test\",\"commissionRate\":20,\"referralCode\":\"TEST\"}'::jsonb
  FROM users
  LIMIT 1;
"

# Send emails
npm run notify:send

# Check if email was sent
psql $DATABASE_URL -c "
  SELECT type, email_sent, email_error
  FROM notifications
  WHERE created_at > NOW() - INTERVAL '1 minute';
"
```

### Test API Endpoint

```bash
# Get stats
curl http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer test-key"

# Send pending
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer test-key" \
  -d '{"send_pending": true, "limit": 5}'
```

## Troubleshooting

### Emails Not Sending

1. **Check notification was created**
   ```sql
   SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
   ```

2. **Check email_error column**
   ```sql
   SELECT id, type, email_error FROM notifications WHERE email_error IS NOT NULL;
   ```

3. **Check user preferences**
   ```sql
   SELECT np.* FROM notification_preferences np
   JOIN notifications n ON n.user_id = np.user_id
   WHERE n.id = 'notification-id-here';
   ```

4. **Verify Resend API key**
   ```bash
   echo $RESEND_API_KEY
   ```

5. **Check cron logs in Vercel**

### High Failure Rate

- Check Resend dashboard for API errors
- Verify email templates are correct
- Review `email_error` messages for patterns
- Check for rate limiting

### Duplicate Emails

- Verify `email_sent` flag is being set correctly
- Check for duplicate notification records
- Ensure cron job isn't running too frequently

## Adding New Notification Types

1. Create email template in `/lib/email/templates/`
2. Add import to `notification-email-service.ts`
3. Add to `NOTIFICATION_EMAIL_TEMPLATES` mapping
4. Add switch case in `sendNotificationEmail()`
5. Update TypeScript types if needed
6. Update documentation

See `notification-email-service.README.md` for detailed instructions.

## Performance Considerations

- **Batch size**: Default limit is 50 notifications per run
- **Cron frequency**: Runs every 5 minutes (configurable)
- **Retry limit**: Maximum 3 retry attempts per notification
- **Email API**: Uses Resend with built-in rate limiting
- **Database queries**: Optimized with indexes on `user_id`, `email_sent`, `type`

## Security

- API requires authentication (API_SECRET_KEY or CRON_SECRET)
- User preferences are respected (email opt-outs)
- Email addresses are never exposed in logs
- Failed emails are tracked for audit purposes
- SQL injection protection via parameterized queries

## Future Enhancements

Possible improvements:

1. **Email templates in database** for easier customization
2. **Email preview** before sending
3. **A/B testing** different email templates
4. **Email analytics** (open rates, click rates)
5. **SMS notifications** as alternative channel
6. **Push notifications** for mobile apps
7. **Email scheduling** for specific send times
8. **Digest emails** combining multiple notifications
9. **Rich text editor** for custom email content
10. **Webhook support** for third-party integrations

## Support

For issues or questions:

1. Check the documentation in `notification-email-service.README.md`
2. Review examples in `notification-email-service.EXAMPLES.md`
3. Check database logs: `SELECT * FROM notifications WHERE email_error IS NOT NULL`
4. Review Vercel cron logs
5. Check Resend dashboard for delivery status
6. Contact development team

## License

Part of the A Startup Biz project.
