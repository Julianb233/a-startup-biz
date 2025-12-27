import { NextRequest, NextResponse } from 'next/server';
import { onboardingSchema, type OnboardingData } from '@/lib/onboarding-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data against our schema
    const validatedData = onboardingSchema.parse(body);

    // In a real application, you would:
    // 1. Save to database
    // 2. Create a CRM entry
    // 3. Send notification emails
    // 4. Create tasks for the team
    // 5. Schedule follow-up calls

    // For now, we'll simulate the save
    console.log('Onboarding data received:', {
      companyName: validatedData.companyName,
      contactEmail: validatedData.contactEmail,
      services: validatedData.servicesInterested,
      priority: validatedData.priorityLevel,
    });

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a unique submission ID
    const submissionId = `ONB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // In production, you might want to:
    // - Send welcome email to client
    // - Notify sales team
    // - Create calendar event
    // - Add to CRM system
    // - Generate intake document

    return NextResponse.json(
      {
        success: true,
        message: 'Onboarding data submitted successfully',
        submissionId,
        data: {
          companyName: validatedData.companyName,
          contactName: validatedData.contactName,
          contactEmail: validatedData.contactEmail,
          servicesInterested: validatedData.servicesInterested,
          priorityLevel: validatedData.priorityLevel,
          timeline: validatedData.timeline,
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

// GET endpoint to retrieve saved progress (optional)
export async function GET(request: NextRequest) {
  // In a real application, you might want to retrieve saved progress
  // based on email or session ID
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

  // This would query your database for saved progress
  // For now, return empty
  return NextResponse.json(
    {
      success: true,
      data: null,
    },
    { status: 200 }
  );
}
