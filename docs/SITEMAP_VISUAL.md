# A Startup Biz - Visual Site Map

## Complete Site Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         A STARTUP BIZ                               │
│                  https://astartupbiz.com                            │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
          ┌──────▼──────┐                 ┌─────▼─────┐
          │   PUBLIC    │                 │ PROTECTED │
          │   ROUTES    │                 │  ROUTES   │
          └──────┬──────┘                 └─────┬─────┘
                 │                               │
    ┌────────────┼────────────┐         ┌────────┼────────┐
    │            │            │         │                 │
┌───▼───┐  ┌────▼────┐  ┌───▼───┐  ┌──▼──────┐    ┌────▼────┐
│ MAIN  │  │SERVICE  │  │ LEGAL │  │ PARTNER │    │  ADMIN  │
│ PAGES │  │ PAGES   │  │ PAGES │  │ PORTAL  │    │ PORTAL  │
└───┬───┘  └────┬────┘  └───┬───┘  └────┬────┘    └────┬────┘
    │           │           │           │              │
    │           │           │           │              │
    ▼           ▼           ▼           ▼              ▼
```

---

## 1. Main Pages (Public)

```
HOME (/)
├─ Hero Section
│  ├─ "Get Unstuck. Build Your Business."
│  ├─ CTA: Book Your $1,000 Call
│  └─ CTA: Apply Now
├─ Services Overview (Grid of 6 featured)
├─ How It Works (3 Steps)
├─ Social Proof (Testimonials)
└─ Final CTA

ABOUT (/about)
├─ Tory's Story
├─ Mission & Values
├─ Credentials & Experience
├─ Photo Gallery
└─ CTA: Book a Call

SERVICES (/services)
├─ All Service Categories (Grid)
│  ├─ EIN Filing
│  ├─ Legal
│  ├─ Accounting
│  ├─ Bookkeeping
│  ├─ AI Automation
│  ├─ CRM
│  ├─ Website Design
│  ├─ Marketing
│  ├─ Branding
│  └─ Business Coaching
└─ CTA: See What You Need

HOW IT WORKS (/how-it-works)
├─ Step 1: Book Clarity Call
├─ Step 2: Get Matched with Providers
├─ Step 3: Build Your Business
└─ CTA: Start Your Journey

BOOK CALL (/book-call)
├─ Calendly Integration
├─ Pricing: $1,000 (30 min Zoom)
├─ What to Expect
├─ Stripe Payment Form
└─ Confirmation Flow

APPLY (/apply)
├─ Qualification Questions
│  ├─ Business Name
│  ├─ Industry
│  ├─ Revenue Stage
│  ├─ Team Size
│  ├─ Challenges (multi-select)
│  └─ Goals
├─ Submit for Review
└─ Confirmation Email

CONTACT (/contact)
├─ Contact Form
├─ Email: hello@astartupbiz.com
├─ Phone: +1 (949) 806-4468
├─ Social Links
└─ Office Address

BECOME PARTNER (/become-partner)
├─ Partner Program Benefits
├─ Commission Structure
├─ Success Stories
├─ Application Form
└─ FAQ

PARTNER BENEFITS (/partner-benefits)
├─ Commission Tiers
│  ├─ Bronze: 15%
│  ├─ Silver: 20%
│  ├─ Gold: 25%
│  └─ Platinum: 30%
├─ Marketing Support
├─ Training Resources
└─ CTA: Join Now
```

---

## 2. Service Detail Pages (Dynamic)

```
/services/[slug]
├─ Service Overview
├─ Key Benefits (Bulleted)
├─ What's Included
├─ Vetted Provider Count
├─ Average Commission Rate
├─ Provider Showcase (Top 3)
├─ Related Services
├─ Pricing Range
└─ CTA: View All Providers (requires auth)

