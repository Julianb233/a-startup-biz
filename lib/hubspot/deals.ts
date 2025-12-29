/**
 * HubSpot Deal Pipeline Sync
 *
 * Functions for creating and managing deals in HubSpot CRM.
 * Syncs orders from the application to HubSpot deal pipeline.
 */

import { getHubSpotClient, isHubSpotConfigured, parseHubSpotError } from './client'
import { withRetry } from './retry'
import { findContactByEmail, upsertContact } from './contacts'
import type {
  HubSpotDeal,
  HubSpotDealProperties,
  CreateDealInput,
  DealSyncResult,
} from './types'
import { DEFAULT_PIPELINE, DEAL_STAGES } from './types'

/**
 * Format currency amount for HubSpot (string with decimal)
 */
function formatAmount(amount: number): string {
  return amount.toFixed(2)
}

/**
 * Generate a deal name from order details
 */
function generateDealName(input: CreateDealInput): string {
  const itemSummary = input.items.length > 0
    ? input.items[0].name + (input.items.length > 1 ? ` +${input.items.length - 1} more` : '')
    : 'Order'

  const customerName = input.customerName || input.customerEmail.split('@')[0]

  return `${customerName} - ${itemSummary}`
}

/**
 * Map local order data to HubSpot deal properties
 */
function mapToDealProperties(input: CreateDealInput): HubSpotDealProperties {
  const properties: HubSpotDealProperties = {
    dealname: generateDealName(input),
    amount: formatAmount(input.amount),
    pipeline: DEFAULT_PIPELINE,
    dealstage: input.stage || DEAL_STAGES.CLOSED_WON,
    closedate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    order_id: input.orderId,
  }

  if (input.paymentMethod) {
    properties.payment_method = input.paymentMethod
  }

  // Create items summary
  if (input.items.length > 0) {
    properties.items_summary = input.items
      .map(item => `${item.name} x${item.quantity} ($${item.price.toFixed(2)})`)
      .join('\n')
    properties.description = `Order #${input.orderId}\n\nItems:\n${properties.items_summary}`
  }

  return properties
}

/**
 * Search for an existing deal by order ID
 */
export async function findDealByOrderId(orderId: string): Promise<HubSpotDeal | null> {
  if (!isHubSpotConfigured()) {
    console.warn('[HubSpot] Not configured, skipping deal search')
    return null
  }

  const client = getHubSpotClient()

  try {
    const response = await withRetry(
      () => client.crm.deals.searchApi.doSearch({
        filterGroups: [{
          filters: [{
            propertyName: 'order_id',
            operator: 'EQ',
            value: orderId,
          }],
        }],
        properties: [
          'dealname',
          'amount',
          'pipeline',
          'dealstage',
          'closedate',
          'order_id',
          'payment_method',
          'items_summary',
        ],
        limit: 1,
      }),
      `Search deal by order ID: ${orderId}`
    )

    if (response.results && response.results.length > 0) {
      return response.results[0] as HubSpotDeal
    }

    return null
  } catch (error) {
    const parsed = parseHubSpotError(error)
    // If the property doesn't exist yet, that's okay
    if (parsed.message.includes('order_id')) {
      console.warn('[HubSpot] order_id property may not exist yet')
      return null
    }
    console.error('[HubSpot] Error searching for deal:', parsed)
    return null
  }
}

/**
 * Create a new deal in HubSpot
 */
