/**
 * Notification Email Service
 * Handles sending email notifications based on notification records
 */

import { sql } from './db'
import { sendEmail } from './email'
import { partnerApprovedEmail } from './email/templates/partner-approved'
import { partnerPayoutCompletedEmail } from './email/templates/partner-payout-completed'
import { partnerPayoutSentEmail } from './email/templates/partner-payout-sent'
import { partnerLeadConvertedEmail } from './email/templates/partner-lead-converted'

/**
 * Notification record from database
 */
export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  read_at: Date | null
  email_sent: boolean
  email_sent_at: Date | null
  email_error: string | null
  created_at: Date
}

/**
 * Email template data types
 */
interface PartnerApprovedData {
  partnerName: string
  companyName?: string
  commissionRate: number
  referralCode: string
  portalUrl?: string
}

interface PayoutCompletedData {
  partnerName: string
  payoutId: string
  amount: number
  payoutMethod: string
  completedDate: string
  transactionCount: number
  portalUrl?: string
}

interface PayoutSentData {
  partnerName: string
  payoutId: string
  amount: number
  payoutMethod: string
  estimatedArrival: string
  transactionCount: number
  periodStart: string
  periodEnd: string
  portalUrl?: string
}

interface LeadConvertedData {
  partnerName: string
  leadName: string
  orderValue: number
  commissionAmount: number
  commissionRate: number
  orderId: string
  conversionDate: string
  portalUrl?: string
}

/**
 * Maps notification types to email template functions
 */
const NOTIFICATION_EMAIL_TEMPLATES = {
  account_approved: partnerApprovedEmail,
  payout_completed: partnerPayoutCompletedEmail,
  payout_failed: partnerPayoutSentEmail, // Reuse payout sent template with failure message
  lead_converted: partnerLeadConvertedEmail,
} as const

type NotificationType = keyof typeof NOTIFICATION_EMAIL_TEMPLATES

/**
 * Send email for a notification
 *
 * @param notification - The notification record
 * @param userEmail - The user's email address
 * @returns Success status and any error message
 */
