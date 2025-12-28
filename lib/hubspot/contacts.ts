/**
 * HubSpot CRM Integration - Contacts Module
 *
 * Handles contact creation, updates, and duplicate detection
 */

import { getHubSpotClient } from './client';
import {
  HubSpotContact,
  HubSpotResponse,
  HubSpotSearchResponse,
  OnboardingToHubSpotMapping,
} from './types';

/**
 * Search for contact by email
 */
export async function findContactByEmail(
  email: string
): Promise<HubSpotResponse<HubSpotContact['properties']> | null> {
  const client = getHubSpotClient();

  try {
    const response = await client.post<HubSpotSearchResponse<HubSpotContact['properties']>>(
      '/crm/v3/objects/contacts/search',
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
        properties: [
          'email',
          'firstname',
          'lastname',
          'phone',
          'company',
          'lifecyclestage',
          'hs_lead_status',
        ],
        limit: 1,
      }
    );

    return response.results.length > 0 ? response.results[0] : null;
  } catch (error) {
    console.error('Error searching for contact:', error);
    throw error;
  }
}

/**
 * Map onboarding form data to HubSpot contact properties
 */
export function mapOnboardingToContact(
  data: OnboardingToHubSpotMapping
): HubSpotContact['properties'] {
  const [firstname, ...lastnameArr] = (data.contactName || '').split(' ');
  const lastname = lastnameArr.join(' ');

  return {
    email: data.contactEmail,
    firstname: firstname || undefined,
    lastname: lastname || undefined,
    phone: data.contactPhone || undefined,
    company: data.companyName || undefined,
    website: data.website || undefined,
    industry: data.industry || undefined,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
    // Business details
    business_name: data.companyName || undefined,
    business_type: data.industry || undefined,
    business_size: data.companySize || undefined,
    revenue_range: data.revenueRange || undefined,
    years_in_business: data.yearsInBusiness || undefined,
    timeline: data.timeline || undefined,
    budget_range: data.budgetRange || undefined,
    primary_challenge: data.primaryChallenge || undefined,
    services_interested: data.servicesInterested?.join(', ') || undefined,
    priority_level: data.priorityLevel || undefined,
    referral_source: data.referralSource || undefined,
    referral_code: data.referralCode || undefined,
    // Social media
    facebook_url: data.socialFacebook || undefined,
    instagram_url: data.socialInstagram || undefined,
    linkedin_url: data.socialLinkedin || undefined,
    twitter_url: data.socialTwitter || undefined,
    youtube_url: data.socialYoutube || undefined,
    tiktok_url: data.socialTiktok || undefined,
    // Additional context
    additional_context: data.additionalContext || undefined,
    best_time_to_call: data.bestTimeToCall || undefined,
    timezone: data.timezone || undefined,
    communication_preference: data.communicationPreference || undefined,
  };
}

/**
 * Create new contact in HubSpot
 */
export async function createContact(
  properties: HubSpotContact['properties']
): Promise<HubSpotResponse<HubSpotContact['properties']>> {
  const client = getHubSpotClient();

  try {
    // Remove undefined values
    const cleanedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    );

    const response = await client.post<HubSpotResponse<HubSpotContact['properties']>>(
      '/crm/v3/objects/contacts',
      { properties: cleanedProperties }
    );

    console.log('Contact created in HubSpot:', {
      id: response.id,
      email: properties.email,
    });

    return response;
  } catch (error) {
    console.error('Error creating contact in HubSpot:', error);
    throw error;
  }
}

/**
 * Update existing contact in HubSpot
 */
export async function updateContact(
  contactId: string,
  properties: Partial<HubSpotContact['properties']>
): Promise<HubSpotResponse<HubSpotContact['properties']>> {
  const client = getHubSpotClient();

  try {
    // Remove undefined values
    const cleanedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    );

    const response = await client.patch<HubSpotResponse<HubSpotContact['properties']>>(
      `/crm/v3/objects/contacts/${contactId}`,
      { properties: cleanedProperties }
    );

    console.log('Contact updated in HubSpot:', {
      id: response.id,
      email: properties.email,
    });

    return response;
  } catch (error) {
    console.error('Error updating contact in HubSpot:', error);
    throw error;
  }
}

/**
 * Create or update contact (upsert)
 * Checks for existing contact by email and updates if found, creates if not
 */
export async function upsertContact(
  data: OnboardingToHubSpotMapping
): Promise<{
  contact: HubSpotResponse<HubSpotContact['properties']>;
  created: boolean;
}> {
  try {
    // Search for existing contact
    const existingContact = await findContactByEmail(data.contactEmail);

    const contactProperties = mapOnboardingToContact(data);

    if (existingContact) {
      // Update existing contact
      const updatedContact = await updateContact(
        existingContact.id,
        contactProperties
      );

      return {
        contact: updatedContact,
        created: false,
      };
    } else {
      // Create new contact
      const newContact = await createContact(contactProperties);

      return {
        contact: newContact,
        created: true,
      };
    }
  } catch (error) {
    console.error('Error upserting contact:', error);
    throw error;
  }
}

/**
 * Get contact by ID
 */
export async function getContact(
  contactId: string,
  properties?: string[]
): Promise<HubSpotResponse<HubSpotContact['properties']>> {
  const client = getHubSpotClient();

  const propertiesParam = properties?.length
    ? `?properties=${properties.join(',')}`
    : '';

  try {
    return await client.get<HubSpotResponse<HubSpotContact['properties']>>(
      `/crm/v3/objects/contacts/${contactId}${propertiesParam}`
    );
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
}

/**
 * Delete contact by ID
 */
export async function deleteContact(contactId: string): Promise<void> {
  const client = getHubSpotClient();

  try {
    await client.delete(`/crm/v3/objects/contacts/${contactId}`);
    console.log('Contact deleted from HubSpot:', contactId);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}

/**
 * Add note to contact
 */
export async function addNoteToContact(
  contactId: string,
  note: string
): Promise<void> {
  const client = getHubSpotClient();

  try {
    await client.post('/crm/v3/objects/notes', {
      properties: {
        hs_note_body: note,
        hs_timestamp: new Date().getTime(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 202, // Note to Contact
            },
          ],
        },
      ],
    });

    console.log('Note added to contact:', contactId);
  } catch (error) {
    console.error('Error adding note to contact:', error);
    throw error;
  }
}
