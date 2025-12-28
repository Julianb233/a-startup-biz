/**
 * Quote Retrieval API Route
 * GET /api/pdf/quotes/[id]
 * PUT /api/pdf/quotes/[id]
 * DELETE /api/pdf/quotes/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql, query } from '@/lib/db'
import { generateQuotePDF } from '@/lib/pdf/generator'
import type { Quote as DBQuote } from '@/lib/db'
import type { Quote, QuoteUpdateInput } from '@/lib/pdf/types'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * Get quote by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 })
    }

    // Fetch quote from database
    const [quote] = await query<DBQuote>`
      SELECT * FROM quotes
      WHERE id = ${id}
    `

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Check if regenerating PDF is requested
    const searchParams = request.nextUrl.searchParams
    const regenerate = searchParams.get('regenerate') === 'true'
    const download = searchParams.get('download') === 'true'

    if (regenerate || download) {
      // Regenerate PDF from stored quote data
      const quoteData = quote.quote_data as unknown as Quote
      const pdfResult = await generateQuotePDF(quoteData)

      if (!pdfResult.success) {
        return NextResponse.json(
          { error: 'Failed to generate PDF' },
          { status: 500 }
        )
      }

      if (download) {
        // Return PDF as downloadable file
        const headers = new Headers()
        headers.set('Content-Type', 'application/pdf')
        headers.set(
          'Content-Disposition',
          `attachment; filename="quote_${quote.quote_number}.pdf"`
        )

        return new NextResponse(pdfResult.pdfBuffer ? new Uint8Array(pdfResult.pdfBuffer) : null, {
          status: 200,
          headers,
        })
      }

      return NextResponse.json({
        quote: {
          ...quote,
          quote_data: quoteData,
        },
        pdf: {
          data: pdfResult.pdfBuffer?.toString('base64'),
          size: pdfResult.metadata?.fileSize,
          pageCount: pdfResult.metadata?.pageCount,
        },
      })
    }

    // Fetch line items
    const lineItems = await sql`
      SELECT * FROM quote_line_items
      WHERE quote_id = ${id}
      ORDER BY sort_order
    `

    // Fetch activities
    const activities = await sql`
      SELECT * FROM quote_activities
      WHERE quote_id = ${id}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return NextResponse.json({
      quote,
      lineItems,
      activities,
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
 * Update quote
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = (await request.json()) as QuoteUpdateInput

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 })
    }

    // Fetch existing quote
    const [existingQuote] = await query<DBQuote>`
      SELECT * FROM quotes
      WHERE id = ${id}
    `

    if (!existingQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Update fields
    const updates: Partial<DBQuote> = {}

    if (body.status) {
      updates.status = body.status

      // Update status timestamps
      if (body.status === 'sent' && !existingQuote.sent_at) {
        await sql`
          UPDATE quotes
          SET sent_at = NOW()
          WHERE id = ${id}
        `
      } else if (body.status === 'accepted' && !existingQuote.accepted_at) {
        await sql`
          UPDATE quotes
          SET accepted_at = NOW()
          WHERE id = ${id}
        `
      } else if (body.status === 'rejected' && !existingQuote.rejected_at) {
        await sql`
          UPDATE quotes
          SET rejected_at = NOW()
          WHERE id = ${id}
        `
      }
    }

    if (body.signatureUrl) {
      updates.pdf_url = body.signatureUrl
    }

    // Update quote data if provided
    if (body.customer || body.lineItems || body.terms) {
      const quoteData = existingQuote.quote_data as unknown as Quote

      if (body.customer) {
        quoteData.customer = { ...quoteData.customer, ...body.customer }
      }

      if (body.lineItems) {
        quoteData.lineItems = body.lineItems
        // Recalculate totals
        const subtotal = body.lineItems.reduce((sum, item) => sum + item.total, 0)
        const taxAmount = subtotal * (quoteData.taxRate / 100)
        const total = subtotal + taxAmount

        updates.subtotal = subtotal
        updates.tax_amount = taxAmount
        updates.total = total
      }

      if (body.terms) {
        quoteData.terms = { ...quoteData.terms, ...body.terms }
      }

      updates.quote_data = quoteData as any
    }

    // Build update query - update fields explicitly
    if (Object.keys(updates).length > 0) {
      const [updatedQuote] = await sql`
        UPDATE quotes
        SET
          status = COALESCE(${updates.status ?? null}, status),
          pdf_url = COALESCE(${updates.pdf_url ?? null}, pdf_url),
          quote_data = COALESCE(${updates.quote_data ? JSON.stringify(updates.quote_data) : null}::jsonb, quote_data),
          subtotal = COALESCE(${updates.subtotal ?? null}, subtotal),
          tax_amount = COALESCE(${updates.tax_amount ?? null}, tax_amount),
          total = COALESCE(${updates.total ?? null}, total),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      // Log activity
      await sql`
        INSERT INTO quote_activities (
          quote_id,
          activity_type,
          description,
          performed_by,
          metadata
        ) VALUES (
          ${id},
          'updated',
          ${`Quote updated: ${Object.keys(updates).join(', ')}`},
          'system',
          ${JSON.stringify({ changes: Object.keys(updates) })}
        )
      `

      return NextResponse.json({
        success: true,
        quote: updatedQuote,
      })
    }

    return NextResponse.json({
      success: true,
      quote: existingQuote,
    })
  } catch (error) {
    console.error('Error updating quote:', error)
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
 * Delete quote
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 })
    }

    // Check if quote exists
    const [existingQuote] = await query<DBQuote>`
      SELECT * FROM quotes
      WHERE id = ${id}
    `

    if (!existingQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Soft delete by updating status to expired
    await sql`
      UPDATE quotes
      SET status = 'expired'
      WHERE id = ${id}
    `

    // Log activity
    await sql`
      INSERT INTO quote_activities (
        quote_id,
        activity_type,
        description,
        performed_by,
        metadata
      ) VALUES (
        ${id},
        'deleted',
        'Quote deleted',
        'system',
        ${JSON.stringify({ deletedAt: new Date() })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
