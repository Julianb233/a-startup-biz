# Referral System Rate Limiting Implementation

## Overview

Rate limiting has been successfully implemented across all referral system API endpoints to prevent abuse and ensure system stability.

## Implementation Details

### Rate Limiting Configuration

**Location**: `/Users/julianbradley/github-repos/a-startup-biz/lib/rate-limit.ts`

**Configuration**:
- **Limit**: 10 requests per hour per IP address
- **Backend**: Upstash Redis (with automatic in-memory fallback for development)
- **Strategy**: Sliding window algorithm for accurate rate limiting
- **Identifier**: IP address from `x-forwarded-for`, `x-real-ip`, or connection

### Protected Endpoints

All referral API endpoints now have rate limiting:

#### 1. `/api/referral/code` (GET and POST)
**Purpose**: Generate and retrieve referral codes
**Rate Limit**: 10 requests/hour per IP
**Implementation**:
```typescript
// Rate limiting - prevent abuse (10 requests per hour per IP)
const rateLimitResponse = await withRateLimit(request, 'referral')
if (rateLimitResponse) {
  return rateLimitResponse
}
```

#### 2. `/api/referral/track` (POST)
**Purpose**: Track referral signups
**Rate Limit**: 10 requests/hour per IP
**Already Implemented**: ✓

#### 3. `/api/referral/convert` (POST)
**Purpose**: Convert referrals to commissions
**Rate Limit**: 10 requests/hour per IP
**Already Implemented**: ✓

#### 4. `/api/referral/stats` (GET)
**Purpose**: Retrieve referral statistics
**Rate Limit**: 10 requests/hour per IP
**Implementation**:
```typescript
// Rate limiting - prevent abuse (10 requests per hour per IP)
const rateLimitResponse = await withRateLimit(request, 'referral')
if (rateLimitResponse) {
  return rateLimitResponse
}
```

## Technical Architecture

### Rate Limiter Configuration

```typescript
// From lib/rate-limit.ts
referral: redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1h'),
      analytics: true,
      prefix: 'ratelimit:referral',
    })
  : null,
```

### Response Headers

When rate limit is exceeded (429 Too Many Requests):
```typescript
{
  error: 'Too many requests',
  message: 'Please try again later',
  retryAfter: <seconds_until_reset>
}

Headers:
- Retry-After: <seconds>
- X-RateLimit-Limit: 10
- X-RateLimit-Remaining: 0
- X-RateLimit-Reset: <timestamp>
```

### Fallback Mechanism

**Production**: Uses Upstash Redis for distributed rate limiting
**Development**: Automatic fallback to in-memory store when Redis is unavailable

```typescript
// Automatic fallback logic
if (limiter) {
  try {
    const result = await limiter.limit(key)
    return { success: result.success, remaining: result.remaining, reset: result.reset }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Falls back to in-memory
  }
}

// In-memory fallback
const config = configs[type]
return inMemoryRateLimit(key, config.maxRequests, config.windowMs)
```

## Security Benefits

### 1. Abuse Prevention
- Limits malicious actors from generating excessive referral codes
- Prevents referral spam and gaming the system
- Protects against automated bot attacks

### 2. Cost Control
- Limits API calls to prevent unexpected Upstash Redis costs
- Reduces database load from excessive queries
- Protects downstream services (Clerk, database)

### 3. Fair Usage
- Ensures equitable access for all users
- Prevents resource monopolization
- Maintains system performance under load

## Rate Limit Rationale

**10 requests per hour** was chosen because:
1. Legitimate users rarely need more than a few referral operations per hour
2. Prevents rapid-fire abuse attempts
3. Allows sufficient headroom for normal usage patterns
4. Aligns with other sensitive endpoints (email, checkout)

### Typical Usage Patterns
- **Normal User**: 1-3 requests per hour (view stats, generate code)
- **Active Referrer**: 3-7 requests per hour (frequent stat checks)
- **Abuse Pattern**: 20+ requests per hour (bot/scraping)

## Testing Recommendations

### Manual Testing
```bash
# Test rate limit on code generation
for i in {1..12}; do
  curl -X POST http://localhost:3000/api/referral/code \
    -H "Content-Type: application/json" \
    -d '{"userId":"test","email":"test@example.com"}' \
    && echo "Request $i: Success" || echo "Request $i: Failed"
  sleep 1
done

# Expected: First 10 succeed, 11th and 12th return 429
```

