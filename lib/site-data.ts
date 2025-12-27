/**
 * Site Content Data Layer
 * Global content, copy, and configuration for A Startup Biz website
 */

export interface HeroContent {
  headline: string;
  subheadline: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
}

export interface AboutContent {
  name: string;
  title: string;
  bio: string;
  bioExtended?: string;
  image?: string;
  credentials: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
  details?: string[];
}

export interface ValueProposition {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
  image?: string;
  rating?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

/**
 * Hero Section Content
 */
export const heroContent: HeroContent = {
  headline: "Are You an Entrepreneur or Wantrepreneur?",
  subheadline: "Time to Separate the Dreamers from the Doers",
  description: "Stop talking about starting your business. Start building it. I connect ambitious entrepreneurs with the exact services they need to launch, grow, and scale—no fluff, no excuses, just results.",
  primaryCTA: {
    text: "Get Your Free Business Consultation",
    href: "/contact"
  },
  secondaryCTA: {
    text: "View Services",
    href: "/services"
  }
};

/**
 * About / Bio Section
 */
export const aboutContent: AboutContent = {
  name: "Tory Zweigle",
  title: "Business Consultant & Entrepreneur Advocate",
  bio: "I'm Tory Zweigle, and I help entrepreneurs turn their ideas into thriving businesses. With over a decade of experience in business consulting, I've seen it all—the dreamers who never launch, the builders who hit roadblocks, and the winners who break through because they had the right support at the right time.",
  bioExtended: "My mission is simple: cut through the noise and connect you with the exact services you need to succeed. Whether you're filing your EIN, building your first website, or scaling to seven figures, I've got a vetted network of experts ready to help you execute. No corporate jargon, no unnecessary delays—just practical solutions that work.",
  credentials: [
    "10+ years in business consulting",
    "Helped launch 500+ businesses",
    "Specialized in startup operations",
    "Expert in vendor matching and service coordination",
    "Passionate about cutting through bureaucracy"
  ],
  socialLinks: {
    linkedin: "https://linkedin.com/in/toryzweigle",
    email: "tory@astartupbiz.com"
  }
};

/**
 * How It Works Process
 */
export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Consult",
    description: "Tell me about your business goals, challenges, and what's holding you back from launching or growing.",
    icon: "MessageSquare",
    details: [
      "Free 30-minute consultation call",
      "Identify your specific needs",
      "Discuss timeline and budget",
      "Get honest, no-BS recommendations"
    ]
  },
  {
    number: 2,
    title: "Match",
    description: "I connect you with the perfect service providers from my vetted network of experts who specialize in your exact needs.",
    icon: "Users",
    details: [
      "Access to pre-vetted specialists",
      "Matched based on your requirements",
      "Transparent pricing and timelines",
      "No surprises, no hidden fees"
    ]
  },
  {
    number: 3,
    title: "Execute",
    description: "Get your services delivered on time, on budget, while I oversee the process to ensure quality and keep you moving forward.",
    icon: "Rocket",
    details: [
      "Project management oversight",
      "Quality assurance checks",
      "Regular progress updates",
      "Support until completion"
    ]
  }
];

/**
 * Value Propositions
 */
export const valuePropositions: ValueProposition[] = [
  {
    id: "speed",
    title: "Launch Faster",
    description: "Stop wasting time researching vendors. Get matched with the right experts immediately and start executing.",
    icon: "Zap",
    benefits: [
      "Same-day vendor matching",
      "Pre-negotiated service packages",
      "Streamlined onboarding process",
      "Fast-track your business launch"
    ]
  },
  {
    id: "quality",
    title: "Vetted Experts Only",
    description: "Every service provider in my network has been personally vetted for quality, reliability, and results.",
    icon: "Award",
    benefits: [
      "Proven track records",
      "Verified credentials",
      "Real client testimonials",
      "Performance guarantees"
    ]
  },
  {
    id: "support",
    title: "End-to-End Support",
    description: "From your first consultation to project completion, I'm here to ensure everything runs smoothly.",
    icon: "Headphones",
    benefits: [
      "Dedicated point of contact",
      "Project oversight and coordination",
      "Problem-solving when issues arise",
      "Post-project support"
    ]
  },
  {
    id: "transparency",
    title: "No Hidden Costs",
    description: "Get clear, upfront pricing with no surprises. You'll know exactly what you're paying for and why.",
    icon: "DollarSign",
    benefits: [
      "Transparent pricing structure",
      "Detailed project quotes",
      "No markup on vendor services",
      "Budget-friendly options available"
    ]
  },
  {
    id: "comprehensive",
    title: "Everything You Need",
    description: "From legal and accounting to marketing and tech—access all the services you need to run your business.",
    icon: "Package",
    benefits: [
      "15+ service categories",
      "One-stop business solutions",
      "Integrated service packages",
      "Scalable as you grow"
    ]
  },
  {
    id: "results",
    title: "Results-Driven",
    description: "I only care about one thing: helping you build a successful business. No fluff, just measurable outcomes.",
    icon: "Target",
    benefits: [
      "Goal-oriented approach",
      "Performance tracking",
      "Regular milestone reviews",
      "Guaranteed satisfaction"
    ]
  }
];

