/**
 * Quote Generator Example Component
 * Demonstrates how to use the PDF quote system in a React component
 */

'use client'

import { useState } from 'react'
import { useQuoteGenerator, downloadPDFFromBase64, previewPDFFromBase64 } from '../use-quote-generator'
import type { QuoteLineItem } from '../types'

export function QuoteGeneratorExample() {
  const {
    generateQuote,
    generateFromOnboarding,
    getQuote,
    downloadQuote,
    updateQuoteStatus,
    isGenerating,
    error,
  } = useQuoteGenerator()

  const [quoteId, setQuoteId] = useState<string>('')
  const [onboardingId, setOnboardingId] = useState<string>('')
  const [pdfData, setPdfData] = useState<string>('')

  // Example 1: Generate quote from scratch
  const handleGenerateManualQuote = async () => {
    const result = await generateQuote({
      customer: {
        name: 'John Doe',
        businessName: 'Tech Startup Inc',
        email: 'john@techstartup.com',
        phone: '(555) 123-4567',
      },
      lineItems: [
        {
          id: '1',
          description: 'Brand Strategy & Consultation',
          quantity: 1,
          unitPrice: 3000,
          total: 3000,
          category: 'consulting',
          notes: 'Initial brand strategy and positioning',
        },
        {
          id: '2',
          description: 'Website Development - Professional Package',
          quantity: 1,
          unitPrice: 8000,
          total: 8000,
          category: 'web-development',
          notes: 'Responsive website with CMS integration',
        },
        {
          id: '3',
          description: 'Digital Marketing Setup',
          quantity: 1,
          unitPrice: 2500,
          total: 2500,
          category: 'marketing',
        },
      ],
      taxRate: 8.5,
      notes: 'Quote valid for 30 days. Custom requirements included.',
    })

    if (result.success && result.quote) {
      setQuoteId(result.quote.id!)
      if (result.pdfData) {
        setPdfData(result.pdfData)
      }
      alert(`Quote ${result.quote.quoteNumber} generated successfully!`)
    }
  }

  // Example 2: Generate from onboarding submission
  const handleGenerateFromOnboarding = async () => {
    if (!onboardingId) {
      alert('Please enter an onboarding submission ID')
      return
    }

    const result = await generateFromOnboarding(onboardingId, {
      includeDisclaimer: true,
      taxRate: 8.5,
    })

    if (result.success && result.quote) {
      setQuoteId(result.quote.id!)
      alert('Quote generated from onboarding submission!')
    }
  }

  // Example 3: Download quote PDF
  const handleDownload = async () => {
    if (!quoteId) {
      alert('Please generate a quote first')
      return
    }

    try {
      await downloadQuote(quoteId)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  // Example 4: Preview PDF in browser
  const handlePreview = () => {
    if (!pdfData) {
      alert('No PDF data available. Generate a quote first.')
      return
    }

    try {
      previewPDFFromBase64(pdfData)
    } catch (err) {
      console.error('Preview failed:', err)
    }
  }

  // Example 5: Update quote status
  const handleMarkAsSent = async () => {
    if (!quoteId) {
      alert('Please generate a quote first')
      return
    }

    try {
      await updateQuoteStatus(quoteId, 'sent')
      alert('Quote marked as sent!')
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  // Example 6: Fetch quote details
  const handleGetQuoteDetails = async () => {
    if (!quoteId) {
      alert('Please generate a quote first')
      return
    }

    const result = await getQuote(quoteId)
    if (result.success) {
      console.log('Quote details:', result.quote)
      console.log('Line items:', result.lineItems)
      console.log('Activities:', result.activities)
      alert('Quote details logged to console')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PDF Quote Generator Examples
        </h1>
        <p className="text-gray-600 mb-6">
          Demonstrating various quote generation scenarios
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {quoteId && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <strong>Active Quote ID:</strong> {quoteId}
          </div>
        )}

        {/* Example 1: Manual Quote Generation */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">1. Generate Manual Quote</h2>
          <p className="text-gray-600 mb-4">
            Create a quote from scratch with custom line items
          </p>
          <button
            onClick={handleGenerateManualQuote}
            disabled={isGenerating}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isGenerating ? 'Generating...' : 'Generate Quote'}
          </button>
        </div>

        {/* Example 2: Onboarding Quote */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">
            2. Generate from Onboarding
          </h2>
          <p className="text-gray-600 mb-4">
            Auto-generate quote from onboarding submission
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Onboarding Submission ID"
              value={onboardingId}
              onChange={(e) => setOnboardingId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerateFromOnboarding}
              disabled={isGenerating || !onboardingId}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Example 3: Download PDF */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">3. Download Quote PDF</h2>
          <p className="text-gray-600 mb-4">Download the generated PDF file</p>
          <button
            onClick={handleDownload}
            disabled={!quoteId}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Download PDF
          </button>
        </div>

        {/* Example 4: Preview PDF */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">4. Preview PDF</h2>
          <p className="text-gray-600 mb-4">Open PDF in new browser tab</p>
          <button
            onClick={handlePreview}
            disabled={!pdfData}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Preview in Browser
          </button>
        </div>

        {/* Example 5: Update Status */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">5. Update Quote Status</h2>
          <p className="text-gray-600 mb-4">Change quote status to "sent"</p>
          <button
            onClick={handleMarkAsSent}
            disabled={!quoteId}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Mark as Sent
          </button>
        </div>

        {/* Example 6: Get Details */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">6. Get Quote Details</h2>
          <p className="text-gray-600 mb-4">
            Fetch quote data, line items, and activity history
          </p>
          <button
            onClick={handleGetQuoteDetails}
            disabled={!quoteId}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Get Details (Console)
          </button>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-900 text-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Code Example</h2>
        <pre className="text-sm overflow-x-auto">
          <code>{`import { useQuoteGenerator } from '@/lib/pdf/use-quote-generator'

function MyComponent() {
  const { generateQuote, downloadQuote, isGenerating } = useQuoteGenerator()

  const handleGenerate = async () => {
    const result = await generateQuote({
      customer: {
        name: 'John Doe',
        businessName: 'Tech Startup',
        email: 'john@example.com',
      },
      lineItems: [{
        id: '1',
        description: 'Service',
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
      }],
    })

    if (result.success) {
      await downloadQuote(result.quote.id)
    }
  }

  return (
    <button onClick={handleGenerate} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : 'Generate Quote'}
    </button>
  )
}`}</code>
        </pre>
      </div>
    </div>
  )
}
