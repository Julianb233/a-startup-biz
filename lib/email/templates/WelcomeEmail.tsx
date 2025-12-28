/**
 * Welcome Email Template (React version)
 */

import {
  EmailLayout,
  EmailCard,
  EmailButton,
} from '../components/EmailLayout';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText={`Welcome to A Startup Biz, ${name}!`}>
      <EmailCard>
        <h2 style={{ color: '#333', margin: '0 0 20px' }}>
          Welcome, {name}!
        </h2>

        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
          Thank you for joining A Startup Biz! We're excited to help you build and
          grow your business.
        </p>

        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '30px' }}>
          Here's what you can do next:
        </p>

        <ul style={{ color: '#666', lineHeight: 1.8, marginBottom: '30px', paddingLeft: '20px' }}>
          <li>Complete your onboarding to get personalized recommendations</li>
          <li>Browse our services and resources</li>
          <li>Book a free consultation call</li>
        </ul>

        <EmailButton href="https://astartupbiz.com/dashboard">
          Get Started
        </EmailButton>
      </EmailCard>
    </EmailLayout>
  );
}
