/**
 * Admin Lead Notification Email Template
 * Sent to admin when a new onboarding submission is received
 */

interface LeadNotificationProps {
  submissionId: string;
  businessName: string;
  businessType: string;
  contactEmail: string;
  contactPhone?: string;
  timeline?: string;
  budgetRange?: string;
  goals: string[];
  challenges: string[];
}

export function LeadNotificationEmail({
  submissionId,
  businessName,
  businessType,
  contactEmail,
  contactPhone,
  timeline,
  budgetRange,
  goals,
  challenges,
}: LeadNotificationProps) {
  const goalsHtml = goals.length > 0
    ? goals.map((g) => `<li style="color: #333;">${g}</li>`).join('')
    : '<li style="color: #999;">No goals specified</li>';

  const challengesHtml = challenges.length > 0
    ? challenges.map((c) => `<li style="color: #333;">${c}</li>`).join('')
    : '<li style="color: #999;">No challenges specified</li>';

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: 0,
          backgroundColor: '#f0f0f0',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              padding: '20px',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
              New Onboarding Submission
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: '5px 0 0' }}>
              ID: {submissionId}
            </p>
          </div>

          {/* Main Card */}
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {/* Business Info */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#333',
                  margin: '0 0 15px',
                  fontSize: '16px',
                  borderBottom: '2px solid #10b981',
                  paddingBottom: '8px',
                }}
              >
                Business Information
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#666', width: '120px' }}>
                      Business:
                    </td>
                    <td style={{ padding: '8px 0', color: '#333', fontWeight: 600 }}>
                      {businessName}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#666' }}>Industry:</td>
                    <td style={{ padding: '8px 0', color: '#333' }}>{businessType}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: '#666' }}>Email:</td>
                    <td style={{ padding: '8px 0' }}>
                      <a href={`mailto:${contactEmail}`} style={{ color: '#10b981' }}>
                        {contactEmail}
                      </a>
                    </td>
                  </tr>
                  {contactPhone && (
                    <tr>
                      <td style={{ padding: '8px 0', color: '#666' }}>Phone:</td>
                      <td style={{ padding: '8px 0' }}>
                        <a href={`tel:${contactPhone}`} style={{ color: '#10b981' }}>
                          {contactPhone}
                        </a>
                      </td>
                    </tr>
                  )}
                  {timeline && (
                    <tr>
                      <td style={{ padding: '8px 0', color: '#666' }}>Timeline:</td>
                      <td style={{ padding: '8px 0', color: '#333' }}>{timeline}</td>
                    </tr>
                  )}
                  {budgetRange && (
                    <tr>
                      <td style={{ padding: '8px 0', color: '#666' }}>Budget:</td>
                      <td style={{ padding: '8px 0', color: '#333' }}>{budgetRange}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Goals */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#333',
                  margin: '0 0 15px',
                  fontSize: '16px',
                  borderBottom: '2px solid #10b981',
                  paddingBottom: '8px',
                }}
              >
                Business Goals
              </h3>
              <ul
                style={{ margin: 0, paddingLeft: '20px' }}
                dangerouslySetInnerHTML={{ __html: goalsHtml }}
              />
            </div>

            {/* Challenges */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#333',
                  margin: '0 0 15px',
                  fontSize: '16px',
                  borderBottom: '2px solid #10b981',
                  paddingBottom: '8px',
                }}
              >
                Key Challenges
              </h3>
              <ul
                style={{ margin: 0, paddingLeft: '20px' }}
                dangerouslySetInnerHTML={{ __html: challengesHtml }}
              />
            </div>

            {/* Action Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <a
                href="https://astartupbiz.com/admin/onboarding"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                View in Admin Panel
              </a>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              color: '#999',
              fontSize: '12px',
            }}
          >
            <p>This is an automated notification from A Startup Biz</p>
          </div>
        </div>
      </body>
    </html>
  );
}
