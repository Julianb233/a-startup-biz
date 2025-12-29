import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { markNotificationRead } from '@/lib/db-queries'

/**
 * PATCH /api/notifications/[id]
 *
 * Mark a notification as read
 *
 * @param {Object} params - Route params containing notification ID
 * @returns {Object} Success status
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    // Mark notification as read
    const success = await markNotificationRead(id, userId)

    if (!success) {
      return NextResponse.json(
        { error: 'Notification not found or already read' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      {
        error: 'Failed to mark notification as read',
        message: 'An unexpected error occurred.'
      },
      { status: 500 }
    )
  }
}
