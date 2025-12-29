/**
 * Stripe Connect Helper Functions
 *
 * Functions for managing Stripe Connect Express accounts,
 * creating transfers, and handling payouts
 */

import Stripe from 'stripe'
import { stripe, formatAmountForStripe, formatAmountFromStripe } from './stripe'
import type {
  StripeAccountStatus,
  TransferStatus,
  PayoutStatus,
  StripeConnectStatusResponse,
  OnboardingLinkResponse,
  DashboardLinkResponse,
} from './types/stripe-connect'

// ============================================
// CONFIGURATION
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://astartupbiz.com'
const PLATFORM_FEE_PERCENT = 0 // No platform fee on transfers for now

// ============================================
// ACCOUNT MANAGEMENT
// ============================================

/**
 * Create a Stripe Connect Express account for a partner
 */
export async function createConnectAccount(data: {
  email: string
  partnerId: string
  businessType?: 'individual' | 'company'
  country?: string
}): Promise<Stripe.Account> {
  const account = await stripe.accounts.create({
    type: 'express',
    country: data.country || 'US',
    email: data.email,
    capabilities: {
      transfers: { requested: true },
    },
    business_type: data.businessType || 'individual',
    metadata: {
      partner_id: data.partnerId,
    },
  })

  return account
}

/**
 * Generate an onboarding link for a Connect account
 */
