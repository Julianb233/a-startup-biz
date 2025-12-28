# Email System Installation Guide

Quick setup guide for the email notification system.

## 1. Install Required Package

The email system uses React components for templates. You need to install `@react-email/render`:

```bash
npm install @react-email/render
```

or if using pnpm:

```bash
pnpm add @react-email/render
```

or if using yarn:

```bash
yarn add @react-email/render
```

**Note:** `resend` is already installed in the project.

## 2. Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your domain (or use the test domain for development)
3. Create an API key from the dashboard
4. Copy the API key (starts with `re_`)

## 3. Configure Environment Variables

Create or update `.env.local` in the project root:

```env
# Resend API Key (required)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email addresses (optional, defaults shown)
EMAIL_FROM="A Startup Biz <noreply@astartupbiz.com>"
SUPPORT_EMAIL="support@astartupbiz.com"
ADMIN_EMAIL="admin@astartupbiz.com"
```

## 4. Verify Installation

Test the email system:

```typescript
// In a server component or API route
import { sendEmail } from '@/lib/email/send';

const result = await sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<p>This is a test email</p>',
});

console.log(result); // Should log { success: true, data: {...} }
```

## 5. Test Templates

Try sending a template email:

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

## Development Mode (No API Key)

If you don't have a Resend API key yet, the system will run in mock mode:

- Emails are logged to console instead of being sent
- No actual emails are sent
- Useful for local development

Just leave `RESEND_API_KEY` unset or set it to `placeholder`.

## Troubleshooting

### "Module not found: @react-email/render"

Run: `npm install @react-email/render`

### "RESEND_API_KEY is not set"

This is just a warning. The system will work in mock mode. To use real email:
1. Get API key from resend.com
2. Add to `.env.local`
3. Restart dev server

### Emails not sending

1. Check API key is correct
2. Verify domain in Resend dashboard
3. Check console for error messages
4. Ensure `EMAIL_FROM` domain matches verified domain

### TypeScript errors

Make sure you have all type definitions:
```bash
npm install --save-dev @types/react
```

## Next Steps

1. Read the full documentation: `/lib/email/README.md`
2. Explore available templates: `/lib/email/templates/`
3. Create custom templates using components
4. Integrate with your forms and workflows

## Quick Reference

**Send with template:**
```typescript
await sendEmailWithTemplate(
  WelcomeEmail({ name: 'User' }),
  { to: 'user@example.com', subject: 'Welcome!' }
);
```

**Send via API:**
```typescript
fetch('/api/email/send', {
  method: 'POST',
  body: JSON.stringify({
    to: 'user@example.com',
    template: 'welcome',
    templateData: { name: 'User' }
  })
});
```

**Send direct email:**
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>Message</p>'
});
```
