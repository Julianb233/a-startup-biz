import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, withAuth } from '@/lib/api-auth'
import { updateConsultation } from '@/lib/db-queries'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const { status, notes, scheduled_at } = body

    const updatedConsultation = await updateConsultation(id, {
      status,
      notes,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
    })

    if (!updatedConsultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ consultation: updatedConsultation })
  })
}