export async function sendNotificationEmail(
  notification: Notification,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const notificationType = notification.type as NotificationType

    // Check if we have a template for this notification type
    if (!NOTIFICATION_EMAIL_TEMPLATES[notificationType]) {
      console.warn(`No email template for notification type: ${notification.type}`)
      return {
        success: false,
        error: `No email template for notification type: ${notification.type}`,
      }
    }

    // Get user details from notification data or fetch from database
    let userName = notification.data.partnerName || notification.data.userName

    if (!userName) {
      // Fetch user name from database
      const userResult = await sql`
        SELECT name FROM users WHERE id = ${notification.user_id}
      `
      userName = userResult[0]?.name || 'Partner'
    }

    // Build email template data based on notification type
    let emailContent: { subject: string; html: string }

    switch (notificationType) {
      case 'account_approved': {
        const data: PartnerApprovedData = {
          partnerName: userName,
          companyName: notification.data.companyName,
          commissionRate: notification.data.commissionRate || notification.data.commission_rate || 20,
          referralCode: notification.data.referralCode || notification.data.referral_code || 'PARTNER',
          portalUrl: notification.data.portalUrl || 'https://astartupbiz.com/partner-portal',
        }
        emailContent = partnerApprovedEmail(data)
        break
      }

      case 'payout_completed': {
        const data: PayoutCompletedData = {
          partnerName: userName,
          payoutId: notification.data.payoutId || notification.data.payout_id,
          amount: parseFloat(notification.data.amount),
          payoutMethod: notification.data.payoutMethod || notification.data.method || 'Bank Transfer',
          completedDate:
            notification.data.completedDate ||
            notification.data.paid_at ||
            new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          transactionCount: notification.data.transactionCount || notification.data.transaction_count || 1,
          portalUrl: notification.data.portalUrl || 'https://astartupbiz.com/partner-portal',
        }
        emailContent = partnerPayoutCompletedEmail(data)
        break
      }

      case 'payout_failed': {
        const data: PayoutSentData = {
          partnerName: userName,
          payoutId: notification.data.payoutId || notification.data.payout_id,
          amount: parseFloat(notification.data.amount),
          payoutMethod: notification.data.payoutMethod || notification.data.method || 'Bank Transfer',
          estimatedArrival: 'Failed',
          transactionCount: notification.data.transactionCount || notification.data.transaction_count || 1,
          periodStart: notification.data.periodStart || 'N/A',
          periodEnd: notification.data.periodEnd || 'N/A',
          portalUrl: notification.data.portalUrl || 'https://astartupbiz.com/partner-portal',
        }
        // Use payout sent template but with failure context
        emailContent = {
          subject: `Payout Failed: $${data.amount.toFixed(2)} - Action Required`,
          html: partnerPayoutSentEmail(data).html.replace(
            'is on its way',
            'has failed - please update your payment information'
          ),
        }
        break
      }

      case 'lead_converted': {
        const data: LeadConvertedData = {
          partnerName: userName,
          leadName: notification.data.leadName || notification.data.client_name || 'Client',
          orderValue: parseFloat(notification.data.orderValue || notification.data.order_value || 0),
          commissionAmount: parseFloat(notification.data.commissionAmount || notification.data.commission || 0),
          commissionRate: notification.data.commissionRate || notification.data.commission_rate || 20,
          orderId: notification.data.orderId || notification.data.order_id || notification.data.lead_id,
          conversionDate:
            notification.data.conversionDate ||
            notification.data.converted_at ||
            new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          portalUrl: notification.data.portalUrl || 'https://astartupbiz.com/partner-portal',
        }
        emailContent = partnerLeadConvertedEmail(data)
        break
      }

      default:
        return {
          success: false,
          error: `Unhandled notification type: ${notificationType}`,
        }
    }

    // Send the email
    const result = await sendEmail({
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    if (!result.success) {
      // Update notification with error
      await sql`
        UPDATE notifications
        SET email_error = ${String(result.error || 'Unknown error')}
        WHERE id = ${notification.id}
      `

      return {
        success: false,
        error: String(result.error || 'Failed to send email'),
      }
    }

    // Update notification as email sent
    await sql`
      UPDATE notifications
      SET
        email_sent = true,
        email_sent_at = NOW()
      WHERE id = ${notification.id}
    `

    return { success: true }
  } catch (error) {
    console.error('Error sending notification email:', error)

    // Update notification with error
    try {
      await sql`
        UPDATE notifications
        SET email_error = ${error instanceof Error ? error.message : String(error)}
        WHERE id = ${notification.id}
      `
    } catch (dbError) {
      console.error('Failed to update notification error:', dbError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Send emails for multiple notifications
 *
 * @param notifications - Array of notifications to process
 * @returns Results for each notification
 */
export async function sendNotificationEmails(
  notifications: Notification[]
): Promise<Array<{ notificationId: string; success: boolean; error?: string }>> {
  const results: Array<{ notificationId: string; success: boolean; error?: string }> = []

  for (const notification of notifications) {
    // Get user email
    const userResult = await sql`
      SELECT email FROM users WHERE id = ${notification.user_id}
    `

    if (!userResult[0]?.email) {
      results.push({
        notificationId: notification.id,
        success: false,
        error: 'User email not found',
      })
      continue
    }

    const result = await sendNotificationEmail(notification, userResult[0].email)
    results.push({
      notificationId: notification.id,
      ...result,
    })
  }

  return results
}

/**
 * Get pending notifications that need emails sent
 *
 * @param limit - Maximum number of notifications to fetch
 * @returns Array of notifications that need emails
 */
export async function getPendingNotificationEmails(limit = 50): Promise<Notification[]> {
  const results = await sql`
    SELECT
      n.*,
      np.email_enabled,
      CASE n.type
        WHEN 'lead_converted' THEN np.email_lead_converted
        WHEN 'payout_completed' THEN np.email_payout_completed
        WHEN 'payout_failed' THEN np.email_payout_failed
        WHEN 'account_approved' THEN np.email_account_updates
        WHEN 'account_suspended' THEN np.email_account_updates
        ELSE true
      END as should_send_email
    FROM notifications n
    LEFT JOIN notification_preferences np ON n.user_id = np.user_id
    WHERE
      n.email_sent = false
      AND n.email_error IS NULL
      AND n.created_at > NOW() - INTERVAL '7 days'
    ORDER BY n.created_at ASC
    LIMIT ${limit}
  `

  // Filter to only notifications where user wants email
  return results
    .filter((n: any) => n.email_enabled !== false && n.should_send_email !== false)
    .map((n: any) => ({
      id: n.id,
      user_id: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      data: n.data,
      read: n.read,
      read_at: n.read_at,
      email_sent: n.email_sent,
      email_sent_at: n.email_sent_at,
      email_error: n.email_error,
      created_at: n.created_at,
    }))
}

/**
 * Retry failed notification emails
 *
 * @param maxRetries - Maximum number of retry attempts
 * @param limit - Maximum number of notifications to retry
 * @returns Results for each retry attempt
 */
export async function retryFailedNotificationEmails(
  maxRetries = 3,
  limit = 20
): Promise<Array<{ notificationId: string; success: boolean; error?: string }>> {
  // Get failed notifications that haven't exceeded retry limit
  const results = await sql`
    SELECT n.*, u.email
    FROM notifications n
    JOIN users u ON n.user_id = u.id
    WHERE
      n.email_sent = false
      AND n.email_error IS NOT NULL
      AND n.created_at > NOW() - INTERVAL '7 days'
      AND (n.data->>'retry_count')::int < ${maxRetries}
    ORDER BY n.created_at DESC
    LIMIT ${limit}
  `

  const retryResults: Array<{ notificationId: string; success: boolean; error?: string }> = []

  for (const row of results) {
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

    // Increment retry count
    const retryCount = (notification.data.retry_count || 0) + 1
    await sql`
      UPDATE notifications
      SET
        data = jsonb_set(data, '{retry_count}', ${retryCount}::text::jsonb),
        email_error = NULL
      WHERE id = ${notification.id}
    `

    const result = await sendNotificationEmail(notification, row.email)
    retryResults.push({
      notificationId: notification.id,
      ...result,
    })
  }

  return retryResults
}
