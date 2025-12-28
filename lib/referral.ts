/**
 * REFERRAL SYSTEM UTILITY FUNCTIONS
 *
 * Core business logic for referral tracking, commission calculation,
 * and code generation. Used by API routes and background jobs.
 */

import { sql } from './db'
import {
  Referral,
  ReferralPayout,
  ReferralStats,
  CommissionConfig,
  DEFAULT_COMMISSION_CONFIG,
  ReferralCodeConfig,
  DEFAULT_REFERRAL_CODE_CONFIG,
  ReferralStatus,
  PayoutStatus,
  ReferrerStatsRow,
  isValidReferralCode as validateCodeFormat,
} from './types/referral'

/**
 * Generate a unique referral code for a user
 *
 * Format: REF-{USER_ID_SHORT}-{RANDOM}
 * Example: REF-U3K-A7B2C9
 *
 * @param userId - User ID to generate code for
 * @param config - Configuration for code format
 * @returns Generated referral code
 */
export function generateReferralCode(
  userId: string,
  config: ReferralCodeConfig = DEFAULT_REFERRAL_CODE_CONFIG
): string {
  const { prefix, includeUserId, randomLength, separator } = config

  // Create short user ID (first 3 chars of user ID, uppercase)
  const userIdShort = includeUserId
    ? userId.substring(0, 3).toUpperCase()
    : ''

  // Generate random alphanumeric string
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomPart = ''
  for (let i = 0; i < randomLength; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  // Combine parts
  const parts = [prefix]
  if (userIdShort) parts.push(userIdShort)
  parts.push(randomPart)

  return parts.join(separator)
}

/**
 * Validate if a referral code is properly formatted and exists
 *
 * @param code - Referral code to validate
 * @returns True if valid format, false otherwise
 */
export function validateReferralCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false

  // Check format
  return validateCodeFormat(code)
}

/**
 * Calculate commission based on purchase value
 *
 * Rules:
 * - 10% of first purchase OR $25 flat (whichever is higher)
 * - Minimum conversion value: $100
 * - Returns 0 if purchase doesn't qualify
 *
 * @param purchaseValue - Value of the purchase
 * @param config - Commission configuration
 * @returns Commission amount (0 if doesn't qualify)
 */
export function calculateCommission(
  purchaseValue: number,
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): number {
  // Check if purchase qualifies
  if (purchaseValue < config.minimumPurchase) {
    return 0
  }

  // Calculate percentage-based commission
  const percentageCommission = purchaseValue * config.percentageRate

  // Return whichever is higher: percentage or flat amount
  return Math.max(percentageCommission, config.flatAmount)
}

/**
 * Get or create referral code for a user
 *
 * @param userId - User ID
 * @param email - User email
 * @returns Existing or newly created referral code
 */
export async function getOrCreateReferralCode(
  userId: string,
  email: string
): Promise<string> {
  try {
    // Check if user already has a referral code
    const existing = await sql`
      SELECT referral_code
      FROM referrals
      WHERE referrer_id = ${userId}
      AND status = 'pending'
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (existing.length > 0 && existing[0].referral_code) {
      return existing[0].referral_code
    }

    // Generate new code
    let referralCode = generateReferralCode(userId)
    let attempts = 0
    const maxAttempts = 5

    // Ensure uniqueness (retry if collision)
    while (attempts < maxAttempts) {
      const collision = await sql`
        SELECT id FROM referrals WHERE referral_code = ${referralCode}
      `

      if (collision.length === 0) {
        // No collision, create the referral
        await sql`
          INSERT INTO referrals (
            referrer_id,
            referrer_email,
            referred_email,
            referral_code,
            status
          ) VALUES (
            ${userId},
            ${email},
            '',
            ${referralCode},
            'pending'
          )
        `
        return referralCode
      }

      // Collision detected, generate new code
      referralCode = generateReferralCode(userId)
      attempts++
    }

    throw new Error('Failed to generate unique referral code after multiple attempts')
  } catch (error) {
    console.error('Error in getOrCreateReferralCode:', error)
    throw error
  }
}

/**
 * Track a referral signup (when someone uses a referral code)
 *
 * @param referralCode - The referral code used
 * @param referredEmail - Email of person signing up
 * @param metadata - Additional tracking data
 * @returns Created referral ID
 */
export async function trackReferralSignup(
  referralCode: string,
  referredEmail: string,
  metadata: {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    ipAddress?: string
    userAgent?: string
    referrerUrl?: string
  } = {}
): Promise<string> {
  try {
    // Validate code format
    if (!validateReferralCode(referralCode)) {
      throw new Error('Invalid referral code format')
    }

    // Get the referrer info from existing pending referral
    const referrer = await sql`
      SELECT referrer_id, referrer_email
      FROM referrals
      WHERE referral_code = ${referralCode}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (referrer.length === 0) {
      throw new Error('Referral code not found')
    }

    const { referrer_id, referrer_email } = referrer[0]

    // Check if this email was already referred by this code
    const existing = await sql`
      SELECT id FROM referrals
      WHERE referral_code = ${referralCode}
      AND referred_email = ${referredEmail}
    `

    if (existing.length > 0) {
      return existing[0].id
    }

    // Create new referral tracking record
    const result = await sql`
      INSERT INTO referrals (
        referrer_id,
        referrer_email,
        referred_email,
        referral_code,
        status,
        first_visit_at,
        signup_date,
        utm_source,
        utm_medium,
        utm_campaign,
        ip_address,
        user_agent,
        referrer_url
      ) VALUES (
        ${referrer_id},
        ${referrer_email},
        ${referredEmail},
        ${referralCode},
        'signed_up',
        NOW(),
        NOW(),
        ${metadata.utmSource || null},
        ${metadata.utmMedium || null},
        ${metadata.utmCampaign || null},
        ${metadata.ipAddress || null},
        ${metadata.userAgent || null},
        ${metadata.referrerUrl || null}
      )
      RETURNING id
    `

    return result[0].id
  } catch (error) {
    console.error('Error in trackReferralSignup:', error)
    throw error
  }
}

