# Notification Email Service

Automated email sending system for partner portal notifications.

## Overview

This service handles sending emails for notification records stored in the `notifications` table. It maps notification types to appropriate email templates and tracks email delivery status.

## Features

- **Type-safe notification handling** with TypeScript interfaces
- **Automatic template mapping** based on notification type
- **Email delivery tracking** (sent status, timestamps, errors)
- **User preference filtering** respects notification preferences
- **Retry logic** for failed emails
- **Batch processing** for multiple notifications

## Notification Types Supported

| Notification Type | Email Template | Description |
|------------------|----------------|-------------|
| `account_approved` | Partner Approved | Sent when partner application is approved |
| `payout_completed` | Payout Completed | Sent when payout reaches partner's account |
| `payout_failed` | Payout Sent (modified) | Sent when payout fails with error details |
| `lead_converted` | Lead Converted | Sent when referred lead converts to customer |

## Database Schema

The service uses the following tables:

### `notifications` Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE
);
```

### `notification_preferences` Table
```sql
CREATE TABLE notification_preferences (
  user_id UUID REFERENCES users(id),
  email_enabled BOOLEAN DEFAULT TRUE,
  email_lead_converted BOOLEAN DEFAULT TRUE,
  email_payout_completed BOOLEAN DEFAULT TRUE,
  email_payout_failed BOOLEAN DEFAULT TRUE,
  email_account_updates BOOLEAN DEFAULT TRUE,
  -- ... other fields
);
```

## Usage

### 1. Send Email for Single Notification

```typescript
import { sendNotificationEmail } from '@/lib/notification-email-service'

const notification = await sql`
  SELECT * FROM notifications WHERE id = ${notificationId}
`

const userEmail = 'partner@example.com'

const result = await sendNotificationEmail(notification[0], userEmail)

if (result.success) {
  console.log('Email sent successfully')
} else {
  console.error('Email failed:', result.error)
}
```

### 2. Send Emails for Multiple Notifications

```typescript
import { sendNotificationEmails } from '@/lib/notification-email-service'

const notifications = await sql`
  SELECT * FROM notifications
  WHERE email_sent = false
  LIMIT 10
`

const results = await sendNotificationEmails(notifications)

console.log(`Sent ${results.filter(r => r.success).length} emails`)
```

### 3. Process Pending Notifications

```typescript
import { getPendingNotificationEmails, sendNotificationEmails } from '@/lib/notification-email-service'

const pending = await getPendingNotificationEmails(50)
const results = await sendNotificationEmails(pending)
```

### 4. Retry Failed Emails

```typescript
import { retryFailedNotificationEmails } from '@/lib/notification-email-service'

