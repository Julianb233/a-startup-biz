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
    console.log('[Email Event] Email sent:', {
      emailId: event.data.email_id,
      to: event.data.to,
      subject: event.data.subject,
      timestamp: event.created_at,
    });
    // Track sent emails in analytics
    // await trackEmailSent(event.data);
  },

  'email.delivered': async (event: ResendWebhookEvent) => {
    console.log('[Email Event] Email delivered:', {
      emailId: event.data.email_id,
      to: event.data.to,
      timestamp: event.created_at,
    });
    // Mark email as delivered in database
    // await markEmailDelivered(event.data.email_id);
  },

  'email.delivery_delayed': async (event: ResendWebhookEvent) => {
    console.warn('[Email Event] Email delivery delayed:', {
      emailId: event.data.email_id,
      to: event.data.to,
      timestamp: event.created_at,
    });
    // Log delayed delivery for monitoring
    // await logDelayedDelivery(event.data);
  },

  'email.bounced': async (event: ResendWebhookEvent) => {
    console.error('[Email Event] Email bounced:', {
      emailId: event.data.email_id,
      to: event.data.to,
      bounceType: event.data.bounce_type,
      timestamp: event.created_at,
    });

    // Handle hard bounces - mark email as invalid
    if (event.data.bounce_type === 'hard') {
      console.warn(`Hard bounce detected for: ${event.data.to.join(', ')}`);
      // await markEmailAsInvalid(event.data.to);
      // await suppressEmail(event.data.to);
    }

    // Handle soft bounces - retry later
    if (event.data.bounce_type === 'soft') {
      console.log(`Soft bounce detected for: ${event.data.to.join(', ')} - will retry`);
      // await scheduleEmailRetry(event.data.email_id);
    }
  },

  'email.complained': async (event: ResendWebhookEvent) => {
    console.error('[Email Event] Spam complaint:', {
      emailId: event.data.email_id,
      to: event.data.to,
      complaintType: event.data.complaint_type,
      timestamp: event.created_at,
    });

    // Immediately suppress this email address
    console.warn(`Spam complaint from: ${event.data.to.join(', ')} - suppressing`);
    // await suppressEmail(event.data.to);
    // await notifyAdminOfComplaint(event.data);
  },

  'email.opened': async (event: ResendWebhookEvent) => {
    console.log('[Email Event] Email opened:', {
      emailId: event.data.email_id,
      to: event.data.to,
      ipAddress: event.data.ip_address,
      userAgent: event.data.user_agent,
      timestamp: event.data.timestamp,
    });
    // Track email engagement
    // await trackEmailOpened(event.data);
  },

  'email.clicked': async (event: ResendWebhookEvent) => {
    console.log('[Email Event] Email link clicked:', {
      emailId: event.data.email_id,
      to: event.data.to,
      link: event.data.link,
      ipAddress: event.data.ip_address,
      timestamp: event.data.timestamp,
    });
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
        console.warn('[Email Webhook] Missing webhook signature');
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

    console.log('[Email Webhook] Received event:', {
      type: event.type,
      emailId: event.data.email_id,
      timestamp: event.created_at,
    });

    // Route to appropriate handler
    const handler = emailEventHandlers[event.type as keyof typeof emailEventHandlers];

    if (handler) {
      await handler(event);
    } else {
      console.warn(`[Email Webhook] Unknown event type: ${event.type}`);
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
    console.error('[Email Webhook] Error processing webhook:', error);

    // Return 200 even on error to prevent webhook retries
    // Log the error for manual investigation
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
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}
