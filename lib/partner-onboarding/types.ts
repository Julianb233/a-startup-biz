// Partner Onboarding System Types

export type OnboardingStep =
  | 'pending_approval'
  | 'sign_agreements'
  | 'payment_details'
  | 'completed'

export type AgreementType =
  | 'partner_agreement'
  | 'nda'
  | 'commission_structure'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'lost'

export type DeviceType =
  | 'mobile'
  | 'tablet'
  | 'desktop'

export type AccountHolderType =
  | 'individual'
  | 'business'

export type AccountType =
  | 'checking'
  | 'savings'

// Microsite Types
export interface MicrositeImage {
  url: string
  alt: string
  position: number
}

export interface Microsite {
  id: string
  partnerId: string
  slug: string
  companyName: string
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  heroHeadline: string | null
  heroSubheadline: string | null
  description: string | null
  sourceWebsite: string | null
  images: MicrositeImage[]
  templateId: string
  customCss: string | null
  isActive: boolean
  formTitle: string
  formSubtitle: string
  formFields: string[]
  formButtonText: string
  successMessage: string
  metaTitle: string | null
  metaDescription: string | null
  pageViews: number
  leadSubmissions: number
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  lastScrapedAt: Date | null
}

export interface MicrositeCreateInput {
  partnerId: string
  companyName: string
  slug?: string
  websiteUrl?: string
  logoUrl?: string
  primaryColor?: string
  heroHeadline?: string
  heroSubheadline?: string
  description?: string
  images?: MicrositeImage[]
}

// Agreement Types
export interface Agreement {
  id: string
  agreementType: AgreementType
  title: string
  version: string
  content: string
  summary: string | null
  isActive: boolean
  isRequired: boolean
  sortOrder: number
  effectiveDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface AgreementWithStatus extends Agreement {
  isSigned: boolean
  signedAt: Date | null
  acceptanceId: string | null
}

export interface AgreementAcceptance {
  id: string
  partnerId: string
  agreementId: string
  acceptedAt: Date
  acceptedByUserId: string | null
  acceptedByName: string | null
  acceptedByEmail: string | null
  ipAddress: string | null
  userAgent: string | null
  agreementVersion: string
  agreementContentHash: string | null
  signatureText: string
}

export interface AcceptAgreementInput {
  partnerId: string
  agreementId: string
  userId: string
  userName: string
  userEmail: string
  signatureText: string
  ipAddress: string | null
  userAgent: string | null
}

// Lead Types
export interface MicrositeLead {
  id: string
  micrositeId: string
  partnerId: string
  name: string
  email: string
  phone: string | null
  companyName: string | null
  message: string | null
  serviceInterest: string | null
  customFields: Record<string, unknown>
  status: LeadStatus
  notes: string | null
  convertedToPartnerLeadId: string | null
  commissionEligible: boolean
  sourceUrl: string | null
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  ipAddress: string | null
  userAgent: string | null
  deviceType: DeviceType | null
  createdAt: Date
  updatedAt: Date
  contactedAt: Date | null
  convertedAt: Date | null
}

export interface LeadSubmissionInput {
  micrositeId: string
  partnerId: string
  name: string
  email: string
  phone?: string
  companyName?: string
  message?: string
  serviceInterest?: string
  customFields?: Record<string, unknown>
  sourceUrl?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  ipAddress?: string
  userAgent?: string
  deviceType?: DeviceType
}

// Bank Details Types
export interface BankDetails {
  id: string
  partnerId: string
  accountHolderName: string
  accountHolderType: AccountHolderType
  bankName: string | null
  accountNumberLast4: string | null
  accountType: AccountType
  isVerified: boolean
  verificationStatus: 'pending' | 'verified' | 'failed'
  verificationNotes: string | null
  createdAt: Date
  updatedAt: Date
  verifiedAt: Date | null
}

export interface BankDetailsInput {
  partnerId: string
  accountHolderName: string
  accountHolderType?: AccountHolderType
  bankName?: string
  routingNumber: string
  accountNumber: string
  accountType?: AccountType
}

// Scraper Types
export interface ScrapedWebsiteData {
  logoUrl: string | null
  images: MicrositeImage[]
  primaryColor: string | null
  secondaryColor: string | null
  companyName: string | null
  description: string | null
  favicon: string | null
}

// Approval Types
export interface ApprovalOptions {
  commissionRate?: number
  skipMicrosite?: boolean
  customSlug?: string
  websiteUrl?: string
}

export interface ApprovalResult {
  success: boolean
  partner: {
    id: string
    companyName: string
    status: string
  }
  microsite?: {
    id: string
    slug: string
    url: string
  }
  emailSent: boolean
  message: string
}

// Email Log Types
export interface PartnerEmailLog {
  id: string
  partnerId: string
  emailType: string
  recipientEmail: string
  subject: string
  templateId: string | null
  templateData: Record<string, unknown> | null
  status: string
  resendMessageId: string | null
  errorMessage: string | null
  retryCount: number
  createdAt: Date
  sentAt: Date
  deliveredAt: Date | null
  openedAt: Date | null
  clickedAt: Date | null
}

// Onboarding Status Types
export interface OnboardingStatus {
  step: OnboardingStep
  isApproved: boolean
  approvedAt: Date | null
  hasMicrosite: boolean
  micrositeUrl: string | null
  agreementsTotal: number
  agreementsSigned: number
  agreementsCompleted: boolean
  agreementsCompletedAt: Date | null
  paymentDetailsSubmitted: boolean
  isFullyOnboarded: boolean
}
