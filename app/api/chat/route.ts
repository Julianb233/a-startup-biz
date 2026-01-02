import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders } from '@/lib/cors'
import OpenAI from 'openai'
import { sql } from '@/lib/db'
import { chatbotKnowledge } from '@/lib/chatbot-knowledge'

// Lazy initialization to avoid build-time errors
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({ apiKey })
}

// Fetch knowledge from database
async function getKnowledgeFromDB(): Promise<string> {
  try {
    const knowledge = await sql`
      SELECT title, category, content, keywords
      FROM chatbot_knowledge
      WHERE is_active = true
      ORDER BY priority DESC, category, title
    `

    if (knowledge.length === 0) {
      // Fallback to hardcoded knowledge
      return chatbotKnowledge.services.map(s =>
        `${s.name}: ${s.price} - ${s.shortDescription}`
      ).join('\n')
    }

    // Group by category
    const byCategory: Record<string, string[]> = {}
    for (const doc of knowledge) {
      if (!byCategory[doc.category]) {
        byCategory[doc.category] = []
      }
      byCategory[doc.category].push(`${doc.title}: ${doc.content}`)
    }

    // Format as knowledge base
    return Object.entries(byCategory)
      .map(([category, docs]) => `\n[${category}]\n${docs.join('\n\n')}`)
      .join('\n')
  } catch (error) {
    console.error('Error fetching knowledge from DB:', error)
    // Fallback to hardcoded knowledge
    return chatbotKnowledge.services.map(s =>
      `${s.name}: ${s.price} - ${s.shortDescription}`
    ).join('\n')
  }
}

// Find relevant knowledge based on user message
async function findRelevantKnowledge(message: string): Promise<string> {
  try {
    const words = message.toLowerCase().split(/\s+/)

    // Search for matching knowledge by keywords
    const matches = await sql`
      SELECT title, content, keywords
      FROM chatbot_knowledge
      WHERE is_active = true
      AND (
        keywords && ${words}::text[]
        OR title ILIKE ${'%' + message + '%'}
        OR content ILIKE ${'%' + message + '%'}
      )
      ORDER BY priority DESC
      LIMIT 5
    `

    if (matches.length > 0) {
      return matches.map(m => `${m.title}: ${m.content}`).join('\n\n')
    }
    return ''
  } catch (error) {
    console.error('Error finding relevant knowledge:', error)
    return ''
  }
}

// Build dynamic system prompt with database knowledge
async function buildSystemPrompt(): Promise<string> {
  const knowledgeBase = await getKnowledgeFromDB()

  return `You are the Startup Biz Butler - a warm, knowledgeable assistant who helps visitors learn about A Startup Biz and Tory Zweigle's consulting services.

PERSONALITY:
- Think of yourself as a helpful butler/concierge - professional yet warm
- Conversational and friendly, like texting a knowledgeable friend
- NEVER use asterisks, markdown formatting, or bullet points
- Use natural language and paragraphs instead of lists
- Keep responses concise (2-4 short paragraphs max)
- Occasionally use butler-themed phrases naturally (but don't overdo it)

KNOWLEDGE BASE (use this information to answer questions):
${knowledgeBase}

RESPONSE GUIDELINES:
1. Be warm and personal - never robotic
2. Keep it conversational - no bullet points or lists
3. Focus on helping, not selling
4. If asked about specific services, share relevant details naturally
5. Always offer to help further or suggest next steps
6. Reference the user's current page context when relevant

IMPORTANT: Never use asterisks (*) or markdown formatting. Write in plain, conversational text only.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, pageContext } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build context message based on current page
    let contextMessage = ''
    if (pageContext?.path) {
      const path = pageContext.path
      if (path.includes('/services')) {
        contextMessage = `The user is currently browsing the services page. `
        if (pageContext.pageTitle) {
          contextMessage += `Specifically, they're looking at: ${pageContext.pageTitle}. `
        }
      } else if (path.includes('/about')) {
        contextMessage = `The user is on the About page, learning about Tory. `
      } else if (path.includes('/contact')) {
        contextMessage = `The user is on the Contact page, ready to reach out. `
      } else if (path.includes('/quote') || path.includes('/clarity')) {
        contextMessage = `The user is interested in booking a Clarity Call. `
      } else if (path === '/' || path === '') {
        contextMessage = `The user just arrived at the homepage. `
      }
    }

    // Get relevant knowledge for this specific query
    const relevantKnowledge = await findRelevantKnowledge(message)

    // Build the system prompt with database knowledge
    const systemPrompt = await buildSystemPrompt()

    const openai = getOpenAI()

    // Build user message with context and relevant knowledge
    let userContent = ''
    if (contextMessage) {
      userContent += `[Page Context: ${contextMessage}]\n\n`
    }
    if (relevantKnowledge) {
      userContent += `[Relevant Knowledge for this question:\n${relevantKnowledge}]\n\n`
    }
    userContent += `User message: ${message}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content ||
      "I'd be happy to help you learn more about our services. What would you like to know?"

    // Clean any accidental markdown that might slip through
    const cleanResponse = response
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/`/g, '')

    return NextResponse.json({
      success: true,
      message: cleanResponse
    })

  } catch (error) {
    console.error('Chat API error:', error)

    // Return a friendly fallback message
    return NextResponse.json({
      success: true,
      message: "I apologize, but I'm having a moment. Please try again, or feel free to reach out to our team directly at hello@astartupbiz.com. We're always happy to help!"
    })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return NextResponse.json({}, {
    status: 200,
    headers: getCorsHeaders(origin, 'POST, OPTIONS'),
  })
}
