import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || ''

// Only warn if key is missing (don't throw to allow build)
if (!resendApiKey && typeof window === 'undefined') {
  console.warn('RESEND_API_KEY is not set - Email functionality will not work')
}

export const resend = new Resend(resendApiKey || 'placeholder')

// Email sender configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'A Startup Biz <noreply@astartupbiz.com>'
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@astartupbiz.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@astartupbiz.com'

export { ADMIN_EMAIL }

// Email types
export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
}

export async function sendEmail(options: SendEmailOptions) {
  if (!resendApiKey || resendApiKey === 'placeholder') {
    console.log('Email would be sent:', { to: options.to, subject: options.subject })
    return { success: true, mock: true }
  }

  try {
    const emailOptions: {
      from: string
      to: string | string[]
      subject: string
      html?: string
      text?: string
      replyTo?: string
    } = {
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo || SUPPORT_EMAIL,
    }

    if (options.html) {
      emailOptions.html = options.html
    }
    if (options.text) {
      emailOptions.text = options.text
    }

    const { data, error } = await resend.emails.send(emailOptions as any)

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: err }
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export function orderConfirmationEmail(data: {
  customerName: string
  orderId: string
  items: Array<{ name: string; price: number; quantity: number }>
  total: number
}) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return {
    subject: `Order Confirmation - ${data.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6a1a, #ea580c); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">✓</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px;">Order Confirmed!</h2>
                <p style="color: #666; margin: 0;">Thank you for your purchase, ${data.customerName}!</p>
              </div>

              <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 5px; color: #666; font-size: 14px;">Order ID</p>
                <p style="margin: 0; color: #333; font-weight: 600;">${data.orderId}</p>
              </div>

              <!-- Order Items -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background: #f8f8f8;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; color: #666;">Service</th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; color: #666;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #666;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 16px 12px; font-weight: 600; color: #333;">Total</td>
                    <td style="padding: 16px 12px; text-align: right; font-weight: 600; color: #ff6a1a; font-size: 18px;">$${data.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Next Steps -->
              <div style="background: #fff8f5; border: 1px solid #ffe0d0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">What's Next?</h3>
                <ol style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                  <li>Our team will review your order within 24 hours</li>
                  <li>We'll reach out to schedule your kickoff call</li>
                  <li>Work begins on your services</li>
                </ol>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center;">
                <a href="https://astartupbiz.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View Dashboard</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>Questions? Reply to this email or contact us at ${SUPPORT_EMAIL}</p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function welcomeEmail(data: { name: string; email: string }) {
  return {
    subject: 'Welcome to A Startup Biz!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <h2 style="color: #333; margin: 0 0 20px;">Welcome, ${data.name}!</h2>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining A Startup Biz! We're excited to help you build and grow your business.
              </p>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Here's what you can do next:
              </p>

              <ul style="color: #666; line-height: 1.8; margin-bottom: 30px; padding-left: 20px;">
                <li>Complete your onboarding to get personalized recommendations</li>
                <li>Browse our services and resources</li>
                <li>Book a free consultation call</li>
              </ul>

              <div style="text-align: center;">
                <a href="https://astartupbiz.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">Get Started</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function consultationBookedEmail(data: {
  customerName: string
  serviceType: string
  scheduledAt?: Date
  date?: string
  time?: string
}) {
  const formattedDate = data.date || (data.scheduledAt ? data.scheduledAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'To be scheduled')
  const formattedTime = data.time || (data.scheduledAt ? data.scheduledAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }) : '')

  return {
    subject: `Consultation Booked - ${data.serviceType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6a1a, #ea580c); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">📅</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px;">Consultation Confirmed!</h2>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${data.customerName}, your ${data.serviceType} consultation has been scheduled.
              </p>

              <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">📆 Date</p>
                <p style="margin: 0 0 20px; color: #333; font-weight: 600;">${formattedDate}</p>
                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">🕐 Time</p>
                <p style="margin: 0; color: #333; font-weight: 600;">${formattedTime}</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                We'll send you a meeting link before your scheduled time. Please be ready to discuss your business goals and challenges.
              </p>

              <div style="text-align: center;">
                <a href="https://astartupbiz.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View Details</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>Need to reschedule? Reply to this email.</p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function onboardingSubmittedEmail(data: {
  customerName: string
  businessName: string
}) {
  return {
    subject: 'We Received Your Onboarding Information',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <h2 style="color: #333; margin: 0 0 20px;">Thanks for completing your onboarding!</h2>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${data.customerName}, we've received the onboarding information for <strong>${data.businessName}</strong>.
              </p>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Our team is reviewing your submission and will reach out within 24-48 hours with personalized recommendations for your business.
              </p>

              <div style="background: #fff8f5; border: 1px solid #ffe0d0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #666;">
                  <strong style="color: #333;">In the meantime:</strong> Browse our services and resources to learn more about how we can help you grow.
                </p>
              </div>

              <div style="text-align: center;">
                <a href="https://astartupbiz.com/services" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">Explore Services</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

// ============================================
// ADMIN NOTIFICATION TEMPLATES
// ============================================

export function adminNewContactEmail(data: {
  submissionId: string
  name: string
  email: string
  phone?: string
  company?: string
  businessStage?: string
  services: string[]
  message: string
  source: string
}) {
  const servicesHtml = data.services.length > 0
    ? data.services.map(s => `<li style="color: #333;">${s}</li>`).join('')
    : '<li style="color: #999;">No specific services selected</li>'

  return {
    subject: `🔔 New Contact Submission from ${data.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ff6a1a, #ea580c); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Submission</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">ID: ${data.submissionId}</p>
            </div>

            <!-- Main Card -->
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Contact Info -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #ff6a1a; padding-bottom: 8px;">Contact Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${data.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #ff6a1a;">${data.email}</a></td>
                  </tr>
                  ${data.phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #ff6a1a;">${data.phone}</a></td></tr>` : ''}
                  ${data.company ? `<tr><td style="padding: 8px 0; color: #666;">Company:</td><td style="padding: 8px 0; color: #333;">${data.company}</td></tr>` : ''}
                  ${data.businessStage ? `<tr><td style="padding: 8px 0; color: #666;">Stage:</td><td style="padding: 8px 0; color: #333;">${data.businessStage}</td></tr>` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Source:</td>
                    <td style="padding: 8px 0; color: #333;">${data.source}</td>
                  </tr>
                </table>
              </div>

              <!-- Services -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #ff6a1a; padding-bottom: 8px;">Services Interested</h3>
                <ul style="margin: 0; padding-left: 20px;">${servicesHtml}</ul>
              </div>

              <!-- Message -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #ff6a1a; padding-bottom: 8px;">Message</h3>
                <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; color: #333; line-height: 1.6;">
                  ${data.message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://astartupbiz.com/admin/contacts" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View in Admin Panel</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>This is an automated notification from A Startup Biz</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function adminNewOnboardingEmail(data: {
  submissionId: string
  businessName: string
  businessType: string
  contactEmail: string
  contactPhone?: string
  timeline?: string
  budgetRange?: string
  goals: string[]
  challenges: string[]
}) {
  const goalsHtml = data.goals.length > 0
    ? data.goals.map(g => `<li style="color: #333;">${g}</li>`).join('')
    : '<li style="color: #999;">No goals specified</li>'

  const challengesHtml = data.challenges.length > 0
    ? data.challenges.map(c => `<li style="color: #333;">${c}</li>`).join('')
    : '<li style="color: #999;">No challenges specified</li>'

  return {
    subject: `🚀 New Onboarding: ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Onboarding Submission</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">ID: ${data.submissionId}</p>
            </div>

            <!-- Main Card -->
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Business Info -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">Business Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Business:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${data.businessName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Industry:</td>
                    <td style="padding: 8px 0; color: #333;">${data.businessType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${data.contactEmail}" style="color: #10b981;">${data.contactEmail}</a></td>
                  </tr>
                  ${data.contactPhone ? `<tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${data.contactPhone}" style="color: #10b981;">${data.contactPhone}</a></td></tr>` : ''}
                  ${data.timeline ? `<tr><td style="padding: 8px 0; color: #666;">Timeline:</td><td style="padding: 8px 0; color: #333;">${data.timeline}</td></tr>` : ''}
                  ${data.budgetRange ? `<tr><td style="padding: 8px 0; color: #666;">Budget:</td><td style="padding: 8px 0; color: #333;">${data.budgetRange}</td></tr>` : ''}
                </table>
              </div>

              <!-- Goals -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">Business Goals</h3>
                <ul style="margin: 0; padding-left: 20px;">${goalsHtml}</ul>
              </div>

              <!-- Challenges -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">Key Challenges</h3>
                <ul style="margin: 0; padding-left: 20px;">${challengesHtml}</ul>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://astartupbiz.com/admin/onboarding" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View in Admin Panel</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>This is an automated notification from A Startup Biz</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function adminNewOrderEmail(data: {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: Array<{ name: string; price: number; quantity: number }>
  total: number
}) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #333;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #333;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return {
    subject: `💰 New Order: $${data.total.toFixed(2)} from ${data.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Order Received!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Order ID: ${data.orderId}</p>
            </div>

            <!-- Main Card -->
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Customer Info -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px;">Customer Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 100px;">Name:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${data.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}" style="color: #8b5cf6;">${data.customerEmail}</a></td>
                  </tr>
                  ${data.customerPhone ? `<tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${data.customerPhone}" style="color: #8b5cf6;">${data.customerPhone}</a></td></tr>` : ''}
                </table>
              </div>

              <!-- Order Items -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f8f8f8;">
                      <th style="padding: 10px; text-align: left; font-size: 14px; color: #666;">Item</th>
                      <th style="padding: 10px; text-align: center; font-size: 14px; color: #666;">Qty</th>
                      <th style="padding: 10px; text-align: right; font-size: 14px; color: #666;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr style="background: #f0f0ff;">
                      <td colspan="2" style="padding: 12px 10px; font-weight: 700; color: #333;">Total</td>
                      <td style="padding: 12px 10px; text-align: right; font-weight: 700; color: #8b5cf6; font-size: 18px;">$${data.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://astartupbiz.com/admin/orders" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View in Admin Panel</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>This is an automated notification from A Startup Biz</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

// ============================================
// NOTIFICATION EMAIL TEMPLATE
// ============================================

export function notificationEmail(data: {
  recipientName: string
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}) {
  return {
    subject: data.title,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">🔔</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px;">${data.title}</h2>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px; white-space: pre-line;">
                Hi ${data.recipientName},

                ${data.message}
              </p>

              ${data.actionUrl && data.actionText ? `
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${data.actionUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">${data.actionText}</a>
                </div>
              ` : ''}
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>Questions? Reply to this email or contact us at support@astartupbiz.com</p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

// ============================================
// BOOKING EMAIL TEMPLATES
// ============================================

export function bookingConfirmationEmail(data: {
  customerName: string
  bookingId: string
  serviceType: string
  date: string
  time: string
  timezone: string
  meetingLink?: string
  notes?: string
}) {
  return {
    subject: `Booking Confirmed - ${data.serviceType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">✓</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px;">Booking Confirmed!</h2>
                <p style="color: #666; margin: 0;">Your appointment has been scheduled</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${data.customerName}, your ${data.serviceType} appointment has been confirmed.
              </p>

              <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Booking ID</p>
                <p style="margin: 0 0 20px; color: #333; font-weight: 600; font-size: 12px; font-family: monospace;">${data.bookingId}</p>

                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">📆 Date & Time</p>
                <p style="margin: 0 0 5px; color: #333; font-weight: 600;">${data.date}</p>
                <p style="margin: 0 0 20px; color: #333; font-weight: 600;">${data.time}</p>

                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">🌍 Timezone</p>
                <p style="margin: 0; color: #333; font-weight: 600;">${data.timezone}</p>
              </div>

              ${data.meetingLink ? `
                <div style="background: #fff8f5; border: 1px solid #ffe0d0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">Meeting Link</h3>
                  <a href="${data.meetingLink}" style="color: #ff6a1a; word-break: break-all;">${data.meetingLink}</a>
                </div>
              ` : ''}

              ${data.notes ? `
                <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">Notes</h3>
                  <p style="margin: 0; color: #666; line-height: 1.6;">${data.notes}</p>
                </div>
              ` : ''}

              <div style="background: #fff8f5; border: 1px solid #ffe0d0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #666;">
                  <strong style="color: #333;">📧 You will receive a reminder 24 hours before your appointment.</strong>
                </p>
              </div>

              <div style="text-align: center;">
                <a href="https://astartupbiz.com/dashboard/bookings/${data.bookingId}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">View Booking Details</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>Need to reschedule or cancel? <a href="https://astartupbiz.com/dashboard/bookings/${data.bookingId}" style="color: #ff6a1a;">Manage your booking</a></p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function bookingReminderEmail(data: {
  customerName: string
  bookingId: string
  serviceType: string
  date: string
  time: string
  timezone: string
  meetingLink?: string
  notes?: string
}) {
  return {
    subject: `Reminder: ${data.serviceType} Appointment Tomorrow`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">⏰</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px;">Appointment Reminder</h2>
                <p style="color: #666; margin: 0;">Your appointment is coming up soon!</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${data.customerName}, this is a friendly reminder about your upcoming ${data.serviceType} appointment.
              </p>

              <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">📆 SCHEDULED FOR:</p>
                <p style="margin: 0 0 5px; color: #92400e; font-weight: 700; font-size: 18px;">${data.date}</p>
                <p style="margin: 0; color: #92400e; font-weight: 700; font-size: 18px;">${data.time}</p>
              </div>

              ${data.meetingLink ? `
                <div style="background: #fff8f5; border: 1px solid #ffe0d0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">🔗 Meeting Link</h3>
                  <a href="${data.meetingLink}" style="color: #ff6a1a; word-break: break-all; font-weight: 600;">${data.meetingLink}</a>
                </div>
              ` : ''}

              ${data.notes ? `
                <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">📝 Notes</h3>
                  <p style="margin: 0; color: #666; line-height: 1.6;">${data.notes}</p>
                </div>
              ` : ''}

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://astartupbiz.com/dashboard/bookings/${data.bookingId}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin-right: 10px;">View Details</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>Need to reschedule? <a href="https://astartupbiz.com/dashboard/bookings/${data.bookingId}" style="color: #ff6a1a;">Manage your booking</a></p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function bookingCancellationEmail(data: {
  customerName: string
  bookingId: string
  serviceType: string
  date: string
  time: string
  cancellationReason?: string
}) {
  return {
    subject: `Booking Cancelled - ${data.serviceType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">✕</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px;">Booking Cancelled</h2>
                <p style="color: #666; margin: 0;">Your appointment has been cancelled</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${data.customerName}, your ${data.serviceType} appointment has been cancelled.
              </p>

              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Cancelled Appointment:</p>
                <p style="margin: 0 0 5px; color: #333; font-weight: 600;">${data.date}</p>
                <p style="margin: 0; color: #333; font-weight: 600;">${data.time}</p>
              </div>

              ${data.cancellationReason ? `
                <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">Reason</h3>
                  <p style="margin: 0; color: #666; line-height: 1.6;">${data.cancellationReason}</p>
                </div>
              ` : ''}

              <div style="background: #fff8f5; border: 1px solid #ffe0d0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #666;">
                  <strong style="color: #333;">Need to book a new appointment?</strong> We're here to help you whenever you're ready.
                </p>
              </div>

              <div style="text-align: center;">
                <a href="https://astartupbiz.com/booking" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">Book New Appointment</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>Questions? Reply to this email or contact us at ${SUPPORT_EMAIL}</p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

// ============================================
// UTILITY FUNCTIONS FOR COMMON EMAIL TASKS
// ============================================

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(data: {
  email: string
  customerName: string
  bookingId: string
  serviceType: string
  date: string
  time: string
  timezone: string
  meetingLink?: string
  notes?: string
}) {
  const emailContent = bookingConfirmationEmail(data)
  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

/**
 * Send booking reminder email (24 hours before)
 */
export async function sendBookingReminder(data: {
  email: string
  customerName: string
  bookingId: string
  serviceType: string
  date: string
  time: string
  timezone: string
  meetingLink?: string
  notes?: string
}) {
  const emailContent = bookingReminderEmail(data)
  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

/**
 * Send booking cancellation email
 */
export async function sendBookingCancellation(data: {
  email: string
  customerName: string
  bookingId: string
  serviceType: string
  date: string
  time: string
  cancellationReason?: string
}) {
  const emailContent = bookingCancellationEmail(data)
  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

/**
 * Send onboarding confirmation email
 * Convenience wrapper around sendEmail + onboardingSubmittedEmail template
 */
export async function sendOnboardingConfirmation(data: {
  customerName: string
  businessName: string
  email: string
}) {
  const emailContent = onboardingSubmittedEmail({
    customerName: data.customerName,
    businessName: data.businessName,
  })

  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

/**
 * Send welcome email to new user
 * Convenience wrapper around sendEmail + welcomeEmail template
 */
export async function sendWelcomeEmail(data: {
  name: string
  email: string
}) {
  const emailContent = welcomeEmail(data)

  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

/**
 * Send notification email
 * Convenience wrapper for generic notifications
 */
export async function sendNotification(data: {
  to: string | string[]
  recipientName: string
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}) {
  const emailContent = notificationEmail({
    recipientName: data.recipientName,
    title: data.title,
    message: data.message,
    actionUrl: data.actionUrl,
    actionText: data.actionText,
  })

  return sendEmail({
    to: data.to,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

/**
 * Send order confirmation email
 * Convenience wrapper around sendEmail + orderConfirmationEmail template
 */
export async function sendOrderConfirmation(data: {
  email: string
  customerName: string
  orderId: string
  items: Array<{ name: string; price: number; quantity: number }>
  total: number
}) {
  const emailContent = orderConfirmationEmail(data)

  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

/**
 * Send consultation booked confirmation
 * Convenience wrapper around sendEmail + consultationBookedEmail template
 */
export async function sendConsultationConfirmation(data: {
  email: string
  customerName: string
  serviceType: string
  scheduledAt?: Date
  date?: string
  time?: string
}) {
  const emailContent = consultationBookedEmail(data)

  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}

// ============================================
// PARTNER PROGRAM EMAIL TEMPLATES
// ============================================

export function partnerAccountCreatedEmail(data: {
  partnerName: string
  status: 'active' | 'pending'
  commissionRate: number
  loginUrl?: string
}) {
  const isActive = data.status === 'active'
  const loginUrl = data.loginUrl || 'https://astartupbiz.com/partner-portal'

  return {
    subject: isActive ? 'Welcome to the Partner Program!' : 'Your Partner Application is Under Review',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6a1a; margin: 0; font-size: 28px;">A Startup Biz Partner Program</h1>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6a1a, #ea580c); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">🤝</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px;">
                  ${isActive ? 'Welcome to the Partner Program!' : 'Your Partner Application is Under Review'}
                </h2>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${data.partnerName},
              </p>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                ${isActive
                  ? 'Great news! Your partner account has been created and activated. You can now start referring clients and earning commissions.'
                  : 'Your partner application has been submitted and is currently under review. We\'ll notify you once your account is approved.'}
              </p>

              <!-- Account Details -->
              <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Account Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 40%;">Partner Name:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${data.partnerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Status:</td>
                    <td style="padding: 8px 0;">
                      <span style="color: ${isActive ? '#10b981' : '#f59e0b'}; background: ${isActive ? '#d1fae5' : '#fef3c7'}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;">
                        ${isActive ? 'Active' : 'Pending Approval'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Commission Rate:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${data.commissionRate}%</td>
                  </tr>
                </table>
              </div>

              ${isActive ? `
                <!-- Active Partner - Getting Started -->
                <div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <p style="margin: 0; color: #065f46;">
                    <strong style="color: #064e3b;">You're all set!</strong> Log in to your partner portal to access your unique referral link and start tracking your commissions.
                  </p>
                </div>

                <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Getting Started</h3>
                  <ol style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                    <li>Log in to your partner portal</li>
                    <li>Get your unique referral link</li>
                    <li>Share it with your network</li>
                    <li>Track your leads and commissions in real-time</li>
                  </ol>
                </div>

                <div style="text-align: center;">
                  <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">Access Partner Portal</a>
                </div>
              ` : `
                <!-- Pending Partner - What's Next -->
                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <p style="margin: 0; color: #92400e;">
                    <strong style="color: #78350f;">What's Next?</strong> Our team is reviewing your application. You'll receive an email notification once your account is approved.
                  </p>
                </div>

                <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Review Timeline</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                    <li>Review typically takes 1-2 business days</li>
                    <li>You'll be notified via email once approved</li>
                    <li>Questions? Contact our partner team</li>
                  </ul>
                </div>
              `}

              <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                Questions about the partner program?{' '}
                <a href="mailto:partners@astartupbiz.com" style="color: #ff6a1a; text-decoration: none;">
                  Contact our partner team
                </a>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

/**
 * Send partner account created email
 */
export async function sendPartnerAccountCreated(data: {
  email: string
  partnerName: string
  status: 'active' | 'pending'
  commissionRate: number
  loginUrl?: string
}) {
  const emailContent = partnerAccountCreatedEmail(data)

  return sendEmail({
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  })
}
