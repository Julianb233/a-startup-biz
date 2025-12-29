import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Create client only if credentials are available
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface SMSOptions {
  to: string;
  body: string;
  from?: string;
}

export interface CallOptions {
  to: string;
  url: string; // TwiML URL for call instructions
  from?: string;
  statusCallback?: string;
  statusCallbackEvent?: ('initiated' | 'ringing' | 'answered' | 'completed')[];
}

// Check if Twilio is configured
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && twilioPhoneNumber);
}

// Send SMS message
export async function sendSMS({ to, body, from }: SMSOptions) {
  if (!client) {
    console.warn('Twilio not configured - SMS not sent');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const message = await client.messages.create({
      body,
      to,
      from: from || twilioPhoneNumber,
    });

    return {
      success: true,
      sid: message.sid,
      status: message.status,
    };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Initiate outbound call
export async function initiateCall({ to, url, from, statusCallback, statusCallbackEvent }: CallOptions) {
  if (!client) {
    console.warn('Twilio not configured - Call not initiated');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const call = await client.calls.create({
      to,
      from: from || twilioPhoneNumber!,
      url,
      statusCallback,
      statusCallbackEvent,
    });

    return {
      success: true,
      sid: call.sid,
      status: call.status,
    };
  } catch (error) {
    console.error('Failed to initiate call:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Generate TwiML for voice response
export function generateTwiML(options: {
  say?: string;
  gather?: {
    input: 'speech' | 'dtmf' | 'speech dtmf';
    action: string;
    timeout?: number;
    speechTimeout?: string;
  };
  record?: {
    action: string;
    maxLength?: number;
    transcribe?: boolean;
  };
  dial?: {
    number?: string;
    client?: string;
    queue?: string;
    timeout?: number;
  };
}): string {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  if (options.say) {
    response.say({ voice: 'Polly.Amy' }, options.say);
  }

  if (options.gather) {
    const gather = response.gather({
      input: [options.gather.input] as any,
      action: options.gather.action,
      timeout: options.gather.timeout || 5,
      speechTimeout: options.gather.speechTimeout || 'auto',
    });
    if (options.say) {
      gather.say({ voice: 'Polly.Amy' }, options.say);
    }
  }

  if (options.record) {
    response.record({
      action: options.record.action,
      maxLength: options.record.maxLength || 120,
      transcribe: options.record.transcribe,
    });
  }

  if (options.dial) {
    const dial = response.dial({ timeout: options.dial.timeout || 30 });
    if (options.dial.number) {
      dial.number(options.dial.number);
    }
    if (options.dial.client) {
      dial.client(options.dial.client);
    }
    if (options.dial.queue) {
      dial.queue(options.dial.queue);
    }
  }

  return response.toString();
}

// Validate Twilio webhook signature
export function validateWebhook(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  if (!authToken) return false;
  return twilio.validateRequest(authToken, signature, url, params);
}

// SMS Templates
export const smsTemplates = {
  appointmentReminder: (name: string, date: string, time: string) =>
    `Hi ${name}! This is a reminder for your appointment on ${date} at ${time}. Reply CONFIRM to confirm or RESCHEDULE to reschedule.`,

  leadFollowUp: (name: string, companyName: string) =>
    `Hi ${name}, thanks for your interest in ${companyName}! We'd love to learn more about your needs. Reply YES to schedule a quick call.`,

  paymentConfirmation: (name: string, amount: string) =>
    `Hi ${name}, your payment of ${amount} has been received. Thank you for your business!`,

  partnerApproved: (name: string) =>
    `Congratulations ${name}! Your partner application has been approved. Log in to your partner portal to get started.`,

  referralConverted: (name: string, referralName: string, commission: string) =>
    `Great news ${name}! Your referral ${referralName} just signed up. You've earned ${commission} in commission!`,
};

export default client;
