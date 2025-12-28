/**
 * Onboarding to Quote Integration
 * Automatically generate quotes from onboarding submissions
 */

import { sql, query } from '@/lib/db'
import type { OnboardingSubmission } from '@/lib/db'
import type { QuoteCreateInput, QuoteLineItem, CustomerInfo } from './types'
import { generateQuotePDF } from './generator'
import { DEFAULT_COMPANY_INFO, DEFAULT_QUOTE_TERMS, generateQuoteNumber, calculateQuoteTotals } from './types'

/**
 * Service pricing based on business type and stage
 */
const SERVICE_PRICING: Record<string, { basePrice: number; services: Record<string, number> }> = {
  'tech-startup': {
    basePrice: 5000,
    services: {
      'brand-strategy': 3000,
      'web-development': 8000,
      'digital-marketing': 4000,
      'business-consulting': 6000,
      'content-creation': 2500,
    },
  },
  'ecommerce': {
    basePrice: 4000,
    services: {
      'brand-strategy': 2500,
      'web-development': 10000,
      'digital-marketing': 5000,
      'seo-optimization': 3000,
      'content-creation': 2000,
    },
  },
  'service-business': {
    basePrice: 3000,
    services: {
      'brand-strategy': 2000,
      'web-development': 5000,
      'digital-marketing': 3500,
      'local-seo': 2000,
      'content-creation': 1500,
    },
  },
  'default': {
    basePrice: 4000,
    services: {
      'brand-strategy': 2500,
      'web-development': 6000,
      'digital-marketing': 4000,
      'business-consulting': 5000,
      'content-creation': 2000,
    },
  },
}

/**
 * Stage multipliers
 */
const STAGE_MULTIPLIERS: Record<string, number> = {
  'idea': 0.8,
  'startup': 1.0,
  'growing': 1.2,
  'established': 1.5,
}

/**
 * Generate quote from onboarding submission
 */
