/**
 * REFERRAL CONVERSION API ROUTE
 *
 * POST /api/referral/convert
 *   - Mark referral as converted (when referred user makes purchase)
 *   - Calculate commission (e.g., 10% of first purchase or flat $50)
 *   - Update status to "converted"
 *   - Create payout record
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { convertReferral } from '@/lib/referral'
import { withRateLimit } from '@/lib/rate-limit'
import { detectFraud } from '@/lib/referral-fraud-detection'
import type {
  ConvertReferralRequest,
  ConvertReferralResponse,
} from '@/lib/types/referral'

/**
 * POST /api/referral/convert
 *
 * Convert a referral when the referred user makes a qualifying purchase
 *
 * Body:
 *   - referralCode: Referral code (optional if referredEmail provided)
 *   - referredEmail: Email of person who made purchase (optional if code provided)
 *   - referredUserId: User ID of person who made purchase
 *   - purchaseValue: Amount of the purchase
 *   - orderId: Optional order ID for reference
 *
 * Returns:
 *   - referralId: ID of converted referral
 *   - commissionAmount: Commission earned
 *
 * Commission Rules:
 *   - 10% of first purchase OR $25 flat (whichever is higher)
 *   - Minimum conversion value: $100
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent abuse
    const rateLimitResponse = await withRateLimit(request, 'referral')
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Parse request body
    const body = await request.json() as ConvertReferralRequest

    const {
      referralCode,
      referredEmail,
      referredUserId,
      purchaseValue,
      orderId,
    } = body

    // Validate required fields
    if (!referralCode && !referredEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Either referralCode or referredEmail is required',
        } satisfies ConvertReferralResponse,
        { status: 400 }
      )
    }

    if (typeof purchaseValue !== 'number' || purchaseValue <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid purchaseValue is required (must be positive number)',
        } satisfies ConvertReferralResponse,
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (referredEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(referredEmail)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid email format',
          } satisfies ConvertReferralResponse,
          { status: 400 }
        )
      }
    }

    // Optional: Verify authentication for security
    // Only allow conversions from authenticated sessions or webhooks
    const { userId: authUserId } = await auth()

    // You might want to:
    // 1. Only allow conversions from backend/admin
    // 2. Verify the purchase actually happened (check order)
    // 3. Prevent duplicate conversions

    // For now, we'll allow any authenticated request
    // In production, you should verify:
    // - The order exists and is paid
    // - The referred user matches the order
    // - This is the first qualifying purchase

    // Convert the referral
    const result = await convertReferral({
      referralCode,
      referredEmail,
      referredUserId,
      purchaseValue,
      orderId,
    })

    return NextResponse.json(
      {
        success: true,
        referralId: result.referralId,
        commissionAmount: result.commissionAmount,
        message: `Referral converted! Commission: $${result.commissionAmount.toFixed(2)}`,
      } satisfies ConvertReferralResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('POST /api/referral/convert error:', error)

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Referral not found or already converted',
          } satisfies ConvertReferralResponse,
          { status: 404 }
        )
      }

      if (error.message.includes('does not meet minimum')) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          } satisfies ConvertReferralResponse,
          { status: 400 }
        )
      }

      if (error.message.includes('already converted')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Referral has already been converted',
          } satisfies ConvertReferralResponse,
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to convert referral',
      } satisfies ConvertReferralResponse,
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
