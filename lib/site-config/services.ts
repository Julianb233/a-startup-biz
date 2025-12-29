/**
 * Service Categories Configuration
 * Defines all business services offered through the platform
 */

import { ServiceCategory } from './types';

export interface ServiceDefinition {
  id: string;
  slug: string;
  category: ServiceCategory;
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: string; // Lucide icon name
  benefits: string[];
  commonProviders: number; // Count of vetted providers
  averageCommission: number; // Percentage
  featured: boolean;
  order: number; // Display order
  metadata: {
    keywords: string[];
    relatedServices: string[];
  };
}

/**
 * All service categories with full metadata
 */
export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  {
    id: 'ein-filing',
    slug: 'ein-filing',
    category: ServiceCategory.EIN_FILING,
    title: 'EIN Filing Services',
    shortDescription: 'Get your Federal Tax ID number quickly and correctly',
    longDescription:
      'Expert assistance with IRS Form SS-4 to obtain your Employer Identification Number (EIN). Essential for opening business bank accounts, hiring employees, and tax filing.',
    icon: 'FileText',
    benefits: [
      'Same-day processing available',
      'IRS-compliant filing',
      'Error-free applications',
      'Guidance on entity type selection',
    ],
    commonProviders: 8,
    averageCommission: 25,
    featured: true,
    order: 1,
    metadata: {
      keywords: ['EIN', 'tax ID', 'federal employer ID', 'IRS', 'business registration'],
      relatedServices: ['legal', 'accounting'],
    },
  },
  {
    id: 'legal',
    slug: 'legal-services',
    category: ServiceCategory.LEGAL,
    title: 'Business Legal Services',
    shortDescription: 'Entity formation, contracts, and legal compliance',
    longDescription:
      'Comprehensive legal services including LLC/Corporation formation, operating agreements, contracts, trademark registration, and ongoing compliance support.',
    icon: 'Scale',
    benefits: [
      'Entity formation (LLC, C-Corp, S-Corp)',
      'Contract review and drafting',
      'Trademark and IP protection',
      'Compliance and regulatory guidance',
    ],
    commonProviders: 12,
    averageCommission: 20,
    featured: true,
    order: 2,
    metadata: {
      keywords: ['business lawyer', 'LLC formation', 'contracts', 'compliance', 'trademark'],
      relatedServices: ['ein-filing', 'accounting'],
    },
  },
  {
    id: 'accounting',
    slug: 'accounting-services',
    category: ServiceCategory.ACCOUNTING,
    title: 'Accounting & CFO Services',
    shortDescription: 'Strategic financial management and tax planning',
    longDescription:
      'Professional accounting services including tax preparation, financial planning, CFO advisory, and strategic financial management for growing businesses.',
    icon: 'Calculator',
    benefits: [
      'Tax preparation and planning',
      'Financial statement preparation',
      'CFO advisory services',
      'Business valuation and modeling',
    ],
    commonProviders: 15,
    averageCommission: 15,
    featured: true,
    order: 3,
    metadata: {
      keywords: ['CPA', 'tax preparation', 'CFO', 'financial planning', 'accounting'],
      relatedServices: ['bookkeeping', 'legal'],
    },
  },
  {
    id: 'bookkeeping',
    slug: 'bookkeeping',
    category: ServiceCategory.BOOKKEEPING,
    title: 'Bookkeeping Services',
    shortDescription: 'Daily financial record-keeping and reconciliation',
    longDescription:
      'Professional bookkeeping services to maintain accurate financial records, reconcile accounts, manage accounts payable/receivable, and prepare monthly reports.',
    icon: 'BookOpen',
    benefits: [
      'Daily transaction recording',
      'Bank and credit card reconciliation',
      'A/P and A/R management',
      'Monthly financial reports',
    ],
    commonProviders: 20,
    averageCommission: 20,
    featured: false,
    order: 4,
    metadata: {
      keywords: ['bookkeeper', 'QuickBooks', 'financial records', 'reconciliation'],
      relatedServices: ['accounting', 'crm'],
    },
  },
  {
    id: 'ai-automation',
    slug: 'ai-solutions',
    category: ServiceCategory.AI_AUTOMATION,
    title: 'AI & Business Automation',
    shortDescription: 'Intelligent automation and AI-powered workflows',
    longDescription:
      'Leverage artificial intelligence and automation to streamline operations, reduce costs, and scale your business with custom AI solutions and workflow automation.',
    icon: 'Bot',
    benefits: [
      'Custom AI chatbots and assistants',
      'Workflow automation',
      'Data analysis and insights',
      'Process optimization',
    ],
    commonProviders: 6,
    averageCommission: 25,
    featured: true,
    order: 5,
    metadata: {
      keywords: ['AI', 'automation', 'chatbot', 'workflow', 'machine learning'],
      relatedServices: ['crm', 'website-design'],
    },
  },
  {
    id: 'crm',
    slug: 'crm-implementation',
    category: ServiceCategory.CRM,
    title: 'CRM & Sales Systems',
    shortDescription: 'Customer relationship management and sales automation',
    longDescription:
      'Implement and optimize CRM systems like HubSpot, Salesforce, or Pipedrive to manage customer relationships, automate sales processes, and drive revenue growth.',
    icon: 'Users',
    benefits: [
      'CRM platform selection and setup',
      'Sales pipeline automation',
      'Customer data management',
      'Integration with existing tools',
    ],
    commonProviders: 10,
    averageCommission: 22,
    featured: false,
    order: 6,
    metadata: {
      keywords: ['CRM', 'HubSpot', 'Salesforce', 'sales automation', 'customer management'],
      relatedServices: ['ai-automation', 'marketing'],
    },
  },
  {
    id: 'website-design',
    slug: 'website-design',
    category: ServiceCategory.WEBSITE_DESIGN,
    title: 'Website Design & Development',
    shortDescription: 'Professional websites that convert visitors to customers',
    longDescription:
      'Custom website design and development services including landing pages, e-commerce sites, and full web applications built with modern technologies.',
    icon: 'Globe',
    benefits: [
      'Custom responsive design',
      'SEO optimization',
      'E-commerce integration',
      'Fast, secure hosting',
    ],
    commonProviders: 18,
    averageCommission: 18,
    featured: true,
    order: 7,
    metadata: {
      keywords: ['web design', 'website development', 'landing page', 'e-commerce', 'SEO'],
      relatedServices: ['marketing', 'branding'],
    },
  },
  {
    id: 'marketing',
    slug: 'marketing',
    category: ServiceCategory.MARKETING,
    title: 'Digital Marketing Services',
    shortDescription: 'Drive traffic, leads, and revenue with proven strategies',
    longDescription:
      'Comprehensive digital marketing services including SEO, PPC advertising, social media marketing, email campaigns, and content marketing strategies.',
    icon: 'TrendingUp',
    benefits: [
      'SEO and content strategy',
      'PPC and paid advertising',
      'Social media management',
      'Email marketing campaigns',
    ],
    commonProviders: 14,
    averageCommission: 20,
    featured: true,
    order: 8,
    metadata: {
      keywords: ['digital marketing', 'SEO', 'PPC', 'social media', 'content marketing'],
      relatedServices: ['website-design', 'branding'],
    },
  },
  {
    id: 'branding',
    slug: 'branding',
    category: ServiceCategory.BRANDING,
    title: 'Brand Identity & Design',
    shortDescription: 'Create a memorable brand that resonates with customers',
    longDescription:
      'Professional brand identity services including logo design, brand guidelines, messaging strategy, and visual identity systems that differentiate your business.',
    icon: 'Palette',
    benefits: [
      'Logo and visual identity design',
      'Brand strategy and positioning',
      'Brand guidelines and standards',
      'Marketing collateral design',
    ],
    commonProviders: 11,
    averageCommission: 20,
    featured: false,
    order: 9,
    metadata: {
      keywords: ['branding', 'logo design', 'brand identity', 'visual design', 'brand strategy'],
      relatedServices: ['website-design', 'marketing'],
    },
  },
  {
    id: 'business-coaching',
    slug: 'business-coaching',
    category: ServiceCategory.BUSINESS_COACHING,
    title: 'Business Coaching & Consulting',
    shortDescription: 'Strategic guidance to accelerate growth and profitability',
    longDescription:
      'One-on-one business coaching and consulting services to help you overcome challenges, scale operations, and achieve your business goals with expert guidance.',
    icon: 'Lightbulb',
    benefits: [
      '1:1 strategic coaching sessions',
      'Growth planning and execution',
      'Leadership development',
      'Accountability and support',
    ],
    commonProviders: 9,
    averageCommission: 30,
    featured: true,
    order: 10,
    metadata: {
      keywords: ['business coach', 'consulting', 'strategy', 'growth', 'leadership'],
      relatedServices: ['accounting', 'marketing'],
    },
  },
];

/**
 * Get all service slugs for dynamic routing
 */
export function getAllServiceSlugs(): string[] {
  return SERVICE_DEFINITIONS.map((service) => service.slug);
}

/**
 * Get service by slug
 */
export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return SERVICE_DEFINITIONS.find((service) => service.slug === slug);
}

/**
 * Get featured services for homepage
 */
export function getFeaturedServices(): ServiceDefinition[] {
  return SERVICE_DEFINITIONS.filter((service) => service.featured).sort(
    (a, b) => a.order - b.order
  );
}

/**
 * Get all services sorted by order
 */
export function getAllServices(): ServiceDefinition[] {
  return [...SERVICE_DEFINITIONS].sort((a, b) => a.order - b.order);
}

/**
 * Get related services
 */
export function getRelatedServices(slug: string): ServiceDefinition[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];

  return SERVICE_DEFINITIONS.filter((s) =>
    service.metadata.relatedServices.includes(s.slug)
  );
}
