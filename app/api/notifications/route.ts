import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getUserNotifications, getUnreadNotificationCount } from '@/lib/db-queries'

/**
 * GET /api/notifications
 *
 * Retrieves notifications for the authenticated user
 * Query params:
 * - limit: number (default 20)
 * - unreadOnly: boolean (default false)
 *
 * @returns {Object} Notifications array and unread count
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Fetch notifications and unread count in parallel
    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(userId, limit, unreadOnly),
      getUnreadNotificationCount(userId),
    ])

    return NextResponse.json({
      notifications,
      unreadCount,
      total: notifications.length,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch notifications',
        message: 'An unexpected error occurred while loading notifications.'
      },
      { status: 500 }
    )
  }
}
