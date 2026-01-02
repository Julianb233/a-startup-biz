# Production Monitoring - A Startup Biz

## Overview

A Startup Biz uses Sentry for comprehensive production monitoring, error tracking, and performance analysis. This document outlines the monitoring setup and alerting strategy.

## Current Setup Status ✅

### Installed & Configured
- ✅ `@sentry/nextjs` v10.32.1
- ✅ Client config: `sentry.client.config.ts`
- ✅ Server config: `sentry.server.config.ts`
- ✅ Edge config: `sentry.edge.config.ts`
- ✅ Next.js integration: `next.config.mjs`
- ✅ Environment variables in `.env.example`

### Features Enabled
- **Error Tracking**: Captures unhandled exceptions on client and server
- **Performance Monitoring**: Tracks page load times and API latency (tracesSampleRate: 1.0)
- **Session Replay**: Records user sessions on errors (100% on error, 10% normal)
- **Source Maps**: Automatic upload via Sentry webpack plugin
- **Release Tracking**: Git commit SHA tracking via Vercel
- **Tunnel Route**: `/monitoring` to bypass ad-blockers

## Environment Variables Required

Add to **Vercel Environment Variables**:

```bash
# Required for production
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]

# Required for source maps upload
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=a-startup-biz
SENTRY_AUTH_TOKEN=sntrys_[token]

# Auto-populated by Vercel
VERCEL_GIT_COMMIT_SHA=auto
```

## Critical Alert Rules to Configure

Set up these alerts in Sentry Dashboard → Alerts:

### 1. Payment Processing Errors
**Trigger:** Any error containing "stripe" or "payment"
**Notification:** Slack #critical-payments + Email
**Severity:** Critical
```
Issue Contains: "stripe" OR "payment" OR "checkout"
Environment: production
Immediate notification
```

### 2. Database Connection Failures
**Trigger:** Database connection errors
**Notification:** Slack #infrastructure + PagerDuty
**Severity:** Critical
```
Issue Contains: "database" OR "postgres" OR "neon"
Environment: production
```

### 3. Authentication Errors (High Volume)
**Trigger:** 10+ auth errors in 5 minutes
**Notification:** Slack #security
**Severity:** High
```
Issue Count >= 10 in 5 minutes
Tags: feature: auth
Environment: production
```

### 4. API 500 Error Spike
**Trigger:** 5+ internal server errors in 5 minutes
**Notification:** Slack #api-errors
**Severity:** High
```
Issue Count >= 5 in 5 minutes
Tags: status_code: 500
Environment: production
```

### 5. Partner Dashboard Errors
**Trigger:** Errors in partner-specific routes
**Notification:** Slack #partner-experience
**Severity:** Medium
```
Transaction: /partner/*
Issue Count >= 3 in 10 minutes
Environment: production
```

### 6. Slow API Response (P95 > 3s)
**Trigger:** API latency exceeds 3 seconds
**Notification:** Slack #performance
**Severity:** Medium
```
Transaction Duration (p95) > 3000ms
Route: /api/*
Environment: production
```

### 7. Email Delivery Failures
**Trigger:** Resend API errors
**Notification:** Slack #notifications
**Severity:** High
```
Issue Contains: "resend" OR "email"
Environment: production
```

### 8. LiveKit Voice Call Failures
**Trigger:** Voice call setup errors
**Notification:** Slack #voice-calls
**Severity:** High
```
Issue Contains: "livekit" OR "voice" OR "webrtc"
Environment: production
```

## Error Filtering

The following errors are **intentionally ignored** (configured in Sentry config files):

**Client-side:**
- Browser extension errors (`chrome-extension://`, `safari-extension://`)
- Network errors (`Failed to fetch`, `NetworkError`)
- Common browser quirks (`ResizeObserver loop limit exceeded`)
- Development environment errors (not sent to Sentry)

**Server-side:**
- Common network timeouts (`ECONNREFUSED`, `ETIMEDOUT`)
- Development environment errors (not sent to Sentry)

## Integration Points

### Client-Side Monitoring
```typescript
// sentry.client.config.ts features:
- Browser tracing integration
- Session replay (masked PII)
- Performance monitoring
- Automatic error capture
- Release tracking
```

