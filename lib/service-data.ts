/**
 * Service Data Layer
 * Comprehensive service catalog for A Startup Biz
 */

export interface ServicePricing {
  basePrice: number;
  currency: string;
  billingPeriod?: 'one-time' | 'monthly' | 'quarterly' | 'annually' | 'hourly';
  priceRange?: {
    min: number;
    max: number;
  };
  customQuote?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string; // Lucide icon name
  features: string[];
  pricing: ServicePricing;
  category: 'formation' | 'financial' | 'technology' | 'marketing' | 'operations' | 'growth';
  popular?: boolean;
  featured?: boolean;
}

export const services: Service[] = [
  {
    id: 'ein-filing',
    slug: 'ein-filing',
    title: 'EIN Filing Service',
    shortTitle: 'EIN Filing',
    description: 'Fast and reliable Employer Identification Number (EIN) filing with the IRS. Get your federal tax ID in days, not weeks.',
    icon: 'FileText',
    features: [
      'Same-day application submission',
      'IRS confirmation letter delivery',
      'Expert guidance on EIN requirements',
      'Support for all business structures',
      'Dedicated filing specialist',
      '100% satisfaction guarantee'
    ],
    pricing: {
      basePrice: 160,
      currency: 'USD',
      billingPeriod: 'one-time'
    },
    category: 'formation',
    popular: true,
    featured: true
  },
  {
    id: 'legal-services',
    slug: 'legal-services',
    title: 'Business Legal Services',
    shortTitle: 'Legal Services',
    description: 'Comprehensive legal support for startups and small businesses, from entity formation to contract review and compliance.',
    icon: 'Scale',
    features: [
      'Entity formation (LLC, Corporation, Partnership)',
      'Operating agreements and bylaws',
      'Contract drafting and review',
      'Trademark and IP protection',
      'Terms of service and privacy policies',
      'Ongoing legal compliance support'
    ],
    pricing: {
      basePrice: 500,
      currency: 'USD',
      billingPeriod: 'one-time',
      priceRange: {
        min: 500,
        max: 5000
      },
      customQuote: true
    },
    category: 'formation',
    featured: true
  },
  {
    id: 'accounting-services',
    slug: 'accounting-services',
    title: 'Professional Accounting Services',
    shortTitle: 'Accounting',
    description: 'Full-service accounting solutions including tax preparation, financial statements, and strategic financial planning.',
    icon: 'Calculator',
    features: [
      'Monthly financial statements',
      'Tax preparation and filing',
      'Quarterly tax planning',
      'Financial forecasting',
      'Audit preparation',
      'CFO advisory services'
    ],
    pricing: {
      basePrice: 500,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 500,
        max: 2500
      },
      customQuote: true
    },
    category: 'financial',
    popular: true
  },
  {
    id: 'bookkeeping',
    slug: 'bookkeeping',
    title: 'Bookkeeping & Payroll Services',
    shortTitle: 'Bookkeeping',
    description: 'Accurate bookkeeping and payroll management to keep your finances organized and compliant.',
    icon: 'BookOpen',
    features: [
      'Daily transaction recording',
      'Bank reconciliation',
      'Accounts payable/receivable',
      'Payroll processing',
      'Expense tracking',
      'QuickBooks/Xero setup and management'
    ],
    pricing: {
      basePrice: 300,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 300,
        max: 1500
      }
    },
    category: 'financial',
    popular: true
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions',
    title: 'AI & Automation Solutions',
    shortTitle: 'AI Solutions',
    description: 'Custom AI integrations and automation workflows to streamline operations and boost productivity.',
    icon: 'Bot',
    features: [
      'AI chatbot implementation',
      'Workflow automation',
      'Process optimization',
      'Custom AI tool development',
      'Integration with existing systems',
      'Training and support'
    ],
    pricing: {
      basePrice: 2500,
      currency: 'USD',
      billingPeriod: 'one-time',
      priceRange: {
        min: 2500,
        max: 15000
      },
      customQuote: true
    },
    category: 'technology',
    featured: true
  },
  {
    id: 'crm-implementation',
    slug: 'crm-implementation',
    title: 'CRM Implementation & Management',
    shortTitle: 'CRM',
    description: 'Complete CRM setup, customization, and training to help you manage customer relationships effectively.',
    icon: 'Users',
    features: [
      'CRM platform selection',
      'Custom setup and configuration',
      'Data migration',
      'Sales pipeline design',
      'Team training',
      'Ongoing optimization'
    ],
    pricing: {
      basePrice: 1500,
      currency: 'USD',
      billingPeriod: 'one-time',
      priceRange: {
        min: 1500,
        max: 8000
      },
      customQuote: true
    },
    category: 'technology',
    popular: true
  },
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Website Design & Development',
    shortTitle: 'Web Development',
    description: 'Custom website design and development that converts visitors into customers, built with modern technology.',
    icon: 'Globe',
    features: [
      'Responsive design',
      'SEO-optimized structure',
      'Fast loading speeds',
      'Mobile-first approach',
      'Content management system',
      'Ongoing maintenance and updates'
    ],
    pricing: {
      basePrice: 3000,
      currency: 'USD',
      billingPeriod: 'one-time',
      priceRange: {
        min: 3000,
        max: 20000
      },
      customQuote: true
    },
    category: 'technology',
    featured: true
  },
  {
    id: 'marketing-strategy',
    slug: 'marketing-strategy',
    title: 'Marketing Strategy & Execution',
    shortTitle: 'Marketing',
    description: 'Data-driven marketing strategies and campaigns to attract, engage, and convert your ideal customers.',
    icon: 'TrendingUp',
    features: [
      'Market research and analysis',
      'Competitive analysis',
      'Brand positioning',
      'Multi-channel campaign planning',
      'Content strategy',
      'Performance tracking and optimization'
    ],
    pricing: {
      basePrice: 1500,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 1500,
        max: 10000
      },
      customQuote: true
    },
    category: 'marketing',
    popular: true
  },
  {
    id: 'business-strategy',
    slug: 'business-strategy',
    title: 'Business Strategy Consulting',
    shortTitle: 'Strategy',
    description: 'Strategic planning and execution support to help you achieve your business goals and scale effectively.',
    icon: 'Target',
    features: [
      'Business plan development',
      'Market opportunity analysis',
      'Growth strategy planning',
      'Competitive positioning',
      'Financial modeling',
      'Execution roadmap'
    ],
    pricing: {
      basePrice: 2000,
      currency: 'USD',
      billingPeriod: 'one-time',
      priceRange: {
        min: 2000,
        max: 15000
      },
      customQuote: true
    },
    category: 'growth',
    featured: true
  },
  {
    id: 'hr-solutions',
    slug: 'hr-solutions',
    title: 'HR Solutions & Employee Management',
    shortTitle: 'HR Solutions',
    description: 'Complete human resources support including hiring, onboarding, compliance, and employee management.',
    icon: 'Briefcase',
    features: [
      'Employee handbook creation',
      'Hiring and onboarding processes',
      'Compliance management',
      'Performance review systems',
      'Benefits administration',
      'HR policy development'
    ],
    pricing: {
      basePrice: 800,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 800,
        max: 3500
      },
      customQuote: true
    },
    category: 'operations'
  },
  {
    id: 'it-services',
    slug: 'it-services',
    title: 'IT Services & Support',
    shortTitle: 'IT Services',
    description: 'Comprehensive IT infrastructure setup, management, and support to keep your business running smoothly.',
    icon: 'Server',
    features: [
      'Network setup and security',
      'Cloud migration',
      'Data backup and recovery',
      'Cybersecurity solutions',
      'Help desk support',
      'Software license management'
    ],
    pricing: {
      basePrice: 1000,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 1000,
        max: 5000
      },
      customQuote: true
    },
    category: 'technology'
  },
  {
    id: 'social-media',
    slug: 'social-media',
    title: 'Social Media Management',
    shortTitle: 'Social Media',
    description: 'Full-service social media management to build your brand, engage your audience, and drive results.',
    icon: 'Share2',
    features: [
      'Content creation and scheduling',
      'Community management',
      'Paid advertising campaigns',
      'Analytics and reporting',
      'Brand voice development',
      'Influencer collaboration'
    ],
    pricing: {
      basePrice: 1200,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 1200,
        max: 5000
      }
    },
    category: 'marketing',
    popular: true
  },
  {
    id: 'seo-services',
    slug: 'seo-services',
    title: 'SEO & Search Marketing',
    shortTitle: 'SEO',
    description: 'Proven SEO strategies to improve your search rankings, drive organic traffic, and increase conversions.',
    icon: 'Search',
    features: [
      'Keyword research and strategy',
      'On-page optimization',
      'Technical SEO audits',
      'Link building',
      'Local SEO',
      'Monthly performance reports'
    ],
    pricing: {
      basePrice: 1000,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 1000,
        max: 5000
      }
    },
    category: 'marketing',
    popular: true
  },
  {
    id: 'virtual-assistants',
    slug: 'virtual-assistants',
    title: 'Virtual Assistant Services',
    shortTitle: 'Virtual Assistants',
    description: 'Skilled virtual assistants to handle administrative tasks, customer service, and day-to-day operations.',
    icon: 'UserCheck',
    features: [
      'Email and calendar management',
      'Customer support',
      'Data entry and organization',
      'Research and reporting',
      'Travel arrangements',
      'General administrative support'
    ],
    pricing: {
      basePrice: 25,
      currency: 'USD',
      billingPeriod: 'hourly',
      priceRange: {
        min: 25,
        max: 75
      }
    },
    category: 'operations',
    popular: true
  },
  {
    id: 'business-coaching',
    slug: 'business-coaching',
    title: 'Business Coaching & Mentorship',
    shortTitle: 'Coaching',
    description: 'One-on-one coaching and mentorship to help you overcome challenges, make better decisions, and grow your business.',
    icon: 'MessageCircle',
    features: [
      'Weekly coaching sessions',
      'Goal setting and accountability',
      'Problem-solving support',
      'Leadership development',
      'Business growth planning',
      'Unlimited email support'
    ],
    pricing: {
      basePrice: 500,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 500,
        max: 2500
      }
    },
    category: 'growth',
    featured: true
  },
  {
    id: 'content-creation',
    slug: 'content-creation',
    title: 'Content Creation & Copywriting',
    shortTitle: 'Content Creation',
    description: 'Professional content creation and copywriting services to tell your story and engage your audience.',
    icon: 'PenTool',
    features: [
      'Blog posts and articles',
      'Website copy',
      'Email campaigns',
      'Sales materials',
      'Case studies and whitepapers',
      'Content strategy'
    ],
    pricing: {
      basePrice: 800,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 800,
        max: 3500
      }
    },
    category: 'marketing'
  },
  {
    id: 'business-analytics',
    slug: 'business-analytics',
    title: 'Business Analytics & Reporting',
    shortTitle: 'Analytics',
    description: 'Data analytics and business intelligence solutions to make informed decisions and track performance.',
    icon: 'BarChart3',
    features: [
      'Custom dashboard creation',
      'KPI tracking and reporting',
      'Data visualization',
      'Predictive analytics',
      'Performance benchmarking',
      'Strategic insights'
    ],
    pricing: {
      basePrice: 1500,
      currency: 'USD',
      billingPeriod: 'monthly',
      priceRange: {
        min: 1500,
        max: 6000
      },
      customQuote: true
    },
    category: 'growth'
  }
];

