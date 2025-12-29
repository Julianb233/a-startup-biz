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
 * Note: These are fallback responses when the AI API is unavailable.
 * Keep them warm, conversational, and free of Markdown formatting.
 */
export function generateResponse(intent: string | null, userMessage: string): string {
  if (!intent) {
    return "I'd love to help! I can tell you about Tory's background, our services, pricing, or help you book a Clarity Call. You can also connect with our team for specific questions. What would be most helpful?";
  }

  const responses: Record<string, string> = {
    greeting: "Hey there! I'm the Startup Biz Butler, here to help you learn about Tory's services and how we can help your business grow.\n\nTory is a serial entrepreneur with 46+ years of experience who's started over 100 businesses. He's not a consultant - he's actually lived it.\n\nWhat brings you here today?",

    about: "Tory R. Zweigle is quite the story! He's a serial entrepreneur who's built over 100 businesses since he was 11 years old. With 46+ years of real-world experience, he's mastered everything from startup launches to absentee ownership.\n\nWhat makes Tory different? He's not teaching from textbooks - he's sharing lessons from 100+ businesses he actually built. He's been through the failures and the successes. He's a master of absentee ownership, which is basically the holy grail of running a business.\n\nHe's not a traditional consultant. He teaches from experience, not theory. Want to learn about specific services or book a call with him?",

    services: "Tory's team offers 17 comprehensive services to help your business succeed. Let me break it down for you.\n\nFor getting started, we have EIN Filing at $160 and Legal Services from $500 to $5,000.\n\nOn the financial side, there's Accounting from $500 to $2,500 per month and Bookkeeping from $300 to $1,500 per month.\n\nFor technology, we offer AI and Automation from $2,500 to $15,000, CRM Implementation from $1,500 to $8,000, Website Development from $3,000 to $20,000, and IT Services from $1,000 to $5,000 per month.\n\nMarketing services include Strategy from $1,500 to $10,000 per month, Social Media from $1,200 to $5,000 per month, SEO from $1,000 to $5,000 per month, and Content Creation from $800 to $3,500 per month.\n\nFor growth and operations, there's Business Strategy from $2,000 to $15,000, Business Coaching from $500 to $2,500 per month, HR Solutions from $800 to $3,500 per month, Virtual Assistants from $25 to $75 per hour, and Business Analytics from $1,500 to $6,000 per month.\n\nWhat area interests you most?",

    "service-ein": "Great question about EIN filing! It's one of our most popular services at just $160.\n\nHere's the deal - we submit your application the same day you sign up, and you'll have your EIN in 24 to 48 hours. Tory has filed EINs for over 100 of his own businesses, so we know exactly how to do this right. We've never had one rejected.\n\nYou'll need an EIN for opening a business bank account, hiring employees, and building business credit. It's basically your business's social security number.\n\nWant to get started, or can I tell you about any other services?",

    "service-legal": "Legal services are so important - and often overlooked until it's too late. Our services range from $500 to $5,000 depending on what you need.\n\nWe handle entity formation (LLCs, Corporations, Partnerships), operating agreements and bylaws, contract drafting and review, trademark and IP protection, and ongoing compliance support.\n\nTory has structured over 100 businesses, so he knows exactly what can go wrong if you don't have the right foundation. One bad contract or wrong structure can cost you everything.\n\nReady to protect your business?",

    "service-accounting": "Accounting is one of those things where most businesses are leaving money on the table without even knowing it. Our services run from $500 to $2,500 per month.\n\nWe provide monthly financial statements, tax preparation and planning, CFO-level advisory, and we find deductions you're probably missing. Most businesses overpay taxes by 20 to 40 percent due to poor planning.\n\nOur average client saves $15,000 to $50,000 annually in taxes. That's real money back in your pocket.\n\nStop flying blind with your finances. Want to learn more?",

    "service-ai": "AI and automation is where things get exciting. Our solutions range from $2,500 to $15,000.\n\nTory has automated operations across dozens of his companies, so we know what works. We build AI chatbots for 24/7 customer service, workflow automation, and custom AI tools.\n\nThe results speak for themselves - clients typically save 20+ hours per week, get 3x faster customer response times, and see a 50% reduction in manual errors.\n\nYour competitors are already using AI. Can you afford to fall behind?",

    "service-crm": "CRM implementation is a game-changer. Our services range from $1,500 to $8,000.\n\nHere's the thing - leads are falling through the cracks right now. You just don't know it yet. A proper CRM changes that completely.\n\nWe help with platform selection and setup, custom sales pipelines, automation and integrations, and team training. Our clients see a 35% increase in close rates and 2x faster lead response times.\n\nStop losing leads. Want to get started?",

    "service-website": "Website development runs from $3,000 to $20,000 depending on complexity.\n\nThink of your website as your 24/7 salesperson. It should work as hard as you do. We build conversion-focused designs that are mobile-first, fast loading, SEO optimized, and easy to manage.\n\nOur clients typically see 3x more lead generation and load times under 2 seconds. That matters because every second of delay costs you conversions.\n\nReady for a website that actually converts?",

    "service-marketing": "Marketing strategy services run from $1,500 to $10,000 per month.\n\nHere's the truth - marketing without strategy is just noise. You need a data-driven plan that actually works.\n\nWe provide market and competitive analysis, multi-channel campaigns, and ROI tracking and optimization. Our clients see 300% average ROI, 50% lower customer acquisition costs, and 2x more qualified leads.\n\nStop wasting ad spend. Want a real strategy?",

    "service-strategy": "Business strategy consulting ranges from $2,000 to $15,000.\n\nThis is where Tory's 46+ years of experience really shines. We help with business plan development, growth strategy planning, competitive positioning, financial modeling, and execution roadmaps.\n\nTory has built over 100 businesses. You're learning from someone who's actually lived it, not just read about it in a textbook.\n\nReady to build a real roadmap for your business?",

    "service-hr": "HR solutions run from $800 to $3,500 per month.\n\nHere's something most people don't realize - one bad hire costs 2 to 3 times their salary. Getting hiring and HR right from day one saves you a fortune.\n\nWe provide employee handbooks, hiring and onboarding processes, compliance management, and performance review systems. Our clients see 50% reduction in turnover and 3x better hiring success.\n\nProtect your business and build a great team. Want to learn more?",

    "service-it": "IT services range from $1,000 to $5,000 per month.\n\nDowntime costs money every minute. And one cyber attack can shut you down completely. We handle cybersecurity and threat protection, cloud migration, 24/7 monitoring, and help desk support.\n\nOur clients get 99.9% uptime and under 1 hour response to critical issues. Are you protected?",

    "service-social": "Social media management runs from $1,200 to $5,000 per month.\n\nTory was building brands on social media before it was mainstream. We focus on real engagement, not vanity metrics. That means content creation and scheduling, community management, and paid advertising campaigns.\n\nOur clients see 3x engagement increase and 5x follower growth. Stop posting into the void. Want results?",

    "service-seo": "SEO services range from $1,000 to $5,000 per month.\n\nHere's the reality - if you're not on page 1 of Google, you basically don't exist. 75% of users never scroll past the first page. We handle keyword research and strategy, on-page optimization, link building, and local SEO.\n\nOur clients get page 1 rankings, 200% organic traffic increase, and 40% lower cost per lead. Ready to get found?",

    "service-va": "Virtual assistant services run from $25 to $75 per hour.\n\nHere's a question for you - why are you doing $15 per hour tasks when your time is worth $100 or more per hour? Our VAs handle admin support, customer service, research and projects, and data entry.\n\nClients save 20+ hours weekly with a 10x ROI. Tory runs most of his businesses as an absentee owner using VAs. Let us help you do the same.",

    "service-coaching": "Business coaching runs from $500 to $2,500 per month.\n\nEvery successful person has a coach. So why are you trying to figure it all out alone? You get weekly coaching sessions, goal setting and accountability, problem-solving support, and 24/7 email access to Tory.\n\nThat's 46+ years of experience in your corner. Our clients achieve their goals 2x faster. Ready for a mentor who's actually lived it?",

    "service-content": "Content creation services range from $800 to $3,500 per month.\n\nWords matter. Tory has written copy that moved millions in products. We create website copy that converts, SEO blog content, email campaigns, and sales materials.\n\nOur clients see 10x more organic traffic and 3x higher conversion rates. Stop sounding like everyone else. Want copy that actually works?",

    "service-analytics": "Business analytics runs from $1,500 to $6,000 per month.\n\nHere's the thing - you can't improve what you don't measure. We build custom dashboards, KPI tracking, predictive analytics, and provide strategic insights.\n\nOur clients get a 360-degree view of their business, make decisions 50% faster, and track ROI on every initiative. Stop guessing. Start knowing.",

    pricing: "Great question about pricing. It varies by service and complexity, so let me give you an overview.\n\nFor entry-level services, EIN Filing is $160 one-time and Virtual Assistants run $25 to $75 per hour.\n\nMonthly services include Bookkeeping from $300 to $1,500, Accounting from $500 to $2,500, Coaching from $500 to $2,500, Social Media from $1,200 to $5,000, and Marketing from $1,500 to $10,000.\n\nProject-based services include Legal from $500 to $5,000, CRM from $1,500 to $8,000, Website from $3,000 to $20,000, and AI Solutions from $2,500 to $15,000.\n\nThe best first step? The $1,000 Clarity Call. It's 90 minutes with Tory where you walk away with a clear roadmap worth 10x the investment.\n\nMost services offer custom quotes. What are you interested in?",

    "clarity-call": "The $1,000 Clarity Call is honestly the best first step for most people.\n\nHere's what you get: a 90-minute deep-dive session with Tory where he creates a personalized roadmap for your business. He'll identify blind spots and hidden opportunities you didn't even know existed, and you'll walk away with clear next steps and an action plan.\n\nThis is worth $10,000 or more in avoided mistakes. And here's the important part - this is NOT a sales pitch. You walk away with actionable insights whether you hire us for anything else or not.\n\nThink of it as hiring Tory's brain for 90 minutes to solve your biggest challenges. Ready to book your Clarity Call?",

    differentiation: "Great question - let me tell you what makes Tory different.\n\nTraditional consultants teach from textbooks and theory. They've often never started a business themselves. They use generic frameworks and focus on billable hours.\n\nTory? He started his first business at age 11. He's built over 100 businesses in 46+ years. He's a master of absentee ownership. And he shares real lessons from real failures and successes.\n\nWhen you work with Tory, you're getting advice from someone who's actually lived it - not just studied it in business school. Real experience beats theory every time.\n\nReady to work with someone who's been there?",

    booking: "Ready to get started? Here are your options.\n\nFirst, you could book a $1,000 Clarity Call - that's the best first step for strategic guidance. You'll get 90 minutes with Tory and walk away with a clear roadmap.\n\nSecond, you could explore our services on the website to see what fits your needs.\n\nThird, you could contact our team directly for a custom quote.\n\nWhat works best for you? I can help connect you with Tory's team right away."
  };

  return responses[intent] || responses.greeting;
}
