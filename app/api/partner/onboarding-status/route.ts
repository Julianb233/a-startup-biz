import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { sql } from '@/lib/db-queries'

/**
 * GET /api/partner/onboarding-status
 *
 * Returns the current partner's onboarding status including:
 * - Partner details
 * - Onboarding step
 * - Agreement status
 * - Payment status
 * - Microsite info
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get partner by clerk_user_id
    const partners = await sql`
      SELECT
        p.id,
        p.company_name,
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
        p.status,
        p.onboarding_step,
        p.commission_rate,
        p.agreements_completed,
        p.agreements_completed_at,
        p.payment_details_submitted,
        p.website_url,
        p.microsite_id,
        p.approved_at,
        p.created_at
      FROM partners p
      WHERE p.clerk_user_id = ${userId}
      LIMIT 1
    ` as Array<{
      id: string
      company_name: string
      first_name: string | null
      last_name: string | null
      email: string
      phone: string | null
      status: string
      onboarding_step: string | null
      commission_rate: number
      agreements_completed: boolean
      agreements_completed_at: Date | null
      payment_details_submitted: boolean
      website_url: string | null
      microsite_id: string | null
      approved_at: Date | null
      created_at: Date
    }>

    if (!partners || partners.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      )
    }

    const partner = partners[0]

    // Get microsite info if exists
    let microsite = null
    if (partner.microsite_id) {
      const microsites = await sql`
        SELECT
          id,
          slug,
          company_name,
          logo_url,
          primary_color,
          page_views,
          lead_submissions
        FROM partner_microsites
        WHERE id = ${partner.microsite_id}
        LIMIT 1
      ` as Array<{
        id: string
        slug: string
        company_name: string
        logo_url: string | null
        primary_color: string
        page_views: number
        lead_submissions: number
      }>

      if (microsites && microsites.length > 0) {
        microsite = microsites[0]
      }
    }

    // Get agreement acceptance status
    const acceptedAgreements = await sql`
      SELECT
        paa.agreement_id,
        pa.agreement_type,
        pa.title,
        paa.accepted_at
      FROM partner_agreement_acceptances paa
      JOIN partner_agreements pa ON paa.agreement_id = pa.id
      WHERE paa.partner_id = ${partner.id}
    ` as Array<{
      agreement_id: string
      agreement_type: string
      title: string
      accepted_at: Date
    }>

    // Get total required agreements
    const requiredAgreements = await sql`
      SELECT COUNT(*) as count
      FROM partner_agreements
      WHERE is_active = true AND is_required = true
    ` as Array<{ count: number }>

    const totalRequired = requiredAgreements[0]?.count || 3
    const totalSigned = acceptedAgreements.length

    // Determine current onboarding step based on actual status
    let currentStep = partner.onboarding_step || 'pending_approval'

    // Override step if status indicates completion
    if (partner.status === 'pending') {
      currentStep = 'pending_approval'
    } else if (!partner.agreements_completed && partner.status === 'active') {
      currentStep = 'sign_agreements'
    } else if (!partner.payment_details_submitted && partner.agreements_completed) {
      currentStep = 'payment_details'
    } else if (partner.agreements_completed && partner.payment_details_submitted) {
      currentStep = 'completed'
    }

    return NextResponse.json({
      success: true,
      partner: {
        id: partner.id,
        company_name: partner.company_name,
        first_name: partner.first_name,
        last_name: partner.last_name,
        email: partner.email,
        phone: partner.phone,
        status: partner.status,
        commission_rate: partner.commission_rate,
        website_url: partner.website_url,
        approved_at: partner.approved_at,
        created_at: partner.created_at,
      },
      onboarding: {
        currentStep,
        steps: {
          approval: {
            completed: partner.status === 'active',
            completedAt: partner.approved_at,
          },
          agreements: {
            completed: partner.agreements_completed,
            completedAt: partner.agreements_completed_at,
            signed: totalSigned,
            required: totalRequired,
            acceptedAgreements,
          },
          payment: {
            completed: partner.payment_details_submitted,
          },
        },
      },
      microsite: microsite
        ? {
            id: microsite.id,
            slug: microsite.slug,
            url: `/p/${microsite.slug}`,
            logoUrl: microsite.logo_url,
            primaryColor: microsite.primary_color,
            stats: {
              pageViews: microsite.page_views,
              leadSubmissions: microsite.lead_submissions,
            },
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching onboarding status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch onboarding status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
