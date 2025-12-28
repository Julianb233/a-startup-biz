# Email System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Set API Key
```bash
# Add to .env.local
RESEND_API_KEY=re_your_key_here
```

Get your key: [resend.com/api-keys](https://resend.com/api-keys)

---

## 📧 Send Emails

### Method 1: Use Helper Functions (Recommended)
```typescript
import { sendOnboardingConfirmation } from '@/lib/email';

// In your API route or server action
await sendOnboardingConfirmation({
  customerName: 'Jane Smith',
  businessName: 'Acme Corp',
  email: 'jane@acmecorp.com'
});
```

### Method 2: Use API Endpoint
```typescript
// From client or server
const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    template: 'welcome',
    templateData: {
      name: 'John Doe',
      email: 'user@example.com'
    }
  })
});
```

### Method 3: Direct with Resend
```typescript
import { resend } from '@/lib/email';

await resend.emails.send({
  from: 'A Startup Biz <noreply@astartupbiz.com>',
  to: 'user@example.com',
  subject: 'Custom Email',
  html: '<h1>Hello!</h1>'
});
```

---

## 📋 Available Templates

### 1. Welcome Email
```typescript
await sendWelcomeEmail({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### 2. Onboarding Confirmation
```typescript
await sendOnboardingConfirmation({
  customerName: 'Jane Smith',
  businessName: 'Acme Corp',
  email: 'jane@acmecorp.com'
});
```

### 3. Order Confirmation
```typescript
await sendOrderConfirmation({
  email: 'customer@example.com',
  customerName: 'Bob Johnson',
  orderId: 'ORD-12345',
  items: [
    { name: 'Web Design', price: 2500, quantity: 1 }
  ],
  total: 2500
});
```

### 4. Consultation Booked
```typescript
await sendConsultationConfirmation({
  email: 'user@example.com',
  customerName: 'Alice',
  serviceType: 'Business Strategy',
  date: 'Monday, Jan 15',
  time: '2:00 PM EST'
});
```

### 5. Generic Notification
```typescript
await sendNotification({
  to: 'user@example.com',
  recipientName: 'User',
  title: 'Important Update',
  message: 'Your account has been updated.',
  actionUrl: 'https://astartupbiz.com/dashboard',
  actionText: 'View Dashboard'
});
```

---

## 🔧 Common Use Cases

### In Onboarding Flow
**Already Implemented!** See `/app/api/onboarding/route.ts`

```typescript
// After saving to database
await sendOnboardingConfirmation({
  customerName: data.contactName,
  businessName: data.companyName,
  email: data.contactEmail
});

// Notify admin
await sendEmail({
  to: ADMIN_EMAIL,
  subject: adminEmailContent.subject,
  html: adminEmailContent.html,
  replyTo: data.contactEmail
});
```

### In User Registration
```typescript
// app/api/register/route.ts
export async function POST(request: Request) {
  const { email, name } = await request.json();

  // Create user...

  // Send welcome email
  await sendWelcomeEmail({ name, email });

  return NextResponse.json({ success: true });
}
```

### In Order Processing
```typescript
// app/api/checkout/route.ts
export async function POST(request: Request) {
  const order = await createOrder(data);

  // Send confirmation
  await sendOrderConfirmation({
    email: order.customerEmail,
    customerName: order.customerName,
    orderId: order.id,
    items: order.items,
    total: order.total
  });

  return NextResponse.json({ orderId: order.id });
}
```

---

## 🎨 Custom HTML Emails

### Option 1: Template String
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Email',
  html: `
    <h1>Hello!</h1>
    <p>This is a custom HTML email.</p>
    <a href="https://example.com">Click here</a>
  `
});
```

### Option 2: React Components
```typescript
import { EmailLayout, EmailCard, EmailButton } from '@/lib/email/components/EmailLayout';
import { renderEmail } from '@/lib/email/render';

const MyCustomEmail = ({ name }: { name: string }) => (
  <EmailLayout>
    <EmailCard>
      <h2>Hello {name}!</h2>
      <EmailButton href="https://example.com">
        Get Started
      </EmailButton>
    </EmailCard>
  </EmailLayout>
);

const html = renderEmail(<MyCustomEmail name="John" />);

await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Email',
  html
});
```

---

## ⚡ Quick Reference

### Send to Multiple Recipients
```typescript
await sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  subject: 'Bulk Email',
  html: '<p>Message</p>'
});
```

### With Reply-To
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Contact',
  html: '<p>Message</p>',
  replyTo: 'support@astartupbiz.com'
});
```

### Error Handling
```typescript
const result = await sendEmail({ ... });

if (!result.success) {
  console.error('Email failed:', result.error);
  // Don't fail the request - emails are async
}
```

---

## 🔍 Debugging

### Check if Email Was Sent
```typescript
const result = await sendEmail({ ... });

console.log('Email sent:', result);
// { success: true, data: { id: 'email_abc123' } }
```

### View in Resend Dashboard
1. Go to [resend.com/emails](https://resend.com/emails)
2. Find your email by recipient
3. View delivery status, opens, clicks

### Development Mode (No API Key)
```typescript
// Will log instead of sending
const result = await sendEmail({ ... });
// { success: true, mock: true }
```

---

## 📊 Webhooks (Advanced)

### Handle Email Events
Webhooks automatically handle:
- ✅ Delivered
- ❌ Bounced (hard/soft)
- 📧 Opened
- 🔗 Clicked
- ⚠️ Spam complaints

See `/app/api/email/webhooks/route.ts`

### Configure in Resend
1. Go to [resend.com/webhooks](https://resend.com/webhooks)
2. Add webhook: `https://yourdomain.com/api/email/webhooks`
3. Select events
4. Copy webhook secret to `.env.local`

---

## 🚨 Troubleshooting

**Emails not sending?**
- Check `RESEND_API_KEY` is set
- Verify domain (production)
- Check Resend dashboard for errors

**Template not found?**
- Verify template name: `'welcome'`, `'onboarding-confirmation'`, etc.
- Check `/api/email/templates` for available templates

**Rate limited?**
- Default: 10 emails/min per IP
- Increase limit in `/lib/rate-limit.ts` if needed

---

## 📚 Documentation

- **Full Docs:** `EMAIL_SYSTEM_COMPLETE.md`
- **API Reference:** `/api/email/templates`
- **Resend Docs:** [resend.com/docs](https://resend.com/docs)

---

## ✅ Checklist

- [ ] Add `RESEND_API_KEY` to `.env.local`
- [ ] Test email sending in development
- [ ] Verify domain (production only)
- [ ] Configure webhooks
- [ ] Test onboarding email flow
- [ ] Review email templates

**That's it!** Email system is ready to use. 🎉
