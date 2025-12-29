# A-Startup-Biz Tech Stack

> **IMPORTANT**: All development MUST use these technologies. Do NOT suggest alternatives.

## Core Framework
- **Next.js 15+** - App Router (NOT Pages Router)
- **React 19** - Server Components by default
- **TypeScript 5+** - Strict mode enabled

## Styling
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Component library (Radix UI primitives)
- **Lucide Icons** - Icon set (lucide-react)
- **class-variance-authority (cva)** - Component variants
- **tailwind-merge** - Class merging
- **clsx** - Conditional classes

## Database
- **Neon PostgreSQL** - Serverless Postgres
- **Drizzle ORM** - Type-safe SQL ORM
- **drizzle-kit** - Migrations

## Authentication
- **Clerk** - Auth provider (@clerk/nextjs)
- DO NOT use: Custom JWT, Auth0, NextAuth

## Payments
- **Stripe** - Payments and subscriptions
- **stripe** npm package - Server SDK
- **@stripe/stripe-js** - Client SDK

## CRM Integration
- **HubSpot API** - CRM sync (@hubspot/api-client)
- Custom integration in /lib/hubspot/

## Email
- **Resend** - Transactional emails
- **React Email** - Email templates

## Caching/Rate Limiting
- **Upstash Redis** - Serverless Redis
- **@upstash/redis** - Redis client
- **@upstash/ratelimit** - Rate limiting

## Charts/Visualization
- **Recharts** - Charts library
- DO NOT use: Chart.js, D3 directly

## State Management
- **React Context** - Global state
- **useState/useReducer** - Local state
- DO NOT use: Redux, Zustand, Jotai

## Validation
- **Zod** - Schema validation
- DO NOT use: Yup, Joi

## File Structure
```
/app                 # Next.js App Router pages
  /(public)         # Public routes
  /(auth)           # Auth routes
  /admin            # Admin dashboard
  /partner          # Partner portal
  /api              # API routes
/components          # React components
  /ui               # shadcn/ui components
  /admin            # Admin components
  /partner          # Partner components
/lib                # Utilities and services
  /db               # Database queries
  /stripe           # Stripe integration
  /hubspot          # HubSpot integration
  /email            # Email templates
/hooks              # Custom React hooks
/types              # TypeScript types
```

## Environment Variables
```
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
HUBSPOT_API_KEY=pat-na1-...
RESEND_API_KEY=re_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm test             # Run tests (Vitest)
npm run db:push      # Push schema to database
npm run db:generate  # Generate migrations
```

## DO NOT USE
- Prisma (use Drizzle)
- Custom JWT auth (use Clerk)
- MongoDB (use PostgreSQL)
- Express (use Next.js API routes)
- Redux/Zustand (use Context)
- Chart.js (use Recharts)
- Supabase (use Neon + Clerk)
- Salesforce (use HubSpot)
