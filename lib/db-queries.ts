import { sql } from "./db"

// Re-export sql for use in API routes
export { sql }

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
