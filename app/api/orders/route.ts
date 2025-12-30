import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/clerk-server-safe';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // First, get the user's internal ID from clerk_user_id
    const userResult = await sql`
      SELECT id FROM users WHERE clerk_user_id = ${userId}
    `;

    if (userResult.length === 0) {
      // User not found in database, return empty orders
      return NextResponse.json({ orders: [], total: 0 });
    }

    const internalUserId = userResult[0].id;

    // Build query based on filters
    let orders;
    let countResult;

    if (status && status !== 'all') {
      orders = await sql`
        SELECT
          id,
          items,
          subtotal,
          discount,
          total,
          status,
          payment_intent_id,
          stripe_session_id,
          coupon_code,
          notes,
          created_at,
          updated_at
        FROM orders
        WHERE user_id = ${internalUserId}
          AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) as count
        FROM orders
        WHERE user_id = ${internalUserId}
          AND status = ${status}
      `;
    } else {
      orders = await sql`
        SELECT
          id,
          items,
          subtotal,
          discount,
          total,
          status,
          payment_intent_id,
          stripe_session_id,
          coupon_code,
          notes,
          created_at,
          updated_at
        FROM orders
        WHERE user_id = ${internalUserId}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) as count
        FROM orders
        WHERE user_id = ${internalUserId}
      `;
    }

    const total = parseInt(countResult[0]?.count || '0', 10);

    // Transform orders to match frontend expectations
    const transformedOrders = orders.map((order: any) => ({
      id: order.id,
      items: order.items || [],
      subtotal: parseFloat(order.subtotal) || 0,
      discount: parseFloat(order.discount) || 0,
      total: parseFloat(order.total) || 0,
      status: order.status,
      paymentIntentId: order.payment_intent_id,
      stripeSessionId: order.stripe_session_id,
      couponCode: order.coupon_code,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }));

    return NextResponse.json({
      orders: transformedOrders,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
