# Go-Live Checklist - A Startup Biz

**Target Launch: 2 Days**
**Last Updated:** 2025-12-29

---

## Integration Status Overview

| Integration | Status | Action Required |
|-------------|--------|-----------------|
| Resend Email | Ready | Domain verification recommended |
| Stripe Payments | Ready | Already configured |
| Stripe Connect | Ready | Partner onboarding flow complete |
| Clerk Auth | Ready | Already configured |
| Neon Database | Ready | All migrations applied |
| LiveKit Voice | Code Ready | **USER: Create account & add keys** |
| HubSpot CRM | Code Ready | **USER: Create Private App & add key** |
| Supabase Chat | Ready | Already configured |
| Dropbox Sign | Code Ready | Needs API credentials |

---

## Critical Path Items (Must Complete)

### 1. LiveKit Voice Integration (USER ACTION REQUIRED)
**Priority: HIGH** - Enables voice calls with AI agent

```bash
# Steps for user:
1. Go to https://cloud.livekit.io
2. Create account and project
3. Get API credentials
4. Add to Vercel:
   - LIVEKIT_HOST
   - LIVEKIT_API_KEY
   - LIVEKIT_API_SECRET
5. Add OPENAI_API_KEY for AI voice agent
```

**Files Ready:**
- `lib/livekit.ts` - LiveKit client
- `lib/voice-agent.ts` - AI agent service
- `components/floating-call-button.tsx` - UI component
- `components/voice-call-interface.tsx` - Call UI
- `app/api/voice/*` - API routes

### 2. HubSpot CRM Integration (USER ACTION REQUIRED)
**Priority: MEDIUM** - Syncs leads and contacts

```bash
# Steps for user:
1. Go to HubSpot > Settings > Integrations > Private Apps
2. Create new Private App with scopes:
   - crm.objects.contacts (read/write)
   - crm.objects.deals (read/write)
   - crm.objects.companies (read/write)
3. Copy Access Token
4. Add to Vercel: HUBSPOT_API_KEY
```

**Files Ready:**
- `lib/hubspot.ts` - HubSpot client
- `lib/hubspot/types.ts` - Type definitions
- `app/api/hubspot/*` - Webhook handlers

---

## Email Domain Setup (RECOMMENDED)

### Resend Domain Verification
For professional emails from `notifications@astartupbiz.com`:

1. Go to https://resend.com/domains
2. Add domain: `astartupbiz.com`
3. Add DNS records:
   - SPF record
   - DKIM record
   - DMARC record (optional)
4. Wait for verification (usually < 1 hour)

**Current Fallback:** Emails work from Resend's default domain

---

## Pre-Launch Verification Checklist

### Authentication
- [ ] Clerk sign-up flow works
- [ ] Clerk sign-in flow works
- [ ] Protected routes redirect properly
- [ ] Admin access restricted to admin users

### Payments
- [ ] Stripe checkout creates session
- [ ] Webhook handles payment success
- [ ] Partner commissions calculate correctly
- [ ] Stripe Connect payouts work

### Partner Portal
- [ ] Partner application submits
- [ ] Admin can approve/reject partners
- [ ] Referral codes generate
- [ ] Commission tracking works
- [ ] Payout requests process

### Email System
- [ ] Welcome emails send
- [ ] Partner approval emails send
- [ ] Lead converted notifications work
- [ ] Password reset emails work

### Database
- [ ] All migrations applied
- [ ] No pending schema changes
- [ ] Backup strategy in place

### Performance
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Core Web Vitals acceptable
- [ ] Mobile responsive

---

## Environment Variables Checklist

### Currently Configured (Vercel)
- [x] `DATABASE_URL` - Neon PostgreSQL
- [x] `CLERK_SECRET_KEY` - Authentication
- [x] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Auth frontend
- [x] `RESEND_API_KEY` - Email service
- [x] `STRIPE_SECRET_KEY` - Payments
- [x] `STRIPE_WEBHOOK_SECRET` - Payment webhooks
- [x] `NEXT_PUBLIC_SUPABASE_URL` - Real-time chat
- [x] `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin

### Needs Configuration
- [ ] `LIVEKIT_HOST` - Voice calls
- [ ] `LIVEKIT_API_KEY` - Voice calls
- [ ] `LIVEKIT_API_SECRET` - Voice calls
- [ ] `OPENAI_API_KEY` - AI voice agent
- [ ] `HUBSPOT_API_KEY` - CRM integration
- [ ] `DROPBOX_SIGN_API_KEY` - Document signing (optional)

---

## Bubba Orchestrator Instructions

When user says "go live" or "launch":

1. **Run pre-flight checks:**
   - Verify build passes: `pnpm build`
   - Run tests: `pnpm test`
   - Check for TypeScript errors

2. **Check integration status:**
   - Query Vercel env vars
   - Identify missing configurations
   - Report to user

3. **For missing integrations:**
   - Provide step-by-step setup instructions
   - Offer to configure once user provides credentials

4. **Deploy sequence:**
   ```bash
   git add -A
   git commit -m "chore: Pre-launch final checks"
   git push origin main
   # Vercel auto-deploys from main
   ```

5. **Post-deploy verification:**
   - Check production URL responds
   - Verify critical paths work
   - Run smoke tests

---

## Support Contacts

- **Stripe:** dashboard.stripe.com/support
- **Clerk:** clerk.com/support
- **Resend:** resend.com/support
- **LiveKit:** livekit.io/support
- **Neon:** neon.tech/support

---

## Rollback Plan

If critical issues found post-launch:

1. Revert to previous deployment in Vercel
2. Identify root cause
3. Fix in development
4. Re-deploy after verification

```bash
# Vercel rollback
vercel rollback [deployment-url]
```
