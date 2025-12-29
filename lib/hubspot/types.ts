/**
 * HubSpot Integration Types
 *
 * Type definitions for HubSpot CRM objects and sync operations.
 */

// ============================================
// CONTACT TYPES
// ============================================

export interface HubSpotContactProperties {
  email: string
  firstname?: string
  lastname?: string
  phone?: string
  company?: string
  lifecyclestage?: 'subscriber' | 'lead' | 'marketingqualifiedlead' | 'salesqualifiedlead' | 'opportunity' | 'customer' | 'evangelist' | 'other'
  hs_lead_status?: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'OPEN_DEAL' | 'UNQUALIFIED' | 'ATTEMPTED_TO_CONTACT' | 'CONNECTED' | 'BAD_TIMING'
  jobtitle?: string
  website?: string
  industry?: string
  // Custom properties
  business_stage?: string
  services_interested?: string
  source?: string
  message?: string
}

export interface HubSpotContact {
  id: string
  properties: HubSpotContactProperties & {
    createdate?: string
    lastmodifieddate?: string
    hs_object_id?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateContactInput {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  businessStage?: string
  services?: string[]
  source?: string
  message?: string
}

// ============================================
// DEAL TYPES
// ============================================

export interface HubSpotDealProperties {
  dealname: string
  amount?: string
  pipeline?: string
  dealstage?: string
  closedate?: string
  description?: string
  // Custom properties
  order_id?: string
  payment_method?: string
  items_summary?: string
}

export interface HubSpotDeal {
  id: string
  properties: HubSpotDealProperties & {
    createdate?: string
    hs_lastmodifieddate?: string
    hs_object_id?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateDealInput {
  orderId: string
  customerEmail: string
  customerName?: string
  amount: number
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  paymentMethod?: string
  stage?: 'closedwon' | 'closedlost' | 'appointmentscheduled' | 'qualifiedtobuy' | 'presentationscheduled' | 'decisionmakerboughtin' | 'contractsent'
}

// ============================================
// SYNC RESULT TYPES
// ============================================

export interface SyncResult {
  success: boolean
  action: 'created' | 'updated' | 'skipped' | 'failed'
  hubspotId?: string
  error?: string
}

export interface ContactSyncResult extends SyncResult {
  contactId?: string
  email: string
}

export interface DealSyncResult extends SyncResult {
  dealId?: string
  orderId: string
}

// ============================================
// WEBHOOK TYPES
// ============================================

export interface HubSpotWebhookEvent {
  eventId: number
  subscriptionId: number
  portalId: number
  appId: number
  occurredAt: number
  subscriptionType: string
  attemptNumber: number
  objectId: number
  propertyName?: string
  propertyValue?: string
  changeSource?: string
  sourceId?: string
}

export type HubSpotWebhookSubscriptionType =
  | 'contact.creation'
  | 'contact.deletion'
  | 'contact.propertyChange'
  | 'deal.creation'
  | 'deal.deletion'
  | 'deal.propertyChange'

// ============================================
// PIPELINE CONFIGURATION
// ============================================

export const DEFAULT_PIPELINE = 'default'

export const DEAL_STAGES = {
  NEW: 'appointmentscheduled',
  QUALIFIED: 'qualifiedtobuy',
  PROPOSAL: 'presentationscheduled',
  NEGOTIATION: 'decisionmakerboughtin',
  CONTRACT: 'contractsent',
  CLOSED_WON: 'closedwon',
  CLOSED_LOST: 'closedlost',
} as const

export type DealStage = typeof DEAL_STAGES[keyof typeof DEAL_STAGES]
