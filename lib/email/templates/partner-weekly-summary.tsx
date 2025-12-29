/**
 * Partner Weekly Summary Email Template
 * Sent every Monday with earnings summary for the previous week
 */

interface PartnerWeeklySummaryEmailProps {
  partnerName: string
  weekStart: string
  weekEnd: string
  totalClicks: number
  totalLeads: number
  totalConversions: number
  weeklyEarnings: number
  monthToDateEarnings: number
  conversionRate: number
  topReferralSource?: string
  pendingPayout: number
  portalUrl: string
}

export function partnerWeeklySummaryEmail(data: PartnerWeeklySummaryEmailProps) {
  const hasActivity = data.totalClicks > 0 || data.totalLeads > 0 || data.totalConversions > 0

  return {
    subject: `Your Weekly Partner Report: ${hasActivity ? `$${data.weeklyEarnings.toFixed(2)} Earned` : 'Keep Sharing!'} 📊`,
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
              <p style="color: #666; margin: 8px 0 0; font-size: 14px;">Weekly Performance Report</p>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 40px;">📊</span>
                </div>
                <h2 style="color: #333; margin: 0 0 10px; font-size: 24px;">Weekly Performance Report</h2>
                <p style="color: #666; margin: 0; font-size: 14px;">${data.weekStart} - ${data.weekEnd}</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Hi ${data.partnerName},
              </p>

              ${hasActivity ? `
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                  Here's your partner performance summary for the past week. Great job on your referrals!
                </p>
              ` : `
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                  We noticed you haven't shared your referral link this week. Don't miss out on potential earnings - start sharing today!
                </p>
              `}

              <!-- Weekly Earnings -->
              <div style="background: linear-gradient(135deg, ${hasActivity ? '#10b981' : '#6b7280'}, ${hasActivity ? '#059669' : '#4b5563'}); border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">This Week's Earnings</p>
                <p style="color: white; margin: 0; font-size: 48px; font-weight: 800; line-height: 1;">$${data.weeklyEarnings.toFixed(2)}</p>
                ${data.totalConversions > 0 ? `
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">From ${data.totalConversions} conversion${data.totalConversions !== 1 ? 's' : ''}</p>
                ` : ''}
              </div>

              <!-- Key Metrics -->
              <div style="background: #f8f8f8; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #333; margin: 0 0 20px; font-size: 16px;">📈 Key Metrics</h3>

                <!-- Metric Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                  <!-- Clicks -->
                  <div style="text-align: center; padding: 16px; background: white; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Clicks</p>
                    <p style="color: #333; margin: 0; font-size: 28px; font-weight: 800;">${data.totalClicks}</p>
                  </div>

                  <!-- Leads -->
                  <div style="text-align: center; padding: 16px; background: white; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Leads</p>
                    <p style="color: #333; margin: 0; font-size: 28px; font-weight: 800;">${data.totalLeads}</p>
                  </div>

                  <!-- Conversions -->
                  <div style="text-align: center; padding: 16px; background: white; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Sales</p>
                    <p style="color: #10b981; margin: 0; font-size: 28px; font-weight: 800;">${data.totalConversions}</p>
                  </div>

                  <!-- Conversion Rate -->
                  <div style="text-align: center; padding: 16px; background: white; border-radius: 8px;">
                    <p style="color: #666; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Conv. Rate</p>
                    <p style="color: ${data.conversionRate > 2 ? '#10b981' : '#f59e0b'}; margin: 0; font-size: 28px; font-weight: 800;">${data.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>

                ${data.topReferralSource ? `
                  <div style="background: #eff6ff; border-radius: 6px; padding: 12px; margin-top: 16px;">
                    <p style="color: #1e40af; margin: 0; font-size: 13px;">
                      🏆 <strong>Top Source:</strong> ${data.topReferralSource}
                    </p>
                  </div>
                ` : ''}
              </div>

              <!-- Month to Date -->
              <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #1e40af; margin: 0 0 15px; font-size: 16px; font-weight: 700;">💰 Month to Date</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <p style="color: #3730a3; margin: 0 0 4px; font-size: 14px;">Total Earnings</p>
                    <p style="color: #1e3a8a; margin: 0; font-size: 32px; font-weight: 800;">$${data.monthToDateEarnings.toFixed(2)}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="color: #3730a3; margin: 0 0 4px; font-size: 14px;">Pending Payout</p>
                    <p style="color: #1e3a8a; margin: 0; font-size: 32px; font-weight: 800;">$${data.pendingPayout.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              ${!hasActivity ? `
                <!-- No Activity CTA -->
                <div style="background: #fff8f5; border: 2px solid #ff6a1a; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                  <h3 style="color: #ea580c; margin: 0 0 15px; font-size: 16px; font-weight: 700;">🚀 Start Earning This Week!</h3>
                  <p style="color: #c2410c; margin: 0 0 16px; line-height: 1.6;">
                    Share your unique referral link on social media, your blog, or with your network to start earning commissions!
                  </p>
                  <div style="text-align: center;">
                    <a href="${data.portalUrl}/referrals" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Get Your Referral Link</a>
                  </div>
                </div>
              ` : `
                <!-- Tips for Better Performance -->
                <div style="background: #fef3c7; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                  <h3 style="color: #92400e; margin: 0 0 15px; font-size: 16px; font-weight: 700;">💡 Tips to Boost Your Earnings</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #78350f; line-height: 1.8;">
                    <li>Share your link on multiple platforms (social media, email, blog)</li>
                    <li>Create content about A Startup Biz services</li>
                    <li>Follow up with leads who showed interest</li>
                    <li>Use our marketing materials from the Partner Portal</li>
                  </ul>
                </div>
              `}

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="${data.portalUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6a1a, #ea580c); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 106, 26, 0.3);">View Full Dashboard →</a>
              </div>

              <!-- Support -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Questions or feedback? <a href="mailto:partners@astartupbiz.com" style="color: #ff6a1a; text-decoration: none; font-weight: 600;">Contact Partner Support</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
              <p>© ${new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
              <p style="margin-top: 10px;">
                <a href="${data.portalUrl}/settings" style="color: #999; text-decoration: none;">Manage Email Preferences</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
