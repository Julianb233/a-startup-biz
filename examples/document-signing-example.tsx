/**
 * Document Signing Integration - Usage Examples
 *
 * This file demonstrates various ways to use the document signing functionality
 * in your application for partner agreements, contracts, NDAs, etc.
 */

'use client'

import { useState } from 'react'
import {
  DocumentSignature,
  DocumentSignatureModal,
  DocumentSignatureButton,
} from '@/components/DocumentSignature'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// Example 1: Upload and Create Signature Request
export function CreateSignatureRequestExample() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [signatureRequestId, setSignatureRequestId] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('method', 'upload')
      formData.append('embedded', 'true')
      formData.append('file', file)
      formData.append('documentType', 'partner_agreement')
      formData.append('title', 'Partner Agreement - New Partner')
      formData.append('subject', 'Please sign our partner agreement')
      formData.append('message', 'Welcome to our partner program!')
      formData.append('signers', JSON.stringify([
        {
          name: 'John Partner',
          email: 'partner@example.com',
          order: 1,
        },
      ]))
      formData.append('testMode', 'true')

      const response = await fetch('/api/documents/sign', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      setSignatureRequestId(result.data.signatureRequestId)
      toast.success('Signature request created!')
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Signature Request</CardTitle>
        <CardDescription>Upload a document and send for signature</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Document (PDF)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <Button type="submit" disabled={loading || !file}>
            {loading ? 'Creating...' : 'Create Signature Request'}
          </Button>
        </form>

        {signatureRequestId && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Signature Request Created!</p>
            <p className="text-sm text-muted-foreground">ID: {signatureRequestId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example 2: Embedded Signing Component
export function EmbeddedSigningExample() {
  const signatureRequestId = 'your_signature_request_id_here'
  const signerEmail = 'partner@example.com'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embedded Signing</CardTitle>
        <CardDescription>Sign document within the application</CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentSignature
          signatureRequestId={signatureRequestId}
          signerEmail={signerEmail}
          onSigned={() => {
            toast.success('Document signed successfully!')
            // Redirect or refresh
          }}
          onDeclined={() => {
            toast.error('Document signing was declined')
          }}
          onError={(error) => {
            toast.error(`Error: ${error.message}`)
          }}
          height="600px"
        />
      </CardContent>
    </Card>
  )
}

// Example 3: Modal Signing
export function ModalSigningExample() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const signatureRequestId = 'your_signature_request_id_here'
  const signerEmail = 'partner@example.com'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modal Signing</CardTitle>
        <CardDescription>Full-screen signing experience</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsModalOpen(true)}>
          Open Signing Modal
        </Button>

        <DocumentSignatureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          signatureRequestId={signatureRequestId}
          signerEmail={signerEmail}
          onSigned={() => {
            toast.success('Document signed!')
            setIsModalOpen(false)
          }}
          onDeclined={() => {
            toast.error('Document declined')
            setIsModalOpen(false)
          }}
        />
      </CardContent>
    </Card>
  )
}

// Example 4: Simple Button (External Signing)
export function ExternalSigningExample() {
  const signatureRequestId = 'your_signature_request_id_here'
  const signerEmail = 'partner@example.com'

  return (
    <Card>
      <CardHeader>
        <CardTitle>External Signing</CardTitle>
        <CardDescription>Open signing in a new tab</CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentSignatureButton
          signatureRequestId={signatureRequestId}
          signerEmail={signerEmail}
          onSigned={() => {
            toast.success('Document signed!')
          }}
        >
          Sign Document
        </DocumentSignatureButton>
      </CardContent>
    </Card>
  )
}

