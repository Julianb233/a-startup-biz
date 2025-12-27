# A Startup Biz - Site Architecture Documentation

## Architecture Overview

This document describes the complete site architecture for **A Startup Biz**, a business consulting platform with an affiliate/referral partner network.

### Business Model

- **Primary Service**: $1,000 clarity calls (30-min Zoom sessions with Tory Zweigle)
- **Secondary Service**: Curated network of vetted service providers
- **Revenue Streams**:
  - Direct: Clarity call bookings
  - Indirect: Referral commissions from service providers

### Technology Stack

- **Framework**: Next.js 16.1.0 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4.1.9
- **Authentication**: Clerk (@clerk/nextjs)
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

---

## Clean Architecture Principles

The site follows **Clean Architecture** patterns with clear separation of concerns:

### Layer Structure

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Components, Pages, UI)        │
├─────────────────────────────────────────┤
│        Application Layer                │
│   (Business Logic, Use Cases)           │
├─────────────────────────────────────────┤
│         Domain Layer                    │
│  (Entities, Types, Business Rules)      │
├─────────────────────────────────────────┤
│      Infrastructure Layer               │
│  (API Routes, Database, External APIs)  │
└─────────────────────────────────────────┘
```

### Directory Structure

```
/root/github-repos/a-startup-biz/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── page.tsx              # Homepage
│   │   ├── about/                # About page
│   │   ├── services/             # Services listing
│   │   │   └── [slug]/           # Dynamic service pages
│   │   ├── book-call/            # Clarity call booking
│   │   ├── apply/                # Application form
│   │   ├── how-it-works/         # Process explanation
│   │   └── contact/              # Contact page
│   │
│   ├── partner-portal/           # Protected partner routes
│   │   ├── layout.tsx            # Partner portal layout
│   │   ├── page.tsx              # Login/registration
│   │   ├── dashboard/            # Partner dashboard
│   │   ├── providers/            # Provider directory
│   │   ├── referrals/            # Referral tracking
│   │   ├── earnings/             # Commission tracking
│   │   ├── resources/            # Marketing materials
│   │   └── profile/              # Profile settings
│   │
│   ├── admin/                    # Admin routes (highly protected)
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Admin login
│   │   ├── dashboard/            # Admin overview
│   │   ├── clients/              # Client management
│   │   ├── providers/            # Provider management
│   │   ├── referrals/            # All referrals
│   │   ├── bookings/             # Clarity call bookings
│   │   ├── applications/         # Application review
│   │   ├── analytics/            # Business intelligence
│   │   ├── content/              # Content management
│   │   └── settings/             # System settings
│   │
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── bookings/             # Booking management
│   │   ├── applications/         # Application handling
│   │   ├── providers/            # Provider CRUD
│   │   ├── referrals/            # Referral tracking
│   │   ├── partners/             # Partner operations
│   │   └── admin/                # Admin operations
│   │
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── sitemap.ts                # Dynamic sitemap
│
├── components/                   # React components
│   ├── ui/                       # Base UI components (shadcn)
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   └── sidebar.tsx
│   ├── services/                 # Service components
│   │   ├── service-card.tsx
│   │   ├── service-grid.tsx
│   │   └── service-detail.tsx
│   ├── partners/                 # Partner components
│   │   ├── dashboard-stats.tsx
│   │   ├── referral-table.tsx
│   │   └── earnings-chart.tsx
│   └── admin/                    # Admin components
│       ├── analytics-dashboard.tsx
│       ├── client-table.tsx
│       └── provider-table.tsx
│
├── lib/                          # Shared libraries
│   ├── site-config/              # Site architecture (CORE)
│   │   ├── types.ts              # Type definitions
│   │   ├── services.ts           # Service definitions
│   │   ├── navigation.ts         # Navigation config
│   │   ├── routes.ts             # Route definitions
│   │   └── index.ts              # Central exports
│   ├── utils/                    # Utility functions
│   ├── hooks/                    # Custom React hooks
│   └── api/                      # API client functions
│
├── public/                       # Static assets
│   ├── images/
│   ├── og-images/                # Open Graph images
│   └── icons/
│
└── docs/                         # Documentation
    ├── SITE_ARCHITECTURE.md      # This file
    ├── API_DOCUMENTATION.md      # API reference
    └── DEPLOYMENT.md             # Deployment guide
