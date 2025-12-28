# Email System Documentation

Complete email notification system for A Startup Biz using Resend and React Email components.

## Structure

```
lib/email/
├── send.ts                          # Core email sending utilities
├── components/
│   └── EmailLayout.tsx             # Reusable email components
├── templates/
│   ├── index.ts                    # Template exports
│   ├── onboarding-confirmation.tsx # Onboarding email
│   ├── payment-invoice.tsx         # Invoice with payment link
│   └── welcome.tsx                 # Welcome email
```

## Installation

**IMPORTANT:** You need to install `@react-email/render` to use the React component templates:

```bash
npm install @react-email/render
# or
yarn add @react-email/render
# or
pnpm add @react-email/render
```

The project already has `resend` installed.

## Environment Variables

Add these to your `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM="A Startup Biz <noreply@astartupbiz.com>"
SUPPORT_EMAIL="support@astartupbiz.com"
ADMIN_EMAIL="admin@astartupbiz.com"
```

## Usage

### 1. Using Template Components (Recommended)

```typescript
import { sendEmailWithTemplate } from '@/lib/email/send';
import { WelcomeEmail } from '@/lib/email/templates';

// Send welcome email
await sendEmailWithTemplate(
  WelcomeEmail({
    name: 'John Doe',
    accountType: 'paid',
  }),
  {
    to: 'john@example.com',
    subject: 'Welcome to A Startup Biz!',
  }
);
```

### 2. Using API Endpoint

```typescript
// POST /api/email/send
const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'customer@example.com',
    template: 'welcome',
    templateData: {
      name: 'Jane Smith',
      accountType: 'trial',
    },
  }),
});
```

### 3. Direct Email Sending

```typescript
import { sendEmail } from '@/lib/email/send';

await sendEmail({
  to: 'customer@example.com',
  subject: 'Custom Email',
  html: '<p>Your HTML content</p>',
  text: 'Plain text version',
  replyTo: 'support@astartupbiz.com',
});
```

## Available Templates

### 1. Welcome Email

Sent to new users after registration or payment.

```typescript
import { WelcomeEmail } from '@/lib/email/templates';

WelcomeEmail({
  name: 'John Doe',
  accountType: 'paid', // 'free' | 'paid' | 'trial'
  nextSteps: ['Step 1', 'Step 2'], // Optional custom steps
});
```

### 2. Onboarding Confirmation

Sent after user completes onboarding form.

```typescript
import { OnboardingConfirmation } from '@/lib/email/templates';

OnboardingConfirmation({
  customerName: 'Jane Smith',
  businessName: 'My Awesome Startup',
});
```

### 3. Payment Invoice

Invoice email with payment link.

```typescript
import { PaymentInvoice } from '@/lib/email/templates';

PaymentInvoice({
  customerName: 'John Doe',
  invoiceNumber: 'INV-001',
  items: [
    {
      name: 'Website Design',
      description: 'Custom responsive design',
      price: 2500,
      quantity: 1,
    },
    {
      name: 'SEO Package',
      price: 500,
      quantity: 1,
    },
  ],
  subtotal: 3000,
  tax: 240,
  total: 3240,
  dueDate: '2025-01-31',
  paymentLink: 'https://pay.astartupbiz.com/invoice/INV-001',
  currency: 'USD', // Optional, defaults to USD
});
```

## API Endpoint Reference

### POST /api/email/send

Send emails with template or custom content.

**Request Body:**

```typescript
{
  to: string | string[];        // Recipient email(s)
  subject?: string;             // Subject (required if not using template)
  template?: string;            // Template name
  templateData?: object;        // Data for template
  html?: string;                // Custom HTML content
  body?: string;                // Plain text content
  replyTo?: string;             // Reply-to email
}
```

**Response:**

```typescript
{
  success: boolean;
  message?: string;
  data?: any;                   // Resend response data
  mock?: boolean;               // True if in mock mode (no API key)
  error?: string;               // Error message if failed
  details?: any;                // Error details
}
```

### GET /api/email/send

Get list of available templates and their required data.

**Response:**

```typescript
{
  success: true;
  templates: Array<{
    name: string;
    description: string;
    requiredData: object;
    exampleData: object;
  }>;
  count: number;
}
```

## Email Components

Reusable components for building custom templates:

