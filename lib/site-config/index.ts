/**
 * Site Configuration - Central Export
 * Single source of truth for all site architecture
 */

// Type exports
export * from './types';

// Service exports
export {
  SERVICE_DEFINITIONS,
  getAllServiceSlugs,
  getServiceBySlug,
  getFeaturedServices,
  getAllServices,
  getRelatedServices,
} from './services';

// Navigation exports
export {
  MAIN_NAVIGATION,
  PRIMARY_CTAS,
  FOOTER_NAVIGATION,
  PARTNER_NAVIGATION,
  ADMIN_NAVIGATION,
  MOBILE_NAVIGATION,
  generateBreadcrumbs,
  hasAccess,
  filterNavigationByRole,
} from './navigation';

// Route exports
export {
  PUBLIC_ROUTES,
  PARTNER_ROUTES,
  ADMIN_ROUTES,
  LEGAL_ROUTES,
  getAllRoutes,
  getRoutesByCategory,
  getRouteByPath,
  getServiceRoutes,
  isProtectedRoute,
  getAllowedRoles,
  canAccessRoute,
} from './routes';

// Site metadata
export const SITE_CONFIG = {
  name: 'A Startup Biz',
  tagline: 'Business Clarity & Vetted Service Partners',
  description:
    'Get unstuck with expert clarity calls and access to vetted service providers for EIN filing, legal, accounting, AI automation, and more.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://astartupbiz.com',
  founder: {
    name: 'Tory Zweigle',
    title: 'Founder & Business Consultant',
    email: 'tory@astartupbiz.com',
    phone: '+1 (555) 123-4567', // Replace with actual
  },
  social: {
    linkedin: 'https://linkedin.com/in/toryzweigle',
    twitter: 'https://twitter.com/astartupbiz',
    facebook: 'https://facebook.com/astartupbiz',
    instagram: 'https://instagram.com/astartupbiz',
  },
  clarityCall: {
    price: 1000,
    currency: 'USD',
    duration: 30, // minutes
    platform: 'Zoom',
  },
  contact: {
    email: 'hello@astartupbiz.com',
    supportEmail: 'support@astartupbiz.com',
    partnersEmail: 'partners@astartupbiz.com',
    phone: '+1 (555) 123-4567',
    address: {
      line1: '123 Business Street',
      line2: 'Suite 100',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA',
    },
  },
  business: {
    legal_name: 'A Startup Biz, LLC',
    ein: 'XX-XXXXXXX', // Replace with actual
    founded: '2024',
  },
} as const;

/**
 * Feature flags for progressive rollout
 */
export const FEATURE_FLAGS = {
  enablePartnerPortal: true,
  enableAdminDashboard: true,
  enableClarityCallBooking: true,
  enableApplicationForm: true,
  enableProviderDirectory: true,
  enableReferralTracking: true,
  enableCommissionPayments: false, // Coming soon
  enableLiveChat: false, // Coming soon
  enableBlog: false, // Coming soon
} as const;

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    resetPassword: '/api/auth/reset-password',
  },
  bookings: {
    create: '/api/bookings/create',
    list: '/api/bookings/list',
    update: '/api/bookings/update',
    cancel: '/api/bookings/cancel',
  },
  applications: {
    submit: '/api/applications/submit',
    status: '/api/applications/status',
  },
  providers: {
    list: '/api/providers/list',
    detail: '/api/providers/[id]',
    search: '/api/providers/search',
  },
  referrals: {
    create: '/api/referrals/create',
    list: '/api/referrals/list',
    track: '/api/referrals/track',
  },
  partners: {
    dashboard: '/api/partners/dashboard',
    earnings: '/api/partners/earnings',
    resources: '/api/partners/resources',
  },
  admin: {
    analytics: '/api/admin/analytics',
    clients: '/api/admin/clients',
    providers: '/api/admin/providers',
    referrals: '/api/admin/referrals',
  },
} as const;

/**
 * Third-party integrations
 */
export const INTEGRATIONS = {
  analytics: {
    google: process.env.NEXT_PUBLIC_GA_ID,
    vercel: true,
  },
  payments: {
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_KEY,
      clarityCallPriceId: process.env.NEXT_PUBLIC_STRIPE_CLARITY_PRICE_ID,
    },
  },
  scheduling: {
    calendly: process.env.NEXT_PUBLIC_CALENDLY_URL,
  },
  email: {
    provider: 'resend', // or 'sendgrid', 'postmark'
    fromEmail: 'hello@astartupbiz.com',
    fromName: 'A Startup Biz',
  },
  crm: {
    provider: 'none', // options: 'hubspot', 'salesforce', 'pipedrive' (not currently configured)
  },
} as const;
