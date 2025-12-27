# Industries Pages - Daily Event Insurance

SEO-optimized industry sector pages for targeted event insurance marketing.

## Structure

```
/app/industries/
├── page.tsx                    # Industries landing page
├── [sector]/
│   └── page.tsx               # Dynamic sector pages
└── README.md                  # This file

/lib/
└── industry-data.ts           # Industry sector configuration

/components/
└── sector-faq.tsx             # Shared FAQ component with JSON-LD
```

## Available Industry Sectors

1. **Race Directors** (`/industries/race-directors`)
   - Running events: 5Ks, 10Ks, half marathons, full marathons
   - Average commission: $620 per race

2. **Cycling Events** (`/industries/cycling-events`)
   - Road races, criteriums, gran fondos, gravel events
   - Average commission: $480 per event

3. **Triathlons** (`/industries/triathlons`)
   - Multi-sport events: triathlons, duathlons, aquathlons
   - Average commission: $1,150 per event

4. **Obstacle Courses** (`/industries/obstacle-courses`)
   - OCR events, mud runs, extreme endurance
   - Average commission: $1,640 per event

5. **Marathons** (`/industries/marathons`)
   - Full marathons, half marathons, fun runs
   - Large event revenue: $5,200+

6. **Corporate Wellness** (`/industries/corporate-wellness`)
   - Company 5Ks, wellness challenges, corporate events
   - Annual client value: $3,200

7. **Schools & Universities** (`/industries/schools-universities`)
   - College fun runs, alumni races, student recreation
   - Greek event take rate: 52%

## SEO Features

### On-Page SEO
- Unique H1 with primary keyword + benefit
- SEO-optimized meta titles (60 chars)
- Meta descriptions (150-160 chars)
- Keyword-rich subheadings (H2, H3)
- Industry-specific content

### Technical SEO
- Dynamic route generation with `generateStaticParams`
- JSON-LD structured data (Service schema)
- FAQ schema markup for rich snippets
- Sitemap integration (automatically generated)
- OpenGraph and Twitter Card metadata

### Content Structure
Each sector page includes:
1. Hero section with value proposition
2. Benefits section (4 benefits per sector)
3. How It Works (3-step process)
4. Testimonial (where available)
5. FAQ section (5 questions with schema)
6. CTA with revenue calculator link
7. Related industries navigation

## Adding New Industries

To add a new industry sector:

1. **Add data to `/lib/industry-data.ts`:**
```typescript
"new-sector-slug": {
  slug: "new-sector-slug",
  title: "Industry Title",
  shortTitle: "Short Name",
  metaTitle: "SEO Title | Daily Event Insurance",
  metaDescription: "150-160 char description with keywords",
  heroTitle: "Hero Headline",
  heroSubtitle: "Value proposition",
  icon: "IconName",
  benefits: [...],
  howItWorks: [...],
  faqs: [...],
  stats: [...],
  testimonial: {...}
}
```

2. **Pages automatically generated** - No additional routing needed
3. **Sitemap updates automatically** - Run build to regenerate

## Icon Options

Available Lucide React icons:
- Activity, Bike, Waves, Mountain, Award
- Building, GraduationCap, Shield, DollarSign
- TrendingDown, Zap, AlertTriangle, Users
- Calendar, Heart, Globe, Plane, Briefcase
- FileText, TrendingUp, CheckCircle, Droplet

## Internal Linking Strategy

Each sector page links to:
- Industries landing page (`/industries`)
- 3 related sector pages
- Revenue calculator on homepage (`/#revenue-calculator`)
- Pricing page (`/pricing`)
- Application form (`#apply`)

## Performance Optimizations

- Static generation for all sector pages
- Image optimization with Next.js Image
- Framer Motion animations (lazy loaded)
- Component-level code splitting
- SEO metadata pre-generated

## Testing

Test routes locally:
```bash
npm run dev
# Visit:
# http://localhost:3000/industries
# http://localhost:3000/industries/race-directors
# http://localhost:3000/industries/cycling-events
# etc.
```

Build and verify:
```bash
npm run build
# Check that all routes generate successfully
```

## SEO Checklist

- [x] Unique title tags per page
- [x] Unique meta descriptions
- [x] H1 tags with primary keywords
- [x] Structured H2/H3 hierarchy
- [x] JSON-LD structured data
- [x] FAQ schema markup
- [x] OpenGraph metadata
- [x] Twitter Card metadata
- [x] Sitemap inclusion
- [x] Internal linking structure
- [x] Mobile responsive design
- [x] Fast page load (static generation)

## Analytics Tracking

Track these metrics per sector:
- Page views
- Time on page
- CTA click rate (Get Started, Calculate Revenue)
- FAQ interactions
- Related industry navigation

## Future Enhancements

- [ ] Add industry-specific testimonials
- [ ] Create case study pages per sector
- [ ] Add video content for high-traffic sectors
- [ ] Implement A/B testing on CTAs
- [ ] Add live chat for high-intent pages
- [ ] Create downloadable resources per industry
