# TypeScript Quick Reference - Referral System

## Quick Type Imports

```typescript
// Core types
import type {
  Referral,
  ReferralPayout,
  ReferralStats,
  ReferralStatus,
  PayoutStatus,
  ReferralCode,
  EmailAddress,
  ValidationResult,
} from '@/lib/types/referral'

// Fraud detection types
import type {
  FraudDetectionResult,
  FraudSignal,
  FraudAction,
  FraudSeverity,
} from '@/lib/referral-fraud-detection'

// Utility types
import {
  isConvertedReferral,
  isPaidPayout,
  formatCurrency,
  calculateCommissionSafe,
} from '@/lib/types/referral-utils'
```

## Common Patterns

### 1. Validate User Input

```typescript
import { validateReferralCodeStrict, validateEmailStrict } from '@/lib/types/referral'

// Validate referral code
const codeResult = validateReferralCodeStrict(userInput)
if (!codeResult.success) {
  return { error: codeResult.error }
}
const code = codeResult.data // ReferralCode type

// Validate email
const emailResult = validateEmailStrict(userInput)
if (!emailResult.success) {
  return { error: emailResult.error }
}
const email = emailResult.data // EmailAddress type
```

### 2. Track Referral Signup

```typescript
import { trackReferralSignup } from '@/lib/referral'
import type { TrackReferralMetadata } from '@/lib/types/referral'

const metadata: TrackReferralMetadata = {
  utmSource: 'google',
  utmMedium: 'cpc',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
}

const referralId = await trackReferralSignup(
  code,
  email,
  metadata
)
```

### 3. Convert Referral

```typescript
import { convertReferral } from '@/lib/referral'
import type { ConvertReferralParams } from '@/lib/types/referral'

const params: ConvertReferralParams = {
  referralCode: 'REF-ABC-123456',
  referredUserId: 'user_123',
  purchaseValue: 150.00,
  orderId: 'order_xyz'
}

const result = await convertReferral(params)
console.log(`Commission: $${result.commissionAmount}`)
```

### 4. Fraud Detection

```typescript
import { detectFraud } from '@/lib/referral-fraud-detection'

const fraudResult = await detectFraud(code, email, {
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  purchaseValue: 150.00
})

// Handle based on action
switch (fraudResult.action) {
  case 'allow':
    // Process normally
    break
  case 'monitor':
    // Process but log
    console.log('Monitoring:', fraudResult.signals)
    break
  case 'review':
    // Flag for manual review
    await flagForReview(fraudResult)
    break
  case 'block':
    // Block transaction
    return { error: 'Suspicious activity detected' }
}
```

### 5. Type-Safe Status Checks

```typescript
import { isReferralStatus, isPayoutStatus } from '@/lib/types/referral'

// Type guard for status
if (isReferralStatus(input)) {
  // input is ReferralStatus
  const status: ReferralStatus = input
}

// Type predicate for converted referrals
import { isConvertedReferral } from '@/lib/types/referral-utils'

if (isConvertedReferral(referral)) {
  // These are guaranteed non-null
  console.log(referral.commission_amount) // number
  console.log(referral.conversion_date) // Date
}
```

### 6. Safe Number Parsing

```typescript
import { parsePositiveNumber } from '@/lib/types/referral-utils'

const result = parsePositiveNumber(userInput, 'purchase value')

if (!result.success) {
  return { error: result.error }
}

const amount = result.data // number
```

### 7. Commission Calculation

```typescript
import { calculateCommissionSafe } from '@/lib/types/referral-utils'
import { DEFAULT_COMMISSION_CONFIG } from '@/lib/types/referral'

try {
  const commission = calculateCommissionSafe(
    purchaseValue,
    DEFAULT_COMMISSION_CONFIG
  )
  console.log(`Commission: $${commission}`)
} catch (error) {
  // Handle invalid purchase value
}
```

### 8. Format Display Values

```typescript
import { formatCurrency, formatReferralCode } from '@/lib/types/referral-utils'

const displayAmount = formatCurrency(150.50) // "$150.50"
const displayCode = formatReferralCode(code) // "REF - ABC - 123456"
```

### 9. API Route Type Safety

```typescript
import { NextRequest, NextResponse } from 'next/server'
import type {
  TrackReferralRequest,
  TrackReferralResponse,
} from '@/lib/types/referral'

export async function POST(request: NextRequest) {
  const body = await request.json() as TrackReferralRequest

  // Validate required fields
  if (!body.referralCode || !body.referredEmail) {
    return NextResponse.json<TrackReferralResponse>({
      success: false,
      message: 'Missing required fields'
    }, { status: 400 })
  }

  // Process...
  return NextResponse.json<TrackReferralResponse>({
    success: true,
    referralId: id,
    message: 'Success'
  })
}
```

