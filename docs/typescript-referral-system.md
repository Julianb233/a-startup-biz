# TypeScript Type System - Partner Referral Tracking

## Overview

This document describes the comprehensive TypeScript type system implemented for the partner referral tracking system in the a-startup-biz project.

## Type Safety Enhancements

### 1. Core Type Definitions

**Location**: `/lib/types/referral.ts`

#### Branded Types

We use branded types to prevent mixing different string types at compile time:

```typescript
// Branded types for type safety
type ReferralCode = string & { readonly __brand: 'ReferralCode' }
type UserId = string & { readonly __brand: 'UserId' }
type EmailAddress = string & { readonly __brand: 'EmailAddress' }

// Usage example:
const code: ReferralCode = 'REF-ABC-123456' as ReferralCode // Must validate first
const email: EmailAddress = 'user@example.com' as EmailAddress // Must validate first
```

#### Discriminated Unions

Status types use string literal unions for exhaustive checking:

```typescript
// Referral status progression with type safety
type ReferralStatus =
  | 'pending'      // Code created but not used
  | 'signed_up'    // Referred user created account
  | 'converted'    // Referred user made qualifying purchase
  | 'paid_out'     // Commission has been paid
  | 'expired'      // Referral expired (30-day window)
  | 'invalid'      // Invalidated (fraud, refund, etc.)

// Payout status progression
type PayoutStatus =
  | 'pending'      // Commission earned, waiting threshold
  | 'processing'   // Payment being processed
  | 'paid'         // Successfully paid out
  | 'failed'       // Payment failed
  | 'cancelled'    // Payout cancelled
```

### 2. Type Guards

**Location**: `/lib/types/referral.ts`

Type guards provide runtime type validation with compile-time type narrowing:

```typescript
// Type guard with type predicate
function isValidReferralCode(code: string): code is ReferralCode {
  const pattern = /^REF-[A-Z0-9]+-[A-Z0-9]{6,}$/
  return pattern.test(code)
}

function isValidEmail(email: string): email is EmailAddress {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

// Usage:
if (isValidReferralCode(input)) {
  // TypeScript knows input is ReferralCode here
  const code: ReferralCode = input
}
```

### 3. Validation Results

**Location**: `/lib/types/referral.ts`

Type-safe validation using discriminated unions:

```typescript
type ValidationResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: string }

// Helper functions
function validationSuccess<T>(data: T): ValidationResult<T>
function validationError<T>(error: string): ValidationResult<T>

// Usage example:
const result = validateEmailStrict('user@example.com')

if (result.success) {
  // TypeScript knows result.data is EmailAddress
  const email: EmailAddress = result.data
} else {
  // TypeScript knows result.error is string
  console.error(result.error)
}
```

### 4. Enhanced Function Signatures

**Location**: `/lib/referral.ts`

#### trackReferralSignup

```typescript
interface TrackReferralMetadata {
  readonly utmSource?: string
  readonly utmMedium?: string
  readonly utmCampaign?: string
  readonly ipAddress?: string
  readonly userAgent?: string
  readonly referrerUrl?: string
}

async function trackReferralSignup(
  referralCode: string,
  referredEmail: string,
  metadata: TrackReferralMetadata = {}
): Promise<string>
```

#### convertReferral

```typescript
interface ConvertReferralParams {
  readonly referralCode?: string
  readonly referredEmail?: string
  readonly referredUserId?: string
  readonly purchaseValue: number
  readonly orderId?: string
}

interface ConvertReferralResult {
  readonly referralId: string
  readonly commissionAmount: number
}

async function convertReferral(
  params: ConvertReferralParams,
  config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): Promise<ConvertReferralResult>
```

### 5. Fraud Detection Types

**Location**: `/lib/referral-fraud-detection.ts`

#### Fraud Signal Types

```typescript
type FraudSeverity = 'low' | 'medium' | 'high' | 'critical'

type FraudSignalType =
  | 'ip_abuse'
  | 'self_referral'
  | 'velocity_abuse'
  | 'email_pattern'
  | 'user_agent_anomaly'
  | 'conversion_timing'
  | 'duplicate_conversion'
  | 'suspicious_domain'
  | 'rapid_signup'

type FraudAction =
  | 'allow'     // 0-30: Normal activity
  | 'monitor'   // 31-60: Slightly suspicious
  | 'review'    // 61-80: Suspicious
  | 'block'     // 81-100: Highly suspicious
```

#### Fraud Detection Result

```typescript
interface FraudDetectionResult {
  readonly isSuspicious: boolean
  readonly riskScore: number // 0-100
  readonly signals: readonly FraudSignal[]
  readonly action: FraudAction
  readonly metadata: FraudDetectionMetadata
}

interface FraudSignal {
  readonly type: FraudSignalType
  readonly severity: FraudSeverity
  readonly description: string
  readonly details: Readonly<Record<string, unknown>>
  readonly timestamp: Date
}
```

### 6. Type Utilities

**Location**: `/lib/types/referral-utils.ts`

#### Type Predicates

```typescript
// Check if referral has been converted with proper type narrowing
function isConvertedReferral(
  referral: Referral
): referral is Referral & {
  status: 'converted' | 'paid_out'
  conversion_date: Date
  conversion_value: number
  commission_amount: number
}

// Check if payout has been paid
function isPaidPayout(
  payout: ReferralPayout
): payout is ReferralPayout & {
  status: 'paid'
  paid_at: Date
  payment_method: PaymentMethod
}
```

