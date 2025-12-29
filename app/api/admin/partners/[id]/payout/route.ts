import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getPartnerStripeConnect, getPartnerBalance, createPartnerPayout } from "@/lib/db-queries"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia"
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const body = await request.json()
    const { amount } = body

    // Get partner with Stripe Connect details
    const partner = await getPartnerStripeConnect(params.id)

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    if (!partner.stripe_account_id) {
      return NextResponse.json(
        { error: "Partner has not connected Stripe account" },
        { status: 400 }
      )
    }

    if (!partner.stripe_payouts_enabled) {
      return NextResponse.json(
        { error: "Partner payouts not enabled in Stripe" },
        { status: 400 }
      )
    }

    // Get current balance
    const balance = await getPartnerBalance(params.id)

    if (amount > balance.availableBalance) {
      return NextResponse.json(
        { error: `Insufficient balance. Available: $${balance.availableBalance.toFixed(2)}` },
        { status: 400 }
      )
    }

    if (amount < 1) {
      return NextResponse.json(
        { error: "Minimum payout amount is $1.00" },
        { status: 400 }
      )
    }

    // Create Stripe payout
    const payout = await stripe.payouts.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        description: `Manual payout for partner ${partner.company_name}`,
        metadata: {
          partner_id: partner.id,
          requested_by: "admin",
        }
      },
      {
        stripeAccount: partner.stripe_account_id
      }
    )

    // Record payout in database
    const dbPayout = await createPartnerPayout({
      partnerId: partner.id,
      stripePayoutId: payout.id,
      amount,
      status: payout.status as any,
      method: payout.type || "standard",
      arrivalDate: payout.arrival_date ? new Date(payout.arrival_date * 1000) : undefined,
      requestedBy: "admin"
    })

    return NextResponse.json({
      success: true,
      payout: {
        id: dbPayout.id,
        amount: dbPayout.amount,
        status: dbPayout.status,
        arrivalDate: dbPayout.arrival_date
      }
    })
  } catch (error) {
    console.error("Error creating payout:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create payout" },
      { status: 500 }
    )
  }
}
