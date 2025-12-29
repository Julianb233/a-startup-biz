# Document Signing Integration

Comprehensive document signing functionality using Dropbox Sign (HelloSign) API for partner agreements, service contracts, NDAs, and custom legal documents.

## Features

- Upload documents for signature or use reusable templates
- Embedded signing (iframe) or email-based signing
- Sequential or parallel signing workflows
- Real-time webhook events for signature status
- Automatic document storage and retrieval
- Email notifications for signature events
- Reminder system for pending signatures
- Template management for common documents

## Architecture

### Components

1. **lib/document-signing.ts** - Core API integration
   - Signature request creation (upload & template)
   - Embedded signing URL generation
   - Status checking and document download
   - Webhook signature verification
   - Template management

2. **API Routes**
   - `POST /api/documents/sign` - Create signature request
   - `GET /api/documents/sign` - List signature requests
   - `GET /api/documents/status/[id]` - Get signature status
   - `POST /api/documents/status/[id]` - Perform actions (remind, cancel, get sign URL)
   - `POST /api/documents/webhook` - Dropbox Sign webhook handler

3. **React Components**
   - `DocumentSignature` - Embedded iframe signing component
   - `DocumentSignatureModal` - Full-screen signing modal
   - `DocumentSignatureButton` - Simple button for external signing

### Database Schema

**signature_requests** - Main signature request records
```sql
- id (SERIAL PRIMARY KEY)
- signature_request_id (VARCHAR, UNIQUE)
- user_id (VARCHAR)
- document_type (VARCHAR)
- title (VARCHAR)
- status (VARCHAR)
- embedded (BOOLEAN)
- signers (JSONB)
- metadata (JSONB)
- signed_document_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- completed_at (TIMESTAMP)
- expires_at (TIMESTAMP)
```

**signature_events** - Event log for signature activities
```sql
- id (SERIAL PRIMARY KEY)
- signature_request_id (VARCHAR, FK)
- event_type (VARCHAR)
- signer_email (VARCHAR)
- event_time (TIMESTAMP)
- event_hash (VARCHAR)
- event_data (JSONB)
- created_at (TIMESTAMP)
```

## Setup

### 1. Install Dependencies

Already included in package.json:
```bash
npm install @dropbox/sign
```

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# Dropbox Sign (HelloSign) - Document Signing
DROPBOX_SIGN_API_KEY=your_api_key_here
DROPBOX_SIGN_CLIENT_ID=your_client_id_here

# Document Templates (optional)
DROPBOX_SIGN_TEMPLATE_PARTNER_AGREEMENT=template_id_here
DROPBOX_SIGN_TEMPLATE_SERVICE_CONTRACT=template_id_here
DROPBOX_SIGN_TEMPLATE_NDA=template_id_here
```

**How to get credentials:**

1. Sign up at [Dropbox Sign](https://www.hellosign.com/)
2. Go to Settings → API
3. Generate API Key
4. For embedded signing: Create an API App to get Client ID
5. Enable Production mode when ready

### 3. Create Database Tables

Run the migration script:

```bash
npx tsx scripts/create-signature-requests-table.ts
```

Or add to package.json:
```json
{
  "scripts": {
    "db:signature-requests": "tsx scripts/create-signature-requests-table.ts"
  }
}
```

Then run:
```bash
npm run db:signature-requests
```

### 4. Configure Webhook

Set up webhook in Dropbox Sign dashboard:

1. Go to Settings → API → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/documents/webhook`
3. Select events:
   - signature_request_sent
   - signature_request_viewed
   - signature_request_signed
   - signature_request_all_signed
   - signature_request_declined
   - signature_request_expired
   - signature_request_cancelled

## Usage Examples

### 1. Upload Document for Signature

Create a signature request from an uploaded file:

```typescript
// Server-side (API route or server action)
import { createSignatureRequest, DocumentType } from '@/lib/document-signing'

async function requestSignature(file: File, partnerEmail: string) {
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const signatureRequest = await createSignatureRequest(
    fileBuffer,
    file.name,
    {
      type: DocumentType.PARTNER_AGREEMENT,
      title: 'Partner Agreement - ABC Company',
      subject: 'Please sign our partner agreement',
      message: 'Welcome to our partner program! Please review and sign this agreement.',
      signers: [
        {
          name: 'John Partner',
          email: partnerEmail,
          order: 1,
        },
        {
          name: 'Admin User',
          email: 'admin@astartupbiz.com',
          order: 2, // Signs after partner
        },
      ],
      ccEmails: ['legal@astartupbiz.com'],
      testMode: false, // Set to true for testing
    }
  )

  return signatureRequest
}
```

### 2. Create from Template

Use a predefined template:

