import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import {
  getPartnerByUserId,
  getPartnerStripeConnect,
  getPartnerBalance,
} from '@/lib/db-queries'
import type { BalanceResponse } from '@/lib/types/stripe-connect'

/**
 * GET /api/partner/balance
 *
 * Get partner's available balance for payouts
 */
export async function GET() {
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

    // Get balance from database (updated by triggers)
    const balance = await getPartnerBalance(partner.id)

    // Determine if partner can request a payout
    const canRequestPayout =
      partnerWithStripe?.stripe_account_id !== null &&
      partnerWithStripe?.stripe_payouts_enabled === true &&
      balance.availableBalance >= balance.minimumPayoutThreshold

    const response: BalanceResponse = {
      availableBalance: balance.availableBalance,
      pendingBalance: balance.pendingBalance,
      minimumPayoutThreshold: balance.minimumPayoutThreshold,
      canRequestPayout,
      currency: 'usd',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error getting partner balance:', error)
    return NextResponse.json(
      { error: 'Failed to get balance' },
      { status: 500 }
    )
  }
}
