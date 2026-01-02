import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { requireAdmin } from '@/lib/api-auth'
import { scrapeWebsite } from '@/lib/partner-onboarding/scraper-service'
import { updateMicrositeWithScrapedData, getMicrositeByPartnerId } from '@/lib/partner-onboarding/microsite-generator'
import { sql } from '@/lib/db'

/**
 * POST /api/microsites/scrape
 * Manually trigger scraping for a partner's website
 *
 * Body:
 * - partnerId: string (required)
 * - websiteUrl: string (optional, uses partner's website_url if not provided)
 * - forceUpdate: boolean (optional, default: false - only updates null fields)
 */
export async function POST(request: Request) {
  try {
    await requireAdmin()
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { partnerId, websiteUrl, forceUpdate = false } = body

    if (!partnerId) {
      return NextResponse.json(
        { error: 'partnerId is required' },
        { status: 400 }
      )
    }

    // Get partner details
    const partnerResult = await sql`
      SELECT id, company_name, website_url, microsite_id
      FROM partners
      WHERE id = ${partnerId}
    `

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]
    const urlToScrape = websiteUrl || (partner.website_url as string)

    if (!urlToScrape) {
      return NextResponse.json(
        { error: 'No website URL provided or found for partner' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(urlToScrape)
    } catch {
      return NextResponse.json(
        { error: 'Invalid website URL format' },
        { status: 400 }
      )
    }

    // Scrape the website
    const scrapedData = await scrapeWebsite(urlToScrape)

    // Check if we got any data
    const hasData =
      scrapedData.logoUrl ||
      scrapedData.primaryColor ||
      scrapedData.description ||
      scrapedData.images.length > 0

    if (!hasData) {
      return NextResponse.json({
        success: false,
        message: 'Scraping completed but no data was extracted. This could be due to missing FIRECRAWL_API_KEY or website structure.',
        scrapedData,
        partner: {
          id: partner.id,
          companyName: partner.company_name,
        },
      })
    }

    // If partner has a microsite, update it
    if (partner.microsite_id) {
      await updateMicrositeWithScrapedData(
        partner.microsite_id as string,
        scrapedData
      )

      return NextResponse.json({
        success: true,
        message: 'Microsite updated with scraped data',
        scrapedData,
        partner: {
          id: partner.id,
          companyName: partner.company_name,
        },
        microsite: {
          id: partner.microsite_id,
          updated: true,
        },
      })
    }

    // If no microsite exists yet, return scraped data for potential microsite creation
    return NextResponse.json({
      success: true,
      message: 'Website scraped successfully. No microsite exists yet.',
      scrapedData,
      partner: {
        id: partner.id,
        companyName: partner.company_name,
      },
      suggestion: 'Create a microsite for this partner to apply the scraped data.',
    })
  } catch (error) {
    console.error('Error scraping website:', error)
    return NextResponse.json(
      {
        error: 'Failed to scrape website',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/microsites/scrape?partnerId=xxx
 * Check scraping status for a partner
 */
export async function GET(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')

    if (!partnerId) {
      return NextResponse.json(
        { error: 'partnerId query parameter is required' },
        { status: 400 }
      )
    }

    // Get partner and microsite info
    const result = await sql`
      SELECT
        p.id,
        p.company_name,
        p.website_url,
        p.microsite_id,
        m.last_scraped_at,
        m.logo_url,
        m.primary_color,
        m.description,
        m.images,
        m.source_website
      FROM partners p
      LEFT JOIN partner_microsites m ON p.microsite_id = m.id
      WHERE p.id = ${partnerId}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }

    const data = result[0]

    return NextResponse.json({
      partner: {
        id: data.id,
        companyName: data.company_name,
        websiteUrl: data.website_url,
        hasMicrosite: data.microsite_id !== null,
      },
      microsite: data.microsite_id ? {
        id: data.microsite_id,
        lastScrapedAt: data.last_scraped_at,
        hasLogo: !!data.logo_url,
        hasPrimaryColor: !!data.primary_color,
        hasDescription: !!data.description,
        imageCount: Array.isArray(data.images) ? data.images.length : 0,
        sourceWebsite: data.source_website,
      } : null,
      canScrape: !!data.website_url,
      apiKeyConfigured: !!process.env.FIRECRAWL_API_KEY,
    })
  } catch (error) {
    console.error('Error getting scraping status:', error)
    return NextResponse.json(
      { error: 'Failed to get scraping status' },
      { status: 500 }
    )
  }
}