const results = await retryFailedNotificationEmails(
  3,  // maxRetries
  20  // limit
)
```

## API Endpoint

### POST `/api/notifications/send-email`

Send notification emails via HTTP API.

#### Authentication

Requires one of:
- `Authorization: Bearer ${API_SECRET_KEY}` header
- `x-cron-secret: ${CRON_SECRET}` header (for cron jobs)

#### Request Body Options

**Option 1: Send single notification**
```json
{
  "notification_id": "uuid-here"
}
```

**Option 2: Send multiple notifications**
```json
{
  "notification_ids": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Option 3: Send all pending**
```json
{
  "send_pending": true,
  "limit": 50
}
```

**Option 4: Retry failed**
```json
{
  "retry_failed": true,
  "limit": 20
}
```

#### Response

```json
{
  "success": true,
  "results": [
    {
      "notificationId": "uuid-1",
      "success": true
    },
    {
      "notificationId": "uuid-2",
      "success": false,
      "error": "User email not found"
    }
  ],
  "total": 2,
  "succeeded": 1,
  "failed": 1
}
```

### GET `/api/notifications/send-email`

Get statistics about notification emails.

#### Response

```json
{
  "success": true,
  "stats": {
    "total_notifications": 150,
    "emails_sent": 140,
    "pending": 8,
    "failed": 2,
    "last_24h": 25,
    "sent_last_24h": 23
  },
  "by_type": [
    {
      "type": "lead_converted",
      "total": 80,
      "sent": 78,
      "pending": 2,
      "failed": 0
    }
  ]
}
```

## Cron Job Setup

### Vercel Cron (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/notifications/send-email",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Manual Cron Setup

```bash
# Every 5 minutes
*/5 * * * * curl -X POST https://astartupbiz.com/api/notifications/send-email \
  -H "x-cron-secret: $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"send_pending": true}'
```

## Notification Data Structure

Each notification type requires specific data fields in the `data` JSONB column:

### `account_approved`
```json
{
  "partnerName": "John Doe",
  "companyName": "Acme Inc",
  "commissionRate": 20,
  "referralCode": "JOHN2024",
  "portalUrl": "https://astartupbiz.com/partner-portal"
}
```

### `payout_completed`
```json
{
  "payoutId": "payout_123",
  "amount": 500.00,
  "payoutMethod": "Bank Transfer",
  "completedDate": "January 15, 2025",
  "transactionCount": 5
}
```

### `payout_failed`
```json
{
  "payoutId": "payout_123",
  "amount": 500.00,
  "payoutMethod": "Bank Transfer",
  "failureReason": "Invalid bank account",
  "transactionCount": 5
}
```

### `lead_converted`
```json
{
  "leadName": "Jane Smith",
  "orderValue": 2500.00,
  "commissionAmount": 500.00,
  "commissionRate": 20,
  "orderId": "order_123",
  "conversionDate": "January 15, 2025"
}
```

## Error Handling

The service handles errors gracefully:

1. **Template not found** - Logs warning and updates `email_error`
2. **Email send failure** - Updates `email_error` field with error message
3. **User not found** - Skips notification and logs error
4. **Database errors** - Catches and logs without crashing

All errors are stored in the `email_error` column for debugging.

## Monitoring

### Check Email Status

```sql
-- Pending emails
SELECT COUNT(*) FROM notifications
WHERE email_sent = false AND email_error IS NULL;

-- Failed emails
SELECT type, email_error, COUNT(*)
FROM notifications
WHERE email_error IS NOT NULL
GROUP BY type, email_error;

-- Success rate
SELECT
  COUNT(*) FILTER (WHERE email_sent = true) * 100.0 / COUNT(*) as success_rate
FROM notifications
WHERE created_at > NOW() - INTERVAL '24 hours';
```

### View Recent Errors

```sql
SELECT
  n.id,
  n.type,
  n.email_error,
  u.email,
  n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE n.email_error IS NOT NULL
ORDER BY n.created_at DESC
LIMIT 10;
```

## Testing

### Test Single Notification

```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"notification_id": "your-notification-id"}'
```

### Test Pending Notifications

```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"send_pending": true, "limit": 5}'
```

### Get Statistics

```bash
curl http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}"
```

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://...

# Email (Resend)
RESEND_API_KEY=re_...

# API Authentication
API_SECRET_KEY=your-secret-key
CRON_SECRET=your-cron-secret

# Email Configuration (optional)
EMAIL_FROM=A Startup Biz <noreply@astartupbiz.com>
SUPPORT_EMAIL=support@astartupbiz.com
```

## Adding New Notification Types

To add a new notification type:

1. **Create email template** in `/lib/email/templates/`

```typescript
export function newNotificationEmail(data: NewNotificationData) {
  return {
    subject: 'New Notification',
    html: `...`
  }
}
```

2. **Add to template mapping** in `notification-email-service.ts`

```typescript
const NOTIFICATION_EMAIL_TEMPLATES = {
  // ... existing templates
  new_notification: newNotificationEmail,
}
```

3. **Add switch case** in `sendNotificationEmail()`

```typescript
case 'new_notification': {
  const data: NewNotificationData = {
    // ... map notification.data to template data
  }
  emailContent = newNotificationEmail(data)
  break
}
```

4. **Update database trigger** if needed (for auto-created notifications)

```sql
-- Example trigger for new notification type
CREATE OR REPLACE FUNCTION notify_on_new_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    NEW.user_id,
    'new_notification',
    'New Event',
    'Description',
    jsonb_build_object('key', 'value')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Best Practices

1. **Always check user preferences** before sending emails
2. **Use transactions** when creating notifications that trigger emails
3. **Implement rate limiting** to avoid overwhelming email service
4. **Monitor failed emails** and set up alerts
5. **Test email templates** in development before deploying
6. **Keep retry count limited** to avoid infinite retry loops
7. **Clean up old notifications** periodically (see migration 008)

## Troubleshooting

### Emails not sending

1. Check `email_error` column for error messages
2. Verify `RESEND_API_KEY` is set correctly
3. Check user's `notification_preferences.email_enabled`
4. Ensure notification type has a template mapping

### High failure rate

1. Check Resend API status
2. Verify email addresses are valid
3. Check for rate limiting
4. Review `email_error` patterns

### Duplicate emails

1. Check for duplicate notification records
2. Verify cron job isn't running too frequently
3. Check `email_sent` flag is being set correctly

## Support

For issues or questions:
- Check error logs in the database
- Review Resend dashboard for email delivery status
- Contact development team
