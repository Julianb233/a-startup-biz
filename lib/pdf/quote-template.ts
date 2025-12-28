/**
 * Professional Quote Template
 * Enhanced template design for A Startup Biz quotes
 *
 * @module lib/pdf/quote-template
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Quote, PDFGenerationOptions } from './types'
import { formatCurrency, formatDate } from './types'

// Extend jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Parameters<typeof autoTable>[1]) => jsPDF
    lastAutoTable?: {
      finalY: number
    }
  }
}

/**
 * Brand colors for A Startup Biz
 */
export const BRAND_COLORS = {
  primary: '#ff6a1a', // Orange
  primaryRGB: [255, 106, 26] as [number, number, number],
  accent: '#ea580c', // Darker orange
  accentRGB: [234, 88, 12] as [number, number, number],
  secondary: '#c0c0c0', // Silver
  secondaryRGB: [192, 192, 192] as [number, number, number],
  text: '#000000',
  textRGB: [0, 0, 0] as [number, number, number],
  lightGray: '#f5f5f5',
  lightGrayRGB: [245, 245, 245] as [number, number, number],
  darkGray: '#666666',
  darkGrayRGB: [102, 102, 102] as [number, number, number],
  white: '#ffffff',
  whiteRGB: [255, 255, 255] as [number, number, number],
}

/**
 * Template layout configuration
 */
export const TEMPLATE_LAYOUT = {
  margins: {
    top: 15,
    right: 15,
    bottom: 20,
    left: 15,
  },
  header: {
    height: 35,
    logoWidth: 40,
    logoHeight: 20,
  },
  sections: {
    spacing: 10,
    gap: 8,
  },
  footer: {
    height: 20,
  },
}

/**
 * Enhanced header with gradient background
 */
export function addEnhancedHeader(doc: jsPDF, quote: Quote, _options?: PDFGenerationOptions) {
  const pageWidth = doc.internal.pageSize.getWidth()
  // Always use brand colors for RGB values (colorScheme only has hex strings)
  const colors = BRAND_COLORS

  // Gradient background effect (simulated with multiple rectangles)
  const gradientSteps = 5
  const headerHeight = TEMPLATE_LAYOUT.header.height
  for (let i = 0; i < gradientSteps; i++) {
    const alpha = 1 - (i * 0.15)
    doc.setFillColor(colors.primaryRGB[0], colors.primaryRGB[1], colors.primaryRGB[2])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc.setGState(new (doc.GState as any)({ opacity: alpha }))
    doc.rect(0, (i * headerHeight) / gradientSteps, pageWidth, headerHeight / gradientSteps, 'F')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc.GState as any)({ opacity: 1 }))

  // Company name with shadow effect
  doc.setTextColor(BRAND_COLORS.whiteRGB[0], BRAND_COLORS.whiteRGB[1], BRAND_COLORS.whiteRGB[2])
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')

  // Shadow
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc.GState as any)({ opacity: 0.3 }))
  doc.text(quote.company.name, 15.5, 20.5)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc.GState as any)({ opacity: 1 }))

  // Main text
  doc.text(quote.company.name, 15, 20)

  // Subtitle
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('PROFESSIONAL QUOTE', 15, 28)

  // Reset colors
  doc.setTextColor(BRAND_COLORS.textRGB[0], BRAND_COLORS.textRGB[1], BRAND_COLORS.textRGB[2])
}

/**
 * Enhanced company information block
 */
export function addCompanyInfoBlock(doc: jsPDF, quote: Quote, startY: number) {
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = startY

  // Background box
  doc.setFillColor(BRAND_COLORS.lightGrayRGB[0], BRAND_COLORS.lightGrayRGB[1], BRAND_COLORS.lightGrayRGB[2])
  doc.roundedRect(pageWidth - 80, y - 5, 65, 40, 2, 2, 'F')

  // Border accent
  doc.setDrawColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.setLineWidth(0.5)
  doc.roundedRect(pageWidth - 80, y - 5, 65, 40, 2, 2, 'S')

  // Company info
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(BRAND_COLORS.darkGrayRGB[0], BRAND_COLORS.darkGrayRGB[1], BRAND_COLORS.darkGrayRGB[2])

  const companyInfo = [
    quote.company.address.street,
    `${quote.company.address.city}, ${quote.company.address.state} ${quote.company.address.zipCode}`,
    '',
    quote.company.phone,
    quote.company.email,
    quote.company.website,
  ]

  companyInfo.forEach((line) => {
    if (line) {
      doc.text(line, pageWidth - 75, y, { align: 'left', maxWidth: 55 })
      y += 4.5
    }
  })

  doc.setTextColor(BRAND_COLORS.textRGB[0], BRAND_COLORS.textRGB[1], BRAND_COLORS.textRGB[2])
}

/**
 * Enhanced customer information block with icon
 */
