/**
 * Welcome Email Template
 * Sent to new users after registration or payment
 */

import React from 'react';
import { EmailLayout, EmailCard, EmailIcon, EmailCallout, EmailButton } from '../components/EmailLayout';

export interface WelcomeEmailProps {
  name: string;
  accountType?: 'free' | 'paid' | 'trial';
  nextSteps?: string[];
}

export default function WelcomeEmail({
  name,
  accountType = 'free',
  nextSteps,
}: WelcomeEmailProps) {
  const defaultNextSteps = [
    'Complete your profile to get personalized recommendations',
    'Browse our services and resources',
    'Book a free consultation call with our team',
    'Join our community to connect with other entrepreneurs',
  ];

  const steps = nextSteps || defaultNextSteps;

  const getWelcomeMessage = () => {
    switch (accountType) {
      case 'paid':
        return "Thank you for becoming a premium member! We're excited to help you build and scale your business.";
      case 'trial':
        return "Welcome to your free trial! Explore all our premium features and see how we can help grow your business.";
      default:
        return "Thank you for joining A Startup Biz! We're excited to help you build and grow your business.";
    }
  };

  return (
    <EmailLayout previewText={`Welcome to A Startup Biz, ${name}!`}>
      <EmailCard>
        <EmailIcon emoji="🎉" />

        <h2 style={styles.heading}>Welcome, {name}!</h2>

        <p style={styles.text}>{getWelcomeMessage()}</p>

        {accountType === 'paid' && (
          <EmailCallout type="success">
            <p style={styles.calloutText}>
              <strong style={{ color: '#333' }}>Your premium membership is now active!</strong>
              <br />
              You now have access to all our premium features, priority support, and exclusive
              resources.
            </p>
          </EmailCallout>
        )}

        {accountType === 'trial' && (
          <EmailCallout type="info">
            <p style={styles.calloutText}>
              <strong style={{ color: '#333' }}>Your 14-day trial has started!</strong>
              <br />
              Explore all premium features with no commitment. We'll remind you before your trial
              ends.
            </p>
          </EmailCallout>
        )}

        <div style={styles.nextStepsSection}>
          <h3 style={styles.subheading}>Here's what you can do next:</h3>
          <ul style={styles.list}>
            {steps.map((step, index) => (
              <li key={index} style={styles.listItem}>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.resourcesSection}>
          <h3 style={styles.subheading}>Quick Resources</h3>
          <div style={styles.resourceGrid}>
            <div style={styles.resourceCard}>
              <div style={styles.resourceEmoji}>📚</div>
              <div style={styles.resourceTitle}>Knowledge Base</div>
              <div style={styles.resourceDescription}>
                Browse guides and tutorials
              </div>
            </div>
            <div style={styles.resourceCard}>
              <div style={styles.resourceEmoji}>💬</div>
              <div style={styles.resourceTitle}>Support</div>
              <div style={styles.resourceDescription}>
                Get help from our team
              </div>
            </div>
            <div style={styles.resourceCard}>
              <div style={styles.resourceEmoji}>🎯</div>
              <div style={styles.resourceTitle}>Services</div>
              <div style={styles.resourceDescription}>
                Explore what we offer
              </div>
            </div>
          </div>
        </div>

        <EmailButton href="https://astartupbiz.com/dashboard">
          Get Started
        </EmailButton>

        <p style={styles.footnote}>
          Need help getting started? Our team is here to help. Just reply to this email!
        </p>
      </EmailCard>
    </EmailLayout>
  );
}

const styles = {
  heading: {
    color: '#333',
    margin: '0 0 20px',
    fontSize: '28px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  subheading: {
    color: '#333',
    margin: '0 0 15px',
    fontSize: '18px',
    fontWeight: '600',
  } as React.CSSProperties,

  text: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '30px',
    fontSize: '16px',
  } as React.CSSProperties,

  calloutText: {
    margin: '0',
    color: '#666',
    lineHeight: '1.6',
  } as React.CSSProperties,

  nextStepsSection: {
    marginBottom: '30px',
  } as React.CSSProperties,

  list: {
    margin: '0',
    paddingLeft: '20px',
    color: '#666',
    lineHeight: '1.8',
  } as React.CSSProperties,

  listItem: {
    marginBottom: '8px',
  } as React.CSSProperties,

  resourcesSection: {
    marginBottom: '30px',
  } as React.CSSProperties,

  resourceGrid: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  resourceCard: {
    flex: '1',
    minWidth: '150px',
    background: '#f8f8f8',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  resourceEmoji: {
    fontSize: '32px',
    marginBottom: '10px',
  } as React.CSSProperties,

  resourceTitle: {
    color: '#333',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '5px',
  } as React.CSSProperties,

  resourceDescription: {
    color: '#666',
    fontSize: '12px',
    lineHeight: '1.4',
  } as React.CSSProperties,

  footnote: {
    marginTop: '30px',
    fontSize: '14px',
    color: '#999',
    textAlign: 'center' as const,
  } as React.CSSProperties,
};
