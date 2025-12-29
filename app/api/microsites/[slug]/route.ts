import { NextResponse } from 'next/server'
import { getMicrositeBySlug, incrementPageViews } from '@/lib/partner-onboarding'
import { sql } from '@/lib/db'

interface RouteParams {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/microsites/[slug]
 * Get microsite data for rendering
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params

    const microsite = await getMicrositeBySlug(slug)

    if (!microsite) {
      return NextResponse.json(
        { error: 'Microsite not found' },
        { status: 404 }
      )
    }

    if (!microsite.isActive) {
      return NextResponse.json(
        { error: 'Microsite is not active' },
        { status: 404 }
      )
    }

    // Get partner info
    const partnerResult = await sql`
      SELECT company_name, status
      FROM partners
      WHERE id = ${microsite.partnerId}
    `

    if (partnerResult.length === 0 || partnerResult[0].status !== 'active') {
      return NextResponse.json(
        { error: 'Partner not found or inactive' },
        { status: 404 }
      )
    }

    // Increment page views (don't await to not slow response)
    incrementPageViews(microsite.id).catch(console.error)

    return NextResponse.json({
      microsite: {
        id: microsite.id,
        slug: microsite.slug,
        companyName: microsite.companyName,
        logoUrl: microsite.logoUrl,
        primaryColor: microsite.primaryColor,
        secondaryColor: microsite.secondaryColor,
        heroHeadline: microsite.heroHeadline,
        heroSubheadline: microsite.heroSubheadline,
        description: microsite.description,
        images: microsite.images,
        templateId: microsite.templateId,
        formTitle: microsite.formTitle,
        formSubtitle: microsite.formSubtitle,
        formFields: microsite.formFields,
        formButtonText: microsite.formButtonText,
        successMessage: microsite.successMessage,
        metaTitle: microsite.metaTitle,
        metaDescription: microsite.metaDescription,
      },
      partner: {
        id: microsite.partnerId,
        companyName: partnerResult[0].company_name,
      },
    })
  } catch (error) {
    console.error('Error fetching microsite:', error)
    return NextResponse.json(
      { error: 'Failed to fetch microsite' },
      { status: 500 }
    )
  }
}