/**
 * Convert a referral (when referred user makes qualifying purchase)
 *
 * @param referralCode - Referral code (or pass referredEmail)
 * @param referredEmail - Email of person who made purchase
 * @param referredUserId - User ID of person who made purchase
 * @param purchaseValue - Amount of purchase
 * @param orderId - Optional order ID for reference
 * @returns Updated referral with commission info
 */
export async function convertReferral(
  {
    referralCode,
    referredEmail,
    referredUserId,
    purchaseValue,
    orderId,
  }: {
    referralCode?: string
    referredEmail?: string
    referredUserId?: string
    purchaseValue: number
    orderId?: string
  },
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): Promise<{ referralId: string; commissionAmount: number }> {
  try {
    // Find the referral record
    let referral
    if (referralCode) {
      referral = await sql`
        SELECT * FROM referrals
        WHERE referral_code = ${referralCode}
        AND status IN ('pending', 'signed_up')
        ORDER BY created_at DESC
        LIMIT 1
      `
    } else if (referredEmail) {
      referral = await sql`
        SELECT * FROM referrals
        WHERE referred_email = ${referredEmail}
        AND status IN ('pending', 'signed_up')
        ORDER BY created_at DESC
        LIMIT 1
      `
    } else {
      throw new Error('Must provide either referralCode or referredEmail')
    }

    if (referral.length === 0) {
      throw new Error('Referral not found or already converted')
    }

    const ref = referral[0]

    // Calculate commission
    const commissionAmount = calculateCommission(purchaseValue, config)

    if (commissionAmount === 0) {
      throw new Error(`Purchase value $${purchaseValue} does not meet minimum of $${config.minimumPurchase}`)
    }

    // Update referral to converted
    await sql`
      UPDATE referrals
      SET
        status = 'converted',
        conversion_date = NOW(),
        conversion_value = ${purchaseValue},
        commission_amount = ${commissionAmount},
        referred_user_id = ${referredUserId || ref.referred_user_id},
        metadata = jsonb_build_object(
          'order_id', ${orderId || ''},
          'converted_at', NOW()
        )
      WHERE id = ${ref.id}
    `

    // Create pending payout record
    await sql`
      INSERT INTO referral_payouts (
        referral_id,
        referrer_id,
        amount,
        status
      ) VALUES (
        ${ref.id},
        ${ref.referrer_id},
        ${commissionAmount},
        'pending'
      )
    `

    return {
      referralId: ref.id,
      commissionAmount,
    }
  } catch (error) {
    console.error('Error in convertReferral:', error)
    throw error
  }
}