### Server-Side Monitoring
```typescript
// sentry.server.config.ts features:
- Express error handling
- API route monitoring
- Database query tracking
- Server-side performance
```

### Next.js Integration
```typescript
// next.config.mjs features:
- Automatic source map upload
- Webpack plugin integration
- Tunnel route for reliability
- Tree-shaking debug logs
- Component annotation
```

## Monitoring Dashboards

Create these custom dashboards in Sentry:

### 1. Business Critical Health
- Payment processing errors (last 24h)
- Partner signup completion rate
- Authentication success rate
- Email delivery success rate
- Voice call success rate

### 2. API Performance
- Endpoint latency heatmap (P50, P95, P99)
- Database query performance
- Failed requests by route
- Error rate by endpoint

### 3. User Experience
- Page load times by route
- Session replay availability
- Geographic error distribution
- Browser/device error breakdown
- Core Web Vitals (LCP, FID, CLS)

## Key Metrics to Monitor

### Business Impact Metrics
- **Payment Success Rate**: Track Stripe integration errors
- **Partner Onboarding**: Monitor signup flow completion
- **Voice Call Quality**: Track LiveKit connection success
- **Email Delivery**: Monitor Resend API failures

### Technical Health Metrics
- **API Error Rate**: < 0.1% target
- **API Latency (P95)**: < 3 seconds target
- **Database Connection Pool**: Monitor pool exhaustion
- **Memory Usage**: Alert on >90% heap usage

### User Experience Metrics
- **Page Load Time (P75)**: < 2 seconds target
- **Time to Interactive**: < 3 seconds target
- **Session Error Rate**: < 2% sessions with errors
- **Core Web Vitals**: All "Good" ratings

## Deployment Checklist

Before going live with monitoring:

1. ✅ **Verify Sentry DSN** in Vercel environment variables
2. ✅ **Configure alert rules** (all 8 critical alerts above)
3. ✅ **Set up Slack integration** for notifications
4. ✅ **Test error tracking** in staging environment
5. ✅ **Create monitoring dashboards** (3 dashboards above)
6. ✅ **Document escalation procedures** (who gets paged for what)
7. ✅ **Set up on-call rotation** (if applicable)
8. ✅ **Create incident response playbook** (similar to bottleneck-bots)

## Testing Sentry Integration

### Development Testing
```typescript
// Test client-side tracking
import * as Sentry from '@sentry/nextjs';
Sentry.captureMessage('Test client error', 'info');

// Test server-side tracking
// In API route or server component
import * as Sentry from '@sentry/nextjs';
Sentry.captureMessage('Test server error', 'error');
```

### Production Verification
```bash
# After deployment, trigger a test error
# Then check Sentry dashboard for event

# Verify source maps are working
# Stack traces should show original TypeScript code, not minified JS
```

## Performance Best Practices

### Sampling Rates
- **Traces**: 100% in production (comprehensive monitoring needed)
- **Replays**: 100% on error, 10% normal sessions
- **Profiling**: Disabled (enable if needed for performance debugging)

### Data Privacy
- **Session Replay**: All text masked, all media blocked
- **PII Filtering**: No user emails or sensitive data in error context
- **IP Anonymization**: Enabled by default in Sentry

### Cost Optimization
- Monitor quota usage in Sentry dashboard
- Adjust sampling rates if approaching quota limits
- Use `ignoreErrors` to filter noise
- Set up data retention policies (90 days recommended)

## Next Steps

1. **Add Sentry DSN** to Vercel production environment
2. **Configure 8 critical alert rules** in Sentry dashboard
3. **Set up Slack webhook** for notifications (#critical-alerts channel)
4. **Create incident response team** and on-call schedule
5. **Monitor first week** of production errors and tune thresholds
6. **Document common issues** in internal wiki
7. **Train team** on using Sentry for debugging

## Resources

- [Sentry Dashboard](https://sentry.io/organizations/[org]/projects/a-startup-biz/)
- [Next.js Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Dashboard](https://vercel.com/[team]/a-startup-biz)
- [Alert Configuration Guide](https://docs.sentry.io/product/alerts/)
- [Session Replay Guide](https://docs.sentry.io/product/session-replay/)
