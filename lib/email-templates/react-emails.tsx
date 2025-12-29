// React Email Templates - For use with @react-email/components
// Install: pnpm add @react-email/components

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

// Shared styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  borderRadius: '8px',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '32px',
  textAlign: 'center' as const,
};

const headerText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
};

const content = {
  padding: '32px',
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const highlight = {
  backgroundColor: '#f0f4ff',
  padding: '16px',
  borderRadius: '6px',
  borderLeft: '4px solid #667eea',
  margin: '16px 0',
};

const footer = {
  backgroundColor: '#f8f9fa',
  padding: '24px',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: '#666',
};

// Welcome Email
interface WelcomeEmailProps {
  name: string;
  email: string;
  companyName?: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({ name, email, companyName = 'A Startup Biz', dashboardUrl = '#' }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to {companyName}! Your account is ready.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerText}>Welcome to {companyName}!</Heading>
        </Section>
        <Section style={content}>
          <Text>Hi {name},</Text>
          <Text>We're thrilled to have you on board! Your account has been successfully created.</Text>
          <Section style={highlight}>
            <Text style={{ margin: 0 }}><strong>Your login email:</strong> {email}</Text>
          </Section>
          <Text>Here's what you can do next:</Text>
          <Text>• Complete your profile</Text>
          <Text>• Explore our features</Text>
          <Text>• Connect with our community</Text>
          <Button style={button} href={dashboardUrl}>Get Started</Button>
          <Text>If you have any questions, our support team is here to help.</Text>
          <Text>Best regards,<br />The Team</Text>
        </Section>
        <Section style={footer}>
          <Text>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Partner Approved Email
interface PartnerApprovedEmailProps {
  name: string;
  referralCode: string;
  portalUrl: string;
}

export const PartnerApprovedEmail = ({ name, referralCode, portalUrl }: PartnerApprovedEmailProps) => (
  <Html>
    <Head />
    <Preview>Congratulations! Your partner application has been approved!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ ...header, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
          <Heading style={headerText}>Congratulations! You're Approved!</Heading>
        </Section>
        <Section style={content}>
          <Text>Hi {name},</Text>
          <Text>Great news! Your partner application has been approved. You're now officially part of our partner program!</Text>
          <Section style={{ ...highlight, borderLeftColor: '#11998e' }}>
            <Text style={{ margin: 0 }}><strong>Your Referral Code:</strong> {referralCode}</Text>
            <Text style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>Share this code with your clients to earn commissions</Text>
          </Section>
          <Text><strong>What's next?</strong></Text>
          <Text>• Access your partner portal</Text>
          <Text>• Set up your payout details</Text>
          <Text>• Start referring clients</Text>
          <Button style={{ ...button, backgroundColor: '#11998e' }} href={portalUrl}>Access Partner Portal</Button>
          <Hr />
          <Text><strong>Commission Structure:</strong></Text>
          <Text>• 10% on all referred sales</Text>
          <Text>• Monthly payouts via Stripe</Text>
          <Text>• Real-time tracking dashboard</Text>
          <Text>Welcome aboard!</Text>
        </Section>
        <Section style={footer}>
          <Text>Questions? Reply to this email or contact support.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Lead Converted Email
interface LeadConvertedEmailProps {
  partnerName: string;
  clientName: string;
  amount: number;
  commission: number;
  dashboardUrl?: string;
}

export const LeadConvertedEmail = ({ partnerName, clientName, amount, commission, dashboardUrl = '#' }: LeadConvertedEmailProps) => (
  <Html>
    <Head />
    <Preview>You made a sale! ${commission.toFixed(2)} commission earned.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ ...header, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <Heading style={headerText}>You Made a Sale!</Heading>
        </Section>
        <Section style={content}>
          <Text>Hi {partnerName},</Text>
          <Text>Your referral just converted! Here are the details:</Text>
          <Section style={{ ...highlight, borderLeftColor: '#f5576c' }}>
            <Text style={{ margin: 0 }}><strong>Client:</strong> {clientName}</Text>
            <Text style={{ margin: '4px 0' }}><strong>Sale Amount:</strong> ${amount.toFixed(2)}</Text>
            <Text style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#f5576c' }}><strong>Your Commission:</strong> ${commission.toFixed(2)}</Text>
          </Section>
          <Text>This commission will be included in your next monthly payout.</Text>
          <Button style={{ ...button, backgroundColor: '#f5576c' }} href={dashboardUrl}>View Dashboard</Button>
          <Text>Keep up the great work!</Text>
        </Section>
        <Section style={footer}>
          <Text>Your commissions are processed monthly.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Payout Sent Email
interface PayoutSentEmailProps {
  name: string;
  amount: number;
  payoutId: string;
  referrals: number;
  historyUrl?: string;
}

export const PayoutSentEmail = ({ name, amount, payoutId, referrals, historyUrl = '#' }: PayoutSentEmailProps) => (
  <Html>
    <Head />
    <Preview>Payout sent! ${amount.toFixed(2)} is on its way.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ ...header, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Heading style={headerText}>Payout Sent!</Heading>
        </Section>
        <Section style={content}>
          <Text>Hi {name},</Text>
          <Text>Your monthly payout has been processed and is on its way!</Text>
          <Section style={highlight}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#667eea' }}>${amount.toFixed(2)}</Text>
            <Text style={{ margin: '8px 0 0 0', color: '#666' }}>From {referrals} referral{referrals !== 1 ? 's' : ''}</Text>
          </Section>
          <Text><strong>Payout ID:</strong> {payoutId}</Text>
          <Text>Funds typically arrive within 2-3 business days.</Text>
          <Button style={button} href={historyUrl}>View Payout History</Button>
          <Text>Thank you for being an amazing partner!</Text>
        </Section>
        <Section style={footer}>
          <Text>Questions about your payout? Contact support.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Appointment Confirmation Email
interface AppointmentEmailProps {
  name: string;
  date: string;
  time: string;
  type: string;
  meetingLink?: string;
}

export const AppointmentConfirmationEmail = ({ name, date, time, type, meetingLink }: AppointmentEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {type} appointment is confirmed for {date} at {time}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ ...header, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <Heading style={headerText}>Appointment Confirmed!</Heading>
        </Section>
        <Section style={content}>
          <Text>Hi {name},</Text>
          <Text>Your appointment has been confirmed. Here are the details:</Text>
          <Section style={{ ...highlight, borderLeftColor: '#4facfe' }}>
            <Text style={{ margin: 0 }}><strong>Type:</strong> {type}</Text>
            <Text style={{ margin: '4px 0' }}><strong>Date:</strong> {date}</Text>
            <Text style={{ margin: 0 }}><strong>Time:</strong> {time}</Text>
          </Section>
          {meetingLink && <Button style={{ ...button, backgroundColor: '#4facfe' }} href={meetingLink}>Join Meeting</Button>}
          <Text><strong>Preparation Tips:</strong></Text>
          <Text>• Have your questions ready</Text>
          <Text>• Ensure a quiet environment</Text>
          <Text>• Test your audio/video beforehand</Text>
          <Text>We look forward to speaking with you!</Text>
        </Section>
        <Section style={footer}>
          <Text>Need to reschedule? Reply to this email at least 24 hours in advance.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default {
  WelcomeEmail,
  PartnerApprovedEmail,
  LeadConvertedEmail,
  PayoutSentEmail,
  AppointmentConfirmationEmail,
};
