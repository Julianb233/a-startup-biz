// Service Worker for Push Notifications

const CACHE_NAME = 'a-startup-biz-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received');

  let data = {
    title: 'A Startup Biz',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {},
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    image: data.image,
    tag: data.tag || 'default',
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    vibrate: data.vibrate || [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);

  event.notification.close();

  const data = event.notification.data || {};
  let url = '/';

  // Handle action clicks
  if (event.action) {
    switch (event.action) {
      case 'reply':
        url = '/dashboard/messages';
        break;
      case 'view':
        if (data.type === 'order' && data.orderId) {
          url = `/dashboard/orders/${data.orderId}`;
        } else if (data.type === 'appointment') {
          url = '/dashboard/consultations';
        } else if (data.type === 'lead') {
          url = '/partner-portal/referrals';
        } else {
          url = '/dashboard';
        }
        break;
      case 'reschedule':
        url = '/book-call';
        break;
      case 'call':
        url = `/partner-portal/referrals?call=true`;
        break;
      case 'dismiss':
        return;
      default:
        break;
    }
  } else {
    // Default click behavior based on notification type
    switch (data.type) {
      case 'message':
        url = '/dashboard/messages';
        break;
      case 'order':
        url = data.orderId ? `/dashboard/orders/${data.orderId}` : '/dashboard/orders';
        break;
      case 'appointment':
        url = '/dashboard/consultations';
        break;
      case 'partner':
        url = '/partner-portal';
        break;
      case 'lead':
        url = '/partner-portal/referrals';
        break;
      case 'payout':
        url = '/partner-portal/earnings';
        break;
      default:
        url = '/dashboard';
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
  // Could track notification dismissals for analytics
});

// Background sync (for offline message sending)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);

  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  // Sync any pending messages when back online
  try {
    const cache = await caches.open('pending-messages');
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('Error syncing messages:', error);
  }
}
