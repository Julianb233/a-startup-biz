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
  heroImage?: string; // Unsplash image URL for service hero
}

export const services: Service[] = [
  {
    id: 'ein-filing',
    slug: 'ein-filing',
    title: 'EIN Filing Service',
    shortTitle: 'EIN Filing',
    description: "Don't navigate IRS paperwork alone. I've filed EINs for over 100 of my own businesses and know exactly what it takes to get your federal tax ID fast—without the headaches or costly mistakes.",
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
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80'
  },
  {
    id: 'legal-services',
    slug: 'legal-services',
    title: 'Business Legal Services',
    shortTitle: 'Legal Services',
    description: "I've structured over 100 businesses—LLCs, corporations, partnerships—and I'll guide you through the legal maze so you're protected from day one. No confusing jargon, just clear direction.",
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
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80'
  },
  {
    id: 'accounting-services',
    slug: 'accounting-services',
    title: 'Professional Accounting Services',
    shortTitle: 'Accounting',
    description: "Your numbers tell a story—let me help you read it. With decades of managing finances across 100+ ventures, I'll show you exactly where your money's going and how to keep more of it.",
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
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80'
  },
  {
    id: 'bookkeeping',
    slug: 'bookkeeping',
    title: 'Bookkeeping & Payroll Services',
    shortTitle: 'Bookkeeping',
    description: "Messy books killed more businesses than I can count. I've built systems that keep every dollar tracked across my ventures—now let me set you up for financial clarity and peace of mind.",
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
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80'
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions',
    title: 'AI & Automation Solutions',
    shortTitle: 'AI Solutions',
    description: "I've automated operations across dozens of my own companies. Let me show you how AI can eliminate busywork, reduce errors, and free you to focus on what actually grows your business.",
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
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80'
  },
  {
    id: 'crm-implementation',
    slug: 'crm-implementation',
    title: 'CRM Implementation & Management',
    shortTitle: 'CRM',
    description: "Every customer counts. I've implemented CRMs for businesses from solo operations to large teams—I'll design a system that actually gets used and turns leads into loyal customers.",
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
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80'
  },
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Website Design & Development',
    shortTitle: 'Web Development',
    description: "Your website is your 24/7 salesperson. I've built sites for my own businesses that actually convert—not just look pretty. Let me create something that works as hard as you do.",
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
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80'
  },
  {
    id: 'marketing-strategy',
    slug: 'marketing-strategy',
    title: 'Marketing Strategy & Execution',
    shortTitle: 'Marketing',
    description: "I've marketed everything from local services to nationwide brands. Forget guesswork—I'll show you exactly what's working right now and help you reach customers who are ready to buy.",
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
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80'
  },
  {
    id: 'business-strategy',
    slug: 'business-strategy',
    title: 'Business Strategy Consulting',
    shortTitle: 'Strategy',
    description: "46+ years of starting, growing, and scaling businesses—that's what you get access to. I'll help you see the gaps, seize the opportunities, and build a roadmap that actually works.",
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
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80'
  },
  {
    id: 'hr-solutions',
    slug: 'hr-solutions',
    title: 'HR Solutions & Employee Management',
    shortTitle: 'HR Solutions',
    description: "Hiring the right people is everything. I've built teams from scratch across 100+ businesses—let me help you find, onboard, and retain the talent that will grow with you.",
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
    category: 'operations',
    heroImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80'
  },
  {
    id: 'it-services',
    slug: 'it-services',
    title: 'IT Services & Support',
    shortTitle: 'IT Services',
    description: "Technology should work for you, not against you. I've set up IT infrastructure for businesses of all sizes—let me make sure your systems are secure, reliable, and ready to scale.",
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
    category: 'technology',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80'
  },
  {
    id: 'social-media',
    slug: 'social-media',
    title: 'Social Media Management',
    shortTitle: 'Social Media',
    description: "Social media built my brands before it was mainstream. I'll show you what actually works today—not vanity metrics, but real engagement that drives real business results.",
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
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80'
  },
  {
    id: 'seo-services',
    slug: 'seo-services',
    title: 'SEO & Search Marketing',
    shortTitle: 'SEO',
    description: "Getting found online is no accident. I've ranked my own businesses on page one—now let me help you get discovered by customers who are actively searching for what you offer.",
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
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80'
  },
  {
    id: 'virtual-assistants',
    slug: 'virtual-assistants',
    title: 'Virtual Assistant Services',
    shortTitle: 'Virtual Assistants',
    description: "Time is your most valuable asset. I run most of my businesses as an absentee owner using VAs—let me connect you with trained support so you can focus on what moves the needle.",
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
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80'
  },
  {
    id: 'business-coaching',
    slug: 'business-coaching',
    title: 'Business Coaching & Mentorship',
    shortTitle: 'Coaching',
    description: "Having a mentor who's been there changes everything. I've made every mistake, learned every lesson—now I'm in your corner, helping you avoid the pitfalls and accelerate your success.",
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
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=1200&q=80'
  },
  {
    id: 'content-creation',
    slug: 'content-creation',
    title: 'Content Creation & Copywriting',
    shortTitle: 'Content Creation',
    description: "Words that sell—that's what we create. I've written copy that's moved millions in products. Let me help you communicate your value in a way that resonates and converts.",
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
    category: 'marketing',
    heroImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80'
  },
  {
    id: 'business-analytics',
    slug: 'business-analytics',
    title: 'Business Analytics & Reporting',
    shortTitle: 'Analytics',
    description: "You can't improve what you don't measure. I've built data-driven decision systems across my ventures—let me help you see exactly what's working and where the opportunities are hiding.",
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
    category: 'growth',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'
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
