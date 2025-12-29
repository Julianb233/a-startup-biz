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
import { upsertContactFromHubSpot, upsertDealFromHubSpot } from '@/lib/hubspot/db-operations';
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

    // Upsert the deal in local database
    const result = await upsertDealFromHubSpot({
      hubspotId: deal.id,
      dealName: deal.properties.dealname || 'Unnamed Deal',
      dealStage: deal.properties.dealstage,
      pipeline: deal.properties.pipeline,
      amount: deal.properties.amount ? parseFloat(deal.properties.amount) : undefined,
      closeDate: deal.properties.closedate,
    });

    console.log(`Deal ${deal.id} ${result.created ? 'created' : 'updated'} in local database`);

    // Also update any related onboarding submissions based on deal stage
    const statusMap: Record<string, string> = {
      'appointmentscheduled': 'reviewed',
      'qualifiedtobuy': 'in_progress',
      'closedwon': 'completed',
      'closedlost': 'submitted',
    };

    const localStatus = statusMap[deal.properties.dealstage || ''];

    if (localStatus) {
      // Update orders table with the deal stage mapping
      await sql`
        UPDATE orders
        SET status = CASE
          WHEN ${deal.properties.dealstage} = 'closedwon' THEN 'completed'
          WHEN ${deal.properties.dealstage} = 'closedlost' THEN 'refunded'
          ELSE status
        END,
        hubspot_deal_stage = ${deal.properties.dealstage},
        hubspot_synced_at = NOW(),
        updated_at = NOW()
        WHERE hubspot_deal_id = ${deal.id}
      `;
      console.log('Updated order status based on deal stage:', deal.properties.dealstage);
    }

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
      'company',
      'lifecyclestage',
      'hs_lead_status',
    ]);

    console.log('Processing contact update:', {
      id: contact.id,
      email: contact.properties.email,
      lifecyclestage: contact.properties.lifecyclestage,
    });

    // Upsert the contact in local database
    if (contact.properties.email) {
      const result = await upsertContactFromHubSpot({
        hubspotId: contact.id,
        email: contact.properties.email,
        firstName: contact.properties.firstname,
        lastName: contact.properties.lastname,
        phone: contact.properties.phone,
        company: contact.properties.company,
        lifecycleStage: contact.properties.lifecyclestage,
        leadStatus: contact.properties.hs_lead_status,
      });

      console.log(`Contact ${contact.id} ${result.created ? 'created' : 'updated'} in local database`);

      // Also update users table if this contact maps to a user
      await sql`
        UPDATE users
        SET hubspot_contact_id = ${contact.id},
            hubspot_synced_at = NOW(),
            updated_at = NOW()
        WHERE email = ${contact.properties.email}
        AND hubspot_contact_id IS NULL
      `;
    } else {
      console.log('Contact has no email, skipping sync');
    }

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

    // SECURITY: Signature verification is REQUIRED
    // Webhooks without valid signatures could be forged by attackers
    if (!webhookSecret) {
      console.error('HUBSPOT_WEBHOOK_SECRET not configured - rejecting webhook');
      return NextResponse.json(
        {
          success: false,
          error: 'Webhook not configured',
        },
        { status: 503 } // Service Unavailable - config issue
      );
    }

    const isValid = verifyWebhookSignature(bodyText, signature, webhookSecret);

    if (!isValid) {
      console.error('Invalid webhook signature - possible forgery attempt');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid signature',
        },
        { status: 401 }
      );
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
