# Calendar Booking System - Quick Start Guide

This guide will help you get the calendar booking system up and running in minutes.

## Step 1: Run Database Migration

```bash
# From project root
tsx scripts/create-bookings-table.ts
```

Expected output:
```
✅ Bookings table created successfully
✅ Availability configs table created successfully
✅ Indexes created successfully
✅ Triggers created successfully
✅ Default configuration inserted
🎉 Booking system database migration complete!
```

## Step 2: Verify Tables Created

Check that the following tables were created:
- `bookings` - Stores all booking records
- `availability_configs` - Stores availability settings

```bash
# Optional: Verify with database client
psql $DATABASE_URL -c "\dt bookings availability_configs"
```

## Step 3: Test API Endpoints

### Get Available Slots

```bash
curl "http://localhost:3000/api/calendar/availability?startDate=2025-01-20&endDate=2025-01-27&timezone=America/New_York" | jq
```

Expected response:
```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "startTime": "2025-01-20T14:00:00.000Z",
        "endTime": "2025-01-20T15:00:00.000Z",
        "timezone": "America/New_York",
        "duration": 60,
        "capacity": 1
      }
    ],
    "totalSlots": 35,
    "config": {
      "slotDuration": 60,
      "bufferTime": 15,
      "timezone": "America/New_York",
      "minAdvanceNotice": 24
    }
  }
}
```

### Create a Booking

```bash
curl -X POST http://localhost:3000/api/calendar/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_test123",
    "email": "customer@example.com",
    "name": "Jane Smith",
    "phone": "+1-555-123-4567",
    "serviceType": "Initial Consultation",
    "startTime": "2025-01-20T14:00:00Z",
    "endTime": "2025-01-20T15:00:00Z",
    "timezone": "America/New_York",
    "notes": "Looking forward to discussing my business idea"
  }' | jq
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "a3b8c9d0-1234-5678-90ab-cdef12345678",
    "userId": "user_test123",
    "email": "customer@example.com",
    "name": "Jane Smith",
    "serviceType": "Initial Consultation",
    "startTime": "2025-01-20T14:00:00.000Z",
    "endTime": "2025-01-20T15:00:00.000Z",
    "timezone": "America/New_York",
    "status": "confirmed",
    "reminderSent": false
  },
  "message": "Booking created successfully"
}
```

### List User's Bookings

```bash
curl "http://localhost:3000/api/calendar/booking?userId=user_test123" | jq
```

### Get Booking Details

```bash
# Replace with actual booking ID from create response
BOOKING_ID="a3b8c9d0-1234-5678-90ab-cdef12345678"
curl "http://localhost:3000/api/calendar/booking/$BOOKING_ID" | jq
```

### Reschedule a Booking

```bash
curl -X PATCH "http://localhost:3000/api/calendar/booking/$BOOKING_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-01-21T14:00:00Z",
    "endTime": "2025-01-21T15:00:00Z",
    "notes": "Rescheduled to Tuesday"
  }' | jq
```

### Cancel a Booking

```bash
curl -X DELETE "http://localhost:3000/api/calendar/booking/$BOOKING_ID?reason=Customer+request" | jq
```

## Step 4: Customize Availability

Update your business hours and booking settings:

```bash
curl -X POST http://localhost:3000/api/calendar/availability \
  -H "Content-Type: application/json" \
  -d '{
    "userId": null,
    "workingHours": [
      { "dayOfWeek": 1, "startTime": "10:00", "endTime": "18:00", "enabled": true },
      { "dayOfWeek": 2, "startTime": "10:00", "endTime": "18:00", "enabled": true },
      { "dayOfWeek": 3, "startTime": "10:00", "endTime": "18:00", "enabled": true },
      { "dayOfWeek": 4, "startTime": "10:00", "endTime": "18:00", "enabled": true },
      { "dayOfWeek": 5, "startTime": "10:00", "endTime": "16:00", "enabled": true },
      { "dayOfWeek": 6, "startTime": "10:00", "endTime": "14:00", "enabled": false },
      { "dayOfWeek": 0, "startTime": "10:00", "endTime": "14:00", "enabled": false }
    ],
    "slotDuration": 60,
    "bufferTime": 15,
    "minAdvanceNotice": 24,
    "maxAdvanceDays": 90,
    "timezone": "America/New_York",
    "excludedDates": ["2025-12-25", "2026-01-01"],
    "excludedTimeRanges": []
  }' | jq
```

## Step 5: Test Email Notifications

Emails are sent automatically when:
1. ✅ Booking is created (confirmation email)
2. ⏰ 24 hours before appointment (reminder email - requires cron job)
3. ❌ Booking is cancelled (cancellation email)