/**
 * Get referral statistics for a user
 *
 * @param userId - User ID to get stats for
 * @returns Aggregated referral statistics
 */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  try {
    // Use the database view for stats
    const stats = await sql<ReferrerStatsRow[]>`
      SELECT * FROM referrer_stats
      WHERE referrer_id = ${userId}
    `

    if (stats.length === 0) {
      // No referrals yet
      return {
        referrer_id: userId,
        referrer_email: '',
        total_referrals: 0,
        signups: 0,
        conversions: 0,
        total_commissions: 0,
        paid_commissions: 0,
        pending_commissions: 0,
        conversion_rate: 0,
        signup_rate: 0,
        avg_commission: 0,
      }
    }

    const row = stats[0]

    // Calculate derived metrics
    const conversion_rate = row.total_referrals > 0
      ? row.conversions / row.total_referrals
      : 0

    const signup_rate = row.total_referrals > 0
      ? row.signups / row.total_referrals
      : 0

    const avg_commission = row.conversions > 0
      ? row.total_commissions / row.conversions
      : 0

    return {
      referrer_id: row.referrer_id,
      referrer_email: row.referrer_email,
      total_referrals: row.total_referrals,
      signups: row.signups,
      conversions: row.conversions,
      total_commissions: row.total_commissions,
      paid_commissions: row.paid_commissions,
      pending_commissions: row.pending_commissions,
      conversion_rate: Math.round(conversion_rate * 100) / 100,
      signup_rate: Math.round(signup_rate * 100) / 100,
      avg_commission: Math.round(avg_commission * 100) / 100,
    }
  } catch (error) {
    console.error('Error in getReferralStats:', error)
    throw error
  }
}

/**
 * Get all referrals for a user
 *
 * @param userId - User ID
 * @param limit - Maximum number of referrals to return
 * @returns Array of referrals
 */
export async function getUserReferrals(
  userId: string,
  limit: number = 50
): Promise<Referral[]> {
  try {
    const referrals = await sql<Referral[]>`
      SELECT * FROM referrals
      WHERE referrer_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return referrals
  } catch (error) {
    console.error('Error in getUserReferrals:', error)
    throw error
  }
}

/**
 * Get all payouts for a user
 *
 * @param userId - User ID
 * @param limit - Maximum number of payouts to return
 * @returns Array of payouts
 */
export async function getUserPayouts(
  userId: string,
  limit: number = 50
): Promise<ReferralPayout[]> {
  try {
    const payouts = await sql<ReferralPayout[]>`
      SELECT * FROM referral_payouts
      WHERE referrer_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return payouts
  } catch (error) {
    console.error('Error in getUserPayouts:', error)
    throw error
  }
}

/**
 * Check if a referral code is valid and not expired
 *
 * @param referralCode - Code to check
 * @returns True if valid and active
 */
export async function isReferralCodeActive(
  referralCode: string
): Promise<boolean> {
  try {
    if (!validateReferralCode(referralCode)) {
      return false
    }

    const result = await sql`
      SELECT id FROM referrals
      WHERE referral_code = ${referralCode}
      AND expires_at > NOW()
      AND status NOT IN ('expired', 'invalid')
      LIMIT 1
    `

    return result.length > 0
  } catch (error) {
    console.error('Error in isReferralCodeActive:', error)
    return false
  }
}

/**
 * Mark expired referrals (background job)
 * Should be run periodically (e.g., daily cron job)
 *
 * @returns Number of referrals marked as expired
 */
export async function markExpiredReferrals(): Promise<number> {
  try {
    const result = await sql`
      UPDATE referrals
      SET status = 'expired'
      WHERE expires_at < NOW()
      AND status NOT IN ('converted', 'expired', 'invalid', 'paid_out')
      RETURNING id
    `

    return result.length
  } catch (error) {
    console.error('Error in markExpiredReferrals:', error)
    throw error
  }
}

/**
 * Process pending payouts that meet threshold
 *
 * @param userId - User ID to process payouts for
 * @param config - Commission configuration
 * @returns Array of payout IDs that are ready for processing
 */
export async function getPendingPayoutsReady(
  userId: string,
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): Promise<ReferralPayout[]> {
  try {
    // Get sum of pending payouts
    const pendingSum = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM referral_payouts
      WHERE referrer_id = ${userId}
      AND status = 'pending'
    `

    const totalPending = Number(pendingSum[0].total)

    // Check if meets threshold
    if (totalPending < config.payoutThreshold) {
      return []
    }

    // Get pending payouts
    const payouts = await sql<ReferralPayout[]>`
      SELECT * FROM referral_payouts
      WHERE referrer_id = ${userId}
      AND status = 'pending'
      ORDER BY created_at ASC
    `

    return payouts
  } catch (error) {
    console.error('Error in getPendingPayoutsReady:', error)
    throw error
  }
}
