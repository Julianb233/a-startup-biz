import { NextRequest, NextResponse } from "next/server"
import { getServerAuth } from "@/lib/auth-unified"
import { getUserDashboardData } from "@/lib/db-queries"

export async function GET(request: NextRequest) {
  try {
    const { userId, isAuthenticated } = await getServerAuth()

    if (!isAuthenticated || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardData = await getUserDashboardData(userId)

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    // Return mock data if database query fails
    return NextResponse.json({
      orders: [],
      ordersWithProgress: [],
      consultations: [],
      documents: [],
      actionItems: [],
      onboarding: null,
      referralStats: {
        link: null,
        stats: { total: 0, signed_up: 0, converted: 0, paid: 0, total_earned: 0 }
      },
      stats: {
        activeOrders: 0,
        completedOrders: 0,
        pendingActions: 0,
        upcomingConsultations: 0,
        documentsReady: 0
      }
    })
  }
}
