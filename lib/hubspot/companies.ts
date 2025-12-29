/**
 * HubSpot CRM Integration - Companies Module
 *
 * Handles company creation, updates, and lookup
 */

import { getHubSpotClient } from './client';
import {
  HubSpotCompany,
  HubSpotResponse,
  HubSpotSearchResponse,
} from './types';

/**
 * Search for company by domain
 */
export async function findCompanyByDomain(
  domain: string
): Promise<HubSpotResponse<HubSpotCompany['properties']> | null> {
  const client = getHubSpotClient();

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
          'annualrevenue',
        ],
        limit: 1,
      }
    );

    return response.results.length > 0 ? response.results[0] : null;
  } catch (error) {
    console.error('Error searching for company:', error);
    throw error;
  }
}

/**
 * Create new company in HubSpot
 */
export async function createCompany(
  properties: HubSpotCompany['properties']
): Promise<HubSpotResponse<HubSpotCompany['properties']>> {
  const client = getHubSpotClient();

  try {
    // Remove undefined values
    const cleanedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    );

    const response = await client.post<HubSpotResponse<HubSpotCompany['properties']>>(
      '/crm/v3/objects/companies',
      { properties: cleanedProperties }
    );

    console.log('Company created in HubSpot:', {
      id: response.id,
      name: properties.name,
    });

    return response;
  } catch (error) {
    console.error('Error creating company in HubSpot:', error);
    throw error;
  }
}

/**
 * Update existing company in HubSpot
 */
export async function updateCompany(
  companyId: string,
  properties: Partial<HubSpotCompany['properties']>
): Promise<HubSpotResponse<HubSpotCompany['properties']>> {
  const client = getHubSpotClient();

  try {
    // Remove undefined values
    const cleanedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    );

    const response = await client.patch<HubSpotResponse<HubSpotCompany['properties']>>(
      `/crm/v3/objects/companies/${companyId}`,
      { properties: cleanedProperties }
    );

    console.log('Company updated in HubSpot:', {
      id: response.id,
      name: properties.name,
    });

    return response;
  } catch (error) {
    console.error('Error updating company in HubSpot:', error);
    throw error;
  }
}

/**
 * Get company by ID
 */
export async function getCompany(
  companyId: string,
  properties?: string[]
): Promise<HubSpotResponse<HubSpotCompany['properties']>> {
  const client = getHubSpotClient();

  const propertiesParam = properties?.length
    ? `?properties=${properties.join(',')}`
    : '';

  try {
    return await client.get<HubSpotResponse<HubSpotCompany['properties']>>(
      `/crm/v3/objects/companies/${companyId}${propertiesParam}`
    );
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
}

/**
 * Delete company by ID
 */
export async function deleteCompany(companyId: string): Promise<void> {
  const client = getHubSpotClient();

  try {
    await client.delete(`/crm/v3/objects/companies/${companyId}`);
    console.log('Company deleted from HubSpot:', companyId);
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
}