```typescript
import { createSignatureRequestFromTemplate, DOCUMENT_TEMPLATES } from '@/lib/document-signing'

async function requestSignatureFromTemplate(partnerData: {
  name: string
  email: string
  companyName: string
}) {
  const signatureRequest = await createSignatureRequestFromTemplate({
    templateId: DOCUMENT_TEMPLATES.PARTNER_AGREEMENT,
    signerRoles: {
      Partner: {
        name: partnerData.name,
        email: partnerData.email,
      },
      Admin: {
        name: 'Admin User',
        email: 'admin@astartupbiz.com',
      },
    },
    customFields: {
      company_name: partnerData.companyName,
      effective_date: new Date().toLocaleDateString(),
    },
    title: `Partner Agreement - ${partnerData.companyName}`,
    testMode: false,
  })

  return signatureRequest
}
```

### 3. Embedded Signing Component

Use the React component for in-app signing:

```tsx
'use client'

import { DocumentSignature } from '@/components/DocumentSignature'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignDocumentPage({ signatureRequestId }: { signatureRequestId: string }) {
  const router = useRouter()
  const [signerEmail] = useState('partner@example.com')

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <DocumentSignature
        signatureRequestId={signatureRequestId}
        signerEmail={signerEmail}
        onSigned={() => {
          console.log('Document signed!')
          router.push('/dashboard/documents?status=signed')
        }}
        onDeclined={() => {
          console.log('Document declined')
          router.push('/dashboard/documents?status=declined')
        }}
        onError={(error) => {
          console.error('Signature error:', error)
        }}
        height="700px"
      />
    </div>
  )
}
```

### 4. Full-Screen Modal Signing

Better UX for mobile and focused signing:

```tsx
'use client'

import { DocumentSignatureModal } from '@/components/DocumentSignature'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function DocumentList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDocId, setCurrentDocId] = useState('')

  const openSigningModal = (signatureRequestId: string) => {
    setCurrentDocId(signatureRequestId)
    setIsModalOpen(true)
  }

  return (
    <>
      <Button onClick={() => openSigningModal('abc123')}>
        Sign Document
      </Button>

      <DocumentSignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        signatureRequestId={currentDocId}
        signerEmail="partner@example.com"
        onSigned={() => {
          console.log('Signed!')
          // Refresh document list
        }}
      />
    </>
  )
}
```

### 5. Simple External Signing

Open signing in a new tab:

```tsx
import { DocumentSignatureButton } from '@/components/DocumentSignature'

export default function QuickSign({ signatureRequestId }: { signatureRequestId: string }) {
  return (
    <DocumentSignatureButton
      signatureRequestId={signatureRequestId}
      signerEmail="partner@example.com"
      onSigned={() => {
        console.log('Document signed!')
      }}
    >
      Click to Sign
    </DocumentSignatureButton>
  )
}
```

### 6. Check Signature Status

```typescript
import { getSignatureRequestStatus } from '@/lib/document-signing'

async function checkStatus(signatureRequestId: string) {
  const status = await getSignatureRequestStatus(signatureRequestId)

  console.log('Status:', status.status)
  console.log('Signers:', status.signers)

  // Download signed document if complete
  if (status.status === 'signed') {
    const document = await downloadSignedDocument(signatureRequestId)
    // Save to storage or send to user
  }
}
```

### 7. Send Reminder

```typescript
import { sendSignatureReminder } from '@/lib/document-signing'

async function remindSigner(signatureRequestId: string, signerEmail: string) {
  await sendSignatureReminder(signatureRequestId, signerEmail)
  console.log(`Reminder sent to ${signerEmail}`)
}
```

### 8. Cancel Signature Request

```typescript
import { cancelSignatureRequest } from '@/lib/document-signing'

async function cancelRequest(signatureRequestId: string) {
  await cancelSignatureRequest(signatureRequestId)
  console.log('Signature request cancelled')
}
```

## API Endpoint Examples

### Create Signature Request (Upload Method)

```bash
POST /api/documents/sign
Content-Type: multipart/form-data

{
  "method": "upload",
  "embedded": true,
  "file": <file>,
  "documentType": "partner_agreement",
  "title": "Partner Agreement - ABC Company",
  "subject": "Please sign our partner agreement",
  "message": "Welcome!",
  "signers": [
    {"name": "John Partner", "email": "partner@example.com", "order": 1}
  ],
  "ccEmails": ["legal@astartupbiz.com"],
  "testMode": false
}
```

### Create from Template

```bash
POST /api/documents/sign
Content-Type: multipart/form-data

{
  "method": "template",
  "templateId": "template_abc123",
  "documentType": "nda",
  "title": "NDA - XYZ Corp",
  "signers": [
    {"name": "Jane Client", "email": "client@example.com", "role": "Client"},
    {"name": "Admin", "email": "admin@astartupbiz.com", "role": "Company"}
  ],
  "customFields": {
    "company_name": "XYZ Corp",
    "effective_date": "2025-01-01"
  }
}
```

