# Partner Portal Backend APIs

Complete backend API implementation for the partner referral program, enabling partners to track leads, manage commissions, and update their profiles.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

## Overview

The Partner Portal Backend provides four main API endpoints:

1. **Dashboard API** - Comprehensive partner statistics and recent activity
2. **Leads API** - Lead management (list, create, update)
3. **Commissions API** - Commission tracking and payout information
4. **Profile API** - Partner settings and payment information

### Key Features

- **Type-safe** - Full TypeScript support with comprehensive type definitions
- **Secure** - Clerk authentication required for all endpoints
- **Performant** - Parallel data fetching and optimized database queries
- **Error handling** - Comprehensive error messages and status codes
- **Auto-calculated stats** - Database triggers maintain accurate statistics

## Architecture

```
/app/api/partner/
├── dashboard/route.ts       # GET - Partner dashboard with stats
├── leads/route.ts           # GET, POST - List and create leads
├── leads/[leadId]/route.ts  # GET, PATCH - View and update specific lead
├── commissions/route.ts     # GET - Commission data
├── profile/route.ts         # GET, PATCH - Profile settings
└── README.md               # This file
```

### Supporting Files

```
/lib/
├── db-queries.ts            # Database query functions
├── types/partner.ts         # TypeScript type definitions
└── clerk-server-safe.ts     # Authentication helper

/scripts/migrations/
└── 002_partner_portal.sql   # Database schema migration
```

## API Endpoints

### 1. Dashboard API

**Endpoint:** `GET /api/partner/dashboard`

**Description:** Returns comprehensive dashboard data including partner info, statistics, and recent leads.

