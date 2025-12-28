/**
 * Quotes API Route
 * GET /api/quotes - List quotes with filtering
 * POST /api/quotes - Create a new quote
 *
 * @module app/api/quotes
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
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

    // Parse filter options
    const filters: QuoteFilterOptions = {
      userId: userId || undefined,
      status: (searchParams.get('status') as any) || 'all',
      customerEmail: searchParams.get('customerEmail') || undefined,
      search: searchParams.get('search') || undefined,
      minTotal: searchParams.get('minTotal') ? parseFloat(searchParams.get('minTotal')!) : undefined,
      maxTotal: searchParams.get('maxTotal') ? parseFloat(searchParams.get('maxTotal')!) : undefined,
      onboardingSubmissionId: searchParams.get('onboardingSubmissionId') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sortBy: (searchParams.get('sortBy') as any) || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    }

    // Get statistics flag
    const includeStats = searchParams.get('stats') === 'true'

    // Build WHERE clause
    const conditions: string[] = []
    const params: any[] = []

    if (filters.userId) {
      params.push(filters.userId)
      conditions.push(`user_id = $${params.length}`)
    }

    if (filters.status && filters.status !== 'all') {
      params.push(filters.status)
      conditions.push(`status = $${params.length}`)
    }

    if (filters.customerEmail) {
      params.push(filters.customerEmail)
      conditions.push(`customer_email = $${params.length}`)
    }

    if (filters.onboardingSubmissionId) {
      params.push(filters.onboardingSubmissionId)
      conditions.push(`onboarding_submission_id = $${params.length}`)
    }

    if (filters.search) {
      params.push(`%${filters.search}%`)
      conditions.push(
        `(customer_name ILIKE $${params.length} OR business_name ILIKE $${params.length} OR quote_number ILIKE $${params.length})`
      )
    }

    if (filters.minTotal !== undefined) {
      params.push(filters.minTotal)
      conditions.push(`total >= $${params.length}`)
    }

    if (filters.maxTotal !== undefined) {
      params.push(filters.maxTotal)
      conditions.push(`total <= $${params.length}`)
    }

    if (filters.dateFrom) {
      params.push(filters.dateFrom)
      conditions.push(`issue_date >= $${params.length}`)
    }

    if (filters.dateTo) {
      params.push(filters.dateTo)
      conditions.push(`issue_date <= $${params.length}`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as count
      FROM quotes
      ${sql.raw(whereClause)}
    `
    const totalCount = parseInt(countResult[0].count as string)

    // Build ORDER BY clause
    const sortColumn = filters.sortBy || 'created_at'
    const sortDirection = filters.sortOrder === 'asc' ? 'ASC' : 'DESC'
    const orderBy = `ORDER BY ${sortColumn} ${sortDirection}`

    // Fetch quotes
    const quotes = await sql<QuoteListItem[]>`
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
      ${sql.raw(whereClause)}
      ${sql.raw(orderBy)}
      LIMIT ${filters.limit || 50}
      OFFSET ${filters.offset || 0}
    `

    // Get statistics if requested
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
          COALESCE(AVG(total), 0) as average_value,
          COUNT(*) FILTER (WHERE expiry_date > NOW() AND expiry_date <= NOW() + INTERVAL '7 days') as expiring_soon
        FROM quotes
        ${sql.raw(whereClause)}
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
        conversionRate: sentCount > 0 ? Math.round((acceptedCount / sentCount) * 100 * 100) / 100 : 0,
        expiringSoon: parseInt(stats.expiring_soon as string),
      }
    }

    return NextResponse.json({
      success: true,
      quotes,
      pagination: {
        total: totalCount,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: (filters.offset || 0) + (filters.limit || 50) < totalCount,
      },
      statistics,
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch quotes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/quotes
 * Create a new quote and optionally generate PDF
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting - 20 requests per hour
  const rateLimitResponse = await withRateLimit(request, 'quote')
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const { userId } = await auth()
    const body = (await request.json()) as QuoteGenerationRequest

    // Validate required fields
    if (!body.customer || !body.lineItems || body.lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Customer information and at least one line item are required' },
        { status: 400 }
      )
    }

    // Calculate line item totals
    const lineItemsWithTotals: PDFQuoteLineItem[] = body.lineItems.map((item, index) => ({
      id: crypto.randomUUID(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      category: item.category,
      notes: item.notes,
    }))

    // Calculate totals
    const taxRate = body.taxRate || 0
    const totals = calculateQuoteTotals(lineItemsWithTotals, taxRate, body.discount)

    // Generate quote metadata
    const issueDate = new Date()
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30) // 30 days validity

    const quoteNumber = generateQuoteNumber('QT')

    // Build complete quote object
    const quote: Quote = {
      id: crypto.randomUUID(),
      metadata: {
        quoteNumber,
        issueDate,
        expiryDate,
        status: 'draft',
        version: 1,
      },
      customer: body.customer,
      company: DEFAULT_COMPANY_INFO,
      lineItems: lineItemsWithTotals,
      subtotal: totals.subtotal,
      taxRate,
      taxAmount: totals.taxAmount,
      discount: body.discount,
      total: totals.total,
      terms: {
        ...DEFAULT_QUOTE_TERMS,
        ...body.terms,
      },
      notes: body.notes,
      onboardingSubmissionId: body.onboardingSubmissionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Validate quote
    const validation = validateQuote(quote)
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid quote data',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    // Generate PDF
    const pdfResult = await generateQuotePDF(quote, {
      ...DEFAULT_PDF_OPTIONS,
      ...body.options,
    })

    if (!pdfResult.success) {
      return NextResponse.json(
        {
          error: 'Failed to generate PDF',
          details: pdfResult.error,
        },
        { status: 500 }
      )
    }

    // Store quote in database
    const [storedQuote] = await sql<DBQuote[]>`
      INSERT INTO quotes (
        id,
        user_id,
        onboarding_submission_id,
        quote_number,
        customer_email,
        customer_name,
        business_name,
        quote_data,
        status,
        subtotal,
        tax_amount,
        discount_amount,
        total,
        issue_date,
        expiry_date
      ) VALUES (
        ${quote.id},
        ${userId || null},
        ${body.onboardingSubmissionId || null},
        ${quoteNumber},
        ${body.customer.email},
        ${body.customer.name},
        ${body.customer.businessName},
        ${JSON.stringify(quote)},
        'draft',
        ${totals.subtotal},
        ${totals.taxAmount},
        ${totals.discountAmount},
        ${totals.total},
        ${issueDate},
        ${expiryDate}
      )
      RETURNING *
    `

    // Store line items
    for (let i = 0; i < lineItemsWithTotals.length; i++) {
      const item = lineItemsWithTotals[i]
      await sql`
        INSERT INTO quote_line_items (
          quote_id,
          description,
          category,
          quantity,
          unit_price,
          total,
          notes,
          sort_order
        ) VALUES (
          ${quote.id},
          ${item.description},
          ${item.category || null},
          ${item.quantity},
          ${item.unitPrice},
          ${item.total},
          ${item.notes || null},
          ${i}
        )
      `
    }

    // Log activity
    await sql`
      INSERT INTO quote_activities (
        quote_id,
        activity_type,
        description,
        performed_by,
        metadata
      ) VALUES (
        ${quote.id},
        'created',
        'Quote created via API',
        ${userId || 'system'},
        ${JSON.stringify({
          source: 'api',
          onboardingSubmissionId: body.onboardingSubmissionId,
          userId,
        })}
      )
    `

    // Prepare response
    const response: QuoteGenerationResponse = {
      success: true,
      quote: {
        id: storedQuote.id,
        quoteNumber,
        status: 'draft',
        total: totals.total,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        issueDate,
        expiryDate,
        customer: {
          name: body.customer.name,
          businessName: body.customer.businessName,
          email: body.customer.email,
        },
      },
      pdf: {
        filename: generateQuoteFilename(quote),
        data: pdfResult.pdfBuffer?.toString('base64') || '',
        size: pdfResult.metadata?.fileSize || 0,
        pageCount: pdfResult.metadata?.pageCount || 0,
      },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      {
        error: 'Failed to create quote',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
