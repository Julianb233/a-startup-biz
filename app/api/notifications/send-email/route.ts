/**
 * Notification Email API Endpoint
 * Handles sending emails for notification records
 * Can be called by cron jobs or webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import {
  sendNotificationEmail,
  sendNotificationEmails,
  getPendingNotificationEmails,
  retryFailedNotificationEmails,
  type Notification,
} from '@/lib/notification-email-service'

/**
 * POST /api/notifications/send-email
 *
 * Sends email for one or more notifications
 *
 * Request body:
 * - notification_id: string (optional) - Send email for specific notification
 * - notification_ids: string[] (optional) - Send emails for multiple notifications
 * - send_pending: boolean (optional) - Send all pending notification emails
 * - retry_failed: boolean (optional) - Retry failed notification emails
 * - limit: number (optional) - Limit for pending/retry operations (default: 50)
 *
 * Authentication:
 * - Requires valid API key in Authorization header or CRON_SECRET for cron jobs
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = request.headers.get('x-cron-secret')

    // Allow either API key or cron secret
    const isAuthorized =
      authHeader === `Bearer ${process.env.API_SECRET_KEY}` ||
      cronSecret === process.env.CRON_SECRET

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key or cron secret' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notification_id, notification_ids, send_pending, retry_failed, limit = 50 } = body

    // Option 1: Send email for a single notification
    if (notification_id) {
      // Fetch notification from database
      const result = await sql`
        SELECT n.*, u.email as user_email
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE n.id = ${notification_id}
      `

      if (result.length === 0) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
      }

      const row = result[0]
      const notification: Notification = {
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

      // Check if email already sent
      if (notification.email_sent) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email already sent for this notification',
            notification_id,
            email_sent_at: notification.email_sent_at,
          },
          { status: 400 }
        )
      }

      const sendResult = await sendNotificationEmail(notification, row.user_email)

      return NextResponse.json({
        success: sendResult.success,
        notification_id,
        error: sendResult.error,
      })
    }

    // Option 2: Send emails for multiple notifications
    if (notification_ids && Array.isArray(notification_ids)) {
      const results = await sql`
        SELECT n.*, u.email as user_email
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE n.id = ANY(${notification_ids})
      `

      const notifications: Array<Notification & { user_email: string }> = results.map(
        (row: any) => ({
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
          user_email: row.user_email,
        })
      )

      const sendResults = []
      for (const notification of notifications) {
        const result = await sendNotificationEmail(notification, notification.user_email)
        sendResults.push({
          notification_id: notification.id,
          ...result,
        })
      }

      return NextResponse.json({
        success: true,
        results: sendResults,
        total: sendResults.length,
        succeeded: sendResults.filter((r) => r.success).length,
        failed: sendResults.filter((r) => !r.success).length,
      })
    }

    // Option 3: Send all pending notification emails
    if (send_pending) {
      const pendingNotifications = await getPendingNotificationEmails(limit)

      if (pendingNotifications.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No pending notifications to send',
          total: 0,
        })
      }

      const results = await sendNotificationEmails(pendingNotifications)

      return NextResponse.json({
        success: true,
        message: 'Processed pending notifications',
        results,
        total: results.length,
        succeeded: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      })
    }

    // Option 4: Retry failed notification emails
    if (retry_failed) {
      const results = await retryFailedNotificationEmails(3, limit)

      if (results.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No failed notifications to retry',
          total: 0,
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Retried failed notifications',
        results,
        total: results.length,
        succeeded: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      })
    }

    // No valid option provided
    return NextResponse.json(
      {
        error: 'Invalid request - must provide notification_id, notification_ids, send_pending, or retry_failed',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in send-email API:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/notifications/send-email
 *
 * Get statistics about notification emails
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')

    if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get statistics
    const stats = await sql`
      SELECT
        COUNT(*) as total_notifications,
        COUNT(*) FILTER (WHERE email_sent = true) as emails_sent,
        COUNT(*) FILTER (WHERE email_sent = false AND email_error IS NULL) as pending,
        COUNT(*) FILTER (WHERE email_error IS NOT NULL) as failed,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h,
        COUNT(*) FILTER (WHERE email_sent = true AND email_sent_at > NOW() - INTERVAL '24 hours') as sent_last_24h
      FROM notifications
      WHERE created_at > NOW() - INTERVAL '30 days'
    `

    const typeStats = await sql`
      SELECT
        type,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE email_sent = true) as sent,
        COUNT(*) FILTER (WHERE email_sent = false AND email_error IS NULL) as pending,
        COUNT(*) FILTER (WHERE email_error IS NOT NULL) as failed
      FROM notifications
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY type
      ORDER BY total DESC
    `

    return NextResponse.json({
      success: true,
      stats: {
        total_notifications: Number(stats[0].total_notifications),
        emails_sent: Number(stats[0].emails_sent),
        pending: Number(stats[0].pending),
        failed: Number(stats[0].failed),
        last_24h: Number(stats[0].last_24h),
        sent_last_24h: Number(stats[0].sent_last_24h),
      },
      by_type: typeStats.map((row: any) => ({
        type: row.type,
        total: Number(row.total),
        sent: Number(row.sent),
        pending: Number(row.pending),
        failed: Number(row.failed),
      })),
    })
  } catch (error) {
    console.error('Error getting notification stats:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
