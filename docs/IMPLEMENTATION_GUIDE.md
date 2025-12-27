# Implementation Guide - A Startup Biz

## Quick Start

This guide helps you implement the site architecture defined in `/lib/site-config/`.

---

## Step 1: Verify Configuration Files

All configuration files are located in `/root/github-repos/a-startup-biz/lib/site-config/`:

```bash
/lib/site-config/
├── types.ts        ✓ Type definitions
├── services.ts     ✓ Service categories
├── navigation.ts   ✓ Navigation structure
├── routes.ts       ✓ Route definitions
└── index.ts        ✓ Central exports
```

---

## Step 2: Import Site Configuration

In any component or page, import from the central config:

```typescript
// Import types
import { UserRole, ServiceCategory, NavigationItem } from '@/lib/site-config';

// Import navigation
import { MAIN_NAVIGATION, PRIMARY_CTAS, FOOTER_NAVIGATION } from '@/lib/site-config';

// Import services
import { getAllServices, getFeaturedServices, getServiceBySlug } from '@/lib/site-config';

// Import routes
import { getAllRoutes, canAccessRoute, getRouteByPath } from '@/lib/site-config';

// Import site metadata
import { SITE_CONFIG, FEATURE_FLAGS } from '@/lib/site-config';
```

---

## Step 3: Create Components

### Header Component

**File**: `/components/layout/header.tsx`

```typescript
'use client';

import Link from 'next/link';
import { MAIN_NAVIGATION, PRIMARY_CTAS } from '@/lib/site-config';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">A Startup Biz</span>
        </Link>

        {/* Main Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            {MAIN_NAVIGATION.map((item) => (
              <NavigationMenuItem key={item.id}>
                {item.children ? (
                  <>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {child.label}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {child.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium">
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
          <Link href={PRIMARY_CTAS[0].href}>{PRIMARY_CTAS[0].label}</Link>
        </Button>
      </div>
    </header>
  );
}
```

---

### Footer Component

**File**: `/components/layout/footer.tsx`

