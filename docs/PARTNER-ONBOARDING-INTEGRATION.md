# Partner Onboarding Integration

## Overview

Complete integration system connecting onboarding submissions to partner accounts, enabling automatic partner account creation, tracking, and commission management.

**Project:** a-startup-biz
**Created:** 2025-12-28
**Status:** Production Ready
**Tech Stack:** Next.js, Clerk, Supabase, Neon PostgreSQL, TypeScript

---

## Architecture

### Components

1. **Database Layer**
   - `onboarding_submissions` table - Customer onboarding data
   - `partners` table - Partner accounts
   - `partner_leads` table - Partner referrals/leads
   - `partner_profiles` table - Extended partner settings
   - Database functions for conversion and linking

2. **API Layer**
   - `POST /api/onboarding/route.ts` - Submit onboarding (existing)
   - `POST /api/onboarding/convert-to-partner/route.ts` - Convert onboarding to partner
   - `GET /api/onboarding/convert-to-partner?onboardingId=xxx` - Check conversion eligibility

3. **Query Layer**
   - `lib/db-queries.ts` - Database query functions
   - New functions: `createPartnerFromOnboarding()`, `linkPartnerToOnboarding()`, etc.

4. **Email Layer**
   - Partner account created emails (active/pending)
   - Admin notifications
   - Uses existing Resend email infrastructure

---

## Database Schema

### New Columns Added

#### `onboarding_submissions` table
```sql
partner_id UUID                     -- Link to partners table
create_partner_account BOOLEAN      -- Flag to create partner account
partner_account_created BOOLEAN     -- Track if partner was created
partner_metadata JSONB              -- Additional partner data
```

#### `partners` table
```sql
onboarding_submission_id UUID       -- Reverse link to onboarding
```

### Database Functions

#### 1. `create_partner_from_onboarding(onboarding_id, commission_rate)`
Automatically creates a partner account from an onboarding submission.

**Parameters:**
- `onboarding_id` (UUID) - Onboarding submission ID
- `commission_rate` (DECIMAL) - Commission percentage (default: 10.00)

**Returns:** Partner ID (UUID)

**Features:**
- Creates partner record
- Creates default partner profile
- Links onboarding to partner
- Handles user_id lookup/creation
- Validates not already converted

**Example:**
```sql
SELECT create_partner_from_onboarding(
  'a1b2c3d4-...',
  15.00
);
```

#### 2. `link_partner_to_onboarding(partner_id, onboarding_id)`
Links an existing partner to an onboarding submission.

**Parameters:**
- `partner_id` (UUID)
- `onboarding_id` (UUID)

**Returns:** Boolean success

**Example:**
```sql
SELECT link_partner_to_onboarding(
  'partner-uuid',
  'onboarding-uuid'
);
```

### Database Views

#### 1. `partner_onboarding_details`
Complete view of partner with onboarding information.

```sql
SELECT * FROM partner_onboarding_details
WHERE partner_id = 'xxx';
```

#### 2. `onboarding_with_partner_info`
Onboarding submissions with partner status.

```sql
SELECT * FROM onboarding_with_partner_info
WHERE onboarding_id = 'xxx';
```

---

## API Endpoints

### POST /api/onboarding/convert-to-partner

Convert an onboarding submission to a partner account.

**Authentication:** Admin only (Clerk auth required)

**Request Body:**
```json
{
  "onboardingId": "uuid",
  "commissionRate": 15.00,  // Optional, default 10.00
  "autoApprove": false       // Optional, default false
}
```

**Response (Success):**
```json
{
  "success": true,
  "partnerId": "uuid",
  "message": "Partner account created and pending approval",
  "data": {
    "partnerId": "uuid",
    "companyName": "Example LLC",
    "status": "pending",
    "commissionRate": 15.00
  }
}
```

