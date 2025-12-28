/**
 * Calendar Booking System - Core Business Logic
 *
 * Production-ready booking management with timezone handling, availability calculation,
 * and comprehensive validation using date-fns for date operations
 */

import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  parse,
  parseISO,
  startOfDay,
  endOfDay,
  getDay,
  setHours,
  setMinutes,
} from 'date-fns'
import type {
  AvailabilityConfig,
  AvailabilitySlot,
  Booking,
  TimeSlot,
  WorkingHours,
  ExcludedTimeRange,
  DayOfWeekType,
} from './types'

// ============================================
// CONSTANTS
// ============================================

/**
 * Default working hours (Monday-Friday, 9 AM - 5 PM)
 */
export const DEFAULT_WORKING_HOURS: readonly WorkingHours[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', enabled: true }, // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', enabled: true }, // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', enabled: true }, // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', enabled: true }, // Thursday
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', enabled: true }, // Friday
  { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', enabled: false }, // Saturday
  { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', enabled: false }, // Sunday
] as const

/**
 * Default availability configuration
 */
export const DEFAULT_AVAILABILITY_CONFIG: Omit<AvailabilityConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  workingHours: DEFAULT_WORKING_HOURS,
  slotDuration: 60, // 1 hour slots
  bufferTime: 15, // 15 minutes between appointments
  minAdvanceNotice: 24, // 24 hours minimum notice
  maxAdvanceDays: 90, // 90 days in advance
  timezone: 'America/New_York',
  excludedDates: [],
  excludedTimeRanges: [],
} as const

// ============================================
// TIME UTILITIES
// ============================================

/**
 * Converts a time string (HH:MM) to minutes since midnight
 */
export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Converts minutes since midnight to time string (HH:MM)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Checks if a date string is excluded
 */
export function isDateExcluded(date: Date, excludedDates: readonly string[]): boolean {
  const dateString = format(date, 'yyyy-MM-dd')
  return excludedDates.includes(dateString)
}

/**
 * Checks if a time slot overlaps with any excluded time ranges
 */
export function isTimeRangeExcluded(
  startTime: Date,
  endTime: Date,
  excludedRanges: readonly ExcludedTimeRange[]
): boolean {
  return excludedRanges.some((range) => {
    const rangeStart = parseISO(range.startTime)
    const rangeEnd = parseISO(range.endTime)

    // Check if the slot overlaps with the excluded range
    return (
      (isAfter(startTime, rangeStart) && isBefore(startTime, rangeEnd)) ||
      (isAfter(endTime, rangeStart) && isBefore(endTime, rangeEnd)) ||
      (isBefore(startTime, rangeStart) && isAfter(endTime, rangeEnd))
    )
  })
}

/**
 * Gets working hours for a specific day of week
 */
export function getWorkingHoursForDay(
  dayOfWeek: DayOfWeekType,
  workingHours: readonly WorkingHours[]
): WorkingHours | undefined {
  return workingHours.find((wh) => wh.dayOfWeek === dayOfWeek && wh.enabled)
}

/**
 * Parses time string and sets it on a date
 */
export function setTimeOnDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number)
  return setMinutes(setHours(date, hours), minutes)
}

// ============================================
// AVAILABILITY CALCULATION
// ============================================

/**
 * Generates all possible time slots for a given date based on availability configuration
 */
export function generateTimeSlotsForDay(
  date: Date,
  config: AvailabilityConfig
): readonly TimeSlot[] {
  const dayOfWeek = getDay(date) as DayOfWeekType
  const workingHours = getWorkingHoursForDay(dayOfWeek, config.workingHours)

  // No working hours configured for this day
  if (!workingHours) {
    return []
  }

  // Check if date is excluded
  if (isDateExcluded(date, config.excludedDates)) {
    return []
  }

  const slots: TimeSlot[] = []
  const startTimeMinutes = timeToMinutes(workingHours.startTime)
  const endTimeMinutes = timeToMinutes(workingHours.endTime)

  // Generate slots from start to end of working day
  let currentMinutes = startTimeMinutes

  while (currentMinutes + config.slotDuration <= endTimeMinutes) {
    const slotStart = setTimeOnDate(date, minutesToTime(currentMinutes))
    const slotEnd = addMinutes(slotStart, config.slotDuration)

    // Check if this slot is excluded
    const isExcluded = isTimeRangeExcluded(
      slotStart,
      slotEnd,
      config.excludedTimeRanges
    )

    slots.push({
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      available: !isExcluded,
      timezone: config.timezone,
    })

    // Move to next slot (including buffer time)
    currentMinutes += config.slotDuration + config.bufferTime
  }

  return slots
}

