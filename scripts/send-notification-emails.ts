#!/usr/bin/env tsx
/**
 * Send Notification Emails Script
 * Processes pending notification emails and retries failed ones
 *
 * Usage:
 *   npm run send-notification-emails
 *   tsx scripts/send-notification-emails.ts
 *   tsx scripts/send-notification-emails.ts --retry-failed
 *   tsx scripts/send-notification-emails.ts --limit 100
 */

import {
  getPendingNotificationEmails,
  sendNotificationEmails,
  retryFailedNotificationEmails,
} from '../lib/notification-email-service'

interface ScriptOptions {
  retryFailed: boolean
  limit: number
  dryRun: boolean
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2)
  const options: ScriptOptions = {
    retryFailed: args.includes('--retry-failed'),
    limit: parseInt(args.find((arg) => arg.startsWith('--limit='))?.split('=')[1] || '50'),
    dryRun: args.includes('--dry-run'),
  }

  console.log('🚀 Starting notification email service...')
  console.log('Options:', options)
  console.log('---')

  try {
    // Process pending notifications
    console.log('\n📧 Processing pending notification emails...')
    const pendingNotifications = await getPendingNotificationEmails(options.limit)

    console.log(`Found ${pendingNotifications.length} pending notifications`)

    if (pendingNotifications.length > 0) {
      if (options.dryRun) {
        console.log('\n🔍 DRY RUN - Would send emails for:')
        pendingNotifications.forEach((n) => {
          console.log(`  - ${n.type}: ${n.title} (user: ${n.user_id})`)
        })
      } else {
        const results = await sendNotificationEmails(pendingNotifications)

        const succeeded = results.filter((r) => r.success).length
        const failed = results.filter((r) => !r.success).length

        console.log(`\n✅ Sent ${succeeded} emails`)
        if (failed > 0) {
          console.log(`❌ Failed ${failed} emails`)
          console.log('\nFailed notifications:')
          results
            .filter((r) => !r.success)
            .forEach((r) => {
              console.log(`  - ${r.notificationId}: ${r.error}`)
            })
        }
      }
    } else {
      console.log('✨ No pending notifications to send')
    }

    // Retry failed notifications if requested
    if (options.retryFailed) {
      console.log('\n🔄 Retrying failed notification emails...')

      if (options.dryRun) {
        console.log('🔍 DRY RUN - Would retry failed notifications')
      } else {
        const retryResults = await retryFailedNotificationEmails(3, options.limit)

        if (retryResults.length > 0) {
          const succeeded = retryResults.filter((r) => r.success).length
          const failed = retryResults.filter((r) => !r.success).length

          console.log(`✅ Retried ${succeeded} emails successfully`)
          if (failed > 0) {
            console.log(`❌ Failed ${failed} retries`)
            console.log('\nFailed retries:')
            retryResults
              .filter((r) => !r.success)
              .forEach((r) => {
                console.log(`  - ${r.notificationId}: ${r.error}`)
              })
          }
        } else {
          console.log('✨ No failed notifications to retry')
        }
      }
    }

    console.log('\n✅ Notification email service completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error running notification email service:', error)
    process.exit(1)
  }
}

// Run the script
main()
