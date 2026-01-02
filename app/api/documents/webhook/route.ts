import { NextRequest, NextResponse } from 'next/server'
import {
  verifyWebhookSignature,
  parseWebhookEvent,
  downloadSignedDocument,
} from '@/lib/document-signing'
import { sql } from '@/lib/db'
import { resend } from '@/lib/email'

/**
 * POST /api/documents/webhook
 * Handle Dropbox Sign webhook events
 *
 * This endpoint receives notifications about signature events:
 * - signature_request_sent: Request sent to signers
 * - signature_request_viewed: Signer viewed the document
 * - signature_request_signed: Signer completed signing
 * - signature_request_all_signed: All signers completed
 * - signature_request_declined: Signer declined to sign
 * - signature_request_expired: Request expired
 * - signature_request_cancelled: Request was cancelled
 * - signature_request_invalid: Request became invalid
 */
export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text()
    const signature = req.headers.get('x-hellosign-signature') || ''

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse event data
    const eventData = JSON.parse(rawBody)
    const event = parseWebhookEvent(eventData)

    // Handle different event types
    switch (event.eventType) {
      case 'signature_request_sent':
        await handleSignatureRequestSent(event)
        break

      case 'signature_request_viewed':
        await handleSignatureRequestViewed(event)
        break

      case 'signature_request_signed':
        await handleSignatureRequestSigned(event)
        break

      case 'signature_request_all_signed':
        await handleSignatureRequestAllSigned(event)
        break

      case 'signature_request_declined':
        await handleSignatureRequestDeclined(event)
        break

      case 'signature_request_expired':
        await handleSignatureRequestExpired(event)
        break

      case 'signature_request_cancelled':
        await handleSignatureRequestCancelled(event)
        break

      case 'signature_request_invalid':
        await handleSignatureRequestInvalid(event)
        break

      default:
        // Unhandled event type - silently ignore
    }

    // Dropbox Sign expects "Hello API Event Received"
    return new NextResponse('Hello API Event Received', { status: 200 })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json(
      { error: err.message || 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

// Event handlers

async function handleSignatureRequestSent(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest) return

  await sql`
    UPDATE signature_requests
    SET
      status = 'awaiting_signature',
      updated_at = NOW()
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `
}

async function handleSignatureRequestViewed(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest || !event.signature) return

  // Log the view event
  await sql`
    INSERT INTO signature_events (
      signature_request_id,
      event_type,
      signer_email,
      event_time,
      event_hash
    ) VALUES (
      ${event.signatureRequest.signatureRequestId},
      'viewed',
      ${event.signature.signerEmailAddress},
      ${event.eventTime.toISOString()},
      ${event.eventHash}
    )
  `
}

async function handleSignatureRequestSigned(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest || !event.signature) return

  // Update signature status
  await sql`
    INSERT INTO signature_events (
      signature_request_id,
      event_type,
      signer_email,
      event_time,
      event_hash
    ) VALUES (
      ${event.signatureRequest.signatureRequestId},
      'signed',
      ${event.signature.signerEmailAddress},
      ${event.eventTime.toISOString()},
      ${event.eventHash}
    )
  `

  // Get signature request details
  const result = await sql`
    SELECT user_id, title, signers, metadata
    FROM signature_requests
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `

  if (result.length > 0) {
    const signatureRequest = result[0]

    // Send notification to document owner
    await sendSignatureNotification(
      signatureRequest.user_id as string,
      signatureRequest.title as string,
      event.signature.signerEmailAddress,
      'signed'
    )
  }
}

