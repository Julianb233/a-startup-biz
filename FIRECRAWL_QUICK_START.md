# FireCrawl Integration - Quick Start Guide

## 🚀 Setup (5 minutes)

### 1. Apply Database Migration
```bash
psql $DATABASE_URL -f supabase-migrations/004_partner_microsites.sql
```

### 2. Add API Key (Optional but Recommended)
Get your key from [firecrawl.dev](https://firecrawl.dev) and add to `.env.local`:
```bash
FIRECRAWL_API_KEY=fc-your-api-key-here
```

### 3. Restart Dev Server
```bash
npm run dev
```

## ✅ How It Works

### Automatic (Preferred)
When you **approve a partner** with a `website_url`:
1. System automatically scrapes their website
2. Extracts logo, colors, description, images
3. Creates branded microsite
4. Sends welcome email with URL

**No additional steps required!**

### Manual Re-scraping
Use the admin endpoint:
```bash
POST /api/microsites/scrape
{
  "partnerId": "partner-uuid-here",
  "websiteUrl": "https://partner-website.com"  # optional
}
```

## 📊 What Gets Scraped

| Data | Source | Fallback |
|------|--------|----------|
| Logo | `<meta og:image>`, `<img>` with "logo" | `null` (upload later) |
| Primary Color | `<meta name="theme-color">` | `#ff6a1a` (orange) |
| Description | `<meta name="description">` | Generic message |
| Images | High-res `<img>` tags (filters icons) | Empty array |
| Company Name | `<title>` tag | Partner's `company_name` |

## 🔧 Without API Key

**System still works!** Microsites created with:
- Default orange color (`#ff6a1a`)
- Generic headline: `Welcome to {CompanyName}`
- Placeholder content
- Partners can customize later

## 🛠️ Admin Tools

### Check Scraping Status
```bash
GET /api/microsites/scrape?partnerId=xxx
```

Response tells you:
- Last scraped date
- What data was found
- If API key is configured

### Find Partners Needing Scraping
```sql
SELECT p.id, p.company_name, p.website_url
FROM partners p
WHERE p.website_url IS NOT NULL
  AND p.microsite_id IS NULL
  AND p.status = 'active';
```

## 🎯 Quick Test

1. Create a test partner with website URL:
   ```sql
   INSERT INTO partners (company_name, website_url, status)
   VALUES ('Test Corp', 'https://example.com', 'pending');
   ```

2. Approve the partner via admin UI or API

3. Check microsite created:
   ```sql
   SELECT * FROM partner_microsites
   WHERE partner_id = 'your-test-partner-id';
   ```

4. Visit microsite: `https://yourapp.com/p/{slug}`

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| No data extracted | Check if API key is set, try different website |
| Wrong logo | Re-scrape with `forceUpdate: true` or set manually |
| Slow scraping | Normal - FireCrawl takes 5-15 seconds |
| Rate limit hit | Check FireCrawl dashboard, upgrade plan |

## 📚 Full Documentation

See `/docs/FIRECRAWL_INTEGRATION.md` for complete details.

## 🎉 That's It!

The integration is ready to use. Approve partners and watch their microsites auto-populate with branding!
