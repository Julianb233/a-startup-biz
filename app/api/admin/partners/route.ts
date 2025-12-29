import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { getAllPartners } from "@/lib/db-queries-partners"

export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || undefined
    const search = searchParams.get("search") || undefined
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    try {
      const { partners, total } = await getAllPartners({
        status,
        search,
        limit,
        offset
      })

      return NextResponse.json({
        partners,
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      })
    } catch (error) {
      console.error("Error fetching partners:", error)
      return NextResponse.json(
        { error: "Failed to fetch partners" },
        { status: 500 }
      )
    }
  })
}
