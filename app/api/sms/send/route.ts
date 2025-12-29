import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { sendSMS, isTwilioConfigured, smsTemplates } from '@/lib/twilio';

export const dynamic = 'force-dynamic';

// Send SMS (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    if (!isTwilioConfigured()) {
      return NextResponse.json(
        { error: 'SMS service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { to, body: messageBody, template, templateData } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Phone number (to) is required' },
        { status: 400 }
      );
    }

    // Generate message from template or use direct body
    let finalMessage = messageBody;

    if (template && templateData) {
      switch (template) {
        case 'appointmentReminder':
          finalMessage = smsTemplates.appointmentReminder(
            templateData.name,
            templateData.date,
            templateData.time
          );
          break;
        case 'leadFollowUp':
          finalMessage = smsTemplates.leadFollowUp(
            templateData.name,
            templateData.companyName || 'A Startup Biz'
          );
          break;
        case 'paymentConfirmation':
          finalMessage = smsTemplates.paymentConfirmation(
            templateData.name,
            templateData.amount
          );
          break;
        case 'partnerApproved':
          finalMessage = smsTemplates.partnerApproved(templateData.name);
          break;
        case 'referralConverted':
          finalMessage = smsTemplates.referralConverted(
            templateData.name,
            templateData.referralName,
            templateData.commission
          );
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid template' },
            { status: 400 }
          );
      }
    }

    if (!finalMessage) {
      return NextResponse.json(
        { error: 'Message body or valid template is required' },
        { status: 400 }
      );
    }

    const result = await sendSMS({ to, body: finalMessage });

    if (result.success) {
      return NextResponse.json({
        success: true,
        sid: result.sid,
        status: result.status,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending SMS:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