**Response (Error - Already Converted):**
```json
{
  "success": false,
  "error": "Partner account already exists for this onboarding"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing/invalid parameters)
- `401` - Unauthorized
- `404` - Onboarding not found
- `409` - Conflict (already converted)
- `500` - Server error

**Side Effects:**
- Creates partner record
- Creates partner profile
- Sends email to partner
- Sends admin notification email
- Updates onboarding submission

### GET /api/onboarding/convert-to-partner

Check if an onboarding can be converted to partner.

**Authentication:** Admin only

**Query Parameters:**
- `onboardingId` (required)

**Response:**
```json
{
  "success": true,
  "canConvert": true,
  "data": {
    "onboardingId": "uuid",
    "businessName": "Example LLC",
    "contactEmail": "contact@example.com"
  }
}
```

**If Already Converted:**
```json
{
  "success": true,
  "canConvert": false,
  "reason": "Partner account already exists",
  "existingPartnerId": "uuid"
}
```

---

## Database Query Functions

### New Functions in `lib/db-queries.ts`

#### `createPartnerFromOnboarding(onboardingId, commissionRate)`
```typescript
const partnerId = await createPartnerFromOnboarding(
  'onboarding-uuid',
  15.00
);
```

#### `linkPartnerToOnboarding(partnerId, onboardingId)`
```typescript
const success = await linkPartnerToOnboarding(
  'partner-uuid',
  'onboarding-uuid'
);
```

#### `getPartnerWithOnboarding(partnerId)`
```typescript
const partnerData = await getPartnerWithOnboarding('partner-uuid');
```

#### `getOnboardingWithPartner(onboardingId)`
```typescript
const onboardingData = await getOnboardingWithPartner('onboarding-uuid');
```

#### `canConvertToPartner(onboardingId)`
```typescript
const { canConvert, reason, existingPartnerId } =
  await canConvertToPartner('onboarding-uuid');
```

---

## Email Templates

### Partner Account Created Email

**Function:** `sendPartnerAccountCreated()`
**Template:** `partnerAccountCreatedEmail()`
**File:** `/lib/email.ts`

**Usage:**
```typescript
import { sendPartnerAccountCreated } from '@/lib/email';

await sendPartnerAccountCreated({
  email: 'partner@example.com',
  partnerName: 'Example LLC',
  status: 'active', // or 'pending'
  commissionRate: 15.00,
  loginUrl: 'https://astartupbiz.com/partner-portal'
});
```

**Email Variations:**
- **Active Status:** Welcome message with portal access
- **Pending Status:** Application under review notification

**Content Includes:**
- Partner account details
- Commission rate
- Account status (active/pending)
- Next steps instructions
- Partner portal link (if active)
- Contact information

---

## Migration Instructions

### Step 1: Run Database Migration

```bash
# Connect to your Neon database
psql "postgresql://user:pass@host/db?sslmode=require"

# Run the migration
\i scripts/migrations/005_link_onboarding_partners.sql
```

**What it does:**
- Adds new columns to onboarding_submissions
- Adds new column to partners
- Creates database functions
- Creates database views
- Creates indexes

**Rollback not provided** - Contact database admin if needed

### Step 2: Verify Migration

```sql
-- Check new columns exist
\d onboarding_submissions
\d partners

-- Check functions exist
\df create_partner_from_onboarding
\df link_partner_to_onboarding

-- Check views exist
\dv partner_onboarding_details
\dv onboarding_with_partner_info
```

### Step 3: Test Conversion

```typescript
// In your admin panel or API testing tool
const response = await fetch('/api/onboarding/convert-to-partner', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    onboardingId: 'test-onboarding-id',
    commissionRate: 10.00,
    autoApprove: false
  })
});

const data = await response.json();
console.log(data);
```

---

## Usage Examples

### Example 1: Convert Onboarding to Partner (Admin Panel)

```typescript
// In an admin panel component
async function handleConvertToPartner(onboardingId: string) {
  try {
    // Check if can convert
    const checkResponse = await fetch(
      `/api/onboarding/convert-to-partner?onboardingId=${onboardingId}`
    );
    const checkData = await checkResponse.json();

    if (!checkData.canConvert) {
      alert(checkData.reason);
      return;
    }

    // Convert to partner
    const response = await fetch('/api/onboarding/convert-to-partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        onboardingId,
        commissionRate: 15.00,
        autoApprove: true
      })
    });

    const data = await response.json();

    if (data.success) {
      alert(`Partner created: ${data.partnerId}`);
      // Refresh admin panel
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Conversion error:', error);
  }
}
```

### Example 2: Automatic Conversion on Onboarding Submission

```typescript
// In /api/onboarding/route.ts
// Add this after successful onboarding submission

