import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    // Content Security Policy - restrict resource loading
    const cspDirectives = [
      "default-src 'self'",
      // Scripts: self + trusted third parties (Stripe, Sentry, analytics)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.sentry.io https://browser.sentry-cdn.com https://vercel.live https://*.vercel-scripts.com",
      // Styles: self + inline (required for styled-components/emotion)
      "style-src 'self' 'unsafe-inline'",
      // Images: self + data URIs + trusted image sources
      "img-src 'self' data: blob: https://images.unsplash.com https://*.stripe.com https://*.supabase.co",
      // Fonts: self + data URIs
      "font-src 'self' data:",
      // Connect: API endpoints and services
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.sentry.io https://api.resend.com https://*.livekit.cloud wss://*.livekit.cloud https://*.neon.tech https://vercel.live wss://vercel.live",
      // Frames: Stripe checkout iframe
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      // Media: voice/video calling
      "media-src 'self' blob:",
      // Object: none (block plugins)
      "object-src 'none'",
      // Base: restrict base URI
      "base-uri 'self'",
      // Form actions: restrict form submissions
      "form-action 'self'",
      // Frame ancestors: prevent clickjacking
      "frame-ancestors 'none'",
      // Upgrade insecure requests in production
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
        ],
      },
    ]
  },
}

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const isSentryUploadEnabled = Boolean(sentryAuthToken);

export default withSentryConfig(nextConfig, {
  // Core Sentry settings (also configurable via env vars)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: sentryAuthToken,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Disable release + sourcemap upload when no auth token is present.
  // This prevents build-time warnings in local/dev environments.
  release: {
    create: isSentryUploadEnabled,
  },
  sourcemaps: {
    disable: !isSentryUploadEnabled,
  },

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // Note: ensure this won't conflict with your proxy file matchers.
  tunnelRoute: "/monitoring",

  // NOTE: These options were previously top-level but are now configured under `webpack.*`.
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
    reactComponentAnnotation: {
      enabled: true,
    },
  },
});