Example Service Pages:
├─ /services/ein-filing
├─ /services/legal
├─ /services/accounting
├─ /services/bookkeeping
├─ /services/ai-automation
├─ /services/crm
├─ /services/website-design
├─ /services/marketing
├─ /services/branding
└─ /services/business-coaching
```

---

## 3. Partner Portal (Protected)

```
PARTNER PORTAL (/partner-portal)
├─ LOGIN PAGE
│  ├─ Email/Password
│  ├─ "Forgot Password?"
│  └─ "Don't have an account? Apply"
│
├─ DASHBOARD (/partner-portal/dashboard)
│  ├─ Quick Stats
│  │  ├─ Total Referrals
│  │  ├─ Active Referrals
│  │  ├─ Completed Referrals
│  │  └─ Total Earnings
│  ├─ Recent Activity Feed
│  ├─ Top Performing Services
│  └─ Quick Actions
│
├─ PROVIDERS (/partner-portal/providers)
│  ├─ Search & Filter
│  │  ├─ By Category
│  │  ├─ By Commission Rate
│  │  └─ By Tier
│  ├─ Provider Cards (Grid)
│  │  ├─ Logo
│  │  ├─ Name
│  │  ├─ Category
│  │  ├─ Commission: XX%
│  │  ├─ Tier Badge
│  │  └─ "Refer Client" Button
│  └─ Provider Detail Modal
│
├─ REFERRALS (/partner-portal/referrals)
│  ├─ Referral Table
│  │  ├─ Client Name
│  │  ├─ Provider
│  │  ├─ Service Category
│  │  ├─ Status Badge
│  │  ├─ Commission Amount
│  │  └─ Created Date
│  ├─ Filter by Status
│  │  ├─ Pending
│  │  ├─ In Progress
│  │  ├─ Completed
│  │  └─ Cancelled
│  └─ Create New Referral
│
├─ EARNINGS (/partner-portal/earnings)
│  ├─ Total Earnings (Lifetime)
│  ├─ This Month
│  ├─ Last Month
│  ├─ Earnings Chart (12 months)
│  ├─ Payout History Table
│  │  ├─ Date
│  │  ├─ Amount
│  │  ├─ Method
│  │  └─ Status
│  └─ Commission Breakdown by Service
│
├─ RESOURCES (/partner-portal/resources)
│  ├─ Marketing Materials
│  │  ├─ Brand Guidelines
│  │  ├─ Logo Downloads
│  │  ├─ Email Templates
│  │  └─ Social Media Graphics
│  ├─ Training Videos
│  ├─ Best Practices Guide
│  └─ Affiliate Links
│
└─ PROFILE (/partner-portal/profile)
   ├─ Personal Information
   ├─ Payment Method Setup
   ├─ Notification Preferences
   ├─ Change Password
   └─ Account Settings
```

---

## 4. Admin Dashboard (Protected - Admin Only)

```
ADMIN (/admin)
├─ LOGIN PAGE
│  ├─ Email/Password
│  └─ 2FA (Optional)
│
├─ DASHBOARD (/admin/dashboard)
│  ├─ Key Metrics
│  │  ├─ Total Revenue (Month)
│  │  ├─ Clarity Calls Booked
│  │  ├─ Active Clients
│  │  ├─ Total Referrals
│  │  └─ Partner Count
│  ├─ Revenue Chart (YTD)
│  ├─ Recent Bookings
│  ├─ Pending Applications
│  └─ System Health Status
│
├─ CLIENTS (/admin/clients)
│  ├─ Client Table
│  │  ├─ Name
│  │  ├─ Email
│  │  ├─ Business
│  │  ├─ Status
│  │  ├─ Referrals Count
│  │  └─ Actions
│  ├─ Add New Client
│  ├─ Export to CSV
│  └─ Client Detail View
│     ├─ Contact Info
│     ├─ Clarity Call History
│     ├─ Referral History
│     ├─ Notes
│     └─ Timeline
│
├─ PROVIDERS (/admin/providers)
│  ├─ Provider Table
│  │  ├─ Name
│  │  ├─ Category
│  │  ├─ Tier
│  │  ├─ Commission Rate
│  │  ├─ Referrals Count
│  │  ├─ Vetted Status
│  │  └─ Actions
│  ├─ Add New Provider
│  ├─ Bulk Import
│  └─ Provider Detail View
│     ├─ Company Info
│     ├─ Services Offered
│     ├─ Pricing
│     ├─ Commission Agreement
│     ├─ Performance Metrics
│     └─ Edit/Deactivate
│
├─ REFERRALS (/admin/referrals)
│  ├─ All Referrals Table
│  │  ├─ Client
│  │  ├─ Partner
│  │  ├─ Provider
│  │  ├─ Service
│  │  ├─ Status
│  │  ├─ Commission
│  │  ├─ Created Date
│  │  └─ Actions
│  ├─ Filter Options
│  │  ├─ By Status
│  │  ├─ By Partner
│  │  ├─ By Service Category
│  │  └─ By Date Range
│  ├─ Export Report
│  └─ Referral Detail View
│
├─ BOOKINGS (/admin/bookings)
│  ├─ Calendar View
│  ├─ Upcoming Calls
│  ├─ Booking Table
│  │  ├─ Client Name
│  │  ├─ Email
│  │  ├─ Phone
│  │  ├─ Scheduled Date/Time
│  │  ├─ Zoom Link
│  │  ├─ Payment Status
│  │  └─ Status
│  ├─ Mark as Completed/No-Show
│  └─ Booking Details
│     ├─ Client Info
│     ├─ Challenges (pre-call form)
│     ├─ Call Notes (post-call)
│     └─ Follow-up Actions
│
├─ APPLICATIONS (/admin/applications)
│  ├─ Pending Applications
│  ├─ Application Table
│  │  ├─ Business Name
│  │  ├─ Industry
│  │  ├─ Revenue Stage
│  │  ├─ Submitted Date
│  │  ├─ Status
│  │  └─ Actions
│  ├─ Review Application
│  │  ├─ Full Application Details
│  │  ├─ Approve/Reject Buttons
│  │  └─ Add Notes
│  └─ Application History
│
├─ ANALYTICS (/admin/analytics)
│  ├─ Revenue Dashboard
│  │  ├─ Clarity Call Revenue
│  │  ├─ Referral Commission Revenue
│  │  └─ Revenue Breakdown Chart
│  ├─ Conversion Funnels
│  │  ├─ Website → Application
│  │  ├─ Application → Client
│  │  └─ Client → Referral
│  ├─ Partner Performance
│  │  ├─ Top Partners by Revenue
│  │  ├─ Partner Activity Chart
│  │  └─ Commission Paid (Total)
│  ├─ Service Category Performance
│  │  ├─ Most Referred Services
│  │  ├─ Revenue by Category
│  │  └─ Provider Utilization
│  └─ Custom Date Ranges
│
├─ CONTENT (/admin/content)
│  ├─ Manage Pages
│  │  ├─ Homepage
│  │  ├─ About
│  │  ├─ Services
│  │  └─ How It Works
│  ├─ Edit Service Descriptions
│  ├─ Testimonials
│  ├─ FAQs
│  └─ Blog Posts (Future)
│
└─ SETTINGS (/admin/settings)
   ├─ General Settings
   │  ├─ Site Name
   │  ├─ Contact Information
   │  └─ Business Details
   ├─ Integration Settings
   │  ├─ Stripe (Payment)
   │  ├─ Calendly (Booking)
   │  ├─ Email Provider
   │  └─ CRM
   ├─ Commission Tiers
   ├─ Email Templates
   ├─ User Management
   │  ├─ Admin Users
   │  └─ Permissions
   └─ System Logs
