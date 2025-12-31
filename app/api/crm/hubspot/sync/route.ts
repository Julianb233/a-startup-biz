/**
 * HubSpot CRM Sync API Route
 *
 * POST: Sync contact and deal to HubSpot
 * GET: Check sync status
 */

import { NextRequest, NextResponse } from 'next/server';
import { upsertContact } from '@/lib/hubspot/contacts';
import { createDealFromOnboarding, getDealsByContact } from '@/lib/hubspot/deals';
import { getHubSpotClient } from '@/lib/hubspot/client';
import { OnboardingToHubSpotMapping, SyncStatus } from '@/lib/hubspot/types';
import { withRateLimit } from '@/lib/rate-limit';

/**
 * POST: Sync contact to HubSpot
 * Creates or updates contact and optionally creates a deal
 */
export async function POST(request: NextRequest) {
  try {
    // Check rate limit - using 'api' rate limiter for HubSpot sync
    const rateLimitResponse = await withRateLimit(request, 'api');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Verify HubSpot is configured
    const apiKey = process.env.HUBSPOT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'HubSpot integration is not configured',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      contactEmail,
      contactName,
      contactPhone,
      companyName,
      website,
      industry,
      businessGoals,
      primaryChallenge,
      timeline,
      budgetRange,
      servicesInterested,
      priorityLevel,
      referralSource,
      referralCode,
      socialFacebook,
      socialInstagram,
      socialLinkedin,
      socialTwitter,
      socialYoutube,
      socialTiktok,
      companySize,
      revenueRange,
      yearsInBusiness,
      bestTimeToCall,
      timezone,
      communicationPreference,
      additionalContext,
      createDeal = true,
    } = body;

    if (!contactEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact email is required',
        },
        { status: 400 }
      );
    }

    const syncData: OnboardingToHubSpotMapping = {
      contactEmail,
      contactName,
      contactPhone,
      companyName,
      website,
      industry,
      businessGoals,
      primaryChallenge,
      timeline,
      budgetRange,
      servicesInterested,
      priorityLevel,
      referralSource,
      referralCode,
      socialFacebook,
      socialInstagram,
      socialLinkedin,
      socialTwitter,
      socialYoutube,
      socialTiktok,
      companySize,
      revenueRange,
      yearsInBusiness,
      bestTimeToCall,
      timezone,
      communicationPreference,
      additionalContext,
    };

    const syncStatus: SyncStatus = {
      success: false,
      timestamp: new Date().toISOString(),
    };

    try {
      // Verify connection
      const client = getHubSpotClient();
      const isConnected = await client.verifyConnection();

      if (!isConnected) {
        throw new Error('Failed to connect to HubSpot API');
      }

      // Upsert contact
      const { contact, created } = await upsertContact(syncData);
      syncStatus.contactId = contact.id;

      console.log(`Contact ${created ? 'created' : 'updated'} in HubSpot:`, {
        id: contact.id,
        email: contactEmail,
      });

      // Create deal if requested and qualified
      if (createDeal && (budgetRange || priorityLevel)) {
        try {
          const deal = await createDealFromOnboarding(syncData, contact.id, {
            autoQualify: true,
          });
          syncStatus.dealId = deal.id;

          console.log('Deal created in HubSpot:', {
            id: deal.id,
            contactId: contact.id,
          });
        } catch (dealError) {
          console.error('Failed to create deal (non-fatal):', dealError);
          // Don't fail the whole sync if deal creation fails
        }
      }

      syncStatus.success = true;

      return NextResponse.json(
        {
          success: true,
          message: `Contact ${created ? 'created' : 'updated'} successfully`,
          data: {
            contactId: syncStatus.contactId,
            dealId: syncStatus.dealId,
            created,
            hubspotUrl: `https://app.hubspot.com/contacts/${syncStatus.contactId}`,
          },
        },
        { status: 200 }
      );

    } catch (hubspotError) {
      const errorMessage = hubspotError instanceof Error
        ? hubspotError.message
        : 'Unknown HubSpot error';

      syncStatus.error = errorMessage;

      console.error('HubSpot sync error:', hubspotError);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to sync to HubSpot',
          details: errorMessage,
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Sync API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process sync request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Check sync status and retrieve contact/deal info
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const contactId = searchParams.get('contactId');

    if (!email && !contactId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either email or contactId is required',
        },
        { status: 400 }
      );
    }

    // Verify HubSpot is configured
    const apiKey = process.env.HUBSPOT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'HubSpot integration is not configured',
        },
        { status: 503 }
      );
    }

    const client = getHubSpotClient();

    // Find contact
    let contact;
    if (email) {
      const { findContactByEmail } = await import('@/lib/hubspot/contacts');
      contact = await findContactByEmail(email);
    } else if (contactId) {
      const { getContact } = await import('@/lib/hubspot/contacts');
      contact = await getContact(contactId);
    }

    if (!contact) {
      return NextResponse.json(
        {
          success: true,
          synced: false,
          message: 'Contact not found in HubSpot',
        },
        { status: 200 }
      );
    }

    // Get associated deals
    const deals = await getDealsByContact(contact.id);

    return NextResponse.json(
      {
        success: true,
        synced: true,
        data: {
          contactId: contact.id,
          email: contact.properties.email,
          name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
          lifecyclestage: contact.properties.lifecyclestage,
          deals: deals.map(deal => ({
            id: deal.id,
            name: deal.properties.dealname,
            stage: deal.properties.dealstage,
            amount: deal.properties.amount,
          })),
          hubspotUrl: `https://app.hubspot.com/contacts/${contact.id}`,
          lastUpdated: contact.updatedAt,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Sync status check error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check sync status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
