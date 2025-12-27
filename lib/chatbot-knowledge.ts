/**
 * Chatbot Knowledge Base
 * Comprehensive information for the sales chatbot
 */

export interface KnowledgeCategory {
  category: string;
  topics: KnowledgeTopic[];
}

export interface KnowledgeTopic {
  keywords: string[];
  response: string;
  followUp?: string;
}

export const chatbotKnowledge = {
  // About Tory and Background
  about: {
    name: "Tory R. Zweigle",
    age: 46,
    experience: "46+ years",
    businessesStarted: "100+",
    tagline: "Serial entrepreneur who actually builds businesses—not a consultant",
    background: "Started first business at age 11. Built and scaled over 100 businesses across multiple industries. Master of absentee ownership. NOT a traditional consultant—teaches from real-world experience, not textbooks.",
  },

  // Services Overview (all 17 services)
  services: [
    {
      name: "EIN Filing",
      price: "$160",
      shortDescription: "Same-day EIN filing with expert guidance. Get your federal tax ID in 24-48 hours.",
      keyBenefits: ["Same-day submission", "24-48 hour delivery", "100% success rate"]
    },
    {
      name: "Legal Services",
      price: "$500 - $5,000",
      shortDescription: "Business entity formation, contracts, compliance. LLC, Corporation, Partnership setup.",
      keyBenefits: ["Entity formation", "Contract drafting", "Ongoing compliance"]
    },
    {
      name: "Accounting Services",
      price: "$500 - $2,500/month",
      shortDescription: "Monthly financial statements, tax planning, CFO advisory services.",
      keyBenefits: ["Financial clarity", "Tax optimization", "CFO-level insights"]
    },
    {
      name: "Bookkeeping & Payroll",
      price: "$300 - $1,500/month",
      shortDescription: "Daily transaction recording, bank reconciliation, payroll processing.",
      keyBenefits: ["Clean books", "Accurate payroll", "Real-time access"]
    },
    {
      name: "AI & Automation",
      price: "$2,500 - $15,000",
      shortDescription: "AI chatbots, workflow automation, custom AI tool development.",
      keyBenefits: ["24/7 automation", "Save 20+ hours weekly", "Reduce errors 50%"]
    },
    {
      name: "CRM Implementation",
      price: "$1,500 - $8,000",
      shortDescription: "CRM platform selection, custom setup, sales pipeline design.",
      keyBenefits: ["Pipeline visibility", "Lead tracking", "Automation setup"]
    },
    {
      name: "Website Development",
      price: "$3,000 - $20,000",
      shortDescription: "Conversion-focused websites that work 24/7 to generate leads.",
      keyBenefits: ["Mobile-first design", "SEO optimized", "Fast loading"]
    },
    {
      name: "Marketing Strategy",
      price: "$1,500 - $10,000/month",
      shortDescription: "Market research, competitive analysis, multi-channel campaign planning.",
      keyBenefits: ["Data-driven strategy", "ROI tracking", "Multi-channel reach"]
    },
    {
      name: "Business Strategy",
      price: "$2,000 - $15,000",
      shortDescription: "Business planning, growth strategy, competitive positioning with 46+ years experience.",
      keyBenefits: ["Clear roadmap", "Growth planning", "Expert guidance"]
    },
    {
      name: "HR Solutions",
      price: "$800 - $3,500/month",
      shortDescription: "Employee handbooks, hiring processes, compliance management.",
      keyBenefits: ["Hiring systems", "Compliance protection", "Performance management"]
    },
    {
      name: "IT Services",
      price: "$1,000 - $5,000/month",
      shortDescription: "Network security, cloud migration, cybersecurity, help desk support.",
      keyBenefits: ["24/7 monitoring", "99.9% uptime", "Fast response"]
    },
    {
      name: "Social Media",
      price: "$1,200 - $5,000/month",
      shortDescription: "Content creation, community management, paid advertising campaigns.",
      keyBenefits: ["Daily engagement", "Content creation", "Targeted ads"]
    },
    {
      name: "SEO Services",
      price: "$1,000 - $5,000/month",
      shortDescription: "Keyword research, on-page optimization, link building, local SEO.",
      keyBenefits: ["Page 1 rankings", "Organic traffic growth", "Lower lead costs"]
    },
    {
      name: "Virtual Assistants",
      price: "$25 - $75/hour",
      shortDescription: "Skilled VAs for admin, customer support, research, and more.",
      keyBenefits: ["Save 20+ hours weekly", "10x ROI", "Flexible support"]
    },
    {
      name: "Business Coaching",
      price: "$500 - $2,500/month",
      shortDescription: "Weekly coaching sessions with accountability and unlimited email support.",
      keyBenefits: ["Expert mentorship", "Weekly sessions", "24/7 email access"]
    },
    {
      name: "Content Creation",
      price: "$800 - $3,500/month",
      shortDescription: "Website copy, blog posts, email campaigns, sales materials.",
      keyBenefits: ["SEO content", "Conversion copy", "Brand voice"]
    },
    {
      name: "Business Analytics",
      price: "$1,500 - $6,000/month",
      shortDescription: "Custom dashboards, KPI tracking, predictive analytics.",
      keyBenefits: ["Real-time data", "Strategic insights", "ROI tracking"]
    }
  ],

  // Pricing & Investment
  pricing: {
    clarityCall: {
      price: "$1,000",
      duration: "90 minutes",
      value: "Save $10K+ in mistakes",
      includes: [
        "90-minute deep-dive session",
        "Personalized roadmap for your business",
        "Identify blind spots and opportunities",
        "Walk away with clear next steps"
      ]
    },
    servicesNote: "Service pricing varies based on complexity and needs. Most services have custom quotes available."
  },

  // Value Propositions
  valueProps: [
    "46+ years of real-world experience building 100+ businesses",
    "NOT a consultant—actual serial entrepreneur who has lived it",
    "Master of absentee ownership—teach you to work ON your business, not IN it",
    "Real lessons from real failures and successes",
    "Direct access to someone who's made every mistake so you don't have to"
  ],

  // Common Objections & Responses
  objections: {
    tooExpensive: "Hiring Tory prevents $10K+ in costly mistakes. One bad hire, wrong business structure, or missed tax strategy costs more than any service. This is an investment in avoiding expensive errors.",
    canDoItMyself: "You CAN do it yourself—but should you? Your time is worth more than $15/hour tasks. Tory has already made the mistakes and learned the lessons over 46 years. Fast-track your success instead of learning the hard way.",
    notSure: "Book the $1,000 Clarity Call. In 90 minutes, you'll get a clear roadmap and actionable insights worth 10x the investment. If you're on the fence, that's the best next step.",
    needToThink: "Thinking is good—but action is better. The $1,000 Clarity Call gives you everything you need to make an informed decision. What specific questions can I answer right now?"
  },

  // Quick Prompts for Users
  quickPrompts: [
    "Tell me about Tory's background",
    "What services do you offer?",
    "How much does it cost?",
    "What's the $1,000 Clarity Call?",
    "How is Tory different from other consultants?",
    "I need help with [legal/accounting/marketing/etc.]"
  ],

  // Booking CTAs
  ctas: {
    bookCall: "Ready to talk? Book your $1,000 Clarity Call now",
    exploreSrevices: "Explore our full service catalog",
    contactTeam: "Connect with Tory's team for a custom quote"
  }
};