/**
 * Filters out slots that conflict with existing bookings
 */
export function filterAvailableSlots(
  slots: readonly TimeSlot[],
  existingBookings: readonly Booking[]
): readonly TimeSlot[] {
  return slots.map((slot) => {
    const slotStart = parseISO(slot.startTime)
    const slotEnd = parseISO(slot.endTime)

    // Check if this slot conflicts with any existing booking
    const hasConflict = existingBookings.some((booking) => {
      // Only check confirmed and pending bookings
      if (booking.status !== 'confirmed' && booking.status !== 'pending') {
        return false
      }

      const bookingStart = parseISO(booking.startTime)
      const bookingEnd = parseISO(booking.endTime)

      // Check for overlap
      return (
        (isAfter(slotStart, bookingStart) && isBefore(slotStart, bookingEnd)) ||
        (isAfter(slotEnd, bookingStart) && isBefore(slotEnd, bookingEnd)) ||
        (isBefore(slotStart, bookingStart) && isAfter(slotEnd, bookingEnd)) ||
        slotStart.getTime() === bookingStart.getTime()
      )
    })

    return {
      ...slot,
      available: slot.available && !hasConflict,
    }
  })
}

/**
 * Gets available time slots for a date range
 */
export function getAvailableSlots(
  startDate: string,
  endDate: string,
  config: AvailabilityConfig,
  existingBookings: readonly Booking[]
): readonly AvailabilitySlot[] {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  const now = new Date()

  // Apply minimum advance notice
  const minBookingTime = addMinutes(now, config.minAdvanceNotice * 60)

  const allSlots: AvailabilitySlot[] = []
  let currentDate = start

  // Generate slots for each day in the range
  while (isBefore(currentDate, end) || currentDate.getTime() === end.getTime()) {
    const daySlots = generateTimeSlotsForDay(currentDate, config)
    const availableSlots = filterAvailableSlots(daySlots, existingBookings)

    // Filter out past slots and those within minimum notice period
    const futureSlots = availableSlots.filter((slot) => {
      const slotStart = parseISO(slot.startTime)
      return isAfter(slotStart, minBookingTime) && slot.available
    })

    // Convert to AvailabilitySlot format
    futureSlots.forEach((slot) => {
      const slotStart = parseISO(slot.startTime)
      const slotEnd = parseISO(slot.endTime)
      const dayOfWeek = getDay(slotStart) as DayOfWeekType

      allSlots.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
        timezone: config.timezone,
        duration: differenceInMinutes(slotEnd, slotStart),
        capacity: 1, // Single booking per slot (can be extended for multiple capacity)
        metadata: {
          dayOfWeek,
          isToday: format(slotStart, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'),
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        },
      })
    })

    currentDate = addDays(currentDate, 1)
  }

  return allSlots
}

// ============================================
// BOOKING VALIDATION
// ============================================

/**
 * Validates if a booking request is within allowed booking window
 */
export function isWithinBookingWindow(
  startTime: Date,
  config: AvailabilityConfig
): { valid: boolean; reason?: string } {
  const now = new Date()

  // Check minimum advance notice
  const minBookingTime = addMinutes(now, config.minAdvanceNotice * 60)
  if (isBefore(startTime, minBookingTime)) {
    return {
      valid: false,
      reason: `Bookings require at least ${config.minAdvanceNotice} hours advance notice`,
    }
  }

  // Check maximum advance booking
  const maxBookingTime = addDays(now, config.maxAdvanceDays)
  if (isAfter(startTime, maxBookingTime)) {
    return {
      valid: false,
      reason: `Bookings can only be made up to ${config.maxAdvanceDays} days in advance`,
    }
  }

  return { valid: true }
}

/**
 * Validates if a time slot is available for booking
 */
