/**
 * Onboarding Confirmation Email Template
 * Sent after a user completes the onboarding form
 */

import React from 'react';
import { EmailLayout, EmailCard, EmailIcon, EmailCallout, EmailButton } from '../components/EmailLayout';

export interface OnboardingConfirmationProps {
  customerName: string;
  businessName: string;
}

export default function OnboardingConfirmation({
  customerName,
  businessName,
}: OnboardingConfirmationProps) {
  return (
    <EmailLayout previewText={`Thanks for completing your onboarding, ${customerName}!`}>
      <EmailCard>
        <EmailIcon emoji="✓" />

        <h2 style={styles.heading}>Thanks for completing your onboarding!</h2>

        <p style={styles.text}>
          Hi {customerName}, we've received the onboarding information for{' '}
          <strong>{businessName}</strong>.
        </p>

        <p style={styles.text}>
          Our team is reviewing your submission and will reach out within 24-48 hours with
          personalized recommendations for your business.
        </p>

        <EmailCallout type="warning">
          <p style={styles.calloutText}>
            <strong style={{ color: '#333' }}>In the meantime:</strong> Browse our services
            and resources to learn more about how we can help you grow.
          </p>
        </EmailCallout>

        <div style={styles.nextSteps}>
          <h3 style={styles.subheading}>What happens next?</h3>
          <ol style={styles.list}>
            <li>Our team reviews your business details</li>
            <li>We prepare personalized service recommendations</li>
            <li>You'll receive a follow-up email within 48 hours</li>
            <li>Book a free consultation to discuss your goals</li>
          </ol>
        </div>

        <EmailButton href="https://astartupbiz.com/services">
          Explore Services
        </EmailButton>
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
    marginBottom: '20px',
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
};
