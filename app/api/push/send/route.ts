import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { sql } from '@/lib/db';
import {
  sendPushNotification,
  sendBulkPushNotifications,
  isPushConfigured,
  notificationTemplates,
  PushSubscription,
  PushNotification,
} from '@/lib/push-notifications';

export const dynamic = 'force-dynamic';

// Send push notification (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    if (!isPushConfigured()) {
      return NextResponse.json(
        { error: 'Push notifications not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      userId,
      userIds,
      all,
      notification,
      template,
      templateData,
    } = body;

    // Build notification from template or use provided
    let finalNotification: PushNotification;

    if (template && templateData) {
      switch (template) {
        case 'newMessage':
          finalNotification = notificationTemplates.newMessage(templateData.senderName);
          break;
        case 'appointmentReminder':
          finalNotification = notificationTemplates.appointmentReminder(templateData.time);
          break;
        case 'orderUpdate':
          finalNotification = notificationTemplates.orderUpdate(
            templateData.orderId,
            templateData.status
          );
          break;
        case 'partnerNotification':
          finalNotification = notificationTemplates.partnerNotification(
            templateData.title,
            templateData.body
          );
          break;
        case 'leadAssigned':
          finalNotification = notificationTemplates.leadAssigned(templateData.leadName);
          break;
        case 'payoutProcessed':
          finalNotification = notificationTemplates.payoutProcessed(templateData.amount);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid template' },
            { status: 400 }
          );
      }
    } else if (notification) {
      finalNotification = notification;
    } else {
      return NextResponse.json(
        { error: 'Notification or template is required' },
        { status: 400 }
      );
    }

    // Get subscriptions based on target
    let subscriptions: PushSubscription[];

    if (userId) {
      // Single user
      const result = await sql`
        SELECT endpoint, p256dh, auth
        FROM push_subscriptions
        WHERE user_id = ${userId}
      `;
      subscriptions = result.map((row: any) => ({
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      }));
    } else if (userIds && Array.isArray(userIds)) {
      // Multiple specific users
      const result = await sql`
        SELECT endpoint, p256dh, auth
        FROM push_subscriptions
        WHERE user_id = ANY(${userIds})
      `;
      subscriptions = result.map((row: any) => ({
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      }));
    } else if (all) {
      // All users
      const result = await sql`
        SELECT endpoint, p256dh, auth
        FROM push_subscriptions
      `;
      subscriptions = result.map((row: any) => ({
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      }));
    } else {
      return NextResponse.json(
        { error: 'Target (userId, userIds, or all) is required' },
        { status: 400 }
      );
    }

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'No subscriptions found',
      });
    }

    // Send notifications
    if (subscriptions.length === 1) {
      const result = await sendPushNotification(subscriptions[0], finalNotification);
      return NextResponse.json({
        success: result.success,
        sent: result.success ? 1 : 0,
        error: result.error,
      });
    } else {
      const results = await sendBulkPushNotifications(subscriptions, finalNotification);

      // Clean up expired subscriptions
      if (results.expired.length > 0) {
        await sql`
          DELETE FROM push_subscriptions
          WHERE endpoint = ANY(${results.expired})
        `;
      }

      return NextResponse.json({
        success: true,
        sent: results.success,
        failed: results.failed,
        expiredRemoved: results.expired.length,
      });
    }
  } catch (error) {
    console.error('Error sending push notification:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