/**
 * Get service by slug
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(service => service.slug === slug);
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: Service['category']): Service[] {
  return services.filter(service => service.category === category);
}

/**
 * Get popular services
 */
export function getPopularServices(): Service[] {
  return services.filter(service => service.popular);
}

/**
 * Get featured services
 */
export function getFeaturedServices(): Service[] {
  return services.filter(service => service.featured);
}

/**
 * Service categories metadata
 */
export const serviceCategories = [
  {
    id: 'formation',
    name: 'Formation & Legal',
    description: 'Get your business started right with proper legal structure',
    icon: 'Building2'
  },
  {
    id: 'financial',
    name: 'Financial Services',
    description: 'Keep your finances organized and compliant',
    icon: 'DollarSign'
  },
  {
    id: 'technology',
    name: 'Technology Solutions',
    description: 'Modern tech to streamline and scale your business',
    icon: 'Laptop'
  },
  {
    id: 'marketing',
    name: 'Marketing & Growth',
    description: 'Attract and convert customers effectively',
    icon: 'Megaphone'
  },
  {
    id: 'operations',
    name: 'Operations Support',
    description: 'Day-to-day support to run your business smoothly',
    icon: 'Cog'
  },
  {
    id: 'growth',
    name: 'Strategy & Growth',
    description: 'Strategic guidance to scale your business',
    icon: 'Rocket'
  }
] as const;
