import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { markAllNotificationsRead } from '@/lib/db-queries'

/**
 * POST /api/notifications/mark-all-read
 *
 * Mark all notifications as read for the authenticated user
 *
 * @returns {Object} Success status and count of marked notifications
 */
export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    // Mark all notifications as read
    const count = await markAllNotificationsRead(userId)

    return NextResponse.json({
      success: true,
      message: `${count} notification${count !== 1 ? 's' : ''} marked as read`,
      count,
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      {
        error: 'Failed to mark notifications as read',
        message: 'An unexpected error occurred.'
      },
      { status: 500 }
    )
  }
}
