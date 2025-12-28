/**
 * Quote Generation Examples
 * Demonstrates various use cases for the PDF quote system
 *
 * @module lib/pdf/examples/quote-generation-examples
 */

import type { QuoteGenerationRequest } from '@/lib/types/quote'

/**
 * Example 1: Basic Quote
 * Simple quote with single line item
 */
export const basicQuoteExample: QuoteGenerationRequest = {
  customer: {
    name: 'John Smith',
    businessName: 'Smith Consulting LLC',
    email: 'john@smithconsulting.com',
    phone: '(555) 123-4567',
  },
  lineItems: [
    {
      description: 'Website Development - 5 page business website',
      quantity: 1,
      unitPrice: 3500.0,
      category: 'Web Development',
    },
  ],
  taxRate: 8.5, // 8.5% sales tax
}

/**
 * Example 2: Multi-Service Quote
 * Quote with multiple services and categories
 */
export const multiServiceQuoteExample: QuoteGenerationRequest = {
  customer: {
    name: 'Jane Doe',
    businessName: 'Acme Corporation',
    email: 'jane@acmecorp.com',
    phone: '(555) 987-6543',
    address: {
      street: '123 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
  },
  lineItems: [
    {
      description: 'Custom Website Development',
      quantity: 1,
      unitPrice: 5000.0,
      category: 'Web Development',
      notes: 'Includes responsive design and CMS',
    },
    {
      description: 'SEO Optimization Package',
      quantity: 3,
      unitPrice: 500.0,
      category: 'Digital Marketing',
      notes: 'Monthly service for 3 months',
    },
    {
      description: 'Logo Design',
      quantity: 1,
      unitPrice: 750.0,
      category: 'Branding',
    },
    {
      description: 'Social Media Setup',
      quantity: 1,
      unitPrice: 350.0,
      category: 'Digital Marketing',
      notes: 'Facebook, Instagram, LinkedIn',
    },
  ],
  taxRate: 9.25,
  discount: {
    type: 'percentage',
    value: 10,
    description: 'Bundle discount - 10% off total',
  },
  notes: 'Thank you for choosing A Startup Biz for your digital transformation needs!',
}

/**
 * Example 3: Consulting Services Quote
 * Professional services with hourly rates
 */
export const consultingQuoteExample: QuoteGenerationRequest = {
  customer: {
    name: 'Michael Johnson',
    businessName: 'Tech Innovations Inc',
    email: 'mjohnson@techinnovations.com',
    phone: '(555) 444-8888',
  },
  lineItems: [
    {
      description: 'Business Strategy Consulting',
      quantity: 20,
      unitPrice: 200.0,
      category: 'Consulting',
      notes: '20 hours @ $200/hour',
    },
    {
      description: 'Technical Architecture Review',
      quantity: 8,
      unitPrice: 250.0,
      category: 'Consulting',
      notes: '8 hours @ $250/hour',
    },
    {
      description: 'Implementation Support',
      quantity: 16,
      unitPrice: 175.0,
      category: 'Support',
      notes: '16 hours @ $175/hour',
    },
  ],
  taxRate: 0, // Professional services often tax-exempt
  terms: {
    paymentTerms: '50% deposit required to commence work, balance due within 30 days of completion',
    deliveryTerms: 'Services delivered according to agreed project timeline',
    validityPeriod: '30 days',
    notes: [
      'This quote is valid for 30 days from issue date',
      'Hourly rates are fixed for the duration of this engagement',
      'Any additional hours will be quoted separately',
    ],
  },
}

/**
 * Example 4: Product Bundle Quote
 * Fixed price packages with discount
 */
export const productBundleExample: QuoteGenerationRequest = {
  customer: {
    name: 'Sarah Williams',
    businessName: 'Williams & Associates',
    email: 'sarah@williamsassociates.com',
  },
  lineItems: [
    {
      description: 'Startup Essentials Package',
      quantity: 1,
      unitPrice: 2999.0,
      category: 'Package',
      notes: 'Includes logo, website, and business cards',
    },
    {
      description: 'Social Media Starter Kit',
      quantity: 1,
      unitPrice: 899.0,
      category: 'Package',
      notes: 'Profile setup + 1 month content creation',
    },
    {
      description: 'Additional Business Card Printing',
      quantity: 5,
      unitPrice: 50.0,
      category: 'Add-ons',
      notes: '500 cards per box',
    },
  ],
  taxRate: 7.5,
  discount: {
    type: 'fixed',
    value: 300.0,
    description: 'New customer discount',
  },
}

/**
 * Example 5: Custom Development Quote
 * Complex project with detailed breakdown
 */
export const customDevelopmentExample: QuoteGenerationRequest = {
  customer: {
    name: 'David Chen',
    businessName: 'FutureTech Solutions',
    email: 'dchen@futuretech.io',
    phone: '(555) 777-9999',
    address: {
      street: '456 Innovation Parkway',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
    },
  },
  lineItems: [
    {
      description: 'Project Discovery & Planning',
      quantity: 1,
      unitPrice: 1500.0,
      category: 'Planning',
      notes: 'Requirements gathering, wireframes, tech stack selection',
    },
    {
      description: 'UI/UX Design',
      quantity: 1,
      unitPrice: 3500.0,
      category: 'Design',
      notes: 'Complete design system and mockups',
    },
    {
      description: 'Frontend Development (React)',
      quantity: 1,
      unitPrice: 8000.0,
      category: 'Development',
      notes: 'Responsive web application',
    },
    {
      description: 'Backend Development (Node.js)',
      quantity: 1,
      unitPrice: 7000.0,
      category: 'Development',
      notes: 'REST API, authentication, database',
    },
    {
      description: 'Database Design & Setup',
      quantity: 1,
      unitPrice: 2000.0,
      category: 'Development',
      notes: 'PostgreSQL schema and migrations',
    },
    {
      description: 'Testing & QA',
      quantity: 1,
      unitPrice: 2500.0,
      category: 'Quality Assurance',
      notes: 'Unit tests, integration tests, UAT',
    },
    {
      description: 'Deployment & DevOps',
      quantity: 1,
      unitPrice: 1500.0,
      category: 'Operations',
      notes: 'CI/CD setup, cloud hosting configuration',
    },
    {
      description: 'Project Management',
      quantity: 1,
      unitPrice: 2000.0,
      category: 'Management',
      notes: 'Ongoing coordination and communication',
    },
  ],
  taxRate: 0,
  discount: {
    type: 'percentage',
    value: 5,
    description: 'Early commitment discount',
  },
  terms: {
    paymentTerms: 'Payment in 3 milestones: 33% upfront, 33% at midpoint, 34% on completion',
    deliveryTerms: 'Project timeline: 12-16 weeks from contract signing',
    validityPeriod: '45 days',
    notes: [
      'Timeline estimate based on current scope',
      'Scope changes may affect timeline and pricing',
      'Includes 30 days of post-launch support',
      'Source code and documentation included',
    ],
    conditions: [
      'Client must provide necessary access and materials',
      'Final payment due before production deployment',
      'Ongoing maintenance available under separate agreement',
    ],
  },
  notes: 'Excited to partner with FutureTech Solutions on this innovative project!',
}

/**
 * Example 6: Onboarding Integration Quote
 * Quote generated from onboarding submission
 */
export const onboardingIntegrationExample: QuoteGenerationRequest = {
  customer: {
    name: 'Emily Rodriguez',
    businessName: 'Rodriguez Retail Co',
    email: 'emily@rodriguezretail.com',
    phone: '(555) 222-3333',
  },
  lineItems: [
    {
      description: 'E-commerce Website Development',
      quantity: 1,
      unitPrice: 6500.0,
      category: 'Web Development',
      notes: 'Based on onboarding questionnaire responses',
    },
    {
      description: 'Product Photography & Editing',
      quantity: 50,
      unitPrice: 25.0,
      category: 'Content Creation',
      notes: '50 product photos',
    },
    {
      description: 'Payment Gateway Integration',
      quantity: 1,
      unitPrice: 500.0,
      category: 'Integration',
      notes: 'Stripe payment processing',
    },
    {
      description: 'Inventory Management Setup',
      quantity: 1,
      unitPrice: 750.0,
      category: 'Integration',
    },
  ],
  taxRate: 8.0,
  onboardingSubmissionId: 'onb-12345-abcde',
  options: {
    includeWatermark: false,
    format: 'letter',
    currency: 'USD',
    locale: 'en-US',
  },
}

/**
 * Example 7: Draft Quote with Watermark
 * Preliminary quote for review
 */
export const draftQuoteExample: QuoteGenerationRequest = {
  customer: {
    name: 'Robert Taylor',
    businessName: 'Taylor Enterprises',
    email: 'rtaylor@taylorenterprises.com',
  },
  lineItems: [
    {
      description: 'Mobile App Development (iOS & Android)',
      quantity: 1,
      unitPrice: 15000.0,
      category: 'App Development',
      notes: 'Estimated cost - subject to detailed requirements',
    },
    {
      description: 'App Store Submission & Optimization',
      quantity: 1,
      unitPrice: 1000.0,
      category: 'App Development',
    },
  ],
  taxRate: 0,
  options: {
    includeWatermark: true,
    watermarkText: 'DRAFT - FOR DISCUSSION ONLY',
  },
  notes: 'This is a preliminary estimate. Final pricing will be determined after requirements review.',
}

/**
 * Example Usage in API Route
 */
export async function exampleAPIUsage() {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(multiServiceQuoteExample),
  })

  if (!response.ok) {
    throw new Error('Failed to create quote')
  }

  const result = await response.json()

  // Download PDF
  if (result.pdf?.data) {
    const pdfBlob = base64ToBlob(result.pdf.data, 'application/pdf')
    downloadBlob(pdfBlob, result.pdf.filename)
  }

  return result
}

/**
 * Helper: Convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

/**
 * Helper: Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
