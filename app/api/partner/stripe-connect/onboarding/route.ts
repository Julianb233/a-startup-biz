import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, getPartnerStripeConnect } from '@/lib/db-queries'
import { createOnboardingLink, getStripeErrorMessage } from '@/lib/stripe-connect'

/**
 * GET /api/partner/stripe-connect/onboarding
 *
 * Generate a fresh onboarding link for an existing Stripe Connect account
 * Used when the partner needs to complete or update their account info
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

    // Generate fresh onboarding link
    const onboardingLink = await createOnboardingLink(
      partnerWithStripe.stripe_account_id
    )

    return NextResponse.json({
      success: true,
      url: onboardingLink.url,
      expiresAt: onboardingLink.expiresAt,
    })
  } catch (error) {
    console.error('Error generating onboarding link:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate onboarding link',
        message: getStripeErrorMessage(error),
      },
      { status: 500 }
    )
  }
}