/**
 * Testimonials
 */
export const testimonials: Testimonial[] = [
  {
    id: "sarah-tech",
    name: "Sarah Mitchell",
    company: "TechFlow Solutions",
    role: "Founder & CEO",
    quote: "Tory didn't just help me file my LLC—she connected me with a bookkeeper, web developer, and marketing team. Six months later, I'm doing $50K/month in revenue. She cuts through the BS and gets things done.",
    rating: 5
  },
  {
    id: "james-retail",
    name: "James Rodriguez",
    company: "Urban Threads",
    role: "Co-Founder",
    quote: "I was stuck in analysis paralysis for 2 years. Tory gave me a roadmap and the exact people I needed to execute it. My e-commerce store launched in 6 weeks, and we hit profitability in month 3.",
    rating: 5
  },
  {
    id: "emily-coaching",
    name: "Emily Chen",
    company: "Mindful Leadership Coaching",
    role: "Business Coach",
    quote: "As a coach myself, I know good service when I see it. Tory's network is top-tier, and her project management kept everything on track. I refer all my clients to her now.",
    rating: 5
  },
  {
    id: "michael-construction",
    name: "Michael Thompson",
    company: "Thompson Construction LLC",
    role: "Owner",
    quote: "I needed help with legal, accounting, and getting my contractor's license sorted. Tory coordinated everything. Now I can focus on building, not paperwork.",
    rating: 5
  }
];

/**
 * FAQ Content
 */
export const faqItems: FAQItem[] = [
  {
    id: "what-is-astartupbiz",
    question: "What exactly is A Startup Biz?",
    answer: "A Startup Biz is your one-stop solution for business services. I connect entrepreneurs with vetted experts across legal, accounting, marketing, technology, and more. Think of me as your business concierge—I match you with the right service providers and oversee the work to ensure quality.",
    category: "general"
  },
  {
    id: "how-much-does-it-cost",
    question: "How much does your service cost?",
    answer: "My consultation is 100% free. For service coordination, I charge a small project management fee (typically 10-15% of the project value) to oversee and ensure quality. However, many basic services like EIN filing have flat rates with no markup. You'll always get transparent pricing upfront.",
    category: "pricing"
  },
  {
    id: "how-long-to-start",
    question: "How quickly can I get started?",
    answer: "You can book a free consultation today. After our call, I can typically match you with service providers within 24-48 hours. Some services (like EIN filing) can start same-day, while others (like website development) have a brief onboarding period.",
    category: "process"
  },
  {
    id: "what-if-not-satisfied",
    question: "What if I'm not satisfied with a service provider?",
    answer: "I personally vet every provider in my network, but if you're not satisfied, I'll make it right. I'll work with the provider to fix the issue or find you a replacement at no additional cost. Your success is my success.",
    category: "guarantee"
  },
  {
    id: "services-included",
    question: "What services do you offer?",
    answer: "Everything from business formation (EIN filing, LLC setup) to ongoing operations (accounting, bookkeeping) to growth services (marketing, web development, CRM). If you need it to run your business, I either offer it or know the best person who does.",
    category: "services"
  },
  {
    id: "only-for-startups",
    question: "Is this only for brand new businesses?",
    answer: "Not at all. While I specialize in helping entrepreneurs launch, I also work with established businesses looking to scale, optimize operations, or add new services. Whether you're pre-launch or doing $1M+ in revenue, I can help.",
    category: "general"
  },
  {
    id: "geographic-restrictions",
    question: "Do you only work with businesses in certain states?",
    answer: "No. I work with entrepreneurs across all 50 states and even internationally. My network includes providers who can handle state-specific requirements wherever you're located.",
    category: "general"
  },
  {
    id: "long-term-relationship",
    question: "Is this a one-time thing or ongoing relationship?",
    answer: "Both! Some clients need help with a single project (like filing their EIN or building a website), while others work with me long-term for ongoing services and strategic support. It's entirely up to you and your needs.",
    category: "process"
  }
];

/**
 * Call-to-Action Sections
 */