/**
 * Match user intent to knowledge
 */
export function matchIntent(userMessage: string): string | null {
  const msg = userMessage.toLowerCase();

  // Greeting patterns
  if (/(^|\s)(hi|hello|hey|good morning|good afternoon|good evening)(\s|$|!)/i.test(msg)) {
    return "greeting";
  }

  // About Tory
  if (/(who is|tell me about|background|tory|experience|founder)/i.test(msg)) {
    return "about";
  }

  // Services inquiry
  if (/(what do you|services|what can you|help with|do you offer)/i.test(msg)) {
    return "services";
  }

  // Specific service mentions
  if (/(ein|tax id|federal id)/i.test(msg)) return "service-ein";
  if (/(legal|llc|corporation|contracts?|lawyer)/i.test(msg)) return "service-legal";
  if (/(accounting|bookkeeping|taxes|cpa|financial)/i.test(msg)) return "service-accounting";
  if (/(ai|automation|chatbot|automate)/i.test(msg)) return "service-ai";
  if (/(crm|sales|pipeline|customer relationship)/i.test(msg)) return "service-crm";
  if (/(website|web design|web dev)/i.test(msg)) return "service-website";
  if (/(marketing|advertising|ads|campaign)/i.test(msg)) return "service-marketing";
  if (/(strategy|business plan|consulting|advisor)/i.test(msg)) return "service-strategy";
  if (/(hr|hiring|employees|human resources)/i.test(msg)) return "service-hr";
  if (/(it|technology|tech support|cybersecurity)/i.test(msg)) return "service-it";
  if (/(social media|instagram|facebook|linkedin)/i.test(msg)) return "service-social";
  if (/(seo|search engine|google|ranking)/i.test(msg)) return "service-seo";
  if (/(virtual assistant|va|admin support)/i.test(msg)) return "service-va";
  if (/(coaching|mentor|mentorship|business coach)/i.test(msg)) return "service-coaching";
  if (/(content|copywriting|blog|writing)/i.test(msg)) return "service-content";
  if (/(analytics|data|dashboard|reporting)/i.test(msg)) return "service-analytics";

  // Pricing
  if (/(how much|cost|price|pricing|expensive|afford|budget)/i.test(msg)) {
    return "pricing";
  }

  // Clarity Call
  if (/(clarity call|consultation|1000|thousand|meet|talk to tory)/i.test(msg)) {
    return "clarity-call";
  }

  // Different from others
  if (/(why|different|better|unique|compared|versus|vs)/i.test(msg)) {
    return "differentiation";
  }

  // Booking / Next Steps
  if (/(book|schedule|appointment|sign up|get started|next step)/i.test(msg)) {
    return "booking";
  }

  return null;
}

