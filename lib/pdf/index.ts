/**
 * PDF Quote System - Main Exports
 */

// Type definitions
export type {
  Quote,
  QuoteLineItem,
  CustomerInfo,
  CompanyInfo,
  QuoteTerms,
  QuoteMetadata,
  PDFGenerationOptions,
  PDFGenerationResult,
  QuoteTemplate,
  StoredQuote,
  QuoteCreateInput,
  QuoteUpdateInput,
  QuoteFilterOptions,
  QuoteSummary,
} from './types'

// Constants
export {
  DEFAULT_COMPANY_INFO,
  DEFAULT_QUOTE_TERMS,
  DEFAULT_PDF_OPTIONS,
} from './types'

// Utility functions
export {
  calculateQuoteTotals,
  generateQuoteNumber,
  formatCurrency,
  formatDate,
  validateQuote,
} from './types'

// PDF generation
export {
  generateQuotePDF,
  savePDFToBuffer,
  generateQuoteFilename,
} from './generator'

// Onboarding integration
export {
  generateQuoteFromOnboarding,
  getQuoteForOnboarding,
} from './onboarding-integration'
