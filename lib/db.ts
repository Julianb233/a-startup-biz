import { neon } from "@neondatabase/serverless"

// Create a SQL client for querying the database
export const sql = neon(process.env.DATABASE_URL!)

// Helper function for type-safe queries
export async function query<T>(queryString: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
  return sql(queryString, ...values) as Promise<T[]>
}

// Database types
export interface User {
  id: string
  email: string
  name: string | null
  created_at: Date
  updated_at: Date
}

export interface Consultation {
  id: string
  user_id: string
  service_type: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  scheduled_at: Date | null
  notes: string | null
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: string
  user_id: string
  items: string // JSON string of cart items
  total: number
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'refunded'
  payment_intent_id: string | null
  created_at: Date
  updated_at: Date
}

export interface OnboardingSubmission {
  id: string
  user_id: string | null
  business_name: string
  business_type: string
  business_stage: string
  goals: string[]
  challenges: string[]
  contact_email: string
  contact_phone: string | null
  timeline: string
  budget_range: string
  additional_info: string | null
  form_data: Record<string, any> | null
  status: 'submitted' | 'reviewed' | 'in_progress' | 'completed'
  source: string | null
  ip_address: string | null
  user_agent: string | null
  referral_code: string | null
  completion_percentage: number
  created_at: Date
  updated_at: Date
}

export interface Quote {
  id: string
  user_id: string | null
  onboarding_submission_id: string | null
  quote_number: string
  customer_email: string
  customer_name: string
  business_name: string
  quote_data: Record<string, any>
  pdf_url: string | null
  pdf_storage_path: string | null
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  subtotal: number
  tax_amount: number
  discount_amount: number
  total: number
  issue_date: Date
  expiry_date: Date
  sent_at: Date | null
  accepted_at: Date | null
  rejected_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface QuoteLineItem {
  id: string
  quote_id: string
  description: string
  category: string | null
  quantity: number
  unit_price: number
  total: number
  notes: string | null
  sort_order: number
  created_at: Date
}

export interface QuoteActivity {
  id: string
  quote_id: string
  activity_type: string
  description: string | null
  performed_by: string | null
  metadata: Record<string, any> | null
  created_at: Date
}

// Calendar Booking types
export interface CalendarBooking {
  id: string
  user_id: string
  email: string
  name: string
  phone: string | null
  service_type: string
  start_time: Date
  end_time: Date
  timezone: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  notes: string | null
  calendar_event_id: string | null
  meeting_link: string | null
  reminder_sent: boolean
  notification_type: 'email' | 'sms' | 'both'
  metadata: Record<string, any> | null
  created_at: Date
  updated_at: Date
  cancelled_at: Date | null
  cancellation_reason: string | null
}

export interface AvailabilityConfigDb {
  id: string
  user_id: string | null
  working_hours: Record<string, any>
  slot_duration: number
  buffer_time: number
  min_advance_notice: number
  max_advance_days: number
  timezone: string
  excluded_dates: string[]
  excluded_time_ranges: Record<string, any>[]
  created_at: Date
  updated_at: Date
}
