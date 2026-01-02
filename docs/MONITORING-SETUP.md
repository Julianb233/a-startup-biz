# Production Monitoring Setup Guide

**Project:** a-startup-biz
**Last Updated:** 2026-01-02
**Otto-Observer Analysis**

---

## 📊 Executive Summary

This Next.js 16.1.0 application is a multi-tenant SaaS platform with partner management, voice AI, payments, and booking systems. Current monitoring includes **Sentry** (already configured) and **Vercel Analytics** (integrated). This guide optimizes existing monitoring and adds comprehensive observability.

**Current State:**
- ✅ Sentry error tracking (client + server + edge)
- ✅ Vercel Analytics integration
- ✅ Instrumentation configured
- ⚠️ Performance monitoring at 100% sample rate (needs optimization)
- ❌ No custom business metrics tracking
- ❌ No alerting configuration
- ❌ No uptime monitoring for critical APIs

---

## 🎯 Monitoring Strategy

### 1. Error Tracking (Sentry) - **Already Configured**

**Current Configuration:**
- Client-side: Session replay enabled (10% sessions, 100% errors)
- Server-side: Basic error capture
- Edge functions: Minimal tracking

**Optimization Required:**

```typescript
// sentry.client.config.ts - OPTIMIZE SAMPLE RATES
export const optimizedClientConfig = {
  // ⚠️ REDUCE from 1.0 to 0.1 in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Good: Session replay configuration
  replaysOnErrorSampleRate: 1.0,  // Capture all error sessions
  replaysSessionSampleRate: 0.05, // REDUCE to 5% of normal sessions

  // Add profiling for performance bottlenecks
  profilesSampleRate: 0.1,
};
```

**Recommended Alerts:**

| Alert Type | Threshold | Action |
|------------|-----------|--------|
| Error spike | 50+ errors/min | Page oncall engineer |
| Payment failures | 5+ in 5min | Page + Slack #payments |
| Auth failures | 20+ in 5min | Slack #security |
| API latency | p95 > 2s | Slack #engineering |
| Partner onboarding errors | Any | Slack #partners |

---

### 2. Performance Monitoring

#### A. Vercel Analytics - **Already Integrated**

**Current Setup:**
```typescript
// Already in layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

<Analytics />
<SpeedInsights />
```

**Vercel Provides:**
- Real User Monitoring (RUM)
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Geographic distribution

**No Additional Configuration Needed** - Enable in Vercel dashboard.

#### B. Custom Performance Metrics

**Add Business-Critical Timing:**

```typescript
// lib/monitoring/performance.ts
export const trackBusinessMetric = (
  metricName: string,
  value: number,
  tags?: Record<string, string>
) => {
  // Send to Sentry
  Sentry.metrics.gauge(metricName, value, {
    tags: {
      environment: process.env.NODE_ENV,
      ...tags,
    },
  });

  // Also track in Vercel Analytics
  if (typeof window !== 'undefined') {
    window.va?.track(metricName, {
      value,
      ...tags,
    });
  }
};

// Usage examples
trackBusinessMetric('partner_onboarding_duration', durationMs, {
  step: 'verification',
});

trackBusinessMetric('voice_call_duration', callDurationSeconds, {
  outcome: 'completed',
});

trackBusinessMetric('payment_processing_time', processingMs, {
  provider: 'stripe',
  success: 'true',
});
```

**Critical Metrics to Track:**

| Metric | Where to Track | Alert Threshold |
|--------|---------------|-----------------|
| Partner onboarding completion time | `/onboarding/*` | p95 > 5 minutes |
| Voice call connection time | LiveKit integration | p95 > 3 seconds |
| Payment processing time | Stripe webhooks | p95 > 2 seconds |
| Document signing completion | Dropbox Sign API | p95 > 10 seconds |
| Email delivery rate | Resend integration | < 95% success |
| Microsite scraping duration | FireCrawl API | p95 > 30 seconds |

---

### 3. Critical Error Detection

**Custom Error Boundaries with Context:**

```typescript
// components/monitoring/error-boundary.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
}

export class MonitoredErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Add business context
    Sentry.withScope((scope) => {
      scope.setContext('component', {
        context: this.props.context,
        componentStack: errorInfo.componentStack,
      });

      // Tag critical business flows
      if (this.props.context === 'partner-onboarding') {
        scope.setTag('business_critical', 'true');
        scope.setLevel('error');
      }

      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-600">
          Something went wrong. Our team has been notified.
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<MonitoredErrorBoundary context="partner-onboarding" fallback={<OnboardingError />}>
  <OnboardingFlow />
</MonitoredErrorBoundary>
```

---

### 4. API Route Monitoring

**Middleware for API Observability:**

