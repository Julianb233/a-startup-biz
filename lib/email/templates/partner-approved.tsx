/**
 * Partner Approved Email Template
 * Sent when a partner application is approved and account is activated
 */

interface PartnerApprovedEmailProps {
  partnerName: string
  companyName?: string
  commissionRate: number
  referralCode: string
  portalUrl: string
}

export function partnerApprovedEmail(data: PartnerApprovedEmailProps) {
  return {
    subject: 'Your Partner Application is Approved! 🎉',
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
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 40px;">✓</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px; font-size: 24px;">Congratulations!</h2>
                <p style="color: #666; margin: 0; font-size: 16px;">Your partner application has been approved</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${data.partnerName},
              </p>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Welcome to the A Startup Biz Partner Program! We're excited to have you on board. Your account is now active and you can start earning commissions right away.
              </p>

              <!-- Partner Details -->
              <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #065f46; margin: 0 0 15px; font-size: 18px; font-weight: 700;">Your Partner Account</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #047857; font-weight: 600;">Partner Name:</td>
                    <td style="padding: 8px 0; color: #065f46; font-weight: 700; text-align: right;">${data.partnerName}</td>
                  </tr>
                  ${data.companyName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #047857; font-weight: 600;">Company:</td>
                    <td style="padding: 8px 0; color: #065f46; font-weight: 700; text-align: right;">${data.companyName}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #047857; font-weight: 600;">Commission Rate:</td>
                    <td style="padding: 8px 0; color: #065f46; font-weight: 700; text-align: right; font-size: 20px;">${data.commissionRate}%</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #047857; font-weight: 600;">Referral Code:</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <code style="background: #fff; color: #065f46; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 16px;">${data.referralCode}</code>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Getting Started -->
              <div style="background: #f8f8f8; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">🚀 Get Started in 3 Easy Steps</h3>
                <ol style="margin: 0; padding-left: 20px; color: #666; line-height: 2;">
                  <li style="margin-bottom: 8px;"><strong style="color: #333;">Access your Partner Portal</strong> to get your unique referral link</li>
                  <li style="margin-bottom: 8px;"><strong style="color: #333;">Share your link</strong> with your network, blog, or social media</li>
                  <li><strong style="color: #333;">Track & Earn</strong> - Monitor leads and earnings in real-time</li>
                </ol>
              </div>

              <!-- Commission Structure -->
              <div style="background: #fff8f5; border: 2px solid #ff6a1a; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">💰 How You Earn</h3>
                <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                  <li><strong style="color: #333;">${data.commissionRate}% commission</strong> on all referred sales</li>
                  <li>Automatic tracking of all your referrals</li>
                  <li>Monthly payouts via bank transfer or PayPal</li>
                  <li>Real-time earnings dashboard</li>
                  <li>Lifetime cookie tracking (never lose a commission)</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${data.portalUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 106, 26, 0.3);">Access Partner Portal →</a>
              </div>

              <!-- Support -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Need help? <a href="mailto:partners@astartupbiz.com" style="color: #ff6a1a; text-decoration: none; font-weight: 600;">Contact Partner Support</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
              <p style="margin-top: 10px;">
                <a href="https://astartupbiz.com/partners/terms" style="color: #999; text-decoration: none;">Partner Terms</a> •
                <a href="https://astartupbiz.com/partners/faq" style="color: #999; text-decoration: none;">FAQ</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
