/**
 * HubSpot Companies API
 */

import { getHubSpotClient } from './client';
import type { HubSpotCompany, HubSpotResponse, HubSpotSearchResponse } from './types';

const client = getHubSpotClient();

/**
 * Find company by domain
 */
export async function findCompanyByDomain(domain: string): Promise<HubSpotCompany | null> {
  try {
    const response = await client.post<HubSpotSearchResponse<HubSpotCompany['properties']>>(
      '/crm/v3/objects/companies/search',
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'domain',
                operator: 'EQ',
                value: domain,
              },
            ],
          },
        ],
        properties: [
          'name',
          'domain',
          'industry',
          'phone',
          'city',
          'state',
          'country',
          'numberofemployees',
        ],
        limit: 1,
      }
    );

    return response.results[0] || null;
  } catch (error) {
    console.error('Error finding company by domain:', error);
    throw error;
  }
}

/**
 * Create a new company in HubSpot
 */
export async function createCompany(
  properties: Partial<HubSpotCompany['properties']>
): Promise<HubSpotCompany> {
  try {
    // Remove undefined values
    const cleanedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    );

    const response = await client.post<HubSpotResponse<HubSpotCompany['properties']>>(
      '/crm/v3/objects/companies',
      { properties: cleanedProperties }
    );

    return response;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

/**
 * Update an existing company
 */
export async function updateCompany(
  companyId: string,
  properties: Partial<HubSpotCompany['properties']>
): Promise<HubSpotCompany> {
  try {
    // Remove undefined values
    const cleanedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    );

    const response = await client.patch<HubSpotResponse<HubSpotCompany['properties']>>(
      `/crm/v3/objects/companies/${companyId}`,
      { properties: cleanedProperties }
    );

    return response;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
}

/**
 * Get a company by ID
 */
export async function getCompany(companyId: string): Promise<HubSpotCompany> {
  try {
    const properties = [
      'name',
      'domain',
      'industry',
      'phone',
      'city',
      'state',
      'country',
      'numberofemployees',
    ].join(',');

    const response = await client.get<HubSpotResponse<HubSpotCompany['properties']>>(
      `/crm/v3/objects/companies/${companyId}?properties=${properties}`
    );

    return response;
  } catch (error) {
    console.error('Error getting company:', error);
    throw error;
  }
}

/**
 * Associate company with contact
 */
export async function associateCompanyWithContact(
  companyId: string,
  contactId: string
): Promise<void> {
  try {
    await client.put(
      `/crm/v3/objects/companies/${companyId}/associations/contacts/${contactId}/company_to_contact`,
      {}
    );
    console.log('Associated company with contact:', { companyId, contactId });
  } catch (error) {
    console.error('Error associating company with contact:', error);
    throw error;
  }
}

/**
 * Delete a company
 */
export async function deleteCompany(companyId: string): Promise<void> {
  try {
    await client.delete(`/crm/v3/objects/companies/${companyId}`);
    console.log('Company deleted from HubSpot:', companyId);
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
}
