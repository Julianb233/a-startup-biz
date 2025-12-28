/**
 * HubSpot Webhook Handler
 *
 * Receives webhooks from HubSpot for deal updates and other events
 * Syncs changes back to local database
 */

import { NextRequest, NextResponse } from 'next/server';
import { HubSpotWebhookPayload } from '@/lib/hubspot/types';
import { getDeal } from '@/lib/hubspot/deals';
import { getContact } from '@/lib/hubspot/contacts';
import { sql } from '@/lib/db';
import crypto from 'crypto';

/**
 * Verify HubSpot webhook signature
 * HubSpot signs webhooks with a shared secret
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  try {
    // HubSpot uses SHA-256 HMAC
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    // Compare with signature from header
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(hash)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Process deal update event
 */
async function processDealUpdate(objectId: number): Promise<void> {
  try {
    // Fetch deal details from HubSpot
    const deal = await getDeal(objectId.toString(), [
      'dealname',
      'dealstage',
      'amount',
      'closedate',
      'pipeline',
    ]);

    console.log('Processing deal update:', {
      id: deal.id,
      name: deal.properties.dealname,
      stage: deal.properties.dealstage,
    });

    // Update local database if needed
    // This is where you'd sync deal status back to your onboarding_submissions table
    // For example, update status based on deal stage

    const statusMap: Record<string, string> = {
      'appointmentscheduled': 'reviewed',
      'qualifiedtobuy': 'in_progress',
      'closedwon': 'completed',
      'closedlost': 'submitted',
    };

    const localStatus = statusMap[deal.properties.dealstage || ''] || 'submitted';

    // Find onboarding submission by searching for associated contact
    // This is a simplified example - you'd need to track the mapping
    console.log('Deal stage changed to:', deal.properties.dealstage);
    console.log('Would update local status to:', localStatus);

    // TODO: Implement actual database update logic based on your schema
    // Example:
    // await sql`
    //   UPDATE onboarding_submissions
    //   SET status = ${localStatus}, updated_at = NOW()
    //   WHERE hubspot_deal_id = ${deal.id}
    // `;

  } catch (error) {
    console.error('Error processing deal update:', error);
    throw error;
  }
}

/**
 * Process contact update event
 */
async function processContactUpdate(objectId: number): Promise<void> {
  try {
    // Fetch contact details from HubSpot
    const contact = await getContact(objectId.toString(), [
      'email',
      'firstname',
      'lastname',
      'phone',
      'lifecyclestage',
      'hs_lead_status',
    ]);

    console.log('Processing contact update:', {
      id: contact.id,
      email: contact.properties.email,
      lifecyclestage: contact.properties.lifecyclestage,
    });

    // Update local database if needed
    // TODO: Implement sync logic

  } catch (error) {
    console.error('Error processing contact update:', error);
    throw error;
  }
}

/**
 * POST: Handle webhook events from HubSpot
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.HUBSPOT_WEBHOOK_SECRET;

    // Read raw body for signature verification
    const bodyText = await request.text();
    const signature = request.headers.get('X-HubSpot-Signature');

    // Verify signature if secret is configured
    if (webhookSecret) {
      const isValid = verifyWebhookSignature(bodyText, signature, webhookSecret);

      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid signature',
          },
          { status: 401 }
        );
      }
    } else {
      console.warn('HUBSPOT_WEBHOOK_SECRET not configured - skipping signature verification');
    }

    // Parse webhook payload
    const payload: HubSpotWebhookPayload = JSON.parse(bodyText);

    console.log('Received HubSpot webhook:', {
      eventCount: payload.events.length,
      subscriptionTypes: [...new Set(payload.events.map(e => e.subscriptionType))],
    });

    // Process each event
    const results = await Promise.allSettled(
      payload.events.map(async (event) => {
        console.log('Processing event:', {
          subscriptionType: event.subscriptionType,
          objectId: event.objectId,
          eventId: event.eventId,
        });

        // Handle different event types
        switch (event.subscriptionType) {
          case 'deal.propertyChange':
          case 'deal.creation':
          case 'deal.deletion':
            await processDealUpdate(event.objectId);
            break;

          case 'contact.propertyChange':
          case 'contact.creation':
          case 'contact.deletion':
            await processContactUpdate(event.objectId);
            break;

          default:
            console.log('Unhandled subscription type:', event.subscriptionType);
        }
      })
    );

    // Log results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log('Webhook processing complete:', {
      total: results.length,
      successful,
      failed,
    });

    if (failed > 0) {
      console.error('Some events failed:', results.filter(r => r.status === 'rejected'));
    }

    // Always return 200 to acknowledge receipt
    // HubSpot will retry if we return an error
    return NextResponse.json(
      {
        success: true,
        processed: results.length,
        successful,
        failed,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook handler error:', error);

    // Return 200 even on error to prevent retries for malformed requests
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Still 200 to prevent HubSpot retries
    );
  }
}

/**
 * GET: Webhook verification endpoint
 * HubSpot may send a verification request when setting up the webhook
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: true,
      message: 'HubSpot webhook endpoint is active',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
