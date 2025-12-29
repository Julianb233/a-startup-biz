/**
 * Blog System Database Queries
 *
 * CRUD operations for blog posts and categories using Neon serverless driver
 */

import { sql } from './db'
import type {
  BlogPost,
  BlogPostWithAuthor,
  BlogCategory,
  CreatePostInput,
  UpdatePostInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  BlogPostStatus,
} from './types/blog'

// ============================================
// BLOG POSTS - READ OPERATIONS
// ============================================

/**
 * Get published blog posts with pagination
 */
export async function getPublishedPosts(
  limit = 10,
  offset = 0
): Promise<{ posts: BlogPostWithAuthor[]; total: number }> {
  const [posts, countResult] = await Promise.all([
    sql`
      SELECT
        bp.*,
        u.name as author_name,
        u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.status = 'published'
        AND bp.published_at <= NOW()
      ORDER BY bp.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as BlogPostWithAuthor[],
    sql`
      SELECT COUNT(*) as count
      FROM blog_posts
      WHERE status = 'published'
        AND published_at <= NOW()
    ` as unknown as { count: string }[]
  ])

  return {
    posts,
    total: parseInt(countResult[0]?.count || '0')
  }
}

/**
 * Get all blog posts (including drafts) - admin only
 */
export async function getAllPosts(
  limit = 50,
  offset = 0,
  status?: BlogPostStatus
): Promise<{ posts: BlogPostWithAuthor[]; total: number }> {
  let posts: BlogPostWithAuthor[]
  let countResult: { count: string }[]

  if (status) {
    ;[posts, countResult] = await Promise.all([
      sql`
        SELECT
          bp.*,
          u.name as author_name,
          u.email as author_email
        FROM blog_posts bp
        LEFT JOIN users u ON bp.author_id = u.id
        WHERE bp.status = ${status}
        ORDER BY bp.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as unknown as BlogPostWithAuthor[],
      sql`
        SELECT COUNT(*) as count
        FROM blog_posts
        WHERE status = ${status}
      ` as unknown as { count: string }[]
    ])
  } else {
    ;[posts, countResult] = await Promise.all([
      sql`
        SELECT
          bp.*,
          u.name as author_name,
          u.email as author_email
        FROM blog_posts bp
        LEFT JOIN users u ON bp.author_id = u.id
        ORDER BY bp.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as unknown as BlogPostWithAuthor[],
      sql`
        SELECT COUNT(*) as count FROM blog_posts
      ` as unknown as { count: string }[]
    ])
  }

  return {
    posts,
    total: parseInt(countResult[0]?.count || '0')
  }
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(
  slug: string,
  includeUnpublished = false
): Promise<BlogPostWithAuthor | null> {
  let result: BlogPostWithAuthor[]

  if (includeUnpublished) {
    result = await sql`
      SELECT
        bp.*,
        u.name as author_name,
        u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.slug = ${slug}
      LIMIT 1
    ` as unknown as BlogPostWithAuthor[]
  } else {
    result = await sql`
      SELECT
        bp.*,
        u.name as author_name,
        u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.slug = ${slug}
        AND bp.status = 'published'
        AND bp.published_at <= NOW()
      LIMIT 1
    ` as unknown as BlogPostWithAuthor[]
  }

  return result[0] || null
}

/**
 * Get a single blog post by ID
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const result = await sql`
    SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1
  ` as unknown as BlogPost[]
  return result[0] || null
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(
  tag: string,
  limit = 10,
  offset = 0
): Promise<{ posts: BlogPostWithAuthor[]; total: number }> {
  const [posts, countResult] = await Promise.all([
    sql`
      SELECT
        bp.*,
        u.name as author_name,
        u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.status = 'published'
        AND bp.published_at <= NOW()
        AND ${tag} = ANY(bp.tags)
      ORDER BY bp.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as BlogPostWithAuthor[],
    sql`
      SELECT COUNT(*) as count
      FROM blog_posts
      WHERE status = 'published'
        AND published_at <= NOW()
        AND ${tag} = ANY(tags)
    ` as unknown as { count: string }[]
  ])

  return {
    posts,
    total: parseInt(countResult[0]?.count || '0')
  }
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
  categorySlug: string,
  limit = 10,
  offset = 0
): Promise<{ posts: BlogPostWithAuthor[]; total: number }> {
  const [posts, countResult] = await Promise.all([
    sql`
      SELECT
        bp.*,
        u.name as author_name,
        u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      INNER JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      INNER JOIN blog_categories bc ON bpc.category_id = bc.id
      WHERE bp.status = 'published'
        AND bp.published_at <= NOW()
        AND bc.slug = ${categorySlug}
      ORDER BY bp.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as BlogPostWithAuthor[],
    sql`
      SELECT COUNT(*) as count
      FROM blog_posts bp
      INNER JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      INNER JOIN blog_categories bc ON bpc.category_id = bc.id
      WHERE bp.status = 'published'
        AND bp.published_at <= NOW()
        AND bc.slug = ${categorySlug}
    ` as unknown as { count: string }[]
  ])

  return {
    posts,
    total: parseInt(countResult[0]?.count || '0')
  }
}

/**
 * Get categories for a post
 */
export async function getPostCategories(postId: string): Promise<BlogCategory[]> {
  return sql`
    SELECT bc.*
    FROM blog_categories bc
    INNER JOIN blog_post_categories bpc ON bc.id = bpc.category_id
    WHERE bpc.post_id = ${postId}
    ORDER BY bc.name ASC
  ` as unknown as BlogCategory[]
}

// ============================================
// BLOG POSTS - WRITE OPERATIONS
// ============================================

/**
 * Create a new blog post
 */
export async function createPost(
  data: CreatePostInput,
  authorId: string
): Promise<BlogPost> {
  const publishedAt = data.status === 'published' && !data.published_at
    ? new Date()
    : data.published_at
      ? new Date(data.published_at)
      : null

  const result = await sql`
    INSERT INTO blog_posts (
      title,
      slug,
      content,
      excerpt,
      featured_image,
      author_id,
      status,
      published_at,
      meta_title,
      meta_description,
      tags
    ) VALUES (
      ${data.title},
      ${data.slug},
      ${data.content},
      ${data.excerpt || null},
      ${data.featured_image || null},
      ${authorId},
      ${data.status || 'draft'},
      ${publishedAt},
      ${data.meta_title || null},
      ${data.meta_description || null},
      ${data.tags || []}
    )
    RETURNING *
  ` as unknown as BlogPost[]

  const post = result[0]

  // Handle category assignments if provided
  if (data.category_ids && data.category_ids.length > 0) {
    await assignCategoriesToPost(post.id, data.category_ids)
  }

  return post
}

/**
 * Update an existing blog post
 */
export async function updatePost(
  id: string,
  data: UpdatePostInput
): Promise<BlogPost | null> {
  // Build dynamic update
  const updates: string[] = []
  const values: unknown[] = []

  if (data.title !== undefined) {
    updates.push('title')
    values.push(data.title)
  }
  if (data.slug !== undefined) {
    updates.push('slug')
    values.push(data.slug)
  }
  if (data.content !== undefined) {
    updates.push('content')
    values.push(data.content)
  }
  if (data.excerpt !== undefined) {
    updates.push('excerpt')
    values.push(data.excerpt || null)
  }
  if (data.featured_image !== undefined) {
    updates.push('featured_image')
    values.push(data.featured_image || null)
  }
  if (data.status !== undefined) {
    updates.push('status')
    values.push(data.status)
    // Auto-set published_at when publishing for the first time
    if (data.status === 'published' && data.published_at === undefined) {
      updates.push('published_at')
      values.push(new Date())
    }
  }
  if (data.published_at !== undefined) {
    updates.push('published_at')
    values.push(data.published_at ? new Date(data.published_at) : null)
  }
  if (data.meta_title !== undefined) {
    updates.push('meta_title')
    values.push(data.meta_title || null)
  }
  if (data.meta_description !== undefined) {
    updates.push('meta_description')
    values.push(data.meta_description || null)
  }
  if (data.tags !== undefined) {
    updates.push('tags')
    values.push(data.tags || [])
  }

  if (updates.length === 0) {
    return getPostById(id)
  }

  // Use a simple approach since we can't build dynamic SQL easily with tagged templates
  const result = await sql`
    UPDATE blog_posts
    SET
      title = COALESCE(${data.title}, title),
      slug = COALESCE(${data.slug}, slug),
      content = COALESCE(${data.content}, content),
      excerpt = CASE WHEN ${data.excerpt !== undefined} THEN ${data.excerpt || null} ELSE excerpt END,
      featured_image = CASE WHEN ${data.featured_image !== undefined} THEN ${data.featured_image || null} ELSE featured_image END,
      status = COALESCE(${data.status}, status),
      published_at = CASE
        WHEN ${data.published_at !== undefined} THEN ${data.published_at ? new Date(data.published_at) : null}
        WHEN ${data.status === 'published'} AND published_at IS NULL THEN NOW()
        ELSE published_at
      END,
      meta_title = CASE WHEN ${data.meta_title !== undefined} THEN ${data.meta_title || null} ELSE meta_title END,
      meta_description = CASE WHEN ${data.meta_description !== undefined} THEN ${data.meta_description || null} ELSE meta_description END,
      tags = CASE WHEN ${data.tags !== undefined} THEN ${data.tags || []} ELSE tags END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  ` as unknown as BlogPost[]

  const post = result[0]

  // Handle category assignments if provided
  if (post && data.category_ids !== undefined) {
    await clearPostCategories(id)
    if (data.category_ids.length > 0) {
      await assignCategoriesToPost(id, data.category_ids)
    }
  }

  return post || null
}

/**
 * Delete a blog post
 */
export async function deletePost(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM blog_posts WHERE id = ${id} RETURNING id
  ` as unknown as { id: string }[]
  return result.length > 0
}

// ============================================
// BLOG CATEGORIES - READ OPERATIONS
// ============================================

/**
 * Get all blog categories
 */
export async function getCategories(): Promise<BlogCategory[]> {
  return sql`
    SELECT * FROM blog_categories ORDER BY name ASC
  ` as unknown as BlogCategory[]
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const result = await sql`
    SELECT * FROM blog_categories WHERE slug = ${slug} LIMIT 1
  ` as unknown as BlogCategory[]
  return result[0] || null
}

/**
 * Get a category by ID
 */
export async function getCategoryById(id: string): Promise<BlogCategory | null> {
  const result = await sql`
    SELECT * FROM blog_categories WHERE id = ${id} LIMIT 1
  ` as unknown as BlogCategory[]
  return result[0] || null
}

// ============================================
// BLOG CATEGORIES - WRITE OPERATIONS
// ============================================

/**
 * Create a new blog category
 */
export async function createCategory(data: CreateCategoryInput): Promise<BlogCategory> {
  const result = await sql`
    INSERT INTO blog_categories (name, slug, description)
    VALUES (${data.name}, ${data.slug}, ${data.description || null})
    RETURNING *
  ` as unknown as BlogCategory[]
  return result[0]
}

/**
 * Update a blog category
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryInput
): Promise<BlogCategory | null> {
  const result = await sql`
    UPDATE blog_categories
    SET
      name = COALESCE(${data.name}, name),
      slug = COALESCE(${data.slug}, slug),
      description = CASE WHEN ${data.description !== undefined} THEN ${data.description || null} ELSE description END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  ` as unknown as BlogCategory[]
  return result[0] || null
}

/**
 * Delete a blog category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM blog_categories WHERE id = ${id} RETURNING id
  ` as unknown as { id: string }[]
  return result.length > 0
}

// ============================================
// POST-CATEGORY RELATIONSHIPS
// ============================================

/**
 * Assign categories to a post
 */
export async function assignCategoriesToPost(
  postId: string,
  categoryIds: string[]
): Promise<void> {
  for (const categoryId of categoryIds) {
    await sql`
      INSERT INTO blog_post_categories (post_id, category_id)
      VALUES (${postId}, ${categoryId})
      ON CONFLICT (post_id, category_id) DO NOTHING
    `
  }
}

/**
 * Remove all categories from a post
 */
export async function clearPostCategories(postId: string): Promise<void> {
  await sql`
    DELETE FROM blog_post_categories WHERE post_id = ${postId}
  `
}

/**
 * Remove a specific category from a post
 */
export async function removeCategoryFromPost(
  postId: string,
  categoryId: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM blog_post_categories
    WHERE post_id = ${postId} AND category_id = ${categoryId}
    RETURNING id
  ` as unknown as { id: number }[]
  return result.length > 0
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if a slug is available for a new post
 */
export async function isSlugAvailable(
  slug: string,
  excludePostId?: string
): Promise<boolean> {
  let result: { count: string }[]

  if (excludePostId) {
    result = await sql`
      SELECT COUNT(*) as count FROM blog_posts
      WHERE slug = ${slug} AND id != ${excludePostId}
    ` as unknown as { count: string }[]
  } else {
    result = await sql`
      SELECT COUNT(*) as count FROM blog_posts WHERE slug = ${slug}
    ` as unknown as { count: string }[]
  }

  return parseInt(result[0]?.count || '0') === 0
}

/**
 * Generate a unique slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Get all unique tags used across posts
 */
export async function getAllTags(): Promise<string[]> {
  const result = await sql`
    SELECT DISTINCT unnest(tags) as tag
    FROM blog_posts
    WHERE status = 'published'
    ORDER BY tag ASC
  ` as unknown as { tag: string }[]
  return result.map(r => r.tag)
}

/**
 * Search blog posts by title or content
 */
export async function searchPosts(
  query: string,
  limit = 10,
  offset = 0
): Promise<{ posts: BlogPostWithAuthor[]; total: number }> {
  const searchTerm = `%${query}%`

  const [posts, countResult] = await Promise.all([
    sql`
      SELECT
        bp.*,
        u.name as author_name,
        u.email as author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.status = 'published'
        AND bp.published_at <= NOW()
        AND (
          bp.title ILIKE ${searchTerm}
          OR bp.content ILIKE ${searchTerm}
          OR bp.excerpt ILIKE ${searchTerm}
        )
      ORDER BY bp.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as BlogPostWithAuthor[],
    sql`
      SELECT COUNT(*) as count
      FROM blog_posts
      WHERE status = 'published'
        AND published_at <= NOW()
        AND (
          title ILIKE ${searchTerm}
          OR content ILIKE ${searchTerm}
          OR excerpt ILIKE ${searchTerm}
        )
    ` as unknown as { count: string }[]
  ])

  return {
    posts,
    total: parseInt(countResult[0]?.count || '0')
  }
}
