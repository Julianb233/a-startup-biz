import { sql } from "./db"
import type { CallParticipant, CallStatus, CallType, VoiceCall } from "@/types/voice"

// Re-export sql for use in API routes
export { sql }
export type { CallParticipant, VoiceCall }

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Document {
  id: string
  user_id: string | null
  order_id: string | null
  name: string
  type: 'deliverable' | 'form' | 'contract' | 'invoice'
  url: string | null
  file_size: number | null
  mime_type: string | null
  status: 'pending' | 'ready' | 'viewed' | 'downloaded'
  created_at: Date
  updated_at: Date
}

export interface ServiceProgress {
  id: string
  order_id: string
  milestone: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  sort_order: number
  completed_at: Date | null
  created_at: Date
}

export interface ActionItem {
  id: string
  user_id: string
  order_id: string | null
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: Date | null
  completed: boolean
  completed_at: Date | null
  created_at: Date
}

export interface Referral {
  id: string
  referrer_id: string | null
  referred_email: string
  referred_user_id: string | null
  status: 'pending' | 'signed_up' | 'converted' | 'paid'
  source: string | null
  commission_rate: number
  commission_amount: number | null
  commission_paid: boolean
  commission_paid_at: Date | null
  converted_at: Date | null
  created_at: Date
}

export interface ReferralLink {
  id: string
  user_id: string
  code: string
  clicks: number
  active: boolean
  created_at: Date
}

export interface FulfillmentTask {
  id: string
  order_id: string
  type: 'website' | 'crm' | 'seo' | 'content' | 'branding'
  status: 'queued' | 'in_progress' | 'completed' | 'blocked'
  assignee: string | null
  blockers: string[] | null
  automatable: boolean
  notes: string | null
  started_at: Date | null
  completed_at: Date | null
  created_at: Date
}

export interface AdminNote {
  id: string
  entity_type: 'user' | 'order' | 'consultation' | 'referral'
  entity_id: string
  author_id: string | null
  content: string
  created_at: Date
}

export interface Order {
  id: string
  user_id: string | null
  items: any
  subtotal: number
  discount: number
  total: number
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'refunded'
  payment_intent_id: string | null
  payment_method: string | null
  created_at: Date
  updated_at: Date
}

export interface Consultation {
  id: string
  user_id: string | null
  service_type: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  scheduled_at: Date | null
  notes: string | null
  created_at: Date
  updated_at: Date
}

export interface User {
  id: string
  email: string
  name: string | null
  password_hash: string | null
  role: string
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
  timeline: string | null
  budget_range: string | null
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

// ============================================
// CUSTOMER DASHBOARD QUERIES
// ============================================

export async function getUserOrders(userId: string): Promise<Order[]> {
  return sql`
    SELECT * FROM orders
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  ` as unknown as Order[]
}

export async function getUserConsultations(userId: string): Promise<Consultation[]> {
  return sql`
    SELECT * FROM consultations
    WHERE user_id = ${userId}
    ORDER BY scheduled_at DESC NULLS LAST, created_at DESC
  ` as unknown as Consultation[]
}

export async function getUserDocuments(userId: string): Promise<Document[]> {
  return sql`
    SELECT * FROM documents
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  ` as unknown as Document[]
}

export async function getActionItems(userId: string, includeCompleted = false): Promise<ActionItem[]> {
  if (includeCompleted) {
    return sql`
      SELECT * FROM action_items
      WHERE user_id = ${userId}
      ORDER BY
        CASE priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          ELSE 4
        END,
        due_date ASC NULLS LAST,
        created_at DESC
    ` as unknown as ActionItem[]
  }
  return sql`
    SELECT * FROM action_items
    WHERE user_id = ${userId} AND completed = false
    ORDER BY
      CASE priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
      END,
      due_date ASC NULLS LAST,
      created_at DESC
  ` as unknown as ActionItem[]
}

export async function getServiceProgress(orderId: string): Promise<ServiceProgress[]> {
  return sql`
    SELECT * FROM service_progress
    WHERE order_id = ${orderId}
    ORDER BY sort_order ASC
  ` as unknown as ServiceProgress[]
}

export async function getUserOnboarding(userId: string): Promise<OnboardingSubmission | null> {
  const results = await sql`
    SELECT * FROM onboarding_submissions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  ` as unknown as OnboardingSubmission[]
  return results[0] || null
}

export async function getUserReferralStats(userId: string) {
  const link = await sql`
    SELECT * FROM referral_links
    WHERE user_id = ${userId} AND active = true
    LIMIT 1
  ` as unknown as ReferralLink[]

  const referrals = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'signed_up' THEN 1 END) as signed_up,
      COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
      COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid,
      COALESCE(SUM(CASE WHEN commission_paid THEN commission_amount ELSE 0 END), 0) as total_earned
    FROM referrals
    WHERE referrer_id = ${userId}
  ` as unknown as any[]

  return {
    link: link[0] || null,
    stats: referrals[0] || { total: 0, signed_up: 0, converted: 0, paid: 0, total_earned: 0 }
  }
}

export async function getUserDashboardData(userId: string) {
  const [orders, consultations, documents, actionItems, onboarding, referralStats] = await Promise.all([
    getUserOrders(userId),
    getUserConsultations(userId),
    getUserDocuments(userId),
    getActionItems(userId),
    getUserOnboarding(userId),
    getUserReferralStats(userId)
  ])

  // Get progress for active orders
  const activeOrders = orders.filter(o => ['paid', 'processing'].includes(o.status))
  const ordersWithProgress = await Promise.all(
    activeOrders.map(async (order) => ({
      ...order,
      progress: await getServiceProgress(order.id)
    }))
  )

  return {
    orders,
    ordersWithProgress,
    consultations,
    documents,
    actionItems,
    onboarding,
    referralStats,
    stats: {
      activeOrders: activeOrders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      pendingActions: actionItems.length,
      upcomingConsultations: consultations.filter(c =>
        c.status === 'scheduled' && c.scheduled_at && new Date(c.scheduled_at) > new Date()
      ).length,
      documentsReady: documents.filter(d => d.status === 'ready').length
    }
  }
}

// ============================================
// ACTION ITEM MANAGEMENT
// ============================================

export async function completeActionItem(itemId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE action_items
    SET completed = true, completed_at = NOW()
    WHERE id = ${itemId} AND user_id = ${userId}
    RETURNING id
  ` as unknown as any[]
  return result.length > 0
}

export async function createActionItem(data: {
  userId: string
  orderId?: string
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: Date
}): Promise<ActionItem> {
  const result = await sql`
    INSERT INTO action_items (user_id, order_id, title, description, priority, due_date)
    VALUES (${data.userId}, ${data.orderId || null}, ${data.title}, ${data.description || null}, ${data.priority || 'medium'}, ${data.dueDate || null})
    RETURNING *
  ` as unknown as ActionItem[]
  return result[0]
}

// ============================================
// REFERRAL MANAGEMENT
// ============================================

export async function createReferralLink(userId: string): Promise<ReferralLink> {
  const code = generateReferralCode()
  const result = await sql`
    INSERT INTO referral_links (user_id, code)
    VALUES (${userId}, ${code})
    RETURNING *
  ` as unknown as ReferralLink[]
  return result[0]
}

