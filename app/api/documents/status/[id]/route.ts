import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import {
  getSignatureRequestStatus,
  getEmbeddedSignUrl,
  sendSignatureReminder,
  cancelSignatureRequest,
} from '@/lib/document-signing'
import { sql } from '@/lib/db'

/**
 * GET /api/documents/status/[id]
 * Get the status of a signature request
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { id: signatureRequestId } = await params

    // Verify user owns this signature request
    const result = await sql`
      SELECT
        signature_request_id,
        user_id,
        document_type,
        title,
        status,
        embedded,
        signers,
        metadata,
        created_at,
        updated_at,
        completed_at,
        expires_at,
        signed_document_url
      FROM signature_requests
      WHERE signature_request_id = ${signatureRequestId}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Signature request not found' },
        { status: 404 }
      )
    }

    const localData = result[0]

    if (localData.user_id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this document' },
        { status: 403 }
      )
    }

    // Get latest status from Dropbox Sign
    const signatureRequest = await getSignatureRequestStatus(signatureRequestId)

    // Update local status if changed
    if (signatureRequest.status !== localData.status) {
      await sql`
        UPDATE signature_requests
        SET
          status = ${signatureRequest.status},
          updated_at = NOW()
        WHERE signature_request_id = ${signatureRequestId}
      `
    }

    // Get signature events history
    const eventsResult = await sql`
      SELECT event_type, signer_email, event_time
      FROM signature_events
      WHERE signature_request_id = ${signatureRequestId}
      ORDER BY event_time DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        ...signatureRequest,
        documentType: localData.document_type,
        embedded: localData.embedded,
        metadata: localData.metadata,
        completedAt: localData.completed_at,
        signedDocumentUrl: localData.signed_document_url,
        events: eventsResult,
      },
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error fetching signature request status:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to fetch signature request status' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/documents/status/[id]
 * Perform actions on a signature request
 *
 * Request Body:
 * - action: 'getSignUrl' | 'sendReminder' | 'cancel'
 * - signerEmail?: string (for getSignUrl and sendReminder)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { id: signatureRequestId } = await params
    const body = await req.json()
    const { action, signerEmail } = body

    // Verify user owns this signature request
    const result = await sql`
      SELECT user_id, embedded, status
      FROM signature_requests
      WHERE signature_request_id = ${signatureRequestId}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Signature request not found' },
        { status: 404 }
      )
    }

    const localData = result[0]

    if (localData.user_id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this document' },
        { status: 403 }
      )
    }

    switch (action) {
      case 'getSignUrl': {
        if (!signerEmail) {
          return NextResponse.json(
            { error: 'Signer email is required' },
            { status: 400 }
          )
        }

        if (!localData.embedded) {
          return NextResponse.json(
            { error: 'This signature request is not embedded' },
            { status: 400 }
          )
        }

        const signUrl = await getEmbeddedSignUrl(signatureRequestId, signerEmail)

        return NextResponse.json({
          success: true,
          data: { signUrl },
        })
      }

      case 'sendReminder': {
        if (!signerEmail) {
          return NextResponse.json(
            { error: 'Signer email is required' },
            { status: 400 }
          )
        }

        if (localData.status !== 'awaiting_signature') {
          return NextResponse.json(
            { error: 'Cannot send reminder for this signature request status' },
            { status: 400 }
          )
        }

        await sendSignatureReminder(signatureRequestId, signerEmail)

        // Log reminder sent
        await sql`
          INSERT INTO signature_events (
            signature_request_id,
            event_type,
            signer_email,
            event_time,
            event_hash
          ) VALUES (
            ${signatureRequestId},
            'reminder_sent',
            ${signerEmail},
            NOW(),
            ${crypto.randomUUID()}
          )
        `

        return NextResponse.json({
          success: true,
          message: 'Reminder sent successfully',
        })
      }

      case 'cancel': {
        if (localData.status === 'signed' || localData.status === 'cancelled') {
          return NextResponse.json(
            { error: 'Cannot cancel this signature request' },
            { status: 400 }
          )
        }

        await cancelSignatureRequest(signatureRequestId)

        await sql`
          UPDATE signature_requests
          SET
            status = 'cancelled',
            updated_at = NOW()
          WHERE signature_request_id = ${signatureRequestId}
        `

        return NextResponse.json({
          success: true,
          message: 'Signature request cancelled successfully',
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be "getSignUrl", "sendReminder", or "cancel"' },
          { status: 400 }
        )
    }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error performing signature request action:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to perform action' },
      { status: 500 }
    )
  }
}
