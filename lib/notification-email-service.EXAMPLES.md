# Notification Email Service - Examples

This document provides practical examples of how to use the notification email service.

## Table of Contents

- [Creating Notifications](#creating-notifications)
- [Sending Emails Programmatically](#sending-emails-programmatically)
- [API Usage](#api-usage)
- [Testing](#testing)

## Creating Notifications

### Example 1: Partner Account Approved

```typescript
import { sql } from '@/lib/db'

async function notifyPartnerApproval(userId: string, partnerId: string) {
  await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      ${userId},
      'account_approved',
      'Partner Account Approved!',
      'Congratulations! Your partner account has been approved.',
      ${JSON.stringify({
        partnerId: partnerId,
        partnerName: 'John Doe',
        companyName: 'Acme Inc',
        commissionRate: 20,
        referralCode: 'JOHN2024',
        portalUrl: 'https://astartupbiz.com/partner-portal',
      })}
    )
  `
}
```

### Example 2: Lead Converted

```typescript
async function notifyLeadConversion(userId: string, leadData: any) {
  await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      ${userId},
      'lead_converted',
      'Great News! You Earned a Commission',
      ${`Your referral ${leadData.clientName} just became a customer!`},
      ${JSON.stringify({
        leadName: leadData.clientName,
        orderValue: leadData.orderAmount,
        commissionAmount: leadData.orderAmount * 0.2,
        commissionRate: 20,
        orderId: leadData.orderId,
        conversionDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        portalUrl: 'https://astartupbiz.com/partner-portal',
      })}
    )
  `
}
```

### Example 3: Payout Completed

```typescript
async function notifyPayoutCompleted(userId: string, payoutData: any) {
  await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      ${userId},
      'payout_completed',
      'Payment Received',
      ${`Your payout of $${payoutData.amount.toFixed(2)} has been completed.`},
      ${JSON.stringify({
        payoutId: payoutData.id,
        amount: payoutData.amount,
        payoutMethod: payoutData.method || 'Bank Transfer',
        completedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        transactionCount: payoutData.transactionCount || 1,
        portalUrl: 'https://astartupbiz.com/partner-portal',
      })}
    )
  `
}
```

### Example 4: Payout Failed

```typescript
async function notifyPayoutFailed(userId: string, payoutData: any) {
  await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      ${userId},
      'payout_failed',
      'Payout Failed - Action Required',
      ${`Your payout of $${payoutData.amount.toFixed(2)} failed. ${payoutData.failureReason}`},
      ${JSON.stringify({
        payoutId: payoutData.id,
        amount: payoutData.amount,
        payoutMethod: payoutData.method || 'Bank Transfer',
        failureReason: payoutData.failureReason || 'Unknown error',
        transactionCount: payoutData.transactionCount || 1,
        portalUrl: 'https://astartupbiz.com/partner-portal',
      })}
    )
  `
}
```

## Sending Emails Programmatically

### Example 5: Send Single Notification Email

```typescript
import { sql } from '@/lib/db'
import { sendNotificationEmail } from '@/lib/notification-email-service'

async function sendEmailForNotification(notificationId: string) {
  // Fetch notification and user
  const result = await sql`
    SELECT n.*, u.email
    FROM notifications n
    JOIN users u ON n.user_id = u.id
    WHERE n.id = ${notificationId}
  `

  if (result.length === 0) {
    throw new Error('Notification not found')
  }

  const row = result[0]
  const notification = {
    id: row.id,
    user_id: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    data: row.data,
    read: row.read,
    read_at: row.read_at,
    email_sent: row.email_sent,
    email_sent_at: row.email_sent_at,
    email_error: row.email_error,
    created_at: row.created_at,
  }

  const result = await sendNotificationEmail(notification, row.email)

  if (result.success) {
    console.log('Email sent successfully!')
  } else {
    console.error('Failed to send email:', result.error)
  }
}
```

### Example 6: Process All Pending Notifications

```typescript
import {
  getPendingNotificationEmails,
  sendNotificationEmails,
} from '@/lib/notification-email-service'

async function processPendingEmails() {
  // Get all pending notifications
  const pending = await getPendingNotificationEmails(100)

  console.log(`Found ${pending.length} pending notifications`)

  if (pending.length > 0) {
    // Send emails
    const results = await sendNotificationEmails(pending)

    const succeeded = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    console.log(`Successfully sent ${succeeded} emails`)
    if (failed > 0) {
      console.log(`Failed to send ${failed} emails`)
    }
  }
}
```

### Example 7: Retry Failed Emails

```typescript
import { retryFailedNotificationEmails } from '@/lib/notification-email-service'

async function retryFailedEmails() {
  const results = await retryFailedNotificationEmails(
    3, // max 3 retry attempts
    20 // limit to 20 notifications
  )

  console.log(`Retried ${results.length} failed notifications`)

  const succeeded = results.filter((r) => r.success).length
  console.log(`Successfully sent ${succeeded} retries`)
}
```

## API Usage

### Example 8: Send Email via API (Single Notification)

```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

Response:
```json
{
  "success": true,
  "notification_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Example 9: Send Multiple Notifications

```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_ids": [
      "550e8400-e29b-41d4-a716-446655440000",
      "550e8400-e29b-41d4-a716-446655440001"
    ]
  }'
```

Response:
```json
{
  "success": true,
  "results": [
    {
      "notification_id": "550e8400-e29b-41d4-a716-446655440000",
      "success": true
    },
    {
      "notification_id": "550e8400-e29b-41d4-a716-446655440001",
      "success": true
    }
  ],
  "total": 2,
  "succeeded": 2,
  "failed": 0
}
```

### Example 10: Process Pending Notifications (Cron Job)

```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "x-cron-secret: ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "send_pending": true,
    "limit": 50
  }'
```

Response:
```json
{
  "success": true,
  "message": "Processed pending notifications",
  "results": [
    {
      "notificationId": "550e8400-e29b-41d4-a716-446655440000",
      "success": true
    }
  ],
  "total": 1,
  "succeeded": 1,
  "failed": 0
}
```

### Example 11: Retry Failed Notifications

```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "retry_failed": true,
    "limit": 20
  }'
```

### Example 12: Get Email Statistics

```bash
curl http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}"
```

Response:
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
    },
    {
      "type": "payout_completed",
      "total": 50,
      "sent": 48,
      "pending": 2,
      "failed": 0
    },
    {
      "type": "account_approved",
      "total": 20,
      "sent": 14,
      "pending": 4,
      "failed": 2
    }
  ]
}
```

## Testing

### Example 13: Create Test Notification and Send Email

```typescript
import { sql } from '@/lib/db'
import { sendNotificationEmail } from '@/lib/notification-email-service'

