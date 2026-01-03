/**
 * REFERRAL SYSTEM TYPE UTILITIES
 *
 * Advanced TypeScript utilities for referral tracking system
 * Provides runtime validation, type guards, and helper functions
 *
 * @module lib/types/referral-utils
 */

import type {
  ReferralStatus,
  PayoutStatus,
  PaymentMethod,
  ReferralCode,
  EmailAddress,
  UserId,
  Referral,
  ReferralPayout,
  ValidationResult,
  CommissionConfig,
} from './referral'

/**
 * Type predicate to check if a referral has been converted
 */
export function isConvertedReferral(
  referral: Referral
): referral is Referral & {
  status: 'converted' | 'paid_out'
  conversion_date: Date
  conversion_value: number
  commission_amount: number
} {
  return (
    (referral.status === 'converted' || referral.status === 'paid_out') &&
    referral.conversion_date !== null &&
    referral.conversion_value !== null &&
    referral.commission_amount !== null
  )
}

/**
 * Type predicate to check if a payout has been paid
 */
export function isPaidPayout(
  payout: ReferralPayout
): payout is ReferralPayout & {
  status: 'paid'
  paid_at: Date
  payment_method: PaymentMethod
} {
  return (
    payout.status === 'paid' &&
    payout.paid_at !== null &&
    payout.payment_method !== null
  )
}

/**
 * Type predicate to check if a payout is pending
 */
export function isPendingPayout(
  payout: ReferralPayout
): payout is ReferralPayout & {
  status: 'pending'
} {
  return payout.status === 'pending'
}

/**
 * Extract numeric value from branded type (for database queries)
 */
export function extractReferralCode(code: ReferralCode): string {
  return code as string
}

/**
 * Extract email from branded type (for database queries)
 */
export function extractEmail(email: EmailAddress): string {
  return email as string
}

/**
 * Extract user ID from branded type (for database queries)
 */
export function extractUserId(userId: UserId): string {
  return userId as string
}

/**
 * Safe number parsing with validation
 */
export function parsePositiveNumber(
  value: unknown,
  fieldName: string
): ValidationResult<number> {
  if (typeof value === 'number') {
    if (value <= 0) {
      return {
        success: false,
        error: `${fieldName} must be a positive number`,
      }
    }
    return { success: true, data: value }
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    if (isNaN(parsed)) {
      return {
        success: false,
        error: `${fieldName} must be a valid number`,
      }
    }
    if (parsed <= 0) {
      return {
        success: false,
        error: `${fieldName} must be a positive number`,
      }
    }
    return { success: true, data: parsed }
  }

  return {
    success: false,
    error: `${fieldName} must be a number`,
  }
}

/**
 * Safe date parsing with validation
 */
export function parseDateSafe(
  value: unknown,
  fieldName: string
): ValidationResult<Date> {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      return {
        success: false,
        error: `${fieldName} is an invalid date`,
      }
    }
    return { success: true, data: value }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: `${fieldName} is not a valid date`,
      }
    }
    return { success: true, data: date }
  }

  return {
    success: false,
    error: `${fieldName} must be a Date, string, or number`,
  }
}

/**
 * Calculate commission with type safety
 */
export function calculateCommissionSafe(
  purchaseValue: number,
  config: CommissionConfig
): number {
  if (purchaseValue < 0) {
    throw new TypeError('Purchase value cannot be negative')
  }

  if (purchaseValue < config.minimumPurchase) {
    return 0
  }

  const percentageCommission = purchaseValue * config.percentageRate
  return Math.max(percentageCommission, config.flatAmount)
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format referral code for display (with spacing)
 */
export function formatReferralCode(code: ReferralCode | string): string {
  return (code as string).replace(/-/g, ' - ')
}

/**
 * Calculate conversion rate percentage
 */
export function calculateConversionRate(
  conversions: number,
  totalReferrals: number
): number {
  if (totalReferrals === 0) return 0
  return Math.round((conversions / totalReferrals) * 100 * 100) / 100
}

/**
 * Calculate signup rate percentage
 */
export function calculateSignupRate(signups: number, totalReferrals: number): number {
  if (totalReferrals === 0) return 0
  return Math.round((signups / totalReferrals) * 100 * 100) / 100
}

/**
 * Check if referral is within conversion window
 */
export function isWithinConversionWindow(
  referral: Referral,
  windowDays: number = 30
): boolean {
  if (!referral.created_at) return false

  const createdDate = new Date(referral.created_at)
  const windowEnd = new Date(createdDate)
  windowEnd.setDate(windowEnd.getDate() + windowDays)

  return new Date() <= windowEnd
}

/**
 * Check if referral has expired
 */
export function isExpired(referral: Referral): boolean {
  if (!referral.expires_at) return false
  return new Date() > new Date(referral.expires_at)
}

/**
 * Get days until expiration
 */
export function getDaysUntilExpiration(referral: Referral): number | null {
  if (!referral.expires_at) return null

  const now = new Date()
  const expiresAt = new Date(referral.expires_at)
  const diffTime = expiresAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Assert that a value is defined (non-null, non-undefined)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  fieldName: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} must be defined`)
  }
}

/**
 * Type-safe Record access with validation
 */
export function getRecordValue<T>(
  record: Record<string, unknown>,
  key: string,
  validator: (value: unknown) => value is T
): T | null {
  const value = record[key]
  return validator(value) ? value : null
}

/**
 * Ensure array of specific type
 */
export function ensureArray<T>(
  value: unknown,
  validator: (item: unknown) => item is T
): T[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(validator)
}

/**
 * Deep readonly utility type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P]
}

/**
 * Partial with specific required fields
 */
export type PartialWith<T, K extends keyof T> = Partial<T> & Pick<T, K>

/**
 * Make specific fields optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific fields required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Extract non-nullable fields from a type
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}
