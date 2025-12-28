import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, getPartnerLeads, createPartnerLead } from '@/lib/db-queries'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get partner record
    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch leads
    const { leads, total } = await getPartnerLeads(partner.id, {
      status,
      limit,
      offset
    })

    // Transform leads for frontend
    const transformedLeads = leads.map(lead => ({
      id: lead.id,
      clientName: lead.client_name,
      clientEmail: lead.client_email,
      clientPhone: lead.client_phone,
      service: lead.service,
      status: lead.status,
      commission: lead.commission,
      commissionPaid: lead.commission_paid,
      createdAt: lead.created_at,
      convertedAt: lead.converted_at,
    }))

    return NextResponse.json({
      leads: transformedLeads,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching partner leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get partner record
    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
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

    // Parse request body
    const body = await request.json()
    const { clientName, clientEmail, clientPhone, service, commission } = body

    // Validate required fields
    if (!clientName || !clientEmail || !service || !commission) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create lead
    const lead = await createPartnerLead({
      partnerId: partner.id,
      clientName,
      clientEmail,
      clientPhone,
      service,
      commission
    })

    return NextResponse.json({
      lead: {
        id: lead.id,
        clientName: lead.client_name,
        clientEmail: lead.client_email,
        clientPhone: lead.client_phone,
        service: lead.service,
        status: lead.status,
        commission: lead.commission,
        createdAt: lead.created_at,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating partner lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
