import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import {
  getRevenueByDate,
  getOrdersByStatus,
  getPartnerPerformanceData,
  getLeadFunnelData,
  getUserAcquisitionData,
  getKeyMetrics,
  getServicePerformance,
} from '@/lib/db-queries'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '30d'

    // Convert range to days
    let days: number | undefined
    switch (range) {
      case '7d':
        days = 7
        break
      case '30d':
        days = 30
        break
      case '90d':
        days = 90
        break
      case 'all':
        days = undefined
        break
      default:
        days = 30
    }

    // Fetch all analytics data in parallel
    const [revenueData, ordersStatus, partnerPerformance, leadFunnel, userAcquisition, keyMetrics, servicePerformance] =
      await Promise.all([
        getRevenueByDate(days),
        getOrdersByStatus(days),
        getPartnerPerformanceData(days, 10),
        getLeadFunnelData(days),
        getUserAcquisitionData(days),
        getKeyMetrics(days),
        getServicePerformance(),
      ])

    return NextResponse.json({
      revenueData,
      ordersStatus,
      partnerPerformance,
      leadFunnel,
      userAcquisition,
      keyMetrics,
      servicePerformance,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}
