/**
 * HubSpot Integration Module
 *
 * Provides CRM synchronization for contacts and deals.
 *
 * Usage:
 * ```typescript
 * import { hubspot } from '@/lib/hubspot'
 *
 * // Sync a contact
 * await hubspot.contacts.upsertContact({
 *   email: 'user@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   company: 'Acme Inc',
 * })
 *
 * // Sync a deal/order
 * await hubspot.deals.syncCompletedOrder({
 *   orderId: 'ORD-123',
 *   customerEmail: 'user@example.com',
 *   total: 199.99,
 *   items: [{ name: 'Website Package', price: 199.99, quantity: 1 }],
 * })
 * ```
 *
 * Environment Variables:
 * - HUBSPOT_API_KEY: HubSpot Private App access token
 * - HUBSPOT_WEBHOOK_SECRET: (Optional) Secret for webhook signature verification
 */

// Client and configuration
export { getHubSpotClient, isHubSpotConfigured, parseHubSpotError } from './client'

// Types
export * from './types'

// Contact operations
export {
  findContactByEmail,
  createContact,
  updateContact,
  upsertContact,
  updateContactLifecycleStage,
  markContactAsCustomer,
} from './contacts'

// Deal operations
export {
  findDealByOrderId,
  createDeal,
  updateDeal,
  updateDealStage,
  syncOrderToDeal,
  syncCompletedOrder,
} from './deals'

// Retry utilities
export { withRetry, withRateLimitAwareness } from './retry'

// Webhook utilities
export {
  verifyWebhookSignature,
  verifyWebhookSignatureV2,
  parseWebhookEvents,
  getEventCategory,
  isCreationEvent,
  isDeletionEvent,
  isPropertyChangeEvent,
} from './webhook'

// Convenience namespace export
import * as contacts from './contacts'
import * as deals from './deals'
import * as webhook from './webhook'
import { isHubSpotConfigured } from './client'

export const hubspot = {
  contacts,
  deals,
  webhook,
  isConfigured: isHubSpotConfigured,
}

export default hubspot
