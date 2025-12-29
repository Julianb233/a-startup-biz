import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { sql } from '@/lib/db'
import { getAgreementsWithStatus, getSigningProgress } from '@/lib/partner-onboarding'

/**
 * GET /api/partner/agreements
 * Get all agreements with signing status for the current partner
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get partner ID from user
    const partnerResult = await sql`
      SELECT id, status, onboarding_step, agreements_completed
      FROM partners
      WHERE user_id = ${userId}
    `

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const partner = partnerResult[0]
    const partnerId = partner.id as string

    // Get agreements with status
    const agreements = await getAgreementsWithStatus(partnerId)

    // Get signing progress
    const progress = await getSigningProgress(partnerId)

    return NextResponse.json({
      agreements: agreements.map((a) => ({
        id: a.id,
        type: a.agreementType,
        title: a.title,
        version: a.version,
        content: a.content,
        summary: a.summary,
        isRequired: a.isRequired,
        isSigned: a.isSigned,
        signedAt: a.signedAt,
      })),
      progress: {
        total: progress.total,
        signed: progress.signed,
        remaining: progress.remaining,
        allSigned: progress.remaining === 0,
      },
      partner: {
        status: partner.status,
        onboardingStep: partner.onboarding_step,
        agreementsCompleted: partner.agreements_completed,
      },
    })
  } catch (error) {
    console.error('Error fetching agreements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agreements' },
      { status: 500 }
    )
  }
}
