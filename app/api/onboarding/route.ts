import { NextRequest, NextResponse } from 'next/server';
import { onboardingSchema, type OnboardingData } from '@/lib/onboarding-data';
import {
  createOnboardingSubmission,
  getOnboardingSubmissionByEmail,
  getAllOnboardingSubmissions,
  updateOnboardingStatus
} from '@/lib/db-queries';
import { sendEmail, onboardingSubmittedEmail, adminNewOnboardingEmail, ADMIN_EMAIL } from '@/lib/email';
import { withRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await withRateLimit(request, 'onboarding');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // Validate the data against our schema
    const validatedData = onboardingSchema.parse(body);

    // Map the frontend form data to database schema
    const submissionData = {
      businessName: validatedData.companyName,
      businessType: validatedData.industry,
      businessStage: validatedData.companySize || 'startup',
      goals: validatedData.businessGoals || [],
      challenges: validatedData.primaryChallenge ? [validatedData.primaryChallenge] : [],
      contactEmail: validatedData.contactEmail,
      contactPhone: validatedData.contactPhone,
      timeline: validatedData.timeline,
      budgetRange: validatedData.budgetRange,
      additionalInfo: JSON.stringify({
        companySize: validatedData.companySize,
        revenueRange: validatedData.revenueRange,
        yearsInBusiness: validatedData.yearsInBusiness,
        servicesInterested: validatedData.servicesInterested,
        priorityLevel: validatedData.priorityLevel,
        currentTools: validatedData.currentTools,
        teamSize: validatedData.teamSize,
        referralSource: validatedData.referralSource,
        brandStyle: validatedData.brandStyle,
        primaryColor: validatedData.primaryColor,
        secondaryColor: validatedData.secondaryColor,
        logoUrl: validatedData.logoUrl,
        aboutBusiness: validatedData.aboutBusiness,
        servicesDescription: validatedData.servicesDescription,
        businessCategory: validatedData.businessCategory,
        businessHours: validatedData.businessHours,
        socialMedia: {
          facebook: validatedData.socialFacebook,
          instagram: validatedData.socialInstagram,
          linkedin: validatedData.socialLinkedin,
          tiktok: validatedData.socialTiktok,
          youtube: validatedData.socialYoutube,
          twitter: validatedData.socialTwitter,
        },
        contactName: validatedData.contactName,
        bestTimeToCall: validatedData.bestTimeToCall,
        website: validatedData.website,
        uniqueValue: validatedData.uniqueValue,
        targetAudience: validatedData.targetAudience,
        additionalContext: validatedData.additionalContext,
      }),
    };

    let submission;
    let isUpdate = false;

    try {
      // Check if there's an existing submission with this email
      const existingSubmission = await getOnboardingSubmissionByEmail(validatedData.contactEmail);

      if (existingSubmission) {
        // For now, we'll create a new submission even if one exists
        // In production, you might want to update the existing one instead
        isUpdate = true;
      }

      // Save to database
      submission = await createOnboardingSubmission(submissionData);

      console.log('Onboarding submission saved:', {
        id: submission.id,
        businessName: submission.business_name,
        contactEmail: submission.contact_email,
        status: submission.status,
        isUpdate,
      });

    } catch (dbError) {
      // If database save fails, log but still return success with mock ID
      // This ensures the user experience isn't broken if DB is unavailable
      console.error('Database save failed, using fallback:', dbError);
      submission = {
        id: `ONB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        business_name: submissionData.businessName,
        contact_email: submissionData.contactEmail,
        status: 'submitted' as const,
      };
    }

    // Send confirmation email to client
    try {
      const emailContent = onboardingSubmittedEmail({
        customerName: validatedData.contactName || validatedData.companyName,
        businessName: validatedData.companyName,
      });

      await sendEmail({
        to: validatedData.contactEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      console.log(`Onboarding confirmation email sent to ${validatedData.contactEmail}`);
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('Failed to send onboarding confirmation email:', emailError);
    }

    // Send admin notification email
    try {
      const adminEmailContent = adminNewOnboardingEmail({
        submissionId: submission.id,
        businessName: submissionData.businessName,
        businessType: submissionData.businessType,
        contactEmail: submissionData.contactEmail,
        contactPhone: submissionData.contactPhone,
        timeline: submissionData.timeline,
        budgetRange: submissionData.budgetRange,
        goals: submissionData.goals,
        challenges: submissionData.challenges,
      });

      await sendEmail({
        to: ADMIN_EMAIL,
        subject: adminEmailContent.subject,
        html: adminEmailContent.html,
        replyTo: validatedData.contactEmail,
      });

      console.log(`Admin notification sent for onboarding from ${validatedData.contactEmail}`);
    } catch (adminEmailError) {
      // Don't fail the request if admin email fails
      console.error('Failed to send admin onboarding notification:', adminEmailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: isUpdate
          ? 'Your information has been updated successfully'
          : 'Onboarding data submitted successfully',
        submissionId: submission.id,
        data: {
          businessName: validatedData.companyName,
          contactName: validatedData.contactName,
          contactEmail: validatedData.contactEmail,
          servicesInterested: validatedData.servicesInterested,
          priorityLevel: validatedData.priorityLevel,
          timeline: validatedData.timeline,
          status: submission.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Onboarding submission error:', error);

    // Check if it's a Zod validation error
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error,
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process onboarding data',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve saved progress or check existing submission
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: 'Email parameter required',
      },
      { status: 400 }
    );
  }

  try {
    const submission = await getOnboardingSubmissionByEmail(email);

    if (submission) {
      return NextResponse.json(
        {
          success: true,
          exists: true,
          data: {
            id: submission.id,
            businessName: submission.business_name,
            status: submission.status,
            createdAt: submission.created_at,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        exists: false,
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking submission:', error);
    return NextResponse.json(
      {
        success: true,
        exists: false,
        data: null,
      },
      { status: 200 }
    );
  }
}
