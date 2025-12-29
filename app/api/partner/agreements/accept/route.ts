import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { sql } from '@/lib/db'
import { acceptAgreement, hasSignedAllRequiredAgreements } from '@/lib/partner-onboarding'

/**
 * POST /api/partner/agreements/accept
 * Accept/sign an agreement
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agreementId, signatureText } = body

    if (!agreementId) {
      return NextResponse.json(
        { error: 'Agreement ID is required' },
        { status: 400 }
      )
    }

    // Get partner ID
    const partnerResult = await sql`
      SELECT id FROM partners WHERE user_id = ${userId}
    `

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const partnerId = partnerResult[0].id as string

    // Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || null
    const userAgent = headersList.get('user-agent') || null

    // Accept the agreement
    const acceptance = await acceptAgreement({
      partnerId,
      agreementId,
      userId,
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Unknown',
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      signatureText: signatureText || 'I have read and agree to the terms and conditions',
      ipAddress,
      userAgent,
    })

    // Check if all agreements are now signed
    const allSigned = await hasSignedAllRequiredAgreements(partnerId)

    return NextResponse.json({
      success: true,
      acceptance: {
        id: acceptance.id,
        agreementId: acceptance.agreementId,
        acceptedAt: acceptance.acceptedAt,
        ipAddress: acceptance.ipAddress,
      },
      allAgreementsSigned: allSigned,
      message: allSigned
        ? 'All agreements signed! You can now proceed to payment details.'
        : 'Agreement signed successfully.',
    })
  } catch (error) {
    console.error('Error accepting agreement:', error)
    return NextResponse.json(
      { error: 'Failed to accept agreement' },
      { status: 500 }
    )
  }
}
