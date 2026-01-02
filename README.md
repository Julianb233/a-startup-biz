# A Startup Biz

Full-stack SaaS platform for business services with partner referral program, voice AI support, and e-commerce checkout.

## Tech Stack

- **Framework:** Next.js 16.1 with React 19
- **Database:** Neon PostgreSQL (serverless)
- **Auth:** Supabase Auth
- **Payments:** Stripe + Stripe Connect (partner payouts)
- **Email:** Resend
- **Voice/Video:** LiveKit
- **Monitoring:** Sentry
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/a-startup-biz.git
cd a-startup-biz

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
pnpm db:setup

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

See `.env.example` for all required environment variables. Key services needed:

| Service | Required | Purpose |
|---------|----------|---------|
| DATABASE_URL | Yes | Neon PostgreSQL connection |
| SUPABASE_* | Yes | Authentication |
| STRIPE_* | Yes | Payments & subscriptions |
| RESEND_API_KEY | Yes | Transactional emails |
| LIVEKIT_* | Optional | Voice/video calls |
| SENTRY_* | Optional | Error monitoring |

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm dev:turbo    # Start with Turbopack (faster)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:ui      # Open Vitest UI
pnpm db:setup     # Run database migrations
```

## Project Structure

```
a-startup-biz/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── partner-portal/    # Partner management
│   └── ...                # Public pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                   # Utilities and services
│   ├── db.ts             # Database connection
│   ├── email.ts          # Email service
│   ├── stripe.ts         # Stripe utilities
│   └── ...
├── scripts/               # Database migrations & utilities
├── docs/                  # Documentation
└── tests/                 # Test files
```

## Key Features

### Partner Referral Program
- Partner onboarding with document signing
- Referral tracking and fraud detection
- Automated commission payouts via Stripe Connect

### Voice AI Support
- LiveKit-powered voice/video calls
- AI-powered support agent with OpenAI
- Call recording and transcription

### E-commerce
- Stripe Checkout integration
- Subscription management
- Invoice generation

## Documentation

Additional documentation is available in the `/docs` directory:

- [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)
- [LiveKit Self-Hosted Setup](docs/LIVEKIT_SELF_HOSTED_GUIDE.md)
- [API Documentation](docs/README.md)

## Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode for development
pnpm test:watch
```

## Deployment

The app is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

For Stripe webhooks, configure endpoints at:
- `/api/webhooks/stripe` - Main payment webhooks
- `/api/webhooks/stripe-connect` - Partner payout webhooks

## Security

This project implements:
- Content Security Policy (CSP) headers
- CORS restrictions with allowed origins
- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection prevention with parameterized queries
- XSS protection headers

## License

Private - All rights reserved.
