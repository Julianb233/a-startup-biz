import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, getPartnerStats, getPartnerLeads, getPartnerCommissions } from '@/lib/db-queries'

/**
 * GET /api/partner/dashboard
 *
 * Retrieves comprehensive partner dashboard data including:
 * - Partner profile information
 * - Lead statistics and conversion metrics
 * - Commission and earnings data
 * - Recent activity
 *
 * @returns {Object} Dashboard data with partner info, stats, recent leads, and earnings
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    // Get partner record
    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        {
          error: 'Partner account not found',
          message: 'No partner account is associated with this user. Please apply to become a partner first.'
        },
        { status: 404 }
      )
    }

    // Check partner status
    if (partner.status !== 'active') {
      return NextResponse.json(
        {
          partner: {
            id: partner.id,
            status: partner.status,
            companyName: partner.company_name,
          },
          message: partner.status === 'pending'
            ? 'Your partner application is pending approval. You will receive an email once approved.'
            : partner.status === 'suspended'
            ? 'Your partner account has been suspended. Please contact support for more information.'
            : 'Your partner account is not active. Please contact support.',
          canAccessDashboard: false,
        },
        { status: 403 }
      )
    }

    // Fetch all dashboard data in parallel for optimal performance
    const [stats, recentLeads, commissions] = await Promise.all([
      getPartnerStats(partner.id),
      getPartnerLeads(partner.id, { limit: 10, offset: 0 }),
      getPartnerCommissions(partner.id),
    ])

    // Calculate conversion rate and other metrics
    const totalLeads = stats.leads?.total || 0
    const convertedLeads = stats.leads?.converted || 0
    const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(2)) : 0

    const activeLeadsCount =
      (stats.leads?.pending || 0) +
      (stats.leads?.contacted || 0) +
      (stats.leads?.qualified || 0)

    // Calculate growth metrics (comparing this month vs last month)
    const thisMonthEarnings = Number(commissions.this_month_earnings) || 0
    const lastMonthEarnings = Number(commissions.last_month_earnings) || 0
    const earningsGrowth = lastMonthEarnings > 0
      ? Number((((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100).toFixed(2))
      : thisMonthEarnings > 0 ? 100 : 0

    // Next payout calculation (first day of next month)
    const now = new Date()
    const nextPayoutDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Format recent leads for frontend
    const formattedRecentLeads = recentLeads.leads.map(lead => ({
      id: lead.id,
      clientName: lead.client_name,
      clientEmail: lead.client_email,
      service: lead.service,
      status: lead.status,
      commission: Number(lead.commission),
      createdAt: lead.created_at,
      convertedAt: lead.converted_at,
    }))

    return NextResponse.json({
      partner: {
        id: partner.id,
        userId: partner.user_id,
        companyName: partner.company_name,
        status: partner.status,
        commissionRate: Number(partner.commission_rate),
        rank: partner.rank || 'Bronze',
        totalReferrals: Number(partner.total_referrals) || 0,
        totalEarnings: Number(partner.total_earnings) || 0,
        memberSince: partner.created_at,
      },
      stats: {
        // Lead metrics
        totalLeads,
        activeLeads: activeLeadsCount,
        pendingLeads: stats.leads?.pending || 0,
        contactedLeads: stats.leads?.contacted || 0,
        qualifiedLeads: stats.leads?.qualified || 0,
        convertedLeads,
        lostLeads: stats.leads?.lost || 0,
        conversionRate,

        // Financial metrics
        totalEarnings: Number(commissions.total_earned) || 0,
        pendingCommission: Number(commissions.pending_commission) || 0,
        paidCommission: Number(commissions.paid_commission) || 0,
        thisMonthEarnings,
        lastMonthEarnings,
        earningsGrowth,
        averageCommission: Number(commissions.average_commission) || 0,

        // Payout information
        nextPayoutDate,
        payoutSchedule: 'Monthly',
      },
      recentLeads: formattedRecentLeads,
      canAccessDashboard: true,
    })
  } catch (error) {
    console.error('Error fetching partner dashboard:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch partner dashboard data',
        message: 'An unexpected error occurred while loading your dashboard. Please try again later.'
      },
      { status: 500 }
    )
  }
}
