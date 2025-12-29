import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, getPartnerTransfers } from '@/lib/db-queries'
import type { TransfersResponse, TransferSummary } from '@/lib/types/stripe-connect'

/**
 * GET /api/partner/transfers
 *
 * Get partner's transfer history (commissions received)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner account not found' },
        { status: 404 }
      )
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get transfers from database
    const { transfers, total } = await getPartnerTransfers(partner.id, limit, offset)

    // Map to response format
    const transferSummaries: TransferSummary[] = transfers.map((t) => ({
      id: t.id,
      amount: Number(t.amount),
      currency: t.currency,
      status: t.status,
      sourceType: t.source_type,
      description: t.description,
      createdAt: t.created_at,
      processedAt: t.processed_at,
    }))

    const response: TransfersResponse = {
      transfers: transferSummaries,
      total,
      limit,
      offset,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error getting partner transfers:', error)
    return NextResponse.json(
      { error: 'Failed to get transfers' },
      { status: 500 }
    )
  }
}
