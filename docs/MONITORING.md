# Production Monitoring Setup - Sentry Integration

## Overview

**Status**: ✅ Fully Configured (Pending DSN Setup)

This project uses Sentry for comprehensive production error tracking, performance monitoring, and session replay capabilities. The infrastructure is fully configured and ready for production deployment.

---

## Current Configuration

### Installed Package
- `@sentry/nextjs@10.32.1` - Latest Sentry SDK for Next.js

### Configuration Files

#### 1. **Client-Side Configuration** (`sentry.client.config.ts`)
```typescript
Features:
- Session Replay (with privacy controls)
- Browser Performance Tracing
- Error tracking with filtering
- Development mode bypass
- Environment tagging
- Release tracking via Git SHA
```

**Key Features:**
- **Privacy-First Replay**: Masks all text and blocks media by default
- **Smart Error Filtering**: Filters out browser extensions, network errors, and common non-issues
- **Sampling Strategy**: 100% error replay capture, 10% session sampling
- **Performance Monitoring**: Full browser tracing integration

#### 2. **Server-Side Configuration** (`sentry.server.config.ts`)
```typescript
Features:
- Server-side error tracking
- API route monitoring
- Network error filtering
- Development mode bypass
- Environment tagging
```

#### 3. **Edge Runtime Configuration** (`sentry.edge.config.ts`)
```typescript
Features:
- Edge function monitoring
- Middleware error tracking
- Lightweight configuration
```

#### 4. **Instrumentation Hook** (`instrumentation.ts`)
```typescript
Features:
- Automatic runtime detection
- Request error capture
- Route context tracking
- Render source identification
```

#### 5. **Global Error Boundary** (`app/global-error.tsx`)
```typescript
Features:
- Automatic exception capture
- User-friendly error UI
- Retry functionality
- Branded error page
```

#### 6. **Next.js Integration** (`next.config.mjs`)
```typescript
Features:
- Source map upload (production only)
- Ad-blocker bypass via /monitoring tunnel
- Automatic Vercel monitors
- React component annotation
- Debug logging removal
```

---

## Setup Instructions

### Step 1: Create Sentry Project

1. **Go to Sentry**: https://sentry.io
2. **Create Account/Login** (if needed)
3. **Create New Project**:
   - Platform: Next.js
   - Project Name: `a-startup-biz-production`
   - Team: Default or create new team

### Step 2: Get Your DSN

After creating the project, Sentry will show you the DSN (Data Source Name).

**Example DSN Format:**
```
https://[key]@[organization].ingest.sentry.io/[project-id]
```

### Step 3: Configure Environment Variables

#### For Local Development (`.env.local`)
```bash
# Already configured - just add your DSN:
SENTRY_DSN="your-server-dsn-here"
NEXT_PUBLIC_SENTRY_DSN="your-client-dsn-here"

# Optional: For source map uploads (recommended for production debugging)
SENTRY_ORG="your-org-slug"
SENTRY_PROJECT="a-startup-biz-production"
SENTRY_AUTH_TOKEN="your-auth-token"
```

#### For Vercel Production

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Navigate to**: Your Project → Settings → Environment Variables
3. **Add Variables**:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `SENTRY_DSN` | Your server DSN | Production, Preview |
| `NEXT_PUBLIC_SENTRY_DSN` | Your client DSN | Production, Preview |
| `SENTRY_ORG` | Your org slug | Production |
| `SENTRY_PROJECT` | `a-startup-biz-production` | Production |
| `SENTRY_AUTH_TOKEN` | Your auth token | Production |

**To Get SENTRY_AUTH_TOKEN:**
1. Go to Sentry → Settings → Account → API → Auth Tokens
2. Create new token with `project:releases` and `org:read` scopes
3. Copy token and add to Vercel

### Step 4: Deploy and Verify

```bash
# Deploy to production
git add .
git commit -m "Configure Sentry DSN"
git push origin main

# Or redeploy existing code
vercel --prod
```

### Step 5: Test Error Tracking

Add this test route to verify Sentry is working:

**Create: `app/api/sentry-test/route.ts`**
```typescript
export async function GET() {
  throw new Error("Sentry Test Error - If you see this in Sentry, it's working!");
}
```

