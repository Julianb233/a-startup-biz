import type { ScrapedWebsiteData, MicrositeImage } from './types'

const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1'

interface FirecrawlScrapeResponse {
  success: boolean
  data?: {
    markdown?: string
    html?: string
    metadata?: {
      title?: string
      description?: string
      ogImage?: string
      favicon?: string
      logo?: string
    }
    links?: string[]
  }
  error?: string
}

/**
 * Scrape a website using FireCrawl API
 */
export async function scrapeWebsite(url: string): Promise<ScrapedWebsiteData> {
  const apiKey = process.env.FIRECRAWL_API_KEY

  if (!apiKey) {
    console.warn('FIRECRAWL_API_KEY not set, returning empty scraped data')
    return {
      logoUrl: null,
      images: [],
      primaryColor: null,
      secondaryColor: null,
      companyName: null,
      description: null,
      favicon: null,
    }
  }

  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['html'],
        includeTags: ['img', 'meta', 'link', 'title'],
        waitFor: 3000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('FireCrawl API error:', error)
      throw new Error(`FireCrawl API error: ${response.status}`)
    }

    const result: FirecrawlScrapeResponse = await response.json()

    if (!result.success || !result.data) {
      console.error('FireCrawl scrape failed:', result.error)
      return getEmptyScrapedData()
    }

    return parseScrapedData(result.data, url)
  } catch (error) {
    console.error('Error scraping website:', error)
    return getEmptyScrapedData()
  }
}

/**
 * Extract logo URL from scraped data
 */
export async function extractLogo(url: string): Promise<string | null> {
  const data = await scrapeWebsite(url)
  return data.logoUrl
}

/**
 * Extract images from scraped data
 */
export async function extractImages(
  url: string,
  limit = 3
): Promise<MicrositeImage[]> {
  const data = await scrapeWebsite(url)
  return data.images.slice(0, limit)
}

/**
 * Parse scraped data from FireCrawl response
 */
function parseScrapedData(
  data: NonNullable<FirecrawlScrapeResponse['data']>,
  sourceUrl: string
): ScrapedWebsiteData {
  const metadata = data.metadata || {}
  const html = data.html || ''

  // Extract logo
  let logoUrl = metadata.logo || metadata.ogImage || null

  // Try to find logo in HTML if not in metadata
  if (!logoUrl) {
    const logoMatch = html.match(
      /<img[^>]*(?:logo|brand)[^>]*src=["']([^"']+)["']/i
    )
    if (logoMatch) {
      logoUrl = resolveUrl(logoMatch[1], sourceUrl)
    }
  }

  // Extract images from HTML
  const images: MicrositeImage[] = []
  const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?/gi
  let match
  let position = 0

  while ((match = imgRegex.exec(html)) !== null && images.length < 5) {
    const imgUrl = match[1]
    const alt = match[2] || ''

    // Skip small images, icons, and tracking pixels
    if (shouldIncludeImage(imgUrl, alt)) {
      images.push({
        url: resolveUrl(imgUrl, sourceUrl),
        alt: alt || `Image ${position + 1}`,
        position: position++,
      })
    }
  }

  // Extract primary color from meta theme-color or CSS
  let primaryColor: string | null = null
  const themeColorMatch = html.match(
    /<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i
  )
  if (themeColorMatch) {
    primaryColor = themeColorMatch[1]
  }

  return {
    logoUrl: logoUrl ? resolveUrl(logoUrl, sourceUrl) : null,
    images,
    primaryColor,
    secondaryColor: null,
    companyName: metadata.title?.split(/[|\-–—]/)[0]?.trim() || null,
    description: metadata.description || null,
    favicon: metadata.favicon ? resolveUrl(metadata.favicon, sourceUrl) : null,
  }
}

/**
 * Check if an image URL should be included
 */
function shouldIncludeImage(url: string, alt: string): boolean {
  const lowUrl = url.toLowerCase()
  const lowAlt = alt.toLowerCase()

  // Skip small images, icons, tracking pixels
  const skipPatterns = [
    'icon',
    'favicon',
    'pixel',
    'tracking',
    'spacer',
    '1x1',
    'loader',
    'spinner',
    'arrow',
    'button',
    'data:image',
    'svg',
    '.ico',
  ]

  for (const pattern of skipPatterns) {
    if (lowUrl.includes(pattern) || lowAlt.includes(pattern)) {
      return false
    }
  }

  // Only include common image formats
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const hasImageExtension = imageExtensions.some((ext) => lowUrl.includes(ext))

  return hasImageExtension || lowUrl.includes('image')
}

/**
 * Resolve relative URLs to absolute
 */
function resolveUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  if (url.startsWith('//')) {
    return `https:${url}`
  }

  try {
    const base = new URL(baseUrl)
    if (url.startsWith('/')) {
      return `${base.origin}${url}`
    }
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}

/**
 * Return empty scraped data
 */
function getEmptyScrapedData(): ScrapedWebsiteData {
  return {
    logoUrl: null,
    images: [],
    primaryColor: null,
    secondaryColor: null,
    companyName: null,
    description: null,
    favicon: null,
  }
}

/**
 * Validate a URL is accessible
 */
export async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    })
    return response.ok
  } catch {
    return false
  }
}