// Example 5: Create from Template
export function TemplateSigningExample() {
  const [loading, setLoading] = useState(false)
  const [signatureRequestId, setSignatureRequestId] = useState('')

  const createFromTemplate = async () => {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('method', 'template')
      formData.append('templateId', 'your_template_id_here')
      formData.append('documentType', 'nda')
      formData.append('title', 'NDA - ABC Company')
      formData.append('signers', JSON.stringify([
        { name: 'Jane Client', email: 'client@example.com', role: 'Client' },
        { name: 'Admin User', email: 'admin@astartupbiz.com', role: 'Company' },
      ]))
      formData.append('customFields', JSON.stringify({
        company_name: 'ABC Company',
        effective_date: new Date().toLocaleDateString(),
      }))
      formData.append('testMode', 'true')

      const response = await fetch('/api/documents/sign', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      setSignatureRequestId(result.data.signatureRequestId)
      toast.success('Template signature request created!')
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create from Template</CardTitle>
        <CardDescription>Use predefined document templates</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={createFromTemplate} disabled={loading}>
          {loading ? 'Creating...' : 'Create NDA from Template'}
        </Button>

        {signatureRequestId && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Signature Request Created!</p>
            <p className="text-sm text-muted-foreground">ID: {signatureRequestId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example 6: Check Status and Send Reminders
export function StatusAndRemindersExample() {
  const [signatureRequestId, setSignatureRequestId] = useState('')
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    if (!signatureRequestId) return

    setLoading(true)

    try {
      const response = await fetch(`/api/documents/status/${signatureRequestId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      setStatus(result.data)
      toast.success('Status updated')
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendReminder = async (signerEmail: string) => {
    if (!signatureRequestId) return

    try {
      const response = await fetch(`/api/documents/status/${signatureRequestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendReminder',
          signerEmail,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      toast.success('Reminder sent!')
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }

  const cancelRequest = async () => {
    if (!signatureRequestId) return

    try {
      const response = await fetch(`/api/documents/status/${signatureRequestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      toast.success('Signature request cancelled')
      checkStatus()
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Status & Send Reminders</CardTitle>
        <CardDescription>Manage signature requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="requestId">Signature Request ID</Label>
          <Input
            id="requestId"
            value={signatureRequestId}
            onChange={(e) => setSignatureRequestId(e.target.value)}
            placeholder="Enter signature request ID"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={checkStatus} disabled={loading || !signatureRequestId}>
            Check Status
          </Button>
          <Button
            variant="outline"
            onClick={cancelRequest}
            disabled={!signatureRequestId || status?.status === 'signed'}
          >
            Cancel Request
          </Button>
        </div>

        {status && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Status: {status.status}</p>
            <p className="text-sm text-muted-foreground">Title: {status.title}</p>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Signers:</p>
              {status.signers?.map((signer: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                  <div>
                    <p className="text-sm">{signer.email}</p>
                    <p className="text-xs text-muted-foreground">{signer.status}</p>
                  </div>
                  {signer.status === 'awaiting_signature' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendReminder(signer.email)}
                    >
                      Send Reminder
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example 7: List All Signature Requests
export function ListSignatureRequestsExample() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/documents/sign?limit=10')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      setRequests(result.data)
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>List Signature Requests</CardTitle>
        <CardDescription>View all your signature requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={fetchRequests} disabled={loading}>
          {loading ? 'Loading...' : 'Load Requests'}
        </Button>

        {requests.length > 0 && (
          <div className="mt-4 space-y-2">
            {requests.map((request) => (
              <div key={request.signature_request_id} className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{request.title}</p>
                <p className="text-sm text-muted-foreground">Status: {request.status}</p>
                <p className="text-sm text-muted-foreground">Type: {request.document_type}</p>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main demo page component
export default function DocumentSigningDemo() {
  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Document Signing Integration Demo</h1>
        <p className="text-muted-foreground">
          Examples of using the Dropbox Sign integration for partner agreements, contracts, and NDAs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreateSignatureRequestExample />
        <TemplateSigningExample />
        <EmbeddedSigningExample />
        <ModalSigningExample />
        <ExternalSigningExample />
        <StatusAndRemindersExample />
        <ListSignatureRequestsExample />
      </div>
    </div>
  )
}
