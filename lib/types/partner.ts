/**
 * Partner Portal Type Definitions
 *
 * Comprehensive TypeScript types for the partner portal backend APIs
 * Ensures type safety across all partner-related operations
 */

// ============================================
// CORE ENTITY TYPES
// ============================================

/**
 * Partner status enumeration
 */
export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'inactive'

/**
 * Partner rank/tier
 */
export type PartnerRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

/**
 * Lead status in the partner pipeline
 */
export type LeadStatus = 'pending' | 'contacted' | 'qualified' | 'converted' | 'lost'

/**
 * Payment methods for partner payouts
 */
export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer'

// ============================================
// DATABASE MODELS
// ============================================

/**
 * Partner database model
 */
export interface Partner {
  id: string
  user_id: string
  company_name: string
  status: PartnerStatus
  commission_rate: number
  total_referrals: number
  total_earnings: number
  paid_earnings: number
  pending_earnings: number
  rank: PartnerRank | null
  created_at: Date
  updated_at: Date
}

/**
 * Partner Lead database model
 */
export interface PartnerLead {
  id: string
  partner_id: string
  client_name: string
  client_email: string
  client_phone: string | null
  service: string
  status: LeadStatus
  commission: number
  commission_paid: boolean
  notes: string | null
  created_at: Date
  converted_at: Date | null
  updated_at: Date
}

/**
 * Partner Profile (extended settings) database model
 */
export interface PartnerProfile {
  id: string
  partner_id: string

  // Payment Information
  payment_email: string | null
  payment_method: PaymentMethod | null
  bank_account_last4: string | null
  tax_id: string | null

  // Contact Information
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  website: string | null

  // Address
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string

  // Preferences
  notifications_enabled: boolean
  email_notifications: boolean
  monthly_reports: boolean

  created_at: Date
  updated_at: Date
}

// ============================================
// API REQUEST TYPES
// ============================================

/**
 * Request to create a new partner lead
 */
export interface CreateLeadRequest {
  clientName: string
  clientEmail: string
  clientPhone?: string
  service: string
  commission: number
}

/**
 * Request to update lead status
 */
export interface UpdateLeadStatusRequest {
  status: LeadStatus
}

/**
 * Request to update partner profile
 */
export interface UpdatePartnerProfileRequest {
  // Payment Information
  paymentEmail?: string
  paymentMethod?: PaymentMethod
  bankAccountLast4?: string
  taxId?: string

  // Contact Information
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  website?: string

  // Address
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string

  // Preferences
  notificationsEnabled?: boolean
  emailNotifications?: boolean
  monthlyReports?: boolean
}

/**
 * Query parameters for fetching leads
 */
export interface GetLeadsParams {
  status?: LeadStatus
  limit?: number
  offset?: number
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Partner dashboard response
 */
export interface DashboardResponse {
  partner: {
    id: string
    userId: string
    companyName: string
    status: PartnerStatus
    commissionRate: number
    rank: PartnerRank
    totalReferrals: number
    totalEarnings: number
    memberSince: Date
  }
  stats: {
    // Lead metrics
    totalLeads: number
    activeLeads: number
    pendingLeads: number
    contactedLeads: number
    qualifiedLeads: number
    convertedLeads: number
    lostLeads: number
    conversionRate: number

    // Financial metrics
    totalEarnings: number
    pendingCommission: number
    paidCommission: number
    thisMonthEarnings: number
    lastMonthEarnings: number
    earningsGrowth: number
    averageCommission: number

    // Payout information
    nextPayoutDate: Date
    payoutSchedule: string
  }
  recentLeads: LeadSummary[]
  canAccessDashboard: boolean
}

/**
 * Lead summary for dashboard display
 */
export interface LeadSummary {
  id: string
  clientName: string
  clientEmail: string
  service: string
  status: LeadStatus
  commission: number
  createdAt: Date
  convertedAt: Date | null
}

/**
 * Detailed lead response
 */
export interface LeadDetailResponse {
  lead: {
    id: string
    clientName: string
    clientEmail: string
    clientPhone: string | null
    service: string
    status: LeadStatus
    commission: number
    commissionPaid: boolean
    createdAt: Date
    convertedAt: Date | null
  }
}

/**
 * Leads list response
 */
export interface LeadsListResponse {
  leads: LeadDetailResponse['lead'][]
  total: number
  limit: number
  offset: number
}

/**
 * Commission data response
 */
export interface CommissionsResponse {
  totalEarned: number
  pendingCommission: number
  paidCommission: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  averageCommission: number
  payoutSchedule: string
  nextPayoutDate: Date
  commissionRate: number
}

/**
 * Partner profile response
 */
export interface ProfileResponse {
  profile: {
    // Basic information
    id: string
    userId: string
    companyName: string
    status: PartnerStatus
    commissionRate: number
    rank: PartnerRank
    memberSince: Date

    // Payment information
    paymentEmail: string | null
    paymentMethod: PaymentMethod | null
    bankAccountLast4: string | null
    taxId: string | null

    // Contact information
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    website: string | null

    // Address
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string

    // Notification preferences
    notificationsEnabled: boolean
    emailNotifications: boolean
    monthlyReports: boolean
  }
}

// ============================================
// STATISTICS TYPES
// ============================================

/**
 * Partner statistics from database queries
 */
export interface PartnerStats {
  partner: Partner | null
  leads: {
    total: number
    pending: number
    contacted: number
    qualified: number
    converted: number
    lost: number
  }
  earnings: {
    total_commission: number
    paid_commission: number
    pending_commission: number
    this_month_earnings: number
    last_month_earnings: number
  }
}

/**
 * Commission breakdown statistics
 */
export interface CommissionStats {
  total_earned: number
  pending_commission: number
  paid_commission: number
  this_month_earnings: number
  last_month_earnings: number
  average_commission: number
}

// ============================================
// ERROR RESPONSE TYPES
// ============================================

/**
 * Standard API error response
 */
export interface ErrorResponse {
  error: string
  message?: string
}

/**
 * Partner not found error (specific)
 */
export interface PartnerNotFoundError extends ErrorResponse {
  canAccessDashboard: false
}

/**
 * Partner inactive error (specific)
 */
export interface PartnerInactiveError extends ErrorResponse {
  partner: {
    id: string
    status: PartnerStatus
    companyName: string
  }
  canAccessDashboard: false
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

/**
 * Date range filter
 */
export interface DateRangeFilter {
  startDate?: Date
  endDate?: Date
}

/**
 * Sort options
 */
export interface SortOptions {
  field: 'created_at' | 'status' | 'commission' | 'client_name'
  direction: 'asc' | 'desc'
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Type guard for valid partner status
 */
export function isValidPartnerStatus(status: string): status is PartnerStatus {
  return ['pending', 'active', 'suspended', 'inactive'].includes(status)
}

/**
 * Type guard for valid lead status
 */
export function isValidLeadStatus(status: string): status is LeadStatus {
  return ['pending', 'contacted', 'qualified', 'converted', 'lost'].includes(status)
}

/**
 * Type guard for valid payment method
 */
export function isValidPaymentMethod(method: string): method is PaymentMethod {
  return ['stripe', 'paypal', 'bank_transfer'].includes(method)
}