### Automated Testing
```typescript
describe('Referral Rate Limiting', () => {
  it('should block requests after 10 per hour', async () => {
    const requests = Array.from({ length: 12 }, (_, i) =>
      fetch('/api/referral/code', {
        method: 'POST',
        body: JSON.stringify({ userId: 'test', email: 'test@example.com' })
      })
    )

    const responses = await Promise.all(requests)
    const successCount = responses.filter(r => r.ok).length
    const rateLimitedCount = responses.filter(r => r.status === 429).length

    expect(successCount).toBe(10)
    expect(rateLimitedCount).toBe(2)
  })
})
```

## Monitoring

### Key Metrics to Track
1. **Rate Limit Hit Rate**: Percentage of requests that hit the rate limit
2. **IP Distribution**: Which IPs are hitting limits most often
3. **Endpoint Distribution**: Which endpoints see the most rate limiting
4. **False Positives**: Legitimate users blocked by rate limits

### Upstash Analytics
Upstash provides built-in analytics for:
- Request counts per IP
- Rate limit violations
- Geographic distribution
- Time-series data

## Future Enhancements

### 1. User-Based Rate Limiting
```typescript
// Rate limit by authenticated user ID instead of IP
const userId = await auth().userId
const result = await rateLimit('referral', userId)
```

### 2. Tiered Rate Limits
```typescript
// Premium users get higher limits
const limit = user.isPremium ? 50 : 10
const customLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(limit, '1h'),
})
```

### 3. Dynamic Rate Limiting
```typescript
// Adjust limits based on system load
const systemLoad = await getSystemLoad()
const limit = systemLoad > 0.8 ? 5 : 10
```

### 4. Rate Limit Warnings
```typescript
// Warn users before hitting the limit
if (remaining <= 2) {
  response.headers.set('X-RateLimit-Warning', 'Approaching rate limit')
}
```

## Files Modified

1. **`/Users/julianbradley/github-repos/a-startup-biz/app/api/referral/code/route.ts`**
   - Added rate limiting import
   - Implemented rate limiting in GET handler
   - Implemented rate limiting in POST handler

2. **`/Users/julianbradley/github-repos/a-startup-biz/app/api/referral/stats/route.ts`**
   - Added rate limiting import
   - Implemented rate limiting in GET handler

3. **`/Users/julianbradley/github-repos/a-startup-biz/REFERRAL_SYSTEM_ARCHITECTURE.md`**
   - Updated rate limiting section from TODO to IMPLEMENTED

## Verification Steps

### 1. TypeScript Compilation
```bash
npx tsc --noEmit
# Should compile without errors
```

### 2. Runtime Testing
```bash
# Start development server
npm run dev

# Test rate limiting
curl -X GET "http://localhost:3000/api/referral/code?userId=test&email=test@example.com"
# Repeat 11 times to trigger rate limit
```

### 3. Production Deployment
```bash
# Ensure Upstash Redis credentials are configured
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN

# Deploy to Vercel
vercel --prod
```

## Configuration Required

### Environment Variables
```bash
# Production (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Development (automatic in-memory fallback)
# No configuration needed
```

## Compliance & Legal

Rate limiting helps ensure compliance with:
- **GDPR**: Prevents excessive data queries
- **CCPA**: Limits personal data access
- **Terms of Service**: Enforces fair usage policies
- **SLA Requirements**: Maintains system performance

## Support & Troubleshooting

### Common Issues

**Issue**: Users hitting rate limit during normal usage
**Solution**: Consider increasing limit or implementing user-based rate limiting

**Issue**: Rate limits not working in development
**Solution**: Check that in-memory fallback is functioning (should log warning)

**Issue**: Rate limits not persisting across server restarts
**Solution**: Verify Upstash Redis connection (check environment variables)

## Conclusion

Rate limiting has been successfully implemented across all referral system endpoints, providing:
- ✓ Abuse prevention
- ✓ Cost control
- ✓ Fair usage enforcement
- ✓ System stability
- ✓ Production-ready with automatic fallback

All endpoints are now protected with a sensible 10 requests/hour limit that balances security with usability.
