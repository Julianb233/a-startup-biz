import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, getPartnerCommissions } from '@/lib/db-queries'

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
        { error: 'Partner account not active' },
        { status: 403 }
      )
    }

    // Get commission data
    const commissions = await getPartnerCommissions(partner.id)

    // Calculate next payout date (example: 1st of next month)
    const now = new Date()
    const nextPayoutDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return NextResponse.json({
      totalEarned: commissions.total_earned || 0,
      pendingCommission: commissions.pending_commission || 0,
      paidCommission: commissions.paid_commission || 0,
      thisMonthEarnings: commissions.this_month_earnings || 0,
      lastMonthEarnings: commissions.last_month_earnings || 0,
      averageCommission: commissions.average_commission || 0,
      payoutSchedule: 'Monthly',
      nextPayoutDate,
      commissionRate: partner.commission_rate,
    })
  } catch (error) {
    console.error('Error fetching partner commissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commission data' },
      { status: 500 }
    )
  }
}
