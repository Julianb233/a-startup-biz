/**
 * REFERRAL CODE API ROUTE
 *
 * GET /api/referral/code?userId={userId}
 *   - Get user's referral code and basic stats
 *
 * POST /api/referral/code
 *   - Generate new referral code for user
 *   - Each user gets unique code like "REF-{USER_ID_SHORT}-{RANDOM}"
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getOrCreateReferralCode,
  getUserReferrals,
  getReferralStats,
} from '@/lib/referral'
import type {
  GenerateReferralCodeRequest,
  GenerateReferralCodeResponse,
  GetReferralCodeResponse,
} from '@/lib/types/referral'

/**
 * GET /api/referral/code
 *
 * Get user's referral code, referrals, and statistics
 *
 * Query params:
 *   - userId: User ID (optional if authenticated)
 *
 * Returns:
 *   - referralCode: User's referral code
 *   - referrals: List of user's referrals
 *   - stats: Aggregated statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId: authUserId } = await auth()

    // Get userId from query params or use authenticated user
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')

    const userId = requestedUserId || authUserId

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID required. Please authenticate or provide userId parameter.',
        } satisfies GetReferralCodeResponse,
        { status: 401 }
      )
    }

    // Security: Users can only access their own referral data
    // Unless they have admin role (implement based on your auth system)
    if (authUserId && authUserId !== userId) {
      // You can add admin check here
      // const userRole = await getUserRole(authUserId)
      // if (userRole !== 'admin') { ... }

      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Cannot access other user referral data.',
        } satisfies GetReferralCodeResponse,
        { status: 403 }
      )
    }

    // Get or create referral code
    // Note: We need user email - get from Clerk or your user system
    const email = searchParams.get('email') || `user_${userId}@example.com` // TODO: Get real email

    const referralCode = await getOrCreateReferralCode(userId, email)

    // Get user's referrals
    const referrals = await getUserReferrals(userId, 50)

    // Get statistics
    const stats = await getReferralStats(userId)

    return NextResponse.json(
      {
        success: true,
        referralCode,
        referrals,
        stats,
      } satisfies GetReferralCodeResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /api/referral/code error:', error)

    return NextResponse.json(
      {
        success: false,
        referralCode: null,
        message: error instanceof Error ? error.message : 'Failed to get referral code',
      } satisfies GetReferralCodeResponse,
      { status: 500 }
    )
  }
}

/**
 * POST /api/referral/code
 *
 * Generate a new referral code for a user
 *
 * Body:
 *   - userId: User ID
 *   - email: User email
 *
 * Returns:
 *   - referralCode: Newly generated code
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId: authUserId } = await auth()

    // Parse request body
    const body = await request.json() as GenerateReferralCodeRequest

    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json(
        {
          success: false,
          referralCode: '',
          message: 'userId and email are required',
        } satisfies GenerateReferralCodeResponse,
        { status: 400 }
      )
    }

    // Security: Users can only generate codes for themselves
    if (authUserId && authUserId !== userId) {
      return NextResponse.json(
        {
          success: false,
          referralCode: '',
          message: 'Unauthorized: Cannot generate code for other users',
        } satisfies GenerateReferralCodeResponse,
        { status: 403 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          referralCode: '',
          message: 'Invalid email format',
        } satisfies GenerateReferralCodeResponse,
        { status: 400 }
      )
    }

    // Generate or get existing code
    const referralCode = await getOrCreateReferralCode(userId, email)

    return NextResponse.json(
      {
        success: true,
        referralCode,
        message: 'Referral code generated successfully',
      } satisfies GenerateReferralCodeResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('POST /api/referral/code error:', error)

    return NextResponse.json(
      {
        success: false,
        referralCode: '',
        message: error instanceof Error ? error.message : 'Failed to generate referral code',
      } satisfies GenerateReferralCodeResponse,
      { status: 500 }
    )
  }
}
