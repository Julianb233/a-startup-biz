# Admin Partner Management System

## Overview
Complete admin partner management system for approving, managing, and paying out partners through the admin dashboard.

## Files Created/Modified

### Database Layer
- `/lib/db-queries-partners.ts` - Partner-specific database queries
  - `getAllPartners()` - List all partners with filters and stats
  - `getPartnerWithDetails()` - Get single partner with full details
  - `updatePartnerStatus()` - Approve/reject/suspend partners
  - `updatePartnerCommissionRate()` - Update commission rates
  - `getPartnerStatsOverview()` - Admin dashboard stats

### API Endpoints

#### GET `/api/admin/partners`
List all partners with filtering:
- Query params: `status`, `search`, `limit`, `offset`
- Returns paginated list with stats
- Filters by status (pending/active/suspended/inactive)
- Search by company name, contact email

#### GET `/api/admin/partners/[id]`
Get single partner details:
- Full partner information
- Lead statistics
- Recent leads (last 10)
- Transfer history (last 20)
- Payout history (last 20)

#### PATCH `/api/admin/partners/[id]`
Update partner:
- Update status (pending → active/inactive)
- Update commission rate
- Logs admin notes for auditing

#### POST `/api/admin/partners/[id]/payout`
Trigger manual payout:
- Creates Stripe payout to partner's connected account
- Validates balance and Stripe status
- Records payout in database
- Returns payout details

### Admin UI Pages

#### `/app/admin/partners/page.tsx`
Partner list page:
- Stats cards (total partners, active, pending, total earnings)
- Search and filter by status
- Partner table with:
  - Company name and email
  - Status badges with icons
  - Lead counts and conversion rate
  - Earnings (total and pending)
  - Stripe connection status
- Pagination
- Click to view partner details

#### `/app/admin/partners/[id]/page.tsx`
Partner detail page:
- Partner header with status badge
- Action buttons:
  - Approve (pending → active)
  - Reject (pending → inactive)
  - Suspend (active → suspended)
  - Reactivate (suspended → active)
- Stats grid:
  - Total leads
  - Converted leads with conversion rate
  - Total earnings
  - Pending payout amount
- Stripe Connect status card:
  - Connection status
  - Available balance
  - Trigger payout button
- Recent leads table
- Payout history table

#### `/app/admin/admin-sidebar.tsx`
Updated navigation:
- Added "Partners" link with Building2 icon
- Positioned between Users and Fulfillment

## Features

### Partner Approval Flow
1. Partner signs up (status: pending)
2. Admin reviews partner details
3. Admin approves → status: active
4. Admin can suspend/reactivate later

### Payout Management
1. System tracks commissions from converted leads
2. Commissions transfer to partner's available balance
3. Admin can trigger manual payouts
4. Validates:
   - Stripe account connected and verified
   - Sufficient balance
   - Minimum payout amount ($1.00)
5. Creates Stripe payout and records in database

### Filtering & Search
- Filter by status: all, pending, active, suspended, inactive
- Search by company name, user name, or email
- Pagination with 20 partners per page

### Statistics & Analytics
- Conversion rate per partner
- Active vs converted leads
- Total earnings vs pending earnings
- Stripe connection status

## Database Schema
Uses existing tables from migrations:
- `partners` - Partner accounts
- `partner_leads` - Lead tracking
- `partner_transfers` - Commission transfers
- `partner_payouts` - Payout history
- `stripe_connect_events` - Webhook logs

## Security
- All endpoints require admin authentication
- Status checks via next-auth session
- SQL injection protection via parameterized queries
- Stripe API key from environment variables

## UI Components Used
- Lucide icons for consistent iconography
- Tailwind CSS for styling
- Status badges with color coding:
  - Pending: yellow
  - Active: green
  - Suspended: red
  - Inactive: gray

## Next Steps
To extend this system:
1. Add bulk actions (approve multiple partners)
2. Email notifications for status changes
3. Advanced filters (date range, commission tier)
4. Export partners to CSV
5. Partner performance charts
6. Automated approval based on criteria
