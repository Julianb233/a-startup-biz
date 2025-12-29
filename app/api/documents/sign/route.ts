import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  createSignatureRequest,
  createEmbeddedSignatureRequest,
  createSignatureRequestFromTemplate,
  DocumentType,
  DocumentMetadata,
  TemplateConfig,
  DROPBOX_SIGN_CLIENT_ID,
} from '@/lib/document-signing'
import { sql } from '@/lib/db'

/**
 * POST /api/documents/sign
 * Create a signature request for a document
 *
 * Request Body:
 * - method: 'upload' | 'template' - How to create the document
 * - embedded: boolean - Whether to use embedded signing (iframe)
 * - file?: File - Document file (for upload method)
 * - templateId?: string - Template ID (for template method)
 * - documentType: string - Type of document
 * - title: string - Document title
 * - subject?: string - Email subject
 * - message?: string - Email message
 * - signers: Array<{name, email, order?, role?}>
 * - ccEmails?: string[] - CC recipients
 * - customFields?: Record<string, string> - Custom field values
 * - metadata?: Record<string, any> - Additional metadata to store
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const method = formData.get('method') as string
    const embedded = formData.get('embedded') === 'true'
    const documentType = formData.get('documentType') as DocumentType
    const title = formData.get('title') as string
    const subject = formData.get('subject') as string | null
    const message = formData.get('message') as string | null
    const signersJson = formData.get('signers') as string
    const ccEmailsJson = formData.get('ccEmails') as string | null
    const customFieldsJson = formData.get('customFields') as string | null
    const metadataJson = formData.get('metadata') as string | null
    const testMode = formData.get('testMode') === 'true'

    // Validate required fields
    if (!method || !documentType || !title || !signersJson) {
      return NextResponse.json(
        { error: 'Missing required fields: method, documentType, title, signers' },
        { status: 400 }
      )
    }

    const signers = JSON.parse(signersJson)
    const ccEmails = ccEmailsJson ? JSON.parse(ccEmailsJson) : undefined
    const customFields = customFieldsJson ? JSON.parse(customFieldsJson) : undefined
    const metadata = metadataJson ? JSON.parse(metadataJson) : {}

    let signatureRequest

    if (method === 'upload') {
      // Upload method - create from file
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json(
          { error: 'File is required for upload method' },
          { status: 400 }
        )
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const fileName = file.name

      const documentMetadata: DocumentMetadata = {
        type: documentType,
        title,
        subject: subject || undefined,
        message: message || undefined,
        signers,
        ccEmails,
        customFields,
        testMode,
      }

      if (embedded) {
        signatureRequest = await createEmbeddedSignatureRequest(
          fileBuffer,
          fileName,
          documentMetadata,
          DROPBOX_SIGN_CLIENT_ID
        )
      } else {
        signatureRequest = await createSignatureRequest(
          fileBuffer,
          fileName,
          documentMetadata
        )
      }
    } else if (method === 'template') {
      // Template method - create from template
      const templateId = formData.get('templateId') as string | null

      if (!templateId) {
        return NextResponse.json(
          { error: 'Template ID is required for template method' },
          { status: 400 }
        )
      }

      // Convert signers array to signer roles object
      const signerRoles: Record<string, { name: string; email: string }> = {}
      signers.forEach((signer: { name: string; email: string; role?: string }) => {
        const role = signer.role || 'Signer'
        signerRoles[role] = { name: signer.name, email: signer.email }
      })

      const templateConfig: TemplateConfig = {
        templateId,
        signerRoles,
        customFields,
        title,
        subject: subject || undefined,
        message: message || undefined,
        testMode,
      }

      signatureRequest = await createSignatureRequestFromTemplate(templateConfig)
    } else {
      return NextResponse.json(
        { error: 'Invalid method. Must be "upload" or "template"' },
        { status: 400 }
      )
    }

    // Store signature request in database
    await sql`
      INSERT INTO signature_requests (
        signature_request_id,
        user_id,
        document_type,
        title,
        status,
        embedded,
        signers,
        metadata,
        created_at,
        expires_at
      ) VALUES (
        ${signatureRequest.signatureRequestId},
        ${userId},
        ${documentType},
        ${title},
        ${signatureRequest.status},
        ${embedded},
        ${JSON.stringify(signatureRequest.signers)},
        ${JSON.stringify(metadata)},
        NOW(),
        ${signatureRequest.expiresAt?.toISOString() || null}
      )
    `

    return NextResponse.json({
      success: true,
      data: signatureRequest,
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error creating signature request:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create signature request' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/documents/sign
 * List signature requests for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const documentType = searchParams.get('documentType')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = sql`
      SELECT
        signature_request_id,
        document_type,
        title,
        status,
        embedded,
        signers,
        metadata,
        created_at,
        updated_at,
        expires_at
      FROM signature_requests
      WHERE user_id = ${userId}
    `

    if (documentType) {
      query = sql`${query} AND document_type = ${documentType}`
    }

    if (status) {
      query = sql`${query} AND status = ${status}`
    }

    query = sql`${query}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const result = await query

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        limit,
        offset,
        total: result.length,
      },
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error fetching signature requests:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to fetch signature requests' },
      { status: 500 }
    )
  }
}
