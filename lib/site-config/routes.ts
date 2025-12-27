/**
 * Route Definitions and Site Map
 * Comprehensive routing configuration with authorization and metadata
 */

import {
  SitePage,
  PageCategory,
  UserRole,
  ChangeFrequency,
} from './types';
import { getAllServiceSlugs } from './services';

/**
 * Public routes - accessible to everyone
 */
export const PUBLIC_ROUTES: SitePage[] = [
  {
    id: 'home',
    path: '/',
    title: 'A Startup Biz - Business Clarity & Vetted Service Partners',
    description:
      'Get unstuck with expert clarity calls and access to vetted service providers for EIN filing, legal, accounting, AI automation, and more.',
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 1.0,
    changeFrequency: ChangeFrequency.WEEKLY,
    metadata: {
      ogImage: '/og-images/home.png',
      ogType: 'website',
      keywords: [
        'business consulting',
        'startup help',
        'clarity call',
        'business services',
        'vetted providers',
      ],
    },
  },
  {
    id: 'about',
    path: '/about',
    title: "About Tory Zweigle - A Startup Biz Founder's Story",
    description:
      "Learn about Tory Zweigle's journey from corporate leadership to helping entrepreneurs build successful businesses through clarity and connection.",
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.9,
    changeFrequency: ChangeFrequency.MONTHLY,
    metadata: {
      ogImage: '/og-images/about.png',
      keywords: ['tory zweigle', 'founder story', 'business consultant', 'entrepreneur'],
    },
  },
  {
    id: 'services',
    path: '/services',
    title: 'Business Services - Vetted Providers for Every Need',
    description:
      'Browse our curated network of vetted service providers across legal, accounting, marketing, AI automation, and more business-critical services.',
    category: PageCategory.SERVICE,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.95,
    changeFrequency: ChangeFrequency.WEEKLY,
    metadata: {
      ogImage: '/og-images/services.png',
      keywords: [
        'business services',
        'service providers',
        'EIN filing',
        'business legal',
        'accounting',
      ],
    },
  },
  {
    id: 'how-it-works',
    path: '/how-it-works',
    title: 'How It Works - Three Steps to Business Success',
    description:
      'Our proven process: Book a clarity call, get matched with vetted providers, and build your business with expert support.',
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.9,
    changeFrequency: ChangeFrequency.MONTHLY,
    metadata: {
      ogImage: '/og-images/how-it-works.png',
      keywords: ['process', 'how it works', 'business consulting', 'clarity call'],
    },
  },
  {
    id: 'book-call',
    path: '/book-call',
    title: 'Book Your $1,000 Clarity Call - Get Unstuck Today',
    description:
      'Schedule a 30-minute Zoom clarity call with Tory Zweigle. Get actionable insights and clear direction for your business challenges.',
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.95,
    changeFrequency: ChangeFrequency.DAILY,
    metadata: {
      ogImage: '/og-images/book-call.png',
      keywords: [
        'clarity call',
        'business consultation',
        'book appointment',
        'business coaching',
      ],
    },
  },
  {
    id: 'apply',
    path: '/apply',
    title: 'Apply - Qualify for Our Service Network',
    description:
      'Submit your application to access our network of vetted service providers and start building your business foundation.',
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.85,
    changeFrequency: ChangeFrequency.MONTHLY,
    metadata: {
      ogImage: '/og-images/apply.png',
      keywords: ['application', 'qualify', 'onboarding', 'get started'],
    },
  },
  {
    id: 'contact',
    path: '/contact',
    title: 'Contact Us - Get in Touch',
    description:
      'Have questions? Reach out to our team for support, partnership inquiries, or general information.',
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.7,
    changeFrequency: ChangeFrequency.MONTHLY,
    metadata: {
      keywords: ['contact', 'support', 'help', 'get in touch'],
    },
  },
  {
    id: 'become-partner',
    path: '/become-partner',
    title: 'Become a Partner - Join Our Network',
    description:
      'Join our referral partner network and earn commissions by connecting clients with vetted service providers.',
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.8,
    changeFrequency: ChangeFrequency.MONTHLY,
    metadata: {
      keywords: ['partner program', 'affiliate', 'referral', 'earn commissions'],
    },
  },
  {
    id: 'partner-benefits',
    path: '/partner-benefits',
    title: 'Partner Benefits - Earn While You Help',
    description:
      'Learn about our partner program benefits including commission structures, marketing support, and ongoing training.',
    category: PageCategory.PUBLIC,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.7,
    changeFrequency: ChangeFrequency.MONTHLY,
    metadata: {
      keywords: ['partner benefits', 'commission', 'affiliate program'],
    },
  },
];

/**
 * Service detail pages - dynamically generated
 */
export function getServiceRoutes(): SitePage[] {
  return getAllServiceSlugs().map((slug) => ({
    id: `service-${slug}`,
    path: `/services/${slug}`,
    title: `${slug.replace(/-/g, ' ')} Services - Vetted Providers`,
    description: `Find trusted ${slug.replace(/-/g, ' ')} service providers in our vetted network.`,
    category: PageCategory.SERVICE,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.85,
    changeFrequency: ChangeFrequency.MONTHLY,
    metadata: {
      keywords: [slug, 'service providers', 'business services'],
    },
  }));
}

/**
 * Partner Portal routes - protected
 */
