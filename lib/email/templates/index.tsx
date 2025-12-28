/**
 * Email Templates Index
 * Export all email templates for easy importing
 */

export { OnboardingConfirmationEmail } from './OnboardingConfirmation';
export { WelcomeEmail } from './WelcomeEmail';
export { LeadNotificationEmail } from './LeadNotification';

// Re-export template rendering utilities
export { renderEmail, createEmailTemplate } from '../render';