```typescript
// middleware/api-monitoring.ts
import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function withMonitoring(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    routeName: string;
    critical?: boolean;
  }
) {
  return async (req: NextRequest) => {
    const startTime = Date.now();

    return await Sentry.withMonitor(
      options?.routeName || req.nextUrl.pathname,
      async () => {
        try {
          const response = await handler(req);

          // Track successful API calls
          const duration = Date.now() - startTime;

          Sentry.metrics.distribution(
            'api.request.duration',
            duration,
            {
              tags: {
                route: options?.routeName || req.nextUrl.pathname,
                status: response.status.toString(),
                method: req.method,
              },
            }
          );

          // Alert on slow critical endpoints
          if (options?.critical && duration > 2000) {
            Sentry.captureMessage(
              `Slow critical endpoint: ${options.routeName}`,
              {
                level: 'warning',
                tags: {
                  duration: duration.toString(),
                  route: options.routeName,
                },
              }
            );
          }

          return response;
        } catch (error) {
          // Capture API errors with full context
          Sentry.withScope((scope) => {
            scope.setContext('request', {
              url: req.url,
              method: req.method,
              headers: Object.fromEntries(req.headers),
            });

            if (options?.critical) {
              scope.setTag('business_critical', 'true');
              scope.setLevel('error');
            }

            Sentry.captureException(error);
          });

          throw error;
        }
      },
      {
        schedule: { type: 'interval', value: 1, unit: 'minute' },
        checkinMargin: 1,
        maxRuntime: 30,
      }
    );
  };
}

// Usage in API routes
// app/api/payments/route.ts
import { withMonitoring } from '@/middleware/api-monitoring';

export const POST = withMonitoring(
  async (req) => {
    // Your handler logic
  },
  { routeName: 'payments.process', critical: true }
);
```

**Critical API Routes to Monitor:**

```typescript
// Priority 1: Revenue Impact
- /api/payments/process
- /api/stripe/webhook
- /api/stripe/connect/webhook

// Priority 2: User Experience
- /api/voice/token
- /api/booking/create
- /api/partner/onboard

// Priority 3: Data Integrity
- /api/microsites/scrape
- /api/referral/track
- /api/notifications/send-email
```

---

### 5. Uptime & Health Monitoring

**Health Check Endpoints:**

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  error?: string;
}

