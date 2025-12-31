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
    return [
      {
        source: '/:path*',
        headers: [
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
