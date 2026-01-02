/**
 * Performance Monitoring Utilities
 *
 * Tracks business-critical metrics and performance data
 * Integrates with Sentry and Vercel Analytics
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Track a business metric to Sentry (breadcrumb) and Vercel Analytics
 */
export const trackBusinessMetric = (
  metricName: string,
  value: number,
  tags?: Record<string, string>
) => {
  // Send to Sentry as breadcrumb
  Sentry.addBreadcrumb({
    category: 'metric',
    message: metricName,
    level: 'info',
    data: {
      value,
      environment: process.env.NODE_ENV || 'development',
      ...tags,
    },
  });

  // Also track in Vercel Analytics (client-side only)
  if (typeof window !== 'undefined' && 'va' in window) {
    (window as any).va?.track(metricName, {
      value,
      ...tags,
    });
  }
};

/**
 * Track a counter metric (increments)
 */
export const trackEvent = (
  eventName: string,
  tags?: Record<string, string>
) => {
  // Send to Sentry as breadcrumb
  Sentry.addBreadcrumb({
    category: 'event',
    message: eventName,
    level: 'info',
    data: {
      environment: process.env.NODE_ENV || 'development',
      ...tags,
    },
  });

  if (typeof window !== 'undefined' && 'va' in window) {
    (window as any).va?.track(eventName, tags);
  }
};

/**
 * Track a distribution metric (latency, duration, etc.)
 */
export const trackDistribution = (
  metricName: string,
  value: number,
  tags?: Record<string, string>
) => {
  // Send to Sentry as breadcrumb with duration data
  Sentry.addBreadcrumb({
    category: 'performance',
    message: metricName,
    level: 'info',
    data: {
      value,
      unit: 'ms',
      environment: process.env.NODE_ENV || 'development',
      ...tags,
    },
  });
};

/**
 * Track timing of an operation
 */
export const trackTiming = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> => {
  const startTime = Date.now();

  try {
    const result = await operation();
    const duration = Date.now() - startTime;

    trackDistribution(`${operationName}.duration`, duration, {
      ...tags,
      success: 'true',
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    trackDistribution(`${operationName}.duration`, duration, {
      ...tags,
      success: 'false',
    });

    throw error;
  }
};

/**
 * Business-specific metrics
 */
export const BusinessMetrics = {
  /**
   * Partner onboarding metrics
   */
  partnerOnboarding: {
    started: (source: string) =>
      trackEvent('partner.onboarding.started', { source }),

    stepCompleted: (step: string, durationMs: number) => {
      trackEvent('partner.onboarding.step_completed', { step });
      trackDistribution('partner.onboarding.step_duration', durationMs, { step });
    },

    completed: (totalDurationMs: number, source: string) => {
      trackEvent('partner.onboarding.completed', { source });
      trackDistribution('partner.onboarding.total_duration', totalDurationMs, { source });
    },

    abandoned: (step: string, reason?: string) =>
      trackEvent('partner.onboarding.abandoned', { step, reason: reason || 'unknown' }),
  },

  /**
   * Booking metrics
   */
  booking: {
    created: (industry: string, value: number) => {
      trackEvent('booking.created', { industry });
      trackDistribution('booking.value', value, { industry });
    },

    confirmed: (industry: string) =>
      trackEvent('booking.confirmed', { industry }),

    cancelled: (industry: string, reason?: string) =>
      trackEvent('booking.cancelled', { industry, reason: reason || 'unknown' }),
  },

  /**
   * Payment metrics
   */
  payment: {
    initiated: (provider: string, amount: number) => {
      trackEvent('payment.initiated', { provider });
      trackDistribution('payment.amount', amount, { provider });
    },

    succeeded: (provider: string, processingTimeMs: number) => {
      trackEvent('payment.succeeded', { provider });
      trackDistribution('payment.processing_time', processingTimeMs, { provider });
    },

    failed: (provider: string, errorCode?: string) =>
      trackEvent('payment.failed', { provider, error_code: errorCode || 'unknown' }),
  },

  /**
   * Voice call metrics
   */
  voiceCall: {
    started: () => trackEvent('voice_call.started'),

    connected: (connectionTimeMs: number) => {
      trackEvent('voice_call.connected');
      trackDistribution('voice_call.connection_time', connectionTimeMs);
    },

    ended: (durationSeconds: number, outcome: 'completed' | 'dropped' | 'error') => {
      trackEvent('voice_call.ended', { outcome });
      trackDistribution('voice_call.duration', durationSeconds, { outcome });
    },
  },

  /**
   * Email metrics
   */
  email: {
    sent: (template: string) => trackEvent('email.sent', { template }),

    delivered: (template: string) => trackEvent('email.delivered', { template }),

    opened: (template: string) => trackEvent('email.opened', { template }),

    clicked: (template: string) => trackEvent('email.clicked', { template }),

    bounced: (template: string, reason: string) =>
      trackEvent('email.bounced', { template, reason }),
  },

  /**
   * Document signing metrics
   */
  documentSigning: {
    initiated: (documentType: string) =>
      trackEvent('document.signing.initiated', { document_type: documentType }),

    completed: (documentType: string, durationMs: number) => {
      trackEvent('document.signing.completed', { document_type: documentType });
      trackDistribution('document.signing.duration', durationMs, { document_type: documentType });
    },

    declined: (documentType: string) =>
      trackEvent('document.signing.declined', { document_type: documentType }),
  },

  /**
   * Referral metrics
   */
  referral: {
    created: (source: string) => trackEvent('referral.created', { source }),

    converted: (source: string) => trackEvent('referral.converted', { source }),

    rewarded: (amount: number) => trackDistribution('referral.reward_amount', amount),
  },

  /**
   * Microsite metrics
   */
  microsite: {
    scraped: (durationMs: number, pagesFound: number) => {
      trackEvent('microsite.scraped');
      trackDistribution('microsite.scrape_duration', durationMs);
      trackBusinessMetric('microsite.pages_found', pagesFound);
    },

    leadCaptured: (source: string) => trackEvent('microsite.lead_captured', { source }),
  },
};

/**
 * Alert on critical business events
 */
export const alertCriticalEvent = (
  message: string,
  context?: Record<string, any>,
  level: 'warning' | 'error' | 'info' = 'warning'
) => {
  Sentry.captureMessage(message, {
    level,
    tags: {
      business_critical: 'true',
      environment: process.env.NODE_ENV,
    },
    contexts: {
      business_context: context || {},
    },
  });
};
