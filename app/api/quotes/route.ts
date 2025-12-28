/**
 * Quotes API Route
 * GET /api/quotes - List quotes with filtering
 * POST /api/quotes - Create a new quote
 *
 * @module app/api/quotes
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql, query } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { withRateLimit } from '@/lib/rate-limit'
import { generateQuotePDF, generateQuoteFilename } from '@/lib/pdf/generator'
import {
  DEFAULT_COMPANY_INFO,
  DEFAULT_QUOTE_TERMS,
  DEFAULT_PDF_OPTIONS,
  calculateQuoteTotals,
  generateQuoteNumber,
  validateQuote,
} from '@/lib/pdf/types'
import type { Quote as DBQuote } from '@/lib/db'
import type { Quote, QuoteLineItem as PDFQuoteLineItem } from '@/lib/pdf/types'
import type {
  QuoteGenerationRequest,
  QuoteGenerationResponse,
  QuoteFilterOptions,
  QuoteListItem,
  QuoteStatistics,
} from '@/lib/types/quote'

export const dynamic = 'force-dynamic'

/**
 * GET /api/quotes
 * List user's quotes with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const searchParams = request.nextUrl.searchParams

    // Parse basic options
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const status = searchParams.get('status')

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as count FROM quotes
    `
    const totalCount = parseInt(countResult[0].count as string)

    // Fetch quotes - simplified query without dynamic filtering
    let quotes: QuoteListItem[]

    if (status && status !== 'all') {
      quotes = (await sql`
        SELECT
          id,
          quote_number as "quoteNumber",
          customer_name as "customerName",
          business_name as "businessName",
          customer_email as "customerEmail",
          status,
          total,
          issue_date as "issueDate",
          expiry_date as "expiryDate",
          sent_at as "sentAt",
          accepted_at as "acceptedAt",
          created_at as "createdAt"
        FROM quotes
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `) as QuoteListItem[]
    } else {
      quotes = (await sql`
        SELECT
          id,
          quote_number as "quoteNumber",
          customer_name as "customerName",
          business_name as "businessName",
          customer_email as "customerEmail",
          status,
          total,
          issue_date as "issueDate",
          expiry_date as "expiryDate",
          sent_at as "sentAt",
          accepted_at as "acceptedAt",
          created_at as "createdAt"
        FROM quotes
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `) as QuoteListItem[]
    }

    // Get statistics if requested
    const includeStats = searchParams.get('stats') === 'true'
    let statistics: QuoteStatistics | undefined

    if (includeStats) {
      const statsResult = await sql`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'draft') as draft,
          COUNT(*) FILTER (WHERE status = 'sent') as sent,
          COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
          COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
          COUNT(*) FILTER (WHERE status = 'expired') as expired,
          COALESCE(SUM(total), 0) as total_value,
          COALESCE(SUM(total) FILTER (WHERE status = 'accepted'), 0) as accepted_value,
          COALESCE(AVG(total), 0) as average_value
        FROM quotes
      `

      const stats = statsResult[0]
      const sentCount = parseInt(stats.sent as string)
      const acceptedCount = parseInt(stats.accepted as string)

      statistics = {
        total: parseInt(stats.total as string),
        byStatus: {
          draft: parseInt(stats.draft as string),
          sent: sentCount,
          accepted: acceptedCount,
          rejected: parseInt(stats.rejected as string),
          expired: parseInt(stats.expired as string),
        },
        totalValue: parseFloat(stats.total_value as string),
        acceptedValue: parseFloat(stats.accepted_value as string),
        averageValue: parseFloat(stats.average_value as string),
        conversionRate: sentCount > 0 ? (acceptedCount / sentCount) * 100 : 0,
        expiringSoon: 0,
      }
    }

    return NextResponse.json({
      quotes,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + quotes.length < totalCount,
      },
      statistics,
    })
  } catch (error) {
    console.error('[Quotes API] Error listing quotes:', error)
    return NextResponse.json(
      { error: 'Failed to list quotes' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/quotes
 * Create a new quote with PDF generation
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const rateLimitResponse = await withRateLimit(request, 'quote')
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { userId } = await auth()
    const body = await request.json() as QuoteGenerationRequest

    // Validate required fields
    if (!body.customer) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      )
    }

    if (!body.lineItems || body.lineItems.length === 0) {
      return NextResponse.json(
        { error: 'At least one line item is required' },
        { status: 400 }
      )
    }

    // Convert request line items to PDF line items
    const lineItems: PDFQuoteLineItem[] = body.lineItems.map((item) => ({
      id: crypto.randomUUID(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
    }))

    // Build quote object
    const taxRate = body.taxRate ?? 0
    const { subtotal, taxAmount, total } = calculateQuoteTotals(lineItems, taxRate)

    const now = new Date()
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const quoteNumber = generateQuoteNumber()

    const quote: Quote = {
      id: crypto.randomUUID(),
      metadata: {
        quoteNumber,
        issueDate: now,
        expiryDate,
        status: 'draft',
        version: 1,
      },
      customer: {
        name: body.customer.name,
        businessName: body.customer.businessName,
        email: body.customer.email,
        phone: body.customer.phone,
        address: body.customer.address,
      },
      company: DEFAULT_COMPANY_INFO,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      terms: DEFAULT_QUOTE_TERMS,
      createdAt: now,
      updatedAt: now,
    }

    // Validate quote
    const validation = validateQuote(quote)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid quote', details: validation.errors },
        { status: 400 }
      )
    }

    // Generate PDF
    const pdfOptions = {
      ...DEFAULT_PDF_OPTIONS,
      ...body.options,
    }

    const pdfResult = await generateQuotePDF(quote, pdfOptions)

    if (!pdfResult.success) {
      return NextResponse.json(
        { error: 'Failed to generate PDF', details: pdfResult.error },
        { status: 500 }
      )
    }

    // Save quote to database
    const [savedQuote] = await sql`
      INSERT INTO quotes (
        quote_number,
        customer_name,
        business_name,
        customer_email,
        customer_phone,
        customer_address,
        status,
        subtotal,
        tax_rate,
        tax_amount,
        total,
        issue_date,
        expiry_date,
        quote_data,
        pdf_url,
        user_id,
        onboarding_submission_id
      ) VALUES (
        ${quote.metadata.quoteNumber},
        ${quote.customer.name},
        ${quote.customer.businessName || null},
        ${quote.customer.email},
        ${quote.customer.phone || null},
        ${quote.customer.address ? JSON.stringify(quote.customer.address) : null},
        'draft',
        ${subtotal},
        ${taxRate},
        ${taxAmount},
        ${total},
        ${quote.metadata.issueDate},
        ${quote.metadata.expiryDate},
        ${JSON.stringify(quote)},
        ${pdfResult.pdfUrl || null},
        ${userId || null},
        ${body.onboardingSubmissionId || null}
      )
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
        ${savedQuote.id},
        'created',
        ${`Quote ${quote.metadata.quoteNumber} created`},
        ${userId || 'system'},
        ${JSON.stringify({
          lineItemCount: lineItems.length,
          total,
          hasOnboardingLink: !!body.onboardingSubmissionId,
        })}
      )
    `

    const response: QuoteGenerationResponse = {
      success: true,
      quote: {
        id: savedQuote.id,
        quoteNumber: quote.metadata.quoteNumber,
        status: 'draft',
        total,
        subtotal,
        taxAmount,
        issueDate: quote.metadata.issueDate,
        expiryDate: quote.metadata.expiryDate,
        customer: {
          name: quote.customer.name,
          businessName: quote.customer.businessName,
          email: quote.customer.email,
        },
      },
      pdf: {
        filename: generateQuoteFilename(quote),
        data: pdfResult.pdfBuffer?.toString('base64') || '',
        size: pdfResult.metadata?.fileSize || 0,
        pageCount: pdfResult.metadata?.pageCount || 1,
        downloadUrl: pdfResult.pdfUrl,
      },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('[Quotes API] Error creating quote:', error)
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}
