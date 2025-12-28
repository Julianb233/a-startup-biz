import { createClient } from "@supabase/supabase-js"

// Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey)
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Since we're using Clerk for auth
  },
})

// Server-side client with service role (for admin operations)
export const getServerSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return supabase // Fall back to anon client
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          clerk_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          clerk_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          clerk_id?: string | null
          updated_at?: string
        }
      }
      onboarding_submissions: {
        Row: {
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
          form_data: Record<string, unknown> | null
          status: "submitted" | "reviewed" | "in_progress" | "completed"
          source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          business_name: string
          business_type: string
          business_stage: string
          goals: string[]
          challenges: string[]
          contact_email: string
          contact_phone?: string | null
          timeline: string
          budget_range: string
          additional_info?: string | null
          form_data?: Record<string, unknown> | null
          status?: "submitted" | "reviewed" | "in_progress" | "completed"
          source?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string
          business_stage?: string
          goals?: string[]
          challenges?: string[]
          contact_email?: string
          contact_phone?: string | null
          timeline?: string
          budget_range?: string
          additional_info?: string | null
          form_data?: Record<string, unknown> | null
          status?: "submitted" | "reviewed" | "in_progress" | "completed"
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          email: string
          name: string
          phone: string | null
          service_type: string
          start_time: string
          end_time: string
          timezone: string
          status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
          notes: string | null
          calendar_event_id: string | null
          meeting_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          name: string
          phone?: string | null
          service_type: string
          start_time: string
          end_time: string
          timezone?: string
          status?: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
          notes?: string | null
        }
        Update: {
          status?: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
          notes?: string | null
          calendar_event_id?: string | null
          meeting_link?: string | null
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          user_id: string | null
          quote_number: string
          customer_email: string
          customer_name: string
          business_name: string
          quote_data: Record<string, unknown>
          status: "draft" | "sent" | "accepted" | "rejected" | "expired"
          subtotal: number
          tax_amount: number
          discount_amount: number
          total: number
          issue_date: string
          expiry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          quote_number?: string
          customer_email: string
          customer_name: string
          business_name: string
          quote_data: Record<string, unknown>
          status?: "draft" | "sent" | "accepted" | "rejected" | "expired"
          subtotal: number
          tax_amount?: number
          discount_amount?: number
          total: number
          issue_date?: string
          expiry_date?: string
        }
        Update: {
          customer_email?: string
          customer_name?: string
          quote_data?: Record<string, unknown>
          status?: "draft" | "sent" | "accepted" | "rejected" | "expired"
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total?: number
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_email: string
          status: "pending" | "signed_up" | "converted" | "paid"
          commission_amount: number | null
          conversion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_email: string
          status?: "pending" | "signed_up" | "converted" | "paid"
          commission_amount?: number | null
        }
        Update: {
          status?: "pending" | "signed_up" | "converted" | "paid"
          commission_amount?: number | null
          conversion_date?: string | null
        }
      }
    }
  }
}

// Typed Supabase client
export const db = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})
