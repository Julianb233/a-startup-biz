/**
 * REFERRAL TRACKING API ROUTE
 *
 * POST /api/referral/track
 *   - Track when someone signs up with a referral code
 *   - Store referred_email and referral_code
 *   - Update referral status to "signed_up"
 */

import { NextRequest, NextResponse } from 'next/server'
import { trackReferralSignup, validateReferralCode } from '@/lib/referral'
import type {
  TrackReferralRequest,
  TrackReferralResponse,
} from '@/lib/types/referral'

/**
 * POST /api/referral/track
 *
 * Track a referral signup when someone uses a referral code
 *
 * Body:
 *   - referralCode: Referral code used
 *   - referredEmail: Email of person signing up
 *   - utmSource, utmMedium, utmCampaign: Optional UTM parameters
 *   - ipAddress, userAgent, referrerUrl: Optional tracking data
 *
 * Returns:
 *   - referralId: ID of created referral record
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as TrackReferralRequest

    const {
      referralCode,
      referredEmail,
      utmSource,
      utmMedium,
      utmCampaign,
      ipAddress,
      userAgent,
      referrerUrl,
    } = body

    // Validate required fields
    if (!referralCode || !referredEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'referralCode and referredEmail are required',
        } satisfies TrackReferralResponse,
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(referredEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
        } satisfies TrackReferralResponse,
        { status: 400 }
      )
    }

    // Validate referral code format
    if (!validateReferralCode(referralCode)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid referral code format',
        } satisfies TrackReferralResponse,
        { status: 400 }
      )
    }

    // Get IP address from headers if not provided
    const clientIp = ipAddress ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Get user agent from headers if not provided
    const clientUserAgent = userAgent ||
      request.headers.get('user-agent') ||
      'unknown'

    // Get referrer from headers if not provided
    const clientReferrer = referrerUrl ||
      request.headers.get('referer') ||
      request.headers.get('referrer') ||
      null

    // Track the referral signup
    const referralId = await trackReferralSignup(
      referralCode,
      referredEmail,
      {
        utmSource,
        utmMedium,
        utmCampaign,
        ipAddress: clientIp,
        userAgent: clientUserAgent,
        referrerUrl: clientReferrer || undefined,
      }
    )

    return NextResponse.json(
      {
        success: true,
        referralId,
        message: 'Referral tracked successfully',
      } satisfies TrackReferralResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('POST /api/referral/track error:', error)

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Referral code not found or invalid',
          } satisfies TrackReferralResponse,
          { status: 404 }
        )
      }

      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          } satisfies TrackReferralResponse,
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to track referral',
      } satisfies TrackReferralResponse,
      { status: 500 }
    )
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}
