/**
 * HubSpot CRM Integration - Deals Module
 *
 * Handles deal creation, pipeline management, and contact associations
 */

import { getHubSpotClient } from './client';
import {
  HubSpotDeal,
  HubSpotResponse,
  HubSpotPipeline,
  OnboardingToHubSpotMapping,
} from './types';

// Default pipeline and stages
const DEFAULT_PIPELINE = 'default';
const DEFAULT_DEAL_STAGE = 'appointmentscheduled'; // HubSpot default stage

/**
 * Get all pipelines
 */
export async function getPipelines(): Promise<HubSpotPipeline[]> {
  const client = getHubSpotClient();

  try {
    const response = await client.get<{ results: HubSpotPipeline[] }>(
      '/crm/v3/pipelines/deals'
    );

    return response.results;
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    throw error;
  }
}

/**
 * Map onboarding data to deal properties
 */
export function mapOnboardingToDeal(
  data: OnboardingToHubSpotMapping,
  contactId: string,
  pipelineId: string = DEFAULT_PIPELINE,
  dealStage: string = DEFAULT_DEAL_STAGE
): HubSpotDeal {
  // Extract budget amount from range (e.g., "$5,000 - $10,000" -> "7500")
  let dealAmount: string | undefined;
  if (data.budgetRange) {
    const match = data.budgetRange.match(/\$?([\d,]+)/);
    if (match) {
      dealAmount = match[1].replace(/,/g, '');
    }
  }

  // Calculate close date based on timeline
  let closeDate: string | undefined;
  if (data.timeline) {
    const timelineMap: Record<string, number> = {
      'immediate': 7,
      '1-2 weeks': 14,
      '2-4 weeks': 28,
      '1-3 months': 60,
      '3-6 months': 120,
      '6+ months': 180,
    };

    const daysToClose = timelineMap[data.timeline.toLowerCase()] || 30;
    const closeDateObj = new Date();
    closeDateObj.setDate(closeDateObj.getDate() + daysToClose);
    closeDate = closeDateObj.toISOString().split('T')[0];
  }

  return {
    properties: {
      dealname: `${data.companyName || data.contactEmail} - Onboarding`,
      dealstage: dealStage,
      pipeline: pipelineId,
      amount: dealAmount,
      closedate: closeDate,
      deal_type: 'New Business',
      deal_source: 'Website Onboarding',
      budget_range: data.budgetRange,
      timeline: data.timeline,
      services_requested: data.servicesInterested?.join(', '),
      priority: data.priorityLevel,
    },
    associations: {
      contacts: [contactId],
    },
  };
}

/**
 * Create new deal in HubSpot
 */
export async function createDeal(
  deal: HubSpotDeal
): Promise<HubSpotResponse<HubSpotDeal['properties']>> {
  const client = getHubSpotClient();

  try {
    // Remove undefined values from properties
    const cleanedProperties = Object.fromEntries(
      Object.entries(deal.properties).filter(([_, value]) => value !== undefined)
    );

    // Build associations array for API
    const associations = [];
    if (deal.associations?.contacts) {
      for (const contactId of deal.associations.contacts) {
        associations.push({
          to: { id: contactId },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 3, // Deal to Contact
            },
          ],
        });
      }
    }

    const payload: any = {
      properties: cleanedProperties,
    };

    if (associations.length > 0) {
      payload.associations = associations;
    }

    const response = await client.post<HubSpotResponse<HubSpotDeal['properties']>>(
      '/crm/v3/objects/deals',
      payload
    );

    console.log('Deal created in HubSpot:', {
      id: response.id,
      dealname: deal.properties.dealname,
      stage: deal.properties.dealstage,
    });

    return response;
  } catch (error) {
    console.error('Error creating deal in HubSpot:', error);
    throw error;
  }
}

/**
 * Update existing deal
 */
