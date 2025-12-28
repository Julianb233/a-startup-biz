/**
 * REFERRAL SYSTEM TYPES
 *
 * TypeScript interfaces for the referral tracking system
 * Aligned with database schema in lib/db-schema-referral.sql
 */

/**
 * Referral status progression:
 * pending -> signed_up -> converted -> paid_out
 *
 * Alternative paths:
 * pending -> expired (30-day window passed)
 * any -> invalid (fraud, refund, etc.)
 */
export type ReferralStatus =
  | 'pending'      // Code created but not used
  | 'signed_up'    // Referred user created account
  | 'converted'    // Referred user made qualifying purchase
  | 'paid_out'     // Commission has been paid
  | 'expired'      // Referral expired (30-day window)
  | 'invalid'      // Invalidated (fraud, refund, etc.)

/**
 * Payout status progression:
 * pending -> processing -> paid
 *
 * Alternative paths:
 * pending/processing -> failed -> cancelled
 */
export type PayoutStatus =
  | 'pending'      // Commission earned, waiting to reach threshold
  | 'processing'   // Payment being processed
  | 'paid'         // Successfully paid out
  | 'failed'       // Payment failed
  | 'cancelled'    // Payout cancelled

/**
 * Supported payment methods for commission payouts
 */
export type PaymentMethod =
  | 'stripe'
  | 'paypal'
  | 'bank_transfer'
  | 'venmo'
  | 'cashapp'
  | 'manual'

/**
 * Main referral record - tracks the relationship between referrer and referred user
 */
export interface Referral {
  id: string

  // Referrer (person who owns the referral code)
  referrer_id: string
  referrer_email: string

  // Referred user (person who used the code)
  referred_email: string
  referred_user_id: string | null  // Set when they sign up

  // Referral code (unique identifier)
  referral_code: string

  // Status and conversion tracking
  status: ReferralStatus
  conversion_date: Date | null
  conversion_value: number | null  // Value of first qualifying purchase
  commission_amount: number | null // Commission earned

  // Cookie tracking (30-day window)
  cookie_expiry: Date | null
  first_visit_at: Date | null
  signup_date: Date | null

  // UTM parameters for attribution
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null

  // Technical tracking
  ip_address: string | null
  user_agent: string | null
  referrer_url: string | null

  // Metadata
  notes: string | null
  metadata: Record<string, any> | null

  // Timestamps
  created_at: Date
  updated_at: Date
  expires_at: Date | null  // created_at + 30 days
}

/**
 * Commission payout record - tracks when and how commissions are paid
 */
export interface ReferralPayout {
  id: string

  // Links back to referral
  referral_id: string
  referrer_id: string  // Denormalized for easier queries

  // Payout details
  amount: number
  status: PayoutStatus

  // Payment method
  payment_method: PaymentMethod | null
  payment_reference: string | null  // External payment ID
  payment_details: Record<string, any> | null

  // Timing
  paid_at: Date | null
  failed_at: Date | null
  failure_reason: string | null

  // Metadata
  notes: string | null
  metadata: Record<string, any> | null

  // Timestamps
  created_at: Date
  updated_at: Date
}

/**
 * Statistics for a referrer - aggregated view
 */
export interface ReferralStats {
  referrer_id: string
  referrer_email: string

  // Counts
  total_referrals: number      // All referrals created
  signups: number              // Users who signed up
  conversions: number          // Users who made qualifying purchase

  // Financial
  total_commissions: number    // Total commissions earned
  paid_commissions: number     // Already paid out
  pending_commissions: number  // Waiting to be paid

  // Rates
  conversion_rate?: number     // conversions / total_referrals
  signup_rate?: number         // signups / total_referrals

  // Additional stats
  avg_commission?: number      // Average commission per conversion
  lifetime_value?: number      // Total value generated
}

/**
 * Detailed referral with payout information
 */
export interface ReferralWithPayout extends Referral {
  payout?: ReferralPayout
}