export function isSlotAvailable(
  startTime: Date,
  endTime: Date,
  config: AvailabilityConfig,
  existingBookings: readonly Booking[]
): { available: boolean; reason?: string } {
  const dayOfWeek = getDay(startTime) as DayOfWeekType
  const workingHours = getWorkingHoursForDay(dayOfWeek, config.workingHours)

  // Check if day is configured for bookings
  if (!workingHours) {
    return { available: false, reason: 'Bookings are not available on this day' }
  }

  // Check if date is excluded
  if (isDateExcluded(startTime, config.excludedDates)) {
    return { available: false, reason: 'This date is not available for bookings' }
  }

  // Check if time is excluded
  if (isTimeRangeExcluded(startTime, endTime, config.excludedTimeRanges)) {
    return { available: false, reason: 'This time slot is not available' }
  }

  // Validate booking window
  const windowCheck = isWithinBookingWindow(startTime, config)
  if (!windowCheck.valid) {
    return { available: false, reason: windowCheck.reason }
  }

  // Check if within working hours
  const startMinutes = timeToMinutes(format(startTime, 'HH:mm'))
  const endMinutes = timeToMinutes(format(endTime, 'HH:mm'))
  const workingStartMinutes = timeToMinutes(workingHours.startTime)
  const workingEndMinutes = timeToMinutes(workingHours.endTime)

  if (startMinutes < workingStartMinutes || endMinutes > workingEndMinutes) {
    return {
      available: false,
      reason: `Bookings are only available between ${workingHours.startTime} and ${workingHours.endTime}`,
    }
  }

  // Check for conflicts with existing bookings
  const hasConflict = existingBookings.some((booking) => {
    if (booking.status !== 'confirmed' && booking.status !== 'pending') {
      return false
    }

    const bookingStart = parseISO(booking.startTime)
    const bookingEnd = parseISO(booking.endTime)

    return (
      (isAfter(startTime, bookingStart) && isBefore(startTime, bookingEnd)) ||
      (isAfter(endTime, bookingStart) && isBefore(endTime, bookingEnd)) ||
      (isBefore(startTime, bookingStart) && isAfter(endTime, bookingEnd)) ||
      startTime.getTime() === bookingStart.getTime()
    )
  })

  if (hasConflict) {
    return { available: false, reason: 'This time slot is already booked' }
  }

  return { available: true }
}

// ============================================
// BOOKING MANAGEMENT UTILITIES
// ============================================

/**
 * Calculates the end time for a booking based on slot duration
 */
export function calculateBookingEndTime(startTime: Date, slotDuration: number): Date {
  return addMinutes(startTime, slotDuration)
}

/**
 * Checks if a booking should receive a reminder
 * Returns true if the booking is within 24 hours and reminder hasn't been sent
 */
export function shouldSendReminder(booking: Booking): boolean {
  if (booking.reminderSent || booking.status !== 'confirmed') {
    return false
  }

  const now = new Date()
  const bookingTime = parseISO(booking.startTime)
  const hoursUntilBooking = differenceInMinutes(bookingTime, now) / 60

  // Send reminder if booking is within 24 hours
  return hoursUntilBooking <= 24 && hoursUntilBooking > 0
}

/**
 * Formats booking time for display
 */
export function formatBookingTime(
  startTime: string,
  endTime: string,
  timezone: string
): {
  date: string
  time: string
  dateTime: string
} {
  const start = parseISO(startTime)
  const end = parseISO(endTime)

  return {
    date: format(start, 'EEEE, MMMM d, yyyy'),
    time: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')} ${timezone}`,
    dateTime: `${format(start, 'EEEE, MMMM d, yyyy')} at ${format(start, 'h:mm a')} ${timezone}`,
  }
}

/**
 * Gets next available slot after a given date
 */
export function getNextAvailableSlot(
  afterDate: Date,
  config: AvailabilityConfig,
  existingBookings: readonly Booking[]
): AvailabilitySlot | null {
  const startDate = format(afterDate, 'yyyy-MM-dd')
  const endDate = format(addDays(afterDate, config.maxAdvanceDays), 'yyyy-MM-dd')

  const availableSlots = getAvailableSlots(startDate, endDate, config, existingBookings)

  return availableSlots.length > 0 ? availableSlots[0] : null
}

/**
 * Validates booking duration matches configured slot duration
 */
export function validateBookingDuration(
  startTime: Date,
  endTime: Date,
  config: AvailabilityConfig
): { valid: boolean; reason?: string } {
  const duration = differenceInMinutes(endTime, startTime)

  if (duration !== config.slotDuration) {
    return {
      valid: false,
      reason: `Booking duration must be exactly ${config.slotDuration} minutes`,
    }
  }

  return { valid: true }
}

// ============================================
// EXPORT UTILITY FUNCTIONS
// ============================================

export const BookingUtils = {
  timeToMinutes,
  minutesToTime,
  isDateExcluded,
  isTimeRangeExcluded,
  getWorkingHoursForDay,
  setTimeOnDate,
  generateTimeSlotsForDay,
  filterAvailableSlots,
  getAvailableSlots,
  isWithinBookingWindow,
  isSlotAvailable,
  calculateBookingEndTime,
  shouldSendReminder,
  formatBookingTime,
  getNextAvailableSlot,
  validateBookingDuration,
} as const
