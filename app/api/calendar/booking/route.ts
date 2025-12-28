/**
 * Calendar Booking API - Main Routes
 *
 * POST /api/calendar/booking - Create new booking
 * GET /api/calendar/booking - Get user's bookings
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { parseISO } from 'date-fns'
import {
  createBookingSchema,
  type Booking,
  type DbBooking,
  BookingStatus,
} from '@/lib/calendar/types'
import {
  isSlotAvailable,
  formatBookingTime,
  DEFAULT_AVAILABILITY_CONFIG,
} from '@/lib/calendar/booking'
import { sendBookingConfirmation } from '@/lib/email'
import { ZodError } from 'zod'

// ============================================
// TYPE CONVERTERS
// ============================================

/**
 * Converts database booking record to application booking type
 */
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
// GET - List Bookings
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const serviceType = searchParams.get('serviceType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Build query dynamically based on filters
    const conditions: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    if (userId) {
      conditions.push(`user_id = $${paramIndex}`)
      values.push(userId)
      paramIndex++
    }

    if (email) {
      conditions.push(`email = $${paramIndex}`)
      values.push(email)
      paramIndex++
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`)
      values.push(status)
      paramIndex++
    }

    if (serviceType) {
      conditions.push(`service_type = $${paramIndex}`)
      values.push(serviceType)
      paramIndex++
    }

    if (startDate) {
      conditions.push(`start_time >= $${paramIndex}`)
      values.push(startDate)
      paramIndex++
    }

    if (endDate) {
      conditions.push(`start_time <= $${paramIndex}`)
      values.push(endDate)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Execute query
    const bookings = await sql(
      `SELECT * FROM bookings
       ${whereClause}
       ORDER BY start_time DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    ) as DbBooking[]

    // Get total count for pagination
    const countResult = await sql(
      `SELECT COUNT(*) as total FROM bookings ${whereClause}`,
      values
    ) as Array<{ total: number }>

    const total = Number(countResult[0].total)

    return NextResponse.json({
      success: true,
      data: bookings.map(dbBookingToBooking),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + bookings.length < total,
      },
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Create Booking
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = createBookingSchema.parse(body)

    // Get availability configuration (fetch from DB or use default)
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

    const config = configResults.length > 0
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

    // Get existing bookings for conflict check
    const existingBookings = await sql`
      SELECT * FROM bookings
      WHERE status IN ('pending', 'confirmed')
        AND (
          (start_time <= ${validatedData.endTime} AND end_time >= ${validatedData.startTime})
        )
    ` as DbBooking[]

    const existingBookingsConverted = existingBookings.map(dbBookingToBooking)

    // Validate slot availability
    const startTime = parseISO(validatedData.startTime)
    const endTime = parseISO(validatedData.endTime)

    const availabilityCheck = isSlotAvailable(
      startTime,
      endTime,
      config,
      existingBookingsConverted
    )

    if (!availabilityCheck.available) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slot not available',
          reason: availabilityCheck.reason,
        },
        { status: 400 }
      )
    }

    // Create booking
    const newBooking = await sql`
      INSERT INTO bookings (
        user_id,
        email,
        name,
        phone,
        service_type,
        start_time,
        end_time,
        timezone,
        status,
        notes,
        notification_type,
        metadata
      ) VALUES (
        ${validatedData.userId},
        ${validatedData.email},
        ${validatedData.name},
        ${validatedData.phone ?? null},
        ${validatedData.serviceType},
        ${validatedData.startTime},
        ${validatedData.endTime},
        ${validatedData.timezone},
        ${BookingStatus.CONFIRMED},
        ${validatedData.notes ?? null},
        ${validatedData.notificationType},
        ${JSON.stringify(validatedData.metadata ?? {})}
      )
      RETURNING *
    ` as DbBooking[]

    const booking = dbBookingToBooking(newBooking[0])

    // Format booking time for email
    const formattedTime = formatBookingTime(
      booking.startTime,
      booking.endTime,
      booking.timezone
    )

    // Send confirmation email (async, don't wait)
    sendBookingConfirmation({
      email: booking.email,
      customerName: booking.name,
      bookingId: booking.id,
      serviceType: booking.serviceType,
      date: formattedTime.date,
      time: formattedTime.time,
      timezone: booking.timezone,
      meetingLink: booking.meetingLink,
      notes: booking.notes,
    }).catch((error) => {
      console.error('Failed to send confirmation email:', error)
    })

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message: 'Booking created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)

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
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
