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
  status: 'submitted' | 'reviewed' | 'in_progress' | 'completed'
  created_at: Date
  updated_at: Date
}
