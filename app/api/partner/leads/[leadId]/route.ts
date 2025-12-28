import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, updatePartnerLeadStatus } from '@/lib/db-queries'

/**
 * PATCH /api/partner/leads/[leadId]
 *
 * Updates the status of a specific partner lead
 *
 * @param {Object} context - Next.js route context
 * @param {Object} context.params - Route parameters
 * @param {string} context.params.leadId - The ID of the lead to update
 * @returns {Object} Updated lead information
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    // Get partner record
    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner account not found' },
        { status: 404 }
      )
    }

    // Check if partner is active
    if (partner.status !== 'active') {
      return NextResponse.json(
        {
          error: 'Partner account not active',
          message: 'Your partner account must be active to update leads'
        },
        { status: 403 }
      )
    }

    // Get lead ID from params
    const { leadId } = await params

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'contacted', 'qualified', 'converted', 'lost'] as const
    type LeadStatus = typeof validStatuses[number]

    if (!status || !validStatuses.includes(status as LeadStatus)) {
      return NextResponse.json(
        {
          error: 'Invalid status',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Update lead status
    const updatedLead = await updatePartnerLeadStatus(
      leadId,
      partner.id,
      status as LeadStatus
    )

    if (!updatedLead) {
      return NextResponse.json(
        {
          error: 'Lead not found',
          message: 'The lead was not found or does not belong to your account'
        },
        { status: 404 }
      )
    }

    // Return updated lead
    return NextResponse.json({
      lead: {
        id: updatedLead.id,
        clientName: updatedLead.client_name,
        clientEmail: updatedLead.client_email,
        clientPhone: updatedLead.client_phone,
        service: updatedLead.service,
        status: updatedLead.status,
        commission: Number(updatedLead.commission),
        commissionPaid: updatedLead.commission_paid,
        createdAt: updatedLead.created_at,
        convertedAt: updatedLead.converted_at,
      },
      message: `Lead status updated to ${status}`
    })
  } catch (error) {
    console.error('Error updating partner lead:', error)
    return NextResponse.json(
      {
        error: 'Failed to update lead',
        message: 'An unexpected error occurred while updating the lead status'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/partner/leads/[leadId]
 *
 * Retrieves details for a specific partner lead
 *
 * @param {Object} context - Next.js route context
 * @param {Object} context.params - Route parameters
 * @param {string} context.params.leadId - The ID of the lead to retrieve
 * @returns {Object} Lead details
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    // Get partner record
    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner account not found' },
        { status: 404 }
      )
    }

    // Check if partner is active
    if (partner.status !== 'active') {
      return NextResponse.json(
        { error: 'Partner account not active' },
        { status: 403 }
      )
    }

    // Get lead ID from params
    const { leadId } = await params

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Fetch single lead (using getPartnerLeads with limit 1)
    const { leads } = await getPartnerLeads(partner.id, {
      limit: 1,
      offset: 0
    })

    const lead = leads.find(l => l.id === leadId)

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      lead: {
        id: lead.id,
        clientName: lead.client_name,
        clientEmail: lead.client_email,
        clientPhone: lead.client_phone,
        service: lead.service,
        status: lead.status,
        commission: Number(lead.commission),
        commissionPaid: lead.commission_paid,
        createdAt: lead.created_at,
        convertedAt: lead.converted_at,
      }
    })
  } catch (error) {
    console.error('Error fetching partner lead:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead details' },
      { status: 500 }
    )
  }
}

// Need to import getPartnerLeads for the GET handler
import { getPartnerLeads } from '@/lib/db-queries'