### 10. Exhaustive Switch (No Missing Cases)

```typescript
function handleStatus(status: ReferralStatus): string {
  switch (status) {
    case 'pending':
      return 'Waiting for signup'
    case 'signed_up':
      return 'User signed up'
    case 'converted':
      return 'Purchase made'
    case 'paid_out':
      return 'Commission paid'
    case 'expired':
      return 'Referral expired'
    case 'invalid':
      return 'Invalidated'
    default:
      // TypeScript ensures all cases handled
      const _exhaustive: never = status
      return _exhaustive
  }
}
```

## Type Cheat Sheet

| Type | Purpose | Example |
|------|---------|---------|
| `ReferralCode` | Branded referral code | `'REF-ABC-123456' as ReferralCode` |
| `EmailAddress` | Branded email | `'user@example.com' as EmailAddress` |
| `UserId` | Branded user ID | `'user_123' as UserId` |
| `ReferralStatus` | Referral state | `'pending' \| 'signed_up' \| ...` |
| `PayoutStatus` | Payout state | `'pending' \| 'processing' \| ...` |
| `ValidationResult<T>` | Validation result | `{ success: true, data: T }` |
| `FraudAction` | Fraud response | `'allow' \| 'monitor' \| ...` |
| `TrackReferralMetadata` | Tracking data | `{ utmSource, ipAddress, ... }` |

## Common Functions

| Function | Return Type | Purpose |
|----------|-------------|---------|
| `validateReferralCodeStrict()` | `ValidationResult<ReferralCode>` | Validate code |
| `validateEmailStrict()` | `ValidationResult<EmailAddress>` | Validate email |
| `trackReferralSignup()` | `Promise<string>` | Track signup |
| `convertReferral()` | `Promise<ConvertReferralResult>` | Convert referral |
| `detectFraud()` | `Promise<FraudDetectionResult>` | Fraud check |
| `getReferralStats()` | `Promise<ReferralStats>` | Get stats |
| `isConvertedReferral()` | `boolean` | Type predicate |
| `calculateCommissionSafe()` | `number` | Calculate commission |

## Error Handling

```typescript
// Pattern 1: ValidationResult
const result = validateEmailStrict(input)
if (!result.success) {
  return { error: result.error }
}

// Pattern 2: Try/Catch
try {
  const referralId = await trackReferralSignup(code, email)
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}

// Pattern 3: Type Guard + Assertion
if (!isValidReferralCode(input)) {
  throw new Error('Invalid referral code format')
}
const code = input as ReferralCode
```

## Best Practices Checklist

- [ ] Always validate user input before using branded types
- [ ] Use `ValidationResult<T>` for functions that can fail
- [ ] Make data interfaces `readonly` where appropriate
- [ ] Use type guards for runtime type checking
- [ ] Document complex types with JSDoc
- [ ] Run `npx tsc --noEmit` before committing
- [ ] Use discriminated unions for state management
- [ ] Prefer type predicates over type assertions
- [ ] Handle all cases in switch statements
- [ ] Use branded types to prevent mixing similar strings

## Quick Debugging

```bash
# Check all types
npx tsc --noEmit

# Check specific file
npx tsc --noEmit path/to/file.ts

# Show detailed errors
npx tsc --noEmit --pretty

# Check with watch mode
npx tsc --noEmit --watch
```

## Common Type Errors & Fixes

### Error: Type 'string' is not assignable to type 'ReferralCode'

```typescript
// ❌ Bad
const code: ReferralCode = userInput

// ✅ Good
const result = validateReferralCodeStrict(userInput)
if (result.success) {
  const code: ReferralCode = result.data
}
```

### Error: Property 'commission_amount' may be null

```typescript
// ❌ Bad
console.log(referral.commission_amount.toFixed(2))

// ✅ Good
if (isConvertedReferral(referral)) {
  console.log(referral.commission_amount.toFixed(2))
}
```

### Error: Not all code paths return a value

```typescript
// ❌ Bad
function getStatus(status: ReferralStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending'
    // Missing other cases
  }
}

// ✅ Good - Handle all cases
function getStatus(status: ReferralStatus): string {
  switch (status) {
    case 'pending': return 'Pending'
    case 'signed_up': return 'Signed Up'
    case 'converted': return 'Converted'
    case 'paid_out': return 'Paid Out'
    case 'expired': return 'Expired'
    case 'invalid': return 'Invalid'
    default:
      const _exhaustive: never = status
      return _exhaustive
  }
}
```

## Resources

- Full Documentation: `/docs/typescript-referral-system.md`
- Type Definitions: `/lib/types/referral.ts`
- Utilities: `/lib/types/referral-utils.ts`
- Examples: This file

---

**Pro Tip**: Use your IDE's TypeScript autocomplete (Ctrl+Space) to discover available types and functions!
