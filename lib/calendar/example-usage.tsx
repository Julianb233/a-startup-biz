/**
 * Example React Components for Calendar Booking System
 *
 * These examples demonstrate how to integrate the calendar booking API
 * into your Next.js frontend components.
 */

'use client'

import { useState, useEffect } from 'react'
import { format, parseISO, addDays } from 'date-fns'
import type { AvailabilitySlot, Booking } from './types'

// ============================================
// EXAMPLE 1: Available Slots Viewer
// ============================================

interface AvailabilitySlotsProps {
  serviceType?: string
  timezone?: string
}

export function AvailabilitySlots({
  serviceType,
  timezone = 'America/New_York',
}: AvailabilitySlotsProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true)
        const today = format(new Date(), 'yyyy-MM-dd')
        const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd')

        const params = new URLSearchParams({
          startDate: today,
          endDate: nextWeek,
          timezone,
          ...(serviceType && { serviceType }),
        })

        const response = await fetch(`/api/calendar/availability?${params}`)
        const data = await response.json()

        if (data.success) {
          setSlots(data.data.slots)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError('Failed to load available slots')
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [serviceType, timezone])

  if (loading) return <div>Loading available times...</div>
  if (error) return <div className="error">{error}</div>
  if (slots.length === 0) return <div>No available slots in the next 7 days</div>

  return (
    <div className="availability-slots">
      <h3>Available Times</h3>
      <div className="slots-grid">
        {slots.map((slot) => {
          const startTime = parseISO(slot.startTime)
          const date = format(startTime, 'EEE, MMM d')
          const time = format(startTime, 'h:mm a')

          return (
            <button
              key={slot.startTime}
              className="slot-button"
              onClick={() => {
                // Handle slot selection
                console.log('Selected slot:', slot)
              }}
            >
              <div className="slot-date">{date}</div>
              <div className="slot-time">{time}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// EXAMPLE 2: Booking Form
// ============================================

interface BookingFormProps {
  userId: string
  onSuccess?: (booking: Booking) => void
}

export function BookingForm({ userId, onSuccess }: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    const bookingData = {
      userId,
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      serviceType: formData.get('serviceType') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      timezone: formData.get('timezone') as string,
      notes: formData.get('notes') as string,
      notificationType: 'email' as const,
    }

    try {
      const response = await fetch('/api/calendar/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        onSuccess?.(data.data)
      } else {
        setError(data.reason || data.error)
      }
    } catch (err) {
      setError('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="booking-success">
        <h3>Booking Confirmed!</h3>
        <p>Check your email for confirmation details.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="your@email.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="John Doe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+1-555-123-4567"
        />
      </div>

      <div className="form-group">
        <label htmlFor="serviceType">Service Type *</label>
        <select id="serviceType" name="serviceType" required>
          <option value="">Select a service</option>
          <option value="Initial Consultation">Initial Consultation</option>
          <option value="Follow-up Meeting">Follow-up Meeting</option>
          <option value="Technical Review">Technical Review</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="startTime">Start Time *</label>
        <input
          type="datetime-local"
          id="startTime"
          name="startTime"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endTime">End Time *</label>
        <input
          type="datetime-local"
          id="endTime"
          name="endTime"
          required
        />
      </div>

      <input type="hidden" name="timezone" value="America/New_York" />

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Any additional information..."
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  )
}

// ============================================
// EXAMPLE 3: User's Bookings List
// ============================================

interface UserBookingsProps {
  userId: string
}

export function UserBookings({ userId }: UserBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/calendar/booking?userId=${userId}&limit=20`
        )
        const data = await response.json()

        if (data.success) {
          setBookings(data.data)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError('Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userId])

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      const response = await fetch(`/api/calendar/booking/${bookingId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? data.data : b))
        )
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('Failed to cancel booking')
    }
  }

  if (loading) return <div>Loading your bookings...</div>
  if (error) return <div className="error">{error}</div>
  if (bookings.length === 0) return <div>No bookings found</div>

  return (
    <div className="bookings-list">
      <h3>Your Bookings</h3>
      {bookings.map((booking) => {
        const startTime = parseISO(booking.startTime)
        const endTime = parseISO(booking.endTime)

        return (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h4>{booking.serviceType}</h4>
              <span className={`status-badge status-${booking.status}`}>
                {booking.status}
              </span>
            </div>

            <div className="booking-details">
              <p>
                <strong>Date:</strong> {format(startTime, 'EEEE, MMMM d, yyyy')}
              </p>
              <p>
                <strong>Time:</strong> {format(startTime, 'h:mm a')} -{' '}
                {format(endTime, 'h:mm a')} {booking.timezone}
              </p>
              {booking.meetingLink && (
                <p>
                  <strong>Meeting Link:</strong>{' '}
                  <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                    Join Meeting
                  </a>
                </p>
              )}
              {booking.notes && (
                <p>
                  <strong>Notes:</strong> {booking.notes}
                </p>
              )}
            </div>

            {booking.status === 'confirmed' && (
              <div className="booking-actions">
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="cancel-button"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// EXAMPLE 4: Server Action Example
// ============================================

/**
 * Example server action for creating bookings
 * Place in app/actions/booking.ts
 */

// 'use server'
//
// import { createBookingSchema } from '@/lib/calendar/types'
// import { revalidatePath } from 'next/cache'
//
// export async function createBookingAction(formData: FormData) {
//   const data = {
//     userId: formData.get('userId'),
//     email: formData.get('email'),
//     name: formData.get('name'),
//     phone: formData.get('phone'),
//     serviceType: formData.get('serviceType'),
//     startTime: formData.get('startTime'),
//     endTime: formData.get('endTime'),
//     timezone: formData.get('timezone'),
//     notes: formData.get('notes'),
//     notificationType: 'email',
//   }
//
//   try {
//     const validated = createBookingSchema.parse(data)
//
//     const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calendar/booking`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(validated),
//     })
//
//     const result = await response.json()
//
//     if (result.success) {
//       revalidatePath('/dashboard/bookings')
//       return { success: true, data: result.data }
//     } else {
//       return { success: false, error: result.error, reason: result.reason }
//     }
//   } catch (error) {
//     return { success: false, error: 'Validation failed' }
//   }
// }

// ============================================
// EXAMPLE 5: Type-Safe API Hook
// ============================================

/**
 * Custom hook for type-safe booking API calls
 */

export function useBookingAPI() {
  const createBooking = async (data: {
    userId: string
    email: string
    name: string
    phone?: string
    serviceType: string
    startTime: string
    endTime: string
    timezone: string
    notes?: string
  }): Promise<{ success: boolean; data?: Booking; error?: string; reason?: string }> => {
    const response = await fetch('/api/calendar/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        notificationType: 'email',
      }),
    })

    return response.json()
  }

  const getBookings = async (filters: {
    userId?: string
    email?: string
    status?: string
    limit?: number
  }): Promise<{ success: boolean; data?: Booking[]; error?: string }> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value))
    })

    const response = await fetch(`/api/calendar/booking?${params}`)
    const result = await response.json()

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    }
  }

  const cancelBooking = async (
    bookingId: string,
    reason?: string
  ): Promise<{ success: boolean; data?: Booking; error?: string }> => {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : ''
    const response = await fetch(`/api/calendar/booking/${bookingId}${params}`, {
      method: 'DELETE',
    })

    return response.json()
  }

  const getAvailability = async (
    startDate: string,
    endDate: string,
    timezone = 'America/New_York'
  ): Promise<{ success: boolean; data?: { slots: AvailabilitySlot[] }; error?: string }> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      timezone,
    })

    const response = await fetch(`/api/calendar/availability?${params}`)
    return response.json()
  }

  return {
    createBooking,
    getBookings,
    cancelBooking,
    getAvailability,
  }
}

// ============================================
// USAGE EXAMPLE
// ============================================

/**
 * Example page component using the booking system
 */

// export default function BookingPage() {
//   const userId = 'user_123' // Get from auth
//   const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
//
//   return (
//     <div className="booking-page">
//       <h1>Book an Appointment</h1>
//
//       <div className="booking-layout">
//         <div className="slots-section">
//           <AvailabilitySlots
//             serviceType="Consultation"
//             timezone="America/New_York"
//           />
//         </div>
//
//         <div className="form-section">
//           {selectedSlot ? (
//             <BookingForm
//               userId={userId}
//               onSuccess={(booking) => {
//                 console.log('Booking created:', booking)
//                 window.location.href = '/dashboard/bookings'
//               }}
//             />
//           ) : (
//             <p>Select a time slot to continue</p>
//           )}
//         </div>
//       </div>
//
//       <div className="existing-bookings">
//         <UserBookings userId={userId} />
//       </div>
//     </div>
//   )
// }
