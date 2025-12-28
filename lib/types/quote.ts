/**
 * Quote Type Definitions
 * Comprehensive types for the PDF quote generation system
 *
 * @module lib/types/quote
 */

// Re-export core types from PDF types for convenience
export type {
  Quote,
  QuoteLineItem,
  CustomerInfo,
  CompanyInfo,
  QuoteTerms,
  QuoteMetadata,
  PDFGenerationOptions,
  QuoteTemplate,
  StoredQuote,
} from '@/lib/pdf/types'

/**
 * Request payload for generating a quote
 */
export interface QuoteGenerationRequest {
  // Customer Information
  customer: {
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

  // Line Items
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    category?: string
    notes?: string
  }>

  // Financial Details
  taxRate?: number // Percentage (e.g., 8.5 for 8.5%)
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    description: string
  }

  // Quote Configuration
  terms?: {
    paymentTerms?: string
    deliveryTerms?: string
    validityPeriod?: string
    notes?: string[]
    conditions?: string[]
  }

  // Additional Info
  notes?: string
  onboardingSubmissionId?: string
  userId?: string

  // PDF Options
  options?: {
    includeWatermark?: boolean
    watermarkText?: string
    format?: 'letter' | 'a4'
    locale?: string
    currency?: string
  }
}

/**
 * Response from quote generation
 */
export interface QuoteGenerationResponse {
  success: boolean
  quote?: {
    id: string
    quoteNumber: string
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
    total: number
    subtotal: number
    taxAmount: number
    discountAmount?: number
    issueDate: Date
    expiryDate: Date
    customer: {
      name: string
      businessName: string
      email: string
    }
  }
  pdf?: {
    filename: string
    data: string // Base64 encoded PDF
    size: number
    pageCount: number
    downloadUrl?: string
  }
  error?: string
  details?: string | string[]
}

/**
 * Quote list item (summary view)
 */
export interface QuoteListItem {
  id: string
  quoteNumber: string
  customerName: string
  businessName: string
  customerEmail: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  total: number
  issueDate: Date
  expiryDate: Date
  sentAt?: Date | null
  acceptedAt?: Date | null
  createdAt: Date
}

/**
 * Quote detail view
 */
export interface QuoteDetail extends QuoteListItem {
  userId?: string | null
  onboardingSubmissionId?: string | null
  subtotal: number
  taxAmount: number
  discountAmount: number
  quoteData: Record<string, any>
  pdfUrl?: string | null
  pdfStoragePath?: string | null
  lineItems: Array<{
    id: string
    description: string
    category?: string
    quantity: number
    unitPrice: number
    total: number
    notes?: string
    sortOrder: number
  }>
  activities: Array<{
    id: string
    activityType: string
    description?: string
    performedBy?: string
    metadata?: Record<string, any>
    createdAt: Date
  }>
}

/**
 * Quote filter options
 */
export interface QuoteFilterOptions {
  userId?: string
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'all'
  customerEmail?: string
  dateFrom?: Date
  dateTo?: Date
  minTotal?: number
  maxTotal?: number
  onboardingSubmissionId?: string
  search?: string // Search in customer name, business name, or quote number
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'issue_date' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Quote statistics
 */
export interface QuoteStatistics {
  total: number
  byStatus: {
    draft: number
    sent: number
    accepted: number
    rejected: number
    expired: number
  }
  totalValue: number
  acceptedValue: number
  averageValue: number
  conversionRate: number // Percentage of sent quotes that were accepted
  expiringSoon: number // Quotes expiring within 7 days
}

/**
 * Quote update request
 */
export interface QuoteUpdateRequest {
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  customer?: Partial<QuoteGenerationRequest['customer']>
  lineItems?: QuoteGenerationRequest['lineItems']
  terms?: QuoteGenerationRequest['terms']
  notes?: string
  signatureUrl?: string
}

/**
 * Quote creation result
 */
export interface QuoteCreationResult {
  success: boolean
  quoteId?: string
  quoteNumber?: string
  error?: string
}

/**
 * PDF download options
 */
export interface PDFDownloadOptions {
  quoteId: string
  regenerate?: boolean // Force regenerate the PDF
  watermark?: string // Optional watermark text
  format?: 'base64' | 'buffer' | 'url'
}

/**
 * Bulk quote operations
 */
export interface BulkQuoteOperation {
  quoteIds: string[]
  operation: 'delete' | 'mark_sent' | 'mark_expired' | 'export'
  options?: Record<string, any>
}

/**
 * Quote template selection
 */
export interface QuoteTemplateSelection {
  templateId: 'standard' | 'consulting' | 'web-development' | 'custom'
  customTerms?: QuoteGenerationRequest['terms']
  customOptions?: QuoteGenerationRequest['options']
}

/**
 * Quote email options
 */
export interface QuoteEmailOptions {
  quoteId: string
  to: string
  cc?: string[]
  bcc?: string[]
  subject?: string
  message?: string
  attachPDF?: boolean
}

/**
 * Quote validation result
 */
export interface QuoteValidationResult {
  valid: boolean
  errors: Array<{
    field: string
    message: string
    code?: string
  }>
  warnings?: Array<{
    field: string
    message: string
  }>
}

/**
 * Type guard to check if object is a valid QuoteGenerationRequest
 */
export function isQuoteGenerationRequest(obj: any): obj is QuoteGenerationRequest {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.customer &&
    typeof obj.customer.name === 'string' &&
    typeof obj.customer.email === 'string' &&
    Array.isArray(obj.lineItems) &&
    obj.lineItems.length > 0
  )
}

/**
 * Type guard to check if a quote is expired
 */
export function isQuoteExpired(expiryDate: Date): boolean {
  return new Date() > new Date(expiryDate)
}

/**
 * Type guard to check if a quote is expiring soon (within days)
 */
export function isQuoteExpiringSoon(expiryDate: Date, days: number = 7): boolean {
  const daysUntilExpiry = Math.ceil(
    (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  return daysUntilExpiry > 0 && daysUntilExpiry <= days
}

/**
 * Calculate quote conversion rate
 */
export function calculateConversionRate(sent: number, accepted: number): number {
  if (sent === 0) return 0
  return Math.round((accepted / sent) * 100 * 100) / 100
}

/**
 * Generate quote summary text
 */
export function generateQuoteSummary(quote: QuoteListItem): string {
  return `Quote ${quote.quoteNumber} for ${quote.businessName} - ${formatCurrency(quote.total)} (${quote.status})`
}

/**
 * Format currency helper
 */
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
