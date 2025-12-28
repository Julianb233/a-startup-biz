/**
 * Calendar Booking System - Type Definitions
 *
 * Comprehensive type system for calendar booking functionality with strict typing
 * Supports timezone handling, availability management, and booking operations
 */

import { z } from 'zod'

// ============================================
// ENUM TYPES
// ============================================

/**
 * Booking status enumeration
 * Tracks the lifecycle of a booking from pending to completion or cancellation
 */
export const BookingStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
} as const

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus]

/**
 * Day of week enumeration
 * Used for recurring availability patterns
 */
export const DayOfWeek = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const

export type DayOfWeekType = typeof DayOfWeek[keyof typeof DayOfWeek]

/**
 * Notification type for booking reminders
 */
export const NotificationType = {
  EMAIL: 'email',
  SMS: 'sms',
  BOTH: 'both',
} as const

export type NotificationTypeType = typeof NotificationType[keyof typeof NotificationType]

// ============================================
// CORE INTERFACES
// ============================================

/**
 * Time slot representation
 * Represents a single bookable time slot with timezone awareness
 */
export interface TimeSlot {
  /** ISO 8601 datetime string in UTC */
  readonly startTime: string
  /** ISO 8601 datetime string in UTC */
  readonly endTime: string
  /** Whether this slot is available for booking */
  readonly available: boolean
  /** Timezone identifier (e.g., 'America/New_York') */
  readonly timezone: string
}

/**
 * Working hours configuration
 * Defines business hours for a specific day of the week
 */
export interface WorkingHours {
  /** Day of the week (0-6, Sunday-Saturday) */
  readonly dayOfWeek: DayOfWeekType
  /** Start time in 24-hour format (HH:MM) */
  readonly startTime: string
  /** End time in 24-hour format (HH:MM) */
  readonly endTime: string
  /** Whether this day is available for bookings */
  readonly enabled: boolean
}

/**
 * Availability configuration
 * Comprehensive settings for calendar availability management
 */
export interface AvailabilityConfig {
  /** Unique identifier for this availability configuration */
  readonly id: string
  /** User ID this availability belongs to (null for system-wide) */
  readonly userId: string | null
  /** Working hours for each day of the week */
  readonly workingHours: readonly WorkingHours[]
  /** Duration of each booking slot in minutes */
  readonly slotDuration: number
  /** Buffer time between appointments in minutes */
  readonly bufferTime: number
  /** Minimum advance notice required in hours */
  readonly minAdvanceNotice: number
  /** Maximum days in advance bookings can be made */
  readonly maxAdvanceDays: number
  /** Default timezone for this calendar */
  readonly timezone: string
  /** Specific dates to exclude (holidays, etc.) */
  readonly excludedDates: readonly string[]
  /** Specific time ranges to exclude (lunch breaks, etc.) */
  readonly excludedTimeRanges: readonly ExcludedTimeRange[]
  /** When this configuration was created */
  readonly createdAt: Date
  /** When this configuration was last updated */
  readonly updatedAt: Date
}

/**
 * Excluded time range
 * Represents a specific time period that should be unavailable
 */
export interface ExcludedTimeRange {
  /** ISO 8601 datetime string */
  readonly startTime: string
  /** ISO 8601 datetime string */
  readonly endTime: string
  /** Reason for exclusion (optional) */
  readonly reason?: string
}

/**
 * Booking record
 * Complete booking information including participant details and metadata
 */
export interface Booking {
  /** Unique booking identifier */
  readonly id: string
  /** User ID who made the booking */
  readonly userId: string
  /** Email address of the booker */
  readonly email: string
  /** Full name of the booker */
  readonly name: string
  /** Phone number (optional) */
  readonly phone?: string
  /** Service/consultation type */
  readonly serviceType: string
  /** ISO 8601 datetime string for appointment start */
  readonly startTime: string
  /** ISO 8601 datetime string for appointment end */
  readonly endTime: string
  /** Timezone for this booking */
  readonly timezone: string
  /** Current booking status */
  readonly status: BookingStatusType
  /** Additional notes or special requests */
  readonly notes?: string
  /** Calendar event ID (Google Calendar, etc.) */
  readonly calendarEventId?: string
  /** Meeting link (Zoom, Google Meet, etc.) */
  readonly meetingLink?: string
  /** Reminder notification settings */
  readonly reminderSent: boolean
  /** Notification preferences */
  readonly notificationType: NotificationTypeType
  /** Metadata for additional information */
  readonly metadata?: Record<string, unknown>
  /** When the booking was created */
  readonly createdAt: Date
  /** When the booking was last updated */
  readonly updatedAt: Date
  /** When the booking was cancelled (if applicable) */
  readonly cancelledAt?: Date
  /** Reason for cancellation */
  readonly cancellationReason?: string
}

/**
 * Booking summary
 * Lightweight booking information for list views
 */
export interface BookingSummary {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly serviceType: string
  readonly startTime: string
  readonly endTime: string
  readonly status: BookingStatusType
  readonly timezone: string
}

/**
 * Availability slot
 * Available time slot with contextual information
 */
