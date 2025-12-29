import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { withAuth, requireAdmin, getCurrentUserId } from '@/lib/api-auth'

// GET - List all knowledge documents
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const activeParam = searchParams.get('active')

    let documents

    if (category) {
      documents = await sql`
        SELECT * FROM chatbot_knowledge 
        WHERE category = ${category}
        ORDER BY priority DESC, created_at DESC
      `
    } else if (activeParam !== null) {
      const isActive = activeParam === 'true'
      documents = await sql`
        SELECT * FROM chatbot_knowledge 
        WHERE is_active = ${isActive}
        ORDER BY priority DESC, created_at DESC
      `
    } else {
      documents = await sql`
        SELECT * FROM chatbot_knowledge 
        ORDER BY priority DESC, created_at DESC
      `
    }

    // Get categories
    const categories = await sql`
      SELECT * FROM chatbot_categories ORDER BY sort_order
    `

    return NextResponse.json({
      success: true,
      documents,
      categories,
      total: documents.length
    })
  })
}

// POST - Create new knowledge document
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()
    const userId = await getCurrentUserId()

    const body = await request.json()
    const { title, category, content, keywords, is_active, priority } = body

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Title, category, and content are required' },
        { status: 400 }
      )
    }

    // Parse keywords if it's a string
    const keywordArray = typeof keywords === 'string' 
      ? keywords.split(',').map((k: string) => k.trim().toLowerCase()).filter(Boolean)
      : keywords || []

    const isActiveValue = is_active ?? true
    const priorityValue = priority ?? 0

    const result = await sql`
      INSERT INTO chatbot_knowledge (title, category, content, keywords, is_active, priority, created_by)
      VALUES (${title}, ${category}, ${content}, ${keywordArray}, ${isActiveValue}, ${priorityValue}, ${userId})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      document: result[0]
    })
  })
}

// PUT - Update knowledge document
export async function PUT(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const body = await request.json()
    const { id, title, category, content, keywords, is_active, priority } = body

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    // Parse keywords if it's a string
    const keywordArray = typeof keywords === 'string' 
      ? keywords.split(',').map((k: string) => k.trim().toLowerCase()).filter(Boolean)
      : keywords

    const result = await sql`
      UPDATE chatbot_knowledge 
      SET 
        title = COALESCE(${title}, title),
        category = COALESCE(${category}, category),
        content = COALESCE(${content}, content),
        keywords = COALESCE(${keywordArray}, keywords),
        is_active = COALESCE(${is_active}, is_active),
        priority = COALESCE(${priority}, priority),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      document: result[0]
    })
  })
}

// DELETE - Delete knowledge document
export async function DELETE(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    await sql`DELETE FROM chatbot_knowledge WHERE id = ${id}`

    return NextResponse.json({ success: true })
  })
}