```typescript
import Link from 'next/link';
import { FOOTER_NAVIGATION, SITE_CONFIG } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{FOOTER_NAVIGATION.company.title}</h3>
            <ul className="space-y-2">
              {FOOTER_NAVIGATION.company.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{FOOTER_NAVIGATION.services.title}</h3>
            <ul className="space-y-2">
              {FOOTER_NAVIGATION.services.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{FOOTER_NAVIGATION.partners.title}</h3>
            <ul className="space-y-2">
              {FOOTER_NAVIGATION.partners.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{FOOTER_NAVIGATION.legal.title}</h3>
            <ul className="space-y-2">
              {FOOTER_NAVIGATION.legal.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.business.legal_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

---

## Step 4: Create Page Templates

### Services Page

**File**: `/app/services/page.tsx`

```typescript
import { getAllServices } from '@/lib/site-config';
import { ServiceCard } from '@/components/services/service-card';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const services = getAllServices();

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          Vetted Service Providers for Every Need
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Browse our curated network of trusted professionals across all business-critical
          services.
        </p>
      </div>

      {/* Service Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-12 rounded-lg bg-muted p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Not Sure Which Service You Need?</h2>
        <p className="mb-6 text-muted-foreground">
          Book a clarity call with Tory to identify your priorities and get personalized
          recommendations.
        </p>
        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
          <a href="/book-call">Book Your Clarity Call</a>
        </Button>
      </div>
    </div>
  );
}
```

### Service Detail Page (Dynamic)

**File**: `/app/services/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { getServiceBySlug, getRelatedServices, getAllServiceSlugs } from '@/lib/site-config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(params.slug);

  return (
    <div className="container py-12">
      {/* Hero */}
      <div className="mb-12">
        <Badge className="mb-4">{service.category}</Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">{service.title}</h1>
        <p className="text-xl text-muted-foreground">{service.longDescription}</p>
      </div>

      {/* Benefits */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">What You Get</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {service.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 text-green-500" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Provider Stats */}
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6 text-center">
          <div className="mb-2 text-3xl font-bold">{service.commonProviders}+</div>
          <div className="text-sm text-muted-foreground">Vetted Providers</div>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <div className="mb-2 text-3xl font-bold">{service.averageCommission}%</div>
          <div className="text-sm text-muted-foreground">Average Commission</div>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <div className="mb-2 text-3xl font-bold">⭐ 4.9</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg bg-muted p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to Find Your Provider?</h2>
        <p className="mb-6 text-muted-foreground">
          Sign in to view our full directory of vetted {service.title.toLowerCase()} providers.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <a href="/partner-portal">View Providers</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/book-call">Book Clarity Call</a>
          </Button>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Related Services</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedServices.map((related) => (
              <a
                key={related.id}
                href={`/services/${related.slug}`}
                className="rounded-lg border p-6 transition-colors hover:bg-muted"
              >
                <h3 className="mb-2 font-semibold">{related.title}</h3>
                <p className="text-sm text-muted-foreground">{related.shortDescription}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Step 5: Implement Authentication

### Middleware for Protected Routes

**File**: `/middleware.ts`

```typescript
import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/about',
    '/services(.*)',
    '/how-it-works',
    '/contact',
    '/book-call',
    '/apply',
    '/become-partner',
    '/partner-benefits',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/api/webhooks(.*)',
  ],

  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // If user is signed in and accessing admin routes
    if (auth.userId && req.nextUrl.pathname.startsWith('/admin')) {
      // Check if user has admin role (implement your role check)
      const isAdmin = auth.sessionClaims?.metadata?.role === 'admin';

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

---

## Step 6: Environment Variables

**File**: `.env.local`

```env
# Base URL
NEXT_PUBLIC_BASE_URL=https://astartupbiz.com

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_CLARITY_PRICE_ID=price_...

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/toryzweigle/clarity-call

# Analytics
NEXT_PUBLIC_GA_ID=G-...

# Database (if using)
DATABASE_URL=postgresql://...

# Email (Resend, SendGrid, etc.)
EMAIL_API_KEY=...
EMAIL_FROM=hello@astartupbiz.com
```

---

## Step 7: Database Schema (Optional)

If using Prisma with PostgreSQL:

**File**: `/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String        @id @default(cuid())
  clerkId       String        @unique
  email         String        @unique
  name          String?
  role          UserRole      @default(CLIENT)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  referrals     Referral[]    @relation("PartnerReferrals")
  bookings      Booking[]
  applications  Application[]
}

enum UserRole {
  PUBLIC
  CLIENT
  PARTNER
  ADMIN
}

model ServiceProvider {
  id              String            @id @default(cuid())
  name            String
  category        ServiceCategory
  description     String
  logo            String?
  website         String?
  isVetted        Boolean           @default(false)
  commissionRate  Float
  tier            ProviderTier
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  referrals       Referral[]
}

enum ServiceCategory {
  LEGAL
  ACCOUNTING
  BOOKKEEPING
  EIN_FILING
  AI_AUTOMATION
  CRM
  WEBSITE_DESIGN
  MARKETING
  BRANDING
  BUSINESS_COACHING
}

enum ProviderTier {
  BRONZE
  SILVER
  GOLD
  PLATINUM
}

model Referral {
  id                String          @id @default(cuid())
  clientId          String
  partnerId         String
  providerId        String
  serviceCategory   ServiceCategory
  status            ReferralStatus  @default(PENDING)
  commissionAmount  Float
  createdAt         DateTime        @default(now())
  completedAt       DateTime?

  partner           User            @relation("PartnerReferrals", fields: [partnerId], references: [id])
  provider          ServiceProvider @relation(fields: [providerId], references: [id])
}

enum ReferralStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Booking {
  id            String        @id @default(cuid())
  userId        String
  clientName    String
  clientEmail   String
  clientPhone   String
  businessStage String
  challenges    String[]
  scheduledAt   DateTime
  zoomLink      String?
  status        BookingStatus @default(SCHEDULED)
  paid          Boolean       @default(false)
  amount        Float         @default(1000)
  createdAt     DateTime      @default(now())

  user          User          @relation(fields: [userId], references: [id])
}

enum BookingStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}

model Application {
  id            String            @id @default(cuid())
  userId        String?
  businessName  String
  industry      String
  revenue       String
  teamSize      String
  challenges    String[]
  goals         String[]
  timeline      String
  budget        String
  status        ApplicationStatus @default(PENDING)
  submittedAt   DateTime          @default(now())

  user          User?             @relation(fields: [userId], references: [id])
}

enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## Step 8: Testing Checklist

### Manual Testing

- [ ] Homepage loads with correct navigation
- [ ] All service pages are accessible
- [ ] Service detail pages render correctly
- [ ] Clarity call booking flow works
- [ ] Application form submits successfully
- [ ] Partner portal login works
- [ ] Admin dashboard is protected
- [ ] Footer links are correct
- [ ] Mobile navigation works
- [ ] Sitemap.xml generates correctly

### Automated Testing (Future)

```typescript
// Example: Test service page generation
import { expect, test } from 'vitest';
import { getAllServiceSlugs, getServiceBySlug } from '@/lib/site-config';

test('all service slugs return valid services', () => {
  const slugs = getAllServiceSlugs();

  slugs.forEach((slug) => {
    const service = getServiceBySlug(slug);
    expect(service).toBeDefined();
    expect(service?.slug).toBe(slug);
  });
});
```

---

## Step 9: Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy to production

```bash
vercel --prod
```

### Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Verify Stripe payment integration
- [ ] Test Calendly booking integration
- [ ] Check sitemap.xml accessibility
- [ ] Verify analytics tracking
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit

---

## Quick Reference Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm run start

# Lint
npm run lint

# Type check
tsc --noEmit
```

---

## Support & Documentation

- **Architecture Docs**: `/docs/SITE_ARCHITECTURE.md`
- **Visual Sitemap**: `/docs/SITEMAP_VISUAL.md`
- **Config Files**: `/lib/site-config/`

For questions or issues, refer to the comprehensive architecture documentation.
