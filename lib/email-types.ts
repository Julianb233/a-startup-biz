/**
 * Type definitions for email operations
 * Centralized type safety for all email-related functionality
 */

// ============================================
// BASE EMAIL TYPES
// ============================================

export interface EmailSendOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  data?: any;
  error?: any;
  mock?: boolean;
}

// ============================================
// TEMPLATE DATA TYPES
// ============================================

export interface WelcomeEmailData {
  name: string;
  email: string;
}

export interface OnboardingConfirmationData {
  customerName: string;
  businessName: string;
  email: string;
}

export interface OrderConfirmationData {
  email: string;
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export interface ConsultationBookingData {
  email: string;
  customerName: string;
  serviceType: string;
  scheduledAt?: Date;
  date?: string;
  time?: string;
}

export interface NotificationData {
  to: string | string[];
  recipientName: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

// ============================================
// ADMIN NOTIFICATION TYPES
// ============================================

export interface AdminContactNotificationData {
  submissionId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  businessStage?: string;
  services: string[];
  message: string;
  source: string;
}

export interface AdminOnboardingNotificationData {
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

export interface AdminOrderNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

// ============================================
// EMAIL TEMPLATE TYPES
// ============================================

export interface EmailTemplate {
  subject: string;
  html: string;
}

export type TemplateType =
  | 'welcome'
  | 'onboarding-confirmation'
  | 'order-confirmation'
  | 'consultation-booked'
  | 'notification';

export interface TemplateInfo {
  name: TemplateType;
  description: string;
  requiredData: Record<string, string>;
  exampleData: Record<string, any>;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface SendEmailRequest {
  to: string | string[];
  subject: string;
  body?: string;
  html?: string;
  template?: TemplateType;
  templateData?: Record<string, any>;
  replyTo?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  details?: any;
  mock?: boolean;
}

export interface TemplatesListResponse {
  success: boolean;
  templates?: TemplateInfo[];
  template?: TemplateInfo;
  count?: number;
  error?: string;
}
