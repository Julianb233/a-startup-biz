/**
 * PDF Quote Generation Types
 * Comprehensive type definitions for quote generation system
 */

export interface QuoteLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  category?: string
  notes?: string
}

export interface CustomerInfo {
  name: string
  businessName: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

export interface CompanyInfo {
  name: string
  logo?: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  taxId?: string
  registrationNumber?: string
}

export interface QuoteTerms {
  paymentTerms: string
  deliveryTerms: string
  validityPeriod: string // e.g., "30 days"
  notes?: string[]
  conditions?: string[]
}

export interface QuoteMetadata {
  quoteNumber: string
  issueDate: Date
  expiryDate: Date
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  version: number
  revision?: string
}

export interface Quote {
  id: string
  metadata: QuoteMetadata
  customer: CustomerInfo
  company: CompanyInfo
  lineItems: QuoteLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    description: string
  }
  total: number
  terms: QuoteTerms
  notes?: string
  signatureUrl?: string
  onboardingSubmissionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface PDFGenerationOptions {
  includeWatermark?: boolean
  watermarkText?: string
  colorScheme?: {
    primary: string
    secondary: string
    accent: string
    text: string
  }
  locale?: string
  currency?: string
  format?: 'letter' | 'a4'
  orientation?: 'portrait' | 'landscape'
  compression?: boolean
  metadata?: {
    title?: string
    author?: string
    subject?: string
    keywords?: string[]
  }
}

export interface PDFGenerationResult {
  success: boolean
  pdfUrl?: string
  pdfBuffer?: Buffer
  error?: string
  metadata?: {
    fileSize: number
    pageCount: number
    generatedAt: Date
  }
}

export interface QuoteTemplate {
  id: string
  name: string
  description: string
  defaultTerms: QuoteTerms
  defaultOptions: PDFGenerationOptions
  isActive: boolean
}

export interface StoredQuote {
  id: string
  user_id: string | null
  onboarding_submission_id: string | null
  quote_number: string
  customer_email: string
  customer_name: string
  business_name: string
  quote_data: Quote
  pdf_url: string | null
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  subtotal: number
  tax_amount: number
  total: number
  issue_date: Date
  expiry_date: Date
  created_at: Date
  updated_at: Date
}

export interface QuoteCreateInput {
  customer: CustomerInfo
  lineItems: QuoteLineItem[]
  terms?: Partial<QuoteTerms>
  discount?: Quote['discount']
  taxRate?: number
  notes?: string
  onboardingSubmissionId?: string
  options?: PDFGenerationOptions
}

export interface QuoteUpdateInput extends Partial<QuoteCreateInput> {
  status?: Quote['metadata']['status']
  signatureUrl?: string
}

export interface QuoteFilterOptions {
  status?: Quote['metadata']['status'] | Quote['metadata']['status'][]
  customerEmail?: string
  dateRange?: {
    start: Date
    end: Date
  }
  minTotal?: number
  maxTotal?: number
  onboardingSubmissionId?: string
}

export interface QuoteSummary {
  id: string
  quoteNumber: string
  customerName: string
  businessName: string
  total: number
  status: Quote['metadata']['status']
  issueDate: Date
  expiryDate: Date
}

/**
 * Default company information for A Startup Biz
 */
export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'A Startup Biz',
  email: 'info@astartupbiz.com',
  phone: '(555) 123-4567',
  website: 'https://astartupbiz.com',
  address: {
    street: '123 Innovation Drive',
    city: 'Tech Valley',
    state: 'CA',
    zipCode: '94000',
    country: 'United States',
  },
}

/**
 * Default quote terms
 */
export const DEFAULT_QUOTE_TERMS: QuoteTerms = {
  paymentTerms: 'Payment due within 30 days of invoice date',
  deliveryTerms: 'Services to be delivered within agreed timeline',
  validityPeriod: '30 days',
  notes: [
    'This quote is valid for 30 days from the issue date',
    'Prices are subject to change after expiry',
    'A 50% deposit may be required to commence work',
  ],
  conditions: [
    'All work is subject to our standard terms and conditions',
    'Additional services may incur extra charges',
    'Client must provide necessary access and materials',
  ],
}

/**
 * Default PDF generation options
 */
export const DEFAULT_PDF_OPTIONS: PDFGenerationOptions = {
  colorScheme: {
    primary: '#ff6a1a', // A Startup Biz orange
    secondary: '#c0c0c0', // Silver
    accent: '#ea580c', // Darker orange
    text: '#000000', // Black
  },
  format: 'letter',
  orientation: 'portrait',
  compression: true,
  locale: 'en-US',
  currency: 'USD',
  metadata: {
    title: 'Professional Quote',
    author: 'A Startup Biz',
    subject: 'Service Quote',
  },
}

/**
 * Helper function to calculate quote totals
 */
export function calculateQuoteTotals(
  lineItems: QuoteLineItem[],
  taxRate: number = 0,
  discount?: Quote['discount']
): {
  subtotal: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  total: number
} {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)

  let discountAmount = 0
  if (discount) {
    discountAmount =
      discount.type === 'percentage'
        ? subtotal * (discount.value / 100)
        : discount.value
  }

  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (taxRate / 100)
  const total = taxableAmount + taxAmount

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  }
}

/**
 * Generate unique quote number
 */
export function generateQuoteNumber(prefix: string = 'QT'): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()

  return `${prefix}-${year}${month}${day}-${random}`
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Validate quote before generation
 */
export function validateQuote(quote: Partial<Quote>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!quote.customer?.email) {
    errors.push('Customer email is required')
  }

  if (!quote.customer?.name) {
    errors.push('Customer name is required')
  }

  if (!quote.lineItems || quote.lineItems.length === 0) {
    errors.push('At least one line item is required')
  }

  if (quote.lineItems) {
    quote.lineItems.forEach((item, index) => {
      if (!item.description) {
        errors.push(`Line item ${index + 1}: Description is required`)
      }
      if (item.quantity <= 0) {
        errors.push(`Line item ${index + 1}: Quantity must be greater than 0`)
      }
      if (item.unitPrice < 0) {
        errors.push(`Line item ${index + 1}: Unit price cannot be negative`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
