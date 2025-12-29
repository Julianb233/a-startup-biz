# Notification System - Usage Examples

This document provides practical examples for using the notification system in the a-startup-biz partner portal.

## Table of Contents

1. [Frontend Integration](#frontend-integration)
2. [Backend Integration](#backend-integration)
3. [Custom Notifications](#custom-notifications)
4. [Testing](#testing)
5. [Common Patterns](#common-patterns)

## Frontend Integration

### Add NotificationBell to Partner Portal Header

```tsx
// app/partner/layout.tsx
import NotificationBell from '@/components/partner/NotificationBell'

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Partner Portal</h1>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Menu */}
            <UserButton />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
```

### Fetch Notifications in a Page Component

```tsx
// app/partner/notifications/page.tsx
'use client'

import { useEffect, useState } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/notifications?limit=50')
        const data = await response.json()
        setNotifications(data.notifications || [])
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  if (loading) {
    return <div>Loading notifications...</div>
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">All Notifications</h1>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg border p-4 ${
              !notification.read ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <h3 className="font-semibold">{notification.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
            <p className="mt-2 text-xs text-gray-400">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Custom Hook for Notifications

```tsx
// hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}

// Usage in a component:
function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications()

  return (
    <div>
      <h2>You have {unreadCount} unread notifications</h2>
      {notifications.map(n => (
        <div key={n.id} onClick={() => markAsRead(n.id)}>
          {n.title}
        </div>
      ))}
    </div>
  )
}
```

## Backend Integration

### Create Notification on Lead Conversion (Manual)

```typescript
// app/api/admin/leads/[leadId]/convert/route.ts
import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/db-queries'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params

  // ... convert lead logic ...

  // Notify partner
  const partner = await getPartnerByLeadId(leadId)
  if (partner) {
    await createNotification(
      partner.user_id,
      'lead_converted',
      'Lead Converted!',
      `Your lead ${lead.client_name} has converted! Commission: $${lead.commission}`,
      {
        lead_id: leadId,
        commission: lead.commission,
        client_name: lead.client_name,
      }
    )
  }

  return NextResponse.json({ success: true })
}
```

### Batch Notifications

```typescript
// app/api/admin/notifications/batch/route.ts
import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/db-queries'

export async function POST(request: Request) {
  const { partners, notification } = await request.json()

  // Send notification to multiple partners
  const promises = partners.map((partnerId: string) =>
    createNotification(
      partnerId,
      notification.type,
      notification.title,
      notification.message,
      notification.data
    )
  )

  await Promise.all(promises)

  return NextResponse.json({
    success: true,
    count: partners.length,
  })
}
```

### Notify on Webhook Event (Stripe)

```typescript
// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createNotification, getPartnerByStripeAccountId } from '@/lib/db-queries'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === 'payout.paid') {
    const payout = event.data.object

    // Find partner by Stripe account
    const partner = await getPartnerByStripeAccountId(payout.destination as string)

    if (partner) {
      await createNotification(
        partner.user_id,
        'payout_completed',
        'Payout Completed',
        `Your payout of $${(payout.amount / 100).toFixed(2)} has been processed`,
        {
          payout_id: payout.id,
          amount: payout.amount / 100,
          arrival_date: new Date(payout.arrival_date * 1000),
        }
      )
    }
  }

  return NextResponse.json({ received: true })
}
```

## Custom Notifications

### Achievement/Milestone Notifications

```typescript
// lib/notifications/achievements.ts
import { createNotification } from '@/lib/db-queries'

export async function checkAndNotifyAchievements(partnerId: string, stats: any) {
  // First conversion
  if (stats.convertedLeads === 1) {
    await createNotification(
      partnerId,
      'commission_earned',
      'First Conversion!',
      'Congratulations on your first successful referral conversion!',
      { milestone: 'first_conversion' }
    )
  }

  // 10 conversions milestone
  if (stats.convertedLeads === 10) {
    await createNotification(
      partnerId,
      'commission_earned',
      '10 Conversions Milestone!',
      "You've reached 10 successful conversions. Keep up the great work!",
      { milestone: '10_conversions' }
    )
  }

  // $1000 in earnings
  if (stats.totalEarnings >= 1000 && stats.totalEarnings < 1100) {
    await createNotification(
      partnerId,
      'commission_earned',
      '$1,000 Earned!',
      "You've earned over $1,000 in commissions. Amazing!",
      { milestone: '1000_earned', amount: stats.totalEarnings }
    )
  }
}
```

### Weekly Summary Notifications

```typescript
// scripts/weekly-summary.ts
import { createNotification, getAllPartners } from '@/lib/db-queries'

async function sendWeeklySummaries() {
  const partners = await getAllPartners()

  for (const partner of partners) {
    const weekStats = await getPartnerWeeklyStats(partner.id)

    if (weekStats.newLeads > 0 || weekStats.conversions > 0) {
      await createNotification(
        partner.user_id,
        'commission_earned',
        'Weekly Summary',
        `This week: ${weekStats.newLeads} new leads, ${weekStats.conversions} conversions, $${weekStats.earnings} earned`,
        {
          type: 'weekly_summary',
          new_leads: weekStats.newLeads,
          conversions: weekStats.conversions,
          earnings: weekStats.earnings,
        }
      )
    }
  }
}

// Run via cron job
```

### Expiring Lead Reminders

```typescript
// lib/notifications/reminders.ts
import { createNotification } from '@/lib/db-queries'

export async function sendExpiringLeadReminders() {
  // Get leads that haven't been contacted in 7 days
  const staleLeads = await sql`
    SELECT pl.*, p.user_id
    FROM partner_leads pl
    JOIN partners p ON pl.partner_id = p.id
    WHERE pl.status = 'pending'
    AND pl.created_at < NOW() - INTERVAL '7 days'
  `

  for (const lead of staleLeads) {
    await createNotification(
      lead.user_id,
      'lead_qualified',
      'Lead Needs Attention',
      `Your lead ${lead.client_name} has been waiting for 7 days. Time to follow up!`,
      {
        lead_id: lead.id,
        client_name: lead.client_name,
        days_waiting: 7,
      }
    )
  }
}
```

## Testing

### Test Notification Creation

```typescript
// __tests__/notifications.test.ts
import { createNotification, getUserNotifications, getUnreadNotificationCount } from '@/lib/db-queries'

describe('Notification System', () => {
  it('should create a notification', async () => {
    const notification = await createNotification(
      'user-123',
      'lead_converted',
      'Test Notification',
      'This is a test',
      { test: true }
    )

    expect(notification.id).toBeDefined()
    expect(notification.type).toBe('lead_converted')
    expect(notification.read).toBe(false)
  })

  it('should retrieve user notifications', async () => {
    const notifications = await getUserNotifications('user-123', 10)
    expect(Array.isArray(notifications)).toBe(true)
  })

  it('should count unread notifications', async () => {
    const count = await getUnreadNotificationCount('user-123')
    expect(typeof count).toBe('number')
  })
})
```

### Manual Testing via SQL

```sql
-- Create test notification
INSERT INTO notifications (user_id, type, title, message, data)
VALUES (
  'user-id-here',
  'lead_converted',
  'Test Lead Conversion',
  'Your test lead has converted!',
  '{"lead_id": "test-123", "commission": 500}'
);

-- Verify notification was created
SELECT * FROM notifications
WHERE user_id = 'user-id-here'
ORDER BY created_at DESC
LIMIT 1;

-- Test lead conversion trigger
UPDATE partner_leads
SET status = 'converted', converted_at = NOW()
WHERE id = 'lead-id-here';

-- Check if trigger created notification
SELECT * FROM notifications
WHERE type = 'lead_converted'
ORDER BY created_at DESC
LIMIT 1;
```

### API Endpoint Testing

```typescript
// __tests__/api/notifications.test.ts
import { GET } from '@/app/api/notifications/route'
import { PATCH } from '@/app/api/notifications/[id]/route'

describe('Notification API Endpoints', () => {
  it('GET /api/notifications should return notifications', async () => {
    const request = new Request('http://localhost:3000/api/notifications')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.notifications).toBeDefined()
    expect(data.unreadCount).toBeDefined()
  })

  it('PATCH /api/notifications/[id] should mark as read', async () => {
    const request = new Request('http://localhost:3000/api/notifications/123')
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'notification-id' }),
    })

    expect(response.status).toBe(200)
  })
})
```

## Common Patterns

### Notification with Action Link

```typescript
await createNotification(
  partnerId,
  'lead_qualified',
  'Lead Ready for Contact',
  'Your lead is qualified and ready for outreach',
  {
    lead_id: leadId,
    action_url: `/partner/leads/${leadId}`,
    action_text: 'View Lead',
  }
)

