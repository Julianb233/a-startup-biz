import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { sql } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/partners/[id]
 * Get detailed partner information
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin()
    const { id } = await params

    const result = await sql`
      SELECT
        p.*,
        m.slug as microsite_slug,
        m.page_views as microsite_views,
        m.lead_submissions as microsite_leads,
        (SELECT COUNT(*) FROM partner_agreement_acceptances WHERE partner_id = p.id) as agreements_signed,
        (SELECT COUNT(*) FROM partner_agreements WHERE is_active = true AND is_required = true) as agreements_total,
        (SELECT COUNT(*) FROM partner_leads WHERE partner_id = p.id) as total_leads,
        (SELECT COUNT(*) FROM partner_leads WHERE partner_id = p.id AND status = 'converted') as converted_leads
      FROM partners p
      LEFT JOIN partner_microsites m ON p.microsite_id = m.id
      WHERE p.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const row = result[0]

    return NextResponse.json({
      partner: {
        id: row.id,
        userId: row.user_id,
        companyName: row.company_name,
        email: row.contact_email || row.email,
        phone: row.phone,
        websiteUrl: row.website_url,
        status: row.status,
        commissionRate: row.commission_rate,
        rank: row.rank,
        totalReferrals: row.total_referrals,
        totalEarnings: row.total_earnings,
        paidEarnings: row.paid_earnings,
        pendingEarnings: row.pending_earnings,
        availableBalance: row.available_balance,
        pendingBalance: row.pending_balance,
        onboardingStep: row.onboarding_step,
        agreementsCompleted: row.agreements_completed,
        agreementsCompletedAt: row.agreements_completed_at,
        paymentDetailsSubmitted: row.payment_details_submitted,
        welcomeEmailSent: row.welcome_email_sent,
        welcomeEmailSentAt: row.welcome_email_sent_at,
        approvedAt: row.approved_at,
        approvedBy: row.approved_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        // Microsite info
        micrositeSlug: row.microsite_slug,
        micrositeViews: row.microsite_views,
        micrositeLeads: row.microsite_leads,
        // Stats
        agreementsSigned: Number(row.agreements_signed),
        agreementsTotal: Number(row.agreements_total),
        totalLeads: Number(row.total_leads),
        convertedLeads: Number(row.converted_leads),
      },
    })
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partner' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/partners/[id]
 * Update partner details
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const allowedFields = [
      'company_name',
      'contact_email',
      'phone',
      'website_url',
      'status',
      'commission_rate',
      'rank',
    ]

    const updates: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(body)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      if (allowedFields.includes(snakeKey)) {
        updates.push(`${snakeKey} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    values.push(id)
    const query = `
      UPDATE partners
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql.query(query, values)

    if (result.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      partner: result[0],
    })
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    )
  }
}