export async function createOnboardingLink(
  accountId: string
): Promise<OnboardingLinkResponse> {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${BASE_URL}/partner-portal/earnings?refresh=true`,
    return_url: `${BASE_URL}/partner-portal/earnings?onboarding=complete`,
    type: 'account_onboarding',
  })

  return {
    url: accountLink.url,
    expiresAt: new Date(accountLink.expires_at * 1000),
  }
}

/**
 * Generate a login link to the Express Dashboard
 */
export async function createDashboardLink(
  accountId: string
): Promise<DashboardLinkResponse> {
  const loginLink = await stripe.accounts.createLoginLink(accountId)

  return {
    url: loginLink.url,
  }
}

/**
 * Retrieve and parse account status from Stripe
 */
export async function getAccountStatus(
  accountId: string
): Promise<StripeConnectStatusResponse> {
  const account = await stripe.accounts.retrieve(accountId)

  // Determine status based on account properties
  let status: StripeAccountStatus = 'pending'

  if (!account.details_submitted) {
    status = 'pending'
  } else if (account.requirements?.disabled_reason) {
    status = 'disabled'
  } else if (
    account.requirements?.currently_due &&
    account.requirements.currently_due.length > 0
  ) {
    status = 'restricted'
  } else if (account.payouts_enabled && account.charges_enabled) {
    status = 'active'
  } else if (account.details_submitted) {
    status = 'restricted'
  }

  return {
    connected: true,
    accountId: account.id,
    status,
    payoutsEnabled: account.payouts_enabled || false,
    chargesEnabled: account.charges_enabled || false,
    detailsSubmitted: account.details_submitted || false,
    onboardingComplete:
      account.details_submitted &&
      account.payouts_enabled &&
      !account.requirements?.currently_due?.length,
    connectedAt: account.created ? new Date(account.created * 1000) : null,
  }
}

/**
 * Check if an account can receive transfers
 */
export async function canReceiveTransfers(accountId: string): Promise<boolean> {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    return account.payouts_enabled === true
  } catch {
    return false
  }
}

// ============================================
// TRANSFERS (Platform → Connected Account)
// ============================================

/**
 * Create a transfer to a connected account
 */
export async function createTransfer(data: {
  accountId: string
  amount: number // In dollars
  partnerId: string
  leadId?: string
  description?: string
  transferGroup?: string
}): Promise<Stripe.Transfer> {
  const amountInCents = formatAmountForStripe(data.amount)

  const transfer = await stripe.transfers.create({
    amount: amountInCents,
    currency: 'usd',
    destination: data.accountId,
    description: data.description || 'Commission payout',
    transfer_group: data.transferGroup || `partner_${data.partnerId}`,
    metadata: {
      partner_id: data.partnerId,
      lead_id: data.leadId || '',
      source: 'a-startup-biz',
    },
  })

  return transfer
}

/**
 * Retrieve a transfer by ID
 */
export async function getTransfer(transferId: string): Promise<Stripe.Transfer> {
  return stripe.transfers.retrieve(transferId)
}

/**
 * List transfers for a connected account
 */
export async function listTransfers(
  accountId: string,
  limit = 10
): Promise<Stripe.ApiList<Stripe.Transfer>> {
  return stripe.transfers.list({
    destination: accountId,
    limit,
  })
}

/**
 * Map Stripe transfer status to our status
 */
export function mapTransferStatus(transfer: Stripe.Transfer): TransferStatus {
  if (transfer.reversed) {
    return 'reversed'
  }
  // Stripe transfers are instant once created
  return 'paid'
}

// ============================================
// PAYOUTS (Connected Account → Bank)
// ============================================

/**
 * Create a payout from a connected account to their bank
 */
export async function createPayout(data: {
  accountId: string
  amount: number // In dollars
  partnerId: string
}): Promise<Stripe.Payout> {
  const amountInCents = formatAmountForStripe(data.amount)

  // Create payout on the connected account
  const payout = await stripe.payouts.create(
    {
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        partner_id: data.partnerId,
        source: 'a-startup-biz',
        requested_by: 'manual',
      },
    },
    {
      stripeAccount: data.accountId,
    }
  )

  return payout
}

/**
 * Retrieve a payout by ID
 */
export async function getPayout(
  payoutId: string,
  accountId: string
): Promise<Stripe.Payout> {
  return stripe.payouts.retrieve(payoutId, {
    stripeAccount: accountId,
  })
}

/**
 * List payouts for a connected account
 */
export async function listPayouts(
  accountId: string,
  limit = 10
): Promise<Stripe.ApiList<Stripe.Payout>> {
  return stripe.payouts.list(
    {
      limit,
    },
    {
      stripeAccount: accountId,
    }
  )
}

/**
 * Map Stripe payout status to our status
 */
export function mapPayoutStatus(payout: Stripe.Payout): PayoutStatus {
  switch (payout.status) {
    case 'pending':
      return 'pending'
    case 'in_transit':
      return 'in_transit'
    case 'paid':
      return 'paid'
    case 'failed':
      return 'failed'
    case 'canceled':
      return 'canceled'
    default:
      return 'pending'
  }
}

// ============================================
// BALANCE
// ============================================

/**
 * Get the balance of a connected account
 */
export async function getConnectedAccountBalance(
  accountId: string
): Promise<{
  available: number
  pending: number
}> {
  const balance = await stripe.balance.retrieve({
    stripeAccount: accountId,
  })

  // Sum up USD amounts
  const available = balance.available
    .filter((b) => b.currency === 'usd')
    .reduce((sum, b) => sum + b.amount, 0)

  const pending = balance.pending
    .filter((b) => b.currency === 'usd')
    .reduce((sum, b) => sum + b.amount, 0)

  return {
    available: formatAmountFromStripe(available),
    pending: formatAmountFromStripe(pending),
  }
}

// ============================================
// WEBHOOK HELPERS
// ============================================

/**
 * Construct and verify a Connect webhook event
 */
export function constructConnectWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

/**
 * Extract account ID from a Connect webhook event
 */
export function getAccountIdFromEvent(event: Stripe.Event): string | null {
  // For Connect events, the account ID is in the event
  return event.account || null
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Check if an error is a Stripe error
 */
export function isStripeError(error: unknown): error is Stripe.errors.StripeError {
  return error instanceof Stripe.errors.StripeError
}

/**
 * Get a user-friendly error message from a Stripe error
 */
export function getStripeErrorMessage(error: unknown): string {
  if (isStripeError(error)) {
    switch (error.type) {
      case 'StripeCardError':
        return error.message || 'Your card was declined.'
      case 'StripeInvalidRequestError':
        return 'Invalid request. Please check your input.'
      case 'StripeAPIError':
        return 'Stripe API error. Please try again later.'
      case 'StripeConnectionError':
        return 'Network error. Please check your connection.'
      case 'StripeAuthenticationError':
        return 'Authentication failed. Please contact support.'
      case 'StripeRateLimitError':
        return 'Too many requests. Please wait and try again.'
      default:
        return error.message || 'An error occurred with the payment processor.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate payout amount against balance and threshold
 */
export function validatePayoutAmount(
  requestedAmount: number,
  availableBalance: number,
  minimumThreshold: number
): { valid: boolean; error?: string } {
  if (requestedAmount <= 0) {
    return { valid: false, error: 'Payout amount must be greater than 0' }
  }

  if (requestedAmount < minimumThreshold) {
    return {
      valid: false,
      error: `Minimum payout amount is $${minimumThreshold.toFixed(2)}`,
    }
  }

  if (requestedAmount > availableBalance) {
    return {
      valid: false,
      error: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`,
    }
  }

  return { valid: true }
}