async function testNotificationEmail() {
  // Get a test user
  const user = await sql`
    SELECT id, email FROM users LIMIT 1
  `

  if (user.length === 0) {
    throw new Error('No users found')
  }

  // Create a test notification
  const result = await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      ${user[0].id},
      'account_approved',
      'Test: Partner Account Approved',
      'This is a test notification',
      ${JSON.stringify({
        partnerName: 'Test Partner',
        commissionRate: 20,
        referralCode: 'TEST123',
        portalUrl: 'https://astartupbiz.com/partner-portal',
      })}
    )
    RETURNING *
  `

  const notification = result[0]

  // Send email
  const emailResult = await sendNotificationEmail(
    {
      id: notification.id,
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: notification.read,
      read_at: notification.read_at,
      email_sent: notification.email_sent,
      email_sent_at: notification.email_sent_at,
      email_error: notification.email_error,
      created_at: notification.created_at,
    },
    user[0].email
  )

  console.log('Test email result:', emailResult)

  if (emailResult.success) {
    console.log('✅ Test email sent successfully!')
  } else {
    console.log('❌ Test email failed:', emailResult.error)
  }

  // Clean up test notification
  await sql`
    DELETE FROM notifications WHERE id = ${notification.id}
  `
}
```

### Example 14: Test Script Usage

```bash
# Send pending emails (dry run)
npm run notify:send -- --dry-run

# Send pending emails (live)
npm run notify:send

# Send with custom limit
npm run notify:send -- --limit=100

# Retry failed emails
npm run notify:retry

# Retry failed emails with limit
npm run notify:retry -- --limit=10
```

### Example 15: Monitor Notification Queue

```sql
-- Check pending notifications
SELECT
  type,
  COUNT(*) as pending_count
FROM notifications
WHERE email_sent = false AND email_error IS NULL
GROUP BY type
ORDER BY pending_count DESC;

-- Check failed notifications
SELECT
  type,
  email_error,
  COUNT(*) as failed_count
FROM notifications
WHERE email_error IS NOT NULL
GROUP BY type, email_error
ORDER BY failed_count DESC;

-- Recent notifications with email status
SELECT
  id,
  type,
  title,
  email_sent,
  email_sent_at,
  email_error,
  created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 10;
```

