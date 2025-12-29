/**
 * Blog System Type Definitions
 *
 * TypeScript types for the blog system including posts, categories,
 * and API request/response types
 */

// ============================================
// STATUS TYPES
// ============================================

/**
 * Blog post status
 */
export type BlogPostStatus = 'draft' | 'published' | 'scheduled'

// ============================================
// DATABASE MODELS
// ============================================

/**
 * Blog post database model
 */
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  author_id: string
  status: BlogPostStatus
  published_at: Date | null
  meta_title: string | null
  meta_description: string | null
  tags: string[]
  created_at: Date
  updated_at: Date
}

/**
 * Blog post with author info (joined from users table)
 */
export interface BlogPostWithAuthor extends BlogPost {
  author_name: string | null
  author_email: string | null
}

/**
 * Blog post with categories
 */
export interface BlogPostWithCategories extends BlogPost {
  categories: BlogCategory[]
}

/**
 * Blog category database model
 */
export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: Date
  updated_at: Date
}

/**
 * Blog post category junction record
 */
export interface BlogPostCategory {
  id: number
  post_id: string
  category_id: string
  created_at: Date
}

// ============================================
// API REQUEST TYPES
// ============================================

/**
 * Input for creating a new blog post
 */
export interface CreatePostInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  status?: BlogPostStatus
  published_at?: Date | string
  meta_title?: string
  meta_description?: string
  tags?: string[]
  category_ids?: string[]
}

/**
 * Input for updating an existing blog post
 */
export interface UpdatePostInput {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  featured_image?: string
  status?: BlogPostStatus
  published_at?: Date | string | null
  meta_title?: string
  meta_description?: string
  tags?: string[]
  category_ids?: string[]
}

/**
 * Input for creating a new blog category
 */
export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
}

/**
 * Input for updating an existing blog category
 */
export interface UpdateCategoryInput {
  name?: string
  slug?: string
  description?: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Paginated posts response
 */
export interface PostsResponse {
  posts: BlogPostWithAuthor[]
  total: number
  limit: number
  offset: number
}

/**
 * Single post response
 */
export interface PostResponse {
  post: BlogPostWithAuthor & { categories: BlogCategory[] }
}

/**
 * Categories list response
 */
export interface CategoriesResponse {
  categories: BlogCategory[]
}

/**
 * Post creation/update response
 */
export interface PostMutationResponse {
  success: boolean
  post: BlogPost
  message?: string
}

/**
 * Post deletion response
 */
export interface PostDeleteResponse {
  success: boolean
  message: string
}

// ============================================
// QUERY FILTER TYPES
// ============================================

/**
 * Filters for querying blog posts
 */
export interface PostFilters {
  status?: BlogPostStatus
  author_id?: string
  category_id?: string
  tag?: string
  search?: string
  limit?: number
  offset?: number
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Type guard for valid blog post status
 */
export function isValidBlogPostStatus(status: string): status is BlogPostStatus {
  return ['draft', 'published', 'scheduled'].includes(status)
}

/**
 * Validate create post input
 */
export function validateCreatePostInput(input: unknown): input is CreatePostInput {
  if (!input || typeof input !== 'object') return false
  const obj = input as Record<string, unknown>
  return (
    typeof obj.title === 'string' &&
    obj.title.length > 0 &&
    typeof obj.slug === 'string' &&
    obj.slug.length > 0 &&
    typeof obj.content === 'string' &&
    obj.content.length > 0
  )
}

/**
 * Validate update post input
 */
export function validateUpdatePostInput(input: unknown): input is UpdatePostInput {
  if (!input || typeof input !== 'object') return false
  // At least one field should be present for update
  const obj = input as Record<string, unknown>
  return Object.keys(obj).length > 0
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Pagination params for blog queries
 */
export interface BlogPaginationParams {
  limit?: number
  offset?: number
}

/**
 * Sort options for blog posts
 */
export type BlogPostSortField = 'created_at' | 'updated_at' | 'published_at' | 'title'
export type SortDirection = 'asc' | 'desc'

export interface BlogPostSortParams {
  field: BlogPostSortField
  direction: SortDirection
}
