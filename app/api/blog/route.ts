/**
 * Blog API Routes
 *
 * GET: List published blog posts with pagination
 * POST: Create a new blog post (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth, requireAdmin, getCurrentUserId } from '@/lib/api-auth'
import {
  getPublishedPosts,
  getAllPosts,
  createPost,
  getPostCategories,
  isSlugAvailable,
} from '@/lib/blog-queries'
import { checkRole } from '@/lib/auth'
import type { BlogPostStatus, CreatePostInput } from '@/lib/types/blog'

/**
 * GET /api/blog
 *
 * List blog posts with pagination
 * Public users see only published posts
 * Admins can see all posts including drafts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') as BlogPostStatus | null
    const includeAll = searchParams.get('all') === 'true'

    // Check if user is admin for accessing all posts
    const isAdmin = await checkRole('admin').catch(() => false)

    let result: { posts: unknown[]; total: number }

    if (isAdmin && (includeAll || status)) {
      // Admin can see all posts and filter by status
      result = await getAllPosts(limit, offset, status || undefined)
    } else {
      // Public users only see published posts
      result = await getPublishedPosts(limit, offset)
    }

    // Fetch categories for each post
    const postsWithCategories = await Promise.all(
      result.posts.map(async (post) => {
        const p = post as { id: string }
        const categories = await getPostCategories(p.id)
        return { ...(post as object), categories }
      })
    )

    return NextResponse.json({
      posts: postsWithCategories,
      total: result.total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blog
 *
 * Create a new blog post (admin only)
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role
    const { userId } = await requireAdmin()

    try {
      const body = await request.json()

      // Validate required fields
      if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title is required' },
          { status: 400 }
        )
      }

      if (!body.slug || typeof body.slug !== 'string' || body.slug.trim().length === 0) {
        return NextResponse.json(
          { error: 'Slug is required' },
          { status: 400 }
        )
      }

      if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Content is required' },
          { status: 400 }
        )
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      if (!slugRegex.test(body.slug)) {
        return NextResponse.json(
          { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400 }
        )
      }

      // Check slug availability
      const slugAvailable = await isSlugAvailable(body.slug)
      if (!slugAvailable) {
        return NextResponse.json(
          { error: 'Slug is already in use' },
          { status: 400 }
        )
      }

      // Validate status if provided
      if (body.status && !['draft', 'published', 'scheduled'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be draft, published, or scheduled' },
          { status: 400 }
        )
      }

      // Validate published_at for scheduled posts
      if (body.status === 'scheduled' && !body.published_at) {
        return NextResponse.json(
          { error: 'Published date is required for scheduled posts' },
          { status: 400 }
        )
      }

      // Validate tags if provided
      if (body.tags && !Array.isArray(body.tags)) {
        return NextResponse.json(
          { error: 'Tags must be an array' },
          { status: 400 }
        )
      }

      // Validate category_ids if provided
      if (body.category_ids && !Array.isArray(body.category_ids)) {
        return NextResponse.json(
          { error: 'Category IDs must be an array' },
          { status: 400 }
        )
      }

      const postData: CreatePostInput = {
        title: body.title.trim(),
        slug: body.slug.trim(),
        content: body.content.trim(),
        excerpt: body.excerpt?.trim() || undefined,
        featured_image: body.featured_image || undefined,
        status: body.status || 'draft',
        published_at: body.published_at || undefined,
        meta_title: body.meta_title?.trim() || undefined,
        meta_description: body.meta_description?.trim() || undefined,
        tags: body.tags || [],
        category_ids: body.category_ids || [],
      }

      const post = await createPost(postData, userId)

      // Fetch categories for the response
      const categories = await getPostCategories(post.id)

      return NextResponse.json(
        {
          success: true,
          post: { ...post, categories },
          message: 'Blog post created successfully',
        },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error creating blog post:', error)

      // Check for unique constraint violation
      if (error instanceof Error && error.message.includes('unique')) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      )
    }
  })
}
