# Quick Start: Partner Onboarding Integration

## 🚀 Get Started in 5 Minutes

This guide gets the partner onboarding integration up and running quickly.

---

## Prerequisites

- [x] Neon PostgreSQL database running
- [x] Database credentials in `.env.local`
- [x] Clerk authentication configured
- [x] Resend API key for emails

---

## Step 1: Run Database Migration (2 min)

```bash
# Navigate to project directory
cd /root/github-repos/a-startup-biz

# Connect to database
psql "$DATABASE_URL"

# Run migration
\i scripts/migrations/005_link_onboarding_partners.sql

# Verify
\d onboarding_submissions  # Check for partner_id column
\df create_partner_from_onboarding  # Check function exists
```

**Expected Output:**
```
NOTICE:  ===============================================
NOTICE:  Onboarding-Partner Link Migration Complete
NOTICE:  ===============================================
```

---

## Step 2: Test Database Functions (1 min)

```sql
-- Test conversion function (use a real onboarding ID)
SELECT create_partner_from_onboarding(
  'your-onboarding-uuid-here'::UUID,
  10.00::DECIMAL
);

-- Verify partner was created
SELECT * FROM partners ORDER BY created_at DESC LIMIT 1;

-- Check the view
SELECT * FROM partner_onboarding_details ORDER BY partner_id DESC LIMIT 1;
```

---

## Step 3: Test API Endpoint (1 min)

### Option A: Using cURL

```bash
# Get your Clerk session token from browser DevTools
# Application > Cookies > __session

# Check if onboarding can be converted
curl -X GET \
  'http://localhost:3000/api/onboarding/convert-to-partner?onboardingId=YOUR_ONBOARDING_ID' \
  -H 'Authorization: Bearer YOUR_CLERK_TOKEN'

# Convert onboarding to partner
curl -X POST \
  'http://localhost:3000/api/onboarding/convert-to-partner' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_CLERK_TOKEN' \
  -d '{
    "onboardingId": "YOUR_ONBOARDING_ID",
    "commissionRate": 15.00,
    "autoApprove": true
  }'
```

### Option B: Using Browser Console

```javascript
// Run in browser console while logged in as admin
fetch('/api/onboarding/convert-to-partner', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    onboardingId: 'YOUR_ONBOARDING_ID',
    commissionRate: 15.00,
    autoApprove: true
  })
})
  .then(r => r.json())
  .then(console.log);
```

---

## Step 4: Verify Email Sent (1 min)

Check your terminal logs:

```bash
# Look for email logs
npm run dev

# Expected output:
# ✅ Email sent successfully: { to: 'partner@example.com', subject: 'Welcome to the Partner Program!' }
```

Check Resend dashboard:
- Go to https://resend.com/emails
- Verify email was sent
- Check delivery status

---

## Step 5: Add Admin UI (Optional)

Add conversion button to your admin panel:

```tsx
// In your admin/onboarding page
import { useState } from 'react';

export function ConvertToPartnerButton({ onboardingId }: { onboardingId: string }) {
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/onboarding/convert-to-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboardingId,
          commissionRate: 15.00,
          autoApprove: false
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Partner created: ${data.partnerId}`);
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to convert to partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConvert}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {loading ? 'Converting...' : 'Convert to Partner'}
    </button>
  );
}
```

---

## Common Issues & Quick Fixes

### Issue: "DATABASE_URL not set"

```bash
# Add to .env.local
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### Issue: "Unauthorized" error

Make sure you're logged in as admin:
1. Log in to your app
2. Check Clerk dashboard
3. Add "admin" role to your user

### Issue: "Function does not exist"

Re-run migration:
```bash
psql "$DATABASE_URL" -f scripts/migrations/005_link_onboarding_partners.sql
```

### Issue: Email not sent

Check Resend API key:
```bash
# Add to .env.local
RESEND_API_KEY="re_xxxxx..."
ADMIN_EMAIL="admin@astartupbiz.com"
```

---

## Next Steps

1. **Test in Production**
   - Deploy to Vercel
   - Run migration on production database
   - Test with real onboarding submission

2. **Add Admin UI**
   - Create admin panel for conversions
   - Add partner management dashboard
   - Build partner analytics

3. **Enable Auto-Conversion**
   - Add "Become a Partner" checkbox to onboarding form
   - Auto-create partner on submission
   - Send welcome email

4. **Monitor & Optimize**
   - Track conversion rates
   - Monitor email delivery
   - Set up alerts for failures

---

## Key Files Reference

**Created/Modified Files:**
- `scripts/migrations/005_link_onboarding_partners.sql` - Database migration
- `app/api/onboarding/convert-to-partner/route.ts` - API endpoint
- `lib/db-queries.ts` - Query functions (added lines 1450-1551)
- `lib/email.ts` - Email templates (added lines 1098-1246)
- `docs/PARTNER-ONBOARDING-INTEGRATION.md` - Full documentation

**Existing Files Used:**
- `lib/types/partner.ts` - Type definitions
- `app/api/onboarding/route.ts` - Onboarding submission API
- `scripts/migrations/002_partner_portal.sql` - Partner portal schema

---

## Success Checklist

- [ ] Migration ran successfully
- [ ] Database functions work
- [ ] API endpoint returns 200
- [ ] Partner created in database
- [ ] Email sent to partner
- [ ] Admin received notification
- [ ] Can query partner data
- [ ] Can view partner in database

---

## Support

Questions? Check the full documentation:
- [Full Integration Docs](./PARTNER-ONBOARDING-INTEGRATION.md)
- [Database Schema Docs](./database/partner-portal.md)
- [API Docs](./api/README.md)

**Contact:** julian@aiacrobatics.com