**Response:**
```typescript
{
  partner: {
    id: string
    userId: string
    companyName: string
    status: 'pending' | 'active' | 'suspended' | 'inactive'
    commissionRate: number
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
    totalReferrals: number
    totalEarnings: number
    memberSince: Date
  }
  stats: {
    // Lead metrics
    totalLeads: number
    activeLeads: number
    pendingLeads: number
    contactedLeads: number
    qualifiedLeads: number
    convertedLeads: number
    lostLeads: number
    conversionRate: number

    // Financial metrics
    totalEarnings: number
    pendingCommission: number
    paidCommission: number
    thisMonthEarnings: number
    lastMonthEarnings: number
    earningsGrowth: number
    averageCommission: number

    // Payout information
    nextPayoutDate: Date
    payoutSchedule: string
  }
  recentLeads: Lead[]
  canAccessDashboard: boolean
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (partner account not active)
- `404` - Partner not found
- `500` - Server error

---

### 2. Leads API

#### List Leads

**Endpoint:** `GET /api/partner/leads`

**Query Parameters:**
- `status` (optional) - Filter by lead status
- `limit` (optional) - Number of results (default: 50, max: 100)
- `offset` (optional) - Pagination offset (default: 0)

**Example:**
```
GET /api/partner/leads?status=pending&limit=20&offset=0
```

**Response:**
```typescript
{
  leads: Lead[]
  total: number
  limit: number
  offset: number
}
```

#### Create Lead

**Endpoint:** `POST /api/partner/leads`

**Request Body:**
```typescript
{
  clientName: string       // Required
  clientEmail: string      // Required
  clientPhone?: string     // Optional
  service: string          // Required
  commission: number       // Required
}
```

**Response:**
```typescript
{
  lead: {
    id: string
    clientName: string
    clientEmail: string
    clientPhone: string | null
    service: string
    status: 'pending'
    commission: number
    createdAt: Date
  }
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Missing required fields
- `401` - Unauthorized
- `403` - Partner account not active
- `404` - Partner not found
- `500` - Server error

---

### 3. Lead Detail/Update API

#### Get Lead Details

**Endpoint:** `GET /api/partner/leads/[leadId]`

**Response:**
```typescript
{
  lead: {
    id: string
    clientName: string
    clientEmail: string
    clientPhone: string | null
    service: string
    status: LeadStatus
    commission: number
    commissionPaid: boolean
    createdAt: Date
    convertedAt: Date | null
  }
}
```

#### Update Lead Status

**Endpoint:** `PATCH /api/partner/leads/[leadId]`

**Request Body:**
```typescript
{
  status: 'pending' | 'contacted' | 'qualified' | 'converted' | 'lost'
}
```

**Response:**
```typescript
{
  lead: Lead
  message: string
}
```

**Status Codes:**
- `200` - Updated successfully
- `400` - Invalid status
- `401` - Unauthorized
- `403` - Partner account not active
- `404` - Lead not found or doesn't belong to partner
- `500` - Server error

---

### 4. Commissions API

**Endpoint:** `GET /api/partner/commissions`

**Description:** Returns commission data and payout information.

**Response:**
```typescript
{
  totalEarned: number
  pendingCommission: number
  paidCommission: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  averageCommission: number
  payoutSchedule: 'Monthly'
  nextPayoutDate: Date
  commissionRate: number
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Partner account not active
- `404` - Partner not found
- `500` - Server error

---

### 5. Profile API

#### Get Profile

**Endpoint:** `GET /api/partner/profile`

**Response:**
```typescript
{
  profile: {
    // Basic information
    id: string
    userId: string
    companyName: string
    status: PartnerStatus
    commissionRate: number
    rank: PartnerRank
    memberSince: Date

    // Payment information
    paymentEmail: string | null
    paymentMethod: 'stripe' | 'paypal' | 'bank_transfer' | null
    bankAccountLast4: string | null
    taxId: string | null

    // Contact information
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    website: string | null

    // Address
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string

    // Notification preferences
    notificationsEnabled: boolean
    emailNotifications: boolean
    monthlyReports: boolean
  }
}
```

#### Update Profile

**Endpoint:** `PATCH /api/partner/profile`

**Request Body:** (All fields optional)
```typescript
{
  // Payment Information
  paymentEmail?: string
  paymentMethod?: 'stripe' | 'paypal' | 'bank_transfer'
  bankAccountLast4?: string
  taxId?: string

  // Contact Information
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  website?: string

  // Address
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string

  // Preferences
  notificationsEnabled?: boolean
  emailNotifications?: boolean
  monthlyReports?: boolean
}
```

**Response:**
```typescript
{
  profile: ProfileData
  message: 'Profile updated successfully'
}
```

**Status Codes:**
- `200` - Updated successfully
- `401` - Unauthorized
- `404` - Partner not found
- `500` - Server error

## Authentication

All endpoints require Clerk authentication. The authentication flow:

1. Client sends request with Clerk session token
2. Server validates token using `@/lib/clerk-server-safe`
3. Partner record is fetched using the authenticated `userId`
4. Partner status is checked (must be 'active' for most operations)

**Example:**
```typescript
const { userId } = await auth()
if (!userId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## Database Schema

### Tables

#### partners
```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  company_name VARCHAR(255),
  status VARCHAR(50), -- 'pending', 'active', 'suspended', 'inactive'
  commission_rate DECIMAL(5,2),
  total_referrals INTEGER,
  total_earnings DECIMAL(10,2),
  paid_earnings DECIMAL(10,2),
  pending_earnings DECIMAL(10,2),
  rank VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### partner_leads
```sql
CREATE TABLE partner_leads (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  service VARCHAR(255),
  status VARCHAR(50), -- 'pending', 'contacted', 'qualified', 'converted', 'lost'
  commission DECIMAL(10,2),
  commission_paid BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP,
  converted_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### partner_profiles
```sql
CREATE TABLE partner_profiles (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id) UNIQUE,
  payment_email VARCHAR(255),
  payment_method VARCHAR(50),
  bank_account_last4 VARCHAR(4),
  tax_id VARCHAR(50),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website VARCHAR(500),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  notifications_enabled BOOLEAN,
  email_notifications BOOLEAN,
  monthly_reports BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Automatic Statistics Updates

Database triggers automatically update partner statistics when leads change:

- `total_referrals` - Count of all leads
- `total_earnings` - Sum of all converted lead commissions
- `paid_earnings` - Sum of paid commissions
- `pending_earnings` - Sum of unpaid converted commissions

**Trigger:**
```sql
CREATE TRIGGER update_partner_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON partner_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_stats();
```

## Type Definitions

All TypeScript types are defined in `/lib/types/partner.ts`:

```typescript
import type {
  Partner,
  PartnerLead,
  PartnerProfile,
  DashboardResponse,
  LeadsListResponse,
  CommissionsResponse,
  ProfileResponse,
  LeadStatus,
  PartnerStatus
} from '@/lib/types/partner'
```

## Error Handling

### Standard Error Response

```typescript
{
  error: string
  message?: string // Optional detailed message
}
```

### Common Errors

**401 Unauthorized**
```json
{
  "error": "Unauthorized - authentication required"
}
```

**403 Forbidden (Inactive Partner)**
```json
{
  "partner": {
    "id": "...",
    "status": "pending",
    "companyName": "..."
  },
  "message": "Your partner application is pending approval",
  "canAccessDashboard": false
}
```

**404 Not Found**
```json
{
  "error": "Partner account not found",
  "message": "No partner account is associated with this user"
}
```

**400 Bad Request**
```json
{
  "error": "Invalid status",
  "message": "Status must be one of: pending, contacted, qualified, converted, lost"
}
```

**500 Server Error**
```json
{
  "error": "Failed to fetch partner dashboard data",
  "message": "An unexpected error occurred"
}
```

## Usage Examples

### Fetch Dashboard Data

```typescript
const response = await fetch('/api/partner/dashboard', {
  headers: {
    'Authorization': `Bearer ${clerkToken}`
  }
})

const data: DashboardResponse = await response.json()
console.log(`Total Earnings: $${data.stats.totalEarnings}`)
console.log(`Conversion Rate: ${data.stats.conversionRate}%`)
```

### Create a New Lead

```typescript
const newLead = {
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  clientPhone: '555-0123',
  service: 'Website Development',
  commission: 500
}

const response = await fetch('/api/partner/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${clerkToken}`
  },
  body: JSON.stringify(newLead)
})

const result = await response.json()
console.log(`Lead created: ${result.lead.id}`)
```

### Update Lead Status

```typescript
const leadId = 'abc123...'

const response = await fetch(`/api/partner/leads/${leadId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${clerkToken}`
  },
  body: JSON.stringify({ status: 'contacted' })
})