/**
 * Generate response based on intent
 */
export function generateResponse(intent: string | null, userMessage: string): string {
  if (!intent) {
    return "I'd love to help! I can tell you about Tory's background, our services, pricing, or help you book a Clarity Call. You can also connect with our team for specific questions. What would be most helpful?";
  }

  const responses: Record<string, string> = {
    greeting: `Hey there! 👋 I'm here to help you learn about Tory's services and how we can help your business grow.\n\nTory is a serial entrepreneur with 46+ years of experience who's started over 100 businesses. He's NOT a consultant—he's lived it.\n\nWhat brings you here today?`,

    about: `Tory R. Zweigle is a serial entrepreneur who's built over 100 businesses since age 11. With 46+ years of real-world experience, he's mastered everything from startup launches to absentee ownership.\n\nHere's what makes Tory different:\n• Started 100+ businesses—he's lived the entrepreneur journey\n• 46+ years of hands-on experience, not textbook theory\n• Master of absentee ownership (the holy grail of business)\n• Shares lessons from REAL failures and successes\n\nHe's not a traditional consultant. He teaches from experience, not theory.\n\nWant to learn about specific services or book a call?`,

    services: `Tory's team offers 17 comprehensive services to help your business succeed:\n\n**Formation & Legal:**\n• EIN Filing ($160)\n• Legal Services ($500-$5,000)\n\n**Financial:**\n• Accounting ($500-$2,500/mo)\n• Bookkeeping ($300-$1,500/mo)\n\n**Technology:**\n• AI & Automation ($2,500-$15,000)\n• CRM Implementation ($1,500-$8,000)\n• Website Development ($3,000-$20,000)\n• IT Services ($1,000-$5,000/mo)\n\n**Marketing:**\n• Marketing Strategy ($1,500-$10,000/mo)\n• Social Media ($1,200-$5,000/mo)\n• SEO Services ($1,000-$5,000/mo)\n• Content Creation ($800-$3,500/mo)\n\n**Growth & Operations:**\n• Business Strategy ($2,000-$15,000)\n• Business Coaching ($500-$2,500/mo)\n• HR Solutions ($800-$3,500/mo)\n• Virtual Assistants ($25-$75/hr)\n• Business Analytics ($1,500-$6,000/mo)\n\nWhat area interests you most?`,

    "service-ein": `**EIN Filing Service - $160**\n\nGet your federal tax ID fast without IRS headaches. Tory has filed EINs for 100+ of his own businesses.\n\n✓ Same-day application submission\n✓ 24-48 hour delivery\n✓ 100% success rate\n✓ Expert guidance on requirements\n\nWhy you need it: Required for business bank accounts, hiring employees, and building business credit.\n\nWant to get started or learn about other services?`,

    "service-legal": `**Business Legal Services - $500-$5,000**\n\nProper legal structure protects you from day one. Tory has structured 100+ businesses.\n\n✓ Entity formation (LLC, Corp, Partnership)\n✓ Operating agreements & bylaws\n✓ Contract drafting & review\n✓ Trademark & IP protection\n✓ Ongoing compliance support\n\nOne bad contract or wrong structure can cost you everything. Get it right the first time.\n\nReady to protect your business?`,

    "service-accounting": `**Accounting Services - $500-$2,500/month**\n\nKnow your numbers. Most businesses overpay taxes by 20-40% due to poor planning.\n\n✓ Monthly financial statements\n✓ Tax preparation & planning\n✓ CFO-level advisory\n✓ Find deductions you're missing\n\nAverage tax savings: $15K-$50K annually per client.\n\nStop flying blind with your finances. Want to learn more?`,

    "service-ai": `**AI & Automation Solutions - $2,500-$15,000**\n\nTory has automated operations across dozens of his companies. Let AI do the busywork.\n\n✓ AI chatbots (24/7 customer service)\n✓ Workflow automation\n✓ Custom AI tool development\n\nResults:\n• Save 20+ hours per week\n• 3x faster customer response\n• 50% reduction in manual errors\n\nYour competitors are already using AI. Can you afford to fall behind?`,

    "service-crm": `**CRM Implementation - $1,500-$8,000**\n\nLeads are falling through the cracks right now. A proper CRM changes that.\n\n✓ Platform selection & setup\n✓ Custom sales pipelines\n✓ Automation & integrations\n✓ Team training\n\nResults: 35% increase in close rates, 2x faster lead response.\n\nStop losing leads. Want to get started?`,

    "service-website": `**Website Development - $3,000-$20,000**\n\nYour website is your 24/7 salesperson. Make it work as hard as you do.\n\n✓ Conversion-focused design\n✓ Mobile-first & fast loading\n✓ SEO optimized\n✓ Easy content management\n\nResults: 3x more lead generation, <2s load times.\n\nReady for a website that actually converts?`,

    "service-marketing": `**Marketing Strategy - $1,500-$10,000/month**\n\nMarketing without strategy is just noise. Get a data-driven plan that works.\n\n✓ Market & competitive analysis\n✓ Multi-channel campaigns\n✓ ROI tracking & optimization\n\nResults: 300% average ROI, 50% lower CAC, 2x qualified leads.\n\nStop wasting ad spend. Want a real strategy?`,

    "service-strategy": `**Business Strategy Consulting - $2,000-$15,000**\n\n46+ years of experience applied to YOUR business.\n\n✓ Business plan development\n✓ Growth strategy planning\n✓ Competitive positioning\n✓ Financial modeling\n✓ Execution roadmap\n\nTory has built 100+ businesses. Learn from someone who's lived it.\n\nReady to build a real roadmap?`,

    "service-hr": `**HR Solutions - $800-$3,500/month**\n\nOne bad hire costs 2-3x their salary. Get hiring and HR right from day one.\n\n✓ Employee handbooks\n✓ Hiring & onboarding processes\n✓ Compliance management\n✓ Performance review systems\n\nResults: 50% reduction in turnover, 3x better hiring success.\n\nProtect your business and build a great team. Want to learn more?`,

    "service-it": `**IT Services - $1,000-$5,000/month**\n\nDowntime costs money every minute. Protect your business with proper IT.\n\n✓ Cybersecurity & threat protection\n✓ Cloud migration & services\n✓ 24/7 monitoring\n✓ Help desk support\n\nResults: 99.9% uptime, <1hr response to critical issues.\n\nOne cyber attack can shut you down. Are you protected?`,

    "service-social": `**Social Media Management - $1,200-$5,000/month**\n\nSocial media built Tory's brands before it was mainstream. Get real engagement, not vanity metrics.\n\n✓ Content creation & scheduling\n✓ Community management\n✓ Paid advertising campaigns\n\nResults: 3x engagement increase, 5x follower growth.\n\nStop posting into the void. Want results?`,

    "service-seo": `**SEO & Search Marketing - $1,000-$5,000/month**\n\nIf you're not on page 1, you don't exist. 75% of users never scroll past it.\n\n✓ Keyword research & strategy\n✓ On-page optimization\n✓ Link building\n✓ Local SEO\n\nResults: Page 1 rankings, 200% organic traffic increase, 40% lower cost per lead.\n\nReady to get found?`,

    "service-va": `**Virtual Assistant Services - $25-$75/hour**\n\nStop doing $15/hour tasks when your time is worth $100+/hour.\n\n✓ Admin support\n✓ Customer service\n✓ Research & projects\n✓ Data entry\n\nResults: Save 20+ hours weekly, 10x ROI.\n\nTory runs most businesses as an absentee owner using VAs. Let us help you do the same.`,

    "service-coaching": `**Business Coaching - $500-$2,500/month**\n\nEvery successful person has a coach. Why are you trying to figure it out alone?\n\n✓ Weekly coaching sessions\n✓ Goal setting & accountability\n✓ Problem-solving support\n✓ 24/7 email access\n\n46+ years of experience in your corner.\n\nResults: 2x faster goal achievement.\n\nReady for a mentor who's lived it?`,

    "service-content": `**Content Creation - $800-$3,500/month**\n\nWords that sell. Tory has written copy that moved millions in products.\n\n✓ Website copy that converts\n✓ SEO blog content\n✓ Email campaigns\n✓ Sales materials\n\nResults: 10x more organic traffic, 3x higher conversion rates.\n\nStop sounding like everyone else. Want copy that works?`,

    "service-analytics": `**Business Analytics - $1,500-$6,000/month**\n\nYou can't improve what you don't measure.\n\n✓ Custom dashboards\n✓ KPI tracking\n✓ Predictive analytics\n✓ Strategic insights\n\nResults: 360° business view, 50% faster decisions, ROI on every initiative.\n\nStop guessing. Start knowing.`,

    pricing: `Pricing varies by service and complexity:\n\n**Entry Services:**\n• EIN Filing: $160 one-time\n• Virtual Assistants: $25-$75/hour\n\n**Monthly Services:**\n• Bookkeeping: $300-$1,500/mo\n• Accounting: $500-$2,500/mo\n• Coaching: $500-$2,500/mo\n• Social Media: $1,200-$5,000/mo\n• Marketing: $1,500-$10,000/mo\n\n**Project-Based:**\n• Legal Services: $500-$5,000\n• CRM: $1,500-$8,000\n• Website: $3,000-$20,000\n• AI Solutions: $2,500-$15,000\n\n**Best First Step:**\n$1,000 Clarity Call - 90 minutes with Tory, walk away with a clear roadmap worth 10x the investment.\n\nMost services offer custom quotes. What are you interested in?`,

    "clarity-call": `**$1,000 Clarity Call - Your Best First Step**\n\n90-minute deep-dive session with Tory where you get:\n\n✓ Personalized roadmap for your business\n✓ Identify blind spots and hidden opportunities\n✓ Clear next steps and action plan\n✓ Worth $10,000+ in avoided mistakes\n\nThis is NOT a sales pitch. You walk away with actionable insights whether you hire us or not.\n\nThink of it as hiring Tory's brain for 90 minutes to solve your biggest challenges.\n\nReady to book your Clarity Call?`,

    differentiation: `**Why Tory is Different:**\n\n**Traditional Consultants:**\n✗ Teach from textbooks & theory\n✗ Never started a business themselves\n✗ Generic frameworks\n✗ Focus on billable hours\n\n**Tory R. Zweigle:**\n✓ Started 100+ businesses since age 11\n✓ 46+ years hands-on experience\n✓ Master of absentee ownership\n✓ Shares REAL failures & successes\n✓ Invested in YOUR success\n\nYou get advice from someone who's actually lived it—not just studied it in business school.\n\nReal experience beats theory every time.\n\nReady to work with someone who's been there?`,

    booking: `**Ready to Get Started?**\n\nHere are your next steps:\n\n1. **Book a $1,000 Clarity Call** - Best first step for strategic guidance\n2. **Explore Services** - Browse our full service catalog\n3. **Contact Our Team** - Get a custom quote for your needs\n\nWhat works best for you? I can connect you with Tory's team right away.`
  };

  return responses[intent] || responses.greeting;
}
