/**
 * Onboarding Confirmation Email Template (React version)
 */

import {
  EmailLayout,
  EmailCard,
  EmailButton,
  EmailInfoBox,
  EmailIconBadge,
} from '../components/EmailLayout';

interface OnboardingConfirmationProps {
  customerName: string;
  businessName: string;
}

export function OnboardingConfirmationEmail({
  customerName,
  businessName,
}: OnboardingConfirmationProps) {
  return (
    <EmailLayout previewText={`Thanks for completing your onboarding, ${customerName}!`}>
      <EmailCard>
        <h2 style={{ color: '#333', margin: '0 0 20px' }}>
          Thanks for completing your onboarding!
        </h2>

        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
          Hi {customerName}, we've received the onboarding information for{' '}
          <strong>{businessName}</strong>.
        </p>

        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '30px' }}>
          Our team is reviewing your submission and will reach out within 24-48
          hours with personalized recommendations for your business.
        </p>

        <EmailInfoBox color="warning">
          <p style={{ margin: 0, color: '#666' }}>
            <strong style={{ color: '#333' }}>In the meantime:</strong> Browse our
            services and resources to learn more about how we can help you grow.
          </p>
        </EmailInfoBox>

        <EmailButton href="https://astartupbiz.com/services">
          Explore Services
        </EmailButton>
      </EmailCard>
    </EmailLayout>
  );
}
