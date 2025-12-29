# Notification System Documentation

The partner portal notification system provides real-time alerts for important events like lead conversions, payouts, and account status changes.

## Overview

The notification system consists of:
- **Database table** (`notifications`) with automatic triggers
- **API endpoints** for retrieving and managing notifications
- **React component** (`NotificationBell`) for the UI
- **Database queries** in `lib/db-queries.ts`

## Database Schema

### Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notification Types

- `lead_converted` - When a partner's referral converts to a customer
- `payout_completed` - When a payout is successfully processed
- `payout_failed` - When a payout fails
- `account_approved` - When a partner account is approved
- `account_suspended` - When a partner account is suspended
- `referral_signup` - When someone signs up via referral link
- `lead_qualified` - When a lead reaches qualified status
- `commission_earned` - When a commission is earned

## Automated Triggers

Notifications are created automatically via database triggers:

### 1. Lead Conversion Trigger

Fires when `partner_leads.status` changes to `'converted'`:

```sql
CREATE TRIGGER trigger_notify_lead_conversion
  AFTER UPDATE ON partner_leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_on_lead_conversion();
```

**Notification created:**
- Type: `lead_converted`
- Title: "Lead Converted!"
- Message: "Your lead [name] has converted! Commission earned: $[amount]"
- Data: `{ lead_id, client_name, commission, service, converted_at }`

### 2. Payout Trigger

Fires when `partner_payouts.status` changes to `'paid'` or `'failed'`:

```sql
CREATE TRIGGER trigger_notify_payout
  AFTER INSERT OR UPDATE ON partner_payouts
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_on_payout();
```

**Notifications created:**

**On Success:**
- Type: `payout_completed`
- Title: "Payout Completed"
- Message: "Your payout of $[amount] has been processed successfully"
- Data: `{ payout_id, amount, method, arrival_date, paid_at }`

**On Failure:**
- Type: `payout_failed`
- Title: "Payout Failed"
- Message: "Your payout of $[amount] failed. Reason: [error]"
- Data: `{ payout_id, amount, failure_code, failure_message }`

### 3. Partner Status Change Trigger

Fires when `partners.status` changes:

```sql
CREATE TRIGGER trigger_notify_partner_status
  AFTER UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_on_status_change();
```

**Notifications created:**

**On Approval (pending → active):**
- Type: `account_approved`
- Title: "Partner Account Approved!"
- Message: "Congratulations! Your partner account for [company] has been approved..."
- Data: `{ partner_id, commission_rate, approved_at }`

**On Suspension:**
- Type: `account_suspended`
- Title: "Account Suspended"
- Message: "Your partner account has been suspended. Please contact support..."
- Data: `{ partner_id, suspended_at }`

## API Endpoints

### GET /api/notifications

Retrieve user notifications with pagination.

**Query Parameters:**
- `limit` (optional): Number of notifications to return (default: 20)
- `unreadOnly` (optional): Only return unread notifications (default: false)

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "lead_converted",
      "title": "Lead Converted!",
      "message": "Your lead John Smith has converted! Commission earned: $500",
      "data": {
        "lead_id": "uuid",
        "client_name": "John Smith",
        "commission": 500,
        "service": "Website Design"
      },
      "read": false,
      "read_at": null,
      "created_at": "2025-12-29T10:30:00Z"
    }
  ],
  "unreadCount": 3,
  "total": 10
}
```

### PATCH /api/notifications/[id]

Mark a notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### POST /api/notifications/mark-all-read

Mark all notifications as read for the authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "5 notifications marked as read",
  "count": 5
}
```

## Database Query Functions

### createNotification

Manually create a notification (for custom events):

```typescript
import { createNotification } from '@/lib/db-queries'

await createNotification(
  userId,
  'commission_earned',
  'Commission Earned',
  'You earned $250 from lead conversion',
  { amount: 250, lead_id: 'uuid' }
)
```

### getUserNotifications

Retrieve user notifications:

```typescript
import { getUserNotifications } from '@/lib/db-queries'

// Get all notifications (up to 20)
const notifications = await getUserNotifications(userId)

// Get only unread notifications
const unread = await getUserNotifications(userId, 20, true)
```

