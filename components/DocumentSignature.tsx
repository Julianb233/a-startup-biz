'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface DocumentSignatureProps {
  signatureRequestId: string
  signerEmail: string
  onSigned?: () => void
  onDeclined?: () => void
  onError?: (error: Error) => void
  width?: string | number
  height?: string | number
  testMode?: boolean
}

/**
 * DocumentSignature Component
 *
 * Embeds Dropbox Sign signing interface in an iframe
 * Handles signature completion events and status updates
 *
 * Usage:
 * <DocumentSignature
 *   signatureRequestId="abc123"
 *   signerEmail="signer@example.com"
 *   onSigned={() => console.log('Signed!')}
 *   onDeclined={() => console.log('Declined')}
 *   onError={(err) => console.error(err)}
 * />
 */
export function DocumentSignature({
  signatureRequestId,
  signerEmail,
  onSigned,
  onDeclined,
  onError,
  width = '100%',
  height = '600px',
  testMode = false,
}: DocumentSignatureProps) {
  const [signUrl, setSignUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'signed' | 'declined' | 'error'>('loading')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    fetchSignUrl()
  }, [signatureRequestId, signerEmail])

  useEffect(() => {
    // Listen for messages from the embedded signing iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify message origin (Dropbox Sign)
      if (!event.origin.includes('hellosign.com') && !testMode) {
        return
      }

      const data = event.data

      if (typeof data === 'string') {
        try {
          const message = JSON.parse(data)
          handleSigningEvent(message)
        } catch (err) {
          // Message is not JSON, ignore
        }
      } else if (typeof data === 'object') {
        handleSigningEvent(data)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const fetchSignUrl = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/documents/status/${signatureRequestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getSignUrl',
          signerEmail,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get sign URL')
      }

      setSignUrl(result.data.signUrl)
      setStatus('ready')
    } catch (err) {
      const error = err as Error
      setError(error.message)
      setStatus('error')
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSigningEvent = (message: Record<string, unknown>) => {
    console.log('Signing event:', message)

    switch (message.event) {
      case 'signature_request_signed':
        setStatus('signed')
        onSigned?.()
        break

      case 'signature_request_declined':
        setStatus('declined')
        onDeclined?.()
        break

      case 'error':
        const errorMsg = (message.message as string) || 'An error occurred during signing'
        setError(errorMsg)
        setStatus('error')
        onError?.(new Error(errorMsg))
        break

      case 'ready':
        // Iframe is ready
        break

      default:
        console.log('Unhandled signing event:', message.event)
    }
  }

  const refreshSignUrl = () => {
    setStatus('loading')
    setError(null)
    fetchSignUrl()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || status === 'error') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Error Loading Document
          </CardTitle>
          <CardDescription>
            There was a problem loading the signature request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'An unknown error occurred'}</AlertDescription>
          </Alert>
          <Button onClick={refreshSignUrl} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (status === 'signed') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Document Signed Successfully</h3>
            <p className="text-muted-foreground">
              Thank you for signing the document. You will receive a confirmation email shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'declined') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Document Declined</h3>
            <p className="text-muted-foreground">
              You have declined to sign this document.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Document</CardTitle>
        <CardDescription>
          Please review and sign the document below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border rounded-lg overflow-hidden"
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
          }}
        >
          <iframe
            ref={iframeRef}
            src={signUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title="Document Signature"
            allow="fullscreen"
          />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * DocumentSignatureModal Component
 *
 * Full-screen modal for document signing
 * Better UX for mobile and focused signing experience
 */
interface DocumentSignatureModalProps extends DocumentSignatureProps {
  isOpen: boolean
  onClose: () => void
}

export function DocumentSignatureModal({
  isOpen,
  onClose,
  signatureRequestId,
  signerEmail,
  onSigned,
  onDeclined,
  onError,
  testMode,
}: DocumentSignatureModalProps) {
  const handleSigned = () => {
    onSigned?.()
    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handleDeclined = () => {
    onDeclined?.()
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sign Document</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <DocumentSignature
            signatureRequestId={signatureRequestId}
            signerEmail={signerEmail}
            onSigned={handleSigned}
            onDeclined={handleDeclined}
            onError={onError}
            width="100%"
            height="100%"
            testMode={testMode}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * DocumentSignatureButton Component
 *
 * Simplified button that opens signing in a new window/tab
 * Good for when embedded signing isn't needed
 */
interface DocumentSignatureButtonProps {
  signatureRequestId: string
  signerEmail: string
  onSigned?: () => void
  children?: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function DocumentSignatureButton({
  signatureRequestId,
  signerEmail,
  onSigned,
  children = 'Sign Document',
  variant = 'default',
  size = 'default',
}: DocumentSignatureButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/documents/status/${signatureRequestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getSignUrl',
          signerEmail,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get sign URL')
      }

      // Open in new window
      window.open(result.data.signUrl, '_blank', 'noopener,noreferrer')

      // Poll for completion (optional)
      pollForCompletion()
    } catch (err) {
      console.error('Error opening signature:', err)
      alert('Failed to open signature request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const pollForCompletion = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/documents/status/${signatureRequestId}`)
        const result = await response.json()

        if (result.data.status === 'signed') {
          clearInterval(interval)
          onSigned?.()
        }
      } catch (err) {
        console.error('Error polling signature status:', err)
      }
    }, 5000) // Poll every 5 seconds

    // Stop polling after 30 minutes
    setTimeout(() => {
      clearInterval(interval)
    }, 30 * 60 * 1000)
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={variant}
      size={size}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
