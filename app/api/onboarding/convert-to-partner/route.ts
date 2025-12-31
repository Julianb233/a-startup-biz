import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/clerk-server-safe';
import { sql } from '@/lib/db-queries';
import { sendEmail, partnerAccountCreatedEmail, ADMIN_EMAIL } from '@/lib/email';
import { getSiteUrl } from '@/lib/site-url';

/**
 * POST /api/onboarding/convert-to-partner
 *
 * Convert an onboarding submission to a partner account
 *
 * Request Body:
 * {
 *   onboardingId: string,
 *   commissionRate?: number (default: 10.00),
 *   autoApprove?: boolean (default: false)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   partnerId: string,
 *   message: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication (admin only for now)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { onboardingId, commissionRate = 10.00, autoApprove = false } = body;

    // Validate input
    if (!onboardingId) {
      return NextResponse.json(
        { success: false, error: 'Onboarding ID is required' },
        { status: 400 }
      );
    }

    // Validate commission rate
    if (commissionRate < 0 || commissionRate > 100) {
      return NextResponse.json(
        { success: false, error: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Call database function to create partner from onboarding
    const result = await sql`
      SELECT create_partner_from_onboarding(
        ${onboardingId}::UUID,
        ${commissionRate}::DECIMAL
      ) as partner_id
    ` as { partner_id: string }[];

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to create partner account' },
        { status: 500 }
      );
    }

    const partnerId = result[0].partner_id;

    // If auto-approve, update partner status
    if (autoApprove) {
      await sql`
        UPDATE partners
        SET status = 'active', updated_at = NOW()
        WHERE id = ${partnerId}
      `;
    }

    // Get partner details for email
    const partnerDetails = await sql`
      SELECT
        p.*,
        os.contact_email,
        os.business_name
      FROM partners p
      JOIN onboarding_submissions os ON p.onboarding_submission_id = os.id
      WHERE p.id = ${partnerId}
    ` as any[];

    const partner = partnerDetails[0];

    // Send notification email to partner
    if (partner && partner.contact_email) {
      try {
        const emailContent = partnerAccountCreatedEmail({
          partnerName: partner.company_name,
          status: autoApprove ? 'active' : 'pending',
          commissionRate: commissionRate,
        });

        await sendEmail({
          to: partner.contact_email,
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log(`Partner account created email sent to ${partner.contact_email}`);
      } catch (emailError) {
        console.error('Failed to send partner account created email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Send admin notification
    try {
      const siteUrl = getSiteUrl();
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Partner Account Created: ${partner.company_name}`,
        html: `
          <h2>New Partner Account Created</h2>
          <p><strong>Partner ID:</strong> ${partnerId}</p>
          <p><strong>Company Name:</strong> ${partner.company_name}</p>
          <p><strong>Email:</strong> ${partner.contact_email}</p>
          <p><strong>Commission Rate:</strong> ${commissionRate}%</p>
          <p><strong>Status:</strong> ${autoApprove ? 'Active' : 'Pending Approval'}</p>
          <p><strong>Created From Onboarding ID:</strong> ${onboardingId}</p>
          <br>
          <p><a href="${siteUrl}/admin/partners/${partnerId}">View Partner →</a></p>
        `,
      });
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
    }

    return NextResponse.json(
      {
        success: true,
        partnerId,
        message: autoApprove
          ? 'Partner account created and activated successfully'
          : 'Partner account created and pending approval',
        data: {
          partnerId,
          companyName: partner.company_name,
          status: autoApprove ? 'active' : 'pending',
          commissionRate,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error converting onboarding to partner:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { success: false, error: 'Onboarding submission not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('already created')) {
        return NextResponse.json(
          { success: false, error: 'Partner account already exists for this onboarding' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create partner account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/onboarding/convert-to-partner?onboardingId=xxx
 *
 * Check if onboarding can be converted to partner
 *
 * Response:
 * {
 *   canConvert: boolean,
 *   reason?: string,
 *   existingPartnerId?: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const onboardingId = searchParams.get('onboardingId');

    if (!onboardingId) {
      return NextResponse.json(
        { success: false, error: 'Onboarding ID is required' },
        { status: 400 }
      );
    }

    // Check if onboarding exists
    const onboarding = await sql`
      SELECT
        id,
        partner_account_created,
        partner_id,
        business_name,
        contact_email
      FROM onboarding_submissions
      WHERE id = ${onboardingId}
    ` as any[];

    if (!onboarding || onboarding.length === 0) {
      return NextResponse.json(
        {
          success: false,
          canConvert: false,
          reason: 'Onboarding submission not found'
        },
        { status: 404 }
      );
    }

    const submission = onboarding[0];

    // Check if already converted
    if (submission.partner_account_created && submission.partner_id) {
      return NextResponse.json(
        {
          success: true,
          canConvert: false,
          reason: 'Partner account already exists',
          existingPartnerId: submission.partner_id,
          data: {
            businessName: submission.business_name,
            contactEmail: submission.contact_email,
          }
        },
        { status: 200 }
      );
    }

    // Can convert
    return NextResponse.json(
      {
        success: true,
        canConvert: true,
        data: {
          onboardingId: submission.id,
          businessName: submission.business_name,
          contactEmail: submission.contact_email,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking onboarding conversion:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check conversion eligibility',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
