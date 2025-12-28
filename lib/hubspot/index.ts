/**
 * HubSpot CRM Integration - Main Export
 *
 * Convenience exports for the HubSpot integration modules
 */

// Client
export {
  HubSpotClient,
  getHubSpotClient,
  resetHubSpotClient,
} from './client';

// Contacts
export {
  findContactByEmail,
  mapOnboardingToContact,
  createContact,
  updateContact,
  upsertContact,
  getContact,
  deleteContact,
  addNoteToContact,
} from './contacts';

// Deals
export {
  getPipelines,
  mapOnboardingToDeal,
  createDeal,
  updateDeal,
  getDeal,
  associateDealWithContact,
  moveDealToStage,
  markDealAsWon,
  markDealAsLost,
  createDealFromOnboarding,
  getDealsByContact,
} from './deals';

// Types
export type {
  HubSpotContact,
  HubSpotDeal,
  HubSpotCompany,
  HubSpotResponse,
  HubSpotSearchResponse,
  HubSpotBatchResponse,
  HubSpotWebhookEvent,
  HubSpotWebhookPayload,
  HubSpotError,
  HubSpotPipeline,
  HubSpotPipelineStage,
  SyncStatus,
  OnboardingToHubSpotMapping,
  RateLimitInfo,
  HubSpotConfig,
} from './types';
