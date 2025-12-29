import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, withAuth } from '@/lib/api-auth'
import { getAllConsultations } from '@/lib/db-queries'

export async function GET(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { consultations, total } = await getAllConsultations({
      status: status === 'all' ? undefined : status,
      limit,
      offset,
    })

    return NextResponse.json({
      consultations,
      total,
      limit,
      offset,
    })
  })
}
