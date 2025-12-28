import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, getPartnerStats } from '@/lib/db-queries'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get partner record
    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }

    // Check if partner is active
    if (partner.status !== 'active') {
      return NextResponse.json(
        {
          status: partner.status,
          message: partner.status === 'pending'
            ? 'Your partner application is pending approval'
            : 'Your partner account is not active'
        },
        { status: 403 }
      )
    }

    // Get comprehensive stats
    const stats = await getPartnerStats(partner.id)

    // Calculate conversion rate
    const totalLeads = stats.leads?.total || 0
    const convertedLeads = stats.leads?.converted || 0
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    return NextResponse.json({
      partner: {
        id: partner.id,
        companyName: partner.company_name,
        status: partner.status,
        commissionRate: partner.commission_rate,
        rank: partner.rank,
        memberSince: partner.created_at,
      },
      stats: {
        totalReferrals: totalLeads,
        pendingReferrals: stats.leads?.pending || 0,
        contactedReferrals: stats.leads?.contacted || 0,
        qualifiedReferrals: stats.leads?.qualified || 0,
        completedReferrals: convertedLeads,
        lostReferrals: stats.leads?.lost || 0,
        activeLeads: (stats.leads?.pending || 0) + (stats.leads?.contacted || 0) + (stats.leads?.qualified || 0),
        conversionRate,
        totalEarnings: stats.earnings?.total_commission || 0,
        pendingEarnings: stats.earnings?.pending_commission || 0,
        paidEarnings: stats.earnings?.paid_commission || 0,
        thisMonthEarnings: stats.earnings?.this_month_earnings || 0,
        lastMonthEarnings: stats.earnings?.last_month_earnings || 0,
      }
    })
  } catch (error) {
    console.error('Error fetching partner stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partner statistics' },
      { status: 500 }
    )
  }
}
