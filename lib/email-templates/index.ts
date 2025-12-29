import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Base styles for all emails
const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 32px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
  .content { padding: 32px; }
  .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; margin: 16px 0; }
  .button:hover { opacity: 0.9; }
  .footer { background: #f8f9fa; padding: 24px; text-align: center; font-size: 12px; color: #666; }
  .divider { border-top: 1px solid #eee; margin: 24px 0; }
  .highlight { background: #f0f4ff; padding: 16px; border-radius: 6px; border-left: 4px solid #667eea; }
`;

// Welcome Email Template
export function welcomeEmail(data: { name: string; email: string; companyName?: string }) {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to ${data.companyName || 'Our Platform'}!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.name},</p>
      <p>We're thrilled to have you on board! Your account has been successfully created.</p>
      <div class="highlight">
        <strong>Your login email:</strong> ${data.email}
      </div>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Explore our features</li>
        <li>Connect with our community</li>
      </ul>
      <a href="#" class="button">Get Started</a>
      <p>If you have any questions, our support team is here to help.</p>
      <p>Best regards,<br>The Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${data.companyName || 'Company'}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

// Partner Approved Email Template
export function partnerApprovedEmail(data: { name: string; referralCode: string; portalUrl: string }) {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Congratulations! You're Approved!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.name},</p>
      <p>Great news! Your partner application has been approved. You're now officially part of our partner program!</p>
      <div class="highlight">
        <strong>Your Referral Code:</strong> ${data.referralCode}<br>
        <small>Share this code with your clients to earn commissions</small>
      </div>
      <p>What's next?</p>
      <ul>
        <li>Access your partner portal</li>
        <li>Set up your payout details</li>
        <li>Start referring clients</li>
      </ul>
      <a href="${data.portalUrl}" class="button">Access Partner Portal</a>
      <div class="divider"></div>
      <p><strong>Commission Structure:</strong></p>
      <ul>
        <li>10% on all referred sales</li>
        <li>Monthly payouts via Stripe</li>
        <li>Real-time tracking dashboard</li>
      </ul>
      <p>Welcome aboard!</p>
    </div>
    <div class="footer">
      <p>Questions? Reply to this email or contact support.</p>
    </div>
  </div>
</body>
</html>`;
}

// Lead Converted Email Template
export function leadConvertedEmail(data: { partnerName: string; clientName: string; amount: number; commission: number }) {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
      <h1>You Made a Sale!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.partnerName},</p>
      <p>Your referral just converted! Here are the details:</p>
      <div class="highlight" style="border-left-color: #11998e;">
        <p><strong>Client:</strong> ${data.clientName}</p>
        <p><strong>Sale Amount:</strong> $${data.amount.toFixed(2)}</p>
        <p><strong>Your Commission:</strong> $${data.commission.toFixed(2)}</p>
      </div>
      <p>This commission will be included in your next monthly payout.</p>
      <a href="#" class="button" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">View Dashboard</a>
      <p>Keep up the great work!</p>
    </div>
    <div class="footer">
      <p>Your commissions are processed monthly.</p>
    </div>
  </div>
</body>
</html>`;
}

// Payout Sent Email Template
export function payoutSentEmail(data: { name: string; amount: number; payoutId: string; referrals: number }) {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
      <h1>Payout Sent!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.name},</p>
      <p>Your monthly payout has been processed and is on its way!</p>
      <div class="highlight" style="border-left-color: #f5576c;">
        <p style="font-size: 32px; font-weight: bold; margin: 0;">$${data.amount.toFixed(2)}</p>
        <p style="margin: 8px 0 0 0; color: #666;">From ${data.referrals} referral${data.referrals !== 1 ? 's' : ''}</p>
      </div>
      <p><strong>Payout ID:</strong> ${data.payoutId}</p>
      <p>Funds typically arrive within 2-3 business days.</p>
      <a href="#" class="button" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">View Payout History</a>
      <p>Thank you for being an amazing partner!</p>
    </div>
    <div class="footer">
      <p>Questions about your payout? Contact support.</p>
    </div>
  </div>
</body>
</html>`;
}

// Contact Form Notification Email
export function contactFormEmail(data: { name: string; email: string; phone?: string; message: string; subject?: string }) {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="highlight">
        <p><strong>From:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
      </div>
      <div class="divider"></div>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${data.message}</p>
      <div class="divider"></div>
      <a href="mailto:${data.email}" class="button">Reply to ${data.name}</a>
    </div>
    <div class="footer">
      <p>Received at ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>`;
}

// Appointment Confirmation Email
export function appointmentConfirmationEmail(data: { name: string; date: string; time: string; type: string; meetingLink?: string }) {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
      <h1>Appointment Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hi ${data.name},</p>
      <p>Your appointment has been confirmed. Here are the details:</p>
      <div class="highlight" style="border-left-color: #4facfe;">
        <p><strong>Type:</strong> ${data.type}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
      </div>
      ${data.meetingLink ? `<a href="${data.meetingLink}" class="button" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">Join Meeting</a>` : ''}
      <p><strong>Preparation Tips:</strong></p>
      <ul>
        <li>Have your questions ready</li>
        <li>Ensure a quiet environment</li>
        <li>Test your audio/video beforehand</li>
      </ul>
      <p>We look forward to speaking with you!</p>
    </div>
    <div class="footer">
      <p>Need to reschedule? Reply to this email at least 24 hours in advance.</p>
    </div>
  </div>
</body>
</html>`;
}

// Password Reset Email
export function passwordResetEmail(data: { name: string; resetLink: string; expiresIn: string }) {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi ${data.name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <a href="${data.resetLink}" class="button" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">Reset Password</a>
      <div class="highlight" style="border-left-color: #fa709a;">
        <p><strong>This link expires in ${data.expiresIn}</strong></p>
      </div>
      <p>If you didn't request this, you can safely ignore this email. Your password won't change until you create a new one.</p>
      <p>For security reasons, this link can only be used once.</p>
    </div>
    <div class="footer">
      <p>If you're having trouble, contact support.</p>
    </div>
  </div>
</body>
</html>`;
}

// Email sending helper
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  const { data, error } = await resend.emails.send({
    from: options.from || 'notifications@astartupbiz.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });

  if (error) {
    console.error('Email send error:', error);
    throw error;
  }

  return data;
}

export default {
  welcomeEmail,
  partnerApprovedEmail,
  leadConvertedEmail,
  payoutSentEmail,
  contactFormEmail,
  appointmentConfirmationEmail,
  passwordResetEmail,
  sendEmail,
};
