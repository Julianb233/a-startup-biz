import * as DropboxSign from '@dropbox/sign'
import crypto from 'crypto'
import { Readable } from 'stream'

// Initialize Dropbox Sign API client
const apiKey = process.env.DROPBOX_SIGN_API_KEY || ''

if (!apiKey && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn('DROPBOX_SIGN_API_KEY is not set - Document signing functionality will not work')
}

// Configuration
const signatureRequestApi = new DropboxSign.SignatureRequestApi()
signatureRequestApi.username = apiKey

const templateApi = new DropboxSign.TemplateApi()
templateApi.username = apiKey

// Document types supported
export enum DocumentType {
  PARTNER_AGREEMENT = 'partner_agreement',
  SERVICE_CONTRACT = 'service_contract',
  NDA = 'nda',
  CUSTOM = 'custom',
}

// Signature request status
export enum SignatureStatus {
  AWAITING_SIGNATURE = 'awaiting_signature',
  SIGNED = 'signed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// Signer information
export interface Signer {
  name: string
  email: string
  order?: number // For sequential signing
  role?: string // Role in the document (e.g., "Partner", "Client")
}

// Document metadata
export interface DocumentMetadata {
  type: DocumentType
  title: string
  subject?: string
  message?: string
  signers: Signer[]
  ccEmails?: string[]
  testMode?: boolean
  // Custom fields for form filling
  customFields?: Record<string, string>
}

// Template configuration
export interface TemplateConfig {
  templateId: string
  signerRoles: Record<string, Signer>
  customFields?: Record<string, string>
  title?: string
  subject?: string
  message?: string
  testMode?: boolean
}

// Signature request response
export interface SignatureRequestResponse {
  signatureRequestId: string
  signUrl?: string
  embeddedSignUrl?: string
  status: SignatureStatus
  signers: Array<{
    email: string
    status: string
    signUrl?: string
  }>
  title: string
  createdAt: Date
  expiresAt?: Date
}

/**
 * Create a signature request from a file upload
 */
export async function createSignatureRequest(
  fileBuffer: Buffer,
  fileName: string,
  metadata: DocumentMetadata
): Promise<SignatureRequestResponse> {
  try {
    const data: DropboxSign.SignatureRequestSendRequest = {
      title: metadata.title,
      subject: metadata.subject,
      message: metadata.message,
      signers: metadata.signers.map((signer, index) => ({
        name: signer.name,
        emailAddress: signer.email,
        order: signer.order ?? index,
      })),
      ccEmailAddresses: metadata.ccEmails,
      files: [Readable.from(fileBuffer) as unknown as DropboxSign.RequestFile],
      metadata: {
        documentType: metadata.type,
      },
      testMode: metadata.testMode ?? false,
      useTextTags: true, // Allow text tags for field placement
      hideTextTags: true, // Hide tags in final document
    }

    const result = await signatureRequestApi.signatureRequestSend(data)
    const signatureRequest = result.body.signatureRequest

    if (!signatureRequest) {
      throw new Error('No signature request returned from API')
    }

    return {
      signatureRequestId: signatureRequest.signatureRequestId || '',
      status: signatureRequest.isComplete
        ? SignatureStatus.SIGNED
        : SignatureStatus.AWAITING_SIGNATURE,
      signers: signatureRequest.signatures?.map((sig) => ({
        email: sig.signerEmailAddress || '',
        status: sig.statusCode || '',
        signUrl: undefined,
      })) || [],
      title: signatureRequest.title || metadata.title,
      createdAt: new Date(),
      expiresAt: signatureRequest.expiresAt
        ? new Date(signatureRequest.expiresAt * 1000)
        : undefined,
    }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error creating signature request:', err)
    throw new Error(`Failed to create signature request: ${err.message}`)
  }
}

/**
 * Create an embedded signature request (for iframe signing)
 */
export async function createEmbeddedSignatureRequest(
  fileBuffer: Buffer,
  fileName: string,
  metadata: DocumentMetadata,
  clientId: string
): Promise<SignatureRequestResponse> {
  try {
    const data: DropboxSign.SignatureRequestCreateEmbeddedRequest = {
      clientId,
      title: metadata.title,
      subject: metadata.subject,
      message: metadata.message,
      signers: metadata.signers.map((signer, index) => ({
        name: signer.name,
        emailAddress: signer.email,
        order: signer.order ?? index,
      })),
      ccEmailAddresses: metadata.ccEmails,
      files: [Readable.from(fileBuffer) as unknown as DropboxSign.RequestFile],
      metadata: {
        documentType: metadata.type,
      },
      testMode: metadata.testMode ?? false,
      useTextTags: true,
      hideTextTags: true,
    }

    const result = await signatureRequestApi.signatureRequestCreateEmbedded(data)
    const signatureRequest = result.body.signatureRequest

    if (!signatureRequest) {
      throw new Error('No signature request returned from API')
    }

    return {
      signatureRequestId: signatureRequest.signatureRequestId || '',
      status: SignatureStatus.AWAITING_SIGNATURE,
      signers: signatureRequest.signatures?.map((sig) => ({
        email: sig.signerEmailAddress || '',
        status: sig.statusCode || '',
      })) || [],
      title: signatureRequest.title || metadata.title,
      createdAt: new Date(),
      expiresAt: signatureRequest.expiresAt
        ? new Date(signatureRequest.expiresAt * 1000)
        : undefined,
    }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error creating embedded signature request:', err)
    throw new Error(`Failed to create embedded signature request: ${err.message}`)
  }
}

/**
 * Get embedded sign URL for a specific signer
 */
export async function getEmbeddedSignUrl(
  signatureRequestId: string,
  signerEmail: string
): Promise<string> {
  try {
    const embeddedApi = new DropboxSign.EmbeddedApi()
    embeddedApi.username = apiKey

    const result = await embeddedApi.embeddedSignUrl(signatureRequestId)
    const embedded = result.body.embedded

    if (!embedded || !embedded.signUrl) {
      throw new Error('No sign URL returned from API')
    }

    return embedded.signUrl
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error getting embedded sign URL:', err)
    throw new Error(`Failed to get embedded sign URL: ${err.message}`)
  }
}

/**
 * Create signature request from template
 */
export async function createSignatureRequestFromTemplate(
  config: TemplateConfig
): Promise<SignatureRequestResponse> {
  try {
    const signerRoleEntries = Object.entries(config.signerRoles)

    const data: DropboxSign.SignatureRequestSendWithTemplateRequest = {
      templateIds: [config.templateId],
      title: config.title || 'Document for Signature',
      subject: config.subject,
      message: config.message,
      signers: signerRoleEntries.map(([roleName, signer]) => ({
        name: signer.name,
        emailAddress: signer.email,
        role: roleName,
      })),
      customFields: config.customFields
        ? Object.entries(config.customFields).map(([name, value]) => ({
            name,
            value,
          }))
        : undefined,
      testMode: config.testMode ?? false,
    }

    const result = await signatureRequestApi.signatureRequestSendWithTemplate(data)
    const signatureRequest = result.body.signatureRequest

    if (!signatureRequest) {
      throw new Error('No signature request returned from API')
    }

    return {
      signatureRequestId: signatureRequest.signatureRequestId || '',
      status: signatureRequest.isComplete
        ? SignatureStatus.SIGNED
        : SignatureStatus.AWAITING_SIGNATURE,
      signers: signatureRequest.signatures?.map((sig) => ({
        email: sig.signerEmailAddress || '',
        status: sig.statusCode || '',
        signUrl: undefined,
      })) || [],
      title: signatureRequest.title || config.title || 'Document',
      createdAt: new Date(),
      expiresAt: signatureRequest.expiresAt
        ? new Date(signatureRequest.expiresAt * 1000)
        : undefined,
    }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error creating signature request from template:', err)
    throw new Error(`Failed to create signature request from template: ${err.message}`)
  }
}

/**
 * Get signature request status
 */
export async function getSignatureRequestStatus(
  signatureRequestId: string
): Promise<SignatureRequestResponse> {
  try {
    const result = await signatureRequestApi.signatureRequestGet(signatureRequestId)
    const signatureRequest = result.body.signatureRequest

    if (!signatureRequest) {
      throw new Error('Signature request not found')
    }

    let status: SignatureStatus = SignatureStatus.AWAITING_SIGNATURE
    if (signatureRequest.isComplete) {
      status = SignatureStatus.SIGNED
    } else if (signatureRequest.isDeclined) {
      status = SignatureStatus.DECLINED
    } else if (signatureRequest.hasError) {
      status = SignatureStatus.CANCELLED
    }

    return {
      signatureRequestId: signatureRequest.signatureRequestId || '',
      status,
      signers: signatureRequest.signatures?.map((sig) => ({
        email: sig.signerEmailAddress || '',
        status: sig.statusCode || '',
        signUrl: undefined,
      })) || [],
      title: signatureRequest.title || '',
      createdAt: new Date(signatureRequest.createdAt || Date.now()),
      expiresAt: signatureRequest.expiresAt
        ? new Date(signatureRequest.expiresAt * 1000)
        : undefined,
    }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error getting signature request status:', err)
    throw new Error(`Failed to get signature request status: ${err.message}`)
  }
}

/**
 * Download signed document
 */
export async function downloadSignedDocument(
  signatureRequestId: string
): Promise<Buffer> {
  try {
    const result = await signatureRequestApi.signatureRequestFiles(
      signatureRequestId,
      'pdf'
    )

    return Buffer.from(result.body as unknown as ArrayBuffer)
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error downloading signed document:', err)
    throw new Error(`Failed to download signed document: ${err.message}`)
  }
}

/**
 * Cancel signature request
 */
export async function cancelSignatureRequest(
  signatureRequestId: string
): Promise<void> {
  try {
    await signatureRequestApi.signatureRequestCancel(signatureRequestId)
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error cancelling signature request:', err)
    throw new Error(`Failed to cancel signature request: ${err.message}`)
  }
}

/**
 * Send reminder for signature request
 */
export async function sendSignatureReminder(
  signatureRequestId: string,
  signerEmail: string
): Promise<void> {
  try {
    const data: DropboxSign.SignatureRequestRemindRequest = {
      emailAddress: signerEmail,
    }

    await signatureRequestApi.signatureRequestRemind(signatureRequestId, data)
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error sending signature reminder:', err)
    throw new Error(`Failed to send signature reminder: ${err.message}`)
  }
}

/**
 * List all templates
 */
export async function listTemplates(): Promise<Array<{
  templateId: string
  title: string
  isEmbedded: boolean
  signerRoles: string[]
}>> {
  try {
    const result = await templateApi.templateList()
    const templates = result.body.templates || []

    return templates.map((template) => ({
      templateId: template.templateId || '',
      title: template.title || '',
      isEmbedded: template.isEmbedded || false,
      signerRoles: template.signerRoles?.map((role) => role.name || '') || [],
    }))
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error listing templates:', err)
    throw new Error(`Failed to list templates: ${err.message}`)
  }
}

/**
 * Verify webhook event signature
 * This ensures the webhook event came from Dropbox Sign
 */
export function verifyWebhookSignature(
  eventJson: string,
  signature: string,
  apiKey: string = process.env.DROPBOX_SIGN_API_KEY || ''
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', apiKey)
      .update(eventJson)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

/**
 * Parse webhook event
 */
export interface WebhookEvent {
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

export function parseWebhookEvent(eventData: Record<string, unknown>): WebhookEvent {
  const event = eventData.event as Record<string, unknown>

  return {
    eventType: (event?.event_type as string) || '',
    eventTime: new Date((event?.event_time as number) * 1000),
    eventHash: (event?.event_hash as string) || '',
    signatureRequest: event?.signature_request
      ? {
          signatureRequestId: ((event.signature_request as Record<string, unknown>)?.signature_request_id as string) || '',
          title: ((event.signature_request as Record<string, unknown>)?.title as string) || '',
          isComplete: ((event.signature_request as Record<string, unknown>)?.is_complete as boolean) || false,
          isDeclined: ((event.signature_request as Record<string, unknown>)?.is_declined as boolean) || false,
          hasError: ((event.signature_request as Record<string, unknown>)?.has_error as boolean) || false,
        }
      : undefined,
    signature: event?.signature
      ? {
          signatureId: ((event.signature as Record<string, unknown>)?.signature_id as string) || '',
          signerEmailAddress: ((event.signature as Record<string, unknown>)?.signer_email_address as string) || '',
          statusCode: ((event.signature as Record<string, unknown>)?.status_code as string) || '',
        }
      : undefined,
  }
}

// Predefined document templates
export const DOCUMENT_TEMPLATES = {
  PARTNER_AGREEMENT: process.env.DROPBOX_SIGN_TEMPLATE_PARTNER_AGREEMENT || '',
  SERVICE_CONTRACT: process.env.DROPBOX_SIGN_TEMPLATE_SERVICE_CONTRACT || '',
  NDA: process.env.DROPBOX_SIGN_TEMPLATE_NDA || '',
} as const

// Helper to get client ID for embedded signing
export const DROPBOX_SIGN_CLIENT_ID = process.env.DROPBOX_SIGN_CLIENT_ID || ''
