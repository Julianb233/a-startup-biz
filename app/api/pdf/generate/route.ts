/**
 * PDF Quote Generation API Route
 * POST /api/pdf/generate
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { generateQuotePDF, generateQuoteFilename } from '@/lib/pdf/generator'
import { withRateLimit, addRateLimitHeaders } from '@/lib/rate-limit'
import type {
  Quote,
  QuoteCreateInput,
  QuoteLineItem as PDFQuoteLineItem,
} from '@/lib/pdf/types'
import {
  DEFAULT_COMPANY_INFO,
  DEFAULT_QUOTE_TERMS,
  DEFAULT_PDF_OPTIONS,
  calculateQuoteTotals,
  generateQuoteNumber,
  validateQuote,
} from '@/lib/pdf/types'

export const dynamic = 'force-dynamic'

/**
 * Generate PDF quote
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting - 10 requests per 10 minutes
  const rateLimitResponse = await withRateLimit(request, 'pdf')
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = (await request.json()) as QuoteCreateInput

    // Validate input
    const { customer, lineItems, taxRate = 0, discount, notes, onboardingSubmissionId, options } = body

    if (!customer || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Customer information and line items are required' },
        { status: 400 }
      )
    }

    // Calculate totals
    const totals = calculateQuoteTotals(lineItems, taxRate, discount)

    // Create quote metadata
    const issueDate = new Date()
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30) // 30 days validity

    const quoteNumber = generateQuoteNumber()

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
      customer,
      company: DEFAULT_COMPANY_INFO,
      lineItems,
      subtotal: totals.subtotal,
      taxRate,
      taxAmount: totals.taxAmount,
      discount,
      total: totals.total,
      terms: {
        ...DEFAULT_QUOTE_TERMS,
        ...body.terms,
      },
      notes,
      onboardingSubmissionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Validate quote
    const validation = validateQuote(quote)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid quote data', details: validation.errors },
        { status: 400 }
      )
    }

    // Generate PDF
    const pdfResult = await generateQuotePDF(quote, {
      ...DEFAULT_PDF_OPTIONS,
      ...options,
    })

    if (!pdfResult.success) {
      return NextResponse.json(
        { error: 'Failed to generate PDF', details: pdfResult.error },
        { status: 500 }
      )
    }

    // Store quote in database
    const [storedQuote] = await sql`
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
        ${null},
        ${onboardingSubmissionId || null},
        ${quoteNumber},
        ${customer.email},
        ${customer.name},
        ${customer.businessName},
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
    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i]
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
        'Quote created',
        'system',
        ${JSON.stringify({ source: 'api', onboardingSubmissionId })}
      )
    `

    // Return response with PDF data
    return NextResponse.json(
      {
        success: true,
        quote: {
          id: storedQuote.id,
          quoteNumber,
          status: 'draft',
          total: totals.total,
          issueDate,
          expiryDate,
        },
        pdf: {
          filename: generateQuoteFilename(quote),
          size: pdfResult.metadata?.fileSize,
          pageCount: pdfResult.metadata?.pageCount,
          // Return base64 encoded PDF for client-side download
          data: pdfResult.pdfBuffer?.toString('base64'),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error generating quote:', error)
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
 * Get quote generation templates
 */
export async function GET(request: NextRequest) {
  try {
    const templates = [
      {
        id: 'standard',
        name: 'Standard Quote',
        description: 'Standard business quote template',
        defaultTerms: DEFAULT_QUOTE_TERMS,
        defaultOptions: DEFAULT_PDF_OPTIONS,
      },
      {
        id: 'consulting',
        name: 'Consulting Services',
        description: 'Template for consulting and professional services',
        defaultTerms: {
          ...DEFAULT_QUOTE_TERMS,
          paymentTerms: '50% deposit required, balance due on completion',
          deliveryTerms: 'Services delivered according to project timeline',
        },
        defaultOptions: DEFAULT_PDF_OPTIONS,
      },
      {
        id: 'web-development',
        name: 'Web Development',
        description: 'Template for web development projects',
        defaultTerms: {
          ...DEFAULT_QUOTE_TERMS,
          paymentTerms: '33% deposit, 33% at milestone, 34% on completion',
          deliveryTerms: 'Delivered in phases according to project roadmap',
        },
        defaultOptions: DEFAULT_PDF_OPTIONS,
      },
    ]

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
