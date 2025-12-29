/**
 * Partner Payout Completed Email Template
 * Sent when payout reaches partner's bank account
 */

interface PartnerPayoutCompletedEmailProps {
  partnerName: string
  payoutId: string
  amount: number
  payoutMethod: string
  completedDate: string
  transactionCount: number
  portalUrl: string
}

export function partnerPayoutCompletedEmail(data: PartnerPayoutCompletedEmailProps) {
  return {
    subject: `Payment Received: $${data.amount.toFixed(2)} ✅`,
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
                <h2 style="color: #333; margin: 0 0 10px; font-size: 28px;">Payment Completed!</h2>
                <p style="color: #666; margin: 0; font-size: 16px;">Your payout has been successfully delivered</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Hi ${data.partnerName},
              </p>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Your commission payout has been successfully completed and should now be available in your ${data.payoutMethod} account.
              </p>

              <!-- Success Banner -->
              <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
                <p style="color: #065f46; margin: 0 0 8px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Payment Delivered</p>
                <p style="color: #047857; margin: 0; font-size: 48px; font-weight: 800; line-height: 1;">$${data.amount.toFixed(2)}</p>
                <p style="color: #059669; margin: 8px 0 0; font-size: 14px; font-weight: 600;">From ${data.transactionCount} conversion${data.transactionCount !== 1 ? 's' : ''}</p>
              </div>

              <!-- Payment Confirmation -->
              <div style="background: #f8f8f8; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">✅ Payment Confirmation</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Payout ID:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right; font-family: monospace; font-size: 12px;">${data.payoutId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Amount Paid:</td>
                    <td style="padding: 8px 0; font-weight: 700; text-align: right; font-size: 18px;">
                      <span style="color: #10b981;">$${data.amount.toFixed(2)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.payoutMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Completed Date:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.completedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Status:</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;">COMPLETED</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Celebration Message -->
              <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 8px; padding: 24px; margin-bottom: 30px; text-align: center;">
                <p style="color: #78350f; margin: 0 0 12px; font-size: 20px; font-weight: 700;">🎊 Keep up the great work!</p>
                <p style="color: #92400e; margin: 0; line-height: 1.6;">
                  You're doing amazing! Keep sharing your referral link to earn even more commissions next month.
                </p>
              </div>

              <!-- Next Month Preview -->
              <div style="background: #eff6ff; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #1e40af; margin: 0 0 15px; font-size: 16px; font-weight: 700;">📈 Your Progress This Month</h3>
                <p style="color: #1e3a8a; margin: 0 0 12px; line-height: 1.6;">
                  Want to see how much you've earned so far this month? Check your Partner Portal for real-time earnings and referral statistics.
                </p>
                <p style="color: #1e3a8a; margin: 0; line-height: 1.6; font-size: 14px;">
                  💡 <strong>Tip:</strong> Partners who share their link weekly earn 3x more on average!
                </p>
              </div>

              <!-- CTA Buttons -->
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="${data.portalUrl}/payouts/${data.payoutId}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; margin: 0 8px 8px 0;">View Payout Receipt</a>
                <a href="${data.portalUrl}" style="display: inline-block; background: white; color: #ff6a1a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; border: 2px solid #ff6a1a; margin: 0 0 8px 8px;">Partner Dashboard</a>
              </div>

              <!-- Support -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Questions about your payment? <a href="mailto:partners@astartupbiz.com" style="color: #ff6a1a; text-decoration: none; font-weight: 600;">Contact Partner Support</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
              <p style="margin-top: 10px;">
                <a href="${data.portalUrl}/payouts" style="color: #999; text-decoration: none;">View All Payouts</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
