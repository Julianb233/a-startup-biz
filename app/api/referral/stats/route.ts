/**
 * REFERRAL STATISTICS API ROUTE
 *
 * GET /api/referral/stats?userId={userId}
 *   - Get referrer's statistics
 *   - Total referrals, conversions, pending commissions, paid commissions
 *   - Recent referrals list
 *   - Payout history
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders } from '@/lib/cors'
import { auth } from '@/lib/clerk-server-safe'
import {
  getReferralStats,
  getUserReferrals,
  getUserPayouts,
} from '@/lib/referral'
import { withRateLimit } from '@/lib/rate-limit'
import type { GetReferralStatsResponse } from '@/lib/types/referral'

/**
 * GET /api/referral/stats
 *
 * Get comprehensive referral statistics for a user
 *
 * Query params:
 *   - userId: User ID (optional if authenticated)
 *   - includeReferrals: Include recent referrals list (default: true)
 *   - includePayouts: Include payout history (default: true)
 *   - limit: Number of recent items to include (default: 20)
 *
 * Returns:
 *   - stats: Aggregated statistics
 *   - recentReferrals: Recent referrals (if requested)
 *   - payouts: Payout history (if requested)
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting - prevent abuse (10 requests per hour per IP)
    const rateLimitResponse = await withRateLimit(request, 'referral')
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Get authenticated user
    const { userId: authUserId } = await auth()

    // Get parameters from query
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    const includeReferrals = searchParams.get('includeReferrals') !== 'false'
    const includePayouts = searchParams.get('includePayouts') !== 'false'
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const userId = requestedUserId || authUserId

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          stats: {
            referrer_id: '',
            referrer_email: '',
            total_referrals: 0,
            signups: 0,
            conversions: 0,
            total_commissions: 0,
            paid_commissions: 0,
            pending_commissions: 0,
          },
          message: 'User ID required. Please authenticate or provide userId parameter.',
        } satisfies GetReferralStatsResponse,
        { status: 401 }
      )
    }

    // Security: Users can only access their own stats
    if (authUserId && authUserId !== userId) {
      // You can add admin check here
      // const userRole = await getUserRole(authUserId)
      // if (userRole !== 'admin') { ... }

      return NextResponse.json(
        {
          success: false,
          stats: {
            referrer_id: userId,
            referrer_email: '',
            total_referrals: 0,
            signups: 0,
            conversions: 0,
            total_commissions: 0,
            paid_commissions: 0,
            pending_commissions: 0,
          },
          message: 'Unauthorized: Cannot access other user statistics.',
        } satisfies GetReferralStatsResponse,
        { status: 403 }
      )
    }

    // Get statistics
    const stats = await getReferralStats(userId)

    // Prepare response
    const response: GetReferralStatsResponse = {
      success: true,
      stats,
    }

    // Include recent referrals if requested
    if (includeReferrals) {
      response.recentReferrals = await getUserReferrals(userId, limit)
    }

    // Include payouts if requested
    if (includePayouts) {
      response.payouts = await getUserPayouts(userId, limit)
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('GET /api/referral/stats error:', error)

    return NextResponse.json(
      {
        success: false,
        stats: {
          referrer_id: '',
          referrer_email: '',
          total_referrals: 0,
          signups: 0,
          conversions: 0,
          total_commissions: 0,
          paid_commissions: 0,
          pending_commissions: 0,
        },
        message: error instanceof Error ? error.message : 'Failed to get referral statistics',
      } satisfies GetReferralStatsResponse,
      { status: 500 }
    )
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(origin, 'GET, OPTIONS'),
    }
  )
}
