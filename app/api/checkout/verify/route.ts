import { NextRequest, NextResponse } from 'next/server'
import { stripe, formatAmountFromStripe } from '@/lib/stripe'
import { withRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/checkout/verify
 *
 * Verify a Stripe checkout session and return order details
 * Used by the checkout success page to display real order data
 *
 * Query params:
 *   - session_id: Stripe checkout session ID
 */
export async function GET(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await withRateLimit(request, 'api')
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details', 'payment_intent'],
    })

    // Verify the session was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed', status: session.payment_status },
        { status: 400 }
      )
    }

    // Extract order details
    const customerEmail = session.customer_details?.email || session.customer_email
    const customerName = session.customer_details?.name || session.metadata?.customerName
    const amountTotal = session.amount_total ? formatAmountFromStripe(session.amount_total) : 0

    // Extract line items
    const items = session.line_items?.data.map(item => ({
      name: item.description || 'Item',
      quantity: item.quantity || 1,
      price: item.amount_total ? formatAmountFromStripe(item.amount_total) : 0,
    })) || []

    // Get payment intent ID for reference
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id

    return NextResponse.json({
      success: true,
      order: {
        sessionId: session.id,
        paymentIntentId,
        email: customerEmail,
        name: customerName,
        total: amountTotal,
        items,
        paymentStatus: session.payment_status,
        createdAt: new Date(session.created * 1000).toISOString(),
      },
    })

  } catch (error) {
    console.error('Session verification error:', error)

    // Handle Stripe-specific errors
    if (error instanceof Error && error.message.includes('No such checkout.session')) {
      return NextResponse.json(
        { error: 'Session not found or expired' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}
