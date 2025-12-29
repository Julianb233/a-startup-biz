import { sql } from '@/lib/db'
import { scrapeWebsite } from './scraper-service'
import type {
  Microsite,
  MicrositeCreateInput,
  MicrositeImage,
  ScrapedWebsiteData,
} from './types'

/**
 * Generate a URL-safe slug from company name
 */
export function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const result = await sql`
    SELECT id FROM partner_microsites WHERE slug = ${slug}
  `
  return result.length === 0
}

/**
 * Generate a unique slug, appending numbers if necessary
 */
export async function generateUniqueSlug(companyName: string): Promise<string> {
  const baseSlug = generateSlug(companyName)
  let slug = baseSlug
  let counter = 1

  while (!(await isSlugAvailable(slug))) {
    slug = `${baseSlug}-${counter}`
    counter++
    if (counter > 100) {
      // Safety limit
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }

  return slug
}

/**
 * Create a new microsite for a partner
 */
export async function createMicrosite(
  input: MicrositeCreateInput
): Promise<Microsite> {
  const slug = input.slug || (await generateUniqueSlug(input.companyName))

  // Scrape website if URL provided
  let scrapedData: ScrapedWebsiteData | null = null
  if (input.websiteUrl) {
    scrapedData = await scrapeWebsite(input.websiteUrl)
  }

  const result = await sql`
    INSERT INTO partner_microsites (
      partner_id,
      slug,
      company_name,
      logo_url,
      primary_color,
      hero_headline,
      hero_subheadline,
      description,
      source_website,
      images,
      published_at,
      last_scraped_at
    ) VALUES (
      ${input.partnerId},
      ${slug},
      ${input.companyName},
      ${input.logoUrl || scrapedData?.logoUrl || null},
      ${input.primaryColor || scrapedData?.primaryColor || '#ff6a1a'},
      ${input.heroHeadline || `Welcome to ${input.companyName}`},
      ${input.heroSubheadline || scrapedData?.description || 'Get started with our services today'},
      ${input.description || scrapedData?.description || null},
      ${input.websiteUrl || null},
      ${JSON.stringify(input.images || scrapedData?.images || [])},
      NOW(),
      ${input.websiteUrl ? sql`NOW()` : null}
    )
    RETURNING *
  `

  return mapMicrositeRow(result[0])
}

/**
 * Get microsite by slug
 */
export async function getMicrositeBySlug(
  slug: string
): Promise<Microsite | null> {
  const result = await sql`
    SELECT * FROM partner_microsites
    WHERE slug = ${slug} AND is_active = true
  `

  if (result.length === 0) {
    return null
  }

  return mapMicrositeRow(result[0])
}

/**
 * Get microsite by partner ID
 */
export async function getMicrositeByPartnerId(
  partnerId: string
): Promise<Microsite | null> {
  const result = await sql`
    SELECT * FROM partner_microsites
    WHERE partner_id = ${partnerId}
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (result.length === 0) {
    return null
  }

  return mapMicrositeRow(result[0])
}

/**
 * Update microsite with scraped data
 */
export async function updateMicrositeWithScrapedData(
  micrositeId: string,
  scrapedData: ScrapedWebsiteData
): Promise<void> {
  await sql`
    UPDATE partner_microsites
    SET
      logo_url = COALESCE(${scrapedData.logoUrl}, logo_url),
      primary_color = COALESCE(${scrapedData.primaryColor}, primary_color),
      description = COALESCE(${scrapedData.description}, description),
      images = COALESCE(${JSON.stringify(scrapedData.images)}, images),
      last_scraped_at = NOW(),
      updated_at = NOW()
    WHERE id = ${micrositeId}
  `
}

/**
 * Update microsite
 */
export async function updateMicrosite(
  micrositeId: string,
  updates: Partial<MicrositeCreateInput>
): Promise<Microsite | null> {
  const setClauses = []
  const values: unknown[] = []

  if (updates.companyName !== undefined) {
    setClauses.push(`company_name = $${values.length + 1}`)
    values.push(updates.companyName)
  }
  if (updates.logoUrl !== undefined) {
    setClauses.push(`logo_url = $${values.length + 1}`)
    values.push(updates.logoUrl)
  }
  if (updates.primaryColor !== undefined) {
    setClauses.push(`primary_color = $${values.length + 1}`)
    values.push(updates.primaryColor)
  }
  if (updates.heroHeadline !== undefined) {
    setClauses.push(`hero_headline = $${values.length + 1}`)
    values.push(updates.heroHeadline)
  }
  if (updates.heroSubheadline !== undefined) {
    setClauses.push(`hero_subheadline = $${values.length + 1}`)
    values.push(updates.heroSubheadline)
  }
  if (updates.description !== undefined) {
    setClauses.push(`description = $${values.length + 1}`)
    values.push(updates.description)
  }
  if (updates.images !== undefined) {
    setClauses.push(`images = $${values.length + 1}`)
    values.push(JSON.stringify(updates.images))
  }

  if (setClauses.length === 0) {
    return getMicrositeBySlug(micrositeId)
  }

  const result = await sql`
    UPDATE partner_microsites
    SET ${sql.unsafe(setClauses.join(', '))}, updated_at = NOW()
    WHERE id = ${micrositeId}
    RETURNING *
  `

  if (result.length === 0) {
    return null
  }

  return mapMicrositeRow(result[0])
}

/**
 * Increment page view count
 */
export async function incrementPageViews(micrositeId: string): Promise<void> {
  await sql`
    UPDATE partner_microsites
    SET page_views = page_views + 1
    WHERE id = ${micrositeId}
  `
}

/**
 * Get microsite public URL
 */
export function getMicrositeUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://a-startup-biz.vercel.app'
  return `${baseUrl}/p/${slug}`
}

/**
 * Map database row to Microsite type
 */
function mapMicrositeRow(row: Record<string, unknown>): Microsite {
  return {
    id: row.id as string,
    partnerId: row.partner_id as string,
    slug: row.slug as string,
    companyName: row.company_name as string,
    logoUrl: row.logo_url as string | null,
    primaryColor: row.primary_color as string,
    secondaryColor: row.secondary_color as string,
    heroHeadline: row.hero_headline as string | null,
    heroSubheadline: row.hero_subheadline as string | null,
    description: row.description as string | null,
    sourceWebsite: row.source_website as string | null,
    images: (row.images as MicrositeImage[]) || [],
    templateId: row.template_id as string,
    customCss: row.custom_css as string | null,
    isActive: row.is_active as boolean,
    formTitle: row.form_title as string,
    formSubtitle: row.form_subtitle as string,
    formFields: (row.form_fields as string[]) || ['name', 'email', 'phone'],
    formButtonText: row.form_button_text as string,
    successMessage: row.success_message as string,
    metaTitle: row.meta_title as string | null,
    metaDescription: row.meta_description as string | null,
    pageViews: row.page_views as number,
    leadSubmissions: row.lead_submissions as number,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    publishedAt: row.published_at
      ? new Date(row.published_at as string)
      : null,
    lastScrapedAt: row.last_scraped_at
      ? new Date(row.last_scraped_at as string)
      : null,
  }
}
