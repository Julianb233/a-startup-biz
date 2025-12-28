import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { withRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/email/send
 * Send an email using configured email provider (Resend)
 *
 * Request body:
 * {
 *   to: string | string[],
 *   subject: string,
 *   body?: string,          // Plain text body
 *   html?: string,          // HTML body
 *   template?: string,      // Optional: template name (e.g., 'welcome', 'onboarding-confirmation')
 *   templateData?: object,  // Data to populate template
 *   replyTo?: string
 * }
 */

const sendEmailSchema = z.object({
  to: z.union([
    z.string().email('Invalid email address'),
    z.array(z.string().email('Invalid email address')),
  ]),
  subject: z.string().min(1, 'Subject is required').max(200),
  body: z.string().optional(),
  html: z.string().optional(),
  template: z.string().optional(),
  templateData: z.record(z.any()).optional(),
  replyTo: z.string().email('Invalid reply-to email').optional(),
}).refine(
  (data) => data.body || data.html || data.template,
  { message: 'Either body, html, or template must be provided' }
);

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await withRateLimit(request, 'email');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const validated = sendEmailSchema.parse(body);

    let emailContent: { subject: string; html?: string; text?: string } = {
      subject: validated.subject,
    };

    // Handle template-based emails
    if (validated.template && validated.templateData) {
      const templates = await import('@/lib/email');

      switch (validated.template) {
        case 'welcome':
          emailContent = templates.welcomeEmail(validated.templateData as any);
          break;
        case 'onboarding-confirmation':
          emailContent = templates.onboardingSubmittedEmail(validated.templateData as any);
          break;
        case 'order-confirmation':
          emailContent = templates.orderConfirmationEmail(validated.templateData as any);
          break;
        case 'consultation-booked':
          emailContent = templates.consultationBookedEmail(validated.templateData as any);
          break;
        case 'notification':
          emailContent = templates.notificationEmail(validated.templateData as any);
          break;
        default:
          return NextResponse.json(
            {
              success: false,
              error: `Unknown template: ${validated.template}`,
            },
            { status: 400 }
          );
      }
    } else {
      // Use provided content
      emailContent = {
        subject: validated.subject,
        html: validated.html,
        text: validated.body,
      };
    }

    // Send the email
    const result = await sendEmail({
      to: validated.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: validated.replyTo,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          details: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        data: result.data,
        mock: result.mock || false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email send error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
