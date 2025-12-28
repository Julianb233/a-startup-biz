import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sendEmail,
  welcomeEmail,
  onboardingSubmittedEmail,
  orderConfirmationEmail,
  consultationBookedEmail,
  notificationEmail,
  sendWelcomeEmail,
  sendOnboardingConfirmation,
  sendNotification,
  sendOrderConfirmation,
  sendConsultationConfirmation,
} from '@/lib/email';

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({
        data: { id: 'test-email-id' },
        error: null,
      }),
    },
  })),
}));

describe('Email Templates', () => {
  describe('welcomeEmail', () => {
    it('should generate welcome email with correct structure', () => {
      const result = welcomeEmail({
        name: 'John Doe',
        email: 'john@example.com',
      });

      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('html');
      expect(result.subject).toContain('Welcome');
      expect(result.html).toContain('John Doe');
    });
  });

  describe('onboardingSubmittedEmail', () => {
    it('should generate onboarding confirmation email', () => {
      const result = onboardingSubmittedEmail({
        customerName: 'Jane Smith',
        businessName: 'Acme Corp',
      });

      expect(result.subject).toContain('Onboarding');
      expect(result.html).toContain('Jane Smith');
      expect(result.html).toContain('Acme Corp');
    });
  });

  describe('orderConfirmationEmail', () => {
    it('should generate order confirmation with itemized list', () => {
      const result = orderConfirmationEmail({
        customerName: 'Bob Johnson',
        orderId: 'ORD-12345',
        items: [
          { name: 'Web Design', price: 2500, quantity: 1 },
          { name: 'SEO', price: 1200, quantity: 1 },
        ],
        total: 3700,
      });

      expect(result.subject).toContain('Order Confirmation');
      expect(result.html).toContain('ORD-12345');
      expect(result.html).toContain('Web Design');
      expect(result.html).toContain('3700');
    });
  });

  describe('consultationBookedEmail', () => {
    it('should generate consultation booking confirmation', () => {
      const result = consultationBookedEmail({
        customerName: 'Alice Williams',
        serviceType: 'Business Strategy',
        date: 'Monday, January 15, 2024',
        time: '2:00 PM EST',
      });

      expect(result.subject).toContain('Consultation');
      expect(result.html).toContain('Alice Williams');
      expect(result.html).toContain('Business Strategy');
      expect(result.html).toContain('January 15, 2024');
    });
  });

  describe('notificationEmail', () => {
    it('should generate notification email with action button', () => {
      const result = notificationEmail({
        recipientName: 'User',
        title: 'Important Update',
        message: 'Your account has been updated.',
        actionUrl: 'https://example.com/dashboard',
        actionText: 'View Dashboard',
      });

      expect(result.subject).toBe('Important Update');
      expect(result.html).toContain('Important Update');
      expect(result.html).toContain('Your account has been updated');
      expect(result.html).toContain('View Dashboard');
    });

    it('should generate notification without action button', () => {
      const result = notificationEmail({
        recipientName: 'User',
        title: 'System Notice',
        message: 'Maintenance scheduled.',
      });

      expect(result.html).toContain('System Notice');
      expect(result.html).not.toContain('href=');
    });
  });
});

describe('Email Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const result = await sendWelcomeEmail({
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('sendOnboardingConfirmation', () => {
    it('should send onboarding confirmation', async () => {
      const result = await sendOnboardingConfirmation({
        customerName: 'Test Customer',
        businessName: 'Test Business',
        email: 'customer@example.com',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('sendOrderConfirmation', () => {
    it('should send order confirmation with items', async () => {
      const result = await sendOrderConfirmation({
        email: 'buyer@example.com',
        customerName: 'Buyer',
        orderId: 'TEST-001',
        items: [{ name: 'Service', price: 100, quantity: 1 }],
        total: 100,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('sendConsultationConfirmation', () => {
    it('should send consultation confirmation', async () => {
      const result = await sendConsultationConfirmation({
        email: 'client@example.com',
        customerName: 'Client',
        serviceType: 'Consultation',
        date: 'Tomorrow',
        time: '10:00 AM',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('sendNotification', () => {
    it('should send notification to single recipient', async () => {
      const result = await sendNotification({
        to: 'user@example.com',
        recipientName: 'User',
        title: 'Test Notification',
        message: 'This is a test',
      });

      expect(result.success).toBe(true);
    });

    it('should send notification to multiple recipients', async () => {
      const result = await sendNotification({
        to: ['user1@example.com', 'user2@example.com'],
        recipientName: 'Team',
        title: 'Team Update',
        message: 'Important team announcement',
        actionUrl: 'https://example.com',
        actionText: 'Learn More',
      });

      expect(result.success).toBe(true);
    });
  });
});

describe('Email Sending', () => {
  describe('sendEmail', () => {
    it('should send email with HTML content', async () => {
      const result = await sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<h1>Hello World</h1>',
      });

      expect(result.success).toBe(true);
    });

    it('should send email with plain text', async () => {
      const result = await sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'Hello World',
      });

      expect(result.success).toBe(true);
    });

    it('should send to multiple recipients', async () => {
      const result = await sendEmail({
        to: ['user1@example.com', 'user2@example.com'],
        subject: 'Bulk Email',
        text: 'Message for all',
      });

      expect(result.success).toBe(true);
    });

    it('should include replyTo address', async () => {
      const result = await sendEmail({
        to: 'recipient@example.com',
        subject: 'Test',
        text: 'Test',
        replyTo: 'support@example.com',
      });

      expect(result.success).toBe(true);
    });
  });
});
