/**
 * Type Tests for PDF Quote System
 * Validates that all types are properly defined and compatible
 */

import { describe, it, expect } from 'vitest'
import {
  calculateQuoteTotals,
  generateQuoteNumber,
  formatCurrency,
  formatDate,
  validateQuote,
  DEFAULT_COMPANY_INFO,
  DEFAULT_QUOTE_TERMS,
  DEFAULT_PDF_OPTIONS,
  type Quote,
  type QuoteLineItem,
  type CustomerInfo,
} from '../types'

describe('PDF Quote Types', () => {
  describe('calculateQuoteTotals', () => {
    it('calculates totals correctly without tax or discount', () => {
      const lineItems: QuoteLineItem[] = [
        {
          id: '1',
          description: 'Service 1',
          quantity: 2,
          unitPrice: 100,
          total: 200,
        },
        {
          id: '2',
          description: 'Service 2',
          quantity: 1,
          unitPrice: 300,
          total: 300,
        },
      ]

      const result = calculateQuoteTotals(lineItems, 0)

      expect(result.subtotal).toBe(500)
      expect(result.taxAmount).toBe(0)
      expect(result.total).toBe(500)
      expect(result.discountAmount).toBe(0)
    })

    it('calculates totals with tax', () => {
      const lineItems: QuoteLineItem[] = [
        {
          id: '1',
          description: 'Service',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        },
      ]

      const result = calculateQuoteTotals(lineItems, 10)

      expect(result.subtotal).toBe(100)
      expect(result.taxAmount).toBe(10)
      expect(result.total).toBe(110)
    })

    it('calculates totals with percentage discount', () => {
      const lineItems: QuoteLineItem[] = [
        {
          id: '1',
          description: 'Service',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        },
      ]

      const discount = {
        type: 'percentage' as const,
        value: 10,
        description: '10% off',
      }

      const result = calculateQuoteTotals(lineItems, 0, discount)

      expect(result.subtotal).toBe(100)
      expect(result.discountAmount).toBe(10)
      expect(result.taxableAmount).toBe(90)
      expect(result.total).toBe(90)
    })

    it('calculates totals with fixed discount', () => {
      const lineItems: QuoteLineItem[] = [
        {
          id: '1',
          description: 'Service',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        },
      ]

      const discount = {
        type: 'fixed' as const,
        value: 25,
        description: '$25 off',
      }

      const result = calculateQuoteTotals(lineItems, 0, discount)

      expect(result.subtotal).toBe(100)
      expect(result.discountAmount).toBe(25)
      expect(result.taxableAmount).toBe(75)
      expect(result.total).toBe(75)
    })

    it('calculates totals with both tax and discount', () => {
      const lineItems: QuoteLineItem[] = [
        {
          id: '1',
          description: 'Service',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        },
      ]

      const discount = {
        type: 'percentage' as const,
        value: 10,
        description: '10% off',
      }

      const result = calculateQuoteTotals(lineItems, 10, discount)

      expect(result.subtotal).toBe(100)
      expect(result.discountAmount).toBe(10)
      expect(result.taxableAmount).toBe(90)
      expect(result.taxAmount).toBe(9)
      expect(result.total).toBe(99)
    })
  })

  describe('generateQuoteNumber', () => {
    it('generates unique quote number with default prefix', () => {
      const quoteNumber = generateQuoteNumber()
      expect(quoteNumber).toMatch(/^QT-\d{6}-[A-Z0-9]{4}$/)
    })

    it('generates unique quote number with custom prefix', () => {
      const quoteNumber = generateQuoteNumber('QUOTE')
      expect(quoteNumber).toMatch(/^QUOTE-\d{6}-[A-Z0-9]{4}$/)
    })

    it('generates different numbers on subsequent calls', () => {
      const num1 = generateQuoteNumber()
      const num2 = generateQuoteNumber()
      expect(num1).not.toBe(num2)
    })
  })

  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      const formatted = formatCurrency(1234.56, 'USD', 'en-US')
      expect(formatted).toBe('$1,234.56')
    })

    it('formats EUR currency correctly', () => {
      const formatted = formatCurrency(1234.56, 'EUR', 'en-US')
      expect(formatted).toMatch(/€1,234.56|1,234.56/)
    })

    it('handles zero amount', () => {
      const formatted = formatCurrency(0, 'USD', 'en-US')
      expect(formatted).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      // Use noon UTC to avoid timezone date shifts
      const date = new Date('2024-12-28T12:00:00Z')
      const formatted = formatDate(date, 'en-US')
      expect(formatted).toMatch(/December 28, 2024/)
    })
  })

  describe('validateQuote', () => {
    const validQuote: Partial<Quote> = {
      customer: {
        name: 'John Doe',
        businessName: 'Test Business',
        email: 'john@example.com',
      },
      lineItems: [
        {
          id: '1',
          description: 'Service',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        },
      ],
    }

    it('validates a valid quote', () => {
      const result = validateQuote(validQuote)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('invalidates quote without customer email', () => {
      const invalidQuote = {
        ...validQuote,
        customer: {
          ...validQuote.customer!,
          email: '',
        },
      }
      const result = validateQuote(invalidQuote)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer email is required')
    })

    it('invalidates quote without customer name', () => {
      const invalidQuote = {
        ...validQuote,
        customer: {
          ...validQuote.customer!,
          name: '',
        },
      }
      const result = validateQuote(invalidQuote)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer name is required')
    })

    it('invalidates quote without line items', () => {
      const invalidQuote = {
        ...validQuote,
        lineItems: [],
      }
      const result = validateQuote(invalidQuote)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('At least one line item is required')
    })

    it('invalidates line items without description', () => {
      const invalidQuote = {
        ...validQuote,
        lineItems: [
          {
            id: '1',
            description: '',
            quantity: 1,
            unitPrice: 100,
            total: 100,
          },
        ],
      }
      const result = validateQuote(invalidQuote)
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('Description is required'))).toBe(true)
    })

    it('invalidates line items with negative price', () => {
      const invalidQuote = {
        ...validQuote,
        lineItems: [
          {
            id: '1',
            description: 'Service',
            quantity: 1,
            unitPrice: -100,
            total: -100,
          },
        ],
      }
      const result = validateQuote(invalidQuote)
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('cannot be negative'))).toBe(true)
    })

    it('invalidates line items with zero quantity', () => {
      const invalidQuote = {
        ...validQuote,
        lineItems: [
          {
            id: '1',
            description: 'Service',
            quantity: 0,
            unitPrice: 100,
            total: 0,
          },
        ],
      }
      const result = validateQuote(invalidQuote)
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('greater than 0'))).toBe(true)
    })
  })

  describe('DEFAULT_COMPANY_INFO', () => {
    it('has required fields', () => {
      expect(DEFAULT_COMPANY_INFO.name).toBe('A Startup Biz')
      expect(DEFAULT_COMPANY_INFO.email).toBeTruthy()
      expect(DEFAULT_COMPANY_INFO.phone).toBeTruthy()
      expect(DEFAULT_COMPANY_INFO.website).toBeTruthy()
      expect(DEFAULT_COMPANY_INFO.address).toBeTruthy()
    })
  })

  describe('DEFAULT_QUOTE_TERMS', () => {
    it('has required fields', () => {
      expect(DEFAULT_QUOTE_TERMS.paymentTerms).toBeTruthy()
      expect(DEFAULT_QUOTE_TERMS.deliveryTerms).toBeTruthy()
      expect(DEFAULT_QUOTE_TERMS.validityPeriod).toBeTruthy()
    })
  })

  describe('DEFAULT_PDF_OPTIONS', () => {
    it('has A Startup Biz orange color scheme', () => {
      expect(DEFAULT_PDF_OPTIONS.colorScheme?.primary).toBe('#ff6a1a')
      expect(DEFAULT_PDF_OPTIONS.format).toBe('letter')
      expect(DEFAULT_PDF_OPTIONS.orientation).toBe('portrait')
      expect(DEFAULT_PDF_OPTIONS.compression).toBe(true)
    })
  })
})
