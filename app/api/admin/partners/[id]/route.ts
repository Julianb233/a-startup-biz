import { NextRequest, NextResponse } from "next/server"
import { auth, checkRole } from "@/lib/auth"
import { getPartnerWithDetails, updatePartnerStatus, updatePartnerCommissionRate } from "@/lib/db-queries-partners"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = await checkRole("admin")
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { id } = await params
    const partner = await getPartnerWithDetails(id)

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json({ partner })
  } catch (error) {
    console.error("Error fetching partner:", error)
    return NextResponse.json(
      { error: "Failed to fetch partner" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = await checkRole("admin")
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, commissionRate, adminNote } = body

    let updatedPartner

    if (status) {
      updatedPartner = await updatePartnerStatus(id, status, adminNote)
    } else if (commissionRate !== undefined) {
      updatedPartner = await updatePartnerCommissionRate(id, commissionRate)
    } else {
      return NextResponse.json(
        { error: "No valid update fields provided" },
        { status: 400 }
      )
    }

    if (!updatedPartner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      partner: updatedPartner
    })
  } catch (error) {
    console.error("Error updating partner:", error)
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 }
    )
  }
}