Check your email (or console logs in development) after creating/cancelling a booking.

## Common Test Scenarios

### Scenario 1: Double Booking Prevention

```bash
# Create first booking
curl -X POST http://localhost:3000/api/calendar/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1",
    "email": "user1@example.com",
    "name": "User One",
    "serviceType": "Consultation",
    "startTime": "2025-01-22T14:00:00Z",
    "endTime": "2025-01-22T15:00:00Z",
    "timezone": "America/New_York"
  }'

# Try to book the same slot (should fail)
curl -X POST http://localhost:3000/api/calendar/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_2",
    "email": "user2@example.com",
    "name": "User Two",
    "serviceType": "Consultation",
    "startTime": "2025-01-22T14:00:00Z",
    "endTime": "2025-01-22T15:00:00Z",
    "timezone": "America/New_York"
  }'
```

Expected error:
```json
{
  "success": false,
  "error": "Slot not available",
  "reason": "This time slot is already booked"
}
```

### Scenario 2: Minimum Advance Notice

```bash
# Try to book within 24 hours (should fail with default config)
TOMORROW=$(date -u -d "+12 hours" +"%Y-%m-%dT14:00:00Z")
curl -X POST http://localhost:3000/api/calendar/booking \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"user_1\",
    \"email\": \"user@example.com\",
    \"name\": \"User\",
    \"serviceType\": \"Consultation\",
    \"startTime\": \"$TOMORROW\",
    \"endTime\": \"$(date -u -d "+13 hours" +"%Y-%m-%dT%H:%M:%SZ")\",
    \"timezone\": \"America/New_York\"
  }"
```

Expected error:
```json
{
  "success": false,
  "error": "Slot not available",
  "reason": "Bookings require at least 24 hours advance notice"
}
```

### Scenario 3: Booking Outside Working Hours

```bash
# Try to book at 8 AM (before 9 AM working hours)
curl -X POST http://localhost:3000/api/calendar/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1",
    "email": "user@example.com",
    "name": "User",
    "serviceType": "Consultation",
    "startTime": "2025-01-22T13:00:00Z",
    "endTime": "2025-01-22T14:00:00Z",
    "timezone": "America/New_York"
  }'
```

Expected error:
```json
{
  "success": false,
  "error": "Slot not available",
  "reason": "Bookings are only available between 09:00 and 17:00"
}
```

## Integration Examples

### React Component Example

```typescript
// app/components/BookingForm.tsx
'use client'

import { useState } from 'react'
import { parseISO, format } from 'date-fns'

export function BookingForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      userId: formData.get('userId'),
      email: formData.get('email'),
      name: formData.get('name'),
      phone: formData.get('phone'),
      serviceType: formData.get('serviceType'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      timezone: 'America/New_York',
      notes: formData.get('notes'),
    }

    try {
      const response = await fetch('/api/calendar/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.reason || result.error)
        return
      }

      alert('Booking confirmed! Check your email.')
      window.location.href = '/dashboard/bookings'
    } catch (err) {
      setError('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  )
}
```

### Server Action Example

```typescript
// app/actions/booking.ts
'use server'

import { sql } from '@/lib/db'
import { createBookingSchema } from '@/lib/calendar/types'

export async function createBooking(data: unknown) {
  const validated = createBookingSchema.parse(data)

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calendar/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validated),
  })

  return response.json()
}
```

## Troubleshooting

### Issue: "Booking created but no email sent"

**Solution:** Check that `RESEND_API_KEY` is set in `.env.local`:

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Issue: "Slot not available" for clearly available slots

**Solution:** Check timezone. Ensure your client is sending times in UTC:

```typescript
// Convert local time to UTC
const localTime = new Date('2025-01-20T14:00:00') // Local time
const utcTime = localTime.toISOString() // "2025-01-20T19:00:00.000Z" (if EST)
```

### Issue: "Database connection error"

**Solution:** Verify `DATABASE_URL` is set:

```bash
echo $DATABASE_URL
```

## Next Steps

1. ✅ Set up reminder email cron job (see README.md)
2. ✅ Add authentication to protect booking endpoints
3. ✅ Customize email templates in `/lib/email.ts`
4. ✅ Add calendar integration (Google Calendar, Outlook)
5. ✅ Build frontend booking interface

## Support

Need help? Check:
- Full documentation: `/lib/calendar/README.md`
- API types: `/lib/calendar/types.ts`
- Email templates: `/lib/email.ts`

For questions: support@astartupbiz.com
