/**
 * Stripe Connect Type Definitions
 *
 * TypeScript types for Stripe Connect Express integration
 * Handles partner account connection, transfers, and payouts
 */

// ============================================
// STATUS TYPES
// ============================================

/**
 * Stripe Connect account status
 */
export type StripeAccountStatus =
  | 'not_connected'
  | 'pending'
  | 'active'
  | 'restricted'
  | 'disabled'

/**
 * Transfer status from platform to connected account
 */
export type TransferStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'reversed'

/**
 * Payout status for bank withdrawals
 */
export type PayoutStatus =
  | 'pending'
  | 'in_transit'
  | 'paid'
  | 'failed'
  | 'canceled'

/**
 * Source type for transfers
 */
export type TransferSourceType = 'commission' | 'bonus' | 'adjustment' | 'refund'

/**
 * Payout request type
 */
export type PayoutRequestedBy = 'manual' | 'auto' | 'admin'

// ============================================
// DATABASE MODELS
// ============================================

/**
 * Partner Stripe Connect fields (extends Partner)
 */
export interface PartnerStripeConnect {
  stripe_account_id: string | null
  stripe_account_status: StripeAccountStatus
  stripe_onboarding_complete: boolean
  stripe_payouts_enabled: boolean
  stripe_charges_enabled: boolean
  stripe_details_submitted: boolean
  stripe_connected_at: Date | null
  available_balance: number
  pending_balance: number
  minimum_payout_threshold: number
}

/**
 * Partner Transfer database model
 */
export interface PartnerTransfer {
  id: string
  partner_id: string
  partner_lead_id: string | null

  stripe_transfer_id: string | null
  amount: number
  currency: string

  status: TransferStatus
  description: string | null
  transfer_group: string | null
  source_type: TransferSourceType

  error_code: string | null
  error_message: string | null

  created_at: Date
  processed_at: Date | null
  failed_at: Date | null
  updated_at: Date
}

/**
 * Partner Payout database model
 */
export interface PartnerPayout {
  id: string
  partner_id: string

  stripe_payout_id: string | null
  amount: number
  currency: string

  status: PayoutStatus
  arrival_date: Date | null
  method: string

  destination_type: string | null
  destination_last4: string | null

  failure_code: string | null
  failure_message: string | null

  requested_by: PayoutRequestedBy

  created_at: Date
  initiated_at: Date | null
  paid_at: Date | null
  failed_at: Date | null
  updated_at: Date
}

/**
 * Stripe Connect Event log
 */
export interface StripeConnectEvent {
  id: string
  partner_id: string | null
  stripe_account_id: string | null

  event_id: string
  event_type: string
  event_data: Record<string, unknown>

  processed: boolean
  processed_at: Date | null
  error_message: string | null

  created_at: Date
}

// ============================================
// API REQUEST TYPES
// ============================================

/**
 * Request to create Stripe Connect account
 */
export interface CreateConnectAccountRequest {
  businessType?: 'individual' | 'company'
  country?: string
}

/**
 * Request to create a payout
 */
export interface CreatePayoutRequest {
  amount: number
}

/**
 * Request to create a transfer (admin)
 */
export interface CreateTransferRequest {
  amount: number
  leadId?: string
  description?: string
  sourceType?: TransferSourceType
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Stripe Connect status response
 */
export interface StripeConnectStatusResponse {
  connected: boolean
  accountId: string | null
  status: StripeAccountStatus
  payoutsEnabled: boolean
  chargesEnabled: boolean
  detailsSubmitted: boolean
  onboardingComplete: boolean
  connectedAt: Date | null
}

/**
 * Onboarding link response
 */
export interface OnboardingLinkResponse {
  url: string
  expiresAt: Date
}

/**
 * Express dashboard link response
 */
export interface DashboardLinkResponse {
  url: string
}

/**
 * Partner balance response
 */
export interface BalanceResponse {
  availableBalance: number
  pendingBalance: number
  minimumPayoutThreshold: number
  canRequestPayout: boolean
  currency: string
}

/**
 * Transfer list response
 */
export interface TransfersResponse {
  transfers: TransferSummary[]
  total: number
  limit: number
  offset: number
}

/**
 * Transfer summary for list display
 */
export interface TransferSummary {
  id: string
  amount: number
  currency: string
  status: TransferStatus
  sourceType: TransferSourceType
  description: string | null
  createdAt: Date
  processedAt: Date | null
}

/**
 * Payout list response
 */
export interface PayoutsResponse {
  payouts: PayoutSummary[]
  total: number
  limit: number
  offset: number
}

/**
 * Payout summary for list display
 */
export interface PayoutSummary {
  id: string
  amount: number
  currency: string
  status: PayoutStatus
  method: string
  destinationLast4: string | null
  arrivalDate: Date | null
  createdAt: Date
  paidAt: Date | null
}

/**
 * Payout creation response
 */
export interface PayoutCreatedResponse {
  success: true
  payout: PayoutSummary
  message: string
}

/**
 * Transfer creation response
 */
export interface TransferCreatedResponse {
  success: true
  transfer: TransferSummary
  message: string
}

// ============================================
// ERROR RESPONSE TYPES
// ============================================

/**
 * Stripe Connect error response
 */
export interface StripeConnectError {
  error: string
  code?: string
  message?: string
}

/**
 * Payout validation error
 */
export interface PayoutValidationError extends StripeConnectError {
  availableBalance: number
  requestedAmount: number
  minimumThreshold: number
}

// ============================================
// WEBHOOK TYPES
// ============================================

/**
 * Stripe webhook event types we handle
 */
export type StripeConnectWebhookEventType =
  | 'account.updated'
  | 'account.application.deauthorized'
  | 'transfer.created'
  | 'transfer.reversed'
  | 'transfer.failed'
  | 'payout.created'
  | 'payout.updated'
  | 'payout.paid'
  | 'payout.failed'
  | 'payout.canceled'
  | 'capability.updated'

/**
 * Webhook processing result
 */
export interface WebhookProcessingResult {
  success: boolean
  eventId: string
  eventType: string
  message?: string
  error?: string
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Type guard for valid Stripe account status
 */
export function isValidStripeAccountStatus(
  status: string
): status is StripeAccountStatus {
  return [
    'not_connected',
    'pending',
    'active',
    'restricted',
    'disabled',
  ].includes(status)
}

/**
 * Type guard for valid transfer status
 */
export function isValidTransferStatus(status: string): status is TransferStatus {
  return ['pending', 'processing', 'paid', 'failed', 'reversed'].includes(status)
}

/**
 * Type guard for valid payout status
 */
export function isValidPayoutStatus(status: string): status is PayoutStatus {
  return ['pending', 'in_transit', 'paid', 'failed', 'canceled'].includes(status)
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Pagination params
 */
export interface PaginationParams {
  limit?: number
  offset?: number
}

/**
 * Date range for filtering
 */
export interface DateRange {
  startDate?: Date
  endDate?: Date
}