export async function updateDeal(
  dealId: string,
  properties: Partial<HubSpotDeal['properties']>
): Promise<HubSpotResponse<HubSpotDeal['properties']>> {
  const client = getHubSpotClient();

  try {
    // Remove undefined values
    const cleanedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    );

    const response = await client.patch<HubSpotResponse<HubSpotDeal['properties']>>(
      `/crm/v3/objects/deals/${dealId}`,
      { properties: cleanedProperties }
    );

    console.log('Deal updated in HubSpot:', {
      id: response.id,
      stage: properties.dealstage,
    });

    return response;
  } catch (error) {
    console.error('Error updating deal in HubSpot:', error);
    throw error;
  }
}

/**
 * Get deal by ID
 */
export async function getDeal(
  dealId: string,
  properties?: string[]
): Promise<HubSpotResponse<HubSpotDeal['properties']>> {
  const client = getHubSpotClient();

  const propertiesParam = properties?.length
    ? `?properties=${properties.join(',')}`
    : '';

  try {
    return await client.get<HubSpotResponse<HubSpotDeal['properties']>>(
      `/crm/v3/objects/deals/${dealId}${propertiesParam}`
    );
  } catch (error) {
    console.error('Error fetching deal:', error);
    throw error;
  }
}

/**
 * Associate deal with contact
 */
export async function associateDealWithContact(
  dealId: string,
  contactId: string
): Promise<void> {
  const client = getHubSpotClient();

  try {
    await client.post(
      `/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/3`,
      {}
    );

    console.log('Deal associated with contact:', {
      dealId,
      contactId,
    });
  } catch (error) {
    console.error('Error associating deal with contact:', error);
    throw error;
  }
}

/**
 * Move deal to new stage
 */
export async function moveDealToStage(
  dealId: string,
  newStage: string
): Promise<HubSpotResponse<HubSpotDeal['properties']>> {
  return updateDeal(dealId, { dealstage: newStage });
}

/**
 * Mark deal as won
 */
export async function markDealAsWon(
  dealId: string
): Promise<HubSpotResponse<HubSpotDeal['properties']>> {
  return updateDeal(dealId, {
    dealstage: 'closedwon',
    closedate: new Date().toISOString().split('T')[0],
  });
}

/**
 * Mark deal as lost
 */
export async function markDealAsLost(
  dealId: string,
  reason?: string
): Promise<HubSpotResponse<HubSpotDeal['properties']>> {
  const properties: Partial<HubSpotDeal['properties']> = {
    dealstage: 'closedlost',
    closedate: new Date().toISOString().split('T')[0],
  };

  return updateDeal(dealId, properties);
}

/**
 * Create deal from qualified onboarding lead
 */
export async function createDealFromOnboarding(
  data: OnboardingToHubSpotMapping,
  contactId: string,
  options?: {
    pipelineId?: string;
    dealStage?: string;
    autoQualify?: boolean;
  }
): Promise<HubSpotResponse<HubSpotDeal['properties']>> {
  // Determine if lead is qualified based on budget and timeline
  const isQualified = options?.autoQualify !== false && (
    (data.budgetRange && !data.budgetRange.toLowerCase().includes('not sure')) ||
    (data.priorityLevel && ['high', 'urgent'].includes(data.priorityLevel.toLowerCase()))
  );

  const dealStage = options?.dealStage || (isQualified ? 'qualifiedtobuy' : DEFAULT_DEAL_STAGE);
  const pipelineId = options?.pipelineId || DEFAULT_PIPELINE;

  const deal = mapOnboardingToDeal(data, contactId, pipelineId, dealStage);

  return createDeal(deal);
}

/**
 * Search for deals by contact
 */
export async function getDealsByContact(
  contactId: string
): Promise<HubSpotResponse<HubSpotDeal['properties']>[]> {
  const client = getHubSpotClient();

  try {
    const response = await client.get<{ results: HubSpotResponse<HubSpotDeal['properties']>[] }>(
      `/crm/v3/objects/contacts/${contactId}/associations/deals`
    );

    return response.results || [];
  } catch (error) {
    console.error('Error fetching deals by contact:', error);
    return [];
  }
}