```

---

## Site Map

### 1. Public Pages (Open Access)

| Route | File Path | Description | Priority |
|-------|-----------|-------------|----------|
| `/` | `app/page.tsx` | Homepage with hero, services overview, CTA | 1.0 |
| `/about` | `app/about/page.tsx` | Tory's story, mission, credentials | 0.9 |
| `/services` | `app/services/page.tsx` | Service categories grid | 0.95 |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | Individual service pages (10 services) | 0.85 |
| `/book-call` | `app/book-call/page.tsx` | $1,000 clarity call booking form | 0.95 |
| `/apply` | `app/apply/page.tsx` | Client application/qualification form | 0.85 |
| `/how-it-works` | `app/how-it-works/page.tsx` | 3-step process explanation | 0.9 |
| `/contact` | `app/contact/page.tsx` | Contact form and information | 0.7 |
| `/become-partner` | `app/become-partner/page.tsx` | Partner program signup | 0.8 |
| `/partner-benefits` | `app/partner-benefits/page.tsx` | Partner program details | 0.7 |

#### Service Category Pages (Dynamic)

1. `/services/ein-filing` - EIN Filing Services
2. `/services/legal` - Business Legal Services
3. `/services/accounting` - Accounting & CFO Services
4. `/services/bookkeeping` - Bookkeeping Services
5. `/services/ai-automation` - AI & Business Automation
6. `/services/crm` - CRM & Sales Systems
7. `/services/website-design` - Website Design & Development
8. `/services/marketing` - Digital Marketing Services
9. `/services/branding` - Brand Identity & Design
10. `/services/business-coaching` - Business Coaching & Consulting

### 2. Partner Portal (Protected - Partner Role)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/partner-portal` | `app/partner-portal/page.tsx` | Login/registration page |
| `/partner-portal/dashboard` | `app/partner-portal/dashboard/page.tsx` | Referral metrics overview |
| `/partner-portal/providers` | `app/partner-portal/providers/page.tsx` | Browse vetted providers |
| `/partner-portal/referrals` | `app/partner-portal/referrals/page.tsx` | Track referral status |
| `/partner-portal/earnings` | `app/partner-portal/earnings/page.tsx` | Commission and payouts |
| `/partner-portal/resources` | `app/partner-portal/resources/page.tsx` | Marketing materials |
| `/partner-portal/profile` | `app/partner-portal/profile/page.tsx` | Account settings |

### 3. Admin Dashboard (Protected - Admin Role)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/admin` | `app/admin/page.tsx` | Admin login |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Business metrics overview |
| `/admin/clients` | `app/admin/clients/page.tsx` | Client account management |
| `/admin/providers` | `app/admin/providers/page.tsx` | Provider network management |
| `/admin/referrals` | `app/admin/referrals/page.tsx` | All referrals tracking |
| `/admin/bookings` | `app/admin/bookings/page.tsx` | Clarity call scheduling |
| `/admin/applications` | `app/admin/applications/page.tsx` | Application review |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | Business intelligence |
| `/admin/content` | `app/admin/content/page.tsx` | Content management |
| `/admin/settings` | `app/admin/settings/page.tsx` | System configuration |

### 4. Legal/Compliance Pages

| Route | File Path | Description |
|-------|-----------|-------------|
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/disclaimer` | `app/disclaimer/page.tsx` | Service disclaimer |

---

## Navigation Structure

### Main Navigation (Header)

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO] About | Services ▼ | How It Works | Contact     │
│                                      [Book Your Call]   │
└─────────────────────────────────────────────────────────┘
```

