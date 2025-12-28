# Email System Implementation Checklist

Use this checklist to verify the email system is properly set up.

## 1. Package Installation

- [ ] Install `@react-email/render`
  ```bash
  npm install @react-email/render
  ```

- [ ] Verify installation
  ```bash
  node lib/email/package-check.js
  ```

## 2. Environment Configuration

- [ ] Create `.env.local` from `.env.example`
  ```bash
  cp .env.example .env.local
  ```

- [ ] Get Resend API key
  - Sign up at [resend.com](https://resend.com)
  - Verify your domain or use test domain
  - Create API key from dashboard

- [ ] Add API key to `.env.local`
  ```env
  RESEND_API_KEY=re_xxxxxxxxxxxxx
  EMAIL_FROM="A Startup Biz <noreply@astartupbiz.com>"
  SUPPORT_EMAIL="support@astartupbiz.com"
  ADMIN_EMAIL="admin@astartupbiz.com"
  ```

- [ ] Restart development server
  ```bash
  npm run dev
  ```

## 3. Verify File Structure

Check all files are in place:

```
lib/email/
├── send.ts                          ✓
├── components/
│   └── EmailLayout.tsx             ✓
├── templates/
│   ├── index.ts                    ✓
│   ├── onboarding-confirmation.tsx ✓
│   ├── payment-invoice.tsx         ✓
│   └── welcome.tsx                 ✓
├── README.md                        ✓
├── INSTALL.md                       ✓
├── SUMMARY.md                       ✓
└── CHECKLIST.md                     ✓ (you are here)

app/api/email/send/
└── route.ts                         ✓
```

Run verification:
```bash
node lib/email/package-check.js
```

## 4. Test Email System

### Option A: Via API Endpoint

- [ ] Get available templates
  ```bash
  curl http://localhost:3000/api/email/send
  ```

- [ ] Send test welcome email
  ```bash
  curl -X POST http://localhost:3000/api/email/send \
    -H "Content-Type: application/json" \
    -d '{
      "to": "your-email@example.com",
      "template": "welcome",
      "templateData": {
        "name": "Test User",
        "accountType": "free"
      }
    }'
  ```

- [ ] Check email inbox or Resend dashboard

### Option B: Via Test Script

- [ ] Run test script (from server component or API route)
  ```typescript
  import { testEmailSystem } from '@/lib/email/test-email';
  await testEmailSystem('your-email@example.com');
  ```

### Option C: Direct Import Test

- [ ] Test in API route or server action
  ```typescript
  import { sendEmailWithTemplate } from '@/lib/email/send';
  import { WelcomeEmail } from '@/lib/email/templates';

  const result = await sendEmailWithTemplate(
    WelcomeEmail({ name: 'Test' }),
    { to: 'test@example.com', subject: 'Test' }
  );

  console.log(result);
  ```

## 5. Integration

Integrate with your existing forms and workflows:

### Onboarding Form
- [ ] Import template
  ```typescript
  import { sendEmailWithTemplate } from '@/lib/email/send';
  import { OnboardingConfirmation } from '@/lib/email/templates';
  ```

- [ ] Send after form submission
  ```typescript
  await sendEmailWithTemplate(
    OnboardingConfirmation({
      customerName: formData.name,
      businessName: formData.businessName,
    }),
    {
      to: formData.email,
      subject: 'We Received Your Onboarding Information',
    }
  );
  ```

### Payment Flow
- [ ] Import invoice template
  ```typescript
  import { PaymentInvoice } from '@/lib/email/templates';
  ```

- [ ] Send after payment initiated
  ```typescript
  await sendEmailWithTemplate(
    PaymentInvoice({
      customerName: 'Customer Name',
      invoiceNumber: 'INV-001',
      items: orderItems,
      subtotal: calculateSubtotal(orderItems),
      tax: calculateTax(subtotal),
      total: subtotal + tax,
      dueDate: formatDate(dueDate),
      paymentLink: generatePaymentLink(invoiceId),
    }),
    {
      to: customer.email,
      subject: `Invoice ${invoiceNumber} - Payment Required`,
    }
  );
  ```

### User Registration
- [ ] Send welcome email after signup
  ```typescript
  await sendEmailWithTemplate(
    WelcomeEmail({
      name: user.name,
      accountType: user.plan,
    }),
    {
      to: user.email,
      subject: 'Welcome to A Startup Biz!',
    }
  );
  ```

## 6. Monitoring

- [ ] Check Resend dashboard for delivery stats
  - Go to [resend.com/dashboard](https://resend.com/dashboard)
  - View sent emails
  - Check delivery status
  - Monitor bounce/spam rates

- [ ] Set up webhooks (optional)
  - Configure webhook URL in Resend
  - Handle delivery/bounce events
  - Track email engagement

## 7. Production Checklist

Before deploying to production:

- [ ] Verify domain in Resend
  - Add DNS records
  - Wait for verification
  - Update `EMAIL_FROM` to use verified domain

- [ ] Update environment variables in production
  - Add `RESEND_API_KEY` to production env
  - Set correct `EMAIL_FROM` address
  - Configure `ADMIN_EMAIL` and `SUPPORT_EMAIL`

- [ ] Test in production (staging first if available)
  - Send test emails
  - Verify delivery
  - Check spam score

- [ ] Monitor email logs
  - Check Next.js logs for email errors
  - Monitor Resend dashboard
  - Set up alerts for failures

## 8. Documentation

- [ ] Read full documentation
  - [ ] `/lib/email/README.md` - Complete reference
  - [ ] `/lib/email/INSTALL.md` - Installation guide
  - [ ] `/lib/email/SUMMARY.md` - Implementation overview

- [ ] Review TypeScript types
  - [ ] `/lib/email-types.ts` - Type definitions
  - [ ] Template prop interfaces

- [ ] Understand API endpoint
  - [ ] `/app/api/email/send/route.ts` - API route code
  - [ ] Request/response formats
  - [ ] Error handling

## 9. Troubleshooting

Common issues and solutions:

- [ ] "Module not found: @react-email/render"
  - Solution: `npm install @react-email/render`

- [ ] "RESEND_API_KEY is not set"
  - Solution: Add to `.env.local` and restart dev server

- [ ] Emails not sending
  - Check API key is correct
  - Verify domain in Resend (or use test domain)
  - Check console for errors
  - Verify `EMAIL_FROM` matches verified domain

- [ ] TypeScript errors
  - Run: `npm install --save-dev @types/react`
  - Check all imports are correct
  - Verify prop types match interfaces

- [ ] Template rendering errors
  - Ensure `@react-email/render` is installed
  - Check React component syntax
  - Verify all props are provided

## 10. Next Steps

- [ ] Create additional custom templates as needed
- [ ] Set up email analytics tracking
- [ ] Configure SPF/DKIM for better deliverability
- [ ] Add unsubscribe links for marketing emails
- [ ] Implement email preferences system
- [ ] Add A/B testing for email content
- [ ] Set up automated email sequences

## Support

Need help?
- Documentation: `/lib/email/README.md`
- Resend docs: [resend.com/docs](https://resend.com/docs)
- React Email docs: [react.email](https://react.email)
- Run package check: `node lib/email/package-check.js`

---

**Status**: Complete when all checkboxes are ticked.
