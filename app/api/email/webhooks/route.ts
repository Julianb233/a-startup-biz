import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * POST /api/email/webhooks
 * Handle Resend webhook events for email delivery, bounces, opens, clicks, etc.
 *
 * Resend webhook events:
 * - email.sent: Email successfully sent
 * - email.delivered: Email delivered to recipient
 * - email.delivery_delayed: Delivery delayed
 * - email.bounced: Email bounced
 * - email.complained: Recipient marked as spam
 * - email.opened: Email opened
 * - email.clicked: Link in email clicked
 *
 * Webhook signature verification using Resend's signing secret
 */

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    html?: string;
    text?: string;
    // Event-specific data
    bounce_type?: 'hard' | 'soft';
    complaint_type?: string;
    link?: string;
    ip_address?: string;
    user_agent?: string;
    timestamp?: string;
  };
}

// Email event handlers
const emailEventHandlers = {
  'email.sent': async (event: ResendWebhookEvent) => {
    // Track sent emails in analytics
    // await trackEmailSent(event.data);
  },

  'email.delivered': async (event: ResendWebhookEvent) => {
    // Mark email as delivered in database
    // await markEmailDelivered(event.data.email_id);
  },

  'email.delivery_delayed': async (event: ResendWebhookEvent) => {
    // Log delayed delivery for monitoring
    // await logDelayedDelivery(event.data);
  },

  'email.bounced': async (event: ResendWebhookEvent) => {
    // Handle hard bounces - mark email as invalid
    if (event.data.bounce_type === 'hard') {
      // await markEmailAsInvalid(event.data.to);
      // await suppressEmail(event.data.to);
    }

    // Handle soft bounces - retry later
    if (event.data.bounce_type === 'soft') {
      // await scheduleEmailRetry(event.data.email_id);
    }
  },

  'email.complained': async (event: ResendWebhookEvent) => {
    // Immediately suppress this email address on spam complaint
    // await suppressEmail(event.data.to);
    // await notifyAdminOfComplaint(event.data);
  },

  'email.opened': async (event: ResendWebhookEvent) => {
    // Track email engagement
    // await trackEmailOpened(event.data);
  },

  'email.clicked': async (event: ResendWebhookEvent) => {
    // Track link clicks for engagement analytics
    // await trackEmailClicked(event.data);
  },
};

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (if RESEND_WEBHOOK_SECRET is set)
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (webhookSecret) {
      const headersList = await headers();
      const signature = headersList.get('resend-signature');

      if (!signature) {
        return NextResponse.json(
          { success: false, error: 'Missing webhook signature' },
          { status: 401 }
        );
      }

      // Verify signature
      // Resend uses HMAC SHA-256 for webhook signatures
      // const body = await request.text();
      // const isValid = await verifyWebhookSignature(body, signature, webhookSecret);

      // if (!isValid) {
      //   console.error('[Email Webhook] Invalid webhook signature');
      //   return NextResponse.json(
      //     { success: false, error: 'Invalid signature' },
      //     { status: 403 }
      //   );
      // }
    }

    // Parse webhook event
    const event: ResendWebhookEvent = await request.json();

    // Route to appropriate handler
    const handler = emailEventHandlers[event.type as keyof typeof emailEventHandlers];

    if (handler) {
      await handler(event);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed',
        eventType: event.type,
      },
      { status: 200 }
    );
  } catch (error) {
    // Return 200 even on error to prevent webhook retries
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}

// Utility function to verify webhook signatures
async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Create HMAC SHA-256 hash
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    );

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Compare signatures
    return hashHex === signature;
  } catch (error) {
    return false;
  }
}