### markNotificationRead

Mark a single notification as read:

```typescript
import { markNotificationRead } from '@/lib/db-queries'

const success = await markNotificationRead(notificationId, userId)
```

### markAllNotificationsRead

Mark all notifications as read:

```typescript
import { markAllNotificationsRead } from '@/lib/db-queries'

const count = await markAllNotificationsRead(userId)
console.log(`Marked ${count} notifications as read`)
```

### getUnreadNotificationCount

Get unread count for badge:

```typescript
import { getUnreadNotificationCount } from '@/lib/db-queries'

const count = await getUnreadNotificationCount(userId)
```

## React Component Usage

### NotificationBell Component

Add the notification bell to your partner portal header:

```tsx
import NotificationBell from '@/components/partner/NotificationBell'

export default function PartnerHeader() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Partner Dashboard</h1>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}
```

**Features:**
- Shows unread count badge
- Dropdown with recent notifications
- Click notification to mark as read
- "Mark all as read" button
- Auto-refreshes every 30 seconds
- Icon and color coding by notification type
- Relative timestamps (e.g., "2 minutes ago")

## Manual Notification Examples

### Notify on Referral Signup

```typescript
import { createNotification } from '@/lib/db-queries'

// When someone signs up via referral link
await createNotification(
  referrerUserId,
  'referral_signup',
  'New Referral Signup',
  `${email} signed up using your referral link!`,
  {
    referred_email: email,
    referral_code: code,
    signed_up_at: new Date()
  }
)
```

### Notify on Lead Qualification

```typescript
// When a lead reaches qualified status
await createNotification(
  partnerUserId,
  'lead_qualified',
  'Lead Qualified',
  `Your lead ${clientName} has been qualified and is ready for conversion`,
  {
    lead_id: leadId,
    client_name: clientName,
    service: service
  }
)
```

## Maintenance

### Cleanup Old Notifications

Run periodically (e.g., via cron job) to delete old read notifications:

```sql
-- Delete read notifications older than 90 days
SELECT cleanup_old_notifications();
```

Or via TypeScript:

```typescript
import { deleteOldNotifications } from '@/lib/db-queries'

// Delete read notifications older than 90 days (default)
const deleted = await deleteOldNotifications()

// Custom retention period (30 days)
const deleted = await deleteOldNotifications(30)
```

## Installation

1. **Run migration:**
   ```bash
   psql $DATABASE_URL -f scripts/migrations/008_notifications.sql
   ```

2. **Verify tables and triggers:**
   ```sql
   \d notifications
   \df notify_partner_*
   ```

3. **Add component to partner header:**
   ```tsx
   import NotificationBell from '@/components/partner/NotificationBell'
   ```

4. **Install dependencies** (if not already installed):
   ```bash
   npm install date-fns lucide-react
   ```

## Testing

### Test Notification Creation

```typescript
// Manually create test notification
import { createNotification } from '@/lib/db-queries'

await createNotification(
  'user-id-here',
  'lead_converted',
  'Test Notification',
  'This is a test notification',
  { test: true }
)
```

### Test Triggers

```sql
-- Test lead conversion trigger
UPDATE partner_leads
SET status = 'converted', converted_at = NOW()
WHERE id = 'lead-id-here' AND partner_id = 'partner-id-here';

-- Check if notification was created
SELECT * FROM notifications
WHERE user_id = 'user-id-here'
ORDER BY created_at DESC
LIMIT 5;
```

## Performance Considerations

- Indexes on `user_id`, `read`, `type`, and `created_at` for fast queries
- Composite index on `(user_id, read)` for unread count queries
- Automatic cleanup function to prevent table bloat
- Pagination support in API endpoints

## Security

- All endpoints require authentication via Clerk
- User can only access their own notifications
- Notifications tied to user via foreign key with CASCADE delete
- No sensitive data exposed in notification messages

## Future Enhancements

- [ ] Real-time notifications via WebSockets/SSE
- [ ] Email notifications for important events
- [ ] Push notifications (browser/mobile)
- [ ] Notification preferences/settings
- [ ] Notification grouping/threading
- [ ] Rich notification templates
- [ ] In-app notification center page
