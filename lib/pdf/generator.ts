/**
 * PDF Quote Generator
 * Generates professional PDF quotes using jsPDF
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type {
  Quote,
  PDFGenerationOptions,
  PDFGenerationResult,
  DEFAULT_PDF_OPTIONS,
} from './types'
import { formatCurrency, formatDate } from './types'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Parameters<typeof autoTable>[1]) => jsPDF
    lastAutoTable?: {
      finalY: number
    }
  }
}

/**
 * Generate PDF from quote data
 */
export async function generateQuotePDF(
  quote: Quote,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  try {
    const opts = { ...getDefaultOptions(), ...options }
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
        keywords: opts.metadata.keywords?.join(', ') || 'quote, services',
      })
    }

    const colors = opts.colorScheme || getDefaultOptions().colorScheme!

    // Add content to PDF
    addHeader(doc, quote, colors)
    addCompanyInfo(doc, quote, colors)
    addCustomerInfo(doc, quote)
    addQuoteMetadata(doc, quote)
    addLineItems(doc, quote, opts)
    addTotals(doc, quote, opts)
    addTermsAndConditions(doc, quote)
    addFooter(doc, quote, colors)

    // Add watermark if requested
    if (opts.includeWatermark) {
      addWatermark(doc, opts.watermarkText || 'DRAFT')
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    const blob = doc.output('blob')

    return {
      success: true,
      pdfBuffer,
      pdfUrl: URL.createObjectURL(blob),
      metadata: {
        fileSize: pdfBuffer.length,
        pageCount: doc.getNumberOfPages(),
        generatedAt: new Date(),
      },
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Add header section
 */
function addHeader(doc: jsPDF, quote: Quote, colors: any) {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Company name/logo
  doc.setFillColor(colors.primary)
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text(quote.company.name, 15, 20)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('PROFESSIONAL QUOTE', 15, 28)

  doc.setTextColor(0, 0, 0)
}

/**
 * Add company information
 */
function addCompanyInfo(doc: jsPDF, quote: Quote, colors: any) {
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 45

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const companyInfo = [
    quote.company.address.street,
    `${quote.company.address.city}, ${quote.company.address.state} ${quote.company.address.zipCode}`,
    quote.company.phone,
    quote.company.email,
    quote.company.website,
  ]

  doc.setTextColor(100, 100, 100)
  companyInfo.forEach((line) => {
    doc.text(line, pageWidth - 15, y, { align: 'right' })
    y += 5
  })

  doc.setTextColor(0, 0, 0)
}

/**
 * Add customer information
 */
function addCustomerInfo(doc: jsPDF, quote: Quote) {
  let y = 75

  doc.setFillColor(245, 245, 245)
  doc.rect(15, y - 5, 85, 35, 'F')

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO:', 20, y)

  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  const customerInfo = [
    quote.customer.businessName || quote.customer.name,
    quote.customer.name !== quote.customer.businessName ? quote.customer.name : '',
    quote.customer.email,
    quote.customer.phone || '',
  ].filter(Boolean)

  customerInfo.forEach((line) => {
    doc.text(line, 20, y)
    y += 5
  })
}

/**
 * Add quote metadata (number, dates, etc.)
 */
function addQuoteMetadata(doc: jsPDF, quote: Quote) {
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 75

  doc.setFillColor(255, 106, 26) // Orange
  doc.rect(pageWidth - 80, y - 5, 65, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')

  const metadata = [
    ['Quote #:', quote.metadata.quoteNumber],
    ['Issue Date:', formatDate(quote.metadata.issueDate)],
    ['Valid Until:', formatDate(quote.metadata.expiryDate)],
  ]

  metadata.forEach(([label, value]) => {
    doc.text(label, pageWidth - 75, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, pageWidth - 75, y + 4)
    doc.setFont('helvetica', 'bold')
    y += 11
  })

  doc.setTextColor(0, 0, 0)
}

/**
 * Add line items table
 */
function addLineItems(doc: jsPDF, quote: Quote, opts: PDFGenerationOptions) {
  const startY = 120

  const tableData = quote.lineItems.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice, opts.currency, opts.locale),
    formatCurrency(item.total, opts.currency, opts.locale),
  ])

  doc.autoTable({
    startY,
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [255, 106, 26], // Orange
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 },
    },
    margin: { left: 15, right: 15 },
  })
}

/**
 * Add totals section
 */
