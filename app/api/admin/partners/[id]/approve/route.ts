import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { requireAdmin } from '@/lib/api-auth'
import { approvePartner, canApprovePartner } from '@/lib/partner-onboarding'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/admin/partners/[id]/approve
 * Approve a pending partner application
 * This triggers the full onboarding workflow:
 * 1. Update partner status to active
 * 2. Scrape their website (if URL provided)
 * 3. Create their microsite
 * 4. Send welcome email with links
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin()
    const { userId } = await auth()
    const { id: partnerId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse optional options from body
    let options = {}
    try {
      const body = await request.json()
      options = {
        commissionRate: body.commissionRate,
        skipMicrosite: body.skipMicrosite,
        customSlug: body.customSlug,
        websiteUrl: body.websiteUrl,
      }
    } catch {
      // No body provided, use defaults
    }

    // Check if partner can be approved
    const canApprove = await canApprovePartner(partnerId)
    if (!canApprove.canApprove) {
      return NextResponse.json(
        { error: canApprove.reason || 'Partner cannot be approved' },
        { status: 400 }
      )
    }

    // Approve the partner
    const result = await approvePartner(partnerId, userId, options)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    // Trigger n8n automation workflow (fire and forget)
    if (process.env.N8N_HOST) {
      fetch(`${process.env.N8N_HOST}/webhook/partner-approved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          companyName: result.partner?.companyName,
          micrositeSlug: result.microsite?.slug,
          approvedBy: userId,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.log('n8n webhook failed (non-blocking):', err.message))
    }

    return NextResponse.json({
      success: true,
      partner: result.partner,
      microsite: result.microsite,
      emailSent: result.emailSent,
      message: result.message,
    })
  } catch (error) {
    console.error('Error approving partner:', error)
    return NextResponse.json(
      { error: 'Failed to approve partner' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/partners/[id]/approve
 * Check if a partner can be approved
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin()
    const { id: partnerId } = await params

    const result = await canApprovePartner(partnerId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error checking approval status:', error)
    return NextResponse.json(
      { error: 'Failed to check approval status' },
      { status: 500 }
    )
  }
}
