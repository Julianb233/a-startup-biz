export interface Resource {
  id: string
  title: string
  description: string
  category: "Business Templates" | "Legal Documents" | "Financial Tools" | "Marketing Guides"
  type: "PDF" | "DOC" | "XLS" | "DOCX" | "XLSX"
  premium: boolean
  downloadUrl: string
  fileSize?: string
  lastUpdated?: string
}

export const resources: Resource[] = [
  // Business Templates
  {
    id: "bus-001",
    title: "One-Page Business Plan Template",
    description: "A comprehensive one-page template to outline your entire business strategy, perfect for pitching to investors or keeping your team aligned.",
    category: "Business Templates",
    type: "DOCX",
    premium: false,
    downloadUrl: "/resources/one-page-business-plan.docx",
    fileSize: "125 KB",
    lastUpdated: "2024-01-15"
  },
  {
    id: "bus-002",
    title: "Startup Pitch Deck Template",
    description: "Professional PowerPoint template with 15+ slides designed to help you secure funding. Includes investor-ready slides for problem, solution, market size, and financials.",
    category: "Business Templates",
    type: "PDF",
    premium: true,
    downloadUrl: "/resources/startup-pitch-deck.pdf",
    fileSize: "2.3 MB",
    lastUpdated: "2024-02-01"
  },
  {
    id: "bus-003",
    title: "SWOT Analysis Worksheet",
    description: "Strategic planning tool to evaluate your business's Strengths, Weaknesses, Opportunities, and Threats with guided prompts.",
    category: "Business Templates",
    type: "PDF",
    premium: false,
    downloadUrl: "/resources/swot-analysis.pdf",
    fileSize: "87 KB",
    lastUpdated: "2023-11-20"
  },

  // Legal Documents
  {
    id: "leg-001",
    title: "Founder Agreement Template",
    description: "Essential legal document for co-founders to define equity split, roles, responsibilities, and vesting schedules. Attorney-reviewed.",
    category: "Legal Documents",
    type: "DOCX",
    premium: true,
    downloadUrl: "/resources/founder-agreement.docx",
    fileSize: "245 KB",
    lastUpdated: "2024-01-10"
  },
  {
    id: "leg-002",
    title: "NDA Template (One-Way & Mutual)",
    description: "Non-disclosure agreement templates for protecting confidential information in business discussions. Includes both one-way and mutual versions.",
    category: "Legal Documents",
    type: "PDF",
    premium: false,
    downloadUrl: "/resources/nda-template.pdf",
    fileSize: "156 KB",
    lastUpdated: "2023-12-05"
  },

  // Financial Tools
  {
    id: "fin-001",
    title: "3-Year Financial Projection Model",
    description: "Excel spreadsheet with pre-built formulas for revenue forecasting, expense tracking, and cash flow projections. Includes scenario planning.",
    category: "Financial Tools",
    type: "XLSX",
    premium: true,
    downloadUrl: "/resources/financial-projection-model.xlsx",
    fileSize: "1.8 MB",
    lastUpdated: "2024-02-10"
  },
  {
    id: "fin-002",
    title: "Startup Budget Calculator",
    description: "Simple Excel calculator to estimate your startup costs across categories like legal, marketing, operations, and technology.",
    category: "Financial Tools",
    type: "XLSX",
    premium: false,
    downloadUrl: "/resources/startup-budget-calculator.xlsx",
    fileSize: "342 KB",
    lastUpdated: "2024-01-05"
  },
  {
    id: "fin-003",
    title: "Burn Rate & Runway Tracker",
    description: "Monitor your monthly cash burn and calculate how long your funding will last. Essential for managing investor updates.",
    category: "Financial Tools",
    type: "XLSX",
    premium: false,
    downloadUrl: "/resources/burn-rate-tracker.xlsx",
    fileSize: "198 KB",
    lastUpdated: "2023-12-15"
  },

  // Marketing Guides
  {
    id: "mkt-001",
    title: "Go-to-Market Strategy Playbook",
    description: "60-page comprehensive guide covering customer acquisition, positioning, pricing strategy, and launch tactics for B2B and B2C startups.",
    category: "Marketing Guides",
    type: "PDF",
    premium: true,
    downloadUrl: "/resources/gtm-strategy-playbook.pdf",
    fileSize: "4.2 MB",
    lastUpdated: "2024-01-25"
  },
  {
    id: "mkt-002",
    title: "Social Media Content Calendar",
    description: "Pre-planned 90-day content calendar template with post ideas, hashtag suggestions, and engagement tactics for LinkedIn, Twitter, and Instagram.",
    category: "Marketing Guides",
    type: "XLSX",
    premium: false,
    downloadUrl: "/resources/social-media-calendar.xlsx",
    fileSize: "425 KB",
    lastUpdated: "2024-02-05"
  }
]

export function getResourcesByCategory(category: Resource["category"]): Resource[] {
  return resources.filter(resource => resource.category === category)
}

export function getFreeResources(): Resource[] {
  return resources.filter(resource => !resource.premium)
}

export function getPremiumResources(): Resource[] {
  return resources.filter(resource => resource.premium)
}

export function getResourceById(id: string): Resource | undefined {
  return resources.find(resource => resource.id === id)
}

export const categories: Array<{
  name: Resource["category"]
  description: string
  icon: string
}> = [
  {
    name: "Business Templates",
    description: "Ready-to-use templates for business planning and operations",
    icon: "FileText"
  },
  {
    name: "Legal Documents",
    description: "Attorney-reviewed legal templates and agreements",
    icon: "Scale"
  },
  {
    name: "Financial Tools",
    description: "Spreadsheets and calculators for financial planning",
    icon: "Calculator"
  },
  {
    name: "Marketing Guides",
    description: "Strategies and templates for marketing your business",
    icon: "TrendingUp"
  }
]
