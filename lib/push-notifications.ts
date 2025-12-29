import webpush from 'web-push';

// VAPID keys for Web Push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:support@astartupbiz.com';

// Configure web-push
if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

// Check if push notifications are configured
export function isPushConfigured(): boolean {
  return !!(vapidPublicKey && vapidPrivateKey);
}

// Get public VAPID key for client-side subscription
export function getVapidPublicKey(): string | null {
  return vapidPublicKey || null;
}

// Send push notification to a subscription
export async function sendPushNotification(
  subscription: PushSubscription,
  notification: PushNotification
): Promise<{ success: boolean; error?: string }> {
  if (!isPushConfigured()) {
    console.warn('Push notifications not configured');
    return { success: false, error: 'Push notifications not configured' };
  }

  try {
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/badge-72x72.png',
      image: notification.image,
      tag: notification.tag,
      data: notification.data,
      actions: notification.actions,
      requireInteraction: notification.requireInteraction,
      silent: notification.silent,
      vibrate: notification.vibrate || [200, 100, 200],
    });

    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      payload,
      {
        TTL: 60 * 60 * 24, // 24 hours
        urgency: 'normal',
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send push notification:', error);

    // Handle expired subscriptions
    if (error.statusCode === 410 || error.statusCode === 404) {
      return {
        success: false,
        error: 'Subscription expired or invalid',
      };
    }

    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

// Send notification to multiple subscriptions
export async function sendBulkPushNotifications(
  subscriptions: PushSubscription[],
  notification: PushNotification
): Promise<{
  success: number;
  failed: number;
  expired: string[];
}> {
  const results = {
    success: 0,
    failed: 0,
    expired: [] as string[],
  };

  const promises = subscriptions.map(async (subscription) => {
    const result = await sendPushNotification(subscription, notification);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      if (result.error === 'Subscription expired or invalid') {
        results.expired.push(subscription.endpoint);
      }
    }
  });

  await Promise.all(promises);

  return results;
}

// Notification templates
export const notificationTemplates = {
  newMessage: (senderName: string): PushNotification => ({
    title: 'New Message',
    body: `${senderName} sent you a message`,
    icon: '/icons/message-icon.png',
    tag: 'new-message',
    requireInteraction: false,
    data: { type: 'message' },
    actions: [
      { action: 'reply', title: 'Reply' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }),

  appointmentReminder: (time: string): PushNotification => ({
    title: 'Appointment Reminder',
    body: `Your appointment is scheduled for ${time}`,
    icon: '/icons/calendar-icon.png',
    tag: 'appointment',
    requireInteraction: true,
    data: { type: 'appointment' },
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'reschedule', title: 'Reschedule' },
    ],
  }),

  orderUpdate: (orderId: string, status: string): PushNotification => ({
    title: 'Order Update',
    body: `Order #${orderId} is now ${status}`,
    icon: '/icons/order-icon.png',
    tag: `order-${orderId}`,
    data: { type: 'order', orderId },
    actions: [
      { action: 'view', title: 'View Order' },
    ],
  }),

  partnerNotification: (title: string, body: string): PushNotification => ({
    title,
    body,
    icon: '/icons/partner-icon.png',
    tag: 'partner',
    data: { type: 'partner' },
  }),

  leadAssigned: (leadName: string): PushNotification => ({
    title: 'New Lead Assigned',
    body: `${leadName} has been assigned to you`,
    icon: '/icons/lead-icon.png',
    tag: 'lead',
    requireInteraction: true,
    data: { type: 'lead' },
    actions: [
      { action: 'view', title: 'View Lead' },
      { action: 'call', title: 'Call Now' },
    ],
  }),

  payoutProcessed: (amount: string): PushNotification => ({
    title: 'Payout Processed',
    body: `Your payout of ${amount} has been processed`,
    icon: '/icons/money-icon.png',
    tag: 'payout',
    data: { type: 'payout' },
  }),
};

// Generate VAPID keys (run once to generate, then store in env)
export function generateVapidKeys(): { publicKey: string; privateKey: string } {
  const keys = webpush.generateVAPIDKeys();
  return {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
  };
}