export function addCustomerInfoBlock(doc: jsPDF, quote: Quote, startY: number) {
  let y = startY

  // Background with gradient border
  doc.setFillColor(BRAND_COLORS.lightGrayRGB[0], BRAND_COLORS.lightGrayRGB[1], BRAND_COLORS.lightGrayRGB[2])
  doc.roundedRect(15, y - 5, 90, 38, 2, 2, 'F')

  // Left accent bar
  doc.setFillColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.rect(15, y - 5, 3, 38, 'F')

  // Header
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.text('BILL TO', 22, y)

  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(BRAND_COLORS.textRGB[0], BRAND_COLORS.textRGB[1], BRAND_COLORS.textRGB[2])

  // Customer details
  const customerInfo = [
    quote.customer.businessName || quote.customer.name,
    quote.customer.name !== quote.customer.businessName ? quote.customer.name : '',
    quote.customer.email,
    quote.customer.phone || '',
  ].filter(Boolean)

  customerInfo.forEach((line) => {
    doc.text(line, 22, y)
    y += 5
  })
}

/**
 * Enhanced quote metadata box
 */
export function addQuoteMetadataBox(doc: jsPDF, quote: Quote, startY: number, options?: PDFGenerationOptions) {
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = startY

  // Box with gradient background
  doc.setFillColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.roundedRect(pageWidth - 80, y - 5, 65, 38, 2, 2, 'F')

  // Inner shadow effect
  doc.setDrawColor(BRAND_COLORS.accentRGB[0], BRAND_COLORS.accentRGB[1], BRAND_COLORS.accentRGB[2])
  doc.setLineWidth(0.3)
  doc.roundedRect(pageWidth - 79, y - 4, 63, 36, 2, 2, 'S')

  doc.setTextColor(BRAND_COLORS.whiteRGB[0], BRAND_COLORS.whiteRGB[1], BRAND_COLORS.whiteRGB[2])
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')

  const metadata = [
    { label: 'Quote #', value: quote.metadata.quoteNumber },
    { label: 'Issue Date', value: formatDate(quote.metadata.issueDate, options?.locale) },
    { label: 'Valid Until', value: formatDate(quote.metadata.expiryDate, options?.locale) },
  ]

  metadata.forEach(({ label, value }) => {
    // Label
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(label, pageWidth - 75, y)

    // Value
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(value, pageWidth - 75, y + 4)

    y += 11
  })

  doc.setTextColor(BRAND_COLORS.textRGB[0], BRAND_COLORS.textRGB[1], BRAND_COLORS.textRGB[2])
}

/**
 * Enhanced line items table with alternating colors
 */
export function addLineItemsTable(doc: jsPDF, quote: Quote, startY: number, options?: PDFGenerationOptions) {
  const tableData = quote.lineItems.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice, options?.currency, options?.locale),
    formatCurrency(item.total, options?.currency, options?.locale),
  ])

  doc.autoTable({
    startY,
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: BRAND_COLORS.primaryRGB,
      textColor: BRAND_COLORS.whiteRGB,
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: BRAND_COLORS.lightGrayRGB,
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35, fontStyle: 'bold' },
    },
    margin: { left: TEMPLATE_LAYOUT.margins.left, right: TEMPLATE_LAYOUT.margins.right },
    didDrawCell: (data) => {
      // Add subtle border to cells
      if (data.row.section === 'body') {
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.1)
      }
    },
  })
}

/**
 * Enhanced totals section with visual hierarchy
 */
export function addTotalsSection(doc: jsPDF, quote: Quote, startY: number, options?: PDFGenerationOptions) {
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = startY

  // Background box
  doc.setFillColor(BRAND_COLORS.lightGrayRGB[0], BRAND_COLORS.lightGrayRGB[1], BRAND_COLORS.lightGrayRGB[2])
  doc.roundedRect(pageWidth - 90, y - 3, 75, 0, 2, 2) // Height will be calculated

  const totalsData: Array<{ label: string; value: string; bold?: boolean }> = [
    {
      label: 'Subtotal:',
      value: formatCurrency(quote.subtotal, options?.currency, options?.locale),
    },
  ]

  // Add discount if applicable
  if (quote.discount) {
    const discountLabel =
      quote.discount.type === 'percentage'
        ? `Discount (${quote.discount.value}%):`
        : 'Discount:'
    const discountAmount =
      quote.discount.type === 'percentage'
        ? quote.subtotal * (quote.discount.value / 100)
        : quote.discount.value

    totalsData.push({
      label: discountLabel,
      value: '-' + formatCurrency(discountAmount, options?.currency, options?.locale),
    })
  }

  // Add tax if applicable
  if (quote.taxAmount > 0) {
    totalsData.push({
      label: `Tax (${quote.taxRate}%):`,
      value: formatCurrency(quote.taxAmount, options?.currency, options?.locale),
    })
  }

  doc.setFontSize(10)

  // Draw subtotals
  totalsData.forEach(({ label, value }) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(BRAND_COLORS.darkGrayRGB[0], BRAND_COLORS.darkGrayRGB[1], BRAND_COLORS.darkGrayRGB[2])
    doc.text(label, pageWidth - 85, y)
    doc.text(value, pageWidth - 20, y, { align: 'right' })
    y += 7
  })

  // Total box with accent
  y += 3
  doc.setFillColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.roundedRect(pageWidth - 90, y - 5, 75, 12, 2, 2, 'F')

  // Accent border
  doc.setDrawColor(BRAND_COLORS.accentRGB[0], BRAND_COLORS.accentRGB[1], BRAND_COLORS.accentRGB[2])
  doc.setLineWidth(0.5)
  doc.roundedRect(pageWidth - 90, y - 5, 75, 12, 2, 2, 'S')

  // Total text
  doc.setTextColor(BRAND_COLORS.whiteRGB[0], BRAND_COLORS.whiteRGB[1], BRAND_COLORS.whiteRGB[2])
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', pageWidth - 85, y + 2)
  doc.text(
    formatCurrency(quote.total, options?.currency, options?.locale),
    pageWidth - 20,
    y + 2,
    { align: 'right' }
  )

  doc.setTextColor(BRAND_COLORS.textRGB[0], BRAND_COLORS.textRGB[1], BRAND_COLORS.textRGB[2])
}