export const ctaSections = {
  primary: {
    headline: "Ready to Stop Dreaming and Start Building?",
    description: "Book your free consultation and let's turn your business idea into reality.",
    buttonText: "Schedule Free Consultation",
    buttonHref: "/contact"
  },
  secondary: {
    headline: "Not Sure Where to Start?",
    description: "Browse our services to see how we can help your business launch and grow.",
    buttonText: "View All Services",
    buttonHref: "/services"
  },
  ein: {
    headline: "Need an EIN Fast?",
    description: "Get your federal tax ID in days with our streamlined EIN filing service. Just $160.",
    buttonText: "File Your EIN Now",
    buttonHref: "/services/ein-filing"
  }
};

/**
 * Site Metadata
 */
export const siteMetadata = {
  name: "A Startup Biz",
  tagline: "Are You an Entrepreneur or Wantrepreneur?",
  description: "Professional business consulting and services for entrepreneurs. From EIN filing to full-service business solutions—launch, grow, and scale your business with expert support.",
  url: "https://astartupbiz.com",
  email: "tory@astartupbiz.com",
  phone: "+1 (555) 123-4567", // Replace with actual phone
  social: {
    linkedin: "https://linkedin.com/company/astartupbiz",
    twitter: "https://twitter.com/astartupbiz",
    facebook: "https://facebook.com/astartupbiz"
  }
};

/**
 * Trust Indicators / Stats
 */
export const trustStats = [
  {
    id: "businesses-launched",
    value: "500+",
    label: "Businesses Launched",
    icon: "Building2"
  },
  {
    id: "years-experience",
    value: "10+",
    label: "Years Experience",
    icon: "Award"
  },
  {
    id: "vetted-providers",
    value: "50+",
    label: "Vetted Service Providers",
    icon: "Users"
  },
  {
    id: "satisfaction-rate",
    value: "98%",
    label: "Client Satisfaction Rate",
    icon: "ThumbsUp"
  }
];

/**
 * Navigation Menu Items
 */
export const navigationMenu = [
  {
    id: "home",
    label: "Home",
    href: "/"
  },
  {
    id: "services",
    label: "Services",
    href: "/services",
    submenu: [
      { label: "All Services", href: "/services" },
      { label: "EIN Filing", href: "/services/ein-filing" },
      { label: "Legal Services", href: "/services/legal-services" },
      { label: "Accounting", href: "/services/accounting-services" },
      { label: "Website Development", href: "/services/website-development" },
      { label: "Marketing", href: "/services/marketing-strategy" }
    ]
  },
  {
    id: "about",
    label: "About",
    href: "/about"
  },
  {
    id: "resources",
    label: "Resources",
    href: "/resources",
    submenu: [
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "Case Studies", href: "/case-studies" }
    ]
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    highlighted: true
  }
];

/**
 * Footer Content
 */
export const footerContent = {
  about: {
    title: "A Startup Biz",
    description: "Professional business consulting and services for entrepreneurs who are ready to stop talking and start building."
  },
  quickLinks: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
    { label: "FAQs", href: "/faqs" }
  ],
  services: [
    { label: "EIN Filing", href: "/services/ein-filing" },
    { label: "Legal Services", href: "/services/legal-services" },
    { label: "Accounting", href: "/services/accounting-services" },
    { label: "Website Development", href: "/services/website-development" }
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" }
  ]
};

/**
 * Contact Form Fields Configuration
 */
export const contactFormConfig = {
  fields: [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: false },
    { name: "company", label: "Company Name", type: "text", required: false },
    {
      name: "businessStage",
      label: "Where are you in your business journey?",
      type: "select",
      required: true,
      options: [
        { value: "idea", label: "Just an idea" },
        { value: "planning", label: "Planning to launch" },
        { value: "launching", label: "Ready to launch" },
        { value: "operating", label: "Already operating" },
        { value: "scaling", label: "Looking to scale" }
      ]
    },
    {
      name: "services",
      label: "What services are you interested in?",
      type: "multiselect",
      required: false,
      options: [
        { value: "ein-filing", label: "EIN Filing" },
        { value: "legal", label: "Legal Services" },
        { value: "accounting", label: "Accounting" },
        { value: "bookkeeping", label: "Bookkeeping" },
        { value: "website", label: "Website Development" },
        { value: "marketing", label: "Marketing" },
        { value: "crm", label: "CRM" },
        { value: "ai", label: "AI Solutions" },
        { value: "other", label: "Other" }
      ]
    },
    {
      name: "message",
      label: "Tell me about your business goals",
      type: "textarea",
      required: true,
      placeholder: "What are you trying to accomplish? What's holding you back?"
    }
  ],
  submitText: "Get My Free Consultation",
  successMessage: "Thanks! I'll be in touch within 24 hours to schedule your free consultation.",
  errorMessage: "Oops! Something went wrong. Please try again or email me directly at tory@astartupbiz.com"
};