export async function generateQuoteFromOnboarding(
  submissionId: string,
  options?: {
    includeDisclaimer?: boolean
    customServices?: Array<{ name: string; price: number }>
    taxRate?: number
  }
): Promise<{ success: boolean; quoteId?: string; error?: string }> {
  try {
    // Fetch onboarding submission
    const [submission] = await query<OnboardingSubmission>`
      SELECT * FROM onboarding_submissions
      WHERE id = ${submissionId}
    `

    if (!submission) {
      return { success: false, error: 'Onboarding submission not found' }
    }

    // Check if quote already exists
    const [existingQuote] = await sql`
      SELECT id FROM quotes
      WHERE onboarding_submission_id = ${submissionId}
    `

    if (existingQuote) {
      return {
        success: true,
        quoteId: existingQuote.id as string,
      }
    }

    // Map submission to customer info
    const customer: CustomerInfo = {
      name: submission.form_data?.contact_name || 'Contact',
      businessName: submission.business_name,
      email: submission.contact_email,
      phone: submission.contact_phone || undefined,
    }

    // Generate line items based on goals and business type
    const lineItems = generateLineItemsFromSubmission(submission, options?.customServices)

    // Apply stage multiplier
    const stageMultiplier = STAGE_MULTIPLIERS[submission.business_stage] || 1.0
    lineItems.forEach((item) => {
      item.unitPrice = Math.round(item.unitPrice * stageMultiplier)
      item.total = item.unitPrice * item.quantity
    })

    // Create quote input
    const quoteInput: QuoteCreateInput = {
      customer,
      lineItems,
      taxRate: options?.taxRate || 0,
      notes: options?.includeDisclaimer
        ? 'This quote is generated based on your onboarding submission. Final pricing may vary based on detailed requirements.'
        : undefined,
      onboardingSubmissionId: submissionId,
      terms: {
        ...DEFAULT_QUOTE_TERMS,
        notes: [
          ...(DEFAULT_QUOTE_TERMS.notes || []),
          'Pricing based on initial consultation and requirements',
          'Detailed scope document will be provided upon acceptance',
        ],
      },
    }

    // Calculate totals
    const totals = calculateQuoteTotals(
      lineItems,
      options?.taxRate || 0,
      undefined
    )

    // Generate quote number
    const quoteNumber = generateQuoteNumber()

    // Create quote object
    const issueDate = new Date()
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    const quote = {
      id: crypto.randomUUID(),
      metadata: {
        quoteNumber,
        issueDate,
        expiryDate,
        status: 'draft' as const,
        version: 1,
      },
      customer,
      company: DEFAULT_COMPANY_INFO,
      lineItems,
      subtotal: totals.subtotal,
      taxRate: options?.taxRate || 0,
      taxAmount: totals.taxAmount,
      total: totals.total,
      terms: {
        paymentTerms: quoteInput.terms?.paymentTerms ?? DEFAULT_QUOTE_TERMS.paymentTerms,
        deliveryTerms: quoteInput.terms?.deliveryTerms ?? DEFAULT_QUOTE_TERMS.deliveryTerms,
        validityPeriod: quoteInput.terms?.validityPeriod ?? DEFAULT_QUOTE_TERMS.validityPeriod,
        notes: quoteInput.terms?.notes ?? DEFAULT_QUOTE_TERMS.notes,
        conditions: quoteInput.terms?.conditions ?? DEFAULT_QUOTE_TERMS.conditions,
      },
      notes: quoteInput.notes,
      onboardingSubmissionId: submissionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Generate PDF
    const pdfResult = await generateQuotePDF(quote)

    if (!pdfResult.success) {
      return { success: false, error: 'Failed to generate PDF' }
    }

    // Store quote in database
    await sql`
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
        total,
        issue_date,
        expiry_date
      ) VALUES (
        ${quote.id},
        ${submission.user_id},
        ${submissionId},
        ${quoteNumber},
        ${customer.email},
        ${customer.name},
        ${customer.businessName},
        ${JSON.stringify(quote)},
        'draft',
        ${totals.subtotal},
        ${totals.taxAmount},
        ${totals.total},
        ${issueDate},
        ${expiryDate}
      )
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
          sort_order
        ) VALUES (
          ${quote.id},
          ${item.description},
          ${item.category || null},
          ${item.quantity},
          ${item.unitPrice},
          ${item.total},
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
        'Quote auto-generated from onboarding submission',
        'system',
        ${JSON.stringify({ onboardingSubmissionId: submissionId, source: 'onboarding' })}
      )
    `

    return { success: true, quoteId: quote.id }
  } catch (error) {
    console.error('Error generating quote from onboarding:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate line items from submission
 */
function generateLineItemsFromSubmission(
  submission: OnboardingSubmission,
  customServices?: Array<{ name: string; price: number }>
): QuoteLineItem[] {
  const lineItems: QuoteLineItem[] = []

  // Get pricing based on business type
  const pricing = SERVICE_PRICING[submission.business_type] || SERVICE_PRICING.default

  // If custom services provided, use those
  if (customServices && customServices.length > 0) {
    customServices.forEach((service) => {
      lineItems.push({
        id: crypto.randomUUID(),
        description: service.name,
        quantity: 1,
        unitPrice: service.price,
        total: service.price,
        category: 'custom',
      })
    })
    return lineItems
  }

  // Map goals to services
  const goalServiceMap: Record<string, string> = {
    'increase-sales': 'digital-marketing',
    'build-brand': 'brand-strategy',
    'online-presence': 'web-development',
    'customer-engagement': 'content-creation',
    'market-expansion': 'business-consulting',
    'improve-seo': 'seo-optimization',
  }

  // Add base consultation
  lineItems.push({
    id: crypto.randomUUID(),
    description: 'Initial Business Consultation & Strategy Session',
    quantity: 1,
    unitPrice: pricing.basePrice,
    total: pricing.basePrice,
    category: 'consultation',
    notes: 'Comprehensive analysis of your business needs and strategic planning',
  })

  // Add services based on goals
  submission.goals.forEach((goal) => {
    const serviceKey = goalServiceMap[goal]
    if (serviceKey && pricing.services[serviceKey]) {
      const serviceName = serviceKey
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      lineItems.push({
        id: crypto.randomUUID(),
        description: `${serviceName} Package`,
        quantity: 1,
        unitPrice: pricing.services[serviceKey],
        total: pricing.services[serviceKey],
        category: serviceKey,
        notes: `Tailored ${serviceName.toLowerCase()} solution for ${submission.business_name}`,
      })
    }
  })

  // Add timeline-based service
  if (submission.timeline === 'asap' || submission.timeline === '1-month') {
    lineItems.push({
      id: crypto.randomUUID(),
      description: 'Priority Service & Expedited Delivery',
      quantity: 1,
      unitPrice: 1500,
      total: 1500,
      category: 'priority',
      notes: 'Fast-track project timeline with dedicated resources',
    })
  }

  return lineItems
}

/**
 * Get quote for onboarding submission
 */
export async function getQuoteForOnboarding(
  submissionId: string
): Promise<{ success: boolean; quote?: any; error?: string }> {
  try {
    const [quote] = await sql`
      SELECT * FROM quotes
      WHERE onboarding_submission_id = ${submissionId}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (!quote) {
      return { success: false, error: 'No quote found for this submission' }
    }

    const lineItems = await sql`
      SELECT * FROM quote_line_items
      WHERE quote_id = ${quote.id}
      ORDER BY sort_order
    `

    return {
      success: true,
      quote: {
        ...quote,
        lineItems,
      },
    }
  } catch (error) {
    console.error('Error fetching quote for onboarding:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
