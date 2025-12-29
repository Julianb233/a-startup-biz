import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { sql } from '@/lib/db'
import { encrypt, getLast4, maskValue } from '@/lib/encryption'

/**
 * GET /api/partner/bank-details
 * Get bank details for the current partner (masked)
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get partner ID from user
    const partnerResult = await sql`
      SELECT id, onboarding_step, payment_details_submitted
      FROM partners
      WHERE user_id = ${userId}
    `

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const partner = partnerResult[0]
    const partnerId = partner.id as string

    // Get bank details
    const bankResult = await sql`
      SELECT
        id,
        account_holder_name,
        bank_name,
        account_type,
        account_number_last4,
        is_verified,
        created_at,
        updated_at
      FROM partner_bank_details
      WHERE partner_id = ${partnerId}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (bankResult.length === 0) {
      return NextResponse.json({
        hasBankDetails: false,
        bankDetails: null,
        partner: {
          onboardingStep: partner.onboarding_step,
          paymentDetailsSubmitted: partner.payment_details_submitted,
        },
      })
    }

    const bankDetails = bankResult[0]

    return NextResponse.json({
      hasBankDetails: true,
      bankDetails: {
        id: bankDetails.id,
        accountHolderName: bankDetails.account_holder_name,
        bankName: bankDetails.bank_name,
        accountType: bankDetails.account_type,
        accountNumberLast4: bankDetails.account_number_last4,
        routingNumberMasked: '****' + (bankDetails.account_number_last4 || ''),
        isVerified: bankDetails.is_verified,
        createdAt: bankDetails.created_at,
        updatedAt: bankDetails.updated_at,
      },
      partner: {
        onboardingStep: partner.onboarding_step,
        paymentDetailsSubmitted: partner.payment_details_submitted,
      },
    })
  } catch (error) {
    console.error('Error fetching bank details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bank details' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/partner/bank-details
 * Submit or update bank details
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      accountHolderName,
      bankName,
      routingNumber,
      accountNumber,
      accountType,
    } = body

    // Validate required fields
    if (!accountHolderName || !bankName || !routingNumber || !accountNumber || !accountType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate routing number (9 digits for US)
    if (!/^\d{9}$/.test(routingNumber)) {
      return NextResponse.json(
        { error: 'Routing number must be 9 digits' },
        { status: 400 }
      )
    }

    // Validate account number (4-17 digits for US)
    if (!/^\d{4,17}$/.test(accountNumber)) {
      return NextResponse.json(
        { error: 'Account number must be 4-17 digits' },
        { status: 400 }
      )
    }

    // Validate account type
    if (!['checking', 'savings'].includes(accountType)) {
      return NextResponse.json(
        { error: 'Account type must be checking or savings' },
        { status: 400 }
      )
    }

    // Get partner ID from user
    const partnerResult = await sql`
      SELECT id, onboarding_step, agreements_completed
      FROM partners
      WHERE user_id = ${userId}
    `

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const partner = partnerResult[0]
    const partnerId = partner.id as string

    // Check if agreements are completed
    if (!partner.agreements_completed) {
      return NextResponse.json(
        { error: 'Please complete all agreements before submitting payment details' },
        { status: 400 }
      )
    }

    // Encrypt sensitive data
    const encryptedRoutingNumber = encrypt(routingNumber)
    const encryptedAccountNumber = encrypt(accountNumber)
    const accountNumberLast4 = getLast4(accountNumber)

    // Check if bank details already exist
    const existingResult = await sql`
      SELECT id FROM partner_bank_details
      WHERE partner_id = ${partnerId}
    `

    if (existingResult.length > 0) {
      // Update existing record
      await sql`
        UPDATE partner_bank_details
        SET
          account_holder_name = ${accountHolderName},
          bank_name = ${bankName},
          routing_number_encrypted = ${encryptedRoutingNumber},
          account_number_encrypted = ${encryptedAccountNumber},
          account_number_last4 = ${accountNumberLast4},
          account_type = ${accountType},
          is_verified = false,
          updated_at = NOW()
        WHERE partner_id = ${partnerId}
      `
    } else {
      // Insert new record
      await sql`
        INSERT INTO partner_bank_details (
          partner_id,
          account_holder_name,
          bank_name,
          routing_number_encrypted,
          account_number_encrypted,
          account_number_last4,
          account_type
        ) VALUES (
          ${partnerId},
          ${accountHolderName},
          ${bankName},
          ${encryptedRoutingNumber},
          ${encryptedAccountNumber},
          ${accountNumberLast4},
          ${accountType}
        )
      `
    }

    // Update partner record
    await sql`
      UPDATE partners
      SET
        payment_details_submitted = true,
        onboarding_step = 'completed',
        updated_at = NOW()
      WHERE id = ${partnerId}
    `

    return NextResponse.json({
      success: true,
      message: 'Bank details saved successfully. Your onboarding is now complete!',
      bankDetails: {
        accountHolderName,
        bankName,
        accountType,
        accountNumberLast4,
        routingNumberMasked: maskValue(routingNumber),
      },
      onboardingComplete: true,
    })
  } catch (error) {
    console.error('Error saving bank details:', error)
    return NextResponse.json(
      { error: 'Failed to save bank details' },
      { status: 500 }
    )
  }
}
