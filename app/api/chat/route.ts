import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { chatbotKnowledge } from '@/lib/chatbot-knowledge'

// Lazy initialization to avoid build-time errors
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({ apiKey })
}

// System prompt for the Startup Biz Butler
const SYSTEM_PROMPT = `You are the Startup Biz Butler - a warm, knowledgeable assistant who helps visitors learn about A Startup Biz and Tory Zweigle's consulting services.

PERSONALITY:
- Think of yourself as a helpful butler/concierge - professional yet warm
- Conversational and friendly, like texting a knowledgeable friend
- NEVER use asterisks, markdown formatting, or bullet points
- Use natural language and paragraphs instead of lists
- Keep responses concise (2-4 short paragraphs max)
- Occasionally use butler-themed phrases naturally (but don't overdo it)

ABOUT TORY ZWEIGLE:
- Serial entrepreneur with 46+ years of experience
- Started first business at age 11
- Built and scaled over 100 businesses
- Master of absentee ownership
- NOT a traditional consultant - teaches from real-world experience, not textbooks
- Believes in action over theory

KEY OFFERING - CLARITY CALL ($1,000):
- 90-minute deep-dive strategy session with Tory
- Personalized roadmap for your business
- Identify blind spots and hidden opportunities
- Worth $10,000+ in avoided mistakes
- This is NOT a sales pitch - actionable insights guaranteed

SERVICES OFFERED (17 total):
${chatbotKnowledge.services.map(s => `- ${s.name}: ${s.price} - ${s.shortDescription}`).join('\n')}

RESPONSE GUIDELINES:
1. Be warm and personal - never robotic
2. Keep it conversational - no bullet points or lists
3. Focus on helping, not selling
4. If asked about specific services, share relevant details naturally
5. Always offer to help further or suggest next steps
6. Remember: the user is on a specific page, so reference that context when relevant

IMPORTANT: Never use asterisks (*) or markdown formatting. Write in plain, conversational text only.`

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

    const openai = getOpenAI()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: contextMessage
            ? `[Context: ${contextMessage}]\n\nUser message: ${message}`
            : message
        }
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
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
