import { sql } from '@/lib/db'

export interface FunnelMetrics {
  visits: number
  leads: number
  qualified: number
  consultation: number
  customer: number
  conversionRates: {
    visitsToLeads: number
    leadsToQualified: number
    qualifiedToConsultation: number
    consultationToCustomer: number
    overall: number
  }
}

export interface FunnelStageData {
  stage: string
  count: number
  percentage: number
  dropOff: number
}

/**
 * Get conversion funnel metrics for a specific date range
 * @param startDate - Start date for the query
 * @param endDate - End date for the query
 * @returns Funnel metrics including counts and conversion rates
 */
export async function getFunnelMetrics(
  startDate: Date,
  endDate: Date
): Promise<FunnelMetrics> {
  try {
    // Count total visits (from onboarding submissions as proxy)
    const visitsResult = await sql`
      SELECT COUNT(*) as count
      FROM onboarding_submissions
      WHERE created_at >= ${startDate.toISOString()}
        AND created_at <= ${endDate.toISOString()}
    `
    const visits = Number(visitsResult[0]?.count || 0)

    // Count leads (submissions with status 'submitted')
    const leadsResult = await sql`
      SELECT COUNT(*) as count
      FROM onboarding_submissions
      WHERE created_at >= ${startDate.toISOString()}
        AND created_at <= ${endDate.toISOString()}
        AND status IN ('submitted', 'reviewed', 'in_progress', 'completed')
    `
    const leads = Number(leadsResult[0]?.count || 0)

    // Count qualified leads (submissions reviewed)
    const qualifiedResult = await sql`
      SELECT COUNT(*) as count
      FROM onboarding_submissions
      WHERE created_at >= ${startDate.toISOString()}
        AND created_at <= ${endDate.toISOString()}
        AND status IN ('reviewed', 'in_progress', 'completed')
    `
    const qualified = Number(qualifiedResult[0]?.count || 0)

    // Count consultations scheduled
    const consultationResult = await sql`
      SELECT COUNT(DISTINCT cb.user_id) as count
      FROM calendar_bookings cb
      INNER JOIN onboarding_submissions os ON cb.user_id = os.user_id::text
      WHERE cb.created_at >= ${startDate.toISOString()}
        AND cb.created_at <= ${endDate.toISOString()}
        AND cb.status IN ('confirmed', 'completed')
        AND os.created_at >= ${startDate.toISOString()}
    `
    const consultation = Number(consultationResult[0]?.count || 0)

    // Count customers (orders paid)
    const customerResult = await sql`
      SELECT COUNT(DISTINCT o.user_id) as count
      FROM orders o
      INNER JOIN onboarding_submissions os ON o.user_id = os.user_id
      WHERE o.created_at >= ${startDate.toISOString()}
        AND o.created_at <= ${endDate.toISOString()}
        AND o.status IN ('paid', 'completed')
        AND os.created_at >= ${startDate.toISOString()}
    `
    const customer = Number(customerResult[0]?.count || 0)

    // Calculate conversion rates
    const visitsToLeads = visits > 0 ? (leads / visits) * 100 : 0
    const leadsToQualified = leads > 0 ? (qualified / leads) * 100 : 0
    const qualifiedToConsultation = qualified > 0 ? (consultation / qualified) * 100 : 0
    const consultationToCustomer = consultation > 0 ? (customer / consultation) * 100 : 0
    const overall = visits > 0 ? (customer / visits) * 100 : 0

    return {
      visits,
      leads,
      qualified,
      consultation,
      customer,
      conversionRates: {
        visitsToLeads,
        leadsToQualified,
        qualifiedToConsultation,
        consultationToCustomer,
        overall,
      },
    }
  } catch (error) {
    console.error('Error fetching funnel metrics:', error)
    throw new Error('Failed to fetch funnel metrics')
  }
}

/**
 * Get detailed funnel stage data with drop-off analysis
 * @param startDate - Start date for the query
 * @param endDate - End date for the query
 * @returns Array of funnel stage data
 */
export async function getFunnelStageData(
  startDate: Date,
  endDate: Date
): Promise<FunnelStageData[]> {
  const metrics = await getFunnelMetrics(startDate, endDate)

  const stages = [
    { stage: 'visits', count: metrics.visits, label: 'Visits' },
    { stage: 'leads', count: metrics.leads, label: 'Leads' },
    { stage: 'qualified', count: metrics.qualified, label: 'Qualified' },
    { stage: 'consultation', count: metrics.consultation, label: 'Consultation' },
    { stage: 'customer', count: metrics.customer, label: 'Customer' },
  ]

  return stages.map((stage, index) => {
    const previousCount = index > 0 ? stages[index - 1].count : stage.count
    const percentage = previousCount > 0 ? (stage.count / previousCount) * 100 : 0
    const dropOff = previousCount - stage.count

    return {
      stage: stage.stage,
      count: stage.count,
      percentage,
      dropOff,
    }
  })
}

