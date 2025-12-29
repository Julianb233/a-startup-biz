import { sql } from "./db"
import type { Partner } from "./db-queries"

// ============================================
// ADMIN PARTNER QUERIES
// ============================================

export interface PartnerWithStats extends Partner {
  stripe_account_id?: string
  stripe_payouts_enabled?: boolean
  stripe_charges_enabled?: boolean
  user_name?: string
  user_email?: string
  conversion_rate?: number
  active_leads?: number
  converted_leads?: number
}

/**
 * Get all partners with filters and pagination
 */
export async function getAllPartners(filters?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<{ partners: PartnerWithStats[], total: number }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let partners: PartnerWithStats[]
  let countResult: any[]

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`

    if (filters?.status) {
      partners = await sql`
        SELECT
          p.*,
          u.name as user_name,
          u.email as user_email,
          COUNT(DISTINCT pl.id) FILTER (WHERE pl.status IN ('pending', 'contacted', 'qualified')) as active_leads,
          COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted') as converted_leads,
          CASE
            WHEN COUNT(DISTINCT pl.id) > 0
            THEN ROUND(
              (COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted')::DECIMAL / COUNT(DISTINCT pl.id)::DECIMAL) * 100,
              2
            )
            ELSE 0
          END as conversion_rate
        FROM partners p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN partner_leads pl ON p.id = pl.partner_id
        WHERE (p.company_name ILIKE ${searchTerm} OR u.name ILIKE ${searchTerm} OR u.email ILIKE ${searchTerm})
          AND p.status = ${filters.status}
        GROUP BY p.id, u.name, u.email
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as unknown as PartnerWithStats[]

      countResult = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM partners p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE (p.company_name ILIKE ${searchTerm} OR u.name ILIKE ${searchTerm} OR u.email ILIKE ${searchTerm})
          AND p.status = ${filters.status}
      ` as unknown as any[]
    } else {
      partners = await sql`
        SELECT
          p.*,
          u.name as user_name,
          u.email as user_email,
          COUNT(DISTINCT pl.id) FILTER (WHERE pl.status IN ('pending', 'contacted', 'qualified')) as active_leads,
          COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted') as converted_leads,
          CASE
            WHEN COUNT(DISTINCT pl.id) > 0
            THEN ROUND(
              (COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted')::DECIMAL / COUNT(DISTINCT pl.id)::DECIMAL) * 100,
              2
            )
            ELSE 0
          END as conversion_rate
        FROM partners p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN partner_leads pl ON p.id = pl.partner_id
        WHERE (p.company_name ILIKE ${searchTerm} OR u.name ILIKE ${searchTerm} OR u.email ILIKE ${searchTerm})
        GROUP BY p.id, u.name, u.email
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as unknown as PartnerWithStats[]

      countResult = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM partners p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE (p.company_name ILIKE ${searchTerm} OR u.name ILIKE ${searchTerm} OR u.email ILIKE ${searchTerm})
      ` as unknown as any[]
    }
  } else if (filters?.status) {
    partners = await sql`
      SELECT
        p.*,
        u.name as user_name,
        u.email as user_email,
        COUNT(DISTINCT pl.id) FILTER (WHERE pl.status IN ('pending', 'contacted', 'qualified')) as active_leads,
        COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted') as converted_leads,
        CASE
          WHEN COUNT(DISTINCT pl.id) > 0
          THEN ROUND(
            (COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted')::DECIMAL / COUNT(DISTINCT pl.id)::DECIMAL) * 100,
            2
          )
          ELSE 0
        END as conversion_rate
      FROM partners p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN partner_leads pl ON p.id = pl.partner_id
      WHERE p.status = ${filters.status}
      GROUP BY p.id, u.name, u.email
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as PartnerWithStats[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM partners WHERE status = ${filters.status}
    ` as unknown as any[]
  } else {
    partners = await sql`
      SELECT
        p.*,
        u.name as user_name,
        u.email as user_email,
        COUNT(DISTINCT pl.id) FILTER (WHERE pl.status IN ('pending', 'contacted', 'qualified')) as active_leads,
        COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted') as converted_leads,
        CASE
          WHEN COUNT(DISTINCT pl.id) > 0
          THEN ROUND(
            (COUNT(DISTINCT pl.id) FILTER (WHERE pl.status = 'converted')::DECIMAL / COUNT(DISTINCT pl.id)::DECIMAL) * 100,
            2
          )
          ELSE 0
        END as conversion_rate
      FROM partners p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN partner_leads pl ON p.id = pl.partner_id
      GROUP BY p.id, u.name, u.email
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as PartnerWithStats[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM partners
    ` as unknown as any[]
  }

  return { partners, total: parseInt(countResult[0]?.count || '0') }
}

/**
 * Get single partner with detailed stats
 */
export async function getPartnerWithDetails(partnerId: string) {
  const partner = await sql`
    SELECT
      p.*,
      u.name as user_name,
      u.email as user_email,
      u.created_at as user_created_at
    FROM partners p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ${partnerId}
  ` as unknown as PartnerWithStats[]

  if (!partner[0]) return null

  // Get lead statistics
  const leadStats = await sql`
    SELECT
      COUNT(*) as total_leads,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
      COUNT(*) FILTER (WHERE status = 'qualified') as qualified,
      COUNT(*) FILTER (WHERE status = 'converted') as converted,
      COUNT(*) FILTER (WHERE status = 'lost') as lost,
      COALESCE(SUM(commission), 0) as total_commission,
      COALESCE(SUM(commission) FILTER (WHERE commission_paid), 0) as paid_commission,
      COALESCE(SUM(commission) FILTER (WHERE NOT commission_paid AND status = 'converted'), 0) as pending_commission
    FROM partner_leads
    WHERE partner_id = ${partnerId}
  ` as unknown as any[]

  // Get recent leads
  const recentLeads = await sql`
    SELECT * FROM partner_leads
    WHERE partner_id = ${partnerId}
    ORDER BY created_at DESC
    LIMIT 10
  ` as unknown as any[]

  // Get transfer history
  const transfers = await sql`
    SELECT * FROM partner_transfers
    WHERE partner_id = ${partnerId}
    ORDER BY created_at DESC
    LIMIT 20
  ` as unknown as any[]

  // Get payout history
  const payouts = await sql`
    SELECT * FROM partner_payouts
    WHERE partner_id = ${partnerId}
    ORDER BY created_at DESC
    LIMIT 20
  ` as unknown as any[]

  return {
    ...partner[0],
    stats: leadStats[0] || {},
    recentLeads: recentLeads || [],
    transfers: transfers || [],
    payouts: payouts || []
  }
}

/**
 * Update partner status (approve, reject, suspend)
 */
export async function updatePartnerStatus(
  partnerId: string,
  status: 'pending' | 'active' | 'suspended' | 'inactive',
  adminNote?: string
): Promise<Partner | null> {
  const result = await sql`
    UPDATE partners
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${partnerId}
    RETURNING *
  ` as unknown as Partner[]

  // Log the action
  if (adminNote) {
    await sql`
      INSERT INTO admin_notes (entity_type, entity_id, content)
      VALUES ('partner', ${partnerId}, ${adminNote})
    `
  }

  return result[0] || null
}

/**
 * Update partner commission rate
 */
export async function updatePartnerCommissionRate(
  partnerId: string,
  commissionRate: number
): Promise<Partner | null> {
  const result = await sql`
    UPDATE partners
    SET commission_rate = ${commissionRate}, updated_at = NOW()
    WHERE id = ${partnerId}
    RETURNING *
  ` as unknown as Partner[]
  return result[0] || null
}

/**
 * Get partner stats overview for admin dashboard
 */
export async function getPartnerStatsOverview() {
  const stats = await sql`
    SELECT
      COUNT(*) as total_partners,
      COUNT(*) FILTER (WHERE status = 'active') as active_partners,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_partners,
      COUNT(*) FILTER (WHERE status = 'suspended') as suspended_partners,
      COALESCE(SUM(total_earnings), 0) as total_earnings_all,
      COALESCE(SUM(pending_earnings), 0) as total_pending_earnings,
      COALESCE(SUM(paid_earnings), 0) as total_paid_earnings
    FROM partners
  ` as unknown as any[]

  const leadStats = await sql`
    SELECT
      COUNT(*) as total_leads,
      COUNT(*) FILTER (WHERE status = 'converted') as converted_leads,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as leads_this_month,
      COALESCE(SUM(commission) FILTER (WHERE status = 'converted'), 0) as total_commissions
    FROM partner_leads
  ` as unknown as any[]

  return {
    partners: stats[0] || {},
    leads: leadStats[0] || {}
  }
}
