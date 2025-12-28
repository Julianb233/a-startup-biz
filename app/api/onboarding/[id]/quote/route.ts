/**
 * Generate Quote from Onboarding Submission
 * POST /api/onboarding/[id]/quote
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  generateQuoteFromOnboarding,
  getQuoteForOnboarding,
} from '@/lib/pdf/onboarding-integration'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * Get existing quote for onboarding submission
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    const result = await getQuoteForOnboarding(id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      quote: result.quote,
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Generate quote for onboarding submission
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { includeDisclaimer = true, customServices, taxRate = 0 } = body

    const result = await generateQuoteFromOnboarding(id, {
      includeDisclaimer,
      customServices,
      taxRate,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        quoteId: result.quoteId,
        message: 'Quote generated successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error generating quote from onboarding:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
