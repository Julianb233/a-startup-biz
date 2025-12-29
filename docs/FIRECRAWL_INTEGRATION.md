# FireCrawl Integration for Partner Microsites

## Overview

The FireCrawl integration automatically scrapes partner websites to populate their microsites with branding, logos, colors, and images. This creates a professional, branded landing page for each partner with minimal manual effort.

## Architecture

### Components

1. **Scraper Service** (`lib/partner-onboarding/scraper-service.ts`)
   - Interfaces with FireCrawl API
   - Extracts logo, images, colors, and metadata
   - Handles rate limits and errors gracefully
   - Falls back to defaults if API key missing

2. **Microsite Generator** (`lib/partner-onboarding/microsite-generator.ts`)
   - Creates partner microsites
   - Integrates scraped data automatically
   - Generates unique slugs
   - Manages microsite lifecycle

3. **Scrape API Endpoint** (`app/api/microsites/scrape/route.ts`)
   - Manual scraping trigger for admins
   - Re-scrape existing microsites
   - Check scraping status

4. **Approval Service** (`lib/partner-onboarding/approval-service.ts`)
   - Automatically scrapes during partner approval
   - Creates microsite with scraped branding
   - Sends welcome email with microsite link

### Database Schema

**partner_microsites table**
```sql
- id: UUID
- partner_id: UUID (FK to partners)
- slug: VARCHAR(100) UNIQUE
- company_name: VARCHAR(255)
- logo_url: TEXT
- primary_color: VARCHAR(50) DEFAULT '#ff6a1a'
- secondary_color: VARCHAR(50) DEFAULT '#1a1a1a'
- hero_headline: TEXT
- hero_subheadline: TEXT
- description: TEXT
- source_website: TEXT
- images: JSONB (array of image objects)
- template_id: VARCHAR(50) DEFAULT 'default'
- custom_css: TEXT
- form_title, form_subtitle, form_fields, etc.
- is_active: BOOLEAN DEFAULT true
- page_views, lead_submissions: INTEGER
- created_at, updated_at, published_at, last_scraped_at
```

## Setup

### 1. Get FireCrawl API Key

