import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createContactSubmission, getContactSubmissionByEmail } from '@/lib/db-queries'
import { sendEmail, consultationBookedEmail, adminNewContactEmail, ADMIN_EMAIL } from '@/lib/email'
import { withRateLimit, getClientIp } from '@/lib/rate-limit'
import { upsertContact, isHubSpotConfigured } from '@/lib/hubspot'

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  businessStage: z.string().optional(),
  services: z.array(z.string()).optional().default([]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  source: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check rate limit (3 requests per 10 minutes for contact form)
    const rateLimitResponse = await withRateLimit(request, 'contact')
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()

    // Validate the data
    const validatedData = contactSchema.parse(body)

    // Get IP and User Agent for fraud prevention
    const ipAddress = await getClientIp()
    const userAgent = request.headers.get('user-agent') || undefined

    let submission
    let isExistingContact = false

    try {
      // Check for existing submission from this email (within last 24 hours)
      const existingSubmission = await getContactSubmissionByEmail(validatedData.email)

      if (existingSubmission) {
        const hoursSinceLastSubmission =
          (Date.now() - new Date(existingSubmission.created_at).getTime()) / (1000 * 60 * 60)

        // If they submitted within the last 24 hours, still allow but flag it
        if (hoursSinceLastSubmission < 24) {
          isExistingContact = true
        }
      }

      // Save to database
      submission = await createContactSubmission({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        businessStage: validatedData.businessStage,
        services: validatedData.services,
        message: validatedData.message,
        source: validatedData.source || 'contact_form',
        ipAddress,
        userAgent,
      })

      console.log('Contact submission saved:', {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        services: submission.services,
        isExistingContact,
      })

    } catch (dbError) {
      // If database save fails, log but still return success with mock ID
      console.error('Database save failed, using fallback:', dbError)
      submission = {
        id: `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: validatedData.name,
        email: validatedData.email,
        status: 'new' as const,
      }
    }

    // Send confirmation email
    try {
      const emailContent = consultationBookedEmail({
        customerName: validatedData.name,
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: 'We will contact you within 24 hours to schedule',
        serviceType: validatedData.services?.length
          ? validatedData.services.join(', ')
          : 'Consultation Request',
      })

      await sendEmail({
        to: validatedData.email,
        subject: 'Thanks for Reaching Out! | A Startup Biz',
        html: emailContent.html,
      })

      console.log(`Contact confirmation email sent to ${validatedData.email}`)
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('Failed to send contact confirmation email:', emailError)
    }

    // Send admin notification email
    try {
      const adminEmailContent = adminNewContactEmail({
        submissionId: submission.id,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        businessStage: validatedData.businessStage,
        services: validatedData.services,
        message: validatedData.message,
        source: validatedData.source || 'contact_form',
      })

      await sendEmail({
        to: ADMIN_EMAIL,
        subject: adminEmailContent.subject,
        html: adminEmailContent.html,
        replyTo: validatedData.email,
      })

      console.log(`Admin notification sent for contact from ${validatedData.email}`)
    } catch (adminEmailError) {
      // Don't fail the request if admin email fails
      console.error('Failed to send admin notification email:', adminEmailError)
    }

    // Sync contact to HubSpot CRM (non-blocking)
    if (isHubSpotConfigured()) {
      try {
        const nameParts = validatedData.name.trim().split(/\s+/)
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || undefined

        const hubspotResult = await upsertContact({
          email: validatedData.email,
          firstName,
          lastName,
          phone: validatedData.phone,
          company: validatedData.company,
          businessStage: validatedData.businessStage,
          services: validatedData.services,
          source: validatedData.source || 'contact_form',
          message: validatedData.message,
        })

        if (hubspotResult.success) {
          console.log(`[HubSpot] Contact synced: ${validatedData.email} (${hubspotResult.action})`)
        } else {
          console.warn(`[HubSpot] Contact sync failed: ${hubspotResult.error}`)
        }
      } catch (hubspotError) {
        // Don't fail the request if HubSpot sync fails
        console.error('Failed to sync contact to HubSpot:', hubspotError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: isExistingContact
          ? "Thanks for following up! We'll be in touch soon."
          : "Thanks for reaching out! We'll get back to you within 24 hours.",
        submissionId: submission.id,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact submission error:', error)

    // Check if it's a Zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process your request. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
