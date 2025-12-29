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
  duration?: string;   // "Day 1", "1-2 days", "24 hours", "Same day", "1 week", "Ongoing"
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
  relatedServices?: string[]; // Array of related service slugs
  faqs?: { question: string; answer: string }[];
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
      { step: 'Step 1', title: 'Quick Consultation', description: '15-minute call to understand your business structure', icon: 'MessageCircle', duration: 'Day 1' },
      { step: 'Step 2', title: 'Document Collection', description: 'We gather the necessary information from you', icon: 'FileText', duration: 'Same day' },
      { step: 'Step 3', title: 'IRS Submission', description: 'Same-day application to the IRS', icon: 'Send', duration: 'Same day' },
      { step: 'Step 4', title: 'EIN Delivered', description: 'Receive your EIN confirmation within 24-48 hours', icon: 'CheckCircle', duration: '1-2 days' }
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
    },
    faqs: [
      { question: 'How long does it take to get my EIN?', answer: 'Most EINs are delivered within 24-48 hours of submission. We submit same-day and the IRS typically processes applications quickly. In some cases, you may receive it even faster.' },
      { question: 'Do I really need an EIN for my business?', answer: 'If you plan to hire employees, open a business bank account, or establish business credit, yes. An EIN is also required for most business structures like LLCs and corporations. It separates your personal and business finances.' },
      { question: 'What documents do I need to provide?', answer: 'We need basic information about your business structure, your personal details (as the responsible party), and your business formation documents if already filed. We guide you through exactly what is needed during our quick consultation.' },
      { question: 'Can I file for an EIN myself for free?', answer: 'Yes, the IRS does not charge for EINs. However, many DIY filers make errors that delay approval or file with the wrong business structure. Our $160 fee ensures expert filing, saves you time, and prevents costly mistakes that could affect your taxes for years.' }
    ]
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
      { step: 'Step 1', title: 'Legal Assessment', description: 'We review your business needs and legal requirements', icon: 'ClipboardCheck', duration: '1-2 days' },
      { step: 'Step 2', title: 'Entity Selection', description: 'Choose the right structure for your situation', icon: 'Building2', duration: '1 day' },
      { step: 'Step 3', title: 'Document Drafting', description: 'We prepare all necessary legal documents', icon: 'FileEdit', duration: '3-5 days' },
      { step: 'Step 4', title: 'State Filing', description: 'Submit formation documents to your state', icon: 'Send', duration: '1-2 weeks' },
      { step: 'Step 5', title: 'Compliance Setup', description: 'Establish ongoing compliance systems', icon: 'Shield', duration: 'Ongoing' }
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
    },
    faqs: [
      { question: 'What is included in your legal services?', answer: 'We handle entity formation (LLC, Corporation, Partnership), operating agreements, contract drafting and review, trademark protection, and ongoing compliance support. Each package is customized to your specific needs.' },
      { question: 'Do I need a lawyer or can you handle everything?', answer: 'For most standard business formations and contracts, we handle everything in-house with our legal team. For complex litigation or specialized legal matters, we work with partner attorneys and coordinate everything for you.' },
      { question: 'How do your contracts protect my business?', answer: 'We draft contracts with your interests first—clear terms, proper liability protection, payment terms that favor you, and exit clauses if things go wrong. Every contract is reviewed to ensure you are protected, not just the other party.' },
      { question: 'What happens if I miss a compliance deadline?', answer: 'Missed deadlines can result in penalties, loss of good standing, or even business dissolution. That is why our ongoing compliance service monitors all deadlines and handles filings automatically. You will never miss a critical deadline again.' }
    ]
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
      { step: 'Step 1', title: 'Financial Review', description: 'We analyze your current financial situation', icon: 'Search', duration: '2-3 days' },
      { step: 'Step 2', title: 'System Setup', description: 'Configure accounting software and processes', icon: 'Settings', duration: '1 week' },
      { step: 'Step 3', title: 'Monthly Processing', description: 'Regular financial statement preparation', icon: 'Calendar', duration: 'Monthly' },
      { step: 'Step 4', title: 'Tax Planning', description: 'Quarterly reviews and tax strategy optimization', icon: 'Calculator', duration: 'Quarterly' },
      { step: 'Step 5', title: 'Strategic Insights', description: 'CFO-level advice on financial decisions', icon: 'TrendingUp', duration: 'Ongoing' }
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
    },
    faqs: [
      { question: 'What is the difference between accounting and bookkeeping?', answer: 'Bookkeeping is the daily recording of transactions. Accounting is the analysis, strategy, and tax planning based on those records. We offer both—clean books and strategic financial guidance to help you make smarter decisions.' },
      { question: 'How much can I really save on taxes?', answer: 'Most small businesses overpay by 20-40% due to missed deductions and poor planning. We average $15K-$50K in tax savings annually per client through proactive planning, entity optimization, and finding every legitimate deduction.' },
      { question: 'Do you work with my existing CPA?', answer: 'Absolutely. We can either handle all your accounting and tax needs, or work alongside your CPA providing monthly financials and strategic support. Many CPAs appreciate having clean, organized books to work with at tax time.' },
      { question: 'How often will I get financial reports?', answer: 'You receive monthly financial statements (P&L, Balance Sheet, Cash Flow) within 48 hours of month-end. You also get real-time access to your dashboard 24/7 so you always know where you stand.' }
    ],
    relatedServices: ['legal-services', 'bookkeeping', 'accounting-services'],
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
      { step: 'Step 1', title: 'Books Assessment', description: 'We review your current bookkeeping situation', icon: 'ClipboardList', duration: '1-2 days' },
      { step: 'Step 2', title: 'System Migration', description: 'Set up or migrate to QuickBooks/Xero', icon: 'RefreshCw', duration: '3-5 days' },
      { step: 'Step 3', title: 'Cleanup & Catchup', description: 'Get your books current and accurate', icon: 'Sparkles', duration: '1-2 weeks' },
      { step: 'Step 4', title: 'Ongoing Management', description: 'Daily transaction recording and reconciliation', icon: 'Calendar', duration: 'Ongoing' }
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
    },
    faqs: [
      { question: 'Do I really need a bookkeeper if I use QuickBooks?', answer: 'QuickBooks is a tool, not a solution. Most business owners who try to DIY their bookkeeping make costly errors in categorization, reconciliation, and reporting. A professional bookkeeper ensures your data is accurate and your books are audit-ready.' },
      { question: 'How far behind can my books be for you to help?', answer: 'We have cleaned up books that were years behind. Our catch-up service gets you current quickly, typically within 1-2 weeks depending on volume. The longer you wait, the harder (and more expensive) it gets, so start now.' },
      { question: 'What is included in your monthly bookkeeping service?', answer: 'Daily transaction recording, monthly bank reconciliation, accounts payable/receivable tracking, financial statement preparation, and access to your financial dashboard. Payroll processing is available as an add-on.' },
      { question: 'Will you handle my payroll taxes too?', answer: 'Yes. Our payroll service includes accurate tax withholding, quarterly tax filings, W-2/1099 preparation, and direct deposit setup. No more worrying about IRS penalties for late or incorrect payroll tax payments.' }
    ],
    relatedServices: ['ein-filing', 'business-strategy', 'accounting-services'],
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions',
    title: 'AI Agents & Automation',
    shortTitle: 'AI Solutions',
    description: "I've automated operations across dozens of my own companies with AI agents that work 24/7. Let me show you how AI can eliminate busywork, reduce errors, and free you to focus on what actually grows your business.",
    icon: 'Bot',
    features: [
      'AI chatbots for 24/7 customer support',
      'Lead qualification bots that score and route leads',
      'Smart appointment scheduling with natural language',
      'FAQ automation with instant answers',
      'Intelligent routing to the right team member',
      'Voice AI for phone call handling',
      'Email automation and smart responses',
      'Document processing and data extraction',
      'Custom AI workflow development',
      'Multi-platform integration',
      'Analytics and performance tracking',
      'Ongoing training and optimization'
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
      { step: 'Step 1', title: 'Process Audit', description: 'We identify automation opportunities in your workflow', icon: 'Search', duration: '1 week' },
      { step: 'Step 2', title: 'Solution Design', description: 'Custom AI strategy tailored to your needs', icon: 'Lightbulb', duration: '3-5 days' },
      { step: 'Step 3', title: 'Development', description: 'Build and test your AI automation tools', icon: 'Code', duration: '2-4 weeks' },
      { step: 'Step 4', title: 'Integration', description: 'Connect with your existing systems', icon: 'Link', duration: '1 week' },
      { step: 'Step 5', title: 'Training & Support', description: 'Ensure your team can use the new tools effectively', icon: 'GraduationCap', duration: 'Ongoing' }
    ],
    serviceCards: [
      { title: 'AI Chatbots', tagline: '24/7 Customer Service', description: 'Intelligent AI agents that handle customer inquiries, qualify leads, book appointments, and answer FAQs—even at 3 AM. They learn your business and represent your brand perfectly.', icon: 'MessageSquare', highlights: ['Natural language understanding', 'Lead qualification', 'Appointment booking', 'Multi-language support'] },
      { title: 'Voice AI Agents', tagline: 'Answer Every Call', description: 'AI-powered phone agents that answer calls, take messages, schedule appointments, and handle basic inquiries. Never miss a call or opportunity again.', icon: 'Phone', highlights: ['24/7 call answering', 'Appointment scheduling', 'Call routing', 'Message taking'] },
      { title: 'Workflow Automation', tagline: 'Eliminate Busywork', description: 'Automate repetitive tasks like data entry, email responses, follow-ups, and report generation. AI agents handle the grunt work so your team can focus on high-value activities.', icon: 'Workflow', highlights: ['Email automation', 'Data entry bots', 'Report generation', 'Smart follow-ups'] },
      { title: 'Custom AI Development', tagline: 'Built for Your Business', description: 'Need something specific? We build custom AI agents and workflows that solve your unique business challenges—from document processing to predictive analytics.', icon: 'Wand2', highlights: ['Custom agents', 'API integrations', 'Predictive analytics', 'Process automation'] }
    ],
    businessImpact: {
      headline: 'Your Competitors Are Already Using AI',
      subheadline: 'Businesses using AI automation are saving 10-20 hours per week. Can you afford to fall behind?',
      painPoints: ['Spending hours on tasks that could be automated', 'Missing leads because you cannot respond fast enough', 'Competitors delivering faster service with AI'],
      outcomes: [{ metric: '20+', label: 'Hours', description: 'Saved weekly' }, { metric: '3x', label: 'Faster', description: 'Customer response time' }, { metric: '50%', label: 'Reduction', description: 'In manual errors' }],
      testimonialQuote: 'The AI chatbot Tory built handles 70% of our customer inquiries automatically. Game changer.',
      testimonialAuthor: 'Alex P., SaaS Founder'
    },
    faqs: [
      { question: 'How much technical knowledge do I need to use AI tools?', answer: 'None. We build AI solutions that are simple for your team to use. We handle all the technical complexity—setup, integration, and ongoing maintenance. You just use the tools like any other software.' },
      { question: 'Can AI really handle customer service as well as a human?', answer: 'For routine inquiries, scheduling, and FAQs—absolutely. AI chatbots handle 60-80% of typical customer questions instantly, 24/7. Complex issues still route to your team, but AI drastically reduces your support workload.' },
      { question: 'What if the AI makes a mistake or gives wrong information?', answer: 'We train and test AI systems extensively before deployment. They work from your approved knowledge base, so responses are controlled and accurate. We also implement human oversight for critical interactions and monitor performance continuously.' },
      { question: 'How long does it take to implement an AI solution?', answer: 'Simple chatbots can be live in 2-3 weeks. Complex custom automation typically takes 4-8 weeks including testing. We start with quick wins to deliver value fast, then expand capabilities over time.' }
    ],
    relatedServices: ['bookkeeping', 'business-analytics', 'business-strategy'],
  },
  {
    id: 'crm-implementation',
    slug: 'crm-implementation',
    title: 'CRM & Automation Platform',
    shortTitle: 'CRM',
    description: "Every customer counts. I've implemented complete business automation platforms for businesses from solo operations to large teams—I'll design a system that actually gets used and turns leads into loyal customers on autopilot.",
    icon: 'Users',
    features: [
      'Contact & lead management in one place',
      'Visual sales pipeline with drag-and-drop',
      'Automated email sequences and nurture campaigns',
      'SMS marketing and appointment reminders',
      'Self-booking appointment calendar',
      'Review requests and reputation management',
      'High-converting landing pages (no coding)',
      'Lead capture forms and surveys',
      'Payment processing and subscriptions',
      'Workflow automation triggers',
      'Unified inbox for all channels',
      'Call tracking and recording',
      'Real-time analytics dashboard'
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
      { step: 'Step 1', title: 'Needs Assessment', description: 'We analyze your sales process and requirements', icon: 'ClipboardCheck', duration: '2-3 days' },
      { step: 'Step 2', title: 'Platform Selection', description: 'Choose the right CRM for your business size', icon: 'Layers', duration: '1 day' },
      { step: 'Step 3', title: 'Custom Configuration', description: 'Set up pipelines, automations, and integrations', icon: 'Settings', duration: '1-2 weeks' },
      { step: 'Step 4', title: 'Data Migration', description: 'Move your existing customer data safely', icon: 'Database', duration: '3-5 days' },
      { step: 'Step 5', title: 'Team Training', description: 'Ensure everyone knows how to use the system', icon: 'Users', duration: '1 week' }
    ],
    serviceCards: [
      { title: 'Pipeline & Contacts', tagline: 'All Leads in One Place', description: 'Visual sales pipelines with drag-and-drop. Track every lead from first contact to closed deal. Segment and tag contacts automatically based on behavior.', icon: 'GitBranch', highlights: ['Visual pipeline stages', 'Contact segmentation', 'Deal value tracking', 'Smart tagging'] },
      { title: 'Marketing Automation', tagline: 'Campaigns on Autopilot', description: 'Automated email sequences, SMS campaigns, appointment reminders, and review requests. Nurture leads 24/7 without lifting a finger.', icon: 'Zap', highlights: ['Email sequences', 'SMS campaigns', 'Review automation', 'Appointment reminders'] },
      { title: 'Unified Communications', tagline: 'One Inbox for Everything', description: 'Email, SMS, Facebook Messenger, Instagram DMs, Google Chat—all in one place. Never miss a message, respond faster, close more deals.', icon: 'Inbox', highlights: ['Unified inbox', 'Two-way texting', 'Social DMs', 'Call tracking'] },
      { title: 'Funnels & Forms', tagline: 'Capture & Convert', description: 'Build high-converting landing pages, lead forms, and surveys without coding. Accept payments, book appointments, and capture leads 24/7.', icon: 'Target', highlights: ['Landing pages', 'Lead forms', 'Payment collection', 'Appointment booking'] }
    ],
    businessImpact: {
      headline: 'You Are Losing Leads Right Now',
      subheadline: 'Without a proper CRM and automation, you are forgetting follow-ups, losing track of deals, and leaving money on the table every single day.',
      painPoints: ['Leads fall through the cracks without proper tracking', 'No visibility into your sales pipeline', 'Spending hours on manual follow-ups', 'Missing calls and messages across platforms'],
      outcomes: [{ metric: '35%', label: 'Increase', description: 'In close rate' }, { metric: '10x', label: 'Faster', description: 'Lead response time' }, { metric: '100%', label: 'Visibility', description: 'Into your pipeline' }],
      testimonialQuote: 'Our sales team finally has a system that works. Close rate up 40% in 3 months.',
      testimonialAuthor: 'Tom H., Insurance Agency Owner'
    },
    faqs: [
      { question: 'Which CRM platform do you recommend?', answer: 'It depends on your business size, budget, and needs. We typically recommend HubSpot for marketing-heavy businesses, Salesforce for enterprise, and Pipedrive or Close for sales teams. We help you choose the right fit, not just the most expensive.' },
      { question: 'Can you migrate data from our current system?', answer: 'Yes. We safely migrate customer data, deal history, and contact information from spreadsheets, old CRMs, or other systems. We clean and organize data during migration so you start with quality information.' },
      { question: 'Will my team actually use the CRM?', answer: 'That is why we focus on user adoption. We design simple workflows, provide hands-on training, and set up automation to reduce manual data entry. When a CRM makes their job easier, teams embrace it.' },
      { question: 'How do you measure CRM success?', answer: 'We track adoption rate (team usage), lead response time, sales cycle length, and close rates. A successful CRM improves all these metrics. We provide monthly reports showing exactly how the CRM impacts your bottom line.' }
    ],
    relatedServices: ['accounting-services', 'virtual-assistants', 'business-analytics'],
  },
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Website Design & Development',
    shortTitle: 'Web Development',
    description: "Your website is your 24/7 salesperson. I've built sites for my own businesses that actually convert—not just look pretty. From single-page landing sites to comprehensive 15-20 page business websites, let me create something that works as hard as you do.",
    icon: 'Globe',
    features: [
      'Custom responsive design built for your brand',
      'Mobile-first development (60%+ of traffic is mobile)',
      'SEO optimization included from day one',
      'Lightning fast loading (under 3 seconds)',
      'Easy-to-use content management system',
      'Google Analytics & heatmap tracking setup',
      'Security (SSL, backups, firewall protection)',
      'Contact forms and lead capture',
      'Social media integration',
      'Live chat widget ready',
      'Maintenance packages available',
      'Training so you can update content yourself'
    ],
    pricing: {
      basePrice: 1500,
      currency: 'USD',
      billingPeriod: 'one-time',
      priceRange: {
        min: 1500,
        max: 7500
      },
      customQuote: true
    },
    category: 'technology',
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Discovery Call', description: 'We understand your brand, goals, and target audience', icon: 'MessageCircle', duration: 'Same day' },
      { step: 'Step 2', title: 'Design Phase', description: 'Create wireframes and visual designs for approval', icon: 'Palette', duration: '1-2 weeks' },
      { step: 'Step 3', title: 'Development', description: 'Build your site with modern, fast technology', icon: 'Code', duration: '2-4 weeks' },
      { step: 'Step 4', title: 'Content & SEO', description: 'Optimize content for search engines', icon: 'Search', duration: '1 week' },
      { step: 'Step 5', title: 'Launch & Training', description: 'Go live and learn to manage your site', icon: 'Rocket', duration: '1 day' }
    ],
    serviceCards: [
      { title: 'Single-Page Starter', tagline: 'From $1,500', description: 'Perfect for landing pages, coming soon pages, or simple business presence. One powerful page that converts visitors into customers.', icon: 'FileText', highlights: ['1 page design', 'Mobile responsive', 'Contact form included'] },
      { title: 'Business Website', tagline: 'Up to $7,500', description: 'Full 15-20 page websites for established businesses. Home, About, Services, Blog, Contact, and custom pages—everything you need.', icon: 'Globe', highlights: ['15-20 pages', 'Full CMS access', 'SEO optimized'] },
      { title: 'Mobile-First Design', tagline: 'Perfect on Every Device', description: 'Over 60% of web traffic is mobile. Your site will look and work perfectly on phones, tablets, and desktops.', icon: 'Smartphone', highlights: ['Responsive design', 'Fast loading', 'Touch optimized'] }
    ],
    businessImpact: {
      headline: 'Your Website is Your Best Salesperson',
      subheadline: 'It works 24/7, never takes a sick day, and handles unlimited visitors. Make sure it is doing its job.',
      painPoints: ['Outdated website makes you look unprofessional', 'Slow sites drive away 53% of mobile visitors', 'Poor design costs you sales every day'],
      outcomes: [{ metric: '$1,500', label: 'Starting', description: 'Single page sites' }, { metric: '$7,500', label: 'Full Site', description: '15-20 pages' }, { metric: '100%', label: 'Mobile', description: 'Optimized' }],
      testimonialQuote: 'New website tripled our online leads. Should have done this years ago.',
      testimonialAuthor: 'Karen S., Law Firm Partner'
    },
    faqs: [
      { question: 'What is the difference between a $1,500 and $7,500 website?', answer: 'Our $1,500 single-page sites are perfect for landing pages, lead capture, or simple business presence. Full websites ($5,000-$7,500) include 15-20 pages—Home, About, Services, Blog, Contact, and custom pages—with full CMS, SEO optimization, and comprehensive training.' },
      { question: 'How long does it take to build a website?', answer: 'Single-page sites take 1-2 weeks. Full business websites take 4-8 weeks from start to launch. This includes discovery, design, development, content, and testing. Rush projects available.' },
      { question: 'Will I be able to update the website myself?', answer: 'Absolutely. We build sites on modern CMS platforms (WordPress, Webflow, or custom) that let you update content, add pages, and manage your site without coding. We provide training and documentation.' },
      { question: 'Do you provide website hosting and maintenance?', answer: 'Yes. We offer managed hosting, security updates, backups, and ongoing maintenance. You can also host elsewhere—we build sites that work with any quality hosting provider.' }
    ],
    relatedServices: ['crm-implementation', 'website-development', 'it-services'],
  },
  {
    id: 'marketing-strategy',
    slug: 'marketing-strategy',
    title: 'Marketing Strategy & Branding',
    shortTitle: 'Marketing',
    description: "I've marketed everything from local services to nationwide brands. Forget guesswork—I'll show you exactly what's working right now and help you reach customers who are ready to buy. 6-month minimum commitment ensures we have time to build real results.",
    icon: 'TrendingUp',
    features: [
      'Full-service marketing retainer',
      'Brand strategy and positioning',
      'Market research and analysis',
      'Competitive analysis',
      'Multi-channel campaign planning',
      'Content strategy and creation',
      'Performance tracking and optimization',
      'Monthly strategy calls',
      '6-month minimum commitment for lasting results'
    ],
    pricing: {
      basePrice: 1500,
      currency: 'USD',
      billingPeriod: 'monthly',
      customQuote: true
    },
    category: 'marketing',
    popular: true,
    heroImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Market Research', description: 'Analyze your market, competitors, and opportunities', icon: 'Search', duration: '1 week' },
      { step: 'Step 2', title: 'Strategy Development', description: 'Create a comprehensive marketing roadmap', icon: 'Map', duration: '1-2 weeks' },
      { step: 'Step 3', title: 'Channel Selection', description: 'Identify the best channels to reach your audience', icon: 'Share2', duration: '2-3 days' },
      { step: 'Step 4', title: 'Campaign Launch', description: 'Execute campaigns across selected channels', icon: 'Rocket', duration: '1 week' },
      { step: 'Step 5', title: 'Optimize & Scale', description: 'Measure results and double down on what works', icon: 'TrendingUp', duration: 'Ongoing' }
    ],
    serviceCards: [
      { title: 'Monthly Retainer', tagline: '$1,500/Month (6-Month Min)', description: 'Comprehensive marketing support with dedicated strategy, execution, and optimization. Real partnerships require real commitment—6 months builds momentum.', icon: 'Calendar', highlights: ['Dedicated support', 'Monthly strategy calls', 'Ongoing optimization'] },
      { title: 'Brand Strategy', tagline: 'Stand Out From Competition', description: 'Deep competitive analysis, brand positioning, and messaging that resonates with your ideal customers.', icon: 'Target', highlights: ['Brand positioning', 'Competitor analysis', 'Messaging framework'] },
      { title: 'Multi-Channel Execution', tagline: 'Full Campaign Management', description: 'We plan AND execute—content creation, ad campaigns, email marketing, and social media all coordinated for maximum impact.', icon: 'Layers', highlights: ['Campaign execution', 'Content creation', 'Performance tracking'] }
    ],
    businessImpact: {
      headline: 'Marketing Without Strategy is Just Noise',
      subheadline: 'Random posts and ads waste money. A real strategy targets the right people with the right message.',
      painPoints: ['Spending money on ads with no clear ROI', 'Inconsistent messaging confuses customers', 'No idea which marketing channels actually work'],
      outcomes: [{ metric: '300%', label: 'Average', description: 'ROI on campaigns' }, { metric: '50%', label: 'Lower', description: 'Customer acquisition cost' }, { metric: '2x', label: 'Increase', description: 'In qualified leads' }],
      testimonialQuote: 'Finally a marketing strategy that actually makes sense. Our CAC dropped by half.',
      testimonialAuthor: 'Ryan M., B2B Software'
    },
    faqs: [
      { question: 'Why is there a 6-month minimum commitment?', answer: 'Marketing results take time. The first 1-2 months are testing and optimization. By month 3-4, we see what works. Months 5-6 is where we scale winners and see real ROI. Clients who commit for 6 months see 3-5x better results than those who stop early.' },
      { question: 'What is included in the $1,500/month retainer?', answer: 'Full-service marketing: strategy, content creation, campaign execution, performance tracking, and monthly strategy calls. You get a complete marketing team—not just advice. We plan AND execute everything.' },
      { question: 'Do you handle branding and visual identity too?', answer: 'Yes. Brand strategy includes positioning, messaging, and visual identity guidelines. We ensure your brand stands out consistently across all channels. Full rebrands available as add-on projects.' },
      { question: 'How often will I see campaign results and reports?', answer: 'Weekly performance updates and monthly detailed reports with strategy calls. You also get real-time dashboard access 24/7 to see campaign performance, lead flow, and ROI anytime.' }
    ],
    relatedServices: ['ai-solutions', 'seo-services', 'social-media'],
  },
  {
    id: 'business-strategy',
    slug: 'business-strategy',
    title: 'Business Strategy Consulting',
    shortTitle: 'Strategy',
    description: "46+ years of starting, growing, and scaling businesses—that's what you get access to. I'll help you see the gaps, seize the opportunities, and build a roadmap that actually works. Consulting is billed hourly based on your specific needs.",
    icon: 'Target',
    features: [
      'One-on-one strategic consultation sessions',
      'Business plan development',
      'Market opportunity analysis',
      'Growth strategy planning',
      'Competitive positioning',
      'Financial modeling',
      'Execution roadmap',
      'Time-based billing with detailed tracking',
      'Flexible engagement—pay only for the time you need'
    ],
    pricing: {
      basePrice: 750,
      currency: 'USD',
      billingPeriod: 'hourly',
      customQuote: true
    },
    category: 'growth',
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    timeline: [
      { step: 'Step 1', title: 'Discovery Call', description: 'Free 30-minute call to understand your needs and scope the engagement', icon: 'Phone', duration: 'Same day' },
      { step: 'Step 2', title: 'Business Assessment', description: 'Deep dive into your current situation and goals (billed hourly)', icon: 'ClipboardCheck', duration: '2-4 hours' },
      { step: 'Step 3', title: 'Opportunity Analysis', description: 'Identify growth opportunities and threats', icon: 'Target', duration: '3-6 hours' },
      { step: 'Step 4', title: 'Strategy Development', description: 'Create a clear roadmap for growth', icon: 'Map', duration: '4-8 hours' },
      { step: 'Step 5', title: 'Execution Planning', description: 'Detailed action plan with milestones', icon: 'ListChecks', duration: '2-4 hours' }
    ],
    serviceCards: [
      { title: 'Hourly Consulting', tagline: '$750/Hour Expert Guidance', description: 'Get strategic advice from someone who has built 100+ businesses. Pay only for the time you need—no retainers, no minimums for initial engagements.', icon: 'Clock', highlights: ['Flexible scheduling', 'Detailed time tracking', 'No wasted spend'] },
      { title: 'Growth Strategy', tagline: 'Scale With Confidence', description: 'A clear roadmap from where you are to where you want to be, with specific milestones and metrics.', icon: 'TrendingUp', highlights: ['Growth roadmap', 'Milestone planning', 'KPI definition'] },
      { title: 'Business Planning', tagline: 'Plans That Get Funded', description: 'Whether for investors, banks, or your own clarity—business plans that are credible and actionable.', icon: 'FileText', highlights: ['Investor decks', 'Bank-ready plans', 'Financial projections'] }
    ],
    businessImpact: {
      headline: 'Stop Guessing, Start Growing',
      subheadline: 'Most businesses fail not from lack of effort, but from lack of direction. Strategy gives you the roadmap.',
      painPoints: ['Working hard but not seeing proportional growth', 'Unclear on which opportunities to pursue', 'Making decisions based on gut, not data'],
      outcomes: [{ metric: '$750', label: 'Per Hour', description: 'Transparent billing' }, { metric: '46+', label: 'Years', description: 'Of experience applied' }, { metric: '100+', label: 'Businesses', description: 'Strategies developed' }],
      testimonialQuote: 'Tory saw opportunities I was blind to. Revenue up 60% following his strategy.',
      testimonialAuthor: 'Patricia W., Manufacturing CEO'
    },
    faqs: [
      { question: 'How does hourly consulting work?', answer: 'We start with a free 30-minute discovery call to understand your needs. From there, I quote estimated hours for your project. You are billed only for time spent, with detailed tracking of all consulting hours. Most initial strategy sessions run 10-20 hours total.' },
      { question: 'Why $750 per hour?', answer: 'You are getting 46 years and 100+ businesses worth of experience distilled into focused, actionable guidance. Most consultants charge similar rates but have only read about business. I have actually built them. The ROI on strategic clarity typically pays for itself many times over.' },
      { question: 'Do you work with startups or just established businesses?', answer: 'Both. Startups get help validating ideas, building business plans, and avoiding costly mistakes. Established businesses get growth strategies, operational improvements, and scaling plans. The approach differs, but the value is the same—actionable guidance from experience.' },
      { question: 'What if I need ongoing support after the initial strategy?', answer: 'Many clients retain me for ongoing quarterly reviews and strategic guidance at the same hourly rate. We can also discuss retainer arrangements for consistent monthly support if that fits your needs better.' }
    ],
    relatedServices: ['seo-services', 'content-creation', 'ai-solutions'],
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
      { step: 'Step 1', title: 'HR Audit', description: 'Review current HR practices and compliance status', icon: 'ClipboardCheck', duration: '3-5 days' },
      { step: 'Step 2', title: 'Policy Development', description: 'Create or update employee handbook and policies', icon: 'FileText', duration: '1-2 weeks' },
      { step: 'Step 3', title: 'Process Setup', description: 'Implement hiring, onboarding, and review processes', icon: 'Settings', duration: '1 week' },
      { step: 'Step 4', title: 'Compliance Training', description: 'Ensure team understands legal requirements', icon: 'GraduationCap', duration: '2-3 days' },
      { step: 'Step 5', title: 'Ongoing Support', description: 'Continuous HR guidance and issue resolution', icon: 'Headphones', duration: 'Ongoing' }
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
    },
    faqs: [
      { question: 'Do I need HR services if I only have a few employees?', answer: 'Absolutely. Even one bad hire or one HR compliance mistake can cost you tens of thousands. Proper hiring processes, employee handbooks, and compliance from day one protects you from costly lawsuits and turnover.' },
      { question: 'Can you help me fire a problem employee legally?', answer: 'Yes. We guide you through proper termination procedures that minimize legal risk. This includes documentation, final pay requirements, unemployment claims, and separation agreements. Doing it right protects you from wrongful termination lawsuits.' },
      { question: 'What HR compliance do I actually need to worry about?', answer: 'Depends on your state, industry, and employee count. Common requirements include employment posters, harassment prevention training, I-9 verification, workers comp insurance, and proper wage/hour practices. We audit your compliance and fix gaps.' },
      { question: 'How do you help improve employee retention?', answer: 'We implement structured onboarding, clear job descriptions, performance feedback systems, and development plans. Employees stay when they know what is expected, feel valued, and see a future. Our systems create that environment.' }
    ],
    relatedServices: ['social-media', 'seo-services', 'content-creation'],
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
      { step: 'Step 1', title: 'IT Assessment', description: 'Evaluate current infrastructure and security posture', icon: 'Search', duration: '1 week' },
      { step: 'Step 2', title: 'Security Hardening', description: 'Implement cybersecurity best practices', icon: 'Shield', duration: '1-2 weeks' },
      { step: 'Step 3', title: 'Cloud Migration', description: 'Move to reliable, scalable cloud infrastructure', icon: 'Cloud', duration: '2-4 weeks' },
      { step: 'Step 4', title: 'Backup Setup', description: 'Implement disaster recovery and backup systems', icon: 'HardDrive', duration: '1 week' },
      { step: 'Step 5', title: 'Ongoing Support', description: 'Help desk and proactive maintenance', icon: 'Headphones', duration: 'Ongoing' }
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
    },
    faqs: [
      { question: 'Do you provide on-site IT support or just remote?', answer: 'Both. Most issues are resolved remotely within minutes. For hardware problems, network setup, or on-site needs, we dispatch technicians. You get fast remote support backed by local presence when needed.' },
      { question: 'What happens if we get hacked or hit with ransomware?', answer: 'Our cybersecurity measures prevent 99% of attacks. If an incident occurs, we have incident response protocols—isolate the threat, recover from backups, and restore operations fast. Our clients have never paid a ransom because we have proper backups.' },
      { question: 'Can you work with our existing IT setup?', answer: 'Yes. We assess your current infrastructure and either enhance it or migrate you to better systems. We work with all major platforms—Microsoft, Google, Apple—and can integrate with your existing tools.' },
      { question: 'How quickly do you respond to IT emergencies?', answer: 'Critical issues (server down, security breach, complete outage) get immediate response—within 15 minutes. High priority issues within 1 hour. Standard requests within 4 hours. We monitor systems 24/7 to catch problems before they impact you.' }
    ],
    relatedServices: ['business-coaching', 'legal-services', 'business-analytics'],
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
      { step: 'Step 1', title: 'Brand Audit', description: 'Analyze your current social presence and voice', icon: 'Search', duration: '2-3 days' },
      { step: 'Step 2', title: 'Strategy Development', description: 'Create a content strategy aligned with your goals', icon: 'Lightbulb', duration: '1-2 weeks' },
      { step: 'Step 3', title: 'Content Creation', description: 'Develop engaging posts, graphics, and videos', icon: 'Image', duration: 'Weekly' },
      { step: 'Step 4', title: 'Community Management', description: 'Engage with your audience and build relationships', icon: 'Users', duration: 'Daily' },
      { step: 'Step 5', title: 'Analytics & Optimization', description: 'Track performance and refine strategy', icon: 'BarChart', duration: 'Monthly' }
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
    },
    faqs: [
      { question: 'Which social media platforms should my business be on?', answer: 'It depends on your audience. B2B companies thrive on LinkedIn. Retail and lifestyle brands need Instagram and Facebook. Service businesses often succeed with Facebook and YouTube. We analyze where your customers are and focus there—not everywhere.' },
      { question: 'How often should I be posting on social media?', answer: 'Quality beats quantity. We recommend 3-5 posts per week on main platforms, daily Stories/Reels for engagement. Consistency matters more than volume. We create a sustainable posting schedule you can actually maintain.' },
      { question: 'Do you handle responding to comments and messages?', answer: 'Yes. Community management is included—we respond to comments, answer DMs, and engage with your audience daily. This builds relationships and keeps your social presence active even when you are busy.' },
      { question: 'How do you measure social media success?', answer: 'We track engagement rate, follower growth, website traffic from social, and most importantly—leads and sales generated. Vanity metrics like follower count matter less than actual business results. We optimize for ROI, not just likes.' }
    ],
    relatedServices: ['virtual-assistants', 'legal-services', 'business-coaching'],
  },
  {
    id: 'seo-services',
    slug: 'seo-services',
    title: 'SEO & AI-Powered Search Marketing',
    shortTitle: 'SEO',
    description: "Getting found online is no accident. I've ranked my own businesses on page one using both traditional SEO and cutting-edge AI tools. Let me help you get discovered by customers who are actively searching for what you offer—faster than ever with AI-enhanced optimization.",
    icon: 'Search',
    features: [
      'Traditional and AI-powered keyword research',
      'AI content optimization and generation',
      'On-page SEO optimization',
      'Technical SEO audits and fixes',
      'AI-enhanced link building strategies',
      'Local SEO domination',
      'Voice search optimization',
      'AI-driven competitor analysis',
      'Schema markup and structured data',
      'Monthly performance reports with AI insights'
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
      { step: 'Step 1', title: 'SEO Audit', description: 'Comprehensive analysis of your current search presence', icon: 'Search', duration: '1 week' },
      { step: 'Step 2', title: 'Keyword Research', description: 'Identify high-value keywords your customers search', icon: 'Target', duration: '3-5 days' },
      { step: 'Step 3', title: 'On-Page Optimization', description: 'Optimize your website content and structure', icon: 'FileCode', duration: '2-3 weeks' },
      { step: 'Step 4', title: 'Link Building', description: 'Build authoritative backlinks to boost rankings', icon: 'Link', duration: 'Ongoing' },
      { step: 'Step 5', title: 'Monthly Reporting', description: 'Track rankings and traffic improvements', icon: 'BarChart', duration: 'Monthly' }
    ],
    serviceCards: [
      { title: 'AI-Powered SEO', tagline: 'Next-Gen Optimization', description: 'We use AI tools to analyze competitors, optimize content, and find ranking opportunities humans miss. Faster results with smarter technology.', icon: 'Bot', highlights: ['AI content optimization', 'Competitor intelligence', 'Automated insights'] },
      { title: 'Technical SEO', tagline: 'Foundation for Rankings', description: 'Site speed, mobile optimization, schema markup, and technical fixes that search engines reward with higher rankings.', icon: 'Settings', highlights: ['Site speed optimization', 'Core Web Vitals', 'Schema markup'] },
      { title: 'Local SEO', tagline: 'Dominate Your Area', description: 'Get found by local customers searching for businesses like yours. Own your local market with Google Business Profile optimization.', icon: 'MapPin', highlights: ['Google Business Profile', 'Local citations', 'Review management'] }
    ],
    businessImpact: {
      headline: 'If You Are Not on Page 1, You Do Not Exist',
      subheadline: '75% of users never scroll past the first page of Google. Where does your business rank?',
      painPoints: ['Competitors ranking above you for key terms', 'Paying for ads when organic traffic is free', 'Invisible to customers searching for what you offer'],
      outcomes: [{ metric: 'Page 1', label: 'Rankings', description: 'For target keywords' }, { metric: '200%', label: 'Increase', description: 'In organic traffic' }, { metric: '40%', label: 'Lower', description: 'Cost per lead' }],
      testimonialQuote: 'Went from page 5 to position 3 in 4 months. Organic leads now beat our paid ads.',
      testimonialAuthor: 'Steve R., Plumbing Company Owner'
    },
    faqs: [
      { question: 'How does AI-powered SEO differ from traditional SEO?', answer: 'AI tools analyze thousands of data points to find ranking opportunities, optimize content faster, and predict algorithm changes. We use AI for keyword research, content optimization, competitor analysis, and identifying link opportunities. Results come faster with AI-enhanced strategies.' },
      { question: 'How long does SEO take to show results?', answer: 'With AI-enhanced SEO, expect to see movement in 2-3 months and significant results in 4-8 months—faster than traditional methods. Technical fixes improve site speed immediately. Our AI tools accelerate every phase of SEO.' },
      { question: 'Can you guarantee first page rankings?', answer: 'Anyone who guarantees #1 rankings is lying. We guarantee quality work, AI-enhanced best practices, and steady improvement. Our track record shows 80%+ of clients reach page 1 for target keywords within 12 months.' },
      { question: 'Do you optimize for voice search and AI assistants?', answer: 'Yes. Voice search and AI assistants like Siri, Alexa, and Google Assistant are changing how people find businesses. We optimize for conversational queries, featured snippets, and the structured data that AI assistants rely on.' }
    ],
    relatedServices: ['ai-solutions', 'website-development', 'crm-implementation'],
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
      { step: 'Step 1', title: 'Needs Assessment', description: 'Identify what tasks you need help with', icon: 'ClipboardCheck', duration: '2-3 days' },
      { step: 'Step 2', title: 'VA Matching', description: 'We match you with the right assistant for your needs', icon: 'UserPlus', duration: '2-3 days' },
      { step: 'Step 3', title: 'Onboarding', description: 'Train your VA on your specific processes', icon: 'GraduationCap', duration: '1 week' },
      { step: 'Step 4', title: 'Workflow Setup', description: 'Establish communication and task management systems', icon: 'Settings', duration: '3-5 days' },
      { step: 'Step 5', title: 'Ongoing Management', description: 'Regular check-ins and performance optimization', icon: 'Activity', duration: 'Ongoing' }
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
    },
    faqs: [
      { question: 'Where are your virtual assistants located?', answer: 'We work with skilled VAs in the Philippines and Latin America. They are highly trained, English-fluent, and work in your time zone. Many have college degrees and specialized skills beyond basic admin work.' },
      { question: 'What if my VA does not work out?', answer: 'We provide a 30-day trial period. If the match is not right, we find you a replacement at no additional cost. Our goal is the right long-term fit, not just filling a seat.' },
      { question: 'How do I communicate with and manage a VA?', answer: 'We set you up with project management tools (Asana, Trello) and communication platforms (Slack, Zoom). Daily check-ins, clear task lists, and regular feedback keep everyone aligned. We provide management training if needed.' },
      { question: 'Can a VA really handle sensitive business information?', answer: 'Yes. All VAs sign NDAs and data security agreements. We implement access controls, secure password management, and regular security training. Many of our clients trust VAs with financial data, customer information, and confidential projects.' }
    ],
    relatedServices: ['marketing-strategy', 'content-creation', 'seo-services'],
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
      { step: 'Step 1', title: 'Discovery Session', description: 'Understand your goals, challenges, and aspirations', icon: 'MessageCircle', duration: 'Day 1' },
      { step: 'Step 2', title: 'Goal Setting', description: 'Define clear, measurable objectives together', icon: 'Target', duration: 'Week 1' },
      { step: 'Step 3', title: 'Weekly Sessions', description: 'Regular coaching calls to work through challenges', icon: 'Calendar', duration: 'Weekly' },
      { step: 'Step 4', title: 'Accountability', description: 'Check-ins to ensure you are staying on track', icon: 'CheckSquare', duration: 'Weekly' },
      { step: 'Step 5', title: 'Continuous Support', description: 'Email access between sessions for quick guidance', icon: 'Mail', duration: 'Ongoing' }
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
    },
    faqs: [
      { question: 'How is coaching different from consulting?', answer: 'Consulting tells you what to do. Coaching helps you figure it out and holds you accountable to do it. You get strategic advice PLUS accountability, support, and someone in your corner through challenges. The combination drives faster results.' },
      { question: 'What should I expect from our coaching sessions?', answer: 'Weekly 60-minute calls focused on your biggest challenges and opportunities. We review progress, solve problems, plan next steps, and ensure you stay on track. Between sessions, you have email access for quick guidance.' },
      { question: 'Do you work with businesses in specific industries?', answer: 'I have experience across dozens of industries—from retail to services to manufacturing to tech. Business fundamentals are universal. The specifics change, but growth principles remain the same.' },
      { question: 'What results can I expect from coaching?', answer: 'Most coaching clients see faster decision-making, better strategic clarity, and accelerated growth. On average, businesses grow 2x faster with coaching than trying to figure it out alone. You also avoid expensive mistakes I have already made.' }
    ],
    relatedServices: ['website-development', 'content-creation', 'social-media'],
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
      { step: 'Step 1', title: 'Brand Discovery', description: 'Understand your voice, audience, and goals', icon: 'Search', duration: '1 week' },
      { step: 'Step 2', title: 'Content Strategy', description: 'Develop a content plan aligned with your objectives', icon: 'Map', duration: '1-2 weeks' },
      { step: 'Step 3', title: 'Content Creation', description: 'Write and design compelling content', icon: 'PenTool', duration: 'Weekly' },
      { step: 'Step 4', title: 'Review & Revision', description: 'Refine content until it is perfect', icon: 'Edit', duration: '3-5 days' },
      { step: 'Step 5', title: 'Delivery & Publishing', description: 'Deliver final content ready for use', icon: 'Send', duration: 'Same day' }
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
    },
    faqs: [
      { question: 'Do you write content for technical or niche industries?', answer: 'Yes. We research your industry thoroughly and interview you to understand technical details. Our writers adapt to any industry voice—from legal to medical to engineering. If you can explain it, we can write about it compellingly.' },
      { question: 'Can you match my brand voice?', answer: 'Absolutely. We start with a brand voice discovery session, review your existing content, and create style guidelines. Most clients cannot tell the difference between our writing and their own after the first few pieces.' },
      { question: 'How many revisions do I get?', answer: 'Two rounds of revisions are included on all content. In reality, most clients are happy after the first draft because we nail the voice and messaging early. Additional revisions available if needed.' },
      { question: 'Do you handle the SEO keywords or do I provide them?', answer: 'We handle keyword research as part of content strategy. We identify what your customers are searching for and create content targeting those terms. You can also provide specific keywords you want to rank for.' }
    ],
    relatedServices: ['hr-solutions', 'bookkeeping', 'crm-implementation'],
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
      { step: 'Step 1', title: 'Data Audit', description: 'Assess what data you have and what you need', icon: 'Database', duration: '1 week' },
      { step: 'Step 2', title: 'Dashboard Design', description: 'Create custom dashboards for your KPIs', icon: 'LayoutDashboard', duration: '1-2 weeks' },
      { step: 'Step 3', title: 'Integration Setup', description: 'Connect all your data sources', icon: 'Link', duration: '1 week' },
      { step: 'Step 4', title: 'Analysis & Insights', description: 'Deep dive into what the data reveals', icon: 'TrendingUp', duration: 'Ongoing' },
      { step: 'Step 5', title: 'Ongoing Reporting', description: 'Regular reports with actionable recommendations', icon: 'FileBarChart', duration: 'Monthly' }
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
    },
    faqs: [
      { question: 'What data sources can you integrate into dashboards?', answer: 'We connect virtually any business system—QuickBooks, Salesforce, Shopify, Google Analytics, social media platforms, ad accounts, and more. If it has an API or exports data, we can integrate it into your dashboard.' },
      { question: 'Do I need a data analyst on staff to use your dashboards?', answer: 'No. We design dashboards for business owners, not data scientists. Clear visualizations, plain-English insights, and intuitive navigation. You will understand your metrics at a glance.' },
      { question: 'How much does a custom dashboard cost?', answer: 'Depends on complexity and data sources. Simple dashboards start at $2,500 one-time setup. Complex multi-source dashboards with predictive analytics range from $8,000-$15,000. Monthly support and updates available.' },
      { question: 'Can you help us figure out what we should be measuring?', answer: 'Absolutely. Many businesses track too many metrics or the wrong ones. We help you identify the 5-10 KPIs that actually drive your business, then build dashboards around those critical numbers.' }
    ],
    relatedServices: ['business-strategy', 'business-analytics', 'marketing-strategy'],
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
 * Get related services for a given service
 */