export const PARTNER_ROUTES: SitePage[] = [
  {
    id: 'partner-portal',
    path: '/partner-portal',
    title: 'Partner Portal - Login',
    description: 'Access your partner dashboard to manage referrals and track earnings.',
    category: PageCategory.PARTNER_PORTAL,
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
    priority: 0.6,
    changeFrequency: ChangeFrequency.DAILY,
  },
  {
    id: 'partner-dashboard',
    path: '/partner-portal/dashboard',
    title: 'Partner Dashboard - Overview',
    description: 'Your referral performance at a glance.',
    category: PageCategory.PARTNER_PORTAL,
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
    priority: 0.5,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'partner-providers',
    path: '/partner-portal/providers',
    title: 'Vetted Providers - Partner Portal',
    description: 'Browse and recommend providers to your clients.',
    category: PageCategory.PARTNER_PORTAL,
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
    priority: 0.5,
    changeFrequency: ChangeFrequency.WEEKLY,
  },
  {
    id: 'partner-referrals',
    path: '/partner-portal/referrals',
    title: 'My Referrals - Partner Portal',
    description: 'Track the status of all your client referrals.',
    category: PageCategory.PARTNER_PORTAL,
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
    priority: 0.5,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'partner-earnings',
    path: '/partner-portal/earnings',
    title: 'Earnings - Partner Portal',
    description: 'View your commission earnings and payout history.',
    category: PageCategory.PARTNER_PORTAL,
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
    priority: 0.5,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'partner-resources',
    path: '/partner-portal/resources',
    title: 'Resources - Partner Portal',
    description: 'Marketing materials and training resources.',
    category: PageCategory.PARTNER_PORTAL,
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
    priority: 0.4,
    changeFrequency: ChangeFrequency.MONTHLY,
  },
  {
    id: 'partner-profile',
    path: '/partner-portal/profile',
    title: 'Profile Settings - Partner Portal',
    description: 'Manage your account settings and preferences.',
    category: PageCategory.PARTNER_PORTAL,
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
    priority: 0.3,
    changeFrequency: ChangeFrequency.MONTHLY,
  },
];

/**
 * Admin routes - highly protected
 */
export const ADMIN_ROUTES: SitePage[] = [
  {
    id: 'admin',
    path: '/admin',
    title: 'Admin - Login',
    description: 'Administrative access portal.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-dashboard',
    path: '/admin/dashboard',
    title: 'Admin Dashboard',
    description: 'Business overview and key metrics.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-clients',
    path: '/admin/clients',
    title: 'Client Management - Admin',
    description: 'Manage all client accounts and applications.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-providers',
    path: '/admin/providers',
    title: 'Provider Management - Admin',
    description: 'Manage service provider network.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-referrals',
    path: '/admin/referrals',
    title: 'All Referrals - Admin',
    description: 'Track and manage all referrals across the platform.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-bookings',
    path: '/admin/bookings',
    title: 'Clarity Call Bookings - Admin',
    description: 'Manage scheduled clarity calls.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-applications',
    path: '/admin/applications',
    title: 'Applications - Admin',
    description: 'Review and approve client applications.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-analytics',
    path: '/admin/analytics',
    title: 'Analytics - Admin',
    description: 'Business intelligence and reporting.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-content',
    path: '/admin/content',
    title: 'Content Management - Admin',
    description: 'Manage website content and pages.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.ALWAYS,
  },
  {
    id: 'admin-settings',
    path: '/admin/settings',
    title: 'System Settings - Admin',
    description: 'Configure platform settings and integrations.',
    category: PageCategory.ADMIN,
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    priority: 0.1,
    changeFrequency: ChangeFrequency.MONTHLY,
  },
];

/**
 * Legal/compliance pages
 */
export const LEGAL_ROUTES: SitePage[] = [
  {
    id: 'privacy',
    path: '/privacy',
    title: 'Privacy Policy - A Startup Biz',
    description: 'Our commitment to protecting your personal information.',
    category: PageCategory.LEGAL,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.4,
    changeFrequency: ChangeFrequency.YEARLY,
  },
  {
    id: 'terms',
    path: '/terms',
    title: 'Terms of Service - A Startup Biz',
    description: 'Terms and conditions for using our platform.',
    category: PageCategory.LEGAL,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.4,
    changeFrequency: ChangeFrequency.YEARLY,
  },
  {
    id: 'disclaimer',
    path: '/disclaimer',
    title: 'Disclaimer - A Startup Biz',
    description: 'Important information about our services and recommendations.',
    category: PageCategory.LEGAL,
    requiresAuth: false,
    allowedRoles: [UserRole.PUBLIC],
    priority: 0.3,
    changeFrequency: ChangeFrequency.YEARLY,
  },
];

/**
 * Aggregate all routes
 */
export function getAllRoutes(): SitePage[] {
  return [
    ...PUBLIC_ROUTES,
    ...getServiceRoutes(),
    ...PARTNER_ROUTES,
    ...ADMIN_ROUTES,
    ...LEGAL_ROUTES,
  ];
}

/**
 * Get routes by category
 */
export function getRoutesByCategory(category: PageCategory): SitePage[] {
  return getAllRoutes().filter((route) => route.category === category);
}

/**
 * Get route by path
 */
export function getRouteByPath(path: string): SitePage | undefined {
  return getAllRoutes().find((route) => route.path === path);
}

/**
 * Check if route is protected
 */
export function isProtectedRoute(path: string): boolean {
  const route = getRouteByPath(path);
  return route?.requiresAuth ?? false;
}

/**
 * Get allowed roles for route
 */
export function getAllowedRoles(path: string): UserRole[] {
  const route = getRouteByPath(path);
  return route?.allowedRoles ?? [];
}

/**
 * Validate user access to route
 */
export function canAccessRoute(path: string, userRole?: UserRole): boolean {
  const route = getRouteByPath(path);
  if (!route) return false;
  if (!route.requiresAuth) return true;
  if (!userRole) return false;
  return route.allowedRoles.includes(userRole);
}
