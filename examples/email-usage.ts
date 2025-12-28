/**
 * Email System Usage Examples
 *
 * This file contains practical examples of using the email notification system.
 * Copy these examples into your own code as needed.
 */

import {
  sendEmail,
  sendWelcomeEmail,
  sendOnboardingConfirmation,
  sendOrderConfirmation,
  sendConsultationConfirmation,
  sendNotification,
  ADMIN_EMAIL
} from '@/lib/email';

// ============================================
// EXAMPLE 1: Send Welcome Email
// ============================================

async function example1_welcomeNewUser() {
  const result = await sendWelcomeEmail({
    name: 'John Doe',
    email: 'john@example.com'
  });

  if (result.success) {
    console.log('Welcome email sent successfully');
  } else {
    console.error('Failed to send welcome email:', result.error);
  }
}

// ============================================
// EXAMPLE 2: Onboarding Confirmation
// ============================================

async function example2_onboardingConfirmation() {
  await sendOnboardingConfirmation({
    customerName: 'Jane Smith',
    businessName: 'Acme Corporation',
    email: 'jane@acme.com'
  });
}

// ============================================
// EXAMPLE 3: Order Confirmation
// ============================================

async function example3_orderConfirmation() {
  await sendOrderConfirmation({
    email: 'customer@example.com',
    customerName: 'Bob Johnson',
    orderId: 'ORD-2024-001',
    items: [
      { name: 'Web Design Package', price: 2500, quantity: 1 },
      { name: 'SEO Optimization', price: 1200, quantity: 1 },
      { name: 'Logo Design', price: 500, quantity: 1 }
    ],
    total: 4200
  });
}

// ============================================
// EXAMPLE 4: Consultation Booking
// ============================================

async function example4_consultationBooking() {
  await sendConsultationConfirmation({
    email: 'client@example.com',
    customerName: 'Alice Williams',
    serviceType: 'Business Strategy Consultation',
    date: 'Monday, February 5, 2024',
    time: '2:00 PM EST'
  });
}

// ============================================
// EXAMPLE 5: Generic Notification
// ============================================

async function example5_genericNotification() {
  await sendNotification({
    to: 'user@example.com',
    recipientName: 'User',
    title: 'Account Updated Successfully',
    message: 'Your profile information has been updated. If you did not make this change, please contact support immediately.',
    actionUrl: 'https://astartupbiz.com/dashboard/profile',
    actionText: 'View Profile'
  });
}

// ============================================
// EXAMPLE 6: Send to Multiple Recipients
// ============================================

async function example6_multipleRecipients() {
  await sendNotification({
    to: ['admin@example.com', 'manager@example.com', 'team@example.com'],
    recipientName: 'Team',
    title: 'Important System Update',
    message: 'The system will undergo maintenance tonight from 2-4 AM EST. Please save your work before then.'
  });
}

// ============================================
// EXAMPLE 7: Custom Email (Raw HTML)
// ============================================