// Check if user wants to become a partner
if (validatedData.becomePartner) {
  // Create partner account automatically
  try {
    const partnerId = await createPartnerFromOnboarding(
      submission.id,
      10.00 // Default commission
    );

    console.log(`Partner account created: ${partnerId}`);
  } catch (error) {
    console.error('Failed to create partner account:', error);
    // Don't fail the onboarding if partner creation fails
  }
}
```

### Example 3: Query Partner with Onboarding Data

```typescript
// Get full partner details including onboarding info
async function getPartnerDetails(partnerId: string) {
  const partner = await getPartnerWithOnboarding(partnerId);

  return {
    partnerId: partner.partner_id,
    companyName: partner.company_name,
    status: partner.partner_status,
    commissionRate: partner.commission_rate,
    totalEarnings: partner.total_earnings,

    // Onboarding data
    onboardingId: partner.onboarding_id,
    businessType: partner.business_type,
    goals: partner.goals,
    challenges: partner.challenges,
    contactEmail: partner.contact_email,

    // Profile data
    paymentEmail: partner.payment_email,
    website: partner.website
  };
}
```

---

## Workflows

### Workflow 1: Manual Conversion (Admin Initiated)

1. Admin views onboarding submissions in admin panel
2. Admin clicks "Convert to Partner" button
3. System checks if already converted
4. If eligible, shows conversion form with commission rate
5. Admin submits conversion request
6. API creates partner account
7. Email sent to partner (pending/active)
8. Admin email notification
9. Admin panel shows new partner

### Workflow 2: Automatic Conversion (User Initiated)

1. User completes onboarding form
2. User checks "Become a Partner" checkbox
3. Onboarding API processes submission
4. After successful save, attempts partner creation
5. If successful, partner account created with pending status
6. User receives onboarding confirmation + partner application email
7. Admin receives notification about new partner application
8. Admin reviews and approves partner
9. Status update email sent to partner

### Workflow 3: Existing Partner Links to Onboarding

1. Partner submits onboarding form with referral code
2. System detects existing partner by referral code
3. Onboarding linked to partner automatically
4. Partner can see onboarding in their dashboard
5. Commissions tracked back to partner

---

## Security Considerations

### Authentication
- All conversion endpoints require Clerk authentication
- Admin-only access via Clerk roles
- API keys not exposed in client code

### Data Validation
- Zod schema validation on all inputs
- SQL injection prevention via parameterized queries
- Commission rate bounds checking (0-100%)

### Error Handling
- Graceful degradation if database unavailable
- Email failures don't block partner creation
- Detailed error logging for debugging

### Privacy
- Partner data GDPR compliant
- PII encrypted at rest (handled by Neon)
- Email addresses validated before sending

---

## Testing

### Unit Tests

Create tests for:
1. Database functions
2. API endpoints
3. Query functions
4. Email template rendering

**Example Test:**
```typescript
describe('Partner Conversion', () => {
  it('should convert onboarding to partner', async () => {
    const onboardingId = 'test-uuid';
    const partnerId = await createPartnerFromOnboarding(onboardingId, 10.00);

    expect(partnerId).toBeDefined();

    // Verify partner exists
    const partner = await getPartnerWithOnboarding(partnerId);
    expect(partner.onboarding_id).toBe(onboardingId);
  });

  it('should not convert already converted onboarding', async () => {
    const onboardingId = 'already-converted-uuid';

    await expect(
      createPartnerFromOnboarding(onboardingId, 10.00)
    ).rejects.toThrow('already created');
  });
});
```

### Integration Tests

Test complete flows:
1. Onboarding submission → Partner creation
2. Partner conversion via API
3. Email sending
4. Admin notifications

### Manual Testing Checklist

- [ ] Submit onboarding form
- [ ] Convert onboarding to partner via admin panel
- [ ] Verify partner created in database
- [ ] Verify partner received email
- [ ] Verify admin received notification
- [ ] Check partner can log into portal
- [ ] Test with pending status
- [ ] Test with active status
- [ ] Test duplicate conversion prevention
- [ ] Test invalid onboarding ID
- [ ] Test missing required fields

---

## Monitoring & Alerts

### Key Metrics to Track

1. **Conversion Rate:** onboardings → partners
2. **Email Delivery Rate:** partner emails sent/delivered
3. **API Response Times:** conversion endpoint performance
4. **Error Rate:** failed conversions

### Recommended Alerts

- Partner creation failure > 5% of attempts
- Email delivery failure > 10%
- API response time > 5s
- Database function errors

### Logs to Monitor

```typescript
// Successful conversion
console.log('Partner created:', {
  partnerId,
  onboardingId,
  companyName,
  commissionRate
});

