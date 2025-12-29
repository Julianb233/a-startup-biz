import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { getPartnerWithDetails, updatePartnerStatus, updatePartnerCommissionRate } from "@/lib/db-queries-partners"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    await requireAdmin()

    const { id } = await params
    const partner = await getPartnerWithDetails(id)

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json({ partner })
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    await requireAdmin()

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
  })
}