function addTotals(doc: jsPDF, quote: Quote, opts: PDFGenerationOptions) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 160

  const totalsData: [string, string][] = [
    ['Subtotal:', formatCurrency(quote.subtotal, opts.currency, opts.locale)],
  ]

  if (quote.discount) {
    const discountLabel =
      quote.discount.type === 'percentage'
        ? `Discount (${quote.discount.value}%):`
        : 'Discount:'
    const discountAmount =
      quote.discount.type === 'percentage'
        ? quote.subtotal * (quote.discount.value / 100)
        : quote.discount.value
    totalsData.push([
      discountLabel,
      '-' + formatCurrency(discountAmount, opts.currency, opts.locale),
    ])
  }

  if (quote.taxAmount > 0) {
    totalsData.push([
      `Tax (${quote.taxRate}%):`,
      formatCurrency(quote.taxAmount, opts.currency, opts.locale),
    ])
  }

  let y = startY
  doc.setFontSize(10)

  totalsData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.text(label, pageWidth - 80, y)
    doc.text(value, pageWidth - 15, y, { align: 'right' })
    y += 7
  })

  // Total
  doc.setFillColor(255, 106, 26)
  doc.rect(pageWidth - 85, y - 3, 70, 10, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', pageWidth - 80, y + 4)
  doc.text(
    formatCurrency(quote.total, opts.currency, opts.locale),
    pageWidth - 15,
    y + 4,
    { align: 'right' }
  )

  doc.setTextColor(0, 0, 0)
}

/**
 * Add terms and conditions
 */
function addTermsAndConditions(doc: jsPDF, quote: Quote) {
  const pageHeight = doc.internal.pageSize.getHeight()
  const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 50 : 220

  if (startY > pageHeight - 80) {
    doc.addPage()
  }

  let y = startY > pageHeight - 80 ? 20 : startY

  doc.setFillColor(245, 245, 245)
  doc.rect(15, y - 5, 180, 60, 'F')

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('TERMS & CONDITIONS', 20, y)

  y += 8
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  const terms = [
    `Payment Terms: ${quote.terms.paymentTerms}`,
    `Delivery: ${quote.terms.deliveryTerms}`,
    `Valid For: ${quote.terms.validityPeriod}`,
  ]

  if (quote.terms.notes) {
    terms.push(...quote.terms.notes)
  }

  terms.forEach((term) => {
    const lines = doc.splitTextToSize(term, 170)
    lines.forEach((line: string) => {
      doc.text(line, 20, y)
      y += 4
    })
    y += 2
  })
}

/**
 * Add footer
 */
function addFooter(doc: jsPDF, quote: Quote, colors: any) {
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFillColor(colors.primary)
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text(
    `© ${new Date().getFullYear()} ${quote.company.name}. All rights reserved.`,
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center' }
  )

  doc.text(
    `${quote.company.website} | ${quote.company.email}`,
    pageWidth / 2,
    pageHeight - 7,
    { align: 'center' }
  )

  doc.setTextColor(0, 0, 0)
}

/**
 * Add watermark
 */
function addWatermark(doc: jsPDF, text: string) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.saveGraphicsState()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc.GState as any)({ opacity: 0.1 }))
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(60)
  doc.setFont('helvetica', 'bold')

  const x = pageWidth / 2
  const y = pageHeight / 2

  doc.text(text, x, y, {
    align: 'center',
    angle: 45,
  })

  doc.restoreGraphicsState()
}

/**
 * Get default PDF options
 */
function getDefaultOptions(): PDFGenerationOptions {
  return {
    colorScheme: {
      primary: '#ff6a1a',
      secondary: '#c0c0c0',
      accent: '#ea580c',
      text: '#000000',
    },
    format: 'letter',
    orientation: 'portrait',
    compression: true,
    locale: 'en-US',
    currency: 'USD',
  }
}

/**
 * Save PDF to file system (for server-side use)
 */
export function savePDFToBuffer(doc: jsPDF): Buffer {
  return Buffer.from(doc.output('arraybuffer'))
}

/**
 * Generate filename for quote
 */
export function generateQuoteFilename(quote: Quote): string {
  const sanitizedCustomer = quote.customer.businessName
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
  const date = new Date().toISOString().split('T')[0]
  return `quote_${quote.metadata.quoteNumber}_${sanitizedCustomer}_${date}.pdf`
}
