/**
 * Calendar Availability API Routes
 *
 * GET /api/calendar/availability - Get available time slots
 * POST /api/calendar/availability - Set availability configuration (admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import {
  getAvailabilitySchema,
  availabilityConfigSchema,
  type Booking,
  type DbBooking,
  type AvailabilityConfig,
} from '@/lib/calendar/types'
import {
  getAvailableSlots,
  DEFAULT_AVAILABILITY_CONFIG,
} from '@/lib/calendar/booking'
import { ZodError } from 'zod'

// ============================================
// TYPE CONVERTERS
// ============================================

function dbBookingToBooking(db: DbBooking): Booking {
  return {
    id: db.id,
    userId: db.user_id,
    email: db.email,
    name: db.name,
    phone: db.phone ?? undefined,
    serviceType: db.service_type,
    startTime: db.start_time,
    endTime: db.end_time,
    timezone: db.timezone,
    status: db.status,
    notes: db.notes ?? undefined,
    calendarEventId: db.calendar_event_id ?? undefined,
    meetingLink: db.meeting_link ?? undefined,
    reminderSent: db.reminder_sent,
    notificationType: db.notification_type,
    metadata: db.metadata ?? undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    cancelledAt: db.cancelled_at ?? undefined,
    cancellationReason: db.cancellation_reason ?? undefined,
  }
}

// ============================================
// GET - Get Available Slots
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const timezone = searchParams.get('timezone') || 'America/New_York'
    const serviceType = searchParams.get('serviceType')

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'startDate and endDate are required',
        },
        { status: 400 }
      )
    }

    // Validate request
    const validatedData = getAvailabilitySchema.parse({
      startDate,
      endDate,
      timezone,
      serviceType,
    })

    // Get availability configuration
    const configResults = await sql`
      SELECT * FROM availability_configs
      WHERE user_id IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    ` as Array<{
      id: string
      user_id: string | null
      working_hours: unknown
      slot_duration: number
      buffer_time: number
      min_advance_notice: number
      max_advance_days: number
      timezone: string
      excluded_dates: unknown
      excluded_time_ranges: unknown
      created_at: Date
      updated_at: Date
    }>

    const config: AvailabilityConfig = configResults.length > 0
      ? {
          id: configResults[0].id,
          userId: configResults[0].user_id,
          workingHours: configResults[0].working_hours as typeof DEFAULT_AVAILABILITY_CONFIG.workingHours,
          slotDuration: configResults[0].slot_duration,
          bufferTime: configResults[0].buffer_time,
          minAdvanceNotice: configResults[0].min_advance_notice,
          maxAdvanceDays: configResults[0].max_advance_days,
          timezone: configResults[0].timezone,
          excludedDates: configResults[0].excluded_dates as string[],
          excludedTimeRanges: configResults[0].excluded_time_ranges as typeof DEFAULT_AVAILABILITY_CONFIG.excludedTimeRanges,
          createdAt: configResults[0].created_at,
          updatedAt: configResults[0].updated_at,
        }
      : {
          id: 'default',
          userId: null,
          ...DEFAULT_AVAILABILITY_CONFIG,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

    // Get existing bookings in the date range
    const existingBookings = await sql`
      SELECT * FROM bookings
      WHERE status IN ('pending', 'confirmed')
        AND start_time >= ${validatedData.startDate}
        AND start_time <= ${validatedData.endDate}
      ORDER BY start_time ASC
    ` as DbBooking[]

    const bookings = existingBookings.map(dbBookingToBooking)

    // Get available slots
    const availableSlots = getAvailableSlots(
      validatedData.startDate,
      validatedData.endDate,
      config,
      bookings
    )

    return NextResponse.json({
      success: true,
      data: {
        slots: availableSlots,
        totalSlots: availableSlots.length,
        config: {
          slotDuration: config.slotDuration,
          bufferTime: config.bufferTime,
          timezone: config.timezone,
          minAdvanceNotice: config.minAdvanceNotice,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching availability:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch availability',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Set Availability Configuration
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = availabilityConfigSchema.parse(body)

    // Check if configuration exists for this user
    const existingConfig = await sql`
      SELECT id FROM availability_configs
      WHERE user_id IS ${validatedData.userId ?? null}
      LIMIT 1
    ` as Array<{ id: string }>

    let result

    if (existingConfig.length > 0) {
      // Update existing configuration
      result = await sql`
        UPDATE availability_configs
        SET working_hours = ${JSON.stringify(validatedData.workingHours)},
            slot_duration = ${validatedData.slotDuration},
            buffer_time = ${validatedData.bufferTime},
            min_advance_notice = ${validatedData.minAdvanceNotice},
            max_advance_days = ${validatedData.maxAdvanceDays},
            timezone = ${validatedData.timezone},
            excluded_dates = ${JSON.stringify(validatedData.excludedDates)},
            excluded_time_ranges = ${JSON.stringify(validatedData.excludedTimeRanges)},
            updated_at = NOW()
        WHERE id = ${existingConfig[0].id}
        RETURNING *
      ` as Array<{
        id: string
        user_id: string | null
        working_hours: unknown
        slot_duration: number
        buffer_time: number
        min_advance_notice: number
        max_advance_days: number
        timezone: string
        excluded_dates: unknown
        excluded_time_ranges: unknown
        created_at: Date
        updated_at: Date
      }>
    } else {
      // Create new configuration
      result = await sql`
        INSERT INTO availability_configs (
          user_id,
          working_hours,
          slot_duration,
          buffer_time,
          min_advance_notice,
          max_advance_days,
          timezone,
          excluded_dates,
          excluded_time_ranges
        ) VALUES (
          ${validatedData.userId ?? null},
          ${JSON.stringify(validatedData.workingHours)},
          ${validatedData.slotDuration},
          ${validatedData.bufferTime},
          ${validatedData.minAdvanceNotice},
          ${validatedData.maxAdvanceDays},
          ${validatedData.timezone},
          ${JSON.stringify(validatedData.excludedDates)},
          ${JSON.stringify(validatedData.excludedTimeRanges)}
        )
        RETURNING *
      ` as Array<{
        id: string
        user_id: string | null
        working_hours: unknown
        slot_duration: number
        buffer_time: number
        min_advance_notice: number
        max_advance_days: number
        timezone: string
        excluded_dates: unknown
        excluded_time_ranges: unknown
        created_at: Date
        updated_at: Date
      }>
    }

    const config: AvailabilityConfig = {
      id: result[0].id,
      userId: result[0].user_id,
      workingHours: result[0].working_hours as typeof DEFAULT_AVAILABILITY_CONFIG.workingHours,
      slotDuration: result[0].slot_duration,
      bufferTime: result[0].buffer_time,
      minAdvanceNotice: result[0].min_advance_notice,
      maxAdvanceDays: result[0].max_advance_days,
      timezone: result[0].timezone,
      excludedDates: result[0].excluded_dates as string[],
      excludedTimeRanges: result[0].excluded_time_ranges as typeof DEFAULT_AVAILABILITY_CONFIG.excludedTimeRanges,
      createdAt: result[0].created_at,
      updatedAt: result[0].updated_at,
    }

    return NextResponse.json(
      {
        success: true,
        data: config,
        message: existingConfig.length > 0
          ? 'Availability configuration updated successfully'
          : 'Availability configuration created successfully',
      },
      { status: existingConfig.length > 0 ? 200 : 201 }
    )
  } catch (error) {
    console.error('Error setting availability:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to set availability',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
