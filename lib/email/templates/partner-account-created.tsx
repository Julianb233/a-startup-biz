/**
 * Partner Account Created Email Template
 * Sent when a partner account is created from an onboarding submission
 */

import React from 'react';
import { EmailLayout, EmailCard, EmailIcon, EmailCallout, EmailButton } from '../components/EmailLayout';

export interface PartnerAccountCreatedProps {
  partnerName: string;
  status: 'active' | 'pending';
  commissionRate: number;
  loginUrl?: string;
}

export default function PartnerAccountCreated({
  partnerName,
  status,
  commissionRate,
  loginUrl = 'https://astartupbiz.com/partner-portal',
}: PartnerAccountCreatedProps) {
  const isActive = status === 'active';

  return (
    <EmailLayout previewText={`Welcome to the Partner Program, ${partnerName}!`}>
      <EmailCard>
        <EmailIcon emoji="🤝" />

        <h2 style={styles.heading}>
          {isActive ? 'Welcome to the Partner Program!' : 'Your Partner Application is Under Review'}
        </h2>

        <p style={styles.text}>
          Hi {partnerName},
        </p>

        <p style={styles.text}>
          {isActive
            ? 'Great news! Your partner account has been created and activated. You can now start referring clients and earning commissions.'
            : 'Your partner application has been submitted and is currently under review. We\'ll notify you once your account is approved.'}
        </p>

        <div style={styles.detailsBox}>
          <h3 style={styles.subheading}>Account Details</h3>
          <table style={styles.detailsTable}>
            <tbody>
              <tr>
                <td style={styles.labelCell}>Partner Name:</td>
                <td style={styles.valueCell}>{partnerName}</td>
              </tr>
              <tr>
                <td style={styles.labelCell}>Status:</td>
                <td style={styles.valueCell}>
                  <span style={isActive ? styles.statusActive : styles.statusPending}>
                    {isActive ? 'Active' : 'Pending Approval'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={styles.labelCell}>Commission Rate:</td>
                <td style={styles.valueCell}>{commissionRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {isActive && (
          <>
            <EmailCallout type="success">
              <p style={styles.calloutText}>
                <strong style={{ color: '#333' }}>You're all set!</strong> Log in to your partner
                portal to access your unique referral link and start tracking your commissions.
              </p>
            </EmailCallout>

            <div style={styles.nextSteps}>
              <h3 style={styles.subheading}>Getting Started</h3>
              <ol style={styles.list}>
                <li>Log in to your partner portal</li>
                <li>Get your unique referral link</li>
                <li>Share it with your network</li>
                <li>Track your leads and commissions in real-time</li>
              </ol>
            </div>

            <EmailButton href={loginUrl}>
              Access Partner Portal
            </EmailButton>
          </>
        )}

        {!isActive && (
          <>
            <EmailCallout type="info">
              <p style={styles.calloutText}>
                <strong style={{ color: '#333' }}>What's Next?</strong> Our team is reviewing your
                application. You'll receive an email notification once your account is approved.
              </p>
            </EmailCallout>

            <div style={styles.nextSteps}>
              <h3 style={styles.subheading}>Review Timeline</h3>
              <ul style={styles.list}>
                <li>Review typically takes 1-2 business days</li>
                <li>You'll be notified via email once approved</li>
                <li>Questions? Contact our partner team</li>
              </ul>
            </div>
          </>
        )}

        <p style={styles.footer}>
          Questions about the partner program?{' '}
          <a href="mailto:partners@astartupbiz.com" style={styles.link}>
            Contact our partner team
          </a>
        </p>
      </EmailCard>
    </EmailLayout>
  );
}

const styles = {
  heading: {
    color: '#333',
    margin: '0 0 20px',
    fontSize: '24px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  subheading: {
    color: '#333',
    margin: '0 0 15px',
    fontSize: '18px',
  } as React.CSSProperties,

  text: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '15px',
  } as React.CSSProperties,

  detailsBox: {
    background: '#f8f8f8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '25px',
  } as React.CSSProperties,

  detailsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,

  labelCell: {
    color: '#999',
    fontSize: '14px',
    paddingBottom: '10px',
    width: '40%',
  } as React.CSSProperties,

  valueCell: {
    color: '#333',
    fontSize: '14px',
    fontWeight: '600',
    paddingBottom: '10px',
  } as React.CSSProperties,

  statusActive: {
    color: '#10b981',
    background: '#d1fae5',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  } as React.CSSProperties,

  statusPending: {
    color: '#f59e0b',
    background: '#fef3c7',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  } as React.CSSProperties,

  calloutText: {
    margin: '0',
    color: '#666',
  } as React.CSSProperties,

  nextSteps: {
    background: '#f8f8f8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
  } as React.CSSProperties,

  list: {
    margin: '0',
    paddingLeft: '20px',
    color: '#666',
    lineHeight: '1.8',
  } as React.CSSProperties,

  footer: {
    color: '#999',
    fontSize: '14px',
    textAlign: 'center' as const,
    marginTop: '30px',
  } as React.CSSProperties,

  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  } as React.CSSProperties,
};
