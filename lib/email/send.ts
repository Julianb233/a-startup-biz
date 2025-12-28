/**
 * Email sending utilities using Resend
 * Handles rendering React components to HTML and sending emails
 */

import { render } from '@react-email/render';
import { resend } from '../email';
import type { EmailSendOptions, EmailSendResult } from '../email-types';

const FROM_EMAIL = process.env.EMAIL_FROM || 'A Startup Biz <noreply@astartupbiz.com>';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@astartupbiz.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@astartupbiz.com';

export { ADMIN_EMAIL, SUPPORT_EMAIL, FROM_EMAIL };

/**
 * Send an email with React component template
 * Renders the component to HTML and sends via Resend
 */
export async function sendEmailWithTemplate(
  component: React.ReactElement,
  options: Omit<EmailSendOptions, 'html'>
): Promise<EmailSendResult> {
  try {
    // Render React component to HTML
    const html = await render(component);

    // Send email with rendered HTML
    return sendEmail({
      ...options,
      html,
    });
  } catch (error) {
    console.error('Failed to render email template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to render email template',
    };
  }
}

/**
 * Send an email using Resend
 * Core email sending function
 */
export async function sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
  const resendApiKey = process.env.RESEND_API_KEY;

  // Mock mode for development
  if (!resendApiKey || resendApiKey === 'placeholder') {
    console.log('📧 Email would be sent (mock mode):', {
      to: options.to,
      subject: options.subject,
      from: FROM_EMAIL,
    });
    return { success: true, mock: true };
  }

  try {
    const emailOptions = {
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo || SUPPORT_EMAIL,
      html: options.html,
      text: options.text,
    };

    const { data, error } = await resend.emails.send(emailOptions as any);

    if (error) {
      console.error('❌ Failed to send email:', error);
      return { success: false, error };
    }

    console.log('✅ Email sent successfully:', { to: options.to, subject: options.subject });
    return { success: true, data };
  } catch (err) {
    console.error('❌ Email send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Send multiple emails in batch
 * Useful for notifications to multiple recipients
 */
export async function sendBatchEmails(
  emails: EmailSendOptions[]
): Promise<EmailSendResult[]> {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );

  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      success: false,
      error: result.reason instanceof Error ? result.reason.message : 'Batch send failed',
    };
  });
}

/**
 * Send email to admin
 * Convenience wrapper for admin notifications
 */
export async function sendAdminEmail(
  subject: string,
  html: string,
  options?: Partial<EmailSendOptions>
): Promise<EmailSendResult> {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
    ...options,
  });
}

/**
 * Send email to support team
 * Convenience wrapper for support notifications
 */
export async function sendSupportEmail(
  subject: string,
  html: string,
  options?: Partial<EmailSendOptions>
): Promise<EmailSendResult> {
  return sendEmail({
    to: SUPPORT_EMAIL,
    subject,
    html,
    ...options,
  });
}
