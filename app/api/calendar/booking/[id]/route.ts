/**
 * Calendar Booking API - Individual Booking Management
 *
 * GET /api/calendar/booking/[id] - Get booking details
 * PATCH /api/calendar/booking/[id] - Update booking
 * DELETE /api/calendar/booking/[id] - Cancel booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { parseISO } from 'date-fns'
import {
  updateBookingSchema,
  type Booking,
  type DbBooking,
  BookingStatus,
} from '@/lib/calendar/types'
import {
  isSlotAvailable,
  formatBookingTime,
  DEFAULT_AVAILABILITY_CONFIG,
} from '@/lib/calendar/booking'
import { sendBookingCancellation, sendBookingConfirmation } from '@/lib/email'
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
// GET - Get Booking Details
// ============================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const bookings = await sql`
      SELECT * FROM bookings
      WHERE id = ${id}
      LIMIT 1
    ` as DbBooking[]

    if (bookings.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found',
        },
        { status: 404 }
      )
    }

    const booking = dbBookingToBooking(bookings[0])

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH - Update Booking
// ============================================

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validate request body
    const validatedData = updateBookingSchema.parse(body)

    // Get current booking
    const currentBookings = await sql`
      SELECT * FROM bookings
      WHERE id = ${id}
      LIMIT 1
    ` as DbBooking[]

    if (currentBookings.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found',
        },
        { status: 404 }
      )
    }

    const currentBooking = dbBookingToBooking(currentBookings[0])

    // If rescheduling (changing time), validate new slot
    if (validatedData.startTime || validatedData.endTime) {
      const newStartTime = validatedData.startTime
        ? parseISO(validatedData.startTime)
        : parseISO(currentBooking.startTime)
      const newEndTime = validatedData.endTime
        ? parseISO(validatedData.endTime)
        : parseISO(currentBooking.endTime)

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

      // Get existing bookings excluding current one
      const existingBookings = await sql`
        SELECT * FROM bookings
        WHERE id != ${id}
          AND status IN ('pending', 'confirmed')
          AND (
            (start_time <= ${newEndTime.toISOString()} AND end_time >= ${newStartTime.toISOString()})
          )
      ` as DbBooking[]

      const existingBookingsConverted = existingBookings.map(dbBookingToBooking)

      // Validate new slot
      const availabilityCheck = isSlotAvailable(
        newStartTime,
        newEndTime,
        config,
        existingBookingsConverted
      )

      if (!availabilityCheck.available) {
        return NextResponse.json(
          {
            success: false,
            error: 'New time slot not available',
            reason: availabilityCheck.reason,
          },
          { status: 400 }
        )
      }
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    if (validatedData.startTime !== undefined) {
      updates.push(`start_time = $${paramIndex}`)
      values.push(validatedData.startTime)
      paramIndex++
    }

    if (validatedData.endTime !== undefined) {
      updates.push(`end_time = $${paramIndex}`)
      values.push(validatedData.endTime)
      paramIndex++
    }

    if (validatedData.timezone !== undefined) {
      updates.push(`timezone = $${paramIndex}`)
      values.push(validatedData.timezone)
      paramIndex++
    }

    if (validatedData.status !== undefined) {
      updates.push(`status = $${paramIndex}`)
      values.push(validatedData.status)
      paramIndex++

      // If cancelling, set cancelled_at
      if (validatedData.status === BookingStatus.CANCELLED) {
        updates.push(`cancelled_at = NOW()`)
      }
    }

    if (validatedData.notes !== undefined) {
      updates.push(`notes = $${paramIndex}`)
      values.push(validatedData.notes)
      paramIndex++
    }

    if (validatedData.meetingLink !== undefined) {
      updates.push(`meeting_link = $${paramIndex}`)
      values.push(validatedData.meetingLink)
      paramIndex++
    }

    if (validatedData.cancellationReason !== undefined) {
      updates.push(`cancellation_reason = $${paramIndex}`)
      values.push(validatedData.cancellationReason)
      paramIndex++
    }

    if (validatedData.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex}`)
      values.push(JSON.stringify(validatedData.metadata))
      paramIndex++
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid updates provided',
        },
        { status: 400 }
      )
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`)

    // Execute update
    const updatedBookings = await sql(
      `UPDATE bookings
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      [...values, id]
    ) as DbBooking[]

    const updatedBooking = dbBookingToBooking(updatedBookings[0])

    // Send confirmation email if rescheduled
    if (validatedData.startTime || validatedData.endTime) {
      const formattedTime = formatBookingTime(
        updatedBooking.startTime,
        updatedBooking.endTime,
        updatedBooking.timezone
      )

      sendBookingConfirmation({
        email: updatedBooking.email,
        customerName: updatedBooking.name,
        bookingId: updatedBooking.id,
        serviceType: updatedBooking.serviceType,
        date: formattedTime.date,
        time: formattedTime.time,
        timezone: updatedBooking.timezone,
        meetingLink: updatedBooking.meetingLink,
        notes: updatedBooking.notes,
      }).catch((error) => {
        console.error('Failed to send rescheduling confirmation email:', error)
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully',
    })
  } catch (error) {
    console.error('Error updating booking:', error)

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
        error: 'Failed to update booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE - Cancel Booking
// ============================================

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    const reason = searchParams.get('reason') || undefined

    // Get current booking
    const currentBookings = await sql`
      SELECT * FROM bookings
      WHERE id = ${id}
      LIMIT 1
    ` as DbBooking[]

    if (currentBookings.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found',
        },
        { status: 404 }
      )
    }

    const currentBooking = dbBookingToBooking(currentBookings[0])

    // Update booking to cancelled status
    const cancelledBookings = await sql`
      UPDATE bookings
      SET status = ${BookingStatus.CANCELLED},
          cancelled_at = NOW(),
          cancellation_reason = ${reason ?? null},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as DbBooking[]

    const cancelledBooking = dbBookingToBooking(cancelledBookings[0])

    // Send cancellation email
    const formattedTime = formatBookingTime(
      cancelledBooking.startTime,
      cancelledBooking.endTime,
      cancelledBooking.timezone
    )

    sendBookingCancellation({
      email: cancelledBooking.email,
      customerName: cancelledBooking.name,
      bookingId: cancelledBooking.id,
      serviceType: cancelledBooking.serviceType,
      date: formattedTime.date,
      time: formattedTime.time,
      cancellationReason: cancelledBooking.cancellationReason,
    }).catch((error) => {
      console.error('Failed to send cancellation email:', error)
    })

    return NextResponse.json({
      success: true,
      data: cancelledBooking,
      message: 'Booking cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cancel booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
