import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/email/templates
 * List all available email templates with their required data structure
 */

interface TemplateInfo {
  name: string;
  description: string;
  requiredData: Record<string, string>;
  exampleData: Record<string, any>;
}

const templates: TemplateInfo[] = [
  {
    name: 'welcome',
    description: 'Welcome email for new users',
    requiredData: {
      name: 'string - User name',
      email: 'string - User email',
    },
    exampleData: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    name: 'onboarding-confirmation',
    description: 'Confirmation email after onboarding submission',
    requiredData: {
      customerName: 'string - Customer name',
      businessName: 'string - Business name',
    },
    exampleData: {
      customerName: 'Jane Smith',
      businessName: 'Acme Corp',
    },
  },
  {
    name: 'order-confirmation',
    description: 'Order confirmation with itemized details',
    requiredData: {
      customerName: 'string - Customer name',
      orderId: 'string - Order ID',
      items: 'array - Order items [{name, price, quantity}]',
      total: 'number - Order total',
    },
    exampleData: {
      customerName: 'Bob Johnson',
      orderId: 'ORD-12345',
      items: [
        { name: 'Web Design Package', price: 2500, quantity: 1 },
        { name: 'SEO Optimization', price: 1200, quantity: 1 },
      ],
      total: 3700,
    },
  },
  {
    name: 'consultation-booked',
    description: 'Consultation booking confirmation',
    requiredData: {
      customerName: 'string - Customer name',
      serviceType: 'string - Service type',
      date: 'string - Date (optional)',
      time: 'string - Time (optional)',
      scheduledAt: 'Date - Scheduled date/time (optional)',
    },
    exampleData: {
      customerName: 'Alice Williams',
      serviceType: 'Business Strategy',
      date: 'Monday, January 15, 2024',
      time: '2:00 PM EST',
    },
  },
  {
    name: 'notification',
    description: 'Generic notification email',
    requiredData: {
      recipientName: 'string - Recipient name',
      title: 'string - Notification title',
      message: 'string - Notification message',
      actionUrl: 'string - Action button URL (optional)',
      actionText: 'string - Action button text (optional)',
    },
    exampleData: {
      recipientName: 'User',
      title: 'Important Update',
      message: 'Your account has been updated successfully.',
      actionUrl: 'https://astartupbiz.com/dashboard',
      actionText: 'View Dashboard',
    },
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const templateName = searchParams.get('name');

  try {
    if (templateName) {
      // Return specific template info
      const template = templates.find((t) => t.name === templateName);

      if (!template) {
        return NextResponse.json(
          {
            success: false,
            error: `Template '${templateName}' not found`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          template,
        },
        { status: 200 }
      );
    }

    // Return all templates
    return NextResponse.json(
      {
        success: true,
        templates,
        count: templates.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}
