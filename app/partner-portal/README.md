# Partner Portal

A comprehensive affiliate/referral network portal where partners can access vetted service providers and manage referrals.

## Structure

```
/app/partner-portal/
├── page.tsx                    # Login/Register page
├── dashboard/
│   └── page.tsx               # Partner dashboard with stats and quick actions
├── providers/
│   └── page.tsx               # Browse and search vetted service providers
└── referrals/
    └── page.tsx               # Manage all referrals with filtering

/components/
└── partner-layout.tsx         # Shared sidebar layout for partner portal
```

## Pages Overview

### 1. Login/Register (`/partner-portal`)
- Clean authentication interface
- Toggle between Sign In and Become a Partner
- Email/password form with validation
- Orange accent buttons
- Dark background with pattern overlay

### 2. Dashboard (`/partner-portal/dashboard`)
- **Stats Cards:**
  - Total Referrals (127, +12%)
  - Pending (23, 5 this week)
  - Completed (94, +8%)
  - Earnings ($12,450, +$1,200)

- **Quick Actions:**
  - New Referral
  - View Providers
  - All Referrals
  - Earnings Report

- **Recent Referrals Table:**
  - Client name
  - Service type
  - Provider name
  - Status badge
  - Commission amount
  - Date

### 3. Providers (`/partner-portal/providers`)
- **Search & Filter:**
  - Full-text search
  - Category filters (Legal, Accounting, EIN, Websites, Marketing, etc.)
  - Results counter

- **Provider Cards Include:**
  - Company logo/emoji
  - Name with verification badge
  - Star rating and review count
  - Commission amount
  - Description
  - Specialties tags
  - Stats (Completed referrals, Response time, Success rate)
  - "Refer Client" button

- **8 Pre-loaded Providers:**
  1. LegalEase Partners (Legal) - $300
  2. TaxPro Solutions (EIN Filing) - $150
  3. NumbersFirst CPA (Accounting) - $200
  4. WebCraft Studios (Websites) - $500
  5. GrowthHub Marketing (Marketing) - $400
  6. CoverRight Insurance (Insurance) - $250
  7. BizBank Pro (Banking) - $175
  8. HireWise HR (HR Services) - $350

### 4. Referrals (`/partner-portal/referrals`)
- **Summary Stats:**
  - Total Referrals
  - Completed
  - In Progress
  - Total Earned

- **Filtering:**
  - Search by client, service, provider, or ID
  - Status filters with counts (All, Pending, In Progress, Completed, Cancelled)

- **Detailed Table:**
  - Referral ID
  - Client name and email
  - Service type
  - Provider
  - Status with icon
  - Commission
  - Dates (submitted and completed)
  - Actions (View, More options)

## Shared Layout (`partner-layout.tsx`)

### Features:
- **Dark Sidebar:**
  - Gradient from gray-900 to black
  - Orange accent (#ff6a1a) for active items
  - Navigation: Dashboard, Providers, Referrals, Earnings, Settings
  - Logout button
  - Partner email display

- **Top Bar:**
  - Mobile menu toggle
  - "Back to Main Site" link
  - Active status indicator

- **Responsive:**
  - Mobile: Overlay sidebar with backdrop
  - Desktop: Fixed sidebar

## Color Scheme

- **Primary Orange:** `#ff6a1a`
- **Hover Orange:** `#e55f17`
- **Sidebar:** `from-gray-900 to-black`
- **Background:** `bg-gray-50`
- **Cards:** White with subtle shadows
- **Text:** Black/Gray scale

## Tech Stack

- **Framework:** Next.js 15+ with App Router
- **UI:** React 19 with TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** lucide-react

## Status Colors

- **Completed:** Green (bg-green-100, text-green-800)
- **Pending:** Yellow (bg-yellow-100, text-yellow-800)
- **In Progress:** Blue (bg-blue-100, text-blue-800)
- **Cancelled:** Red (bg-red-100, text-red-800)

## Sample Data

All pages include realistic sample data for demonstration:
- 8+ referrals with various statuses
- 8 service providers across different categories
- Commission ranges from $150-$500
- Realistic completion rates (94-99%)

## Next Steps

To make this production-ready, add:

1. **Authentication:**
   - NextAuth.js or similar
   - Session management
   - Protected routes

2. **Backend Integration:**
   - API routes for referrals
   - Database models (Prisma/Drizzle)
   - Provider management system

3. **Additional Features:**
   - Email notifications
   - Earnings/payouts page
   - Settings page
   - Referral tracking codes
   - Analytics dashboard
   - Export functionality

4. **Enhancements:**
   - Real-time status updates
   - File uploads for referrals
   - Notes/messaging system
   - Advanced filtering
   - Bulk actions

## File Paths

All file paths are absolute:
- `/root/github-repos/a-startup-biz/components/partner-layout.tsx`
- `/root/github-repos/a-startup-biz/app/partner-portal/page.tsx`
- `/root/github-repos/a-startup-biz/app/partner-portal/dashboard/page.tsx`
- `/root/github-repos/a-startup-biz/app/partner-portal/providers/page.tsx`
- `/root/github-repos/a-startup-biz/app/partner-portal/referrals/page.tsx`
