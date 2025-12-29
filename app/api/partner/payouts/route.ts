import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import {
  getPartnerByUserId,
  getPartnerStripeConnect,
  getPartnerBalance,
  getPartnerPayouts,
  createPartnerPayout,
} from '@/lib/db-queries'
import {
  createPayout,
  validatePayoutAmount,
  getStripeErrorMessage,
} from '@/lib/stripe-connect'
import type {
  PayoutsResponse,
  PayoutSummary,
  PayoutCreatedResponse,
  CreatePayoutRequest,
} from '@/lib/types/stripe-connect'

/**
 * GET /api/partner/payouts
 *
 * Get partner's payout history
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner account not found' },
        { status: 404 }
      )
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get payouts from database
    const { payouts, total } = await getPartnerPayouts(partner.id, limit, offset)

    // Map to response format
    const payoutSummaries: PayoutSummary[] = payouts.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      method: p.method,
      destinationLast4: p.destination_last4,
      arrivalDate: p.arrival_date,
      createdAt: p.created_at,
      paidAt: p.paid_at,
    }))

    const response: PayoutsResponse = {
      payouts: payoutSummaries,
      total,
      limit,
      offset,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error getting partner payouts:', error)
    return NextResponse.json(
      { error: 'Failed to get payouts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/partner/payouts
 *
 * Request a manual payout
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner account not found' },
        { status: 404 }
      )
    }

    // Get partner with Stripe info
    const partnerWithStripe = await getPartnerStripeConnect(partner.id)

    if (!partnerWithStripe?.stripe_account_id) {
      return NextResponse.json(
        {
          error: 'Stripe account not connected',
          message: 'Please connect your Stripe account before requesting a payout',
        },
        { status: 400 }
      )
    }

    if (!partnerWithStripe.stripe_payouts_enabled) {
      return NextResponse.json(
        {
          error: 'Payouts not enabled',
          message: 'Please complete your Stripe account setup to enable payouts',
        },
        { status: 400 }
      )
    }

    // Parse request
    const body: CreatePayoutRequest = await request.json()
    const { amount } = body

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get current balance
    const balance = await getPartnerBalance(partner.id)

    // Validate payout amount
    const validation = validatePayoutAmount(
      amount,
      balance.availableBalance,
      balance.minimumPayoutThreshold
    )

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid payout amount',
          message: validation.error,
          availableBalance: balance.availableBalance,
          requestedAmount: amount,
          minimumThreshold: balance.minimumPayoutThreshold,
        },
        { status: 400 }
      )
    }

    // Create payout in Stripe
    const stripePayout = await createPayout({
      accountId: partnerWithStripe.stripe_account_id,
      amount,
      partnerId: partner.id,
    })

    // Record payout in database
    const dbPayout = await createPartnerPayout({
      partnerId: partner.id,
      stripePayoutId: stripePayout.id,
      amount,
      status: 'pending',
      method: stripePayout.method || 'standard',
      arrivalDate: stripePayout.arrival_date
        ? new Date(stripePayout.arrival_date * 1000)
        : undefined,
      requestedBy: 'manual',
    })

    const payoutSummary: PayoutSummary = {
      id: dbPayout.id,
      amount: Number(dbPayout.amount),
      currency: dbPayout.currency,
      status: dbPayout.status,
      method: dbPayout.method,
      destinationLast4: dbPayout.destination_last4,
      arrivalDate: dbPayout.arrival_date,
      createdAt: dbPayout.created_at,
      paidAt: dbPayout.paid_at,
    }

    const response: PayoutCreatedResponse = {
      success: true,
      payout: payoutSummary,
      message: `Payout of $${amount.toFixed(2)} initiated successfully`,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating payout:', error)
    return NextResponse.json(
      {
        error: 'Failed to create payout',
        message: getStripeErrorMessage(error),
      },
      { status: 500 }
    )
  }
}
