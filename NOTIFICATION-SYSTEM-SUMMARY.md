# Notification System - Quick Reference

## Files Created

### Database Schema & Migration
- `/lib/db-schema-notifications.sql` - Complete schema with triggers
- `/scripts/migrations/008_notifications.sql` - Runnable migration script

### Database Queries
- `/lib/db-queries.ts` - Added notification query functions:
  - `createNotification()`
  - `getUserNotifications()`
  - `markNotificationRead()`
  - `markAllNotificationsRead()`
  - `getUnreadNotificationCount()`
  - `deleteOldNotifications()`

### API Routes
- `/app/api/notifications/route.ts` - GET notifications
- `/app/api/notifications/[id]/route.ts` - PATCH mark as read
- `/app/api/notifications/mark-all-read/route.ts` - POST mark all read

### React Components
- `/components/partner/NotificationBell.tsx` - Bell icon with dropdown

### Documentation
- `/docs/notification-system.md` - Full documentation
- `/docs/notification-examples.md` - Usage examples

## Quick Start

### 1. Run Migration

```bash
# Connect to your Neon database
psql $DATABASE_URL -f scripts/migrations/008_notifications.sql
```

### 2. Add Component to Partner Portal

```tsx
// app/partner/layout.tsx or header component
import NotificationBell from '@/components/partner/NotificationBell'

export default function PartnerHeader() {
  return (
    <header>
      <NotificationBell />
    </header>
  )
}
```

### 3. Notifications Work Automatically!

Triggers are already set up for:
- Lead conversions → `lead_converted`
- Payout completion → `payout_completed`
- Payout failure → `payout_failed`
- Account approval → `account_approved`
- Account suspension → `account_suspended`

### 4. Manual Notifications (Optional)

```typescript
import { createNotification } from '@/lib/db-queries'

await createNotification(
  userId,
  'commission_earned',
  'Commission Earned',
  'You earned $500 from a lead conversion',
  { amount: 500, lead_id: 'abc-123' }
)
```

## Features

- **Automated triggers** for lead conversions, payouts, account changes
- **Real-time updates** with 30-second polling
- **Unread count badge** on bell icon
- **Mark as read** (individual or all)
- **Rich notifications** with metadata (JSONB data field)
- **Responsive UI** with dropdown panel
- **Icon/color coding** by notification type
- **Relative timestamps** (e.g., "2 minutes ago")
- **Auto-cleanup** function for old notifications

## Database Triggers

### Lead Conversion Trigger
- Fires when `partner_leads.status` changes to `'converted'`
- Creates notification with lead details and commission

### Payout Trigger
- Fires on payout `INSERT` or `UPDATE`
- Creates success or failure notification based on status

### Partner Status Change Trigger
- Fires when `partners.status` changes
- Creates approval or suspension notification

## API Endpoints

### GET /api/notifications
```typescript
// Query params: ?limit=20&unreadOnly=false
const response = await fetch('/api/notifications')
const { notifications, unreadCount } = await response.json()
```

### PATCH /api/notifications/[id]
```typescript
await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
```

### POST /api/notifications/mark-all-read
```typescript
await fetch('/api/notifications/mark-all-read', { method: 'POST' })
```

## Notification Types

- `lead_converted` - Lead became a customer
- `payout_completed` - Payout processed successfully
- `payout_failed` - Payout failed
- `account_approved` - Partner account approved
- `account_suspended` - Partner account suspended
- `referral_signup` - Someone signed up via referral
- `lead_qualified` - Lead reached qualified status
- `commission_earned` - Commission earned

## Next Steps

1. Run the migration
2. Add NotificationBell component to your header
3. Test by updating a lead to 'converted' status
4. Check the bell icon for the notification

## Customization

- Modify trigger functions in migration script
- Add custom notification types
- Extend NotificationBell component UI
- Add email/SMS notifications
- Implement notification preferences

See `/docs/notification-system.md` for full documentation.
