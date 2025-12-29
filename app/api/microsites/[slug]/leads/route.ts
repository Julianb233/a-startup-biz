import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { sql } from '@/lib/db'
import { getMicrositeBySlug } from '@/lib/partner-onboarding'
import { sendLeadNotificationEmail } from '@/lib/partner-emails'
import type { DeviceType } from '@/lib/partner-onboarding/types'

interface RouteParams {
  params: Promise<{ slug: string }>
}

/**
 * POST /api/microsites/[slug]/leads
 * Submit a lead from a microsite form
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    const body = await request.json()

    // Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || null
    const userAgent = headersList.get('user-agent') || null

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get microsite
    const microsite = await getMicrositeBySlug(slug)
    if (!microsite || !microsite.isActive) {
      return NextResponse.json(
        { error: 'Microsite not found' },
        { status: 404 }
      )
    }

    // Detect device type
    const deviceType = detectDeviceType(userAgent)

    // Insert lead
    const result = await sql`
      INSERT INTO microsite_leads (
        microsite_id,
        partner_id,
        name,
        email,
        phone,
        company_name,
        message,
        service_interest,
        custom_fields,
        source_url,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        ip_address,
        user_agent,
        device_type
      ) VALUES (
        ${microsite.id},
        ${microsite.partnerId},
        ${body.name},
        ${body.email},
        ${body.phone || null},
        ${body.companyName || null},
        ${body.message || null},
        ${body.serviceInterest || null},
        ${JSON.stringify(body.customFields || {})},
        ${body.sourceUrl || null},
        ${body.referrer || null},
        ${body.utmSource || null},
        ${body.utmMedium || null},
        ${body.utmCampaign || null},
        ${ipAddress}::inet,
        ${userAgent},
        ${deviceType}
      )
      RETURNING id
    `

    const leadId = result[0].id

    // Send notification email to partner (don't await)
    sendLeadNotification(microsite.partnerId, microsite.companyName, body).catch(
      console.error
    )

    return NextResponse.json({
      success: true,
      leadId,
      message: microsite.successMessage || 'Thank you! We\'ll be in touch soon.',
    })
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    )
  }
}

/**
 * Detect device type from user agent
 */
function detectDeviceType(userAgent: string | null): DeviceType | null {
  if (!userAgent) return null

  const ua = userAgent.toLowerCase()

  if (/ipad|tablet|playbook|silk/.test(ua)) {
    return 'tablet'
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

/**
 * Send notification email to partner
 */
async function sendLeadNotification(
  partnerId: string,
  micrositeName: string,
  lead: { name: string; email: string; phone?: string }
): Promise<void> {
  try {
    // Get partner email
    const partnerResult = await sql`
      SELECT company_name, COALESCE(contact_email, email) as email
      FROM partners
      WHERE id = ${partnerId}
    `

    if (partnerResult.length === 0) return

    const partner = partnerResult[0]

    await sendLeadNotificationEmail({
      partnerId,
      partnerEmail: partner.email as string,
      partnerName: partner.company_name as string,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone || null,
      micrositeName,
    })
  } catch (error) {
    console.error('Error sending lead notification:', error)
  }
}
