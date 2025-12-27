/**
 * Navigation Configuration
 * Central source of truth for all site navigation
 */

import { NavigationItem, UserRole, CallToAction } from './types';
import { getAllServices, getFeaturedServices } from './services';

/**
 * Main navigation items (header)
 */
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'about',
    label: 'About',
    href: '/about',
    description: "Learn about Tory Zweigle's journey and mission",
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    description: 'Explore our vetted service providers',
    children: getFeaturedServices().map((service) => ({
      id: service.id,
      label: service.title,
      href: `/services/${service.slug}`,
      description: service.shortDescription,
      icon: service.icon,
    })),
  },
  {
    id: 'how-it-works',
    label: 'How It Works',
    href: '/how-it-works',
    description: 'Understand our proven process',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    description: 'Get in touch with our team',
  },
];

/**
 * Primary call-to-action buttons
 */
export const PRIMARY_CTAS: CallToAction[] = [
  {
    id: 'book-call',
    label: 'Book Your Call',
    href: '/book-call',
    variant: 'primary',
    size: 'lg',
    icon: 'Calendar',
    trackingEvent: 'cta_book_call',
  },
  {
    id: 'apply-now',
    label: 'Apply Now',
    href: '/apply',
    variant: 'secondary',
    size: 'md',
    icon: 'FileCheck',
    trackingEvent: 'cta_apply',
  },
];

/**
 * Footer navigation sections
 */
export const FOOTER_NAVIGATION = {
  company: {
    title: 'Company',
    items: [
      { id: 'about', label: 'About Us', href: '/about' },
      { id: 'how-it-works', label: 'How It Works', href: '/how-it-works' },
      { id: 'contact', label: 'Contact', href: '/contact' },
      { id: 'careers', label: 'Careers', href: '/careers' },
    ],
  },
  services: {
    title: 'Services',
    items: getAllServices()
      .slice(0, 6)
      .map((service) => ({
        id: service.id,
        label: service.title,
        href: `/services/${service.slug}`,
      })),
  },
  partners: {
    title: 'For Partners',
    items: [
      { id: 'partner-login', label: 'Partner Login', href: '/partner-portal' },
      { id: 'become-partner', label: 'Become a Partner', href: '/become-partner' },
      { id: 'partner-benefits', label: 'Partner Benefits', href: '/partner-benefits' },
    ],
  },
  legal: {
    title: 'Legal',
    items: [
      { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
      { id: 'terms', label: 'Terms of Service', href: '/terms' },
      { id: 'disclaimer', label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
};

/**
 * Partner Portal Navigation
 */
export const PARTNER_NAVIGATION: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/partner-portal/dashboard',
    icon: 'LayoutDashboard',
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
  },
  {
    id: 'providers',
    label: 'Vetted Providers',
    href: '/partner-portal/providers',
    icon: 'Users',
    description: 'Browse and recommend providers',
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
  },
  {
    id: 'referrals',
    label: 'My Referrals',
    href: '/partner-portal/referrals',
    icon: 'Link',
    description: 'Track your referral status',
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
  },
  {
    id: 'earnings',
    label: 'Earnings',
    href: '/partner-portal/earnings',
    icon: 'DollarSign',
    description: 'View commission and payouts',
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/partner-portal/resources',
    icon: 'BookOpen',
    description: 'Marketing materials and guides',
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
  },
  {
    id: 'profile',
    label: 'Profile Settings',
    href: '/partner-portal/profile',
    icon: 'Settings',
    requiresAuth: true,
    allowedRoles: [UserRole.PARTNER, UserRole.ADMIN],
  },
];

/**
 * Admin Dashboard Navigation
 */
export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'LayoutDashboard',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'clients',
    label: 'Clients',
    href: '/admin/clients',
    icon: 'Users',
    description: 'Manage client accounts',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'providers',
    label: 'Providers',
    href: '/admin/providers',
    icon: 'Building',
    description: 'Manage service providers',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'referrals',
    label: 'All Referrals',
    href: '/admin/referrals',
    icon: 'Link',
    description: 'Track all referrals',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'bookings',
    label: 'Clarity Calls',
    href: '/admin/bookings',
    icon: 'Calendar',
    description: 'Manage scheduled calls',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'applications',
    label: 'Applications',
    href: '/admin/applications',
    icon: 'FileCheck',
    description: 'Review client applications',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'BarChart',
    description: 'Business metrics and insights',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'content',
    label: 'Content',
    href: '/admin/content',
    icon: 'FileText',
    description: 'Manage site content',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: 'Settings',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
];

/**
 * Mobile navigation (condensed)
 */
export const MOBILE_NAVIGATION: NavigationItem[] = [
  ...MAIN_NAVIGATION,
  {
    id: 'partner-portal',
    label: 'Partner Portal',
    href: '/partner-portal',
    icon: 'LogIn',
    requiresAuth: false,
  },
];

/**
 * Breadcrumb generation helper
 */
export function generateBreadcrumbs(pathname: string): NavigationItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: NavigationItem[] = [
    { id: 'home', label: 'Home', href: '/' },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      id: segment,
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Check if user has access to navigation item
 */
export function hasAccess(item: NavigationItem, userRole?: UserRole): boolean {
  if (!item.requiresAuth) return true;
  if (!userRole) return false;
  if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
  return item.allowedRoles.includes(userRole);
}

/**
 * Filter navigation items by user role
 */
export function filterNavigationByRole(
  items: NavigationItem[],
  userRole?: UserRole
): NavigationItem[] {
  return items.filter((item) => hasAccess(item, userRole));
}
