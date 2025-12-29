/**
 * HubSpot Contact Sync
 *
 * Functions for creating and updating contacts in HubSpot CRM.
 * Supports bidirectional sync with local database.
 */

import { getHubSpotClient, isHubSpotConfigured, parseHubSpotError } from './client'
import { withRetry } from './retry'
import type {
  HubSpotContact,
  HubSpotContactProperties,
  CreateContactInput,
  ContactSyncResult,
} from './types'

/**
 * Split a full name into first and last name
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

/**
 * Map local contact data to HubSpot properties
 */
function mapToHubSpotProperties(input: CreateContactInput): HubSpotContactProperties {
  const { firstName, lastName } = input.firstName
    ? { firstName: input.firstName, lastName: input.lastName || '' }
    : splitName(input.email.split('@')[0]) // Fallback to email prefix

  const properties: HubSpotContactProperties = {
    email: input.email.toLowerCase(),
    firstname: firstName,
    lastname: lastName,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
  }

  if (input.phone) {
    properties.phone = input.phone
  }

  if (input.company) {
    properties.company = input.company
  }

  if (input.businessStage) {
    properties.business_stage = input.businessStage
  }

  if (input.services && input.services.length > 0) {
    properties.services_interested = input.services.join('; ')
  }

  if (input.source) {
    properties.source = input.source
  }

  if (input.message) {
    properties.message = input.message.substring(0, 65535) // HubSpot text limit
  }

  return properties
}

/**
 * Search for an existing contact by email
 */
export async function findContactByEmail(email: string): Promise<HubSpotContact | null> {
  if (!isHubSpotConfigured()) {
    console.warn('[HubSpot] Not configured, skipping contact search')
    return null
  }

  const client = getHubSpotClient()

  try {
    const response = await withRetry(
      () => client.crm.contacts.searchApi.doSearch({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ' as const,
            value: email.toLowerCase(),
          }],
        }],
        properties: [
          'email',
          'firstname',
          'lastname',
          'phone',
          'company',
          'lifecyclestage',
          'hs_lead_status',
          'business_stage',
          'services_interested',
          'source',
        ],
        limit: 1,
      }),
      `Search contact by email: ${email}`
    )

    if (response.results && response.results.length > 0) {
      return response.results[0] as HubSpotContact
    }

    return null
  } catch (error) {
    const parsed = parseHubSpotError(error)
    console.error('[HubSpot] Error searching for contact:', parsed)
    return null
  }
}

/**
 * Create a new contact in HubSpot
 */
export async function createContact(input: CreateContactInput): Promise<ContactSyncResult> {
  if (!isHubSpotConfigured()) {
    console.warn('[HubSpot] Not configured, skipping contact creation')
    return {
      success: false,
      action: 'skipped',
      email: input.email,
      error: 'HubSpot not configured',
    }
  }

  const client = getHubSpotClient()
  const properties = mapToHubSpotProperties(input)

  try {
    const response = await withRetry(
      () => client.crm.contacts.basicApi.create({
        properties,
        associations: [],
      }),
      `Create contact: ${input.email}`
    )

    console.log(`[HubSpot] Contact created: ${input.email} (ID: ${response.id})`)

    return {
      success: true,
      action: 'created',
      hubspotId: response.id,
      contactId: response.id,
      email: input.email,
    }
  } catch (error) {
    const parsed = parseHubSpotError(error)

    // Check if contact already exists (409 Conflict)
    if (parsed.status === 409) {
      console.log(`[HubSpot] Contact already exists: ${input.email}`)
      return {
        success: true,
        action: 'skipped',
        email: input.email,
        error: 'Contact already exists',
      }
    }

    console.error('[HubSpot] Error creating contact:', parsed)
    return {
      success: false,
      action: 'failed',
      email: input.email,
      error: parsed.message,
    }
  }
}

/**
 * Update an existing contact in HubSpot
 */
export async function updateContact(
  hubspotId: string,
  input: Partial<CreateContactInput>
): Promise<ContactSyncResult> {
  if (!isHubSpotConfigured()) {
    console.warn('[HubSpot] Not configured, skipping contact update')
    return {
      success: false,
      action: 'skipped',
      email: input.email || '',
      error: 'HubSpot not configured',
    }
  }

  const client = getHubSpotClient()

  // Build properties to update
  const properties: Partial<HubSpotContactProperties> = {}

  if (input.email) {
    properties.email = input.email.toLowerCase()
  }
  if (input.firstName) {
    properties.firstname = input.firstName
  }
  if (input.lastName) {
    properties.lastname = input.lastName
  }
  if (input.phone) {
    properties.phone = input.phone
  }
  if (input.company) {
    properties.company = input.company
  }
  if (input.businessStage) {
    properties.business_stage = input.businessStage
  }
  if (input.services && input.services.length > 0) {
    properties.services_interested = input.services.join('; ')
  }

  try {
    await withRetry(
      () => client.crm.contacts.basicApi.update(hubspotId, { properties }),
      `Update contact: ${hubspotId}`
    )

    console.log(`[HubSpot] Contact updated: ${hubspotId}`)

    return {
      success: true,
      action: 'updated',
      hubspotId,
      contactId: hubspotId,
      email: input.email || '',
    }
  } catch (error) {
    const parsed = parseHubSpotError(error)
    console.error('[HubSpot] Error updating contact:', parsed)

    return {
      success: false,
      action: 'failed',
      hubspotId,
      email: input.email || '',
      error: parsed.message,
    }
  }
}

/**
 * Create or update a contact (upsert)
 */
export async function upsertContact(input: CreateContactInput): Promise<ContactSyncResult> {
  // Try to find existing contact
  const existingContact = await findContactByEmail(input.email)

  if (existingContact) {
    // Update existing contact
    return updateContact(existingContact.id, input)
  }

  // Create new contact
  return createContact(input)
}

/**
 * Update contact lifecycle stage
 */
export async function updateContactLifecycleStage(
  email: string,
  stage: HubSpotContactProperties['lifecyclestage']
): Promise<ContactSyncResult> {
  const contact = await findContactByEmail(email)

  if (!contact) {
    return {
      success: false,
      action: 'failed',
      email,
      error: 'Contact not found',
    }
  }

  const client = getHubSpotClient()

  try {
    await withRetry(
      () => client.crm.contacts.basicApi.update(contact.id, {
        properties: { lifecyclestage: stage },
      }),
      `Update lifecycle stage: ${email}`
    )

    console.log(`[HubSpot] Contact lifecycle updated: ${email} -> ${stage}`)

    return {
      success: true,
      action: 'updated',
      hubspotId: contact.id,
      email,
    }
  } catch (error) {
    const parsed = parseHubSpotError(error)
    return {
      success: false,
      action: 'failed',
      email,
      error: parsed.message,
    }
  }
}

/**
 * Mark contact as customer after purchase
 */
export async function markContactAsCustomer(email: string): Promise<ContactSyncResult> {
  return updateContactLifecycleStage(email, 'customer')
}
