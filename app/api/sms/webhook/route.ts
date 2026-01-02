import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateWebhook } from '@/lib/twilio';

export const dynamic = 'force-dynamic';

// Twilio SMS webhook handler
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-twilio-signature') || '';
    const url = request.url;

    // Parse form data from Twilio
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Validate webhook signature (enabled by default, opt-out with VALIDATE_WEBHOOKS=false)
    const shouldValidate = process.env.VALIDATE_WEBHOOKS !== 'false';
    if (shouldValidate) {
      const isValid = validateWebhook(signature, url, params);
      if (!isValid) {
        // Invalid Twilio webhook signature
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const {
      MessageSid,
      From,
      To,
      Body,
      NumMedia,
      MediaUrl0,
      MediaContentType0,
    } = params;

    // SMS received

    // Process incoming SMS
    const responseMessage = await processIncomingSMS({
      messageSid: MessageSid,
      from: From,
      to: To,
      body: Body,
      hasMedia: parseInt(NumMedia || '0') > 0,
      mediaUrl: MediaUrl0,
      mediaContentType: MediaContentType0,
    });

    // Generate TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${responseMessage ? `<Message>${responseMessage}</Message>` : ''}
</Response>`;

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function processIncomingSMS(data: {
  messageSid: string;
  from: string;
  to: string;
  body: string;
  hasMedia: boolean;
  mediaUrl?: string;
  mediaContentType?: string;
}): Promise<string | null> {
  const { from, body } = data;
  const normalizedBody = body?.toUpperCase().trim();

  // Handle common responses
  switch (normalizedBody) {
    case 'STOP':
    case 'UNSUBSCRIBE':
      // Mark contact as unsubscribed in database
      return 'You have been unsubscribed. Reply START to resubscribe.';

    case 'START':
    case 'SUBSCRIBE':
      // Mark contact as subscribed in database
      return 'You have been subscribed to our messages. Reply STOP to unsubscribe.';

    case 'CONFIRM':
      // Handle appointment confirmation
      return 'Your appointment has been confirmed. We look forward to seeing you!';

    case 'RESCHEDULE':
      // Handle reschedule request
      return 'No problem! Please visit our website or call us to reschedule your appointment.';

    case 'YES':
      // Handle lead follow-up positive response
      return 'Great! One of our team members will reach out to you shortly to schedule a call.';

    case 'HELP':
      return 'Reply STOP to unsubscribe. For support, visit astartupbiz.com or call us.';

    default:
      // Don't auto-respond to unknown messages to avoid loops
      return null;
  }
}