/**
 * Enhanced terms and conditions section
 */
export function addTermsSection(doc: jsPDF, quote: Quote, startY: number) {
  const pageHeight = doc.internal.pageSize.getHeight()
  let y = startY

  // Check if we need a new page
  if (y > pageHeight - 70) {
    doc.addPage()
    y = TEMPLATE_LAYOUT.margins.top
  }

  // Section background
  doc.setFillColor(BRAND_COLORS.lightGrayRGB[0], BRAND_COLORS.lightGrayRGB[1], BRAND_COLORS.lightGrayRGB[2])
  doc.roundedRect(TEMPLATE_LAYOUT.margins.left, y - 5, 180, 0, 2, 2) // Height auto-calculated

  // Left accent bar
  doc.setFillColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.rect(TEMPLATE_LAYOUT.margins.left, y - 5, 3, 55, 'F')

  // Section header
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.text('TERMS & CONDITIONS', TEMPLATE_LAYOUT.margins.left + 8, y)

  y += 8
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(BRAND_COLORS.textRGB[0], BRAND_COLORS.textRGB[1], BRAND_COLORS.textRGB[2])

  // Payment and delivery terms
  const keyTerms = [
    { label: 'Payment Terms', value: quote.terms.paymentTerms },
    { label: 'Delivery Terms', value: quote.terms.deliveryTerms },
    { label: 'Valid For', value: quote.terms.validityPeriod },
  ]

  keyTerms.forEach(({ label, value }) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, TEMPLATE_LAYOUT.margins.left + 8, y)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(value, 160)
    lines.forEach((line: string) => {
      doc.text(line, TEMPLATE_LAYOUT.margins.left + 45, y)
      y += 4
    })
    y += 1
  })

  // Additional notes
  if (quote.terms.notes && quote.terms.notes.length > 0) {
    y += 3
    doc.setFont('helvetica', 'bold')
    doc.text('Important Notes:', TEMPLATE_LAYOUT.margins.left + 8, y)
    y += 4

    doc.setFont('helvetica', 'normal')
    quote.terms.notes.forEach((note) => {
      doc.text('•', TEMPLATE_LAYOUT.margins.left + 8, y)
      const lines = doc.splitTextToSize(note, 160)
      lines.forEach((line: string, index: number) => {
        doc.text(line, TEMPLATE_LAYOUT.margins.left + 13, y)
        y += 4
      })
    })
  }
}

/**
 * Enhanced footer with branding
 */
export function addEnhancedFooter(doc: jsPDF, quote: Quote, pageNumber?: number) {
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Footer background
  doc.setFillColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.rect(0, pageHeight - TEMPLATE_LAYOUT.footer.height, pageWidth, TEMPLATE_LAYOUT.footer.height, 'F')

  doc.setTextColor(BRAND_COLORS.whiteRGB[0], BRAND_COLORS.whiteRGB[1], BRAND_COLORS.whiteRGB[2])
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')

  // Copyright
  doc.text(
    `© ${new Date().getFullYear()} ${quote.company.name}. All rights reserved.`,
    pageWidth / 2,
    pageHeight - 13,
    { align: 'center' }
  )

  // Contact info
  doc.text(
    `${quote.company.website} | ${quote.company.email} | ${quote.company.phone}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  )

  // Page number
  if (pageNumber) {
    doc.setFontSize(7)
    doc.text(`Page ${pageNumber}`, pageWidth - 20, pageHeight - 10)
  }

  doc.setTextColor(BRAND_COLORS.textRGB[0], BRAND_COLORS.textRGB[1], BRAND_COLORS.textRGB[2])
}

/**
 * Add professional watermark
 */
export function addProfessionalWatermark(doc: jsPDF, text: string = 'DRAFT') {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.saveGraphicsState()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.setGState(new (doc.GState as any)({ opacity: 0.08 }))
  doc.setTextColor(BRAND_COLORS.primaryRGB[0], BRAND_COLORS.primaryRGB[1], BRAND_COLORS.primaryRGB[2])
  doc.setFontSize(70)
  doc.setFont('helvetica', 'bold')

  const x = pageWidth / 2
  const y = pageHeight / 2

  doc.text(text, x, y, {
    align: 'center',
    angle: 45,
  })

  doc.restoreGraphicsState()
}