/**
 * Request/Response types for API routes
 */

// POST /api/referral/code
export interface GenerateReferralCodeRequest {
  userId: string
  email: string
}

export interface GenerateReferralCodeResponse {
  success: boolean
  referralCode: string
  message?: string
}

// GET /api/referral/code?userId=xxx
export interface GetReferralCodeResponse {
  success: boolean
  referralCode: string | null
  referrals?: Referral[]
  stats?: ReferralStats
  message?: string
}

// POST /api/referral/track
export interface TrackReferralRequest {
  referralCode: string
  referredEmail: string

  // Optional tracking data
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  ipAddress?: string
  userAgent?: string
  referrerUrl?: string
}

export interface TrackReferralResponse {
  success: boolean
  referralId?: string
  message?: string
}

// POST /api/referral/convert
export interface ConvertReferralRequest {
  referralCode?: string        // Either code or referred email
  referredEmail?: string
  referredUserId?: string      // User ID of person who signed up
  purchaseValue: number        // Amount of first purchase
  orderId?: string             // Link to order
}

export interface ConvertReferralResponse {
  success: boolean
  referralId?: string
  commissionAmount?: number
  message?: string
}

// GET /api/referral/stats?userId=xxx
export interface GetReferralStatsResponse {
  success: boolean
  stats: ReferralStats
  recentReferrals?: Referral[]
  payouts?: ReferralPayout[]
  message?: string
}

/**
 * Commission calculation configuration
 */
export interface CommissionConfig {
  percentageRate: number      // e.g., 0.10 for 10%
  flatAmount: number          // e.g., 25 for $25
  minimumPurchase: number     // e.g., 100 for $100 minimum
  payoutThreshold: number     // e.g., 50 for $50 minimum payout
  cookieWindowDays: number    // e.g., 30 for 30-day window
}

/**
 * Default commission configuration
 *
 * Rules:
 * - 10% of first purchase OR $25 flat (whichever is higher)
 * - Minimum conversion value: $100
 * - Payout threshold: $50 minimum before withdrawal
 * - 30-day cookie window for tracking
 */
export const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
  percentageRate: 0.10,       // 10%
  flatAmount: 25,             // $25
  minimumPurchase: 100,       // $100 minimum
  payoutThreshold: 50,        // $50 minimum payout
  cookieWindowDays: 30,       // 30-day window
}

/**
 * Referral code format configuration
 */
export interface ReferralCodeConfig {
  prefix: string              // e.g., "REF"
  includeUserId: boolean      // Include shortened user ID
  randomLength: number        // Length of random string
  separator: string           // e.g., "-"
}

export const DEFAULT_REFERRAL_CODE_CONFIG: ReferralCodeConfig = {
  prefix: 'REF',
  includeUserId: true,
  randomLength: 6,
  separator: '-',
}

/**
 * Database query result types
 */

// Result from referrer_stats view
export interface ReferrerStatsRow {
  referrer_id: string
  referrer_email: string
  total_referrals: number
  signups: number
  conversions: number
  total_commissions: number
  paid_commissions: number
  pending_commissions: number
}

// Result from active_referrals view
export interface ActiveReferralRow {
  id: string
  referrer_id: string
  referrer_email: string
  referred_email: string
  referral_code: string
  status: ReferralStatus
  commission_amount: number | null
  conversion_date: Date | null
  created_at: Date
}

/**
 * Validation helpers
 */
export function isValidReferralCode(code: string): boolean {
  // REF-XXX-XXXXXX format
  const pattern = /^REF-[A-Z0-9]+-[A-Z0-9]{6,}$/
  return pattern.test(code)
}

export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

export function isQualifyingPurchase(
  amount: number,
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): boolean {
  return amount >= config.minimumPurchase
}

export function canRequestPayout(
  pendingAmount: number,
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): boolean {
  return pendingAmount >= config.payoutThreshold
}
