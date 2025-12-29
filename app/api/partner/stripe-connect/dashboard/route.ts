import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, getPartnerStripeConnect } from '@/lib/db-queries'
import { createDashboardLink, getStripeErrorMessage } from '@/lib/stripe-connect'

/**
 * GET /api/partner/stripe-connect/dashboard
 *
 * Generate a login link to the Stripe Express Dashboard
 * Partners can manage their bank accounts and view payouts
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

    const partnerWithStripe = await getPartnerStripeConnect(partner.id)

    if (!partnerWithStripe?.stripe_account_id) {
      return NextResponse.json(
        {
          error: 'Stripe account not found',
          message: 'Please connect your Stripe account first',
        },
        { status: 400 }
      )
    }

    if (!partnerWithStripe.stripe_details_submitted) {
      return NextResponse.json(
        {
          error: 'Account setup incomplete',
          message: 'Please complete your Stripe account setup first',
        },
        { status: 400 }
      )
    }

    // Generate Express Dashboard login link
    const dashboardLink = await createDashboardLink(
      partnerWithStripe.stripe_account_id
    )

    return NextResponse.json({
      success: true,
      url: dashboardLink.url,
    })
  } catch (error) {
    console.error('Error generating dashboard link:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate dashboard link',
        message: getStripeErrorMessage(error),
      },
      { status: 500 }
    )
  }
}
