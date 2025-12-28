/**
 * Enhanced PDF Generator
 * Uses professional template for quote generation
 *
 * @module lib/pdf/pdf-generator
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Quote, PDFGenerationOptions, PDFGenerationResult } from './types'
import { formatCurrency, formatDate } from './types'
import {
  BRAND_COLORS,
  TEMPLATE_LAYOUT,
  addEnhancedHeader,
  addCompanyInfoBlock,
  addCustomerInfoBlock,
  addQuoteMetadataBox,
  addLineItemsTable,
  addTotalsSection,
  addTermsSection,
  addEnhancedFooter,
  addProfessionalWatermark,
} from './quote-template'

// Extend jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable
    lastAutoTable?: {
      finalY: number
    }
  }
}

/**
 * Default PDF options
 */
const DEFAULT_OPTIONS: PDFGenerationOptions = {
  colorScheme: BRAND_COLORS,
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
 * Generate professional PDF quote using enhanced template
 */
export async function generateProfessionalQuote(
  quote: Quote,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Initialize jsPDF
    const doc = new jsPDF({
      orientation: opts.orientation || 'portrait',
      unit: 'mm',
      format: opts.format || 'letter',
      compress: opts.compression !== false,
    })

    // Set PDF metadata
    if (opts.metadata) {
      doc.setProperties({
        title: opts.metadata.title || `Quote ${quote.metadata.quoteNumber}`,
        author: opts.metadata.author || quote.company.name,
        subject: opts.metadata.subject || 'Service Quote',
        keywords: opts.metadata.keywords?.join(', ') || 'quote, services, professional',
        creator: 'A Startup Biz Quote System',
      })
    }

    // Add content using professional template
    let currentY = TEMPLATE_LAYOUT.margins.top

    // 1. Enhanced Header
    addEnhancedHeader(doc, quote, opts)
    currentY = TEMPLATE_LAYOUT.header.height + 10

    // 2. Company and Customer Info (side by side)
    addCompanyInfoBlock(doc, quote, currentY)
    addCustomerInfoBlock(doc, quote, currentY + 5)
    currentY += 50

    // 3. Quote Metadata Box
    addQuoteMetadataBox(doc, quote, currentY - 45, opts)

    // 4. Line Items Table
    addLineItemsTable(doc, quote, currentY, opts)
    currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : currentY + 60

    // 5. Totals Section
    addTotalsSection(doc, quote, currentY, opts)
    currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : currentY + 40

    // 6. Terms and Conditions
    addTermsSection(doc, quote, currentY)

    // 7. Footer on all pages
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      addEnhancedFooter(doc, quote, i)
    }

    // 8. Add watermark if requested
    if (opts.includeWatermark) {
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        addProfessionalWatermark(doc, opts.watermarkText || 'DRAFT')
      }
    }

    // Generate PDF buffer and blob
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return {
      success: true,
      pdfBuffer,
      metadata: {
        fileSize: pdfBuffer.length,
        pageCount: doc.getNumberOfPages(),
        generatedAt: new Date(),
      },
    }
  } catch (error) {
    console.error('Error generating professional PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Generate quote filename
 */
export function generatePDFFilename(quote: Quote, format: 'pdf' | 'docx' = 'pdf'): string {
  const sanitizedCustomer = (quote.customer.businessName || quote.customer.name)
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
  const date = new Date().toISOString().split('T')[0]
  return `quote_${quote.metadata.quoteNumber}_${sanitizedCustomer}_${date}.${format}`
}

/**
 * Convert PDF buffer to base64 string
 */
export function pdfBufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64')
}

/**
 * Convert base64 string to PDF buffer
 */
export function base64ToPDFBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64')
}

/**
 * Get PDF file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate PDF generation prerequisites
 */
export function validatePDFGeneration(quote: Quote): {
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

  if (quote.total < 0) {
    errors.push('Quote total cannot be negative')
  }

  if (!quote.metadata?.quoteNumber) {
    errors.push('Quote number is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate PDF with retry logic for resilience
 */
export async function generatePDFWithRetry(
  quote: Quote,
  options: PDFGenerationOptions = {},
  maxRetries: number = 3
): Promise<PDFGenerationResult> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateProfessionalQuote(quote, options)

      if (result.success) {
        return result
      }

      lastError = new Error(result.error || 'PDF generation failed')
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100))
      }
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`,
  }
}

/**
 * Batch generate PDFs for multiple quotes
 */
export async function batchGeneratePDFs(
  quotes: Quote[],
  options: PDFGenerationOptions = {}
): Promise<Map<string, PDFGenerationResult>> {
  const results = new Map<string, PDFGenerationResult>()

  // Process in chunks to avoid memory issues
  const chunkSize = 5
  for (let i = 0; i < quotes.length; i += chunkSize) {
    const chunk = quotes.slice(i, i + chunkSize)

    const chunkResults = await Promise.all(
      chunk.map(async (quote) => {
        const result = await generateProfessionalQuote(quote, options)
        return { quoteId: quote.id, result }
      })
    )

    chunkResults.forEach(({ quoteId, result }) => {
      results.set(quoteId, result)
    })

    // Brief pause between chunks
    if (i + chunkSize < quotes.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return results
}

/**
 * Generate PDF preview (reduced quality for faster generation)
 */
export async function generatePDFPreview(
  quote: Quote,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  return generateProfessionalQuote(quote, {
    ...options,
    compression: false, // Faster without compression
    includeWatermark: true,
    watermarkText: 'PREVIEW',
  })
}

/**
 * Export functions for backward compatibility
 */
export {
  generateProfessionalQuote as generateQuotePDF,
  generatePDFFilename as generateQuoteFilename,
}
