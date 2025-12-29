import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import {
  getPartnerByUserId,
  getPartnerStripeConnect,
  updatePartnerStripeAccount,
  sql,
} from '@/lib/db-queries'
import {
  createConnectAccount,
  createOnboardingLink,
  getAccountStatus,
  getStripeErrorMessage,
} from '@/lib/stripe-connect'
import type { StripeConnectStatusResponse } from '@/lib/types/stripe-connect'

/**
 * GET /api/partner/stripe-connect
 *
 * Get partner's Stripe Connect account status
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

    // Get partner with Stripe fields
    const partnerWithStripe = await getPartnerStripeConnect(partner.id)

    if (!partnerWithStripe?.stripe_account_id) {
      // Not connected yet
      const response: StripeConnectStatusResponse = {
        connected: false,
        accountId: null,
        status: 'not_connected',
        payoutsEnabled: false,
        chargesEnabled: false,
        detailsSubmitted: false,
        onboardingComplete: false,
        connectedAt: null,
      }
      return NextResponse.json(response)
    }

    // Get real-time status from Stripe
    try {
      const stripeStatus = await getAccountStatus(partnerWithStripe.stripe_account_id)
      return NextResponse.json(stripeStatus)
    } catch (stripeError) {
      // Return cached status if Stripe call fails
      const response: StripeConnectStatusResponse = {
        connected: true,
        accountId: partnerWithStripe.stripe_account_id,
        status: partnerWithStripe.stripe_account_status,
        payoutsEnabled: partnerWithStripe.stripe_payouts_enabled,
        chargesEnabled: partnerWithStripe.stripe_charges_enabled,
        detailsSubmitted: partnerWithStripe.stripe_details_submitted,
        onboardingComplete: partnerWithStripe.stripe_onboarding_complete,
        connectedAt: partnerWithStripe.stripe_connected_at,
      }
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error('Error getting Stripe Connect status:', error)
    return NextResponse.json(
      { error: 'Failed to get Stripe Connect status' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/partner/stripe-connect
 *
 * Create a Stripe Connect Express account and return onboarding link
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

    // Check if partner already has a Stripe account
    const partnerWithStripe = await getPartnerStripeConnect(partner.id)

    if (partnerWithStripe?.stripe_account_id) {
      // Account exists, return onboarding link to continue/update
      try {
        const onboardingLink = await createOnboardingLink(
          partnerWithStripe.stripe_account_id
        )
        return NextResponse.json({
          success: true,
          accountId: partnerWithStripe.stripe_account_id,
          onboardingUrl: onboardingLink.url,
          expiresAt: onboardingLink.expiresAt,
          message: 'Continue your Stripe account setup',
        })
      } catch (stripeError) {
        console.error('Error creating onboarding link:', stripeError)
        return NextResponse.json(
          {
            error: 'Failed to create onboarding link',
            message: getStripeErrorMessage(stripeError),
          },
          { status: 500 }
        )
      }
    }

    // Parse request body for optional settings
    let businessType: 'individual' | 'company' = 'individual'
    let country = 'US'

    try {
      const body = await request.json()
      if (body.businessType) businessType = body.businessType
      if (body.country) country = body.country
    } catch {
      // No body provided, use defaults
    }

    // Get partner's email from profile
    const profileResult = await sql`
      SELECT pp.contact_email, u.email
      FROM partners p
      LEFT JOIN partner_profiles pp ON p.id = pp.partner_id
      LEFT JOIN users u ON p.user_id = u.clerk_id
      WHERE p.id = ${partner.id}
    ` as unknown as { contact_email?: string; email?: string }[]

    const email = profileResult[0]?.contact_email || profileResult[0]?.email || ''

    if (!email) {
      return NextResponse.json(
        { error: 'Partner email not found. Please update your profile first.' },
        { status: 400 }
      )
    }

    // Create Stripe Connect account
    const stripeAccount = await createConnectAccount({
      email,
      partnerId: partner.id,
      businessType,
      country,
    })

    // Save account ID to database
    await updatePartnerStripeAccount(partner.id, {
      stripeAccountId: stripeAccount.id,
      status: 'pending',
    })

    // Generate onboarding link
    const onboardingLink = await createOnboardingLink(stripeAccount.id)

    return NextResponse.json({
      success: true,
      accountId: stripeAccount.id,
      onboardingUrl: onboardingLink.url,
      expiresAt: onboardingLink.expiresAt,
      message: 'Stripe account created. Complete your setup to start receiving payouts.',
    })
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return NextResponse.json(
      {
        error: 'Failed to create Stripe Connect account',
        message: getStripeErrorMessage(error),
      },
      { status: 500 }
    )
  }
}