Then visit: `https://your-domain.com/api/sentry-test`

Check your Sentry dashboard for the error within 1-2 minutes.

---

## Monitoring Features

### 1. Error Tracking

**Automatic Capture:**
- Unhandled exceptions (client + server)
- API route errors
- Edge function errors
- React component errors
- Promise rejections

**Error Context Includes:**
- User browser/device info
- Page URL and navigation history
- Custom tags (environment, release)
- Error digest/ID for correlation
- Stack traces with source maps

### 2. Performance Monitoring

**Metrics Tracked:**
- Page load times
- API route performance
- Database query timing
- Server response times
- Web Vitals (LCP, FID, CLS)

**Transaction Sampling:**
- 100% in production (configurable)
- Includes full request context
- Route-level performance insights

### 3. Session Replay

**Privacy Controls:**
- All text masked by default
- Media blocked
- Sensitive data redacted
- GDPR/CCPA compliant

**Capture Rate:**
- 100% of error sessions
- 10% of normal sessions (configurable)
- Full user interaction replay
- Console logs included

---

## Production Best Practices

### Security

1. **Never Commit Secrets**
   - DSNs are in `.env.local` (gitignored)
   - Auth tokens only in CI/Vercel
   - Keep `.env.example` with placeholders

2. **Privacy Protection**
   - Session replay masks PII by default
   - Filter sensitive data in `beforeSend` hook
   - Configure allowed origins

### Performance

1. **Sampling Strategy**
   ```typescript
   // In production, adjust based on traffic:
   tracesSampleRate: 0.1,  // 10% of transactions
   replaysOnErrorSampleRate: 1.0,  // 100% of errors
   replaysSessionSampleRate: 0.05,  // 5% of sessions
   ```

2. **Source Map Upload**
   - Only enabled with `SENTRY_AUTH_TOKEN`
   - Automatic in CI/CD
   - Disabled in local development

### Error Filtering

**Already Configured to Ignore:**
- Browser extension errors
- Network failures (user offline)
- ResizeObserver loop warnings
- Common third-party script errors

**Add Custom Filters:**
```typescript
// In sentry.client.config.ts
ignoreErrors: [
  // Add patterns here
  /specific-error-pattern/,
  'Known third-party error'
]
```

---

## Monitoring Dashboard

### Key Metrics to Track

1. **Error Rate**
   - Target: < 0.1% of requests
   - Alert threshold: > 1%

2. **Performance**
   - P95 API response time: < 500ms
   - Page load (LCP): < 2.5s
   - First Input Delay: < 100ms

3. **User Impact**
   - Affected users per error
   - Session replay coverage
   - Error trends over time

### Recommended Alerts

**Create in Sentry Dashboard:**

1. **Critical Errors**
   - Condition: Error count > 10 in 1 hour
   - Notify: Slack/Email

2. **Performance Degradation**
   - Condition: P95 response time > 1000ms
   - Notify: Email

3. **High Error Rate**
   - Condition: Error rate > 5% in 15 minutes
   - Notify: PagerDuty/Slack

---

## Integration with Existing Tools

### Vercel Analytics
- Already configured in `app/layout.tsx`
- Complementary to Sentry
- Focus: Page views, Web Vitals

### Vercel Speed Insights
- Already configured in `app/layout.tsx`
- Complementary to Sentry
- Focus: Core Web Vitals scoring

**Recommended Stack:**
- **Sentry**: Error tracking, performance, replay
- **Vercel Analytics**: Traffic and conversion metrics
- **Vercel Speed Insights**: Real User Monitoring (RUM)

---

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN Configuration**
   ```bash
   # Verify environment variables
   echo $NEXT_PUBLIC_SENTRY_DSN
   echo $SENTRY_DSN
   ```

2. **Check Browser Console**
   - Look for Sentry initialization errors
   - Verify network requests to `sentry.io`

3. **Enable Debug Mode (Temporarily)**
   ```typescript
   // In sentry.client.config.ts
   debug: true,
   ```

### Source Maps Not Working

1. **Verify Auth Token**
   - Check Vercel environment variables
   - Ensure token has correct scopes

2. **Check Build Logs**
   ```bash
   # Look for:
   ✓ Sentry source maps uploaded successfully
   ```