export interface AvailabilitySlot {
  readonly startTime: string
  readonly endTime: string
  readonly timezone: string
  readonly duration: number
  /** Number of available slots at this time */
  readonly capacity: number
  /** Metadata about why this slot is available */
  readonly metadata?: {
    readonly dayOfWeek: DayOfWeekType
    readonly isToday: boolean
    readonly isWeekend: boolean
  }
}

// ============================================
// ZOD VALIDATION SCHEMAS
// ============================================

/**
 * Booking status validation schema
 */
export const bookingStatusSchema = z.enum([
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CANCELLED,
  BookingStatus.COMPLETED,
  BookingStatus.NO_SHOW,
])

/**
 * Time string validation (HH:MM format)
 */
export const timeStringSchema = z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
  message: 'Time must be in HH:MM format (24-hour)',
})

/**
 * Timezone validation
 */
export const timezoneSchema = z.string().min(1, 'Timezone is required')

/**
 * Working hours validation schema
 */
export const workingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: timeStringSchema,
  endTime: timeStringSchema,
  enabled: z.boolean(),
}).refine(
  (data) => {
    if (!data.enabled) return true
    const [startHour, startMin] = data.startTime.split(':').map(Number)
    const [endHour, endMin] = data.endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    return endMinutes > startMinutes
  },
  { message: 'End time must be after start time' }
)

/**
 * Excluded time range validation schema
 */
export const excludedTimeRangeSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  reason: z.string().optional(),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  { message: 'End time must be after start time' }
)

/**
 * Availability configuration validation schema
 */
export const availabilityConfigSchema = z.object({
  userId: z.string().nullable(),
  workingHours: z.array(workingHoursSchema).min(1, 'At least one working day must be configured'),
  slotDuration: z.number().min(15).max(480), // 15 minutes to 8 hours
  bufferTime: z.number().min(0).max(120), // 0 to 2 hours
  minAdvanceNotice: z.number().min(0).max(168), // 0 to 1 week
  maxAdvanceDays: z.number().min(1).max(365), // 1 day to 1 year
  timezone: timezoneSchema,
  excludedDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default([]),
  excludedTimeRanges: z.array(excludedTimeRangeSchema).default([]),
})

/**
 * Create booking request validation schema
 */
export const createBookingSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required').max(100),
  phone: z.string().optional(),
  serviceType: z.string().min(1, 'Service type is required'),
  startTime: z.string().datetime('Start time must be a valid ISO 8601 datetime'),
  endTime: z.string().datetime('End time must be a valid ISO 8601 datetime'),
  timezone: timezoneSchema,
  notes: z.string().max(500).optional(),
  notificationType: z.enum([
    NotificationType.EMAIL,
    NotificationType.SMS,
    NotificationType.BOTH,
  ]).default(NotificationType.EMAIL),
  metadata: z.record(z.unknown()).optional(),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  { message: 'End time must be after start time' }
)

/**
 * Update booking request validation schema
 */
export const updateBookingSchema = z.object({
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  timezone: timezoneSchema.optional(),
  status: bookingStatusSchema.optional(),
  notes: z.string().max(500).optional(),
  meetingLink: z.string().url().optional(),
  cancellationReason: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return new Date(data.endTime) > new Date(data.startTime)
    }
    return true
  },
  { message: 'End time must be after start time' }
)

/**
 * Get availability slots request validation schema
 */
export const getAvailabilitySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  timezone: timezoneSchema,
  serviceType: z.string().optional(),
}).refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  { message: 'End date must be on or after start date' }
)

// ============================================
// TYPE EXPORTS FOR INFERRED TYPES
// ============================================

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type GetAvailabilityInput = z.infer<typeof getAvailabilitySchema>
export type AvailabilityConfigInput = z.infer<typeof availabilityConfigSchema>

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Partial booking update
 * Type-safe partial update for booking records
 */
export type PartialBookingUpdate = Partial<Omit<Booking, 'id' | 'userId' | 'createdAt'>>

/**
 * Database booking record
 * Raw database representation with snake_case columns
 */
export interface DbBooking {
  readonly id: string
  readonly user_id: string
  readonly email: string
  readonly name: string
  readonly phone: string | null
  readonly service_type: string
  readonly start_time: string
  readonly end_time: string
  readonly timezone: string
  readonly status: BookingStatusType
  readonly notes: string | null
  readonly calendar_event_id: string | null
  readonly meeting_link: string | null
  readonly reminder_sent: boolean
  readonly notification_type: NotificationTypeType
  readonly metadata: Record<string, unknown> | null
  readonly created_at: Date
  readonly updated_at: Date
  readonly cancelled_at: Date | null
  readonly cancellation_reason: string | null
}

/**
 * Type guard for BookingStatus
 */
export function isBookingStatus(value: unknown): value is BookingStatusType {
  return typeof value === 'string' && Object.values(BookingStatus).includes(value as BookingStatusType)
}

/**
 * Type guard for DayOfWeek
 */
export function isDayOfWeek(value: unknown): value is DayOfWeekType {
  return typeof value === 'number' && value >= 0 && value <= 6
}
