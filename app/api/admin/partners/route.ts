import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { sql } from '@/lib/db'

/**
 * GET /api/admin/partners
 * Get all partners with filtering options
 */
export async function GET(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = `
      SELECT
        p.*,
        m.slug as microsite_slug,
        (SELECT COUNT(*) FROM partner_agreement_acceptances WHERE partner_id = p.id) as agreements_signed,
        (SELECT COUNT(*) FROM partner_agreements WHERE is_active = true AND is_required = true) as agreements_total
      FROM partners p
      LEFT JOIN partner_microsites m ON p.microsite_id = m.id
      WHERE 1=1
    `

    const params: unknown[] = []
    let paramIndex = 1

    if (status) {
      query += ` AND p.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (search) {
      query += ` AND (
        p.company_name ILIKE $${paramIndex}
        OR p.contact_email ILIKE $${paramIndex}
        OR p.email ILIKE $${paramIndex}
      )`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await sql.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM partners p
      WHERE 1=1
    `
    const countParams: unknown[] = []
    let countParamIndex = 1

    if (status) {
      countQuery += ` AND p.status = $${countParamIndex}`
      countParams.push(status)
      countParamIndex++
    }

    if (search) {
      countQuery += ` AND (
        p.company_name ILIKE $${countParamIndex}
        OR p.contact_email ILIKE $${countParamIndex}
        OR p.email ILIKE $${countParamIndex}
      )`
      countParams.push(`%${search}%`)
    }

    const countResult = await sql.query(countQuery, countParams)
    const total = Number(countResult[0]?.total || 0)

    const partners = result.map((row: Record<string, unknown>) => ({
      id: row.id,
      companyName: row.company_name,
      email: row.contact_email || row.email,
      phone: row.phone,
      websiteUrl: row.website_url,
      status: row.status,
      commissionRate: row.commission_rate,
      rank: row.rank,
      totalReferrals: row.total_referrals,
      totalEarnings: row.total_earnings,
      onboardingStep: row.onboarding_step,
      agreementsSigned: Number(row.agreements_signed),
      agreementsTotal: Number(row.agreements_total),
      micrositeSlug: row.microsite_slug,
      approvedAt: row.approved_at,
      createdAt: row.created_at,
    }))

    return NextResponse.json({
      partners,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}
