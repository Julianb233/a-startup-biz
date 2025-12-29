/**
 * HubSpot CRM Integration - Type Definitions
 *
 * Comprehensive TypeScript types for HubSpot API integration including
 * contacts, deals, companies, and webhook events.
 */

// ============================================================================
// Contact Types
// ============================================================================

export interface HubSpotContactProperties {
  email: string
  firstname?: string
  lastname?: string
  phone?: string
  company?: string
  website?: string
  industry?: string
  lifecyclestage?: 'subscriber' | 'lead' | 'marketingqualifiedlead' | 'salesqualifiedlead' | 'opportunity' | 'customer' | 'evangelist' | 'other'
  hs_lead_status?: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'OPEN_DEAL' | 'UNQUALIFIED' | 'ATTEMPTED_TO_CONTACT' | 'CONNECTED' | 'BAD_TIMING'
  jobtitle?: string

  // Custom properties for A Startup Biz
  business_name?: string
  business_type?: string
  business_stage?: string
  business_size?: string
  revenue_range?: string
  years_in_business?: string
  timeline?: string
  budget_range?: string
  primary_challenge?: string
  services_interested?: string
  priority_level?: string
  referral_source?: string
  referral_code?: string
  source?: string
  message?: string

  // Social media
  facebook_url?: string
  instagram_url?: string
  linkedin_url?: string
  twitter_url?: string
  tiktok_url?: string
  youtube_url?: string

  // HubSpot metadata
  createdate?: string
  lastmodifieddate?: string
  hs_object_id?: string
  hs_analytics_source?: string
  hs_analytics_source_data_1?: string
  hs_analytics_source_data_2?: string
}

export interface HubSpotContact {
  id: string
  properties: HubSpotContactProperties
  createdAt?: string
  updatedAt?: string
  archived?: boolean
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

// ============================================================================
// Deal Types
// ============================================================================

export interface HubSpotDealProperties {
  dealname: string
  dealstage: string
  pipeline?: string
  amount?: string
  closedate?: string
  description?: string

  // Custom properties
  order_id?: string
  payment_method?: string
  items_summary?: string
  deal_type?: string
  deal_priority?: string
  deal_source?: string
  budget_confirmed?: string
  timeline_confirmed?: string
  services_scope?: string

  // HubSpot standard fields
  createdate?: string
  hs_lastmodifieddate?: string
  hs_object_id?: string
  hs_deal_stage_probability?: string
  hs_forecast_amount?: string
  hs_forecast_probability?: string
  hs_is_closed?: string
  hs_is_closed_won?: string
}

export interface HubSpotDeal {
  id: string
  properties: HubSpotDealProperties
  createdAt?: string
  updatedAt?: string
  archived?: boolean
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

export interface DealAssociation {
  to: { id: string }
  types: Array<{
    associationCategory: string
    associationTypeId: number
  }>
}

// ============================================================================
// Webhook Types
// ============================================================================

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
  | 'company.creation'
  | 'company.deletion'
  | 'company.propertyChange'

// ============================================================================
// Sync Operation Types
// ============================================================================

export interface SyncContactData {
  contactEmail: string
  contactName?: string
  contactPhone?: string
  companyName?: string
  website?: string
  industry?: string
  companySize?: string
  revenueRange?: string
  yearsInBusiness?: number
  timeline?: string
  budgetRange?: string
  primaryChallenge?: string
  servicesInterested?: string
  priorityLevel?: string
  referralSource?: string
  referralCode?: string
  businessGoals?: string[]
  challenges?: string[]
  socialMedia?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    tiktok?: string
    youtube?: string
  }
}

export interface SyncDealData {
  dealName: string
  dealStage?: string
  pipeline?: string
  amount?: string
  closeDate?: string
  dealType?: string
  priority?: string
  source?: string
  servicesScope?: string
}

export interface SyncResult {
  success: boolean
  action?: 'created' | 'updated' | 'skipped' | 'failed'
  contactId?: string
  dealId?: string
  companyId?: string
  created: boolean
  updated: boolean
  errors?: string[]
  hubspotUrl?: string
  error?: string
}

export interface ContactSyncResult extends SyncResult {
  email: string
}

export interface DealSyncResult extends SyncResult {
  orderId: string
}

export interface SyncOptions {
  createDeal?: boolean
  dealData?: Partial<SyncDealData>
  associateToCompany?: boolean
  updateExisting?: boolean
  skipDuplicateCheck?: boolean
}

// ============================================================================
// Pipeline Configuration
// ============================================================================

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

// ============================================================================
// Configuration Types
// ============================================================================

export interface HubSpotConfig {
  apiKey: string
  portalId?: string
  webhookSecret?: string
  retryAttempts?: number
  retryDelay?: number
  rateLimit?: {
    requestsPerSecond: number
    burstLimit: number
  }
}

export interface RateLimitInfo {
  remaining: number
  limit: number
  resetAt: number
}

// ============================================================================
// API Response Types
// ============================================================================

export interface HubSpotError {
  status: string
  message: string
  correlationId: string
  category: string
  subCategory?: string
  errors?: Array<{
    message: string
    in?: string
  }>
}
