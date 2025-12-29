/**
 * Blog Post by Slug API Routes
 *
 * GET: Get a single blog post by slug
 * PATCH: Update a blog post (admin only)
 * DELETE: Delete a blog post (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth, requireAdmin } from '@/lib/api-auth'
import {
  getPostBySlug,
  updatePost,
  deletePost,
  getPostCategories,
  isSlugAvailable,
} from '@/lib/blog-queries'
import { checkRole } from '@/lib/auth'
import type { UpdatePostInput } from '@/lib/types/blog'

interface RouteParams {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/blog/[slug]
 *
 * Get a single blog post by slug
 * Public users see only published posts
 * Admins can see all posts including drafts
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Check if user is admin
    const isAdmin = await checkRole('admin').catch(() => false)

    const post = await getPostBySlug(slug, isAdmin)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Fetch categories for the post
    const categories = await getPostCategories(post.id)

    return NextResponse.json({
      post: { ...post, categories },
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/blog/[slug]
 *
 * Update a blog post (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  return withAuth(async () => {
    // Require admin role
    await requireAdmin()

    try {
      const { slug } = await params

      if (!slug) {
        return NextResponse.json(
          { error: 'Slug is required' },
          { status: 400 }
        )
      }

      // Get the existing post (admin can see all)
      const existingPost = await getPostBySlug(slug, true)

      if (!existingPost) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      const body = await request.json()

      // Validate title if provided
      if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        )
      }

      // Validate slug if provided
      if (body.slug !== undefined) {
        if (typeof body.slug !== 'string' || body.slug.trim().length === 0) {
          return NextResponse.json(
            { error: 'Slug cannot be empty' },
            { status: 400 }
          )
        }

        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        if (!slugRegex.test(body.slug)) {
          return NextResponse.json(
            { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
            { status: 400 }
          )
        }

        // Check slug availability if changing
        if (body.slug !== slug) {
          const slugAvailable = await isSlugAvailable(body.slug, existingPost.id)
          if (!slugAvailable) {
            return NextResponse.json(
              { error: 'Slug is already in use' },
              { status: 400 }
            )
          }
        }
      }

      // Validate content if provided
      if (body.content !== undefined && (typeof body.content !== 'string' || body.content.trim().length === 0)) {
        return NextResponse.json(
          { error: 'Content cannot be empty' },
          { status: 400 }
        )
      }

      // Validate status if provided
      if (body.status !== undefined && !['draft', 'published', 'scheduled'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be draft, published, or scheduled' },
          { status: 400 }
        )
      }

      // Validate published_at for scheduled posts
      if (body.status === 'scheduled' && !body.published_at && !existingPost.published_at) {
        return NextResponse.json(
          { error: 'Published date is required for scheduled posts' },
          { status: 400 }
        )
      }

      // Validate tags if provided
      if (body.tags !== undefined && !Array.isArray(body.tags)) {
        return NextResponse.json(
          { error: 'Tags must be an array' },
          { status: 400 }
        )
      }

      // Validate category_ids if provided
      if (body.category_ids !== undefined && !Array.isArray(body.category_ids)) {
        return NextResponse.json(
          { error: 'Category IDs must be an array' },
          { status: 400 }
        )
      }

      const updateData: UpdatePostInput = {}

      if (body.title !== undefined) updateData.title = body.title.trim()
      if (body.slug !== undefined) updateData.slug = body.slug.trim()
      if (body.content !== undefined) updateData.content = body.content.trim()
      if (body.excerpt !== undefined) updateData.excerpt = body.excerpt?.trim() || undefined
      if (body.featured_image !== undefined) updateData.featured_image = body.featured_image || undefined
      if (body.status !== undefined) updateData.status = body.status
      if (body.published_at !== undefined) updateData.published_at = body.published_at
      if (body.meta_title !== undefined) updateData.meta_title = body.meta_title?.trim() || undefined
      if (body.meta_description !== undefined) updateData.meta_description = body.meta_description?.trim() || undefined
      if (body.tags !== undefined) updateData.tags = body.tags
      if (body.category_ids !== undefined) updateData.category_ids = body.category_ids

      const updatedPost = await updatePost(existingPost.id, updateData)

      if (!updatedPost) {
        return NextResponse.json(
          { error: 'Failed to update post' },
          { status: 500 }
        )
      }

      // Fetch categories for the response
      const categories = await getPostCategories(updatedPost.id)

      return NextResponse.json({
        success: true,
        post: { ...updatedPost, categories },
        message: 'Blog post updated successfully',
      })
    } catch (error) {
      console.error('Error updating blog post:', error)

      // Check for unique constraint violation
      if (error instanceof Error && error.message.includes('unique')) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to update blog post' },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE /api/blog/[slug]
 *
 * Delete a blog post (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  return withAuth(async () => {
    // Require admin role
    await requireAdmin()

    try {
      const { slug } = await params

      if (!slug) {
        return NextResponse.json(
          { error: 'Slug is required' },
          { status: 400 }
        )
      }

      // Get the existing post
      const existingPost = await getPostBySlug(slug, true)

      if (!existingPost) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      const deleted = await deletePost(existingPost.id)

      if (!deleted) {
        return NextResponse.json(
          { error: 'Failed to delete post' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Blog post deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json(
        { error: 'Failed to delete blog post' },
        { status: 500 }
      )
    }
  })
}