export async function trackReferralClick(code: string): Promise<boolean> {
  const result = await sql`
    UPDATE referral_links
    SET clicks = clicks + 1
    WHERE code = ${code} AND active = true
    RETURNING id
  ` as unknown as any[]
  return result.length > 0
}

export async function createReferral(referrerCode: string, referredEmail: string): Promise<Referral | null> {
  // Get the referrer from the code
  const link = await sql`
    SELECT * FROM referral_links WHERE code = ${referrerCode} AND active = true
  ` as unknown as ReferralLink[]

  if (!link[0]) return null

  const result = await sql`
    INSERT INTO referrals (referrer_id, referred_email, source)
    VALUES (${link[0].user_id}, ${referredEmail}, 'link')
    RETURNING *
  ` as unknown as Referral[]
  return result[0]
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ============================================
// ADMIN QUERIES
// ============================================

export async function getAdminStats() {
  const [ordersStats, consultationsStats, usersStats, revenueStats] = await Promise.all([
    sql`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM orders
    `,
    sql`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM consultations
    `,
    sql`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
      FROM users
    `,
    sql`
      SELECT
        COALESCE(SUM(CASE WHEN status IN ('paid', 'processing', 'completed') THEN total ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN status IN ('paid', 'processing', 'completed') AND created_at > NOW() - INTERVAL '30 days' THEN total ELSE 0 END), 0) as revenue_this_month,
        COALESCE(SUM(CASE WHEN status IN ('paid', 'processing', 'completed') AND created_at > NOW() - INTERVAL '7 days' THEN total ELSE 0 END), 0) as revenue_this_week
      FROM orders
    `
  ])

  return {
    orders: (ordersStats as any[])[0],
    consultations: (consultationsStats as any[])[0],
    users: (usersStats as any[])[0],
    revenue: (revenueStats as any[])[0]
  }
}

export async function getAllOrders(filters?: {
  status?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}): Promise<{ orders: Order[], total: number }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let orders: Order[]
  let countResult: any[]

  if (filters?.status) {
    orders = await sql`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.status = ${filters.status}
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Order[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM orders WHERE status = ${filters.status}
    ` as unknown as any[]
  } else {
    orders = await sql`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Order[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM orders
    ` as unknown as any[]
  }

  return { orders, total: parseInt(countResult[0]?.count || '0') }
}

export async function getAllConsultations(filters?: {
  status?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}): Promise<{ consultations: Consultation[], total: number }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let consultations: Consultation[]
  let countResult: any[]

  if (filters?.status) {
    consultations = await sql`
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM consultations c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.status = ${filters.status}
      ORDER BY c.scheduled_at DESC NULLS LAST, c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Consultation[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM consultations WHERE status = ${filters.status}
    ` as unknown as any[]
  } else {
    consultations = await sql`
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM consultations c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.scheduled_at DESC NULLS LAST, c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Consultation[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM consultations
    ` as unknown as any[]
  }

  return { consultations, total: parseInt(countResult[0]?.count || '0') }
}

export interface UserWithStats extends User {
  order_count: number
  total_spent: number
}