#### Utility Functions

```typescript
// Safe number parsing with validation
function parsePositiveNumber(
  value: unknown,
  fieldName: string
): ValidationResult<number>

// Safe date parsing
function parseDateSafe(
  value: unknown,
  fieldName: string
): ValidationResult<Date>

// Type-safe commission calculation
function calculateCommissionSafe(
  purchaseValue: number,
  config: CommissionConfig
): number

// Format utilities
function formatCurrency(amount: number, currency?: string): string
function formatReferralCode(code: ReferralCode | string): string
```

#### Advanced Type Utilities

```typescript
// Deep readonly type
type DeepReadonly<T> = { ... }

// Partial with specific required fields
type PartialWith<T, K extends keyof T> = Partial<T> & Pick<T, K>

// Make specific fields optional
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Make specific fields required
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Extract non-nullable fields
type NonNullableFields<T> = { [P in keyof T]: NonNullable<T[P]> }
```

## Best Practices

### 1. Always Validate Input

```typescript
// BAD: No validation
const code: ReferralCode = userInput as ReferralCode

// GOOD: Validate before using
const result = validateReferralCodeStrict(userInput)
if (result.success) {
  const code: ReferralCode = result.data
  // Use code safely
}
```

### 2. Use Readonly for Immutable Data

```typescript
// Interface with readonly properties
interface TrackReferralMetadata {
  readonly utmSource?: string
  readonly utmMedium?: string
  // ...
}

// Readonly arrays
readonly signals: readonly FraudSignal[]
```

### 3. Leverage Type Guards

```typescript
// Type guard provides runtime safety AND compile-time narrowing
if (isConvertedReferral(referral)) {
  // TypeScript knows these fields are non-null
  console.log(referral.commission_amount) // number, not number | null
  console.log(referral.conversion_date) // Date, not Date | null
}
```

### 4. Use Discriminated Unions

```typescript
// ValidationResult is a discriminated union
const result = validateEmail(input)

// TypeScript can narrow the type
if (result.success) {
  // result.data is available
  const email = result.data
} else {
  // result.error is available
  console.error(result.error)
}
```

### 5. Exhaustive Checking with Switch

```typescript
function handleFraudAction(action: FraudAction): void {
  switch (action) {
    case 'allow':
      // Handle allow
      break
    case 'monitor':
      // Handle monitor
      break
    case 'review':
      // Handle review
      break
    case 'block':
      // Handle block
      break
    default:
      // TypeScript ensures all cases are handled
      const _exhaustive: never = action
  }
}
```

## API Route Integration

### Request Type Validation

```typescript
// In API route handlers
import type {
  TrackReferralRequest,
  TrackReferralResponse,
  ConvertReferralRequest,
  ConvertReferralResponse,
} from '@/lib/types/referral'

export async function POST(request: NextRequest) {
  const body = await request.json() as TrackReferralRequest

  // Validate with type guards
  if (!body.referralCode || !body.referredEmail) {
    return NextResponse.json<TrackReferralResponse>({
      success: false,
      message: 'Missing required fields'
    }, { status: 400 })
  }

  // ... rest of handler
}
```

## Type Coverage

- **Core Functions**: 100% typed with strict null checks
- **API Routes**: Full request/response typing
- **Database Queries**: Typed query results
- **Validation**: Runtime validation with compile-time types
- **Error Handling**: Typed error responses

## Compiler Configuration

The project uses strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}
```

## Testing Type Safety

```bash
# Run TypeScript compiler to check types
npx tsc --noEmit

# Should complete with no errors
```

## Migration Guide

### From Untyped to Typed

```typescript
// Before: Loose typing
async function trackReferral(code: string, email: string, data: any) {
  // ...
}

// After: Strict typing
async function trackReferral(
  code: string,
  email: string,
  metadata: TrackReferralMetadata = {}
): Promise<string> {
  // ...
}
```

### Using Validation Results

```typescript
// Before: Throw on error
function validateCode(code: string): ReferralCode {
  if (!isValid(code)) throw new Error('Invalid')
  return code as ReferralCode
}

// After: Return validation result
function validateCode(code: string): ValidationResult<ReferralCode> {
  if (!isValid(code)) {
    return validationError('Invalid referral code format')
  }
  return validationSuccess(code as ReferralCode)
}
```

## Benefits

1. **Compile-Time Safety**: Catch type errors before runtime
2. **Better IDE Support**: Autocomplete and inline documentation
3. **Refactoring Confidence**: TypeScript ensures changes don't break contracts
4. **Self-Documenting**: Types serve as inline documentation
5. **Runtime Validation**: Type guards provide runtime safety
6. **Null Safety**: Explicit handling of nullable values
7. **Exhaustive Checking**: Ensure all cases are handled

## Related Files

- `/lib/referral.ts` - Core referral functions
- `/lib/types/referral.ts` - Type definitions
- `/lib/types/referral-utils.ts` - Type utilities
- `/lib/referral-fraud-detection.ts` - Fraud detection
- `/app/api/referral/**/*.ts` - API routes

## Further Reading

- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Advanced TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