### List Signature Requests

```bash
GET /api/documents/sign?documentType=partner_agreement&status=awaiting_signature&limit=20
```

### Get Status

```bash
GET /api/documents/status/abc123
```

### Send Reminder

```bash
POST /api/documents/status/abc123
Content-Type: application/json

{
  "action": "sendReminder",
  "signerEmail": "partner@example.com"
}
```

## Webhook Events

The webhook handler processes these events automatically:

### signature_request_sent
- Triggered when signature request is sent to signers
- Updates status to `awaiting_signature`

### signature_request_viewed
- Triggered when a signer views the document
- Logs view event in `signature_events` table

### signature_request_signed
- Triggered when a signer completes their signature
- Logs signature event
- Sends notification to document owner

### signature_request_all_signed
- Triggered when all signers have completed
- Downloads and stores signed document
- Updates status to `signed`
- Sends completion notification

### signature_request_declined
- Triggered when a signer declines to sign
- Updates status to `declined`
- Sends notification to document owner

### signature_request_expired
- Triggered when signature request expires
- Updates status to `expired`

### signature_request_cancelled
- Triggered when request is cancelled
- Updates status to `cancelled`

## Document Types

Predefined document types:

```typescript
enum DocumentType {
  PARTNER_AGREEMENT = 'partner_agreement',
  SERVICE_CONTRACT = 'service_contract',
  NDA = 'nda',
  CUSTOM = 'custom',
}
```

## Security

### Webhook Signature Verification

All webhook events are verified using HMAC-SHA256:

```typescript
import { verifyWebhookSignature } from '@/lib/document-signing'

const isValid = verifyWebhookSignature(
  eventJson,
  signature,
  apiKey
)
```

### Access Control

- Users can only access their own signature requests
- Clerk authentication required for all API endpoints
- Signature verification prevents webhook spoofing

## Best Practices

1. **Use Templates** - Create reusable templates in Dropbox Sign for common documents
2. **Test Mode** - Always test with `testMode: true` before production
3. **Sequential Signing** - Use `order` field for documents requiring specific signing order
4. **Email Notifications** - Configure custom email messages for better UX
5. **Webhook Security** - Always verify webhook signatures
6. **Status Polling** - For non-webhook integrations, poll status every 30-60 seconds
7. **Error Handling** - Handle API errors gracefully with user-friendly messages
8. **Document Storage** - Store signed documents in secure cloud storage (S3, Vercel Blob)

## Troubleshooting

### Webhook not receiving events

1. Check webhook URL is publicly accessible
2. Verify SSL certificate is valid
3. Check Dropbox Sign dashboard for webhook delivery failures
4. Ensure webhook signature verification is working

### Embedded signing not loading

1. Verify `DROPBOX_SIGN_CLIENT_ID` is set
2. Check browser console for iframe errors
3. Ensure domain is whitelisted in Dropbox Sign app settings

### Signature request fails

1. Check API key has correct permissions
2. Verify file format is supported (PDF recommended)
3. Ensure signer emails are valid
4. Check test mode vs production mode

## Production Checklist

- [ ] Set up production API key in Dropbox Sign
- [ ] Configure webhook URL in production
- [ ] Set `testMode: false` for all signature requests
- [ ] Configure custom branding in Dropbox Sign
- [ ] Set up document storage (S3, Vercel Blob)
- [ ] Test full signing flow end-to-end
- [ ] Set up monitoring for webhook failures
- [ ] Configure email notifications
- [ ] Create templates for common documents
- [ ] Add error tracking (Sentry)

## Advanced Features

### Custom Branding

Configure in Dropbox Sign dashboard:
- Logo
- Brand colors
- Custom email templates
- Custom domain

### Bulk Signing

Send same document to multiple signers:

```typescript
const signers = partners.map((partner, index) => ({
  name: partner.name,
  email: partner.email,
  order: index,
}))

await createSignatureRequest(fileBuffer, fileName, {
  type: DocumentType.PARTNER_AGREEMENT,
  title: 'Partner Agreement',
  signers,
  testMode: false,
})
```

### Conditional Fields

Use Dropbox Sign text tags for conditional fields:

```
[sig|req|signer1] - Required signature
[text|company_name] - Text field
[date|effective_date] - Date field
[checkbox|agree_to_terms] - Checkbox
```

## Support

- Dropbox Sign Docs: https://developers.hellosign.com/
- API Reference: https://developers.hellosign.com/api/reference
- Support: https://support.hellosign.com/

## License

Part of A Startup Biz platform - Internal use only
