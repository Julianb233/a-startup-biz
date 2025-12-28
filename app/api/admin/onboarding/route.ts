import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, withAuth } from '@/lib/api-auth'
import { getAllOnboardingSubmissions, updateOnboardingStatus } from '@/lib/db-queries'

export async function GET(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { submissions, total } = await getAllOnboardingSubmissions({
      status: status === 'all' ? undefined : status,
      limit,
      offset,
    })

    return NextResponse.json({
      submissions,
      total,
      limit,
      offset,
    })
  })
}

export async function PATCH(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    const body = await request.json()
    const { submissionId, status } = body

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: 'Missing submissionId or status' },
        { status: 400 }
      )
    }

    const updated = await updateOnboardingStatus(submissionId, status)

    if (!updated) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ submission: updated })
  })
}