const result = await response.json()
console.log(result.message) // "Lead status updated to contacted"
```

### Update Profile Settings

```typescript
const updates = {
  paymentEmail: 'payments@example.com',
  paymentMethod: 'stripe',
  contactPhone: '555-0199',
  emailNotifications: true
}

const response = await fetch('/api/partner/profile', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${clerkToken}`
  },
  body: JSON.stringify(updates)
})

const result = await response.json()
console.log(result.message) // "Profile updated successfully"
```

## Database Migration

To create the partner tables in your database:

```bash
# Run the migration script
psql $DATABASE_URL -f scripts/migrations/002_partner_portal.sql

# Or using the TypeScript migration runner
npm run db:migrate
```

## Testing

### Manual Testing with curl

```bash
# Dashboard
curl -X GET http://localhost:3000/api/partner/dashboard \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"

# Create Lead
curl -X POST http://localhost:3000/api/partner/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "clientName": "Test Client",
    "clientEmail": "test@example.com",
    "service": "Website Development",
    "commission": 500
  }'

# Update Lead Status
curl -X PATCH http://localhost:3000/api/partner/leads/LEAD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{"status": "contacted"}'
```

## Performance Optimizations

1. **Parallel Data Fetching** - Dashboard uses `Promise.all()` to fetch multiple data sources simultaneously
2. **Database Indexes** - All foreign keys and frequently queried columns are indexed
3. **Automatic Stats** - Database triggers eliminate the need for manual stat calculations
4. **Pagination** - Leads API supports limit/offset for large datasets
5. **Type-safe Queries** - TypeScript ensures correct query parameters at compile-time

## Security Considerations

1. **Authentication Required** - All endpoints verify Clerk authentication
2. **Partner Ownership** - Leads can only be viewed/modified by their owner
3. **Status Validation** - All status updates are validated against allowed values
4. **SQL Injection Prevention** - Parameterized queries via Neon serverless driver
5. **PII Protection** - Sensitive payment info (bank accounts) only shows last 4 digits

## Future Enhancements

- [ ] Webhook notifications for lead status changes
- [ ] CSV export for leads and commissions
- [ ] Advanced filtering (date ranges, service types)
- [ ] Commission payout automation via Stripe Connect
- [ ] Real-time stats using WebSockets
- [ ] Partner tier auto-promotion based on performance
- [ ] Referral link generation and tracking
- [ ] Email templates for lead communication

## Support

For issues or questions:
- Check error responses for detailed messages
- Review database logs for query errors
- Verify partner status is 'active'
- Ensure database migration has been run
- Check Clerk authentication configuration

---

**Built with:** Next.js 16, TypeScript 5, Neon Serverless Postgres, Clerk Auth