export async function createDeal(input: CreateDealInput): Promise<DealSyncResult> {
  if (!isHubSpotConfigured()) {
    console.warn('[HubSpot] Not configured, skipping deal creation')
    return {
      success: false,
      action: 'skipped',
      orderId: input.orderId,
      error: 'HubSpot not configured',
    }
  }

  const client = getHubSpotClient()
  const properties = mapToDealProperties(input)

  try {
    // First, ensure the contact exists
    const contactResult = await upsertContact({
      email: input.customerEmail,
      firstName: input.customerName?.split(' ')[0],
      lastName: input.customerName?.split(' ').slice(1).join(' '),
    })

    // Create the deal
    const response = await withRetry(
      () => client.crm.deals.basicApi.create({
        properties,
        associations: [],
      }),
      `Create deal for order: ${input.orderId}`
    )

    console.log(`[HubSpot] Deal created: ${input.orderId} (ID: ${response.id})`)

    // Associate deal with contact if we have a HubSpot contact ID
    if (contactResult.hubspotId) {
      try {
        await withRetry(
          () => client.crm.associations.v4.basicApi.create(
            'deals',
            response.id,
            'contacts',
            contactResult.hubspotId!,
            [{
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 3, // Deal to Contact association
            }]
          ),
          `Associate deal ${response.id} with contact ${contactResult.hubspotId}`
        )
        console.log(`[HubSpot] Deal associated with contact: ${contactResult.hubspotId}`)
      } catch (assocError) {
        // Association failure shouldn't fail the whole operation
        console.warn('[HubSpot] Failed to associate deal with contact:', assocError)
      }
    }

    return {
      success: true,
      action: 'created',
      hubspotId: response.id,
      dealId: response.id,
      orderId: input.orderId,
    }
  } catch (error) {
    const parsed = parseHubSpotError(error)
    console.error('[HubSpot] Error creating deal:', parsed)

    return {
      success: false,
      action: 'failed',
      orderId: input.orderId,
      error: parsed.message,
    }
  }
}

/**
 * Update an existing deal in HubSpot
 */
export async function updateDeal(
  hubspotId: string,
  updates: Partial<HubSpotDealProperties>
): Promise<DealSyncResult> {
  if (!isHubSpotConfigured()) {
    console.warn('[HubSpot] Not configured, skipping deal update')
    return {
      success: false,
      action: 'skipped',
      orderId: updates.order_id || '',
      error: 'HubSpot not configured',
    }
  }

  const client = getHubSpotClient()

  try {
    await withRetry(
      () => client.crm.deals.basicApi.update(hubspotId, { properties: updates }),
      `Update deal: ${hubspotId}`
    )

    console.log(`[HubSpot] Deal updated: ${hubspotId}`)

    return {
      success: true,
      action: 'updated',
      hubspotId,
      dealId: hubspotId,
      orderId: updates.order_id || '',
    }
  } catch (error) {
    const parsed = parseHubSpotError(error)
    console.error('[HubSpot] Error updating deal:', parsed)

    return {
      success: false,
      action: 'failed',
      hubspotId,
      orderId: updates.order_id || '',
      error: parsed.message,
    }
  }
}

/**
 * Update deal stage
 */
export async function updateDealStage(
  orderId: string,
  stage: keyof typeof DEAL_STAGES
): Promise<DealSyncResult> {
  const deal = await findDealByOrderId(orderId)

  if (!deal) {
    return {
      success: false,
      action: 'failed',
      orderId,
      error: 'Deal not found',
    }
  }

  return updateDeal(deal.id, {
    dealstage: DEAL_STAGES[stage],
  })
}

/**
 * Sync an order to HubSpot as a deal
 * Creates or updates based on whether the deal already exists
 */
export async function syncOrderToDeal(input: CreateDealInput): Promise<DealSyncResult> {
  // Check if deal already exists for this order
  const existingDeal = await findDealByOrderId(input.orderId)

  if (existingDeal) {
    // Update existing deal
    return updateDeal(existingDeal.id, {
      amount: formatAmount(input.amount),
      dealstage: input.stage || DEAL_STAGES.CLOSED_WON,
    })
  }

  // Create new deal
  return createDeal(input)
}

/**
 * Sync a completed order to HubSpot
 * Convenience function for the Stripe webhook
 */
export async function syncCompletedOrder(orderData: {
  orderId: string
  customerEmail: string
  customerName?: string
  total: number
  items: Array<{ name: string; price: number; quantity: number }>
  paymentMethod?: string
}): Promise<DealSyncResult> {
  return syncOrderToDeal({
    orderId: orderData.orderId,
    customerEmail: orderData.customerEmail,
    customerName: orderData.customerName,
    amount: orderData.total,
    items: orderData.items,
    paymentMethod: orderData.paymentMethod,
    stage: 'closedwon',
  })
}
