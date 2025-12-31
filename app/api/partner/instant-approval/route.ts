import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db-queries'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { getSiteUrl } from '@/lib/site-url'

interface ApprovalRequest {
  businessName: string
  email: string
  phone: string
  businessType: string
  monthlyReferrals: string
  website?: string
}

interface ApprovalResult {
  approved: boolean
  reason: 'instant' | 'call_required'
  applicationId: string
  message: string
  calendarLink?: string
}

// Criteria for instant approval
const INSTANT_APPROVAL_BUSINESS_TYPES = [
  'accountant',
  'financial_advisor',
  'insurance_agent',
  'real_estate',
  'attorney',
  'consultant',
]

const INSTANT_APPROVAL_MIN_REFERRALS = '5-10' // At least 5-10 expected referrals

/**
 * POST /api/partner/instant-approval
 *
 * Evaluates a partner application for instant approval or schedules a call.
 *
 * Instant approval criteria:
 * - Business type in approved list
 * - Expected monthly referrals >= 5-10
 * - Has a website (optional but helps)
 *
 * If not instantly approved, redirects to call booking.
 */
export async function POST(request: NextRequest) {
  try {
    const siteUrl = getSiteUrl()
    const body: ApprovalRequest = await request.json()
    const { businessName, email, phone, businessType, monthlyReferrals, website } = body

    // Validate required fields
    if (!businessName || !email || !phone || !businessType || !monthlyReferrals) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingPartner = await sql`
      SELECT id, status FROM partners WHERE email = ${email}
    ` as { id: string; status: string }[]

    if (existingPartner && existingPartner.length > 0) {
      const partner = existingPartner[0]
      if (partner.status === 'active') {
        return NextResponse.json(
          {
            success: false,
            error: 'already_partner',
            message: 'You are already an approved partner! Log in to access your portal.'
          },
          { status: 409 }
        )
      } else if (partner.status === 'pending') {
        return NextResponse.json(
          {
            success: false,
            error: 'pending_application',
            message: 'Your application is already being reviewed. We\'ll be in touch soon!'
          },
          { status: 409 }
        )
      }
    }

    // Determine instant approval eligibility
    const isApprovedBusinessType = INSTANT_APPROVAL_BUSINESS_TYPES.includes(businessType)
    const hasEnoughReferrals = ['5-10', '10-20', '20+'].includes(monthlyReferrals)
    const hasWebsite = website && website.length > 0

    // Scoring: simple heuristic
    let score = 0
    if (isApprovedBusinessType) score += 40
    if (hasEnoughReferrals) score += 35
    if (hasWebsite) score += 25

    const isInstantApproval = score >= 75 // Need 75+ for instant approval

    // Create partner record
    const newPartner = await sql`
      INSERT INTO partners (
        company_name,
        email,
        phone,
        website_url,
        onboarding_step,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${businessName},
        ${email},
        ${phone},
        ${website || null},
        ${isInstantApproval ? 'sign_agreements' : 'pending_approval'},
        ${isInstantApproval ? 'active' : 'pending'},
        NOW(),
        NOW()
      )
      RETURNING id
    ` as { id: string }[]

    const applicationId = newPartner[0].id

    // Store additional info for admin review
    await sql`
      INSERT INTO partner_email_logs (
        partner_id,
        email_type,
        sent_at,
        metadata
      ) VALUES (
        ${applicationId},
        'application_submitted',
        NOW(),
        ${JSON.stringify({
          businessType,
          monthlyReferrals,
          approvalScore: score,
          instantApproval: isInstantApproval
        })}
      )
    `

    // Send notification emails
    if (isInstantApproval) {
      // Send approval email to partner
      await sendEmail({
        to: email,
        subject: 'Welcome to A Startup Biz Partner Program!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">Congratulations, You're Approved!</h1>
            <p>Hi ${businessName},</p>
            <p>Great news! Your partner application has been <strong>instantly approved</strong>.</p>
            <p>You're now ready to start earning commissions by referring businesses to our services.</p>

            <h2 style="color: #374151;">Next Steps:</h2>
            <ol>
              <li>Complete your onboarding (sign agreements & set up payments)</li>
              <li>Get your personalized referral link</li>
              <li>Start earning 10%+ on every referral!</li>
            </ol>

            <a href="${siteUrl}/partner-portal/onboarding/welcome"
               style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              Complete Your Onboarding
            </a>

            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              Questions? Reply to this email or contact partners@astartupbiz.com
            </p>
          </div>
        `
      })
    } else {
      // Send pending email to partner
      await sendEmail({
        to: email,
        subject: 'Your A Startup Biz Partner Application - Quick Call Needed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">Thanks for Applying!</h1>
            <p>Hi ${businessName},</p>
            <p>We've received your partner application and we'd love to learn more about you!</p>
            <p>To complete your application, please schedule a quick 15-minute call with our partner team.</p>

            <a href="${siteUrl}/get-approved/schedule?id=${applicationId}"
               style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
              Schedule Your Call
            </a>

            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              This is just a quick chat to ensure we're a great fit for each other!
            </p>
          </div>
        `
      })
    }

    // Notify admin
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Partner Application: ${businessName} (${isInstantApproval ? 'APPROVED' : 'CALL NEEDED'})`,
      html: `
        <h2>New Partner Application</h2>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Expected Referrals:</strong> ${monthlyReferrals}/month</p>
        <p><strong>Website:</strong> ${website || 'Not provided'}</p>
        <hr>
        <p><strong>Approval Score:</strong> ${score}/100</p>
        <p><strong>Status:</strong> ${isInstantApproval ? '✅ INSTANTLY APPROVED' : '📞 CALL REQUIRED'}</p>
        <br>
        <a href="${siteUrl}/admin/partners/${applicationId}">View Application →</a>
      `
    })

    const result: ApprovalResult = {
      approved: isInstantApproval,
      reason: isInstantApproval ? 'instant' : 'call_required',
      applicationId,
      message: isInstantApproval
        ? 'Congratulations! You\'ve been instantly approved as a partner.'
        : 'Thanks for applying! Let\'s schedule a quick call to complete your application.',
      calendarLink: isInstantApproval
        ? undefined
        : `/get-approved/schedule?id=${applicationId}`
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error processing instant approval:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process application',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