```typescript
import {
  EmailLayout,      // Main layout wrapper
  EmailCard,        // Content card
  EmailButton,      // CTA button
  EmailIcon,        // Icon badge
  EmailCallout,     // Info box
} from '@/lib/email/components/EmailLayout';

// Example custom template
export default function CustomEmail({ name }: { name: string }) {
  return (
    <EmailLayout previewText="Preview text here">
      <EmailCard>
        <EmailIcon emoji="🎉" />
        <h2>Hello {name}!</h2>
        <EmailCallout type="info">
          <p>Important information here</p>
        </EmailCallout>
        <EmailButton href="https://example.com">
          Take Action
        </EmailButton>
      </EmailCard>
    </EmailLayout>
  );
}
```

### Component Props

**EmailLayout**
- `children: ReactNode` - Main content
- `previewText?: string` - Email preview text

**EmailCard**
- `children: ReactNode` - Card content

**EmailButton**
- `href: string` - Link URL
- `children: ReactNode` - Button text
- `color?: 'primary' | 'secondary' | 'success'`

**EmailIcon**
- `emoji: string` - Emoji to display
- `color?: 'primary' | 'secondary' | 'success'`

**EmailCallout**
- `children: ReactNode` - Callout content
- `type?: 'info' | 'success' | 'warning'`

## Utility Functions

Convenience wrappers for common email operations:

```typescript
import {
  sendEmail,
  sendEmailWithTemplate,
  sendBatchEmails,
  sendAdminEmail,
  sendSupportEmail,
} from '@/lib/email/send';

// Send to admin
await sendAdminEmail(
  'New Contact Submission',
  '<p>Contact details...</p>'
);

// Send to support team
await sendSupportEmail(
  'Customer Issue',
  '<p>Issue details...</p>'
);

// Send multiple emails
await sendBatchEmails([
  { to: 'user1@example.com', subject: 'Subject 1', html: '<p>...</p>' },
  { to: 'user2@example.com', subject: 'Subject 2', html: '<p>...</p>' },
]);
```

## Development Mode

When `RESEND_API_KEY` is not set or is `'placeholder'`, the system runs in mock mode:

- Emails are logged to console instead of being sent
- Returns `{ success: true, mock: true }`
- Useful for local development without API keys

## Testing Templates Locally

You can test email templates without sending:

```typescript
import { render } from '@react-email/render';
import { WelcomeEmail } from '@/lib/email/templates';

// Render to HTML string
const html = render(WelcomeEmail({ name: 'Test User' }));
console.log(html); // View the generated HTML
```

## Rate Limiting

The `/api/email/send` endpoint has rate limiting enabled via `withRateLimit`:

- Prevents abuse
- Configurable in `/lib/rate-limit.ts`

## Error Handling

All email functions return a result object:

```typescript
const result = await sendEmail({...});

if (!result.success) {
  console.error('Email failed:', result.error);
  // Handle error
} else {
  console.log('Email sent:', result.data);
}
```

## TypeScript Types

All types are exported from `/lib/email-types.ts`:

```typescript
import type {
  EmailSendOptions,
  EmailSendResult,
  WelcomeEmailData,
  OnboardingConfirmationData,
  PaymentInvoiceProps,
  SendEmailRequest,
  SendEmailResponse,
} from '@/lib/email-types';
```

## Next Steps

1. **Install @react-email/render**: `npm install @react-email/render`
2. **Set up Resend**: Get API key from [resend.com](https://resend.com)
3. **Configure environment**: Add variables to `.env.local`
4. **Test in development**: Use mock mode first
5. **Create custom templates**: Use components in `lib/email/components/`
6. **Integrate with forms**: Call from onboarding, payment flows, etc.

## Existing Templates in `/lib/email.ts`

The legacy templates in `/lib/email.ts` are still available:

- `orderConfirmationEmail()`
- `welcomeEmail()`
- `consultationBookedEmail()`
- `onboardingSubmittedEmail()`
- `adminNewContactEmail()`
- `adminNewOnboardingEmail()`
- `adminNewOrderEmail()`
- `notificationEmail()`

You can gradually migrate these to React components for better maintainability.

## Support

For issues or questions:
- Check Resend docs: [resend.com/docs](https://resend.com/docs)
- React Email docs: [react.email/docs](https://react.email/docs)