export async function GET() {
  const checks: HealthCheck[] = [];

  // Database health
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const start = Date.now();
    await sql`SELECT 1`;
    checks.push({
      service: 'database',
      status: 'healthy',
      latency: Date.now() - start,
    });
  } catch (error) {
    checks.push({
      service: 'database',
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Redis health
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const start = Date.now();
      const response = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/ping`,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
        }
      );
      checks.push({
        service: 'redis',
        status: response.ok ? 'healthy' : 'degraded',
        latency: Date.now() - start,
      });
    } catch (error) {
      checks.push({
        service: 'redis',
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Supabase health
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const start = Date.now();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      );
      checks.push({
        service: 'supabase',
        status: response.ok ? 'healthy' : 'degraded',
        latency: Date.now() - start,
      });
    } catch (error) {
      checks.push({
        service: 'supabase',
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const allHealthy = checks.every((c) => c.status === 'healthy');
  const statusCode = allHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: statusCode }
  );
}
```

**External Uptime Monitoring (Recommended):**

Use **UptimeRobot** (free) or **Better Uptime** for external monitoring:

1. Monitor `/api/health` endpoint every 5 minutes
2. Alert on 3 consecutive failures
3. Monitor SSL certificate expiration
4. Check from multiple geographic regions

**Sentry Crons for Background Jobs:**

```typescript
// app/api/notifications/send-email/route.ts (Vercel Cron)
import * as Sentry from '@sentry/nextjs';

export async function GET(request: Request) {
  // Check cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const checkInId = Sentry.captureCheckIn({
    monitorSlug: 'send-email-notifications',
    status: 'in_progress',
  });

  try {
    // Your email sending logic
    await sendPendingEmails();

    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: 'send-email-notifications',
      status: 'ok',
    });

    return Response.json({ success: true });
  } catch (error) {
    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: 'send-email-notifications',
      status: 'error',
    });

    throw error;
  }
}
```

---

## 🚨 Alerting Configuration

### Sentry Alert Rules (Configure in Dashboard)

**1. Revenue-Critical Alerts**

```yaml
Alert: Payment Processing Failures
Condition: Error count > 5 in 5 minutes
Filters:
  - route contains "/api/payments" OR "/api/stripe"
  - environment = "production"
Action:
  - PagerDuty: High severity
  - Slack: #payments channel
  - Email: payments-oncall@astartupbiz.com
```

**2. Partner Experience Alerts**

```yaml
Alert: Partner Onboarding Errors
Condition: Error count > 3 in 10 minutes
Filters:
  - context = "partner-onboarding"
  - environment = "production"
Action:
  - Slack: #partners channel
  - Email: partner-success@astartupbiz.com
```

**3. Voice System Alerts**

```yaml
Alert: LiveKit Connection Failures
Condition: Error rate > 10% AND event count > 20
Filters:
  - error.type contains "LiveKit"
  - environment = "production"
Action:
  - PagerDuty: Medium severity
  - Slack: #support channel
```

**4. Database Performance Alerts**

```yaml
Alert: Database Query Timeout
Condition: Error message contains "timeout" AND database tagged
Filters:
  - tags.service = "database"
  - environment = "production"
Action:
  - Slack: #engineering channel
  - Email: backend-team@astartupbiz.com
```

---

## 📈 Business Metrics Dashboard

**Custom Sentry Dashboard Configuration:**

```javascript
// Track these metrics in your code
Sentry.metrics.increment('partner.signup', {
  tags: { source: 'organic' }
});

Sentry.metrics.distribution('booking.value', bookingAmount, {
  tags: { industry: 'climbing' }
});

Sentry.metrics.gauge('active.voice_calls', activeCallsCount);

Sentry.metrics.set('daily.active_partners', uniquePartnerIds, {
  tags: { tier: 'premium' }
});
```

**Key Business Metrics:**

| Metric | Type | Purpose |
|--------|------|---------|
| partner.signup | Counter | Track partner acquisition |
| partner.activation_time | Distribution | Measure onboarding efficiency |
| booking.created | Counter | Revenue pipeline |
| booking.value | Distribution | Revenue tracking |
| voice_call.duration | Distribution | Usage patterns |
| voice_call.outcome | Counter | Success rate |
| email.sent | Counter | Communication volume |
| email.delivery_rate | Gauge | Email health |
| referral.conversion | Counter | Marketing attribution |

---

## 🔧 Implementation Steps

### Phase 1: Optimize Existing (Week 1)

- [ ] **Reduce Sentry sample rates** in production
  - Set `tracesSampleRate: 0.1`
  - Set `replaysSessionSampleRate: 0.05`
  - Add `profilesSampleRate: 0.1`

- [ ] **Add error boundaries** to critical flows
  - Partner onboarding
  - Payment processing
  - Voice call setup
  - Document signing

- [ ] **Configure Sentry alerts** (see above)
  - Revenue-critical alerts
  - Partner experience alerts
  - Voice system alerts

### Phase 2: API Monitoring (Week 2)

- [ ] **Implement API monitoring middleware**
  - Add to all payment routes
  - Add to partner onboarding routes
  - Add to voice token generation

- [ ] **Create health check endpoint**
  - Database connectivity
  - Redis connectivity
  - External service health

- [ ] **Set up uptime monitoring**
  - UptimeRobot free tier
  - Monitor `/api/health`
  - SSL certificate monitoring

### Phase 3: Business Metrics (Week 3)

- [ ] **Implement business metric tracking**
  - Partner funnel metrics
  - Revenue metrics
  - Usage metrics

- [ ] **Create Sentry dashboard**
  - Business KPIs
  - System health
  - Error trends

### Phase 4: Proactive Monitoring (Week 4)

- [ ] **Set up Sentry Crons** for background jobs
  - Email notification job
  - Referral tracking cleanup
  - Partner data sync

- [ ] **Configure performance budgets**
  - Set Core Web Vitals targets
  - Monitor API latency budgets
  - Track bundle size changes

---

## 💰 Cost Optimization

**Current Setup:**
- Sentry: Free tier allows 5K errors/month, 50K transactions/month
- Vercel Analytics: Included with Pro plan
- Vercel Speed Insights: Included with Pro plan

**Optimization for Free Tier:**

```typescript
// Only send critical errors in production
beforeSend(event, hint) {
  // Development: don't send
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  // Production: filter non-critical
  const error = hint.originalException;

  // Skip network errors (user's connection, not our fault)
  if (
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('NetworkError')
  ) {
    return null;
  }

  // Skip browser extension errors
  if (event.request?.url?.includes('chrome-extension://')) {
    return null;
  }

  // Send everything else
  return event;
}
```

**Sentry Quota Management:**
- Free tier: 5K errors/month
- With 10% sampling: ~50K requests = 5K transactions
- Session replay: 50 hours/month on free tier

**If You Exceed Free Tier:**
- Team plan: $26/month (100K errors, 500K transactions)
- Monitor quota in Sentry dashboard
- Adjust sample rates if approaching limit

---

## 🎯 Success Metrics

**After 30 Days, You Should See:**

✅ **Error Detection:**
- Mean time to detection (MTTD) < 5 minutes
- 100% of payment errors captured
- < 1% of errors are duplicates

✅ **Performance:**
- 95% of pages load in < 2 seconds
- All API routes p95 latency < 1 second
- No performance regressions in production

✅ **Uptime:**
- 99.9% uptime for critical endpoints
- < 5 minutes downtime per incident
- 100% of health check passes

✅ **Business Impact:**
- Partner onboarding completion rate tracked
- Revenue impact of errors quantified
- A/B testing performance monitored

---

## 🔗 Quick Links

- [Sentry Dashboard](https://sentry.io/)
- [Vercel Analytics](https://vercel.com/dashboard/analytics)
- [Uptime Robot Setup](https://uptimerobot.com/)
- [Sentry Crons Documentation](https://docs.sentry.io/product/crons/)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)

---

## 📚 Additional Resources

**Internal Documentation:**
- `/docs/GO-LIVE-CHECKLIST.md` - Pre-deployment checklist
- `/docs/SITE_ARCHITECTURE.md` - System architecture
- `.env.example` - Environment variables reference

**External Guides:**
- [Sentry Next.js Setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics Guide](https://vercel.com/docs/analytics)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Questions?** Contact the engineering team or review this guide during sprint planning.