**Services Dropdown:**
- EIN Filing Services
- Business Legal Services
- Accounting & CFO Services
- AI & Business Automation
- Website Design & Development
- Digital Marketing Services
- Business Coaching & Consulting
- → View All Services

### Footer Navigation

```
┌─────────────────────────────────────────────────────────┐
│  COMPANY          SERVICES           FOR PARTNERS       │
│  - About Us       - EIN Filing       - Partner Login    │
│  - How It Works   - Legal            - Become Partner   │
│  - Contact        - Accounting       - Benefits         │
│  - Careers        - AI Automation                       │
│                   - Marketing        LEGAL              │
│                   - Web Design       - Privacy Policy   │
│                                      - Terms of Service │
│  © 2024 A Startup Biz, LLC          - Disclaimer        │
└─────────────────────────────────────────────────────────┘
```

### Partner Portal Navigation (Sidebar)

```
┌──────────────────────┐
│  🏠 Dashboard        │
│  👥 Vetted Providers │
│  🔗 My Referrals     │
│  💰 Earnings         │
│  📚 Resources        │
│  ⚙️  Profile         │
│  🚪 Logout           │
└──────────────────────┘
```

### Admin Navigation (Sidebar)

```
┌──────────────────────┐
│  🏠 Dashboard        │
│  👤 Clients          │
│  🏢 Providers        │
│  🔗 All Referrals    │
│  📅 Clarity Calls    │
│  📋 Applications     │
│  📊 Analytics        │
│  📝 Content          │
│  ⚙️  Settings        │
│  🚪 Logout           │
└──────────────────────┘
```

---

## Authorization Model

### User Roles Hierarchy

```
PUBLIC (default)
  └── CLIENT (authenticated)
      └── PARTNER (referral network)
          └── ADMIN (full access)
```

### Role Permissions Matrix

| Feature | Public | Client | Partner | Admin |
|---------|--------|--------|---------|-------|
| View services | ✓ | ✓ | ✓ | ✓ |
| Book clarity call | ✓ | ✓ | ✓ | ✓ |
| Submit application | ✓ | ✓ | ✓ | ✓ |
| View providers | - | ✓ | ✓ | ✓ |
| Create referrals | - | - | ✓ | ✓ |
| Track earnings | - | - | ✓ | ✓ |
| Manage clients | - | - | - | ✓ |
| Manage providers | - | - | - | ✓ |
| View analytics | - | - | - | ✓ |

---

## Data Flow Architecture

### Clarity Call Booking Flow

```
User → Book Call Page → Calendly/Stripe → Payment → Confirmation Email
                                         ↓
                               Admin Dashboard ← Notification
                                         ↓
                               Zoom Link Generated
```

### Referral Flow

```
Partner → Select Provider → Create Referral → Client Receives Info
                                            ↓
                               Referral Status: PENDING
                                            ↓
                            Client Books Service → IN_PROGRESS
                                            ↓
                            Service Completed → COMPLETED
                                            ↓
                            Commission Calculated → Partner Earnings
```

### Application Flow

```
User → Submit Application → Admin Review Queue
                                   ↓
                          APPROVED / REJECTED
                                   ↓
                          Email Notification
                                   ↓
                    APPROVED → Create Client Account
```

---

## SEO Architecture

### Meta Data Strategy

Each page includes:
- **Title**: Optimized for search intent
- **Description**: Compelling, keyword-rich (150-160 chars)
- **Keywords**: Relevant service/industry terms
- **Open Graph**: Social sharing images
- **Canonical URL**: Prevents duplicate content

### Sitemap Generation

Dynamic `sitemap.xml` includes:
- All public pages
- All service category pages
- Legal pages
- Excludes: Admin, Partner Portal, Auth pages

### Change Frequencies

- Homepage: Weekly
- Service pages: Monthly
- About/How It Works: Monthly
- Blog posts (future): Weekly
- Legal pages: Yearly

---

## Performance Optimization

