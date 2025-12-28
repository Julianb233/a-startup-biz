# Calendar Booking System

Production-ready calendar booking system with timezone support, availability management, and automated email notifications.

## Features

- **Time Zone Support**: Full timezone handling using date-fns
- **Availability Management**: Configurable working hours, slot duration, and buffer times
- **Conflict Detection**: Automatic validation of booking conflicts
- **Email Notifications**: Confirmation, reminder (24h before), and cancellation emails
- **Type Safety**: Comprehensive TypeScript types with Zod validation
- **Database Optimized**: Indexed PostgreSQL tables for fast queries

## Architecture

```
/lib/calendar/
├── types.ts          # TypeScript types and Zod schemas
├── booking.ts        # Core business logic
└── README.md         # This file

/app/api/calendar/
├── booking/
│   ├── route.ts      # POST (create), GET (list)
│   └── [id]/
│       └── route.ts  # GET, PATCH, DELETE (by ID)
└── availability/
    └── route.ts      # GET (slots), POST (config)

/scripts/
└── create-bookings-table.ts  # Database migration
```

## Database Schema

### `bookings` Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  calendar_event_id TEXT,
  meeting_link TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  notification_type TEXT CHECK (notification_type IN ('email', 'sms', 'both')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);
```

### `availability_configs` Table

```sql
CREATE TABLE availability_configs (
  id UUID PRIMARY KEY,
  user_id TEXT UNIQUE,
  working_hours JSONB NOT NULL,
  slot_duration INTEGER NOT NULL,
  buffer_time INTEGER NOT NULL,
  min_advance_notice INTEGER NOT NULL,
  max_advance_days INTEGER NOT NULL,
  timezone TEXT NOT NULL,
  excluded_dates JSONB DEFAULT '[]',
  excluded_time_ranges JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

### Create Booking

```http
POST /api/calendar/booking
Content-Type: application/json

{
  "userId": "user_123",
  "email": "customer@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "serviceType": "Consultation",
  "startTime": "2025-01-15T14:00:00Z",
  "endTime": "2025-01-15T15:00:00Z",
  "timezone": "America/New_York",
  "notes": "Looking forward to discussing my project",
  "notificationType": "email"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user_123",
    "email": "customer@example.com",
    "name": "John Doe",
    "serviceType": "Consultation",
    "startTime": "2025-01-15T14:00:00Z",
    "endTime": "2025-01-15T15:00:00Z",
    "timezone": "America/New_York",
    "status": "confirmed",
    "reminderSent": false,
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-10T10:00:00Z"
  },
  "message": "Booking created successfully"
}
```

### List Bookings

```http
GET /api/calendar/booking?userId=user_123&status=confirmed&limit=20
```

**Query Parameters:**
- `userId` - Filter by user ID
- `email` - Filter by email
- `status` - Filter by status (pending, confirmed, cancelled, completed, no_show)
- `serviceType` - Filter by service type
- `startDate` - Filter bookings starting after this date (ISO 8601)
- `endDate` - Filter bookings starting before this date (ISO 8601)
- `limit` - Number of results (default: 50, max: 100)
- `offset` - Pagination offset (default: 0)

### Get Booking Details

```http
GET /api/calendar/booking/550e8400-e29b-41d4-a716-446655440000
```

### Update Booking (Reschedule)

```http
PATCH /api/calendar/booking/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "startTime": "2025-01-16T14:00:00Z",
  "endTime": "2025-01-16T15:00:00Z",
  "notes": "Updated notes",
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

### Cancel Booking

```http
DELETE /api/calendar/booking/550e8400-e29b-41d4-a716-446655440000?reason=No+longer+needed
```

### Get Available Slots

```http
GET /api/calendar/availability?startDate=2025-01-15&endDate=2025-01-22&timezone=America/New_York
```

**Response:**

```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "startTime": "2025-01-15T14:00:00Z",
        "endTime": "2025-01-15T15:00:00Z",
        "timezone": "America/New_York",
        "duration": 60,
        "capacity": 1,
        "metadata": {
          "dayOfWeek": 3,
          "isToday": false,
          "isWeekend": false
        }
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

### Set Availability Configuration (Admin)

```http
POST /api/calendar/availability
Content-Type: application/json

{
  "userId": null,
  "workingHours": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00", "enabled": true },
    { "dayOfWeek": 2, "startTime": "09:00", "endTime": "17:00", "enabled": true },
    { "dayOfWeek": 3, "startTime": "09:00", "endTime": "17:00", "enabled": true },
    { "dayOfWeek": 4, "startTime": "09:00", "endTime": "17:00", "enabled": true },
    { "dayOfWeek": 5, "startTime": "09:00", "endTime": "17:00", "enabled": true },
    { "dayOfWeek": 6, "startTime": "10:00", "endTime": "14:00", "enabled": false },
    { "dayOfWeek": 0, "startTime": "10:00", "endTime": "14:00", "enabled": false }
  ],
  "slotDuration": 60,
  "bufferTime": 15,
  "minAdvanceNotice": 24,
  "maxAdvanceDays": 90,
  "timezone": "America/New_York",
  "excludedDates": ["2025-12-25", "2026-01-01"],
  "excludedTimeRanges": [
    {
      "startTime": "2025-01-20T12:00:00Z",
      "endTime": "2025-01-20T13:00:00Z",
      "reason": "Lunch break"
    }
  ]
}
```

## Configuration

### Default Availability Settings

```typescript
{
  workingHours: [
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', enabled: true }, // Monday
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', enabled: true }, // Tuesday
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', enabled: true }, // Wednesday
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', enabled: true }, // Thursday
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', enabled: true }, // Friday
    { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', enabled: false }, // Saturday
    { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', enabled: false }, // Sunday
  ],
  slotDuration: 60,      // 1 hour slots
  bufferTime: 15,        // 15 minutes between appointments
  minAdvanceNotice: 24,  // 24 hours minimum notice
  maxAdvanceDays: 90,    // 90 days in advance
  timezone: 'America/New_York',
  excludedDates: [],
  excludedTimeRanges: [],
}
```

## Email Notifications

### Booking Confirmation
Sent immediately when a booking is created.

### Booking Reminder
Sent 24 hours before the appointment (requires a scheduled job/cron).

### Booking Cancellation
Sent when a booking is cancelled.

## Setup Instructions

### 1. Run Database Migration

```bash
# Using npm script
npm run db:migrate

# Or run directly
tsx scripts/create-bookings-table.ts
```

### 2. Configure Email Service

Ensure `RESEND_API_KEY` is set in your `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=A Startup Biz <noreply@astartupbiz.com>
SUPPORT_EMAIL=support@astartupbiz.com
```

### 3. Test the System

```bash
# Test creating a booking
curl -X POST http://localhost:3000/api/calendar/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "email": "test@example.com",
    "name": "Test User",
    "serviceType": "Consultation",
    "startTime": "2025-01-20T14:00:00Z",
    "endTime": "2025-01-20T15:00:00Z",
    "timezone": "America/New_York"
  }'

# Test getting available slots
curl http://localhost:3000/api/calendar/availability?startDate=2025-01-15&endDate=2025-01-22&timezone=America/New_York
```

## Reminder System (Optional)

To send reminder emails 24 hours before appointments, set up a scheduled job:

### Option 1: Vercel Cron Jobs

Create `/app/api/calendar/reminders/route.ts`:

```typescript
import { sql } from '@/lib/db'
import { sendBookingReminder } from '@/lib/email'
import { formatBookingTime } from '@/lib/calendar/booking'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const bookings = await sql`
    SELECT * FROM bookings
    WHERE status = 'confirmed'
      AND reminder_sent = FALSE
      AND start_time > NOW()
      AND start_time <= NOW() + INTERVAL '24 hours'
  `

  for (const booking of bookings) {
    const formattedTime = formatBookingTime(
      booking.start_time,
      booking.end_time,
      booking.timezone
    )

    await sendBookingReminder({
      email: booking.email,
      customerName: booking.name,
      bookingId: booking.id,
      serviceType: booking.service_type,
      date: formattedTime.date,
      time: formattedTime.time,
      timezone: booking.timezone,
      meetingLink: booking.meeting_link,
      notes: booking.notes,
    })

    await sql`
      UPDATE bookings
      SET reminder_sent = TRUE
      WHERE id = ${booking.id}
    `
  }

  return Response.json({ success: true, sent: bookings.length })
}
```

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/calendar/reminders",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Option 2: External Cron Service

Use services like:
- GitHub Actions (scheduled workflows)
- AWS EventBridge
- Google Cloud Scheduler

## Type Safety

All types are fully typed with TypeScript:

```typescript
import type {
  Booking,
  AvailabilitySlot,
  CreateBookingInput,
  UpdateBookingInput,
} from '@/lib/calendar/types'
```

## Validation

All inputs are validated using Zod schemas:

- `createBookingSchema` - Validate booking creation
- `updateBookingSchema` - Validate booking updates
- `getAvailabilitySchema` - Validate availability queries
- `availabilityConfigSchema` - Validate configuration

## Error Handling

All API routes return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "details": "Detailed error message",
  "reason": "Human-readable reason (for availability conflicts)"
}
```

## Performance

- **Indexed Queries**: All common queries use database indexes
- **Pagination**: List endpoints support limit/offset pagination
- **Efficient Checks**: Availability checks only query relevant time ranges
- **Async Emails**: Email sending is non-blocking

## Security Considerations

1. **Input Validation**: All inputs validated with Zod
2. **SQL Injection**: Using parameterized queries via Neon
3. **Timezone Safety**: All times stored in UTC, converted for display
4. **Rate Limiting**: Consider adding rate limiting to public endpoints
5. **Authentication**: Add authentication middleware for production

## Future Enhancements

- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] SMS notifications
- [ ] Multi-capacity slots (group bookings)
- [ ] Recurring availability patterns
- [ ] Payment integration
- [ ] Video call integration (Zoom, Google Meet auto-generation)
- [ ] Booking cancellation policies
- [ ] Waitlist management

## Support

For issues or questions, contact: support@astartupbiz.com