## Integration with Partner Portal

### Example 16: Create Notification When Partner is Approved

```typescript
// In partner approval service
import { sql } from '@/lib/db'

async function approvePartner(partnerId: string) {
  // Update partner status
  const result = await sql`
    UPDATE partners
    SET
      status = 'active',
      approved_at = NOW()
    WHERE id = ${partnerId}
    RETURNING *
  `

  const partner = result[0]

  // Create notification (email will be sent by cron job)
  await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      ${partner.user_id},
      'account_approved',
      'Partner Account Approved!',
      'Congratulations! Your partner account has been approved.',
      ${JSON.stringify({
        partnerId: partner.id,
        partnerName: partner.name,
        companyName: partner.company_name,
        commissionRate: partner.commission_rate,
        referralCode: partner.referral_code,
        portalUrl: 'https://astartupbiz.com/partner-portal',
      })}
    )
  `

  return partner
}
```

### Example 17: Create Notification When Lead Converts (Using Trigger)

The database trigger automatically creates notifications when leads convert:

```sql
-- Trigger automatically creates notification on lead conversion
UPDATE partner_leads
SET
  status = 'converted',
  converted_at = NOW(),
  commission = 500.00
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

The trigger will create a notification that looks like this:

```json
{
  "user_id": "partner-user-id",
  "type": "lead_converted",
  "title": "Lead Converted!",
  "message": "Your lead Jane Smith has converted! Commission earned: $500.00",
  "data": {
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "client_name": "Jane Smith",
    "commission": 500.00,
    "service": "Website Development",
    "converted_at": "2025-01-15T10:30:00Z"
  }
}
```

### Example 18: Manually Trigger Email Send (Without Cron)

```typescript
// In an API route or webhook handler
import { sql } from '@/lib/db'
import { sendNotificationEmail } from '@/lib/notification-email-service'

export async function POST(request: Request) {
  const { partnerId, leadId } = await request.json()

  // Create notification
  const result = await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      (SELECT user_id FROM partners WHERE id = ${partnerId}),
      'lead_converted',
      'Great News! You Earned a Commission',
      'Your referral just became a customer!',
      ${JSON.stringify({
        leadId,
        leadName: 'Customer Name',
        orderValue: 1000.0,
        commissionAmount: 200.0,
        commissionRate: 20,
        orderId: 'order_123',
        conversionDate: new Date().toLocaleDateString(),
      })}
    )
    RETURNING *
  `

  const notification = result[0]

  // Get user email
  const userResult = await sql`
    SELECT email FROM users
    WHERE id = ${notification.user_id}
  `

  // Send email immediately (don't wait for cron)
  await sendNotificationEmail(
    {
      id: notification.id,
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: notification.read,
      read_at: notification.read_at,
      email_sent: notification.email_sent,
      email_sent_at: notification.email_sent_at,
      email_error: notification.email_error,
      created_at: notification.created_at,
    },
    userResult[0].email
  )

  return Response.json({ success: true })
}
```

## Debugging

### Example 19: Check Why Email Wasn't Sent

```sql
-- Find notifications that haven't been sent
SELECT
  n.id,
  n.type,
  n.title,
  n.email_sent,
  n.email_error,
  u.email,
  np.email_enabled,
  CASE n.type
    WHEN 'lead_converted' THEN np.email_lead_converted
    WHEN 'payout_completed' THEN np.email_payout_completed
    WHEN 'payout_failed' THEN np.email_payout_failed
    WHEN 'account_approved' THEN np.email_account_updates
    ELSE true
  END as type_enabled
FROM notifications n
JOIN users u ON n.user_id = u.id
LEFT JOIN notification_preferences np ON n.user_id = np.user_id
WHERE n.email_sent = false
  AND n.created_at > NOW() - INTERVAL '24 hours'
ORDER BY n.created_at DESC;
```

### Example 20: Force Resend Email

```sql
-- Reset email_sent flag to resend
UPDATE notifications
SET
  email_sent = false,
  email_sent_at = NULL,
  email_error = NULL,
  data = jsonb_set(data, '{retry_count}', '0')
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

Then call the API:
```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Authorization: Bearer ${API_SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"notification_id": "550e8400-e29b-41d4-a716-446655440000"}'
```