export function getRelatedServices(service: Service): Service[] {
  if (!service.relatedServices || service.relatedServices.length === 0) {
    return [];
  }

  return service.relatedServices
    .map(slug => getServiceBySlug(slug))
    .filter((s): s is Service => s !== undefined)
    .slice(0, 3); // Limit to 3 related services
}

/**
 * Service categories metadata
 */
/**
 * Financing Options Configuration
 * Quirina financing available for qualifying services
 */
export const financingConfig = {
  provider: 'Quirina',
  enabled: true,
  minimumAmount: 1000,
  maximumAmount: 50000,
  terms: [6, 12, 18, 24],
  aprRange: { min: 0, max: 29.99 },
  eligibleCategories: ['technology', 'marketing', 'growth', 'operations'],
  cta: {
    text: 'Finance This Service',
    subtext: 'As low as 0% APR with Quirina',
  },
  benefits: [
    'Quick approval in minutes',
    'Rates as low as 0% APR',
    'Flexible 6-24 month terms',
    'No prepayment penalties',
    'Simple online application'
  ],
  disclaimer: 'Financing provided by Quirina. Subject to credit approval. Terms and conditions apply. Rates range from 0-29.99% APR based on creditworthiness.'
};

/**
 * Check if a service is eligible for financing
 */
export function isServiceFinancingEligible(service: Service): boolean {
  return (
    financingConfig.enabled &&
    financingConfig.eligibleCategories.includes(service.category) &&
    service.pricing.basePrice >= financingConfig.minimumAmount
  );
}

/**
 * Calculate estimated monthly payment
 */
export function calculateMonthlyPayment(amount: number, termMonths: number, apr: number = 0): number {
  if (apr === 0) {
    return Math.ceil(amount / termMonths);
  }
  const monthlyRate = apr / 100 / 12;
  const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                  (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.ceil(payment);
}

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
