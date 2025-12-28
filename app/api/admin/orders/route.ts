import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, withAuth } from '@/lib/api-auth'
import { getAllOrders, updateOrderStatus } from '@/lib/db-queries'

export async function GET(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { orders, total } = await getAllOrders({
      status: status === 'all' ? undefined : status,
      limit,
      offset,
    })

    return NextResponse.json({
      orders,
      total,
      limit,
      offset,
    })
  })
}

export async function PATCH(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing orderId or status' },
        { status: 400 }
      )
    }

    const updatedOrder = await updateOrderStatus(orderId, status)

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order: updatedOrder })
  })
}
