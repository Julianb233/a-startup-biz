/**
 * HubSpot Sync API
 *
 * Manual sync endpoints for HubSpot CRM integration.
 * Allows triggering sync operations from admin dashboard.
 *
 * Endpoints:
 * - POST /api/crm/hubspot/sync - Sync contact or deal
 * - GET /api/crm/hubspot/sync - Check sync status
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import {
  isHubSpotConfigured,
  upsertContact,
  markContactAsCustomer,
  syncCompletedOrder,
  findContactByEmail,
  findDealByOrderId,
} from '@/lib/hubspot'

// Validation schemas
const syncContactSchema = z.object({
  type: z.literal('contact'),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  businessStage: z.string().optional(),
  services: z.array(z.string()).optional(),
  source: z.string().optional(),
  message: z.string().optional(),
  markAsCustomer: z.boolean().optional(),
})

const syncDealSchema = z.object({
  type: z.literal('deal'),
  orderId: z.string(),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  total: z.number(),
  items: z.array(z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  paymentMethod: z.string().optional(),
})

const syncRequestSchema = z.union([syncContactSchema, syncDealSchema])

/**
 * POST /api/crm/hubspot/sync
 * Manually sync a contact or deal to HubSpot
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication (admin only)
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if HubSpot is configured
    if (!isHubSpotConfigured()) {
      return NextResponse.json(
        { error: 'HubSpot integration is not configured. Set HUBSPOT_API_KEY environment variable.' },
        { status: 503 }
      )
    }

    // Parse and validate request
    const body = await request.json()
    const validatedData = syncRequestSchema.parse(body)

    if (validatedData.type === 'contact') {
      // Sync contact
      const result = await upsertContact({
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        company: validatedData.company,
        businessStage: validatedData.businessStage,
        services: validatedData.services,
        source: validatedData.source,
        message: validatedData.message,
      })

      // Optionally mark as customer
      if (validatedData.markAsCustomer && result.success) {
        await markContactAsCustomer(validatedData.email)
      }

      return NextResponse.json({
        success: result.success,
        action: result.action,
        hubspotId: result.hubspotId,
        message: result.success
          ? `Contact ${result.action}: ${validatedData.email}`
          : result.error,
      })
    } else {
      // Sync deal
      const result = await syncCompletedOrder({
        orderId: validatedData.orderId,
        customerEmail: validatedData.customerEmail,
        customerName: validatedData.customerName,
        total: validatedData.total,
        items: validatedData.items,
        paymentMethod: validatedData.paymentMethod,
      })

      return NextResponse.json({
        success: result.success,
        action: result.action,
        hubspotId: result.hubspotId,
        message: result.success
          ? `Deal ${result.action}: ${validatedData.orderId}`
          : result.error,
      })
    }
  } catch (error) {
    console.error('[HubSpot Sync API] Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to sync with HubSpot' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/crm/hubspot/sync
 * Check sync status for a contact or deal
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if HubSpot is configured
    if (!isHubSpotConfigured()) {
      return NextResponse.json({
        configured: false,
        message: 'HubSpot integration is not configured',
      })
    }

    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const orderId = searchParams.get('orderId')

    if (email) {
      // Look up contact
      const contact = await findContactByEmail(email)
      return NextResponse.json({
        configured: true,
        type: 'contact',
        found: !!contact,
        data: contact ? {
          hubspotId: contact.id,
          email: contact.properties.email,
          firstname: contact.properties.firstname,
          lastname: contact.properties.lastname,
          lifecyclestage: contact.properties.lifecyclestage,
          lastModified: contact.properties.lastmodifieddate,
        } : null,
      })
    }

    if (orderId) {
      // Look up deal
      const deal = await findDealByOrderId(orderId)
      return NextResponse.json({
        configured: true,
        type: 'deal',
        found: !!deal,
        data: deal ? {
          hubspotId: deal.id,
          dealname: deal.properties.dealname,
          amount: deal.properties.amount,
          dealstage: deal.properties.dealstage,
          closedate: deal.properties.closedate,
        } : null,
      })
    }

    // No lookup parameters, return config status
    return NextResponse.json({
      configured: true,
      message: 'HubSpot integration is configured. Provide ?email= or ?orderId= to check sync status.',
    })

  } catch (error) {
    console.error('[HubSpot Sync API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to check HubSpot sync status' },
      { status: 500 }
    )
  }
}

// Route config
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
