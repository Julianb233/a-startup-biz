/**
 * HubSpot CRM Integration - Type Definitions
 *
 * TypeScript interfaces for HubSpot API entities
 */

// Contact Properties
export interface HubSpotContact {
  id?: string;
  properties: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    jobtitle?: string;
    industry?: string;
    // Business details
    lifecyclestage?: string;
    hs_lead_status?: string;
    // Custom properties for onboarding
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
    youtube_url?: string;
    tiktok_url?: string;
    // Additional context
    additional_context?: string;
    best_time_to_call?: string;
    timezone?: string;
    communication_preference?: string;
    // System properties
    lastmodifieddate?: string;
    createdate?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

// Deal Properties
export interface HubSpotDeal {
  id?: string;
  properties: {
    dealname: string;
    dealstage: string;
    pipeline?: string;
    amount?: string;
    closedate?: string;
    // Custom properties
    deal_type?: string;
    deal_source?: string;
    budget_range?: string;
    timeline?: string;
    services_requested?: string;
    priority?: string;
    // System properties
    hs_lastmodifieddate?: string;
    hs_createdate?: string;
  };
  associations?: {
    contacts?: string[];
    companies?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

// Company Properties
export interface HubSpotCompany {
  id?: string;
  properties: {
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
  };
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

// API Response Types
export interface HubSpotResponse<T> {
  id: string;
  properties: T;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotSearchResponse<T> {
  total: number;
  results: HubSpotResponse<T>[];
  paging?: {
    next?: {
      after: string;
      link: string;
    };
  };
}

export interface HubSpotBatchResponse<T> {
  status: string;
  results: HubSpotResponse<T>[];
  errors?: Array<{
    id: string;
    category: string;
    message: string;
  }>;
}

// Webhook Event Types
export interface HubSpotWebhookEvent {
  objectId: number;
  propertyName?: string;
  propertyValue?: string;
  changeSource?: string;
  eventId: number;
  subscriptionId: number;
  portalId: number;
  appId: number;
  occurredAt: number;
  subscriptionType: string;
  attemptNumber: number;
}

export interface HubSpotWebhookPayload {
  events: HubSpotWebhookEvent[];
}

// Error Types
export interface HubSpotError {
  status: string;
  message: string;
  correlationId?: string;
  category?: string;
  errors?: Array<{
    message: string;
    in?: string;
  }>;
}

// Pipeline and Stage Types
export interface HubSpotPipeline {
  id: string;
  label: string;
  displayOrder: number;
  stages: HubSpotPipelineStage[];
}

export interface HubSpotPipelineStage {
  id: string;
  label: string;
  displayOrder: number;
  metadata: {
    probability?: string;
    isClosed?: string;
  };
}

// Sync Status
export interface SyncStatus {
  success: boolean;
  contactId?: string;
  dealId?: string;
  error?: string;
  timestamp: string;
}

// Mapping from Onboarding Form to HubSpot
export interface OnboardingToHubSpotMapping {
  contactEmail: string;
  contactName?: string;
  contactPhone?: string;
  companyName?: string;
  website?: string;
  industry?: string;
  businessGoals?: string[];
  primaryChallenge?: string;
  timeline?: string;
  budgetRange?: string;
  servicesInterested?: string[];
  priorityLevel?: string;
  referralSource?: string;
  referralCode?: string;
  // Social media
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialTwitter?: string;
  socialYoutube?: string;
  socialTiktok?: string;
  // Additional fields
  companySize?: string;
  revenueRange?: string;
  yearsInBusiness?: string;
  bestTimeToCall?: string;
  timezone?: string;
  communicationPreference?: string;
  additionalContext?: string;
}

// Rate Limiting
export interface RateLimitInfo {
  currentUsage: number;
  dailyLimit: number;
  intervalMilliseconds: number;
  callsRemaining: number;
}

// Config
export interface HubSpotConfig {
  apiKey: string;
  baseUrl?: string;
  defaultPipeline?: string;
  defaultDealStage?: string;
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
}

// Sync Types
export type ConflictResolutionStrategy = 'local-wins' | 'hubspot-wins' | 'last-write-wins' | 'manual';

export interface SyncOptions {
  conflictResolution?: ConflictResolutionStrategy;
  dryRun?: boolean;
  batchSize?: number;
  includeDeleted?: boolean;
}

export interface SyncLog {
  entityType: 'contacts' | 'deals' | 'companies';
  direction: 'push' | 'pull' | 'both';
  status: 'success' | 'error' | 'skipped';
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  timestamp: string;
  durationMs?: number;
  errors?: Array<{ entityId: string; error: string }>;
}

export interface SyncReport {
  entityType: 'contacts' | 'deals' | 'companies';
  direction: 'push' | 'pull' | 'both';
  startTime: string;
  endTime: string;
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
  durationMs?: number;
  errors: Array<{ entityId: string; error: string }>;
}