### Architectural Patterns

1. **Static Generation**: Public pages pre-rendered at build
2. **ISR (Incremental Static Regeneration)**: Service pages revalidate hourly
3. **Dynamic Rendering**: Protected dashboards render on demand
4. **Edge Functions**: Authentication checks at edge
5. **Image Optimization**: Next.js Image component with CDN

### Caching Strategy

```
┌─────────────────────────────────────────┐
│  CDN (Vercel Edge Network)              │
│  - Static assets (images, CSS, JS)      │
│  - Public pages (stale-while-revalidate)│
├─────────────────────────────────────────┤
│  Application Cache                      │
│  - Service definitions (static)         │
│  - Navigation config (static)           │
│  - Provider data (1 hour TTL)           │
├─────────────────────────────────────────┤
│  Database                               │
│  - User data                            │
│  - Referrals                            │
│  - Bookings                             │
└─────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow (Clerk)

```
User → Sign Up/Sign In → Clerk Auth → JWT Token
                                         ↓
                               Session Cookie (httpOnly)
                                         ↓
                            Middleware validates on each request
                                         ↓
                            Route access granted/denied
```

### Protected Route Middleware

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/about", "/services(.*)", "/book-call", "/apply"],
  ignoredRoutes: ["/api/webhooks(.*)"],
});
```

### API Security

- **Rate Limiting**: 100 requests/minute per IP
- **CORS**: Whitelist approved domains
- **Input Validation**: Zod schemas on all forms
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: React automatic escaping

---

## Scalability Considerations

### Database Architecture

**Recommended: PostgreSQL with Prisma ORM**

```
┌─────────────────┐
│  users          │  1:M relationship with referrals
├─────────────────┤
│  providers      │  M:M with service_categories
├─────────────────┤
│  referrals      │  Links clients → partners → providers
├─────────────────┤
│  bookings       │  Clarity call scheduling
├─────────────────┤
│  applications   │  Client qualification
└─────────────────┘
```

### Horizontal Scaling

- **Vercel**: Auto-scales based on traffic
- **Database**: Connection pooling (PgBouncer)
- **CDN**: Global edge network
- **API Routes**: Serverless functions

### Monitoring & Observability

- **Analytics**: Vercel Analytics + Google Analytics
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Lighthouse CI

---

## Future Enhancements

### Phase 2 Features

1. **Blog/Content Marketing**
   - `/blog` - Article listing
   - `/blog/[slug]` - Individual articles
   - SEO-optimized content

2. **Live Chat**
   - Intercom/Drift integration
   - Pre-qualification chatbot

3. **Commission Automation**
   - Stripe Connect for payouts
   - Automated monthly payments

4. **Provider Self-Service**
   - Provider portal for profile management
   - Lead notifications

5. **Advanced Analytics**
   - Custom reporting dashboards
   - Conversion funnel analysis
   - A/B testing framework

---

## Development Best Practices

### Code Organization

- **One concern per file**: Single Responsibility Principle
- **Type-safe**: 100% TypeScript coverage
- **Component composition**: Atomic design patterns
- **Consistent naming**: kebab-case for files, PascalCase for components

### Git Workflow

```
main (production)
  ├── develop (staging)
  │   ├── feature/service-pages
  │   ├── feature/partner-portal
  │   └── feature/admin-dashboard
  └── hotfix/critical-bug
```

### Testing Strategy

- **Unit Tests**: Component logic (Vitest)
- **Integration Tests**: API routes (Playwright)
- **E2E Tests**: Critical user flows (Playwright)
- **Visual Regression**: UI consistency (Chromatic)

---

## Contact & Support

**Technical Lead**: [Your Name]
**Project Repository**: `/root/github-repos/a-startup-biz`
**Documentation**: `/docs`

For questions or clarifications, refer to:
- `lib/site-config/` - Source of truth for site structure
- This document - High-level architecture
- `API_DOCUMENTATION.md` - API reference (when created)