3. **Manual Upload (if needed)**
   ```bash
   npx @sentry/wizard --upload-source-maps
   ```

### Performance Impact

**Current Configuration is Optimized:**
- Lazy loading of Sentry SDK
- Minimal bundle size impact (~20KB gzipped)
- Async error capture (non-blocking)
- Development mode disabled

**If Seeing Performance Issues:**
1. Reduce `tracesSampleRate` to 0.1 (10%)
2. Reduce `replaysSessionSampleRate` to 0.01 (1%)
3. Disable session replay for specific routes

---

## Advanced Configuration

### Custom Context

Add custom data to all events:
```typescript
// In any component/route
import * as Sentry from "@sentry/nextjs";

Sentry.setContext("business", {
  industry: "venture_studio",
  tier: "premium"
});

Sentry.setUser({
  id: user.id,
  email: user.email,
  // Don't include sensitive data
});
```

### Custom Instrumentation

Track business metrics:
```typescript
import * as Sentry from "@sentry/nextjs";

// Track important events
Sentry.captureMessage("Document signed", {
  level: "info",
  tags: {
    feature: "document_signing",
    document_type: "agreement"
  }
});

// Measure performance
const transaction = Sentry.startTransaction({
  name: "process-booking",
  op: "booking"
});

// ... your code ...

transaction.finish();
```

### Route-Specific Configuration

```typescript
// In specific route files
export const runtime = 'edge'; // Automatically uses sentry.edge.config.ts

// Disable Sentry for specific routes
export const config = {
  sentry: {
    disabled: true
  }
};
```

---

## Cost Optimization

### Sentry Pricing Tiers

**Free Tier:**
- 5,000 errors/month
- 10,000 performance units/month
- 1 project
- 30-day data retention

**Team Tier ($26/month):**
- 50,000 errors/month
- 100,000 performance units/month
- Unlimited projects
- 90-day retention

**Recommended for Production:**
- Start with Free tier
- Monitor usage in Sentry dashboard
- Upgrade when approaching limits

### Reduce Costs

1. **Adjust Sampling**
   ```typescript
   // Production optimization
   tracesSampleRate: 0.05,  // 5% of transactions
   replaysSessionSampleRate: 0.01,  // 1% of sessions
   ```

2. **Filter Low-Value Events**
   ```typescript
   beforeSend(event, hint) {
     // Skip health check errors
     if (event.request?.url?.includes('/health')) {
       return null;
     }
     return event;
   }
   ```

3. **Set Retention Policies**
   - Configure in Sentry dashboard
   - Delete old issues automatically
   - Archive resolved issues

---

## Support & Resources

### Documentation
- **Sentry Next.js**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Configuration**: https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/
- **Performance**: https://docs.sentry.io/platforms/javascript/guides/nextjs/performance/

### Community
- **Discord**: https://discord.gg/sentry
- **Forum**: https://forum.sentry.io
- **GitHub**: https://github.com/getsentry/sentry-javascript

### Emergency Support
- Dashboard issues indicator
- Status page: https://status.sentry.io
- Support ticket (paid plans)

---

## Next Steps

1. ✅ **Setup Complete** - Infrastructure is ready
2. 🔲 **Add DSN** - Configure Sentry project and add DSN to `.env.local`
3. 🔲 **Deploy to Vercel** - Add environment variables and deploy
4. 🔲 **Test Integration** - Use test endpoint to verify
5. 🔲 **Configure Alerts** - Set up notifications in Sentry dashboard
6. 🔲 **Monitor Metrics** - Track error rate and performance
7. 🔲 **Optimize Sampling** - Adjust based on traffic and budget

---

## Quick Reference

```bash
# Environment Variables Required
SENTRY_DSN="https://..."
NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_ORG="your-org"              # Optional
SENTRY_PROJECT="a-startup-biz"     # Optional
SENTRY_AUTH_TOKEN="token_..."      # Optional

# Test Sentry
curl https://your-domain.com/api/sentry-test

# Check Sentry Status
https://astartupbiz.sentry.io/issues/

# View Performance
https://astartupbiz.sentry.io/performance/

# Session Replay
https://astartupbiz.sentry.io/replays/
```

---

**Monitoring is Production-Ready! Just add your Sentry DSN to go live.**