/**
 * Get funnel metrics grouped by source/channel
 * @param startDate - Start date for the query
 * @param endDate - End date for the query
 * @returns Funnel metrics grouped by source
 */
export async function getFunnelMetricsBySource(
  startDate: Date,
  endDate: Date
): Promise<Record<string, FunnelMetrics>> {
  try {
    // Get all unique sources
    const sourcesResult = await sql`
      SELECT DISTINCT COALESCE(source, 'direct') as source
      FROM onboarding_submissions
      WHERE created_at >= ${startDate.toISOString()}
        AND created_at <= ${endDate.toISOString()}
    `

    const sources = sourcesResult.map((row: any) => row.source)
    const metricsBySource: Record<string, FunnelMetrics> = {}

    // Get metrics for each source
    for (const source of sources) {
      const sourceMetrics = await getFunnelMetricsForSource(startDate, endDate, source)
      metricsBySource[source] = sourceMetrics
    }

    return metricsBySource
  } catch (error) {
    console.error('Error fetching funnel metrics by source:', error)
    throw new Error('Failed to fetch funnel metrics by source')
  }
}

/**
 * Helper function to get funnel metrics for a specific source
 */
async function getFunnelMetricsForSource(
  startDate: Date,
  endDate: Date,
  source: string
): Promise<FunnelMetrics> {
  const sourceCondition = source === 'direct' ? 'source IS NULL' : `source = '${source}'`

  const visitsResult = await sql`
    SELECT COUNT(*) as count
    FROM onboarding_submissions
    WHERE created_at >= ${startDate.toISOString()}
      AND created_at <= ${endDate.toISOString()}
      AND (${sourceCondition})
  `
  const visits = Number(visitsResult[0]?.count || 0)

  const leadsResult = await sql`
    SELECT COUNT(*) as count
    FROM onboarding_submissions
    WHERE created_at >= ${startDate.toISOString()}
      AND created_at <= ${endDate.toISOString()}
      AND (${sourceCondition})
      AND status IN ('submitted', 'reviewed', 'in_progress', 'completed')
  `
  const leads = Number(leadsResult[0]?.count || 0)

  const qualifiedResult = await sql`
    SELECT COUNT(*) as count
    FROM onboarding_submissions
    WHERE created_at >= ${startDate.toISOString()}
      AND created_at <= ${endDate.toISOString()}
      AND (${sourceCondition})
      AND status IN ('reviewed', 'in_progress', 'completed')
  `
  const qualified = Number(qualifiedResult[0]?.count || 0)

  const consultationResult = await sql`
    SELECT COUNT(DISTINCT cb.user_id) as count
    FROM calendar_bookings cb
    INNER JOIN onboarding_submissions os ON cb.user_id = os.user_id::text
    WHERE cb.created_at >= ${startDate.toISOString()}
      AND cb.created_at <= ${endDate.toISOString()}
      AND cb.status IN ('confirmed', 'completed')
      AND os.created_at >= ${startDate.toISOString()}
      AND (${sourceCondition})
  `
  const consultation = Number(consultationResult[0]?.count || 0)

  const customerResult = await sql`
    SELECT COUNT(DISTINCT o.user_id) as count
    FROM orders o
    INNER JOIN onboarding_submissions os ON o.user_id = os.user_id
    WHERE o.created_at >= ${startDate.toISOString()}
      AND o.created_at <= ${endDate.toISOString()}
      AND o.status IN ('paid', 'completed')
      AND os.created_at >= ${startDate.toISOString()}
      AND (${sourceCondition})
  `
  const customer = Number(customerResult[0]?.count || 0)

  const visitsToLeads = visits > 0 ? (leads / visits) * 100 : 0
  const leadsToQualified = leads > 0 ? (qualified / leads) * 100 : 0
  const qualifiedToConsultation = qualified > 0 ? (consultation / qualified) * 100 : 0
  const consultationToCustomer = consultation > 0 ? (customer / consultation) * 100 : 0
  const overall = visits > 0 ? (customer / visits) * 100 : 0

  return {
    visits,
    leads,
    qualified,
    consultation,
    customer,
    conversionRates: {
      visitsToLeads,
      leadsToQualified,
      qualifiedToConsultation,
      consultationToCustomer,
      overall,
    },
  }
}
