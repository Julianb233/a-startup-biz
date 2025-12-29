/**
 * Partner Portal TypeScript Types
 */

export type LeadStatus = 'pending' | 'contacted' | 'qualified' | 'converted' | 'lost'

export interface Lead {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string | null
  service: string
  status: LeadStatus
  commission: number
  commissionPaid?: boolean
  createdAt: string
  convertedAt?: string | null
}

export interface LeadsResponse {
  leads: Lead[]
  total: number
  limit: number
  offset: number
}

export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'inactive'
export type PartnerRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export interface Partner {
  id: string
  userId: string
  companyName: string
  status: PartnerStatus
  commissionRate: number
  rank: PartnerRank
  totalReferrals: number
  totalEarnings: number
  memberSince: string
}

export interface DashboardStats {
  totalLeads: number
  activeLeads: number
  pendingLeads: number
  contactedLeads: number
  qualifiedLeads: number
  convertedLeads: number
  lostLeads: number
  conversionRate: number
  totalEarnings: number
  pendingCommission: number
  paidCommission: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  earningsGrowth: number
  averageCommission: number
  nextPayoutDate: string
  payoutSchedule: string
}

export interface DashboardResponse {
  partner: Partner
  stats: DashboardStats
  recentLeads: Lead[]
  canAccessDashboard: boolean
  message?: string
}

export interface CommissionData {
  totalEarned: number
  pendingCommission: number
  paidCommission: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  averageCommission: number
  payoutSchedule: string
  nextPayoutDate: string
  commissionRate: number
}

export interface PartnerProfile {
  id: string
  userId: string
  companyName: string
  status: PartnerStatus
  commissionRate: number
  rank: PartnerRank
  memberSince: string
  paymentEmail?: string | null
  paymentMethod?: string | null
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  website?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string
  notificationsEnabled: boolean
  emailNotifications: boolean
  monthlyReports: boolean
}

export interface ProfileResponse {
  profile: PartnerProfile
}

export interface UpdateProfileRequest {
  paymentEmail?: string
  paymentMethod?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  notificationsEnabled?: boolean
  emailNotifications?: boolean
  monthlyReports?: boolean
}
