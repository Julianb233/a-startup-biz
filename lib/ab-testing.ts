import { sql } from '@/lib/db'

/**
 * A/B Testing Feature Flag System
 *
 * Provides simple feature flag functionality with variant assignment,
 * conversion tracking, and experiment management.
 */

export type VariantType = 'control' | 'variant_a' | 'variant_b' | 'variant_c'

export interface Experiment {
  id: string
  name: string
  description?: string
  variants: VariantType[]
  traffic_allocation: Record<VariantType, number> // Percentage allocation per variant
  status: 'draft' | 'active' | 'paused' | 'completed'
  start_date?: Date
  end_date?: Date
  created_at: Date
}

export interface UserVariant {
  experiment_id: string
  user_id: string
  variant: VariantType
  assigned_at: Date
}

export interface Conversion {
  id: string
  experiment_id: string
  user_id: string
  variant: VariantType
  event_type: string
  event_value?: number
  metadata?: Record<string, any>
  converted_at: Date
}

// In-memory storage for experiments (can be moved to database later)
const experiments = new Map<string, Experiment>()
const userVariants = new Map<string, UserVariant>()
const conversions: Conversion[] = []

/**
 * Get or create an experiment
 * @param experimentId - Unique experiment identifier
 * @param config - Experiment configuration (optional, for creation)
 */
export function getOrCreateExperiment(
  experimentId: string,
  config?: Partial<Experiment>
): Experiment {
  if (experiments.has(experimentId)) {
    return experiments.get(experimentId)!
  }

  // Create new experiment with defaults
  const experiment: Experiment = {
    id: experimentId,
    name: config?.name || experimentId,
    description: config?.description,
    variants: config?.variants || ['control', 'variant_a'],
    traffic_allocation: config?.traffic_allocation || {
      control: 50,
      variant_a: 50,
      variant_b: 0,
      variant_c: 0,
    },
    status: config?.status || 'active',
    start_date: config?.start_date || new Date(),
    end_date: config?.end_date,
    created_at: new Date(),
  }

  experiments.set(experimentId, experiment)
  return experiment
}

/**
 * Get user's assigned variant for an experiment
 * Uses deterministic hashing for consistent assignment
 * @param experimentId - Experiment identifier
 * @param userId - User identifier
 * @returns Assigned variant
 */
export function getVariant(experimentId: string, userId: string): VariantType {
  const key = `${experimentId}:${userId}`

  // Check if user already has an assignment
  if (userVariants.has(key)) {
    return userVariants.get(key)!.variant
  }

  // Get or create experiment
  const experiment = getOrCreateExperiment(experimentId)

  // Check if experiment is active
  if (experiment.status !== 'active') {
    return 'control' // Return control for inactive experiments
  }

  // Assign variant based on traffic allocation
  const variant = assignVariant(userId, experiment)

  // Store assignment
  const assignment: UserVariant = {
    experiment_id: experimentId,
    user_id: userId,
    variant,
    assigned_at: new Date(),
  }
  userVariants.set(key, assignment)

  return variant
}

/**
 * Assign variant to user based on deterministic hashing
 * @param userId - User identifier
 * @param experiment - Experiment configuration
 */
function assignVariant(userId: string, experiment: Experiment): VariantType {
  // Simple hash function for deterministic assignment
  const hash = simpleHash(userId + experiment.id)
  const percentage = hash % 100

  // Assign based on traffic allocation
  let cumulative = 0
  for (const variant of experiment.variants) {
    cumulative += experiment.traffic_allocation[variant] || 0
    if (percentage < cumulative) {
      return variant
    }
  }

  // Fallback to control
  return 'control'
}

/**
 * Simple hash function for deterministic assignment
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Track conversion event for an experiment
 * @param experimentId - Experiment identifier
 * @param userId - User identifier
 * @param variant - User's assigned variant
 * @param eventType - Type of conversion event (e.g., 'purchase', 'signup')
 * @param eventValue - Optional numeric value (e.g., revenue amount)
 * @param metadata - Optional additional data
 */
export function trackConversion(
  experimentId: string,
  userId: string,
  variant: VariantType,
  eventType: string = 'conversion',
  eventValue?: number,
  metadata?: Record<string, any>
): void {
  const conversion: Conversion = {
    id: `${experimentId}:${userId}:${Date.now()}`,
    experiment_id: experimentId,
    user_id: userId,
    variant,
    event_type: eventType,
    event_value: eventValue,
    metadata,
    converted_at: new Date(),
  }

  conversions.push(conversion)

  // Optional: Persist to database
  persistConversion(conversion).catch((error) => {
    console.error('Failed to persist conversion:', error)
  })
}

/**
 * Persist conversion to database (if available)
 */
async function persistConversion(conversion: Conversion): Promise<void> {
  try {
    // Create ab_test_conversions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS ab_test_conversions (
        id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        variant TEXT NOT NULL,
        event_type TEXT NOT NULL,
        event_value NUMERIC,
        metadata JSONB,
        converted_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    // Insert conversion
    await sql`
      INSERT INTO ab_test_conversions (
        id, experiment_id, user_id, variant, event_type, event_value, metadata, converted_at
      )
      VALUES (
        ${conversion.id},
        ${conversion.experiment_id},
        ${conversion.user_id},
        ${conversion.variant},
        ${conversion.event_type},
        ${conversion.event_value || null},
        ${JSON.stringify(conversion.metadata || {})},
        ${conversion.converted_at.toISOString()}
      )
    `
  } catch (error) {
    // Silently fail if database not available
    console.warn('Database not available for conversion tracking')
  }
}

/**
 * Get experiment results with conversion metrics
 * @param experimentId - Experiment identifier
 */
export function getExperimentResults(experimentId: string) {
  const experimentConversions = conversions.filter(
    (c) => c.experiment_id === experimentId
  )

  const variantStats: Record<
    string,
    {
      users: number
      conversions: number
      conversion_rate: number
      total_value: number
      average_value: number
    }
  > = {}

  // Count users per variant
  const usersPerVariant: Record<string, Set<string>> = {}
  userVariants.forEach((assignment) => {
    if (assignment.experiment_id === experimentId) {
      if (!usersPerVariant[assignment.variant]) {
        usersPerVariant[assignment.variant] = new Set()
      }
      usersPerVariant[assignment.variant].add(assignment.user_id)
    }
  })

  // Calculate stats for each variant
  Object.keys(usersPerVariant).forEach((variant) => {
    const users = usersPerVariant[variant].size
    const variantConversions = experimentConversions.filter(
      (c) => c.variant === variant
    )
    const conversions_count = new Set(variantConversions.map((c) => c.user_id)).size
    const total_value = variantConversions.reduce(
      (sum, c) => sum + (c.event_value || 0),
      0
    )

    variantStats[variant] = {
      users,
      conversions: conversions_count,
      conversion_rate: users > 0 ? (conversions_count / users) * 100 : 0,
      total_value,
      average_value: conversions_count > 0 ? total_value / conversions_count : 0,
    }
  })

  return {
    experiment: experiments.get(experimentId),
    variants: variantStats,
    total_conversions: experimentConversions.length,
  }
}

/**
 * List all active experiments
 */
export function listExperiments(): Experiment[] {
  return Array.from(experiments.values())
}

/**
 * Update experiment status
 */
export function updateExperimentStatus(
  experimentId: string,
  status: Experiment['status']
): void {
  const experiment = experiments.get(experimentId)
  if (experiment) {
    experiment.status = status
    experiments.set(experimentId, experiment)
  }
}