async function handleSignatureRequestAllSigned(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest) return

  // Update status to signed
  await sql`
    UPDATE signature_requests
    SET
      status = 'signed',
      completed_at = NOW(),
      updated_at = NOW()
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `

  // Download and store the signed document
  try {
    const documentBuffer = await downloadSignedDocument(
      event.signatureRequest.signatureRequestId
    )

    // Store document (you could upload to S3, Vercel Blob, etc.)
    await sql`
      UPDATE signature_requests
      SET
        signed_document_url = ${`/api/documents/download/${event.signatureRequest.signatureRequestId}`}
      WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
    `

    // Get signature request details
    const result = await sql`
      SELECT user_id, title, metadata
      FROM signature_requests
      WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
    `

    if (result.length > 0) {
      const signatureRequest = result[0]

      // Send completion notification
      await sendCompletionNotification(
        signatureRequest.user_id as string,
        signatureRequest.title as string,
        event.signatureRequest.signatureRequestId
      )
    }
  } catch (error) {
    // Document download failed - will need manual retrieval
  }
}

async function handleSignatureRequestDeclined(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest || !event.signature) return

  await sql`
    UPDATE signature_requests
    SET
      status = 'declined',
      updated_at = NOW()
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `

  // Log the decline event
  await sql`
    INSERT INTO signature_events (
      signature_request_id,
      event_type,
      signer_email,
      event_time,
      event_hash
    ) VALUES (
      ${event.signatureRequest.signatureRequestId},
      'declined',
      ${event.signature.signerEmailAddress},
      ${event.eventTime.toISOString()},
      ${event.eventHash}
    )
  `

  // Get signature request details
  const result = await sql`
    SELECT user_id, title
    FROM signature_requests
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `

  if (result.length > 0) {
    const signatureRequest = result[0]

    // Send notification to document owner
    await sendSignatureNotification(
      signatureRequest.user_id as string,
      signatureRequest.title as string,
      event.signature.signerEmailAddress,
      'declined'
    )
  }
}

async function handleSignatureRequestExpired(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest) return

  await sql`
    UPDATE signature_requests
    SET
      status = 'expired',
      updated_at = NOW()
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `
}

async function handleSignatureRequestCancelled(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest) return

  await sql`
    UPDATE signature_requests
    SET
      status = 'cancelled',
      updated_at = NOW()
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `
}

async function handleSignatureRequestInvalid(event: ReturnType<typeof parseWebhookEvent>) {
  if (!event.signatureRequest) return

  await sql`
    UPDATE signature_requests
    SET
      status = 'invalid',
      updated_at = NOW()
    WHERE signature_request_id = ${event.signatureRequest.signatureRequestId}
  `
}

// Notification helpers

async function sendSignatureNotification(
  userId: string,
  documentTitle: string,
  signerEmail: string,
  action: 'signed' | 'declined'
) {
  try {
    // Get user email
    const userResult = await sql`
      SELECT email FROM users WHERE id = ${userId}
    `

    if (userResult.length === 0) return

    const userEmail = userResult[0].email as string
    const actionText = action === 'signed' ? 'signed' : 'declined to sign'

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@astartupbiz.com',
      to: userEmail,
      subject: `Document ${action === 'signed' ? 'Signed' : 'Declined'}: ${documentTitle}`,
      html: `
        <h2>Document ${action === 'signed' ? 'Signed' : 'Declined'}</h2>
        <p>${signerEmail} has ${actionText} "${documentTitle}".</p>
        <p>View the document status in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/documents">dashboard</a>.</p>
      `,
    })
  } catch (error) {
    // Notification email failed - non-critical
  }
}

async function sendCompletionNotification(
  userId: string,
  documentTitle: string,
  signatureRequestId: string
) {
  try {
    // Get user email
    const userResult = await sql`
      SELECT email FROM users WHERE id = ${userId}
    `

    if (userResult.length === 0) return

    const userEmail = userResult[0].email as string

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@astartupbiz.com',
      to: userEmail,
      subject: `Document Complete: ${documentTitle}`,
      html: `
        <h2>All Signatures Collected</h2>
        <p>All parties have signed "${documentTitle}".</p>
        <p>The signed document is now available for download in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/documents">dashboard</a>.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/documents/download/${signatureRequestId}">Download Signed Document</a></p>
      `,
    })
  } catch (error) {
    // Completion notification email failed - non-critical
  }
}