1. Sign up at [firecrawl.dev](https://firecrawl.dev)
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```bash
   FIRECRAWL_API_KEY=fc-your-api-key-here
   ```

### 2. Run Migration

```bash
# Apply the partner_microsites schema
psql $DATABASE_URL -f supabase-migrations/004_partner_microsites.sql
```

### 3. Verify Setup

Check that the scraper is configured:
```bash
curl http://localhost:3000/api/microsites/scrape?partnerId=xxx
```

Response should include `apiKeyConfigured: true`

## Usage

### Automatic Scraping (Recommended)

Scraping happens automatically when you approve a partner:

1. Admin navigates to `/admin/partners`
2. Click "Approve" on a pending partner
3. System automatically:
   - Scrapes their website (if `website_url` provided)
   - Extracts logo, colors, description, images
   - Creates microsite with scraped data
   - Sends welcome email with microsite URL

### Manual Scraping (Admin Only)

Trigger scraping for an existing partner:

```typescript
// POST /api/microsites/scrape
const response = await fetch('/api/microsites/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    partnerId: 'uuid-here',
    websiteUrl: 'https://example.com', // Optional, uses partner's website_url
    forceUpdate: false // Optional, only update null fields
  })
})

const result = await response.json()
// {
//   success: true,
//   scrapedData: {
//     logoUrl: "https://example.com/logo.png",
//     primaryColor: "#ff6a1a",
//     description: "Company description...",
//     images: [...]
//   },
//   microsite: { id: "...", updated: true }
// }
```

### Check Scraping Status

```typescript
// GET /api/microsites/scrape?partnerId=xxx
const response = await fetch(`/api/microsites/scrape?partnerId=${partnerId}`)
const status = await response.json()
// {
//   partner: { id, companyName, websiteUrl, hasMicrosite },
//   microsite: { lastScrapedAt, hasLogo, imageCount, ... },
//   canScrape: true,
//   apiKeyConfigured: true
// }
```

## What Gets Scraped

### 1. Logo
- Checks `<meta property="og:image">` tag
- Checks `<link rel="icon">` tags
- Searches for `<img>` tags with "logo" or "brand" in class/alt
- Prefers high-resolution images

### 2. Primary Color
- Extracts from `<meta name="theme-color">`
- Could be enhanced to analyze logo colors (future)
- Falls back to `#ff6a1a` (A Startup Biz orange)

### 3. Company Description
- Uses `<meta name="description">` content
- Falls back to `<meta property="og:description">`
- Truncates to reasonable length

### 4. Images (2-3 high-quality images)
- Filters out icons, tracking pixels, small images
- Only includes `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Skips images with "icon", "pixel", "loader" in URL
- Returns up to 5 images, sorted by appearance

### 5. Company Name
- Extracts from `<title>` tag
- Splits on `|`, `-`, `–`, `—` and takes first part

### 6. Favicon
- Uses `<link rel="icon">` or `<link rel="shortcut icon">`

## Fallback Behavior

### No API Key
If `FIRECRAWL_API_KEY` is not set:
- Scraper returns empty data without errors
- Microsite uses defaults:
  - Primary color: `#ff6a1a` (orange)
  - Secondary color: `#1a1a1a` (dark gray)
  - Logo: `null` (can upload later)
  - Hero headline: `Welcome to {CompanyName}`
  - Hero subheadline: `Get started with our services today`

### Scraping Fails
If scraping fails (timeout, invalid URL, etc.):
- Error logged to console
- Returns empty scraped data
- Microsite creation continues with defaults
- Admin can re-scrape later

### No Data Extracted
If website scraped successfully but no data found:
- Returns `success: false` with explanation
- Suggests manual data entry
- Microsite still created with defaults

## Rate Limits

FireCrawl has rate limits based on your plan:
- **Free**: 500 pages/month
- **Hobby**: 3,000 pages/month
- **Standard**: 20,000 pages/month

Each scrape counts as 1 page. We recommend:
- Only scrape on partner approval (automatic)
- Avoid frequent re-scraping
- Cache scraped data in database (`last_scraped_at`)

## Security Considerations

### API Key Protection
- Store `FIRECRAWL_API_KEY` in environment variables
- Never commit to git
- Use Vercel environment variables in production

### URL Validation
- All URLs validated before scraping
- Must be valid HTTP/HTTPS URLs
- No local/internal URLs allowed

### Rate Limiting
- Consider implementing per-partner rate limits
- Track `last_scraped_at` to prevent abuse
- Admin-only endpoint (requires `requireAdmin()`)

## Error Handling

### Common Errors

1. **Invalid URL**
   ```json
   { "error": "Invalid website URL format" }
   ```
   Solution: Ensure URL starts with `http://` or `https://`

2. **Partner Not Found**
   ```json
   { "error": "Partner not found" }
   ```
   Solution: Verify `partnerId` is correct

3. **No Website URL**
   ```json
   { "error": "No website URL provided or found for partner" }
   ```
   Solution: Add `website_url` to partner record or provide in request

4. **Scraping Failed**
   ```json
   { "success": false, "message": "Scraping completed but no data was extracted" }
   ```
   Solution: Check website is accessible, try manual data entry

## Monitoring

### Track Scraping Success

```sql
-- Check last scraped microsites
SELECT
  m.slug,
  p.company_name,
  m.last_scraped_at,
  m.logo_url IS NOT NULL as has_logo,
  m.primary_color,
  jsonb_array_length(m.images) as image_count
FROM partner_microsites m
JOIN partners p ON m.partner_id = p.id
ORDER BY m.last_scraped_at DESC
LIMIT 20;

-- Find microsites never scraped
SELECT
  m.slug,
  p.company_name,
  p.website_url
FROM partner_microsites m
JOIN partners p ON m.partner_id = p.id
WHERE m.last_scraped_at IS NULL
  AND p.website_url IS NOT NULL;
```

### Monitor API Usage

- Check FireCrawl dashboard for usage metrics
- Set up alerts for approaching rate limits
- Log scraping attempts in application logs

## Future Enhancements

1. **Color Extraction from Logo**
   - Use image processing to extract dominant colors
   - Create color palette from brand assets

2. **Content Analysis**
   - Extract service descriptions
   - Identify key features/benefits
   - Auto-generate microsite copy

3. **Competitive Intelligence**
   - Compare partner websites
   - Suggest improvements
   - Track changes over time

4. **Scheduled Re-scraping**
   - Periodic updates (quarterly)
   - Detect brand changes
   - Keep microsites fresh

5. **Image Optimization**
   - Resize/compress scraped images
   - Store in CDN (Cloudinary, Uploadcare)
   - Improve page load times

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test scraping endpoint (requires admin auth)
curl -X POST http://localhost:3000/api/microsites/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "partnerId": "test-partner-id",
    "websiteUrl": "https://example.com"
  }'
