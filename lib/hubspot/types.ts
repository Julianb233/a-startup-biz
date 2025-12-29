/**
 * HubSpot CRM Integration - Type Definitions
 *
 * Comprehensive TypeScript types for HubSpot API integration including
 * contacts, deals, companies, and webhook events.
 */

// ============================================================================
// Contact Types
// ============================================================================

export interface HubSpotContact {
  id: string;
  properties: HubSpotContactProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotContactProperties {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  lifecyclestage?: string;

  // Custom properties for A Startup Biz
  business_name?: string;
  business_type?: string;
  business_stage?: string;
  business_size?: string;
  revenue_range?: string;
  years_in_business?: string;
  timeline?: string;
  budget_range?: string;
  primary_challenge?: string;
  services_interested?: string;
  priority_level?: string;
  referral_source?: string;
  referral_code?: string;

  // Social media
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  youtube_url?: string;

  // Additional metadata
  hs_lead_status?: string;
  hs_analytics_source?: string;
  hs_analytics_source_data_1?: string;
  hs_analytics_source_data_2?: string;
}

export interface CreateContactRequest {
  properties: Partial<HubSpotContactProperties>;
}

export interface UpdateContactRequest {
  properties: Partial<HubSpotContactProperties>;
}

// ============================================================================
// Deal Types
// ============================================================================

export interface HubSpotDeal {
  id: string;
  properties: HubSpotDealProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotDealProperties {
  dealname: string;
  dealstage: string;
  pipeline?: string;
  amount?: string;
  closedate?: string;

  // Custom properties
  deal_type?: string;
  deal_priority?: string;
  deal_source?: string;
  budget_confirmed?: string;
  timeline_confirmed?: string;
  services_scope?: string;

  // HubSpot standard fields
  hs_deal_stage_probability?: string;
  hs_forecast_amount?: string;
  hs_forecast_probability?: string;
  hs_is_closed?: string;
  hs_is_closed_won?: string;
}

export interface CreateDealRequest {
  properties: Partial<HubSpotDealProperties>;
  associations?: DealAssociation[];
}

export interface DealAssociation {
  to: { id: string };
  types: Array<{
    associationCategory: string;
    associationTypeId: number;
  }>;
}

// ============================================================================
// Company Types
// ============================================================================

export interface HubSpotCompany {
  id: string;
  properties: HubSpotCompanyProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotCompanyProperties {
  name: string;
  domain?: string;
  industry?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  numberofemployees?: string;
  annualrevenue?: string;
  description?: string;
  website?: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface HubSpotWebhookEvent {
  eventId: string;
  subscriptionId: string;
  portalId: number;
  appId: number;
  occurredAt: number;
  subscriptionType: string;
  attemptNumber: number;
  objectId: number;
  propertyName?: string;
  propertyValue?: string;
  changeSource?: string;
  sourceId?: string;
}

export interface HubSpotWebhookPayload {
  events: HubSpotWebhookEvent[];
}

export type WebhookEventType =
  | 'contact.creation'
  | 'contact.deletion'
  | 'contact.propertyChange'
  | 'deal.creation'
  | 'deal.deletion'
  | 'deal.propertyChange'
  | 'company.creation'
  | 'company.deletion'
  | 'company.propertyChange';

// ============================================================================
// API Response Types
// ============================================================================

export interface HubSpotApiResponse<T> {
  status: string;
  results?: T[];
  total?: number;
  paging?: {
    next?: {
      after: string;
      link: string;
    };
  };
}

export interface HubSpotSearchResponse<T> {
  total: number;
  results: T[];
  paging?: {
    next?: {
      after: string;
    };
  };
}

export interface HubSpotBatchResponse<T> {
  status: string;
  results: T[];
  startedAt: string;
  completedAt: string;
}

export interface HubSpotError {
  status: string;
  message: string;
  correlationId: string;
  category: string;
  subCategory?: string;
  errors?: Array<{
    message: string;
    in?: string;
  }>;
}

// ============================================================================
// Sync Operation Types
// ============================================================================

export interface SyncContactData {
  contactEmail: string;
  contactName?: string;
  contactPhone?: string;
  companyName?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  revenueRange?: string;
  yearsInBusiness?: number;
  timeline?: string;
  budgetRange?: string;
  primaryChallenge?: string;
  servicesInterested?: string;
  priorityLevel?: string;
  referralSource?: string;
  referralCode?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
}

export interface SyncDealData {
  dealName: string;
  dealStage?: string;
  pipeline?: string;
  amount?: string;
  closeDate?: string;
  dealType?: string;
  priority?: string;
  source?: string;
  servicesScope?: string;
}

export interface SyncResult {
  success: boolean;
  contactId?: string;
  dealId?: string;
  companyId?: string;
  created: boolean;
  updated: boolean;
  errors?: string[];
  hubspotUrl?: string;
}

export interface SyncOptions {
  createDeal?: boolean;
  dealData?: Partial<SyncDealData>;
  associateToCompany?: boolean;
  updateExisting?: boolean;
  skipDuplicateCheck?: boolean;
}

// ============================================================================
// Field Mapping Types
// ============================================================================

export interface OnboardingToHubSpotMapping {
  // Contact fields
  contactEmail: 'email';
  contactName: 'firstname' | 'lastname';
  contactPhone: 'phone';
  companyName: 'company' | 'business_name';
  website: 'website';
  industry: 'industry' | 'business_type';
  companySize: 'business_size';
  revenueRange: 'revenue_range';
  yearsInBusiness: 'years_in_business';
  timeline: 'timeline';
  budgetRange: 'budget_range';
  primaryChallenge: 'primary_challenge';
  servicesInterested: 'services_interested';
  priorityLevel: 'priority_level';
  referralSource: 'referral_source';
  referralCode: 'referral_code';

  // Social media
  socialFacebook: 'facebook_url';
  socialInstagram: 'instagram_url';
  socialLinkedin: 'linkedin_url';
  socialTwitter: 'twitter_url';
  socialTiktok: 'tiktok_url';
  socialYoutube: 'youtube_url';
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface HubSpotConfig {
  apiKey: string;
  portalId?: string;
  webhookSecret?: string;
  retryAttempts?: number;
  retryDelay?: number;
  rateLimit?: {
    requestsPerSecond: number;
    burstLimit: number;
  };
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