// Failed conversion
console.error('Partner conversion failed:', {
  onboardingId,
  error: error.message,
  timestamp: new Date().toISOString()
});

// Email failure (non-fatal)
console.warn('Partner email failed:', {
  email,
  partnerId,
  error: emailError.message
});
```

---

## Troubleshooting

### Issue: "Partner account already exists"

**Cause:** Onboarding already converted
**Solution:** Check `onboarding_submissions.partner_id` field

```sql
SELECT
  id,
  partner_id,
  partner_account_created
FROM onboarding_submissions
WHERE id = 'onboarding-uuid';
```

### Issue: "Onboarding submission not found"

**Cause:** Invalid onboarding ID
**Solution:** Verify ID exists

```sql
SELECT id, business_name, contact_email
FROM onboarding_submissions
WHERE id = 'onboarding-uuid';
```

### Issue: Email not received

**Causes:**
1. Resend API key not configured
2. Email in spam
3. Invalid email address

**Debug:**
```typescript
// Check email logs
console.log('Resend API Key:', process.env.RESEND_API_KEY ? 'Configured' : 'Missing');

// Test email sending
const result = await sendPartnerAccountCreated({...});
console.log('Email result:', result);
```

### Issue: Database function error

**Cause:** Migration not run or incomplete
**Solution:** Re-run migration

```bash
psql "postgresql://..." -f scripts/migrations/005_link_onboarding_partners.sql
```

### Issue: "Permission denied"

**Cause:** Insufficient Clerk permissions
**Solution:** Add admin role to user

```typescript
// In Clerk dashboard, add role "admin" to user
// Or check auth in API:
const { userId, sessionClaims } = auth();
console.log('User roles:', sessionClaims?.metadata?.role);
```

---

## Future Enhancements

### Phase 2: Partner Portal Integration
- [ ] Partner dashboard showing onboarding data
- [ ] Lead tracking from onboarding referrals
- [ ] Commission calculator
- [ ] Referral link generator

### Phase 3: Advanced Features
- [ ] Bulk partner creation from CSV
- [ ] Partner tier/rank system based on performance
- [ ] Automated commission payouts
- [ ] Partner analytics dashboard
- [ ] White-label partner portals

### Phase 4: Automation
- [ ] Auto-approve partners meeting criteria
- [ ] Scheduled email campaigns to partners
- [ ] Lead scoring and routing
- [ ] AI-powered partner matching

---

## Support & Documentation

**Related Files:**
- `/scripts/migrations/005_link_onboarding_partners.sql`
- `/app/api/onboarding/convert-to-partner/route.ts`
- `/lib/db-queries.ts` (lines 1450-1551)
- `/lib/email.ts` (lines 1098-1246)
- `/lib/types/partner.ts`

**Related Documentation:**
- [Partner Portal Database Schema](/docs/database/partner-portal.md)
- [Email System Documentation](/docs/email/README.md)
- [API Documentation](/docs/api/README.md)

**Contact:**
- **Technical Lead:** Julian (julian@aiacrobatics.com)
- **Database Admin:** (Reference Notion for credentials)

---

## Changelog

### v1.0.0 - 2025-12-28
- Initial implementation
- Database migration created
- API endpoints implemented
- Email templates created
- Query functions added
- Documentation written

---

## License

Internal use only - A Startup Biz proprietary code
