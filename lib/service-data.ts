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

export interface TimelineStep {
  step: string;        // "Step 1", "Day 1-2"
  title: string;       // "Discovery Call"
  description: string; // "We discuss your needs"
  icon: string;        // Lucide icon name
}

export interface ServiceCard {
  title: string;
  tagline: string;
  description: string;
  icon: string;
  highlights: string[];
}

export interface BusinessImpact {
  headline: string;
  subheadline: string;
  painPoints: string[];
  outcomes: Array<{ metric: string; label: string; description: string }>;
  testimonialQuote?: string;
  testimonialAuthor?: string;
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
  timeline?: TimelineStep[];
  serviceCards?: ServiceCard[];
  businessImpact?: BusinessImpact;
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
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Quick Consultation', description: '15-minute call to understand your business structure', icon: 'MessageCircle' },
      { step: 'Step 2', title: 'Document Collection', description: 'We gather the necessary information from you', icon: 'FileText' },
      { step: 'Step 3', title: 'IRS Submission', description: 'Same-day application to the IRS', icon: 'Send' },
      { step: 'Step 4', title: 'EIN Delivered', description: 'Receive your EIN confirmation within 24-48 hours', icon: 'CheckCircle' }
    ],
    serviceCards: [
      { title: 'Expert Filing', tagline: 'Done Right the First Time', description: 'With over 100 EINs filed, I know exactly what the IRS needs and how to avoid common mistakes that delay your application.', icon: 'Award', highlights: ['Same-day submission', 'Error-free applications', 'All business types'] },
      { title: 'Fast Turnaround', tagline: 'Speed Matters', description: 'While DIY can take weeks with back-and-forth corrections, our process gets you your EIN in 24-48 hours.', icon: 'Zap', highlights: ['24-48 hour delivery', 'Priority handling', 'Rush available'] },
      { title: 'Full Support', tagline: 'We Handle Everything', description: 'From form preparation to IRS communication, you focus on your business while we handle the paperwork.', icon: 'Headphones', highlights: ['Complete service', 'IRS liaison', 'Documentation provided'] }
    ],
    businessImpact: {
      headline: 'Your EIN is the Foundation of Your Business',
      subheadline: 'Without it, you cannot open a bank account, hire employees, or build proper business credit.',
      painPoints: ['Delayed bank accounts mean delayed revenue', 'IRS rejection letters cost you time and credibility', 'Wrong business structure leads to tax problems'],
      outcomes: [{ metric: '24-48', label: 'Hours', description: 'Average delivery time' }, { metric: '100%', label: 'Success Rate', description: 'First-time approvals' }, { metric: '$0', label: 'Hidden Fees', description: 'Transparent pricing' }],
      testimonialQuote: 'Got my EIN faster than I could set up my website. Tory made it seamless.',
      testimonialAuthor: 'Sarah M., E-commerce Startup'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Legal Assessment', description: 'We review your business needs and legal requirements', icon: 'ClipboardCheck' },
      { step: 'Step 2', title: 'Entity Selection', description: 'Choose the right structure for your situation', icon: 'Building2' },
      { step: 'Step 3', title: 'Document Drafting', description: 'We prepare all necessary legal documents', icon: 'FileEdit' },
      { step: 'Step 4', title: 'State Filing', description: 'Submit formation documents to your state', icon: 'Send' },
      { step: 'Step 5', title: 'Compliance Setup', description: 'Establish ongoing compliance systems', icon: 'Shield' }
    ],
    serviceCards: [
      { title: 'Entity Formation', tagline: 'Built to Protect You', description: 'LLC, Corporation, or Partnership—I help you choose the right structure based on your goals, not generic advice.', icon: 'Building2', highlights: ['LLC formation', 'Corporation setup', 'Partnership agreements'] },
      { title: 'Contract Protection', tagline: 'Bulletproof Agreements', description: 'Every contract you sign should protect your interests. I draft and review agreements that keep you safe.', icon: 'FileCheck', highlights: ['Contract drafting', 'Agreement review', 'Negotiation support'] },
      { title: 'Ongoing Compliance', tagline: 'Stay Legal, Stay Open', description: 'Annual filings, registered agent services, and compliance monitoring so you never miss a deadline.', icon: 'Calendar', highlights: ['Annual reports', 'Registered agent', 'Compliance alerts'] }
    ],
    businessImpact: {
      headline: 'Legal Mistakes Can Cost You Everything',
      subheadline: 'The wrong business structure or a bad contract can expose you to personal liability and lawsuits.',
      painPoints: ['Personal assets at risk without proper structure', 'Bad contracts lead to costly disputes', 'Missed filings result in penalties and dissolution'],
      outcomes: [{ metric: '100+', label: 'Businesses', description: 'Successfully structured' }, { metric: '0', label: 'Lawsuits', description: 'From properly protected clients' }, { metric: '100%', label: 'Compliance', description: 'Filing success rate' }],
      testimonialQuote: 'Tory helped me restructure my business and saved me from a potential lawsuit. Worth every penny.',
      testimonialAuthor: 'Michael R., Real Estate Investor'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Financial Review', description: 'We analyze your current financial situation', icon: 'Search' },
      { step: 'Step 2', title: 'System Setup', description: 'Configure accounting software and processes', icon: 'Settings' },
      { step: 'Step 3', title: 'Monthly Processing', description: 'Regular financial statement preparation', icon: 'Calendar' },
      { step: 'Step 4', title: 'Tax Planning', description: 'Quarterly reviews and tax strategy optimization', icon: 'Calculator' },
      { step: 'Step 5', title: 'Strategic Insights', description: 'CFO-level advice on financial decisions', icon: 'TrendingUp' }
    ],
    serviceCards: [
      { title: 'Financial Clarity', tagline: 'Know Your Numbers', description: 'Monthly financial statements that actually make sense, with plain-English explanations of what they mean for your business.', icon: 'BarChart3', highlights: ['Monthly P&L statements', 'Balance sheets', 'Cash flow analysis'] },
      { title: 'Tax Optimization', tagline: 'Keep More Money', description: 'Proactive tax planning throughout the year, not just at filing time. We find deductions you did not know existed.', icon: 'PiggyBank', highlights: ['Quarterly tax planning', 'Deduction strategies', 'Entity optimization'] },
      { title: 'CFO Advisory', tagline: 'Strategic Guidance', description: 'Get the financial insights of a full-time CFO at a fraction of the cost. Make decisions based on data, not gut feelings.', icon: 'Lightbulb', highlights: ['Financial forecasting', 'Budget planning', 'Growth strategies'] }
    ],
    businessImpact: {
      headline: 'Stop Flying Blind With Your Finances',
      subheadline: 'Most business owners have no idea if they are actually profitable until tax time—and by then it is too late.',
      painPoints: ['Surprise tax bills drain your cash reserves', 'Unable to make informed business decisions', 'Missed deductions cost you thousands yearly'],
      outcomes: [{ metric: '30%', label: 'Average', description: 'Tax savings found' }, { metric: '48hr', label: 'Turnaround', description: 'On monthly reports' }, { metric: '$50K+', label: 'Deductions', description: 'Found for clients yearly' }],
      testimonialQuote: 'Finally understand where my money is going. Tory found $12K in deductions I was missing.',
      testimonialAuthor: 'Jennifer L., Restaurant Owner'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Books Assessment', description: 'We review your current bookkeeping situation', icon: 'ClipboardList' },
      { step: 'Step 2', title: 'System Migration', description: 'Set up or migrate to QuickBooks/Xero', icon: 'RefreshCw' },
      { step: 'Step 3', title: 'Cleanup & Catchup', description: 'Get your books current and accurate', icon: 'Sparkles' },
      { step: 'Step 4', title: 'Ongoing Management', description: 'Daily transaction recording and reconciliation', icon: 'Calendar' }
    ],
    serviceCards: [
      { title: 'Daily Tracking', tagline: 'Never Fall Behind', description: 'Every transaction recorded, every receipt categorized, every day. No more year-end scrambles.', icon: 'ListChecks', highlights: ['Daily transaction entry', 'Receipt management', 'Expense categorization'] },
      { title: 'Bank Reconciliation', tagline: 'Books That Balance', description: 'Monthly reconciliation ensures your books match your bank statements—catch errors before they become problems.', icon: 'CheckCircle2', highlights: ['Monthly reconciliation', 'Error detection', 'Fraud prevention'] },
      { title: 'Payroll Processing', tagline: 'Pay Your Team Right', description: 'Accurate, on-time payroll with proper tax withholding and compliance. Your employees deserve it.', icon: 'Users', highlights: ['Payroll processing', 'Tax withholding', 'Direct deposit'] }
    ],
    businessImpact: {
      headline: 'Messy Books Kill Businesses',
      subheadline: 'When you do not know your real numbers, you make bad decisions. Clean books are the foundation of smart business.',
      painPoints: ['Cannot get a loan with messy financial records', 'Tax time becomes a nightmare of missing receipts', 'No idea if you are actually making money'],
      outcomes: [{ metric: '10+', label: 'Hours', description: 'Saved monthly' }, { metric: '100%', label: 'Accuracy', description: 'On all entries' }, { metric: 'Real-time', label: 'Access', description: 'To your financials' }],
      testimonialQuote: 'My books were a disaster. Tory cleaned them up and now I actually know my numbers.',
      testimonialAuthor: 'David K., Contractor'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Process Audit', description: 'We identify automation opportunities in your workflow', icon: 'Search' },
      { step: 'Step 2', title: 'Solution Design', description: 'Custom AI strategy tailored to your needs', icon: 'Lightbulb' },
      { step: 'Step 3', title: 'Development', description: 'Build and test your AI automation tools', icon: 'Code' },
      { step: 'Step 4', title: 'Integration', description: 'Connect with your existing systems', icon: 'Link' },
      { step: 'Step 5', title: 'Training & Support', description: 'Ensure your team can use the new tools effectively', icon: 'GraduationCap' }
    ],
    serviceCards: [
      { title: 'AI Chatbots', tagline: '24/7 Customer Service', description: 'Intelligent chatbots that handle customer inquiries, book appointments, and qualify leads while you sleep.', icon: 'MessageSquare', highlights: ['Lead qualification', 'Appointment booking', 'FAQ automation'] },
      { title: 'Workflow Automation', tagline: 'Eliminate Busywork', description: 'Automate repetitive tasks like data entry, email responses, and report generation. Let AI do the grunt work.', icon: 'Workflow', highlights: ['Email automation', 'Data entry bots', 'Report generation'] },
      { title: 'Custom AI Tools', tagline: 'Built for Your Business', description: 'Need something specific? We build custom AI solutions that solve your unique business challenges.', icon: 'Wand2', highlights: ['Custom development', 'API integrations', 'Predictive analytics'] }
    ],
    businessImpact: {
      headline: 'Your Competitors Are Already Using AI',
      subheadline: 'Businesses using AI automation are saving 10-20 hours per week. Can you afford to fall behind?',
      painPoints: ['Spending hours on tasks that could be automated', 'Missing leads because you cannot respond fast enough', 'Competitors delivering faster service with AI'],
      outcomes: [{ metric: '20+', label: 'Hours', description: 'Saved weekly' }, { metric: '3x', label: 'Faster', description: 'Customer response time' }, { metric: '50%', label: 'Reduction', description: 'In manual errors' }],
      testimonialQuote: 'The AI chatbot Tory built handles 70% of our customer inquiries automatically. Game changer.',
      testimonialAuthor: 'Alex P., SaaS Founder'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Needs Assessment', description: 'We analyze your sales process and requirements', icon: 'ClipboardCheck' },
      { step: 'Step 2', title: 'Platform Selection', description: 'Choose the right CRM for your business size', icon: 'Layers' },
      { step: 'Step 3', title: 'Custom Configuration', description: 'Set up pipelines, automations, and integrations', icon: 'Settings' },
      { step: 'Step 4', title: 'Data Migration', description: 'Move your existing customer data safely', icon: 'Database' },
      { step: 'Step 5', title: 'Team Training', description: 'Ensure everyone knows how to use the system', icon: 'Users' }
    ],
    serviceCards: [
      { title: 'Pipeline Design', tagline: 'Sales That Close', description: 'Custom sales pipelines that match how you actually sell. Track every lead from first contact to closed deal.', icon: 'GitBranch', highlights: ['Custom pipelines', 'Lead tracking', 'Deal forecasting'] },
      { title: 'Automation Setup', tagline: 'Follow-Up on Autopilot', description: 'Automatic follow-up emails, task reminders, and lead scoring so no opportunity slips through the cracks.', icon: 'Zap', highlights: ['Email sequences', 'Task automation', 'Lead scoring'] },
      { title: 'Integrations', tagline: 'Everything Connected', description: 'Connect your CRM to email, calendar, phone, and other tools you already use. One source of truth for customer data.', icon: 'Link', highlights: ['Email sync', 'Calendar integration', 'Phone logging'] }
    ],
    businessImpact: {
      headline: 'You Are Losing Leads Right Now',
      subheadline: 'Without a proper CRM, you are forgetting follow-ups, losing track of deals, and leaving money on the table.',
      painPoints: ['Leads fall through the cracks without proper tracking', 'No visibility into your sales pipeline', 'Wasting time on manual data entry'],
      outcomes: [{ metric: '35%', label: 'Increase', description: 'In close rate' }, { metric: '2x', label: 'Faster', description: 'Lead response time' }, { metric: '100%', label: 'Visibility', description: 'Into your pipeline' }],
      testimonialQuote: 'Our sales team finally has a system that works. Close rate up 40% in 3 months.',
      testimonialAuthor: 'Tom H., Insurance Agency Owner'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Discovery Call', description: 'We understand your brand, goals, and target audience', icon: 'MessageCircle' },
      { step: 'Step 2', title: 'Design Phase', description: 'Create wireframes and visual designs for approval', icon: 'Palette' },
      { step: 'Step 3', title: 'Development', description: 'Build your site with modern, fast technology', icon: 'Code' },
      { step: 'Step 4', title: 'Content & SEO', description: 'Optimize content for search engines', icon: 'Search' },
      { step: 'Step 5', title: 'Launch & Training', description: 'Go live and learn to manage your site', icon: 'Rocket' }
    ],
    serviceCards: [
      { title: 'Conversion Design', tagline: 'Sites That Sell', description: 'Beautiful is not enough. We build websites optimized to convert visitors into customers, leads, or subscribers.', icon: 'Target', highlights: ['Conversion optimization', 'Clear CTAs', 'Trust elements'] },
      { title: 'Mobile-First', tagline: 'Perfect on Every Device', description: 'Over 60% of web traffic is mobile. Your site will look and work perfectly on phones, tablets, and desktops.', icon: 'Smartphone', highlights: ['Responsive design', 'Fast loading', 'Touch optimized'] },
      { title: 'Easy Management', tagline: 'You Control It', description: 'Modern CMS that lets you update content, add pages, and manage your site without needing a developer.', icon: 'Edit3', highlights: ['Easy updates', 'No coding needed', 'Training included'] }
    ],
    businessImpact: {
      headline: 'Your Website is Your Best Salesperson',
      subheadline: 'It works 24/7, never takes a sick day, and handles unlimited visitors. Make sure it is doing its job.',
      painPoints: ['Outdated website makes you look unprofessional', 'Slow sites drive away 53% of mobile visitors', 'Poor design costs you sales every day'],
      outcomes: [{ metric: '3x', label: 'More', description: 'Lead generation' }, { metric: '<2s', label: 'Load Time', description: 'On all pages' }, { metric: '100%', label: 'Mobile', description: 'Optimized' }],
      testimonialQuote: 'New website tripled our online leads. Should have done this years ago.',
      testimonialAuthor: 'Karen S., Law Firm Partner'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Market Research', description: 'Analyze your market, competitors, and opportunities', icon: 'Search' },
      { step: 'Step 2', title: 'Strategy Development', description: 'Create a comprehensive marketing roadmap', icon: 'Map' },
      { step: 'Step 3', title: 'Channel Selection', description: 'Identify the best channels to reach your audience', icon: 'Share2' },
      { step: 'Step 4', title: 'Campaign Launch', description: 'Execute campaigns across selected channels', icon: 'Rocket' },
      { step: 'Step 5', title: 'Optimize & Scale', description: 'Measure results and double down on what works', icon: 'TrendingUp' }
    ],
    serviceCards: [
      { title: 'Market Analysis', tagline: 'Know Your Battlefield', description: 'Deep competitive analysis and market research so you understand exactly where opportunities exist.', icon: 'BarChart', highlights: ['Competitor analysis', 'Market sizing', 'Opportunity mapping'] },
      { title: 'Multi-Channel Strategy', tagline: 'Be Everywhere That Matters', description: 'Coordinated campaigns across digital, social, email, and traditional channels that work together.', icon: 'Layers', highlights: ['Digital marketing', 'Social media', 'Email campaigns'] },
      { title: 'Performance Tracking', tagline: 'Data-Driven Decisions', description: 'Real-time dashboards showing exactly which campaigns are working and which need adjustment.', icon: 'Activity', highlights: ['ROI tracking', 'Campaign analytics', 'Attribution modeling'] }
    ],
    businessImpact: {
      headline: 'Marketing Without Strategy is Just Noise',
      subheadline: 'Random posts and ads waste money. A real strategy targets the right people with the right message.',
      painPoints: ['Spending money on ads with no clear ROI', 'Inconsistent messaging confuses customers', 'No idea which marketing channels actually work'],
      outcomes: [{ metric: '300%', label: 'Average', description: 'ROI on campaigns' }, { metric: '50%', label: 'Lower', description: 'Customer acquisition cost' }, { metric: '2x', label: 'Increase', description: 'In qualified leads' }],
      testimonialQuote: 'Finally a marketing strategy that actually makes sense. Our CAC dropped by half.',
      testimonialAuthor: 'Ryan M., B2B Software'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Business Assessment', description: 'Deep dive into your current situation and goals', icon: 'ClipboardCheck' },
      { step: 'Step 2', title: 'Opportunity Analysis', description: 'Identify growth opportunities and threats', icon: 'Target' },
      { step: 'Step 3', title: 'Strategy Development', description: 'Create a clear roadmap for growth', icon: 'Map' },
      { step: 'Step 4', title: 'Financial Modeling', description: 'Project outcomes and resource requirements', icon: 'Calculator' },
      { step: 'Step 5', title: 'Execution Planning', description: 'Detailed action plan with milestones', icon: 'ListChecks' }
    ],
    serviceCards: [
      { title: 'Growth Strategy', tagline: 'Scale With Confidence', description: 'A clear roadmap from where you are to where you want to be, with specific milestones and metrics.', icon: 'TrendingUp', highlights: ['Growth roadmap', 'Milestone planning', 'KPI definition'] },
      { title: 'Competitive Positioning', tagline: 'Stand Out From Competition', description: 'Find your unique advantage and position your business to win against larger, more established competitors.', icon: 'Award', highlights: ['Market positioning', 'Differentiation strategy', 'Pricing optimization'] },
      { title: 'Business Planning', tagline: 'Plans That Get Funded', description: 'Whether for investors, banks, or your own clarity—business plans that are credible and actionable.', icon: 'FileText', highlights: ['Investor decks', 'Bank-ready plans', 'Financial projections'] }
    ],
    businessImpact: {
      headline: 'Stop Guessing, Start Growing',
      subheadline: 'Most businesses fail not from lack of effort, but from lack of direction. Strategy gives you the roadmap.',
      painPoints: ['Working hard but not seeing proportional growth', 'Unclear on which opportunities to pursue', 'Making decisions based on gut, not data'],
      outcomes: [{ metric: '46+', label: 'Years', description: 'Of experience applied' }, { metric: '100+', label: 'Businesses', description: 'Strategies developed' }, { metric: 'Clear', label: 'Roadmap', description: 'To your goals' }],
      testimonialQuote: 'Tory saw opportunities I was blind to. Revenue up 60% following his strategy.',
      testimonialAuthor: 'Patricia W., Manufacturing CEO'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'HR Audit', description: 'Review current HR practices and compliance status', icon: 'ClipboardCheck' },
      { step: 'Step 2', title: 'Policy Development', description: 'Create or update employee handbook and policies', icon: 'FileText' },
      { step: 'Step 3', title: 'Process Setup', description: 'Implement hiring, onboarding, and review processes', icon: 'Settings' },
      { step: 'Step 4', title: 'Compliance Training', description: 'Ensure team understands legal requirements', icon: 'GraduationCap' },
      { step: 'Step 5', title: 'Ongoing Support', description: 'Continuous HR guidance and issue resolution', icon: 'Headphones' }
    ],
    serviceCards: [
      { title: 'Hiring Systems', tagline: 'Find the Right People', description: 'Structured hiring processes that help you identify and attract top talent who fit your culture.', icon: 'UserPlus', highlights: ['Job descriptions', 'Interview frameworks', 'Candidate screening'] },
      { title: 'Employee Handbook', tagline: 'Clear Expectations', description: 'Professional employee handbooks that protect your business and set clear expectations for your team.', icon: 'Book', highlights: ['Policy documentation', 'Legal compliance', 'Culture definition'] },
      { title: 'Performance Management', tagline: 'Develop Your Team', description: 'Review systems that actually improve performance and help you identify and develop future leaders.', icon: 'Award', highlights: ['Review templates', 'Goal setting', 'Feedback systems'] }
    ],
    businessImpact: {
      headline: 'Your People Are Your Business',
      subheadline: 'One bad hire can cost you 2-3x their salary. Good HR systems prevent costly mistakes.',
      painPoints: ['High turnover is killing your profitability', 'No documentation exposes you to lawsuits', 'Bad hires drain team morale and productivity'],
      outcomes: [{ metric: '50%', label: 'Reduction', description: 'In turnover' }, { metric: '100%', label: 'Compliant', description: 'HR practices' }, { metric: '3x', label: 'Better', description: 'Hiring success rate' }],
      testimonialQuote: 'Went from constant turnover to a stable, happy team. The hiring system Tory built works.',
      testimonialAuthor: 'Lisa T., Healthcare Practice Owner'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'IT Assessment', description: 'Evaluate current infrastructure and security posture', icon: 'Search' },
      { step: 'Step 2', title: 'Security Hardening', description: 'Implement cybersecurity best practices', icon: 'Shield' },
      { step: 'Step 3', title: 'Cloud Migration', description: 'Move to reliable, scalable cloud infrastructure', icon: 'Cloud' },
      { step: 'Step 4', title: 'Backup Setup', description: 'Implement disaster recovery and backup systems', icon: 'HardDrive' },
      { step: 'Step 5', title: 'Ongoing Support', description: 'Help desk and proactive maintenance', icon: 'Headphones' }
    ],
    serviceCards: [
      { title: 'Cybersecurity', tagline: 'Protect Your Business', description: 'Multi-layered security protecting your data, your customers, and your reputation from cyber threats.', icon: 'Shield', highlights: ['Threat protection', 'Security training', 'Compliance'] },
      { title: 'Cloud Services', tagline: 'Work From Anywhere', description: 'Modern cloud infrastructure that keeps your team connected and productive from any location.', icon: 'Cloud', highlights: ['Cloud migration', 'Microsoft 365', 'Remote access'] },
      { title: 'Help Desk', tagline: 'Problems Solved Fast', description: 'Responsive IT support for your team so tech issues do not slow down your business.', icon: 'MessageCircle', highlights: ['Fast response', 'Remote support', 'On-site visits'] }
    ],
    businessImpact: {
      headline: 'Downtime Costs You Money Every Minute',
      subheadline: 'A cyber attack can shut down your business. Poor IT costs you productivity every day.',
      painPoints: ['Data breach could destroy your reputation', 'Slow systems frustrate your team', 'No disaster recovery means one failure could end you'],
      outcomes: [{ metric: '99.9%', label: 'Uptime', description: 'Guaranteed' }, { metric: '24/7', label: 'Monitoring', description: 'Of your systems' }, { metric: '<1hr', label: 'Response', description: 'To critical issues' }],
      testimonialQuote: 'We had a ransomware attempt. Their security caught it before any damage. Worth every penny.',
      testimonialAuthor: 'Mark D., Accounting Firm'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Brand Audit', description: 'Analyze your current social presence and voice', icon: 'Search' },
      { step: 'Step 2', title: 'Strategy Development', description: 'Create a content strategy aligned with your goals', icon: 'Lightbulb' },
      { step: 'Step 3', title: 'Content Creation', description: 'Develop engaging posts, graphics, and videos', icon: 'Image' },
      { step: 'Step 4', title: 'Community Management', description: 'Engage with your audience and build relationships', icon: 'Users' },
      { step: 'Step 5', title: 'Analytics & Optimization', description: 'Track performance and refine strategy', icon: 'BarChart' }
    ],
    serviceCards: [
      { title: 'Content Creation', tagline: 'Posts That Get Noticed', description: 'Engaging content tailored to each platform that builds your brand and drives engagement.', icon: 'PenTool', highlights: ['Custom graphics', 'Video content', 'Copywriting'] },
      { title: 'Community Building', tagline: 'Real Engagement', description: 'Build a loyal following through authentic engagement, not just vanity metrics.', icon: 'Heart', highlights: ['Comment management', 'DM responses', 'Community growth'] },
      { title: 'Paid Advertising', tagline: 'Targeted Reach', description: 'Laser-focused ad campaigns that put your message in front of your ideal customers.', icon: 'Target', highlights: ['Facebook/Instagram ads', 'Audience targeting', 'ROI tracking'] }
    ],
    businessImpact: {
      headline: 'Social Media Done Wrong Hurts Your Brand',
      subheadline: 'Inconsistent posting, ignored comments, and boring content make you look unprofessional.',
      painPoints: ['No time to post consistently', 'Posting but getting no engagement', 'Competitors are more visible than you'],
      outcomes: [{ metric: '3x', label: 'Increase', description: 'In engagement' }, { metric: '5x', label: 'Growth', description: 'In followers' }, { metric: 'Daily', label: 'Posting', description: 'Consistently' }],
      testimonialQuote: 'From 500 to 15,000 followers in 6 months. Our DMs are now full of leads.',
      testimonialAuthor: 'Chris B., Fitness Studio Owner'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'SEO Audit', description: 'Comprehensive analysis of your current search presence', icon: 'Search' },
      { step: 'Step 2', title: 'Keyword Research', description: 'Identify high-value keywords your customers search', icon: 'Target' },
      { step: 'Step 3', title: 'On-Page Optimization', description: 'Optimize your website content and structure', icon: 'FileCode' },
      { step: 'Step 4', title: 'Link Building', description: 'Build authoritative backlinks to boost rankings', icon: 'Link' },
      { step: 'Step 5', title: 'Monthly Reporting', description: 'Track rankings and traffic improvements', icon: 'BarChart' }
    ],
    serviceCards: [
      { title: 'Technical SEO', tagline: 'Foundation for Rankings', description: 'Site speed, mobile optimization, and technical fixes that search engines reward with higher rankings.', icon: 'Settings', highlights: ['Site speed optimization', 'Mobile-first fixes', 'Schema markup'] },
      { title: 'Content Strategy', tagline: 'Rank for What Matters', description: 'Strategic content that targets keywords your ideal customers are searching for right now.', icon: 'FileText', highlights: ['Keyword targeting', 'Content optimization', 'Blog strategy'] },
      { title: 'Local SEO', tagline: 'Dominate Your Area', description: 'Get found by local customers searching for businesses like yours. Own your local market.', icon: 'MapPin', highlights: ['Google Business Profile', 'Local citations', 'Review management'] }
    ],
    businessImpact: {
      headline: 'If You Are Not on Page 1, You Do Not Exist',
      subheadline: '75% of users never scroll past the first page of Google. Where does your business rank?',
      painPoints: ['Competitors ranking above you for key terms', 'Paying for ads when organic traffic is free', 'Invisible to customers searching for what you offer'],
      outcomes: [{ metric: 'Page 1', label: 'Rankings', description: 'For target keywords' }, { metric: '200%', label: 'Increase', description: 'In organic traffic' }, { metric: '40%', label: 'Lower', description: 'Cost per lead' }],
      testimonialQuote: 'Went from page 5 to position 3 in 4 months. Organic leads now beat our paid ads.',
      testimonialAuthor: 'Steve R., Plumbing Company Owner'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Needs Assessment', description: 'Identify what tasks you need help with', icon: 'ClipboardCheck' },
      { step: 'Step 2', title: 'VA Matching', description: 'We match you with the right assistant for your needs', icon: 'UserPlus' },
      { step: 'Step 3', title: 'Onboarding', description: 'Train your VA on your specific processes', icon: 'GraduationCap' },
      { step: 'Step 4', title: 'Workflow Setup', description: 'Establish communication and task management systems', icon: 'Settings' },
      { step: 'Step 5', title: 'Ongoing Management', description: 'Regular check-ins and performance optimization', icon: 'Activity' }
    ],
    serviceCards: [
      { title: 'Administrative Support', tagline: 'Reclaim Your Time', description: 'Email management, scheduling, data entry, and all the tasks that eat up your day but do not grow your business.', icon: 'Inbox', highlights: ['Email management', 'Calendar management', 'Data entry'] },
      { title: 'Customer Support', tagline: 'Happy Customers, Less Work', description: 'Professional customer service that represents your brand well and keeps clients satisfied.', icon: 'HeadphonesIcon', highlights: ['Email support', 'Live chat', 'Phone answering'] },
      { title: 'Research & Projects', tagline: 'Get Things Done', description: 'Research, presentations, travel planning, and special projects handled by skilled professionals.', icon: 'Search', highlights: ['Market research', 'Presentation creation', 'Project support'] }
    ],
    businessImpact: {
      headline: 'Stop Doing $15/hour Tasks',
      subheadline: 'If your time is worth $100+/hour, why are you spending it on emails and scheduling?',
      painPoints: ['Drowning in administrative tasks', 'No time for high-value work', 'Missing opportunities because you are too busy'],
      outcomes: [{ metric: '20+', label: 'Hours', description: 'Freed up weekly' }, { metric: '10x', label: 'ROI', description: 'On VA investment' }, { metric: 'Focus', label: 'Finally', description: 'On growth tasks' }],
      testimonialQuote: 'My VA handles everything I used to dread. I focus on sales now. Best decision ever.',
      testimonialAuthor: 'Amy K., Consulting Firm'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Discovery Session', description: 'Understand your goals, challenges, and aspirations', icon: 'MessageCircle' },
      { step: 'Step 2', title: 'Goal Setting', description: 'Define clear, measurable objectives together', icon: 'Target' },
      { step: 'Step 3', title: 'Weekly Sessions', description: 'Regular coaching calls to work through challenges', icon: 'Calendar' },
      { step: 'Step 4', title: 'Accountability', description: 'Check-ins to ensure you are staying on track', icon: 'CheckSquare' },
      { step: 'Step 5', title: 'Continuous Support', description: 'Email access between sessions for quick guidance', icon: 'Mail' }
    ],
    serviceCards: [
      { title: 'Strategic Guidance', tagline: '46 Years of Experience', description: 'Learn from someone who has actually built and scaled 100+ businesses—not theory, real-world experience.', icon: 'Compass', highlights: ['Business strategy', 'Problem solving', 'Decision support'] },
      { title: 'Accountability', tagline: 'Stay on Track', description: 'Having someone in your corner who holds you accountable makes all the difference in achieving your goals.', icon: 'Users', highlights: ['Weekly check-ins', 'Goal tracking', 'Progress reviews'] },
      { title: 'Leadership Development', tagline: 'Become a Better Leader', description: 'Develop the skills to lead your team, make tough decisions, and handle the challenges of growth.', icon: 'Award', highlights: ['Leadership skills', 'Team management', 'Communication'] }
    ],
    businessImpact: {
      headline: 'Every Successful Person Has a Coach',
      subheadline: 'Athletes, CEOs, and top performers all have coaches. Why are you trying to figure it out alone?',
      painPoints: ['Stuck at the same revenue level', 'Making the same mistakes repeatedly', 'No one to bounce ideas off who understands business'],
      outcomes: [{ metric: '2x', label: 'Faster', description: 'Goal achievement' }, { metric: 'Weekly', label: 'Sessions', description: 'With an expert' }, { metric: '24/7', label: 'Email', description: 'Access for support' }],
      testimonialQuote: 'Tory sees around corners I cannot. His coaching doubled my business in one year.',
      testimonialAuthor: 'James F., Agency Owner'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Brand Discovery', description: 'Understand your voice, audience, and goals', icon: 'Search' },
      { step: 'Step 2', title: 'Content Strategy', description: 'Develop a content plan aligned with your objectives', icon: 'Map' },
      { step: 'Step 3', title: 'Content Creation', description: 'Write and design compelling content', icon: 'PenTool' },
      { step: 'Step 4', title: 'Review & Revision', description: 'Refine content until it is perfect', icon: 'Edit' },
      { step: 'Step 5', title: 'Delivery & Publishing', description: 'Deliver final content ready for use', icon: 'Send' }
    ],
    serviceCards: [
      { title: 'Website Copy', tagline: 'Words That Convert', description: 'Website copy that speaks to your ideal customer and compels them to take action. Not just pretty words—words that sell.', icon: 'Globe', highlights: ['Landing pages', 'About pages', 'Service descriptions'] },
      { title: 'Blog Content', tagline: 'Content That Ranks', description: 'SEO-optimized blog posts that attract organic traffic and establish you as an authority in your industry.', icon: 'FileText', highlights: ['SEO articles', 'Thought leadership', 'Industry insights'] },
      { title: 'Email Campaigns', tagline: 'Emails That Get Opened', description: 'Email sequences that nurture leads, retain customers, and drive sales without being annoying.', icon: 'Mail', highlights: ['Welcome sequences', 'Sales emails', 'Newsletters'] }
    ],
    businessImpact: {
      headline: 'Content is How You Get Found and Build Trust',
      subheadline: 'Without content, you are invisible. With bad content, you look unprofessional.',
      painPoints: ['Website copy that sounds like everyone else', 'No time to write consistent content', 'Blog posts that no one reads'],
      outcomes: [{ metric: '10x', label: 'More', description: 'Organic traffic' }, { metric: '3x', label: 'Higher', description: 'Conversion rates' }, { metric: 'Authority', label: 'Position', description: 'In your industry' }],
      testimonialQuote: 'The new website copy Tory created increased our conversions by 180%. Words matter.',
      testimonialAuthor: 'Nicole A., SaaS Company'
    }
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
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Data Audit', description: 'Assess what data you have and what you need', icon: 'Database' },
      { step: 'Step 2', title: 'Dashboard Design', description: 'Create custom dashboards for your KPIs', icon: 'LayoutDashboard' },
      { step: 'Step 3', title: 'Integration Setup', description: 'Connect all your data sources', icon: 'Link' },
      { step: 'Step 4', title: 'Analysis & Insights', description: 'Deep dive into what the data reveals', icon: 'TrendingUp' },
      { step: 'Step 5', title: 'Ongoing Reporting', description: 'Regular reports with actionable recommendations', icon: 'FileBarChart' }
    ],
    serviceCards: [
      { title: 'Custom Dashboards', tagline: 'See Everything at Once', description: 'Real-time dashboards showing your most important metrics so you can make decisions at a glance.', icon: 'LayoutDashboard', highlights: ['Real-time data', 'Custom KPIs', 'Mobile access'] },
      { title: 'Predictive Analytics', tagline: 'See the Future', description: 'Use your data to predict trends, identify opportunities, and prevent problems before they happen.', icon: 'TrendingUp', highlights: ['Trend forecasting', 'Risk identification', 'Opportunity spotting'] },
      { title: 'Strategic Insights', tagline: 'Data-Driven Decisions', description: 'Monthly analysis that turns numbers into actionable recommendations for growing your business.', icon: 'Lightbulb', highlights: ['Monthly reports', 'Growth recommendations', 'Performance benchmarking'] }
    ],
    businessImpact: {
      headline: 'You Cannot Improve What You Do Not Measure',
      subheadline: 'Most businesses are drowning in data but starving for insights. We turn your numbers into action.',
      painPoints: ['Making decisions based on gut feeling', 'Data scattered across dozens of tools', 'No idea which activities actually drive revenue'],
      outcomes: [{ metric: '360°', label: 'View', description: 'Of your business' }, { metric: '50%', label: 'Faster', description: 'Decision making' }, { metric: 'ROI', label: 'Tracking', description: 'On every initiative' }],
      testimonialQuote: 'Finally have a single dashboard showing everything. Found $50K in hidden opportunities.',
      testimonialAuthor: 'Robert T., E-commerce CEO'
    }
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