```

### Integration Test

```typescript
import { scrapeWebsite } from '@/lib/partner-onboarding/scraper-service'

// Test scraping
const data = await scrapeWebsite('https://example.com')
console.log(data)
// {
//   logoUrl: "...",
//   primaryColor: "#...",
//   images: [...],
//   ...
// }
```

## Troubleshooting

### Problem: No data extracted
- Check if FIRECRAWL_API_KEY is set correctly
- Verify website is publicly accessible
- Try accessing website in browser
- Check FireCrawl API status

### Problem: Wrong logo extracted
- Website may have multiple logos
- Re-scrape with `forceUpdate: true`
- Manually set logo via admin panel

### Problem: Rate limit exceeded
- Check FireCrawl dashboard usage
- Upgrade plan if needed
- Implement caching to reduce scrapes

### Problem: Scraping very slow
- FireCrawl can take 5-15 seconds per page
- This is normal, not an error
- Consider async/background jobs for better UX

## API Reference

### POST /api/microsites/scrape

Scrape a partner's website and update their microsite.

**Auth**: Admin only

**Request Body**:
```typescript
{
  partnerId: string       // Required: Partner UUID
  websiteUrl?: string     // Optional: URL to scrape (uses partner's website_url if omitted)
  forceUpdate?: boolean   // Optional: Update all fields even if not null (default: false)
}
```

**Response**:
```typescript
{
  success: boolean
  message: string
  scrapedData: {
    logoUrl: string | null
    primaryColor: string | null
    secondaryColor: string | null
    companyName: string | null
    description: string | null
    favicon: string | null
    images: Array<{
      url: string
      alt: string
      position: number
    }>
  }
  partner: {
    id: string
    companyName: string
  }
  microsite?: {
    id: string
    updated: boolean
  }
}
```

### GET /api/microsites/scrape?partnerId=xxx

Check scraping status for a partner.

**Auth**: Admin only

**Query Parameters**:
- `partnerId`: Partner UUID (required)

**Response**:
```typescript
{
  partner: {
    id: string
    companyName: string
    websiteUrl: string | null
    hasMicrosite: boolean
  }
  microsite: {
    id: string
    lastScrapedAt: string | null
    hasLogo: boolean
    hasPrimaryColor: boolean
    hasDescription: boolean
    imageCount: number
    sourceWebsite: string | null
  } | null
  canScrape: boolean
  apiKeyConfigured: boolean
}
```

## Support

For issues with:
- **FireCrawl API**: Contact support@firecrawl.dev
- **Integration bugs**: Create issue in repository
- **Feature requests**: Add to project roadmap

## License

This integration is part of A Startup Biz and follows the same license.
