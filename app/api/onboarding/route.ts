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

    // Get client IP and user agent for analytics
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

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
      // Store complete form data in JSONB for rich querying
      formData: {
        companyName: validatedData.companyName,
        companySize: validatedData.companySize,
        revenueRange: validatedData.revenueRange,
        yearsInBusiness: validatedData.yearsInBusiness,
        website: validatedData.website,
        industry: validatedData.industry,
        businessGoals: validatedData.businessGoals,
        primaryChallenge: validatedData.primaryChallenge,
        timeline: validatedData.timeline,
        currentTools: validatedData.currentTools,
        teamSize: validatedData.teamSize,
        budgetRange: validatedData.budgetRange,
        additionalContext: validatedData.additionalContext,
        referralSource: validatedData.referralSource,
        referralCode: validatedData.referralCode,
        servicesInterested: validatedData.servicesInterested,
        priorityLevel: validatedData.priorityLevel,
        specificNeeds: validatedData.specificNeeds,
        brandStyle: validatedData.brandStyle,
        primaryColor: validatedData.primaryColor,
        secondaryColor: validatedData.secondaryColor,
        logoUrl: validatedData.logoUrl,
        aboutBusiness: validatedData.aboutBusiness,
        servicesDescription: validatedData.servicesDescription,
        uniqueValue: validatedData.uniqueValue,
        targetAudience: validatedData.targetAudience,
        businessCategory: validatedData.businessCategory,
        businessHours: validatedData.businessHours,
        businessDescription: validatedData.businessDescription,
        socialMedia: {
          facebook: validatedData.socialFacebook,
          instagram: validatedData.socialInstagram,
          linkedin: validatedData.socialLinkedin,
          tiktok: validatedData.socialTiktok,
          youtube: validatedData.socialYoutube,
          twitter: validatedData.socialTwitter,
        },
        googleMapsUrl: validatedData.googleMapsUrl,
        contactName: validatedData.contactName,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        bestTimeToCall: validatedData.bestTimeToCall,
        timezone: validatedData.timezone,
        communicationPreference: validatedData.communicationPreference,
        additionalNotes: validatedData.additionalNotes,
        selectedPlan: validatedData.selectedPlan,
        paymentMethod: validatedData.paymentMethod,
      },
      // Keep legacy field for backward compatibility
      additionalInfo: JSON.stringify({
        companySize: validatedData.companySize,
        revenueRange: validatedData.revenueRange,
        servicesInterested: validatedData.servicesInterested,
        priorityLevel: validatedData.priorityLevel,
      }),
      source: 'onboarding_form',
      ipAddress: ipAddress ?? undefined,
      userAgent: userAgent ?? undefined,
      referralCode: validatedData.referralCode,
      completionPercentage: 100, // Assuming complete submission
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
      // SECURITY FIX: Don't silently fail - database save is critical
      // Users must know if their submission wasn't saved properly
      console.error('Database save failed:', dbError);

      // Return error to user - they need to know their data wasn't saved
      return NextResponse.json(
        {
          success: false,
          message: 'We encountered an issue saving your information. Please try again in a few moments.',
          error: 'Database temporarily unavailable',
          // Include a reference for support without exposing internals
          reference: `ERR-${Date.now().toString(36).toUpperCase()}`,
        },
        { status: 503 } // Service Unavailable
      );
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

    // Sync to HubSpot CRM (non-blocking)
    if (process.env.HUBSPOT_API_KEY) {
      try {
        const { upsertContact } = await import('@/lib/hubspot/contacts');
        const { createDealFromOnboarding } = await import('@/lib/hubspot/deals');

        const hubspotData = {
          contactEmail: validatedData.contactEmail,
          contactName: validatedData.contactName,
          contactPhone: validatedData.contactPhone,
          companyName: validatedData.companyName,
          website: validatedData.website,
          industry: validatedData.industry,
          businessGoals: validatedData.businessGoals,
          primaryChallenge: validatedData.primaryChallenge,
          timeline: validatedData.timeline,
          budgetRange: validatedData.budgetRange,
          servicesInterested: validatedData.servicesInterested,
          priorityLevel: validatedData.priorityLevel,
          referralSource: validatedData.referralSource,
          referralCode: validatedData.referralCode,
          socialFacebook: validatedData.socialFacebook,
          socialInstagram: validatedData.socialInstagram,
          socialLinkedin: validatedData.socialLinkedin,
          socialTwitter: validatedData.socialTwitter,
          socialYoutube: validatedData.socialYoutube,
          socialTiktok: validatedData.socialTiktok,
          companySize: validatedData.companySize,
          revenueRange: validatedData.revenueRange,
          yearsInBusiness: validatedData.yearsInBusiness,
          bestTimeToCall: validatedData.bestTimeToCall,
          timezone: validatedData.timezone,
          communicationPreference: validatedData.communicationPreference,
          additionalContext: validatedData.additionalContext,
        };

        const { contact, created } = await upsertContact(hubspotData);
        console.log(`Contact ${created ? 'created' : 'updated'} in HubSpot: ${contact.id}`);

        // Create deal if qualified (has budget or priority)
        if (validatedData.budgetRange || validatedData.priorityLevel) {
          const deal = await createDealFromOnboarding(hubspotData, contact.id, {
            autoQualify: true,
          });
          console.log(`Deal created in HubSpot: ${deal.id}`);
        }
      } catch (hubspotError) {
        // Don't fail the request if HubSpot sync fails
        console.error('Failed to sync to HubSpot (non-fatal):', hubspotError);
      }
    } else {
      console.log('HubSpot API key not configured - skipping CRM sync');
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
