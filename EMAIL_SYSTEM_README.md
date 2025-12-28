# Email Notification System

Comprehensive email notification system built with **Resend** and Next.js App Router.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Email Templates](#email-templates)
- [Utility Functions](#utility-functions)
- [Usage Examples](#usage-examples)
- [Integration Points](#integration-points)
- [Testing](#testing)

---

## Overview

The email system provides:
- **Resend integration** for reliable email delivery
- **REST API endpoints** for sending emails
- **Pre-built templates** for common scenarios
- **Type-safe utilities** for easy integration
- **Rate limiting** to prevent abuse

### Tech Stack

- **Email Provider**: Resend
- **Framework**: Next.js 16 (App Router)
- **Validation**: Zod
- **Type Safety**: TypeScript
- **Testing**: Vitest

---

## Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Resend Email
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM="A Startup Biz <noreply@astartupbiz.com>"
SUPPORT_EMAIL=support@astartupbiz.com
ADMIN_EMAIL=admin@astartupbiz.com
```

### Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add to `.env.local`

---

## API Endpoints

### POST /api/email/send

Send an email using the configured provider.

**Request Body:**

```typescript
{
  to: string | string[],           // Recipient(s)
  subject: string,                  // Email subject
  body?: string,                    // Plain text body
  html?: string,                    // HTML body
  template?: string,                // Template name
  templateData?: object,            // Data for template
  replyTo?: string                  // Reply-to address
}
```

**Example: Send plain email**

```typescript
const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Hello!',
    html: '<h1>Welcome!</h1>'
  })
});
```

**Example: Send template-based email**

```typescript
const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Welcome aboard!',
    template: 'welcome',
    templateData: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  })
});
```

**Response:**

```typescript
{
  success: true,
  message: "Email sent successfully",
  data: { id: "email-id-123" },
  mock: false  // true if using placeholder API key
}
```

---

### GET /api/email/templates

List available email templates.

**Example:**

```bash
GET /api/email/templates
```

**Response:**

```json
{
  "success": true,
  "templates": [
    {
      "name": "welcome",
      "description": "Welcome email for new users",
      "requiredData": {
        "name": "string - User name",
        "email": "string - User email"
      },
      "exampleData": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 5
}
```

**Get specific template:**

```bash
GET /api/email/templates?name=welcome
```

---

## Email Templates

### 1. Welcome Email

Send to new users after registration.

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail({
  name: 'John Doe',
  email: 'john@example.com'
});
```

---

### 2. Onboarding Confirmation

Sent after onboarding form submission.

```typescript
import { sendOnboardingConfirmation } from '@/lib/email';

await sendOnboardingConfirmation({
  customerName: 'Jane Smith',
  businessName: 'Acme Corp',
  email: 'jane@acme.com'
});
```

---

### 3. Order Confirmation

Sent after successful order placement.

```typescript
import { sendOrderConfirmation } from '@/lib/email';

await sendOrderConfirmation({
  email: 'customer@example.com',
  customerName: 'Bob Johnson',
  orderId: 'ORD-12345',
  items: [
    { name: 'Web Design Package', price: 2500, quantity: 1 },
    { name: 'SEO Optimization', price: 1200, quantity: 1 }
  ],
  total: 3700
});
```

---

### 4. Consultation Booking

Confirmation for scheduled consultations.

```typescript
import { sendConsultationConfirmation } from '@/lib/email';

await sendConsultationConfirmation({
  email: 'client@example.com',
  customerName: 'Alice Williams',
  serviceType: 'Business Strategy',
  date: 'Monday, January 15, 2024',
  time: '2:00 PM EST'
});
```

---

### 5. Notification Email

Generic notification template for any purpose.

```typescript
import { sendNotification } from '@/lib/email';

await sendNotification({
  to: 'user@example.com',
  recipientName: 'User',
  title: 'Important Update',
  message: 'Your account has been updated successfully.',
  actionUrl: 'https://astartupbiz.com/dashboard',
  actionText: 'View Dashboard'
});
```

---

## Utility Functions

All utility functions are in `/lib/email.ts`:

```typescript
// Core email sending
sendEmail(options: EmailSendOptions): Promise<EmailSendResult>

// Template-based utilities
sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailSendResult>
sendOnboardingConfirmation(data: OnboardingConfirmationData): Promise<EmailSendResult>
sendOrderConfirmation(data: OrderConfirmationData): Promise<EmailSendResult>
sendConsultationConfirmation(data: ConsultationBookingData): Promise<EmailSendResult>
sendNotification(data: NotificationData): Promise<EmailSendResult>

// Admin notifications
adminNewContactEmail(data: AdminContactNotificationData): EmailTemplate
adminNewOnboardingEmail(data: AdminOnboardingNotificationData): EmailTemplate
adminNewOrderEmail(data: AdminOrderNotificationData): EmailTemplate
```

---

## Usage Examples

### In API Route

```typescript
// app/api/my-route/route.ts
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { name, email } = await request.json();

  // Send welcome email
  const result = await sendWelcomeEmail({ name, email });

  if (!result.success) {
    console.error('Email failed:', result.error);
  }

  return Response.json({ success: true });
}
```

### In Server Action

```typescript
// app/actions/user.ts
'use server';

import { sendWelcomeEmail } from '@/lib/email';

export async function registerUser(data: FormData) {
  const name = data.get('name') as string;
  const email = data.get('email') as string;

  // ... save user to database

  // Send welcome email (fire and forget)
  sendWelcomeEmail({ name, email }).catch(console.error);

  return { success: true };
}
```

### With Error Handling

```typescript
import { sendEmail } from '@/lib/email';

async function sendCustomEmail() {
  try {
    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello!</p>'
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    console.log('Email sent:', result.data);
  } catch (error) {
    console.error('Failed to send email:', error);
    // Handle error (retry, log, notify admin, etc.)
  }
}
```

---

## Integration Points

### Onboarding Flow

The onboarding system (`/app/api/onboarding/route.ts`) already integrates email:

1. **On submission** → sends confirmation to customer
2. **On submission** → sends notification to admin

```typescript
// Already implemented in /app/api/onboarding/route.ts
await sendEmail({
  to: validatedData.contactEmail,
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### Contact Form

Integrate with contact form:

```typescript
import { sendNotification, ADMIN_EMAIL } from '@/lib/email';

// Send confirmation to user
await sendNotification({
  to: userEmail,
  recipientName: userName,
  title: 'Thanks for contacting us!',
  message: 'We received your message and will respond within 24 hours.'
});

// Notify admin
await sendNotification({
  to: ADMIN_EMAIL,
  recipientName: 'Admin',
  title: 'New Contact Form Submission',
  message: `From: ${userName} (${userEmail})\n\n${message}`
});
```

### Order Checkout

Wire up to checkout flow:

```typescript
import { sendOrderConfirmation } from '@/lib/email';

// After successful payment
await sendOrderConfirmation({
  email: customer.email,
  customerName: customer.name,
  orderId: order.id,
  items: order.items,
  total: order.total
});
```

---

## Testing

### Run Tests

```bash
npm test tests/email.test.ts
```

### Test Coverage

The test suite covers:
- ✅ All email templates
- ✅ All utility functions
- ✅ Single and bulk recipients
- ✅ HTML and plain text emails
- ✅ Error handling

### Manual Testing

Test with Resend placeholder key (logs instead of sending):

```bash
RESEND_API_KEY=placeholder npm run dev
```

Emails will be logged to console instead of sent.

---

## File Structure

```
/root/github-repos/a-startup-biz/
├── app/
│   └── api/
│       └── email/
│           ├── send/
│           │   └── route.ts          # POST /api/email/send
│           └── templates/
│               └── route.ts          # GET /api/email/templates
├── lib/
│   ├── email.ts                      # Main email utilities
│   ├── email-types.ts                # TypeScript types
│   └── rate-limit.ts                 # Rate limiting (existing)
└── tests/
    └── email.test.ts                 # Email test suite
```

---

## Rate Limiting

Email endpoints are protected by rate limiting:

- **Default**: 10 requests per hour per IP
- **Onboarding**: 5 requests per hour per IP
- **Configurable** via `/lib/rate-limit.ts`

---

## Best Practices

### 1. Always Handle Errors

```typescript
const result = await sendWelcomeEmail(data);
if (!result.success) {
  console.error('Email failed:', result.error);
  // Don't fail the entire request - emails are auxiliary
}
```

### 2. Use Templates

Prefer utility functions over raw `sendEmail`:

```typescript
// Good ✅
await sendWelcomeEmail({ name, email });

// Avoid ❌
await sendEmail({
  to: email,
  subject: 'Welcome',
  html: '<html>...</html>'  // Manual HTML
});
```

### 3. Fire and Forget

Don't block user requests waiting for emails:

```typescript
// Send email async (don't await)
sendWelcomeEmail(data).catch(console.error);

// Continue processing
return Response.json({ success: true });
```

### 4. Admin Notifications

Always notify admins of important events:

```typescript
import { ADMIN_EMAIL, sendNotification } from '@/lib/email';

await sendNotification({
  to: ADMIN_EMAIL,
  recipientName: 'Admin',
  title: 'New High-Value Order',
  message: `Order ${orderId} - $${total}`
});
```

---

## Troubleshooting

### Emails not sending

1. Check `RESEND_API_KEY` is set correctly
2. Verify domain is verified in Resend dashboard
3. Check console logs for errors
4. Test with placeholder key first

### Rate limit errors

Increase limits in `/lib/rate-limit.ts`:

```typescript
const emailLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),  // 20 per hour
});
```

### Template not found

Ensure template name matches exactly:
- `welcome`
- `onboarding-confirmation`
- `order-confirmation`
- `consultation-booked`
- `notification`

---

## Future Enhancements

Potential improvements:

- [ ] Email queue for retry logic
- [ ] Email analytics dashboard
- [ ] A/B testing for templates
- [ ] Scheduled email sending
- [ ] Email preference management
- [ ] Custom template builder UI
- [ ] Bulk email campaigns
- [ ] Email open/click tracking

---

## Support

For issues or questions:
- Check `/tests/email.test.ts` for examples
- Review `/lib/email.ts` for implementation
- Contact: support@astartupbiz.com

---

**Built by Tyler-TypeScript** | **Project**: a-startup-biz | **Date**: 2025-12-28