// In frontend component:
{notification.data.action_url && (
  <Link href={notification.data.action_url}>
    {notification.data.action_text || 'View Details'}
  </Link>
)}
```

### Grouped Notifications

```typescript
// Combine multiple similar notifications
const pendingConversions = await getNewConversions(partnerId)

if (pendingConversions.length > 1) {
  await createNotification(
    partnerId,
    'lead_converted',
    `${pendingConversions.length} Leads Converted!`,
    `You have ${pendingConversions.length} new conversions today`,
    {
      count: pendingConversions.length,
      lead_ids: pendingConversions.map(l => l.id),
      total_commission: pendingConversions.reduce((sum, l) => sum + l.commission, 0),
    }
  )
}
```

### Notification with Rich Data

```typescript
await createNotification(
  partnerId,
  'payout_completed',
  'Payout Processed',
  `Your payout of $${amount} is on its way`,
  {
    payout_id: payoutId,
    amount: amount,
    method: 'bank_transfer',
    arrival_date: arrivalDate,
    breakdown: {
      leads_paid: 5,
      total_commission: amount,
      platform_fee: platformFee,
      net_payout: netAmount,
    },
  }
)

// Display in frontend:
{notification.data.breakdown && (
  <div className="mt-2 text-xs">
    <div>Leads: {notification.data.breakdown.leads_paid}</div>
    <div>Commission: ${notification.data.breakdown.total_commission}</div>
    <div>Fee: ${notification.data.breakdown.platform_fee}</div>
  </div>
)}
```

### Conditional Notification Preferences

```typescript
// Check user preferences before sending (future enhancement)
const preferences = await getUserNotificationPreferences(userId)

if (preferences.email_on_conversion) {
  await sendEmail({
    to: user.email,
    subject: 'Lead Converted!',
    template: 'lead-conversion',
    data: { lead, commission },
  })
}

if (preferences.in_app_notifications) {
  await createNotification(
    userId,
    'lead_converted',
    'Lead Converted!',
    message,
    data
  )
}
```

This covers the most common usage patterns for the notification system. For more advanced use cases, refer to the main documentation in `docs/notification-system.md`.