async function example7_customEmail() {
  await sendEmail({
    to: 'recipient@example.com',
    subject: 'Custom Branded Email',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h1 style="color: #ff6a1a;">Custom Email</h1>
          <p>This is a custom email with your own HTML.</p>
          <a href="https://astartupbiz.com">Visit Our Site</a>
        </body>
      </html>
    `,
    replyTo: 'support@astartupbiz.com'
  });
}

// ============================================
// EXAMPLE 8: Plain Text Email
// ============================================

async function example8_plainTextEmail() {
  await sendEmail({
    to: 'recipient@example.com',
    subject: 'Plain Text Notification',
    text: 'This is a plain text email without HTML formatting.\n\nSimple and straightforward.'
  });
}

// ============================================
// EXAMPLE 9: Error Handling
// ============================================

async function example9_errorHandling() {
  try {
    const result = await sendWelcomeEmail({
      name: 'Test User',
      email: 'test@example.com'
    });

    if (!result.success) {
      // Log error but don't fail the entire operation
      console.error('Email send failed:', result.error);

      // Optionally notify admin
      await sendNotification({
        to: ADMIN_EMAIL,
        recipientName: 'Admin',
        title: 'Email Send Failed',
        message: `Failed to send welcome email to test@example.com: ${result.error}`
      });
    }
  } catch (error) {
    console.error('Unexpected error sending email:', error);
  }
}

// ============================================
// EXAMPLE 10: Fire-and-Forget Pattern
// ============================================

async function example10_fireAndForget() {
  // Don't await - send in background
  sendWelcomeEmail({
    name: 'Async User',
    email: 'async@example.com'
  }).catch(error => {
    console.error('Background email failed:', error);
  });

  // Continue processing immediately
  console.log('Email queued, continuing...');
}

// ============================================
// EXAMPLE 11: API Route Integration
// ============================================

// In your API route (app/api/register/route.ts):
/*
import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const { name, email } = await request.json();

  // ... save user to database

  // Send welcome email (fire and forget)
  sendWelcomeEmail({ name, email }).catch(console.error);

  return NextResponse.json({ success: true });
}
*/

// ============================================
// EXAMPLE 12: Server Action Integration
// ============================================

// In your server action (app/actions/user.ts):
/*
'use server';

import { sendWelcomeEmail } from '@/lib/email';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // ... process registration

  await sendWelcomeEmail({ name, email });

  return { success: true };
}
*/

// ============================================
// EXAMPLE 13: Admin Notification Pattern
// ============================================

async function example13_adminNotification() {
  // When something important happens, notify admin
  const orderDetails = {
    orderId: 'ORD-123',
    amount: 5000,
    customer: 'Big Corp Inc.'
  };

  await sendNotification({
    to: ADMIN_EMAIL,
    recipientName: 'Admin',
    title: 'High-Value Order Received',
    message: `New order from ${orderDetails.customer}\nOrder ID: ${orderDetails.orderId}\nAmount: $${orderDetails.amount}`,
    actionUrl: 'https://astartupbiz.com/admin/orders',
    actionText: 'View Order'
  });
}

// ============================================
// EXAMPLE 14: Scheduled Emails (with reminder)
// ============================================

async function example14_consultationReminder() {
  // Send 24 hours before consultation
  await sendNotification({
    to: 'client@example.com',
    recipientName: 'Alice',
    title: 'Consultation Reminder - Tomorrow',
    message: 'This is a reminder that your Business Strategy Consultation is scheduled for tomorrow at 2:00 PM EST.\n\nPlease ensure you have:\n- Reviewed your business goals\n- Prepared any questions\n- Have access to video conferencing',
    actionUrl: 'https://astartupbiz.com/dashboard/consultations',
    actionText: 'View Details'
  });
}

// ============================================
// EXAMPLE 15: Using API Endpoint Directly
// ============================================

async function example15_viaAPIEndpoint() {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: 'user@example.com',
      subject: 'Hello from API',
      template: 'welcome',
      templateData: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    })
  });

  const result = await response.json();
  console.log('Email sent via API:', result);
}

// ============================================
// EXAMPLE 16: Bulk Email to Team
// ============================================

async function example16_bulkTeamEmail() {
  const teamMembers = [
    'alice@example.com',
    'bob@example.com',
    'carol@example.com',
    'dave@example.com'
  ];

  // Send to all team members at once
  await sendNotification({
    to: teamMembers,
    recipientName: 'Team',
    title: 'Weekly Team Update',
    message: 'Here are this week\'s highlights:\n\n- Project A completed\n- New client onboarded\n- Team meeting Friday at 3 PM',
    actionUrl: 'https://astartupbiz.com/dashboard',
    actionText: 'View Dashboard'
  });
}

// Export examples for documentation
export const examples = {
  example1_welcomeNewUser,
  example2_onboardingConfirmation,
  example3_orderConfirmation,
  example4_consultationBooking,
  example5_genericNotification,
  example6_multipleRecipients,
  example7_customEmail,
  example8_plainTextEmail,
  example9_errorHandling,
  example10_fireAndForget,
  example13_adminNotification,
  example14_consultationReminder,
  example15_viaAPIEndpoint,
  example16_bulkTeamEmail
};
