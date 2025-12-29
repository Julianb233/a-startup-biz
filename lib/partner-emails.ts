import { sendEmail } from './email'
import { sql } from './db'

interface PartnerWelcomeEmailParams {
  partnerId: string
  partnerName: string
  partnerEmail: string
  micrositeUrl: string | null
  portalUrl: string
  agreementsUrl: string
}

interface AgreementReminderParams {
  partnerId: string
  partnerName: string
  partnerEmail: string
  agreementsUrl: string
  pendingAgreements: string[]
}

interface LeadNotificationParams {
  partnerId: string
  partnerEmail: string
  partnerName: string
  leadName: string
  leadEmail: string
  leadPhone: string | null
  micrositeName: string
}

/**
 * Send welcome email to newly approved partner
 */
export async function sendPartnerWelcomeEmail(
  params: PartnerWelcomeEmailParams
): Promise<void> {
  const subject = `Welcome to the Partner Program, ${params.partnerName}!`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ff6a1a 0%, #ff8f4c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .step { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #ff6a1a; }
    .step-number { display: inline-block; width: 28px; height: 28px; background: #ff6a1a; color: white; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; margin-right: 10px; }
    .button { display: inline-block; background: #ff6a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px 10px 0; }
    .button:hover { background: #e55a0a; }
    .button-secondary { background: #1a1a2e; }
    .microsite-box { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .microsite-url { background: white; padding: 10px 15px; border-radius: 4px; font-family: monospace; word-break: break-all; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to the Partner Program!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${params.partnerName}</strong>,</p>

      <p>Congratulations! Your partner application has been approved. You're now part of our referral program and can start earning commissions on qualified referrals.</p>

      <h2 style="color: #1a1a2e; margin-top: 30px;">Next Steps</h2>

      <div class="step">
        <span class="step-number">1</span>
        <strong>Sign Required Agreements</strong>
        <p style="margin: 10px 0 0 38px;">Complete the Partner Agreement, NDA, and Commission Structure to activate your account.</p>
        <a href="${params.agreementsUrl}" class="button">Sign Agreements</a>
      </div>

      <div class="step">
        <span class="step-number">2</span>
        <strong>Add Your Payment Details</strong>
        <p style="margin: 10px 0 0 38px;">Set up your bank account to receive commission payouts.</p>
      </div>

      <div class="step">
        <span class="step-number">3</span>
        <strong>Start Referring Clients</strong>
        <p style="margin: 10px 0 0 38px;">Use your partner dashboard to submit referrals and track your earnings.</p>
        <a href="${params.portalUrl}" class="button button-secondary">Go to Dashboard</a>
      </div>

      ${
        params.micrositeUrl
          ? `
      <div class="microsite-box">
        <h3 style="margin-top: 0; color: #0369a1;">Your Partner Microsite is Ready!</h3>
        <p>Share this custom landing page with your clients. All leads submitted through this page are automatically tracked to your account.</p>
        <div class="microsite-url">${params.micrositeUrl}</div>
        <a href="${params.micrositeUrl}" class="button" style="margin-top: 15px;">View Your Microsite</a>
      </div>
      `
          : ''
      }

      <h2 style="color: #1a1a2e; margin-top: 30px;">Commission Structure</h2>
      <ul>
        <li><strong>Business Formation:</strong> 15% of first-year revenue</li>
        <li><strong>Web Development:</strong> 12% of project value</li>
        <li><strong>Marketing & SEO:</strong> 10% of first 6 months</li>
        <li><strong>Consulting:</strong> 10% of engagement value</li>
      </ul>

      <p>Need help? Reply to this email or visit your partner dashboard for resources and support.</p>

      <p>We're excited to have you on board!</p>

      <p>Best regards,<br><strong>The A Startup Biz Team</strong></p>
    </div>
    <div class="footer">
      <p>A Startup Biz Partner Program</p>
      <p>Questions? Contact us at partners@astartupbiz.com</p>
    </div>
  </div>
</body>
</html>
  `

  await sendEmail({
    to: params.partnerEmail,
    subject,
    html,
  })

  // Log the email
  await logPartnerEmail({
    partnerId: params.partnerId,
    emailType: 'welcome',
    recipientEmail: params.partnerEmail,
    subject,
  })
}

/**
 * Send reminder to complete agreements
 */
export async function sendAgreementReminderEmail(
  params: AgreementReminderParams
): Promise<void> {
  const subject = `Action Required: Complete Your Partner Agreements`

  const pendingList = params.pendingAgreements
    .map((a) => `<li>${a}</li>`)
    .join('')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a2e; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .button { display: inline-block; background: #ff6a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Agreement Reminder</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${params.partnerName}</strong>,</p>

      <div class="alert">
        <strong>Action Required:</strong> You have pending agreements that need to be signed to complete your partner onboarding.
      </div>

      <p>The following agreements are still pending:</p>
      <ul>
        ${pendingList}
      </ul>

      <p>Once all agreements are signed, you'll be able to:</p>
      <ul>
        <li>Submit referrals and earn commissions</li>
        <li>Access your partner dashboard features</li>
        <li>Receive payouts for qualified leads</li>
      </ul>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${params.agreementsUrl}" class="button">Complete Agreements Now</a>
      </p>

      <p>Need help? Reply to this email and we'll assist you.</p>

      <p>Best regards,<br><strong>The A Startup Biz Team</strong></p>
    </div>
    <div class="footer">
      <p>A Startup Biz Partner Program</p>
    </div>
  </div>
</body>
</html>
  `

  await sendEmail({
    to: params.partnerEmail,
    subject,
    html,
  })

  await logPartnerEmail({
    partnerId: params.partnerId,
    emailType: 'agreement_reminder',
    recipientEmail: params.partnerEmail,
    subject,
  })
}

/**
 * Send notification when a lead is submitted through microsite
 */
export async function sendLeadNotificationEmail(
  params: LeadNotificationParams
): Promise<void> {
  const subject = `New Lead from ${params.micrositeName}: ${params.leadName}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 20px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .lead-card { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
    .lead-field { margin: 10px 0; }
    .lead-label { color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .lead-value { font-weight: 600; font-size: 16px; }
    .button { display: inline-block; background: #ff6a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Lead Received!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${params.partnerName}</strong>,</p>

      <p>Great news! A new lead has been submitted through your microsite.</p>

      <div class="lead-card">
        <div class="lead-field">
          <div class="lead-label">Name</div>
          <div class="lead-value">${params.leadName}</div>
        </div>
        <div class="lead-field">
          <div class="lead-label">Email</div>
          <div class="lead-value">${params.leadEmail}</div>
        </div>
        ${
          params.leadPhone
            ? `
        <div class="lead-field">
          <div class="lead-label">Phone</div>
          <div class="lead-value">${params.leadPhone}</div>
        </div>
        `
            : ''
        }
        <div class="lead-field">
          <div class="lead-label">Source</div>
          <div class="lead-value">${params.micrositeName}</div>
        </div>
      </div>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/partner-portal/referrals" class="button">View in Dashboard</a>
      </p>

      <p style="color: #6b7280; font-size: 14px;">
        This lead will be tracked for commission once converted. Check your dashboard for updates.
      </p>
    </div>
    <div class="footer">
      <p>A Startup Biz Partner Program</p>
    </div>
  </div>
</body>
</html>
  `

  await sendEmail({
    to: params.partnerEmail,
    subject,
    html,
  })

  await logPartnerEmail({
    partnerId: params.partnerId,
    emailType: 'lead_notification',
    recipientEmail: params.partnerEmail,
    subject,
  })
}

/**
 * Log partner email to database
 */
async function logPartnerEmail(params: {
  partnerId: string
  emailType: string
  recipientEmail: string
  subject: string
  resendMessageId?: string
}): Promise<void> {
  try {
    await sql`
      INSERT INTO partner_email_logs (
        partner_id,
        email_type,
        recipient_email,
        subject,
        status,
        resend_message_id
      ) VALUES (
        ${params.partnerId},
        ${params.emailType},
        ${params.recipientEmail},
        ${params.subject},
        'sent',
        ${params.resendMessageId || null}
      )
    `
  } catch (error) {
    console.error('Error logging partner email:', error)
    // Don't throw - email was already sent
  }
}
