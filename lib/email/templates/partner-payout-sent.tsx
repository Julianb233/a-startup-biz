/**
 * Partner Payout Sent Email Template
 * Sent when payout is initiated to partner's bank account
 */

interface PartnerPayoutSentEmailProps {
  partnerName: string
  payoutId: string
  amount: number
  payoutMethod: string
  estimatedArrival: string
  transactionCount: number
  periodStart: string
  periodEnd: string
  portalUrl: string
}

export function partnerPayoutSentEmail(data: PartnerPayoutSentEmailProps) {
  return {
    subject: `Your Payout of $${data.amount.toFixed(2)} is On Its Way! 💸`,
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
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 40px;">💸</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px; font-size: 28px;">Payout Initiated!</h2>
                <p style="color: #666; margin: 0; font-size: 16px;">Your commission payment is on its way</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Hi ${data.partnerName},
              </p>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Great news! We've initiated your commission payout. Your payment should arrive in your account by <strong>${data.estimatedArrival}</strong>.
              </p>

              <!-- Payout Amount -->
              <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Payout Amount</p>
                <p style="color: white; margin: 0; font-size: 48px; font-weight: 800; line-height: 1;">$${data.amount.toFixed(2)}</p>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Earned from ${data.transactionCount} conversion${data.transactionCount !== 1 ? 's' : ''}</p>
              </div>

              <!-- Payout Details -->
              <div style="background: #f8f8f8; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">💳 Payout Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Payout ID:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right; font-family: monospace; font-size: 12px;">${data.payoutId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Period:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.periodStart} - ${data.periodEnd}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.payoutMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Total Conversions:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600; text-align: right;">${data.transactionCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Estimated Arrival:</td>
                    <td style="padding: 8px 0; font-weight: 700; text-align: right; font-size: 16px;">
                      <span style="color: #8b5cf6;">${data.estimatedArrival}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Status Alert -->
              <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <div style="display: flex; align-items: start;">
                  <div style="flex-shrink: 0; margin-right: 16px;">
                    <span style="font-size: 24px;">⏱️</span>
                  </div>
                  <div>
                    <h3 style="color: #92400e; margin: 0 0 8px; font-size: 16px; font-weight: 700;">Processing Time</h3>
                    <p style="color: #92400e; margin: 0; line-height: 1.6;">
                      Depending on your bank, it may take 1-3 business days for the payment to appear in your account. We'll send you another email when it's completed.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Next Steps -->
              <div style="background: #eff6ff; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #1e40af; margin: 0 0 15px; font-size: 16px; font-weight: 700;">📊 View Your Payout History</h3>
                <p style="color: #1e3a8a; margin: 0; line-height: 1.6;">
                  You can track all your payouts, view detailed breakdowns, and download invoices from your Partner Portal.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="${data.portalUrl}/payouts/${data.payoutId}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 106, 26, 0.3);">View Payout Details →</a>
              </div>

              <!-- Support -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Questions about your payout? <a href="mailto:partners@astartupbiz.com" style="color: #ff6a1a; text-decoration: none; font-weight: 600;">Contact Partner Support</a>
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
