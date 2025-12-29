/**
 * TypeScript type definitions for Document Signing
 */

// Database types
export interface SignatureRequest {
  id: number
  signature_request_id: string
  user_id: string
  document_type: 'partner_agreement' | 'service_contract' | 'nda' | 'custom'
  title: string
  status: 'awaiting_signature' | 'signed' | 'declined' | 'expired' | 'cancelled' | 'invalid'
  embedded: boolean
  signers: SignerInfo[]
  metadata: Record<string, unknown>
  signed_document_url?: string
  created_at: string
  updated_at: string
  completed_at?: string
  expires_at?: string
}

export interface SignatureEvent {
  id: number
  signature_request_id: string
  event_type: 'sent' | 'viewed' | 'signed' | 'declined' | 'expired' | 'cancelled' | 'reminder_sent'
  signer_email?: string
  event_time: string
  event_hash?: string
  event_data?: Record<string, unknown>
  created_at: string
}

// API types
export interface SignerInfo {
  name: string
  email: string
  order?: number
  role?: string
  status?: string
  signUrl?: string
}

export interface CreateSignatureRequestPayload {
  method: 'upload' | 'template'
  embedded?: boolean
  file?: File
  templateId?: string
  documentType: 'partner_agreement' | 'service_contract' | 'nda' | 'custom'
  title: string
  subject?: string
  message?: string
  signers: SignerInfo[]
  ccEmails?: string[]
  customFields?: Record<string, string>
  metadata?: Record<string, unknown>
  testMode?: boolean
}

export interface SignatureRequestResponse {
  signatureRequestId: string
  signUrl?: string
  embeddedSignUrl?: string
  status: string
  signers: SignerInfo[]
  title: string
  createdAt: Date
  expiresAt?: Date
}

export interface SignatureStatusResponse {
  signature_request_id: string
  document_type: string
  title: string
  status: string
  embedded: boolean
  signers: SignerInfo[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  completed_at?: string
  expires_at?: string
  signed_document_url?: string
  events: SignatureEvent[]
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    limit: number
    offset: number
    total: number
  }
}

// Component props
export interface DocumentSignatureProps {
  signatureRequestId: string
  signerEmail: string
  onSigned?: () => void
  onDeclined?: () => void
  onError?: (error: Error) => void
  width?: string | number
  height?: string | number
  testMode?: boolean
}

export interface DocumentSignatureModalProps extends DocumentSignatureProps {
  isOpen: boolean
  onClose: () => void
}

export interface DocumentSignatureButtonProps {
  signatureRequestId: string
  signerEmail: string
  onSigned?: () => void
  children?: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

// Webhook types
export interface WebhookEventPayload {
  event: {
    event_type: string
    event_time: number
    event_hash: string
    signature_request?: {
      signature_request_id: string
      title: string
      is_complete: boolean
      is_declined: boolean
      has_error: boolean
    }
    signature?: {
      signature_id: string
      signer_email_address: string
      status_code: string
    }
  }
}

export interface ParsedWebhookEvent {
  eventType: string
  eventTime: Date
  eventHash: string
  signatureRequest?: {
    signatureRequestId: string
    title: string
    isComplete: boolean
    isDeclined: boolean
    hasError: boolean
  }
  signature?: {
    signatureId: string
    signerEmailAddress: string
    statusCode: string
  }
}

// Action types
export type SignatureRequestAction = 'getSignUrl' | 'sendReminder' | 'cancel'

export interface SignatureRequestActionPayload {
  action: SignatureRequestAction
  signerEmail?: string
}

// List/filter types
export interface ListSignatureRequestsParams {
  documentType?: string
  status?: string
  limit?: number
  offset?: number
}

// Template types
export interface DocumentTemplate {
  templateId: string
  title: string
  isEmbedded: boolean
  signerRoles: string[]
}

// Export constants
export const DOCUMENT_TYPES = {
  PARTNER_AGREEMENT: 'partner_agreement',
  SERVICE_CONTRACT: 'service_contract',
  NDA: 'nda',
  CUSTOM: 'custom',
} as const

export const SIGNATURE_STATUSES = {
  AWAITING_SIGNATURE: 'awaiting_signature',
  SIGNED: 'signed',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  INVALID: 'invalid',
} as const

export const EVENT_TYPES = {
  SENT: 'signature_request_sent',
  VIEWED: 'signature_request_viewed',
  SIGNED: 'signature_request_signed',
  ALL_SIGNED: 'signature_request_all_signed',
  DECLINED: 'signature_request_declined',
  EXPIRED: 'signature_request_expired',
  CANCELLED: 'signature_request_cancelled',
  INVALID: 'signature_request_invalid',
} as const
