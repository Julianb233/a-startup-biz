import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db-queries'
import { scrapeWebsite } from '@/lib/partner-onboarding/scraper-service'
import { createMicrosite, updateMicrositeWithScrapedData } from '@/lib/partner-onboarding/microsite-generator'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'

// Webhook secret for n8n authentication
const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'n8n-partner-automation-secret'

interface WebhookPayload {
  action: 'scrape_website' | 'create_microsite' | 'send_welcome_email' | 'rescrape_all' | 'sync_partner'
  partnerId?: string
  data?: Record<string, unknown>
}

/**
 * POST /api/webhooks/n8n/partner-automation
 *
 * n8n webhook endpoint for partner automation tasks
 *
 * Actions:
 * - scrape_website: Scrape a partner's website and update their microsite
 * - create_microsite: Create a microsite for a partner
 * - send_welcome_email: Send welcome email to partner
 * - rescrape_all: Re-scrape all active partner websites
 * - sync_partner: Sync partner data to external systems
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('x-webhook-secret') || request.headers.get('authorization')
    if (authHeader !== WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload: WebhookPayload = await request.json()
    const { action, partnerId, data } = payload

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    switch (action) {
      case 'scrape_website': {
        if (!partnerId) {
          return NextResponse.json({ error: 'partnerId is required for scrape_website' }, { status: 400 })
        }

        // Get partner
        const partners = await sql`
          SELECT id, company_name, website_url, microsite_id
          FROM partners WHERE id = ${partnerId}
        ` as Array<{ id: string; company_name: string; website_url: string | null; microsite_id: string | null }>

        if (partners.length === 0) {
          return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
        }

        const partner = partners[0]

        if (!partner.website_url) {
          return NextResponse.json({
            success: false,
            message: 'Partner has no website URL',
            partnerId: partner.id
          })
        }

        // Scrape website
        const scrapedData = await scrapeWebsite(partner.website_url)

        // Update microsite if exists
        if (partner.microsite_id) {
          await updateMicrositeWithScrapedData(partner.microsite_id, scrapedData)
        }

        return NextResponse.json({
          success: true,
          action: 'scrape_website',
          partnerId: partner.id,
          companyName: partner.company_name,
          scrapedData,
          micrositeUpdated: !!partner.microsite_id
        })
      }

      case 'create_microsite': {
        if (!partnerId) {
          return NextResponse.json({ error: 'partnerId is required for create_microsite' }, { status: 400 })
        }

        // Get partner
        const partners = await sql`
          SELECT id, company_name, website_url, microsite_id
          FROM partners WHERE id = ${partnerId}
        ` as Array<{ id: string; company_name: string; website_url: string | null; microsite_id: string | null }>

        if (partners.length === 0) {
          return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
        }

        const partner = partners[0]

        if (partner.microsite_id) {
          return NextResponse.json({
            success: false,
            message: 'Partner already has a microsite',
            micrositeId: partner.microsite_id
          })
        }

        // Scrape website if available
        let scrapedData = null
        if (partner.website_url) {
          scrapedData = await scrapeWebsite(partner.website_url)
        }

        // Create microsite
        const microsite = await createMicrosite({
          partnerId,
          companyName: partner.company_name as string,
          websiteUrl: partner.website_url as string | undefined,
          logoUrl: scrapedData?.logoUrl || undefined,
          primaryColor: scrapedData?.primaryColor || undefined,
          description: scrapedData?.description || undefined,
          images: scrapedData?.images || undefined
        })

        return NextResponse.json({
          success: true,
          action: 'create_microsite',
          partnerId: partner.id,
          microsite: {
            id: microsite.id,
            slug: microsite.slug,
            url: `/p/${microsite.slug}`
          }
        })
      }

      case 'send_welcome_email': {
        if (!partnerId) {
          return NextResponse.json({ error: 'partnerId is required for send_welcome_email' }, { status: 400 })
        }

        // Get partner with microsite
        const partners = await sql`
          SELECT p.id, p.company_name, p.email, p.first_name,
                 m.slug as microsite_slug
          FROM partners p
          LEFT JOIN partner_microsites m ON p.microsite_id = m.id
          WHERE p.id = ${partnerId}
        ` as Array<{
          id: string
          company_name: string
          email: string
          first_name: string | null
          microsite_slug: string | null
        }>

        if (partners.length === 0) {
          return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
        }

        const partner = partners[0]
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astartupbiz.com'

        await sendEmail({
          to: partner.email,
          subject: 'Welcome to the A Startup Biz Partner Program!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #f97316;">Welcome, ${partner.first_name || partner.company_name}!</h1>
              <p>Your partner account is now active. Here's what you get:</p>

              <ul>
                <li><strong>10%+ Commission</strong> on every successful referral</li>
                <li><strong>Your Own Microsite</strong> at ${partner.microsite_slug ? `${siteUrl}/p/${partner.microsite_slug}` : 'Coming soon!'}</li>
                <li><strong>Real-Time Tracking</strong> in your partner portal</li>
              </ul>

              <h2 style="color: #374151;">Next Steps:</h2>
              <ol>
                <li>Complete your onboarding</li>
                <li>Sign the partner agreements</li>
                <li>Set up your payment details</li>
              </ol>

              <a href="${siteUrl}/partner-portal/onboarding/welcome"
                 style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
                Complete Onboarding
              </a>

              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email or contact partners@astartupbiz.com
              </p>
            </div>
          `
        })

        return NextResponse.json({
          success: true,
          action: 'send_welcome_email',
          partnerId: partner.id,
          email: partner.email
        })
      }

      case 'rescrape_all': {
        // Get all active partners with websites but potentially outdated microsites
        const partners = await sql`
          SELECT p.id, p.company_name, p.website_url, p.microsite_id,
                 m.last_scraped_at
          FROM partners p
          LEFT JOIN partner_microsites m ON p.microsite_id = m.id
          WHERE p.status = 'active'
            AND p.website_url IS NOT NULL
            AND (m.last_scraped_at IS NULL OR m.last_scraped_at < NOW() - INTERVAL '30 days')
          LIMIT 10
        ` as Array<{
          id: string
          company_name: string
          website_url: string
          microsite_id: string | null
          last_scraped_at: Date | null
        }>

        const results = []

        for (const partner of partners) {
          try {
            const scrapedData = await scrapeWebsite(partner.website_url)

            if (partner.microsite_id) {
              await updateMicrositeWithScrapedData(partner.microsite_id, scrapedData)
            }

            results.push({
              partnerId: partner.id,
              companyName: partner.company_name,
              success: true
            })
          } catch (error) {
            results.push({
              partnerId: partner.id,
              companyName: partner.company_name,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        }

        return NextResponse.json({
          success: true,
          action: 'rescrape_all',
          processed: results.length,
          results
        })
      }

      case 'sync_partner': {
        if (!partnerId) {
          return NextResponse.json({ error: 'partnerId is required for sync_partner' }, { status: 400 })
        }

        // Get full partner data for syncing to external systems
        const partners = await sql`
          SELECT
            p.*,
            m.slug as microsite_slug,
            m.page_views,
            m.lead_submissions,
            (SELECT COUNT(*) FROM partner_leads WHERE partner_id = p.id) as total_leads,
            (SELECT COUNT(*) FROM partner_leads WHERE partner_id = p.id AND status = 'converted') as converted_leads
          FROM partners p
          LEFT JOIN partner_microsites m ON p.microsite_id = m.id
          WHERE p.id = ${partnerId}
        ` as Array<Record<string, unknown>>

        if (partners.length === 0) {
          return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
        }

        const partner = partners[0]

        // Return partner data for n8n to sync to CRM, email marketing, etc.
        return NextResponse.json({
          success: true,
          action: 'sync_partner',
          partner: {
            id: partner.id,
            companyName: partner.company_name,
            email: partner.email,
            phone: partner.phone,
            status: partner.status,
            websiteUrl: partner.website_url,
            micrositeSlug: partner.microsite_slug,
            micrositeUrl: partner.microsite_slug ? `/p/${partner.microsite_slug}` : null,
            stats: {
              pageViews: partner.page_views || 0,
              leadSubmissions: partner.lead_submissions || 0,
              totalLeads: partner.total_leads || 0,
              convertedLeads: partner.converted_leads || 0
            },
            createdAt: partner.created_at,
            approvedAt: partner.approved_at
          }
        })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error('n8n webhook error:', error)
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/n8n/partner-automation
 *
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'partner-automation-webhook',
    actions: ['scrape_website', 'create_microsite', 'send_welcome_email', 'rescrape_all', 'sync_partner'],
    authenticated: true
  })
}