```

---

## 5. Legal Pages

```
PRIVACY (/privacy)
├─ Privacy Policy
├─ Data Collection Practices
├─ Cookie Policy
└─ GDPR Compliance

TERMS (/terms)
├─ Terms of Service
├─ User Agreement
├─ Service Level Agreement
└─ Refund Policy

DISCLAIMER (/disclaimer)
├─ Service Disclaimer
├─ Referral Disclosure
└─ Liability Limitations
```

---

## Navigation Flow Chart

```
┌─────────────┐
│   VISITOR   │
└──────┬──────┘
       │
       ├─► View Services → Select Service → View Providers (Auth Required)
       │                                              │
       │                                              ▼
       │                                      ┌───────────────┐
       │                                      │   SIGN UP     │
       │                                      └───────┬───────┘
       │                                              │
       ├─► Book Clarity Call → Pay $1,000 ───────────┤
       │                                              │
       ├─► Apply → Submit Form ──────────────────────┤
       │                                              │
       └─► Learn About Partners → Become Partner ────┤
                                                      │
                                                      ▼
                                              ┌───────────────┐
                                              │  CLIENT/      │
                                              │  PARTNER      │
                                              └───────┬───────┘
                                                      │
                                      ┌───────────────┼───────────────┐
                                      │                               │
                                ┌─────▼─────┐                  ┌──────▼──────┐
                                │  CLIENT   │                  │   PARTNER   │
                                │  PORTAL   │                  │   PORTAL    │
                                └───────────┘                  └──────┬──────┘
                                                                      │
                                                        ┌─────────────┼─────────────┐
                                                        │             │             │
                                                   Browse       Create        Track
                                                   Providers    Referrals    Earnings
```

---

## User Journey Examples

### Journey 1: First-Time Visitor → Clarity Call

```
1. Land on Homepage
2. Read "How It Works"
3. Click "Book Your Call" (Header CTA)
4. Select date/time on Calendly
5. Pay $1,000 via Stripe
6. Receive confirmation email with Zoom link
7. Attend 30-min clarity call
8. Receive follow-up email with next steps
```

### Journey 2: Client → Service Provider Referral

```
1. Client logs into Partner Portal (or Client applies → gets approved)
2. Navigate to "Vetted Providers"
3. Filter by service category (e.g., "Legal")
4. Browse provider cards
5. Click "Refer Client" on preferred provider
6. Referral created with status: PENDING
7. Client receives provider contact info
8. Client books service with provider
9. Referral status → IN_PROGRESS
10. Service completed → COMPLETED
11. Commission calculated and added to Partner earnings
```

### Journey 3: Partner → Earning Commission

```
1. Become Partner (Apply → Approved)
2. Log into Partner Portal
3. Access provider directory
4. Create referrals for clients
5. Track referral status
6. View earnings dashboard
7. Receive monthly payout
```

---

## Quick Reference: File Paths

### Configuration Files
- **Types**: `/lib/site-config/types.ts`
- **Services**: `/lib/site-config/services.ts`
- **Navigation**: `/lib/site-config/navigation.ts`
- **Routes**: `/lib/site-config/routes.ts`
- **Site Config**: `/lib/site-config/index.ts`

### Key Pages
- **Homepage**: `/app/page.tsx`
- **Sitemap**: `/app/sitemap.ts`
- **Root Layout**: `/app/layout.tsx`

### Documentation
- **Architecture**: `/docs/SITE_ARCHITECTURE.md`
- **Visual Sitemap**: `/docs/SITEMAP_VISUAL.md`

---

## Total Page Count

- **Public Pages**: 10
- **Service Detail Pages**: 10 (dynamic)
- **Partner Portal Pages**: 7
- **Admin Pages**: 10
- **Legal Pages**: 3

**Total: 40 pages**
