/**
 * Partner Lead Converted Email Template
 * Sent when a referred lead converts to a paying customer
 */

interface PartnerLeadConvertedEmailProps {
  partnerName: string
  leadName: string
  orderValue: number
  commissionAmount: number
  commissionRate: number
  orderId: string
  conversionDate: string
  portalUrl: string
}

export function partnerLeadConvertedEmail(data: PartnerLeadConvertedEmailProps) {
  return {
    subject: `Great News! You Earned $${data.commissionAmount.toFixed(2)} 💰`,
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
                  <span style="color: white; font-size: 40px;">🎉</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px; font-size: 28px;">You Made a Sale!</h2>
                <p style="color: #666; margin: 0; font-size: 16px;">Your referral just converted to a paying customer</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Hi ${data.partnerName},
              </p>

              <!-- Commission Card -->
              <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">You Earned</p>
                <p style="color: white; margin: 0; font-size: 48px; font-weight: 800; line-height: 1;">$${data.commissionAmount.toFixed(2)}</p>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">${data.commissionRate}% commission on $${data.orderValue.toFixed(2)} order</p>
              </div>

              <!-- Conversion Details -->
              <div style="background: #f8f8f8; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">📊 Conversion Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Customer:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.leadName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Order ID:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right; font-family: monospace; font-size: 12px;">${data.orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Order Value:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">$${data.orderValue.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Commission Rate:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.commissionRate}%</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Your Commission:</td>
                    <td style="padding: 8px 0; font-weight: 700; text-align: right; font-size: 18px;">
                      <span style="color: #10b981;">$${data.commissionAmount.toFixed(2)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Conversion Date:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.conversionDate}</td>
                  </tr>
                </table>
              </div>

              <!-- Payout Info -->
              <div style="background: #fff8f5; border: 2px solid #ff6a1a; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">💳 Payment Information</h3>
                <p style="color: #666; line-height: 1.6; margin: 0;">
                  Your commission will be included in your next monthly payout. Payouts are processed on the 1st of each month for all commissions earned in the previous month.
                </p>
              </div>

              <!-- Keep Going -->
              <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 8px; padding: 24px; margin-bottom: 30px; text-align: center;">
                <p style="color: #1e40af; margin: 0 0 12px; font-size: 18px; font-weight: 700;">Keep the momentum going! 🚀</p>
                <p style="color: #3730a3; margin: 0; line-height: 1.6;">
                  Share your referral link with more people to grow your earnings. The more you share, the more you earn!
                </p>
              </div>

              <!-- CTA Buttons -->
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="${data.portalUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; margin: 0 8px 8px 0;">View Earnings Dashboard</a>
                <a href="${data.portalUrl}/referrals" style="display: inline-block; background: white; color: #ff6a1a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; border: 2px solid #ff6a1a; margin: 0 0 8px 8px;">Share Referral Link</a>
              </div>

              <!-- Social Proof -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Questions about your commission? <a href="mailto:partners@astartupbiz.com" style="color: #ff6a1a; text-decoration: none; font-weight: 600;">Contact Partner Support</a>
                </p>
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