export async function getAllUsers(filters?: {
  role?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<{ users: UserWithStats[], total: number, stats: { all: number, admin: number, user: number } }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let users: UserWithStats[]
  let countResult: any[]

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`
    users = await sql`
      SELECT
        u.id, u.email, u.name, u.role, u.created_at, u.updated_at,
        COALESCE(COUNT(o.id), 0)::int as order_count,
        COALESCE(SUM(o.total), 0)::numeric as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.email ILIKE ${searchTerm} OR u.name ILIKE ${searchTerm}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as UserWithStats[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM users
      WHERE email ILIKE ${searchTerm} OR name ILIKE ${searchTerm}
    ` as unknown as any[]
  } else if (filters?.role) {
    users = await sql`
      SELECT
        u.id, u.email, u.name, u.role, u.created_at, u.updated_at,
        COALESCE(COUNT(o.id), 0)::int as order_count,
        COALESCE(SUM(o.total), 0)::numeric as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = ${filters.role}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as UserWithStats[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = ${filters.role}
    ` as unknown as any[]
  } else {
    users = await sql`
      SELECT
        u.id, u.email, u.name, u.role, u.created_at, u.updated_at,
        COALESCE(COUNT(o.id), 0)::int as order_count,
        COALESCE(SUM(o.total), 0)::numeric as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as UserWithStats[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM users
    ` as unknown as any[]
  }

  // Get role counts for stats
  const roleStats = await sql`
    SELECT
      COUNT(*) FILTER (WHERE role = 'admin')::int as admin_count,
      COUNT(*) FILTER (WHERE role = 'user')::int as user_count,
      COUNT(*)::int as total_count
    FROM users
  ` as unknown as any[]

  return {
    users,
    total: parseInt(countResult[0]?.count || '0'),
    stats: {
      all: roleStats[0]?.total_count || 0,
      admin: roleStats[0]?.admin_count || 0,
      user: roleStats[0]?.user_count || 0,
    }
  }
}

export async function getRecentOrders(limit = 10): Promise<Order[]> {
  return sql`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT ${limit}
  ` as unknown as Order[]
}

export async function getUpcomingConsultations(days = 7): Promise<Consultation[]> {
  return sql`
    SELECT c.*, u.name as user_name, u.email as user_email
    FROM consultations c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.status = 'scheduled'
      AND c.scheduled_at > NOW()
      AND c.scheduled_at < NOW() + INTERVAL '1 day' * ${days}
    ORDER BY c.scheduled_at ASC
  ` as unknown as Consultation[]
}

// ============================================
// ORDER MANAGEMENT
// ============================================

export async function updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
  const result = await sql`
    UPDATE orders
    SET status = ${status}
    WHERE id = ${orderId}
    RETURNING *
  ` as unknown as Order[]
  return result[0] || null
}

export async function getOrderWithDetails(orderId: string) {
  const order = await sql`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = ${orderId}
  ` as unknown as Order[]

  if (!order[0]) return null

  const [progress, documents, fulfillmentTasks, notes] = await Promise.all([
    getServiceProgress(orderId),
    sql`SELECT * FROM documents WHERE order_id = ${orderId} ORDER BY created_at DESC` as unknown as Document[],
    sql`SELECT * FROM fulfillment_tasks WHERE order_id = ${orderId} ORDER BY created_at ASC` as unknown as FulfillmentTask[],
    sql`SELECT * FROM admin_notes WHERE entity_type = 'order' AND entity_id = ${orderId} ORDER BY created_at DESC` as unknown as AdminNote[]
  ])

  return {
    ...order[0],
    progress,
    documents,
    fulfillmentTasks,
    notes
  }
}

// ============================================
// FULFILLMENT QUEUE
// ============================================

export async function getFulfillmentQueue(status?: string): Promise<FulfillmentTask[]> {
  if (status) {
    return sql`
      SELECT ft.*, o.items as order_items, u.name as user_name, u.email as user_email
      FROM fulfillment_tasks ft
      JOIN orders o ON ft.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE ft.status = ${status}
      ORDER BY ft.created_at ASC
    ` as unknown as FulfillmentTask[]
  }
  return sql`
    SELECT ft.*, o.items as order_items, u.name as user_name, u.email as user_email
    FROM fulfillment_tasks ft
    JOIN orders o ON ft.order_id = o.id
    LEFT JOIN users u ON o.user_id = u.id
    WHERE ft.status IN ('queued', 'in_progress', 'blocked')
    ORDER BY
      CASE ft.status
        WHEN 'blocked' THEN 1
        WHEN 'in_progress' THEN 2
        ELSE 3
      END,
      ft.created_at ASC
  ` as unknown as FulfillmentTask[]
}

export async function updateFulfillmentTask(taskId: string, updates: {
  status?: string
  assignee?: string
  blockers?: string[]
  notes?: string
}): Promise<FulfillmentTask | null> {
  const setClauses: string[] = []

  if (updates.status === 'in_progress') {
    const result = await sql`
      UPDATE fulfillment_tasks
      SET status = ${updates.status}, started_at = NOW()
      WHERE id = ${taskId}
      RETURNING *
    ` as unknown as FulfillmentTask[]
    return result[0]
  }

  if (updates.status === 'completed') {
    const result = await sql`
      UPDATE fulfillment_tasks
      SET status = ${updates.status}, completed_at = NOW()
      WHERE id = ${taskId}
      RETURNING *
    ` as unknown as FulfillmentTask[]
    return result[0]
  }

  // Generic update
  const result = await sql`
    UPDATE fulfillment_tasks
    SET
      status = COALESCE(${updates.status}, status),
      assignee = COALESCE(${updates.assignee}, assignee),
      notes = COALESCE(${updates.notes}, notes)
    WHERE id = ${taskId}
    RETURNING *
  ` as unknown as FulfillmentTask[]
  return result[0]
}

export async function createFulfillmentTask(orderId: string, type: string, automatable = false): Promise<FulfillmentTask> {
  const result = await sql`
    INSERT INTO fulfillment_tasks (order_id, type, automatable)
    VALUES (${orderId}, ${type}, ${automatable})
    RETURNING *
  ` as unknown as FulfillmentTask[]
  return result[0]
}

// ============================================
// ADMIN NOTES
// ============================================

export async function addAdminNote(data: {
  entityType: 'user' | 'order' | 'consultation' | 'referral'
  entityId: string
  authorId: string
  content: string
}): Promise<AdminNote> {
  const result = await sql`
    INSERT INTO admin_notes (entity_type, entity_id, author_id, content)
    VALUES (${data.entityType}, ${data.entityId}, ${data.authorId}, ${data.content})
    RETURNING *
  ` as unknown as AdminNote[]
  return result[0]
}

export async function getAdminNotes(entityType: string, entityId: string): Promise<AdminNote[]> {
  return sql`
    SELECT an.*, u.name as author_name
    FROM admin_notes an
    LEFT JOIN users u ON an.author_id = u.id
    WHERE an.entity_type = ${entityType} AND an.entity_id = ${entityId}
    ORDER BY an.created_at DESC
  ` as unknown as AdminNote[]
}

// ============================================
// DOCUMENT MANAGEMENT
// ============================================

export async function createDocument(data: {
  userId: string
  orderId?: string
  name: string
  type: 'deliverable' | 'form' | 'contract' | 'invoice'
  url?: string
  fileSize?: number
  mimeType?: string
}): Promise<Document> {
  const result = await sql`
    INSERT INTO documents (user_id, order_id, name, type, url, file_size, mime_type, status)
    VALUES (${data.userId}, ${data.orderId || null}, ${data.name}, ${data.type}, ${data.url || null}, ${data.fileSize || null}, ${data.mimeType || null}, 'ready')
    RETURNING *
  ` as unknown as Document[]
  return result[0]
}

export async function markDocumentViewed(documentId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE documents
    SET status = 'viewed'
    WHERE id = ${documentId} AND user_id = ${userId} AND status = 'ready'
    RETURNING id
  ` as unknown as any[]
  return result.length > 0
}

export async function markDocumentDownloaded(documentId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE documents
    SET status = 'downloaded'
    WHERE id = ${documentId} AND user_id = ${userId}
    RETURNING id
  ` as unknown as any[]
  return result.length > 0
}

// ============================================
// SERVICE PROGRESS MANAGEMENT
// ============================================

export async function createServiceProgress(orderId: string, milestones: { milestone: string; description?: string }[]): Promise<ServiceProgress[]> {
  const results: ServiceProgress[] = []
  for (let i = 0; i < milestones.length; i++) {
    const m = milestones[i]
    const result = await sql`
      INSERT INTO service_progress (order_id, milestone, description, sort_order)
      VALUES (${orderId}, ${m.milestone}, ${m.description || null}, ${i})
      RETURNING *
    ` as unknown as ServiceProgress[]
    results.push(result[0])
  }
  return results
}

export async function updateMilestoneStatus(milestoneId: string, status: 'pending' | 'in_progress' | 'completed'): Promise<ServiceProgress | null> {
  if (status === 'completed') {
    const result = await sql`
      UPDATE service_progress
      SET status = ${status}, completed_at = NOW()
      WHERE id = ${milestoneId}
      RETURNING *
    ` as unknown as ServiceProgress[]
    return result[0]
  }

  const result = await sql`
    UPDATE service_progress
    SET status = ${status}
    WHERE id = ${milestoneId}
    RETURNING *
  ` as unknown as ServiceProgress[]
  return result[0]
}

// ============================================
// REFERRAL ADMIN
// ============================================

export async function getAllReferrals(filters?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<{ referrals: Referral[], total: number }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let referrals: Referral[]
  let countResult: any[]

  if (filters?.status) {
    referrals = await sql`
      SELECT r.*, u.name as referrer_name, u.email as referrer_email
      FROM referrals r
      LEFT JOIN users u ON r.referrer_id = u.id
      WHERE r.status = ${filters.status}
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Referral[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM referrals WHERE status = ${filters.status}
    ` as unknown as any[]
  } else {
    referrals = await sql`
      SELECT r.*, u.name as referrer_name, u.email as referrer_email
      FROM referrals r
      LEFT JOIN users u ON r.referrer_id = u.id
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Referral[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM referrals
    ` as unknown as any[]
  }

  return { referrals, total: parseInt(countResult[0]?.count || '0') }
}

export async function markReferralPaid(referralId: string, amount: number): Promise<Referral | null> {
  const result = await sql`
    UPDATE referrals
    SET commission_paid = true, commission_amount = ${amount}, commission_paid_at = NOW()
    WHERE id = ${referralId}
    RETURNING *
  ` as unknown as Referral[]
  return result[0]
}

// ============================================
// ONBOARDING SUBMISSIONS
// ============================================

export async function createOnboardingSubmission(data: {
  userId?: string
  businessName: string
  businessType: string
  businessStage: string
  goals: string[]
  challenges: string[]
  contactEmail: string
  contactPhone?: string
  timeline?: string
  budgetRange?: string
  additionalInfo?: string
  formData?: Record<string, any>
  source?: string
  ipAddress?: string
  userAgent?: string
  referralCode?: string
  completionPercentage?: number
}): Promise<OnboardingSubmission> {
  const result = await sql`
    INSERT INTO onboarding_submissions (
      user_id,
      business_name,
      business_type,
      business_stage,
      goals,
      challenges,
      contact_email,
      contact_phone,
      timeline,
      budget_range,
      additional_info,
      form_data,
      source,
      ip_address,
      user_agent,
      referral_code,
      completion_percentage,
      status
    )
    VALUES (
      ${data.userId || null},
      ${data.businessName},
      ${data.businessType},
      ${data.businessStage},
      ${data.goals},
      ${data.challenges},
      ${data.contactEmail},
      ${data.contactPhone || null},
      ${data.timeline || null},
      ${data.budgetRange || null},
      ${data.additionalInfo || null},
      ${data.formData ? JSON.stringify(data.formData) : null},
      ${data.source || 'onboarding_form'},
      ${data.ipAddress || null},
      ${data.userAgent || null},
      ${data.referralCode || null},
      ${data.completionPercentage || 100},
      'submitted'
    )
    RETURNING *
  ` as unknown as OnboardingSubmission[]
  return result[0]
}

export async function getOnboardingSubmissionByEmail(email: string): Promise<OnboardingSubmission | null> {
  const results = await sql`
    SELECT * FROM onboarding_submissions
    WHERE contact_email = ${email}
    ORDER BY created_at DESC
    LIMIT 1
  ` as unknown as OnboardingSubmission[]
  return results[0] || null
}

export async function getAllOnboardingSubmissions(filters?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<{ submissions: OnboardingSubmission[], total: number }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let submissions: OnboardingSubmission[]
  let countResult: any[]

  if (filters?.status) {
    submissions = await sql`
      SELECT os.*, u.name as user_name, u.email as user_email
      FROM onboarding_submissions os
      LEFT JOIN users u ON os.user_id = u.id
      WHERE os.status = ${filters.status}
      ORDER BY os.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as OnboardingSubmission[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM onboarding_submissions WHERE status = ${filters.status}
    ` as unknown as any[]
  } else {
    submissions = await sql`
      SELECT os.*, u.name as user_name, u.email as user_email
      FROM onboarding_submissions os
      LEFT JOIN users u ON os.user_id = u.id
      ORDER BY os.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as OnboardingSubmission[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM onboarding_submissions
    ` as unknown as any[]
  }

  return { submissions, total: parseInt(countResult[0]?.count || '0') }
}

export async function updateOnboardingStatus(
  submissionId: string,
  status: 'submitted' | 'reviewed' | 'in_progress' | 'completed'
): Promise<OnboardingSubmission | null> {
  const result = await sql`
    UPDATE onboarding_submissions
    SET status = ${status}
    WHERE id = ${submissionId}
    RETURNING *
  ` as unknown as OnboardingSubmission[]
  return result[0] || null
}

// ============================================
// USER MANAGEMENT
// ============================================

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  ` as unknown as User[]
  return result[0] || null
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId} LIMIT 1
  ` as unknown as User[]
  return result[0] || null
}

export async function createUser(data: {
  email: string
  name?: string
  role?: string
}): Promise<User | null> {
  const result = await sql`
    INSERT INTO users (email, name, role)
    VALUES (${data.email}, ${data.name || null}, ${data.role || 'user'})
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, users.name),
      updated_at = NOW()
    RETURNING *
  ` as unknown as User[]
  return result[0] || null
}

// ============================================
// ORDER MANAGEMENT
// ============================================

interface CreateOrderData {
  userId?: string
  items: Array<{ name: string; price: number; quantity: number; slug?: string }>
  subtotal: number
  discount?: number
  total: number
  paymentIntentId?: string
  paymentMethod?: string
  status?: string
  customerEmail?: string | null
  customerName?: string | null
  customerPhone?: string | null
}

export async function createOrder(data: CreateOrderData): Promise<Order | null> {
  const result = await sql`
    INSERT INTO orders (
      user_id,
      items,
      subtotal,
      discount,
      total,
      payment_intent_id,
      payment_method,
      status
    ) VALUES (
      ${data.userId || null},
      ${JSON.stringify(data.items)},
      ${data.subtotal},
      ${data.discount || 0},
      ${data.total},
      ${data.paymentIntentId || null},
      ${data.paymentMethod || 'card'},
      ${data.status || 'pending'}
    )
    RETURNING *
  ` as unknown as Order[]
  return result[0] || null
}

export async function getOrderByPaymentIntent(paymentIntentId: string): Promise<Order | null> {
  const result = await sql`
    SELECT * FROM orders WHERE payment_intent_id = ${paymentIntentId} LIMIT 1
  ` as unknown as Order[]
  return result[0] || null
}

// ============================================
// CONTACT SUBMISSIONS
// ============================================

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  business_stage: string | null
  services: string[]
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  source: string
  ip_address: string | null
  user_agent: string | null
  created_at: Date
  updated_at: Date
}

export async function createContactSubmission(data: {
  name: string
  email: string
  phone?: string
  company?: string
  businessStage?: string
  services?: string[]
  message: string
  source?: string
  ipAddress?: string
  userAgent?: string
}): Promise<ContactSubmission> {
  const result = await sql`
    INSERT INTO contact_submissions (
      name,
      email,
      phone,
      company,
      business_stage,
      services,
      message,
      source,
      ip_address,
      user_agent,
      status
    ) VALUES (
      ${data.name},
      ${data.email},
      ${data.phone || null},
      ${data.company || null},
      ${data.businessStage || null},
      ${data.services || []},
      ${data.message},
      ${data.source || 'contact_form'},
      ${data.ipAddress || null},
      ${data.userAgent || null},
      'new'
    )
    RETURNING *
  ` as unknown as ContactSubmission[]
  return result[0]
}

export async function getContactSubmissionByEmail(email: string): Promise<ContactSubmission | null> {
  const results = await sql`
    SELECT * FROM contact_submissions
    WHERE email = ${email}
    ORDER BY created_at DESC
    LIMIT 1
  ` as unknown as ContactSubmission[]
  return results[0] || null
}

export async function getAllContactSubmissions(filters?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<{ submissions: ContactSubmission[], total: number }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let submissions: ContactSubmission[]
  let countResult: any[]

  if (filters?.status) {
    submissions = await sql`
      SELECT * FROM contact_submissions
      WHERE status = ${filters.status}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as ContactSubmission[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM contact_submissions WHERE status = ${filters.status}
    ` as unknown as any[]
  } else {
    submissions = await sql`
      SELECT * FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as ContactSubmission[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM contact_submissions
    ` as unknown as any[]
  }

  return { submissions, total: parseInt(countResult[0]?.count || '0') }
}

export async function updateContactStatus(
  submissionId: string,
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
): Promise<ContactSubmission | null> {
  const result = await sql`
    UPDATE contact_submissions
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${submissionId}
    RETURNING *
  ` as unknown as ContactSubmission[]
  return result[0] || null
}

// ============================================
// PARTNER PORTAL QUERIES
// ============================================

export interface Partner {
  id: string
  user_id: string
  company_name: string
  status: 'pending' | 'active' | 'suspended' | 'inactive'
  commission_rate: number
  total_referrals: number
  total_earnings: number
  paid_earnings: number
  pending_earnings: number
  rank: string | null
  created_at: Date
  updated_at: Date
}

export interface PartnerLead {
  id: string
  partner_id: string
  client_name: string
  client_email: string
  client_phone: string | null
  service: string
  status: 'pending' | 'contacted' | 'qualified' | 'converted' | 'lost'
  commission: number
  commission_paid: boolean
  created_at: Date
  converted_at: Date | null
}

export async function getPartnerByUserId(userId: string): Promise<Partner | null> {
  const result = await sql`
    SELECT * FROM partners WHERE user_id = ${userId} LIMIT 1
  ` as unknown as Partner[]
  return result[0] || null
}

export async function getPartnerStats(partnerId: string) {
  const [partner, leadsStats, earningsStats] = await Promise.all([
    sql`SELECT * FROM partners WHERE id = ${partnerId}` as unknown as Partner[],
    sql`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
        COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
        COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost
      FROM partner_leads
      WHERE partner_id = ${partnerId}
    `,
    sql`
      SELECT
        COALESCE(SUM(commission), 0) as total_commission,
        COALESCE(SUM(CASE WHEN commission_paid THEN commission ELSE 0 END), 0) as paid_commission,
        COALESCE(SUM(CASE WHEN NOT commission_paid AND status = 'converted' THEN commission ELSE 0 END), 0) as pending_commission,
        COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN commission ELSE 0 END), 0) as this_month_earnings,
        COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < DATE_TRUNC('month', CURRENT_DATE) THEN commission ELSE 0 END), 0) as last_month_earnings
      FROM partner_leads
      WHERE partner_id = ${partnerId} AND status = 'converted'
    `
  ])

  return {
    partner: partner[0] || null,
    leads: (leadsStats as any[])[0],
    earnings: (earningsStats as any[])[0]
  }
}

export async function getPartnerLeads(
  partnerId: string,
  filters?: {
    status?: string
    limit?: number
    offset?: number
  }
): Promise<{ leads: PartnerLead[], total: number }> {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  let leads: PartnerLead[]
  let countResult: any[]

  if (filters?.status) {
    leads = await sql`
      SELECT * FROM partner_leads
      WHERE partner_id = ${partnerId} AND status = ${filters.status}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as PartnerLead[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM partner_leads
      WHERE partner_id = ${partnerId} AND status = ${filters.status}
    ` as unknown as any[]
  } else {
    leads = await sql`
      SELECT * FROM partner_leads
      WHERE partner_id = ${partnerId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as PartnerLead[]

    countResult = await sql`
      SELECT COUNT(*) as count FROM partner_leads
      WHERE partner_id = ${partnerId}
    ` as unknown as any[]
  }

  return { leads, total: parseInt(countResult[0]?.count || '0') }
}

export async function createPartnerLead(data: {
  partnerId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  service: string
  commission: number
}): Promise<PartnerLead> {
  const result = await sql`
    INSERT INTO partner_leads (
      partner_id,
      client_name,
      client_email,
      client_phone,
      service,
      commission,
      status
    ) VALUES (
      ${data.partnerId},
      ${data.clientName},
      ${data.clientEmail},
      ${data.clientPhone || null},
      ${data.service},
      ${data.commission},
      'pending'
    )
    RETURNING *
  ` as unknown as PartnerLead[]
  return result[0]
}

export async function updatePartnerLeadStatus(
  leadId: string,
  partnerId: string,
  status: 'pending' | 'contacted' | 'qualified' | 'converted' | 'lost'
): Promise<PartnerLead | null> {
  if (status === 'converted') {
    const result = await sql`
      UPDATE partner_leads
      SET status = ${status}, converted_at = NOW()
      WHERE id = ${leadId} AND partner_id = ${partnerId}
      RETURNING *
    ` as unknown as PartnerLead[]
    return result[0] || null
  }

  const result = await sql`
    UPDATE partner_leads
    SET status = ${status}
    WHERE id = ${leadId} AND partner_id = ${partnerId}
    RETURNING *
  ` as unknown as PartnerLead[]
  return result[0] || null
}

export async function getPartnerCommissions(partnerId: string) {
  const result = await sql`
    SELECT
      COALESCE(SUM(commission), 0) as total_earned,
      COALESCE(SUM(CASE WHEN NOT commission_paid AND status = 'converted' THEN commission ELSE 0 END), 0) as pending_commission,
      COALESCE(SUM(CASE WHEN commission_paid THEN commission ELSE 0 END), 0) as paid_commission,
      COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) AND status = 'converted' THEN commission ELSE 0 END), 0) as this_month_earnings,
      COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < DATE_TRUNC('month', CURRENT_DATE) AND status = 'converted' THEN commission ELSE 0 END), 0) as last_month_earnings,
      COALESCE(AVG(CASE WHEN status = 'converted' THEN commission END), 0) as average_commission
    FROM partner_leads
    WHERE partner_id = ${partnerId}
  ` as unknown as any[]

  return result[0] || {
    total_earned: 0,
    pending_commission: 0,
    paid_commission: 0,
    this_month_earnings: 0,
    last_month_earnings: 0,
    average_commission: 0
  }
}

export async function createPartner(data: {
  userId: string
  companyName: string
  commissionRate?: number
}): Promise<Partner> {
  const result = await sql`
    INSERT INTO partners (user_id, company_name, commission_rate, status)
    VALUES (${data.userId}, ${data.companyName}, ${data.commissionRate || 10}, 'pending')
    RETURNING *
  ` as unknown as Partner[]
  return result[0]
}

// ============================================
// PARTNER-ONBOARDING INTEGRATION
// ============================================

/**
 * Convert an onboarding submission to a partner account
 */
export async function createPartnerFromOnboarding(
  onboardingId: string,
  commissionRate: number = 10.00
): Promise<string> {
  const result = await sql`
    SELECT create_partner_from_onboarding(
      ${onboardingId}::UUID,
      ${commissionRate}::DECIMAL
    ) as partner_id
  ` as unknown as { partner_id: string }[]

  if (!result || result.length === 0) {
    throw new Error('Failed to create partner from onboarding')
  }

  return result[0].partner_id
}

/**
 * Link an existing partner to an onboarding submission
 */
export async function linkPartnerToOnboarding(
  partnerId: string,
  onboardingId: string
): Promise<boolean> {
  const result = await sql`
    SELECT link_partner_to_onboarding(
      ${partnerId}::UUID,
      ${onboardingId}::UUID
    ) as success
  ` as unknown as { success: boolean }[]

  return result[0]?.success || false
}

/**
 * Get partner with onboarding details
 */
export async function getPartnerWithOnboarding(partnerId: string) {
  const result = await sql`
    SELECT * FROM partner_onboarding_details
    WHERE partner_id = ${partnerId}
  ` as unknown as any[]

  return result[0] || null
}

/**
 * Get onboarding with partner info
 */
export async function getOnboardingWithPartner(onboardingId: string) {
  const result = await sql`
    SELECT * FROM onboarding_with_partner_info
    WHERE onboarding_id = ${onboardingId}
  ` as unknown as any[]

  return result[0] || null
}

/**
 * Check if onboarding can be converted to partner
 */
export async function canConvertToPartner(onboardingId: string): Promise<{
  canConvert: boolean
  reason?: string
  existingPartnerId?: string
}> {
  const result = await sql`
    SELECT
      id,
      partner_account_created,
      partner_id
    FROM onboarding_submissions
    WHERE id = ${onboardingId}
  ` as unknown as any[]

  if (!result || result.length === 0) {
    return {
      canConvert: false,
      reason: 'Onboarding submission not found'
    }
  }

  const submission = result[0]

  if (submission.partner_account_created && submission.partner_id) {
    return {
      canConvert: false,
      reason: 'Partner account already exists',
      existingPartnerId: submission.partner_id
    }
  }

  return { canConvert: true }
}

// ============================================
// VOICE CALLS (used by /api/voice/* routes)
// ============================================

type CreateVoiceCallInput = {
  roomName: string
  callerId: string
  calleeId?: string
  callType: CallType
  metadata?: Record<string, any>
}

export async function createVoiceCall(input: CreateVoiceCallInput): Promise<VoiceCall> {
  const result = await sql`
    INSERT INTO voice_calls (
      room_name,
      caller_id,
      callee_id,
      call_type,
      status,
      started_at,
      metadata
    ) VALUES (
      ${input.roomName},
      ${input.callerId},
      ${input.calleeId || null},
      ${input.callType},
      'pending',
      NOW(),
      ${JSON.stringify(input.metadata || {})}::jsonb
    )
    RETURNING *
  ` as unknown as VoiceCall[]

  return result[0]
}

export async function getVoiceCallByRoom(roomName: string): Promise<VoiceCall | null> {
  const result = await sql`
    SELECT *
    FROM voice_calls
    WHERE room_name = ${roomName}
    ORDER BY created_at DESC
    LIMIT 1
  ` as unknown as VoiceCall[]

  return result[0] || null
}

type UpdateVoiceCallOptions = {
  startedAt?: boolean
  connectedAt?: boolean
  endedAt?: boolean
  durationSeconds?: number
  recordingUrl?: string
  transcript?: string
  metadata?: Record<string, any>
}

export async function updateVoiceCallStatus(
  roomName: string,
  status: CallStatus,
  options: UpdateVoiceCallOptions = {}
): Promise<VoiceCall | null> {
  const result = await sql`
    UPDATE voice_calls
    SET
      status = ${status},
      started_at = CASE WHEN ${options.startedAt || false} THEN COALESCE(started_at, NOW()) ELSE started_at END,
      connected_at = CASE WHEN ${options.connectedAt || false} THEN COALESCE(connected_at, NOW()) ELSE connected_at END,
      ended_at = CASE WHEN ${options.endedAt || false} THEN COALESCE(ended_at, NOW()) ELSE ended_at END,
      duration_seconds = COALESCE(${options.durationSeconds ?? null}, duration_seconds),
      recording_url = COALESCE(${options.recordingUrl ?? null}, recording_url),
      transcript = COALESCE(${options.transcript ?? null}, transcript),
      metadata = CASE
        WHEN ${options.metadata ? true : false}
          THEN (COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify(options.metadata || {})}::jsonb)
        ELSE metadata
      END
    WHERE room_name = ${roomName}
    RETURNING *
  ` as unknown as VoiceCall[]

  return result[0] || null
}

export async function setCallRecordingUrl(roomName: string, recordingUrl: string): Promise<boolean> {
  const result = await sql`
    UPDATE voice_calls
    SET recording_url = ${recordingUrl}
    WHERE room_name = ${roomName}
    RETURNING id
  ` as unknown as any[]

  return result.length > 0
}

export async function addCallParticipant(input: {
  callId: string
  userId: string
  participantName?: string
}): Promise<CallParticipant> {
  const result = await sql`
    INSERT INTO call_participants (call_id, user_id, participant_name, joined_at)
    VALUES (${input.callId}, ${input.userId}, ${input.participantName || null}, NOW())
    ON CONFLICT (call_id, user_id)
    DO UPDATE SET
      participant_name = COALESCE(EXCLUDED.participant_name, call_participants.participant_name),
      joined_at = COALESCE(call_participants.joined_at, NOW()),
      left_at = NULL
    RETURNING *
  ` as unknown as CallParticipant[]

  return result[0]
}

export async function updateCallParticipantLeft(callId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE call_participants
    SET
      left_at = NOW(),
      duration_seconds = CASE
        WHEN joined_at IS NOT NULL THEN EXTRACT(EPOCH FROM (NOW() - joined_at))::int
        ELSE duration_seconds
      END
    WHERE call_id = ${callId} AND user_id = ${userId}
    RETURNING id
  ` as unknown as any[]

  return result.length > 0
}

export async function getCallParticipants(callId: string): Promise<CallParticipant[]> {
  const result = await sql`
    SELECT *
    FROM call_participants
    WHERE call_id = ${callId}
    ORDER BY joined_at ASC
  ` as unknown as CallParticipant[]

  return result
}

export async function getVoiceCallHistory(input: {
  userId?: string
  callType?: string
  status?: string
  limit?: number
  offset?: number
}): Promise<{ calls: VoiceCall[]; total: number }> {
  const limit = input.limit ?? 20
  const offset = input.offset ?? 0

  const whereUser = input.userId
    ? sql`(caller_id = ${input.userId} OR callee_id = ${input.userId})`
    : sql`TRUE`

  const whereType = input.callType ? sql`call_type = ${input.callType}` : sql`TRUE`
  const whereStatus = input.status ? sql`status = ${input.status}` : sql`TRUE`

  const calls = await sql`
    SELECT *
    FROM voice_calls
    WHERE ${whereUser} AND ${whereType} AND ${whereStatus}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  ` as unknown as VoiceCall[]

  const totalResult = await sql`
    SELECT COUNT(*)::int AS count
    FROM voice_calls
    WHERE ${whereUser} AND ${whereType} AND ${whereStatus}
  ` as unknown as Array<{ count: number }>

  return { calls, total: totalResult[0]?.count || 0 }
}

export async function getVoiceCallStats(days: number): Promise<{
  totalCalls: number
  completedCalls: number
  missedCalls: number
  failedCalls: number
  averageDuration: number
}> {
  const result = await sql`
    SELECT
      COUNT(*)::int as total_calls,
      COUNT(CASE WHEN status = 'completed' THEN 1 END)::int as completed_calls,
      COUNT(CASE WHEN status = 'missed' THEN 1 END)::int as missed_calls,
      COUNT(CASE WHEN status = 'failed' THEN 1 END)::int as failed_calls,
      COALESCE(AVG(duration_seconds), 0)::int as avg_duration
    FROM voice_calls
    WHERE created_at >= NOW() - (${days} || ' days')::interval
  ` as unknown as Array<{
    total_calls: number
    completed_calls: number
    missed_calls: number
    failed_calls: number
    avg_duration: number
  }>

  const row = result[0] || {
    total_calls: 0,
    completed_calls: 0,
    missed_calls: 0,
    failed_calls: 0,
    avg_duration: 0,
  }

  return {
    totalCalls: row.total_calls,
    completedCalls: row.completed_calls,
    missedCalls: row.missed_calls,
    failedCalls: row.failed_calls,
    averageDuration: row.avg_duration,
  }
}

// ============================================
// STRIPE CONNECT + PARTNER PAYOUTS (used by /api/webhooks/* and /api/partner/*)
// ============================================

export async function getPartnerByStripeAccountId(stripeAccountId: string) {
  const result = await sql`
    SELECT *
    FROM partners
    WHERE stripe_account_id = ${stripeAccountId}
    LIMIT 1
  ` as unknown as any[]

  return result[0] || null
}

export async function updatePartnerStripeStatus(
  stripeAccountId: string,
  input: {
    status: string
    payoutsEnabled?: boolean
    chargesEnabled?: boolean
    detailsSubmitted?: boolean
    onboardingComplete?: boolean
  }
) {
  const result = await sql`
    UPDATE partners
    SET
      stripe_account_status = ${input.status},
      stripe_payouts_enabled = COALESCE(${input.payoutsEnabled ?? null}, stripe_payouts_enabled),
      stripe_charges_enabled = COALESCE(${input.chargesEnabled ?? null}, stripe_charges_enabled),
      stripe_details_submitted = COALESCE(${input.detailsSubmitted ?? null}, stripe_details_submitted),
      stripe_onboarding_complete = COALESCE(${input.onboardingComplete ?? null}, stripe_onboarding_complete),
      stripe_connected_at = COALESCE(stripe_connected_at, NOW()),
      updated_at = NOW()
    WHERE stripe_account_id = ${stripeAccountId}
    RETURNING *
  ` as unknown as any[]

  return result[0] || null
}

export async function getPartnerStripeConnect(partnerId: string) {
  const result = await sql`
    SELECT *
    FROM partners
    WHERE id = ${partnerId}
    LIMIT 1
  ` as unknown as any[]

  return result[0] || null
}

export async function getPartnerBalance(partnerId: string): Promise<{
  availableBalance: number
  pendingBalance: number
  minimumPayoutThreshold: number
}> {
  const result = await sql`
    SELECT
      COALESCE(available_balance, 0) as available_balance,
      COALESCE(pending_balance, 0) as pending_balance,
      COALESCE(minimum_payout_threshold, 50.00) as minimum_payout_threshold
    FROM partners
    WHERE id = ${partnerId}
    LIMIT 1
  ` as unknown as any[]

  const row = result[0]
  return {
    availableBalance: Number(row?.available_balance || 0),
    pendingBalance: Number(row?.pending_balance || 0),
    minimumPayoutThreshold: Number(row?.minimum_payout_threshold || 50),
  }
}

export async function getPartnerPayouts(partnerId: string, limit = 20, offset = 0) {
  const payouts = await sql`
    SELECT *
    FROM partner_payouts
    WHERE partner_id = ${partnerId}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  ` as unknown as any[]

  const totalResult = await sql`
    SELECT COUNT(*)::int as count
    FROM partner_payouts
    WHERE partner_id = ${partnerId}
  ` as unknown as Array<{ count: number }>

  return { payouts, total: totalResult[0]?.count || 0 }
}

export async function createPartnerPayout(input: {
  partnerId: string
  stripePayoutId: string
  amount: number
  status: string
  currency?: string
  method?: string
  arrivalDate?: Date
  requestedBy?: string
  destinationType?: string
  destinationLast4?: string
}) {
  const result = await sql`
    INSERT INTO partner_payouts (
      partner_id,
      stripe_payout_id,
      amount,
      currency,
      status,
      method,
      arrival_date,
      requested_by,
      destination_type,
      destination_last4,
      initiated_at
    ) VALUES (
      ${input.partnerId},
      ${input.stripePayoutId},
      ${input.amount},
      ${input.currency || 'usd'},
      ${input.status},
      ${input.method || 'standard'},
      ${input.arrivalDate || null},
      ${input.requestedBy || 'manual'},
      ${input.destinationType || null},
      ${input.destinationLast4 || null},
      NOW()
    )
    RETURNING *
  ` as unknown as any[]

  return result[0]
}

export async function updatePartnerPayoutStatus(
  stripePayoutId: string,
  status: string,
  extra: {
    arrivalDate?: Date
    destinationType?: string
    destinationLast4?: string
    failureCode?: string
    failureMessage?: string
  } = {}
) {
  const paidAt = status === 'paid' ? new Date() : undefined
  const failedAt = status === 'failed' ? new Date() : undefined

  const result = await sql`
    UPDATE partner_payouts
    SET
      status = ${status},
      arrival_date = COALESCE(${extra.arrivalDate || null}, arrival_date),
      destination_type = COALESCE(${extra.destinationType || null}, destination_type),
      destination_last4 = COALESCE(${extra.destinationLast4 || null}, destination_last4),
      failure_code = COALESCE(${extra.failureCode || null}, failure_code),
      failure_message = COALESCE(${extra.failureMessage || null}, failure_message),
      paid_at = COALESCE(${paidAt || null}, paid_at),
      failed_at = COALESCE(${failedAt || null}, failed_at),
      updated_at = NOW()
    WHERE stripe_payout_id = ${stripePayoutId}
    RETURNING *
  ` as unknown as any[]

  return result[0] || null
}

export async function updatePartnerTransferStatus(stripeTransferId: string, status: string) {
  const result = await sql`
    UPDATE partner_transfers
    SET
      status = ${status},
      processed_at = CASE WHEN ${status === 'paid'} THEN COALESCE(processed_at, NOW()) ELSE processed_at END,
      failed_at = CASE WHEN ${status === 'failed'} THEN COALESCE(failed_at, NOW()) ELSE failed_at END,
      updated_at = NOW()
    WHERE stripe_transfer_id = ${stripeTransferId}
    RETURNING *
  ` as unknown as any[]

  return result[0] || null
}

export async function isConnectEventProcessed(eventId: string): Promise<boolean> {
  const result = await sql`
    SELECT event_id
    FROM stripe_connect_events
    WHERE event_id = ${eventId}
    LIMIT 1
  ` as unknown as any[]

  return !!result[0]
}

export async function logConnectEvent(input: {
  eventId: string
  eventType: string
  stripeAccountId?: string
  partnerId?: string
  eventData?: any
  processed: boolean
  errorMessage?: string
}) {
  const result = await sql`
    INSERT INTO stripe_connect_events (
      partner_id,
      stripe_account_id,
      event_id,
      event_type,
      event_data,
      processed,
      processed_at,
      error_message
    ) VALUES (
      ${input.partnerId || null},
      ${input.stripeAccountId || null},
      ${input.eventId},
      ${input.eventType},
      ${JSON.stringify(input.eventData || {})}::jsonb,
      ${input.processed},
      ${input.processed ? new Date().toISOString() : null}::timestamp,
      ${input.errorMessage || null}
    )
    ON CONFLICT (event_id) DO NOTHING
    RETURNING *
  ` as unknown as any[]

  return result[0] || null
}

// ============================================
// ADMIN ANALYTICS (used by /api/admin/analytics)
// ============================================

export async function getRevenueByDate(days?: number) {
  const whereClause = days ? sql`WHERE o.created_at >= NOW() - (${days} || ' days')::interval` : sql``
  const result = await sql`
    SELECT
      DATE(o.created_at) as date,
      COALESCE(SUM(o.total), 0)::float as revenue,
      COUNT(*)::int as orders
    FROM orders o
    ${whereClause}
    GROUP BY DATE(o.created_at)
    ORDER BY DATE(o.created_at) ASC
  ` as unknown as any[]

  return result
}

export async function getOrdersByStatus(days?: number) {
  const whereClause = days ? sql`WHERE created_at >= NOW() - (${days} || ' days')::interval` : sql``
  const result = await sql`
    SELECT
      status,
      COUNT(*)::int as count
    FROM orders
    ${whereClause}
    GROUP BY status
  ` as unknown as any[]
  return result
}

export async function getPartnerPerformanceData(days?: number, limit = 10) {
  // Minimal implementation: top partners by total_earnings (if present)
  const result = await sql`
    SELECT *
    FROM partners
    ORDER BY COALESCE(total_earnings, 0) DESC
    LIMIT ${limit}
  ` as unknown as any[]
  return result
}

export async function getLeadFunnelData(days?: number) {
  // Minimal implementation: counts by status if partner_leads exists
  const whereClause = days ? sql`WHERE created_at >= NOW() - (${days} || ' days')::interval` : sql``
  const result = await sql`
    SELECT
      status,
      COUNT(*)::int as count
    FROM partner_leads
    ${whereClause}
    GROUP BY status
  ` as unknown as any[]
  return result
}

export async function getUserAcquisitionData(days?: number) {
  const whereClause = days ? sql`WHERE created_at >= NOW() - (${days} || ' days')::interval` : sql``
  const result = await sql`
    SELECT
      DATE(created_at) as date,
      COUNT(*)::int as users
    FROM users
    ${whereClause}
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  ` as unknown as any[]
  return result
}

export async function getKeyMetrics(days?: number) {
  const whereOrders = days ? sql`WHERE created_at >= NOW() - (${days} || ' days')::interval` : sql``
  const orders = await sql`
    SELECT
      COUNT(*)::int as total_orders,
      COALESCE(SUM(total), 0)::float as total_revenue
    FROM orders
    ${whereOrders}
  ` as unknown as any[]

  const users = await sql`
    SELECT COUNT(*)::int as total_users
    FROM users
    ${days ? sql`WHERE created_at >= NOW() - (${days} || ' days')::interval` : sql``}
  ` as unknown as any[]

  const partners = await sql`
    SELECT COUNT(*)::int as total_partners
    FROM partners
  ` as unknown as any[]

  return {
    totalOrders: orders[0]?.total_orders || 0,
    totalRevenue: orders[0]?.total_revenue || 0,
    totalUsers: users[0]?.total_users || 0,
    totalPartners: partners[0]?.total_partners || 0,
  }
}

export async function getServicePerformance(): Promise<Array<{ service: string; orders: number; revenue: number; avgValue: number }>> {
  // Placeholder: requires a proper service dimension. Return empty until implemented.
  return []
}

export async function updatePartnerStripeAccount(
  partnerId: string,
  input: { stripeAccountId: string; status?: string }
) {
  const result = await sql`
    UPDATE partners
    SET
      stripe_account_id = ${input.stripeAccountId},
      stripe_account_status = COALESCE(${input.status || null}, stripe_account_status),
      stripe_connected_at = COALESCE(stripe_connected_at, NOW()),
      updated_at = NOW()
    WHERE id = ${partnerId}
    RETURNING *
  ` as unknown as any[]

  return result[0] || null
}

export async function getPartnerTransfers(partnerId: string, limit = 20, offset = 0) {
  const transfers = await sql`
    SELECT *
    FROM partner_transfers
    WHERE partner_id = ${partnerId}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  ` as unknown as any[]

  const totalResult = await sql`
    SELECT COUNT(*)::int as count
    FROM partner_transfers
    WHERE partner_id = ${partnerId}
  ` as unknown as Array<{ count: number }>

  return { transfers, total: totalResult[0]?.count || 0 }
}

// ============================================
// NOTIFICATIONS (used by /api/notifications/*)
// ============================================

export async function getUserNotifications(userId: string, limit = 20, unreadOnly = false) {
  const result = await sql`
    SELECT *
    FROM notifications
    WHERE user_id = ${userId}
      AND (${unreadOnly} = false OR read = false)
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as unknown as any[]

  return result
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const result = await sql`
    SELECT COUNT(*)::int as count
    FROM notifications
    WHERE user_id = ${userId} AND read = false
  ` as unknown as Array<{ count: number }>
  return result[0]?.count || 0
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await sql`
    UPDATE notifications
    SET read = true, read_at = NOW()
    WHERE user_id = ${userId} AND read = false
    RETURNING id
  ` as unknown as any[]
  return result.length
}

export async function markNotificationRead(notificationId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE notifications
    SET read = true, read_at = NOW()
    WHERE id = ${notificationId} AND user_id = ${userId}
    RETURNING id
  ` as unknown as any[]
  return result.length > 0
}

// ============================================
// ADMIN CONSULTATIONS (used by /api/admin/consultations/[id])
// ============================================

export async function updateConsultation(
  consultationId: string,
  updates: Partial<Pick<Consultation, 'status' | 'notes' | 'scheduled_at'>>
) {
  const result = await sql`
    UPDATE consultations
    SET
      status = COALESCE(${updates.status || null}, status),
      notes = COALESCE(${updates.notes || null}, notes),
      scheduled_at = COALESCE(${(updates.scheduled_at as any) || null}, scheduled_at),
      updated_at = NOW()
    WHERE id = ${consultationId}
    RETURNING *
  ` as unknown as Consultation[]

  return result[0] || null
}

// ============================================
// LEGACY ADMIN ANALYTICS (used by app/admin/analytics/page-old.tsx)
// ============================================

export async function getAnalyticsStats(): Promise<{
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  conversionRate: number
  avgOrderValue: number
  customerLTV: number
  activeRate: number
  newCustomersThisMonth: number
}> {
  // Provide safe defaults; compute what we can from existing tables.
  const ordersAgg = await sql`
    SELECT
      COUNT(*)::int as total_orders,
      COALESCE(SUM(total), 0)::float as total_revenue,
      COALESCE(AVG(total), 0)::float as avg_order_value
    FROM orders
    WHERE status IN ('paid', 'processing', 'completed')
  ` as unknown as any[]

  const usersAgg = await sql`
    SELECT COUNT(*)::int as total_customers
    FROM users
    WHERE role = 'user'
  ` as unknown as any[]

  const thisMonthAgg = await sql`
    SELECT COUNT(*)::int as new_customers
    FROM users
    WHERE role = 'user' AND created_at >= DATE_TRUNC('month', NOW())
  ` as unknown as any[]

  const totalOrders = ordersAgg[0]?.total_orders || 0
  const totalRevenue = ordersAgg[0]?.total_revenue || 0
  const avgOrderValue = ordersAgg[0]?.avg_order_value || 0
  const totalCustomers = usersAgg[0]?.total_customers || 0

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    conversionRate: 0,
    avgOrderValue,
    customerLTV: 0,
    activeRate: 0,
    newCustomersThisMonth: thisMonthAgg[0]?.new_customers || 0,
  }
}

export async function getMonthlyRevenueTrend(): Promise<Array<{ month: string; revenue: number }>> {
  // Minimal, safe: return last 12 months revenue totals if possible.
  const result = await sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month,
      COALESCE(SUM(total), 0)::float as revenue
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '12 months'
      AND status IN ('paid', 'processing', 'completed')
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) ASC
  ` as unknown as any[]

  return result.map((r) => ({ month: String(r.month), revenue: Number(r.revenue || 0) }))
}

export async function getDailyOrdersTrend(): Promise<Array<{ date: string; orders: number; revenue: number }>> {
  const result = await sql`
    SELECT
      TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::int as orders,
      COALESCE(SUM(total), 0)::float as revenue
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  ` as unknown as any[]

  return result.map((r) => ({
    date: String(r.date),
    orders: Number(r.orders || 0),
    revenue: Number(r.revenue || 0),
  }))
}

export async function getTopPartnerPerformance(limit = 5): Promise<any[]> {
  const result = await sql`
    SELECT *
    FROM partners
    ORDER BY COALESCE(total_earnings, 0) DESC
    LIMIT ${limit}
  ` as unknown as any[]
  return result
}
