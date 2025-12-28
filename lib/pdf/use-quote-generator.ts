/**
 * React Hook for Quote Generation
 * Client-side hook for generating and managing quotes
 */

'use client'

import { useState } from 'react'
import type { QuoteCreateInput, Quote, QuoteSummary } from './types'

interface UseQuoteGeneratorReturn {
  generateQuote: (input: QuoteCreateInput) => Promise<GenerateQuoteResult>
  generateFromOnboarding: (
    submissionId: string,
    options?: OnboardingQuoteOptions
  ) => Promise<GenerateQuoteResult>
  getQuote: (quoteId: string) => Promise<GetQuoteResult>
  downloadQuote: (quoteId: string) => Promise<void>
  updateQuoteStatus: (quoteId: string, status: Quote['metadata']['status']) => Promise<void>
  isGenerating: boolean
  error: string | null
}

interface GenerateQuoteResult {
  success: boolean
  quote?: QuoteSummary
  pdfData?: string
  error?: string
}

interface GetQuoteResult {
  success: boolean
  quote?: any
  lineItems?: any[]
  activities?: any[]
  error?: string
}

interface OnboardingQuoteOptions {
  includeDisclaimer?: boolean
  customServices?: Array<{ name: string; price: number }>
  taxRate?: number
}

export function useQuoteGenerator(): UseQuoteGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateQuote = async (
    input: QuoteCreateInput
  ): Promise<GenerateQuoteResult> => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quote')
      }

      return {
        success: true,
        quote: data.quote,
        pdfData: data.pdf?.data,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFromOnboarding = async (
    submissionId: string,
    options?: OnboardingQuoteOptions
  ): Promise<GenerateQuoteResult> => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/onboarding/${submissionId}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options || {}),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quote from onboarding')
      }

      // Fetch the generated quote
      const quoteResult = await getQuote(data.quoteId)

      return {
        success: true,
        quote: quoteResult.quote,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const getQuote = async (quoteId: string): Promise<GetQuoteResult> => {
    setError(null)

    try {
      const response = await fetch(`/api/pdf/quotes/${quoteId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch quote')
      }

      return {
        success: true,
        quote: data.quote,
        lineItems: data.lineItems,
        activities: data.activities,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const downloadQuote = async (quoteId: string): Promise<void> => {
    setError(null)

    try {
      const response = await fetch(`/api/pdf/quotes/${quoteId}?download=true`)

      if (!response.ok) {
        throw new Error('Failed to download quote')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      // Create temporary link and click it
      const link = document.createElement('a')
      link.href = url
      link.download = `quote_${quoteId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateQuoteStatus = async (
    quoteId: string,
    status: Quote['metadata']['status']
  ): Promise<void> => {
    setError(null)

    try {
      const response = await fetch(`/api/pdf/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update quote status')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    generateQuote,
    generateFromOnboarding,
    getQuote,
    downloadQuote,
    updateQuoteStatus,
    isGenerating,
    error,
  }
}

/**
 * Helper function to download PDF from base64 data
 */
export function downloadPDFFromBase64(
  base64Data: string,
  filename: string = 'quote.pdf'
): void {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    throw new Error('Failed to download PDF')
  }
}

/**
 * Helper function to preview PDF in new window
 */
export function previewPDFFromBase64(base64Data: string): void {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })

    // Open in new window
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')

    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 100)
  } catch (error) {
    console.error('Error previewing PDF:', error)
    throw new Error('Failed to preview PDF')
  }
}
