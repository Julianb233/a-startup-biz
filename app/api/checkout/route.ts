import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { SITE_CONFIG } from '@/lib/site-config'
import { withRateLimit } from '@/lib/rate-limit'
import { getProduct, verifyProductPrice } from '@/lib/products'

interface CartItem {
  slug: string
  name: string
  price: number
  quantity: number
  description?: string
}

interface CheckoutRequest {
  items: CartItem[]
  customerEmail?: string
  customerName?: string
  metadata?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await withRateLimit(request, 'checkout')
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { userId } = await auth()
    const body: CheckoutRequest = await request.json()

    const { items, customerEmail, customerName, metadata = {} } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // SECURITY: Verify all prices against server-side catalog
    // Never trust client-provided prices
    const priceErrors: string[] = []
    const verifiedItems = items.map((item) => {
      const verification = verifyProductPrice(item.slug, item.price)

      if (!verification.valid) {
        priceErrors.push(verification.error || `Invalid price for ${item.slug}`)
        // Use server-side price if available, otherwise reject
        if (verification.actualPrice !== undefined) {
          return {
            ...item,
            price: verification.actualPrice,
            name: verification.product?.name || item.name,
            description: verification.product?.description || item.description,
          }
        }
      }

      return item
    })

    // Reject checkout if any products are not in catalog
    const invalidProducts = priceErrors.filter(e => e.includes('not found'))
    if (invalidProducts.length > 0) {
      console.error('Checkout rejected - invalid products:', invalidProducts)
      return NextResponse.json(
        { error: 'One or more products are not available', details: invalidProducts },
        { status: 400 }
      )
    }

    // Log any price tampering attempts
    if (priceErrors.length > 0) {
      console.warn('Price tampering detected - using server prices:', priceErrors)
    }

    // Calculate total using VERIFIED prices
    const total = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create line items for Stripe using VERIFIED prices
    const lineItems = verifiedItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || `${SITE_CONFIG.name} Service`,
        },
        unit_amount: formatAmountForStripe(item.price),
      },
      quantity: item.quantity,
    }))

    // Determine success and cancel URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      customer_email: customerEmail,
      client_reference_id: userId || undefined,
      metadata: {
        ...metadata,
        userId: userId || 'anonymous',
        customerName: customerName || '',
        itemsSummary: verifiedItems.map(i => `${i.name} x${i.quantity}`).join(', '),
        total: total.toFixed(2),
      },
      payment_intent_data: {
        metadata: {
          userId: userId || 'anonymous',
          items: JSON.stringify(verifiedItems.map(i => ({ slug: i.slug, name: i.name, price: i.price, quantity: i.quantity }))),
        },
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
