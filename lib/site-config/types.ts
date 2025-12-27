/**
 * Site Architecture Type Definitions
 * Following Clean Architecture principles with proper type safety
 */

/**
 * User role hierarchy for authorization
 */
export enum UserRole {
  PUBLIC = 'public',
  CLIENT = 'client',
  PARTNER = 'partner',
  ADMIN = 'admin',
}

/**
 * Service category types
 */
export enum ServiceCategory {
  LEGAL = 'legal',
  ACCOUNTING = 'accounting',
  BOOKKEEPING = 'bookkeeping',
  EIN_FILING = 'ein-filing',
  AI_AUTOMATION = 'ai-automation',
  CRM = 'crm',
  WEBSITE_DESIGN = 'website-design',
  MARKETING = 'marketing',
  BRANDING = 'branding',
  BUSINESS_COACHING = 'business-coaching',
}

/**
 * Navigation item interface with access control
 */
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon?: string;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  isExternal?: boolean;
  isHighlighted?: boolean;
  children?: NavigationItem[];
}

/**
 * Site page metadata for SEO and routing
 */
export interface SitePage {
  id: string;
  path: string;
  title: string;
  description: string;
  category: PageCategory;
  requiresAuth: boolean;
  allowedRoles: UserRole[];
  priority: number; // For sitemap.xml
  changeFrequency: ChangeFrequency;
  metadata?: {
    ogImage?: string;
    ogType?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
}

/**
 * Page category for organization
 */
export enum PageCategory {
  PUBLIC = 'public',
  SERVICE = 'service',
  PARTNER_PORTAL = 'partner-portal',
  ADMIN = 'admin',
  AUTH = 'auth',
  LEGAL = 'legal',
}

/**
 * SEO change frequency
 */
export enum ChangeFrequency {
  ALWAYS = 'always',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  NEVER = 'never',
}

/**
 * CTA button configuration
 */
export interface CallToAction {
  id: string;
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  requiresAuth?: boolean;
  trackingEvent?: string;
}

/**
 * Service provider interface
 */
export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  logo?: string;
  website?: string;
  isVetted: boolean;
  commissionRate: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  features: string[];
  pricing?: {
    model: 'fixed' | 'hourly' | 'custom';
    startingPrice?: number;
    currency: string;
  };
}

/**
 * Referral tracking
 */
export interface Referral {
  id: string;
  clientId: string;
  partnerId: string;
  providerId: string;
  serviceCategory: ServiceCategory;
  status: ReferralStatus;
  commissionAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

export enum ReferralStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Clarity call booking
 */
export interface ClarityCall {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  businessStage: string;
  challenges: string[];
  scheduledAt: Date;
  zoomLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  paid: boolean;
  amount: number;
}

/**
 * Application form data
 */
export interface ApplicationForm {
  id: string;
  businessName: string;
  industry: string;
  revenue: string;
  teamSize: string;
  challenges: string[];
  goals: string[];
  timeline: string;
  budget: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}
