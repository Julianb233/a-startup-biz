import { sql } from "./db"

// ============================================
// LEADERBOARD TYPES
// ============================================

export interface LeaderboardEntry {
  rank: number
  partner_id: string
  company_name: string
  total_leads: number
  converted_leads: number
  conversion_rate: number
  total_earnings: number
  tier: 'bronze' | 'silver' | 'gold'
  user_name?: string
  user_email?: string
}

// ============================================
// LEADERBOARD QUERIES
// ============================================

/**
 * Get partner tier based on total earnings
 */
function getPartnerTier(totalEarnings: number): 'bronze' | 'silver' | 'gold' {
  if (totalEarnings >= 5000) return 'gold'
  if (totalEarnings >= 1000) return 'silver'
  return 'bronze'
}

/**
 * Get partner leaderboard sorted by conversions or earnings
 */
export async function getPartnerLeaderboard(
  sortBy: 'conversions' | 'earnings' = 'conversions',
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  const orderByClause = sortBy === 'conversions'
    ? sql`converted_leads DESC, total_earnings DESC`
    : sql`total_earnings DESC, converted_leads DESC`

  const results = await sql`
    WITH partner_stats AS (
      SELECT
        p.id as partner_id,
        p.company_name,
        p.total_earnings,
        u.name as user_name,
        u.email as user_email,
        COUNT(pl.id) as total_leads,
        COUNT(pl.id) FILTER (WHERE pl.status = 'converted') as converted_leads,
        CASE
          WHEN COUNT(pl.id) > 0
          THEN ROUND(
            (COUNT(pl.id) FILTER (WHERE pl.status = 'converted')::DECIMAL / COUNT(pl.id)::DECIMAL) * 100,
            1
          )
          ELSE 0
        END as conversion_rate
      FROM partners p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN partner_leads pl ON p.id = pl.partner_id
      WHERE p.status = 'active'
      GROUP BY p.id, p.company_name, p.total_earnings, u.name, u.email
    )
    SELECT
      ROW_NUMBER() OVER (ORDER BY ${orderByClause}) as rank,
      partner_id,
      company_name,
      total_leads::int,
      converted_leads::int,
      conversion_rate::float,
      COALESCE(total_earnings, 0)::float as total_earnings,
      user_name,
      user_email
    FROM partner_stats
    WHERE total_leads > 0
    ORDER BY ${orderByClause}
    LIMIT ${limit}
  ` as unknown as any[]

  return results.map(r => ({
    rank: parseInt(r.rank),
    partner_id: r.partner_id,
    company_name: r.company_name,
    total_leads: parseInt(r.total_leads || '0'),
    converted_leads: parseInt(r.converted_leads || '0'),
    conversion_rate: parseFloat(r.conversion_rate || '0'),
    total_earnings: parseFloat(r.total_earnings || '0'),
    tier: getPartnerTier(parseFloat(r.total_earnings || '0')),
    user_name: r.user_name,
    user_email: r.user_email,
  }))
}

/**
 * Get partner's rank and position
 */
export async function getPartnerRank(
  partnerId: string,
  sortBy: 'conversions' | 'earnings' = 'conversions'
): Promise<{ rank: number; total: number } | null> {
  const orderByClause = sortBy === 'conversions'
    ? sql`converted_leads DESC, total_earnings DESC`
    : sql`total_earnings DESC, converted_leads DESC`

  const result = await sql`
    WITH partner_stats AS (
      SELECT
        p.id as partner_id,
        COUNT(pl.id) FILTER (WHERE pl.status = 'converted') as converted_leads,
        COALESCE(p.total_earnings, 0) as total_earnings
      FROM partners p
      LEFT JOIN partner_leads pl ON p.id = pl.partner_id
      WHERE p.status = 'active'
      GROUP BY p.id
      HAVING COUNT(pl.id) > 0
    ),
    ranked_partners AS (
      SELECT
        partner_id,
        ROW_NUMBER() OVER (ORDER BY ${orderByClause}) as rank
      FROM partner_stats
    )
    SELECT
      rp.rank,
      (SELECT COUNT(*) FROM ranked_partners) as total
    FROM ranked_partners rp
    WHERE rp.partner_id = ${partnerId}
  ` as unknown as any[]

  if (!result[0]) return null

  return {
    rank: parseInt(result[0].rank),
    total: parseInt(result[0].total),
  }
}

/**
 * Get top performers by month
 */
export async function getMonthlyTopPerformers(
  month: Date,
  limit: number = 5
): Promise<LeaderboardEntry[]> {
  const results = await sql`
    WITH monthly_stats AS (
      SELECT
        p.id as partner_id,
        p.company_name,
        p.total_earnings,
        u.name as user_name,
        u.email as user_email,
        COUNT(pl.id) as total_leads,
        COUNT(pl.id) FILTER (WHERE pl.status = 'converted') as converted_leads,
        COALESCE(SUM(pl.commission) FILTER (WHERE pl.status = 'converted'), 0) as month_earnings,
        CASE
          WHEN COUNT(pl.id) > 0
          THEN ROUND(
            (COUNT(pl.id) FILTER (WHERE pl.status = 'converted')::DECIMAL / COUNT(pl.id)::DECIMAL) * 100,
            1
          )
          ELSE 0
        END as conversion_rate
      FROM partners p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN partner_leads pl ON p.id = pl.partner_id
      WHERE p.status = 'active'
        AND DATE_TRUNC('month', pl.created_at) = DATE_TRUNC('month', ${month}::timestamp)
      GROUP BY p.id, p.company_name, p.total_earnings, u.name, u.email
    )
    SELECT
      ROW_NUMBER() OVER (ORDER BY month_earnings DESC, converted_leads DESC) as rank,
      partner_id,
      company_name,
      total_leads::int,
      converted_leads::int,
      conversion_rate::float,
      month_earnings::float as total_earnings,
      user_name,
      user_email
    FROM monthly_stats
    WHERE total_leads > 0
    ORDER BY month_earnings DESC, converted_leads DESC
    LIMIT ${limit}
  ` as unknown as any[]

  return results.map(r => ({
    rank: parseInt(r.rank),
    partner_id: r.partner_id,
    company_name: r.company_name,
    total_leads: parseInt(r.total_leads || '0'),
    converted_leads: parseInt(r.converted_leads || '0'),
    conversion_rate: parseFloat(r.conversion_rate || '0'),
    total_earnings: parseFloat(r.total_earnings || '0'),
    tier: getPartnerTier(parseFloat(r.total_earnings || '0')),
    user_name: r.user_name,
    user_email: r.user_email,
  }))
}
