import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, withAuth } from '@/lib/api-auth'
import { getAllUsers } from '@/lib/db-queries'

export async function GET(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || undefined
    const role = searchParams.get('role') || undefined

    const { users, total, stats } = await getAllUsers({
      limit,
      offset,
      search,
      role: role === 'all' ? undefined : role,
    })

    return NextResponse.json({
      users,
      total,
      stats,
      limit,
      offset,
    })
  })
}
