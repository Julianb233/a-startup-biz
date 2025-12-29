import { sql } from '@/lib/db'
import { createMicrosite, getMicrositeUrl } from './microsite-generator'
import { scrapeWebsite } from './scraper-service'
import { sendPartnerWelcomeEmail } from '@/lib/partner-emails'
import type { ApprovalOptions, ApprovalResult, OnboardingStatus } from './types'

/**
 * Approve a partner application
 * This triggers the full onboarding workflow:
 * 1. Update partner status to active
 * 2. Scrape their website (if URL provided)
 * 3. Create their microsite
 * 4. Send welcome email with links
 */
export async function approvePartner(
  partnerId: string,
  adminUserId: string,
  options: ApprovalOptions = {}
): Promise<ApprovalResult> {
  // Get partner details
  const partnerResult = await sql`
    SELECT * FROM partners WHERE id = ${partnerId}
  `

  if (partnerResult.length === 0) {
    throw new Error('Partner not found')
  }

  const partner = partnerResult[0]

  if (partner.status === 'active') {
    return {
      success: false,
      partner: {
        id: partner.id as string,
        companyName: partner.company_name as string,
        status: 'active',
      },
      emailSent: false,
      message: 'Partner is already approved',
    }
  }

  // Update partner status
  await sql`
    UPDATE partners
    SET
      status = 'active',
      approved_at = NOW(),
      approved_by = ${adminUserId},
      onboarding_step = 'sign_agreements',
      commission_rate = COALESCE(${options.commissionRate}, commission_rate),
      website_url = COALESCE(${options.websiteUrl}, website_url),
      updated_at = NOW()
    WHERE id = ${partnerId}
  `

  let micrositeData = null

  // Create microsite unless skipped
  if (!options.skipMicrosite) {
    try {
      const websiteUrl = options.websiteUrl || (partner.website_url as string)

      const microsite = await createMicrosite({
        partnerId,
        companyName: partner.company_name as string,
        slug: options.customSlug,
        websiteUrl,
      })

      // Link microsite to partner
      await sql`
        UPDATE partners
        SET microsite_id = ${microsite.id}
        WHERE id = ${partnerId}
      `

      micrositeData = {
        id: microsite.id,
        slug: microsite.slug,
        url: getMicrositeUrl(microsite.slug),
      }
    } catch (error) {
      console.error('Error creating microsite:', error)
      // Continue without microsite - can be created later
    }
  }

  // Send welcome email
  let emailSent = false
  try {
    const partnerEmail =
      (partner.contact_email as string) || (partner.email as string)

    if (partnerEmail) {
      await sendPartnerWelcomeEmail({
        partnerId,
        partnerName: partner.company_name as string,
        partnerEmail,
        micrositeUrl: micrositeData?.url || null,
        portalUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/partner-portal/dashboard`,
        agreementsUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/partner-portal/onboarding/agreements`,
      })
      emailSent = true

      // Log email sent
      await sql`
        UPDATE partners
        SET
          welcome_email_sent = true,
          welcome_email_sent_at = NOW()
        WHERE id = ${partnerId}
      `
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Continue - email can be resent later
  }

  return {
    success: true,
    partner: {
      id: partnerId,
      companyName: partner.company_name as string,
      status: 'active',
    },
    microsite: micrositeData || undefined,
    emailSent,
    message: micrositeData
      ? 'Partner approved and microsite created'
      : 'Partner approved (microsite creation skipped or failed)',
  }
}

/**
 * Check if a partner can be approved
 */
export async function canApprovePartner(
  partnerId: string
): Promise<{ canApprove: boolean; reason?: string }> {
  const result = await sql`
    SELECT status, company_name, contact_email, email
    FROM partners
    WHERE id = ${partnerId}
  `

  if (result.length === 0) {
    return { canApprove: false, reason: 'Partner not found' }
  }

  const partner = result[0]

  if (partner.status === 'active') {
    return { canApprove: false, reason: 'Partner is already active' }
  }

  if (partner.status === 'suspended') {
    return { canApprove: false, reason: 'Partner is suspended' }
  }

  if (!partner.company_name) {
    return { canApprove: false, reason: 'Partner has no company name' }
  }

  if (!partner.contact_email && !partner.email) {
    return { canApprove: false, reason: 'Partner has no email address' }
  }

  return { canApprove: true }
}

/**
 * Get onboarding status for a partner
 */
export async function getOnboardingStatus(
  partnerId: string
): Promise<OnboardingStatus> {
  const result = await sql`
    SELECT
      p.status,
      p.approved_at,
      p.microsite_id,
      p.agreements_completed,
      p.agreements_completed_at,
      p.payment_details_submitted,
      p.onboarding_step,
      m.slug as microsite_slug,
      (SELECT COUNT(*) FROM partner_agreements WHERE is_active = true AND is_required = true) as agreements_total,
      (SELECT COUNT(*)
       FROM partner_agreement_acceptances aa
       JOIN partner_agreements a ON aa.agreement_id = a.id
       WHERE aa.partner_id = ${partnerId} AND a.is_required = true AND a.is_active = true
      ) as agreements_signed
    FROM partners p
    LEFT JOIN partner_microsites m ON p.microsite_id = m.id
    WHERE p.id = ${partnerId}
  `

  if (result.length === 0) {
    throw new Error('Partner not found')
  }

  const row = result[0]
  const agreementsTotal = Number(row.agreements_total)
  const agreementsSigned = Number(row.agreements_signed)

  return {
    step: (row.onboarding_step as OnboardingStatus['step']) || 'pending_approval',
    isApproved: row.status === 'active',
    approvedAt: row.approved_at ? new Date(row.approved_at as string) : null,
    hasMicrosite: row.microsite_id !== null,
    micrositeUrl: row.microsite_slug
      ? getMicrositeUrl(row.microsite_slug as string)
      : null,
    agreementsTotal,
    agreementsSigned,
    agreementsCompleted: row.agreements_completed as boolean,
    agreementsCompletedAt: row.agreements_completed_at
      ? new Date(row.agreements_completed_at as string)
      : null,
    paymentDetailsSubmitted: row.payment_details_submitted as boolean,
    isFullyOnboarded:
      row.status === 'active' &&
      row.agreements_completed === true &&
      row.payment_details_submitted === true,
  }
}

/**
 * Update partner onboarding step
 */
export async function updateOnboardingStep(
  partnerId: string,
  step: OnboardingStatus['step']
): Promise<void> {
  await sql`
    UPDATE partners
    SET
      onboarding_step = ${step},
      updated_at = NOW()
    WHERE id = ${partnerId}
  `
}

/**
 * Get pending partner applications
 */
export async function getPendingPartners(): Promise<
  Array<{
    id: string
    companyName: string
    email: string
    websiteUrl: string | null
    createdAt: Date
  }>
> {
  const result = await sql`
    SELECT
      id,
      company_name,
      COALESCE(contact_email, email) as email,
      website_url,
      created_at
    FROM partners
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `

  return result.map((row) => ({
    id: row.id as string,
    companyName: row.company_name as string,
    email: row.email as string,
    websiteUrl: row.website_url as string | null,
    createdAt: new Date(row.created_at as string),
  }))
}

/**
 * Resend welcome email to a partner
 */
export async function resendWelcomeEmail(partnerId: string): Promise<boolean> {
  const result = await sql`
    SELECT
      p.company_name,
      COALESCE(p.contact_email, p.email) as email,
      m.slug as microsite_slug
    FROM partners p
    LEFT JOIN partner_microsites m ON p.microsite_id = m.id
    WHERE p.id = ${partnerId} AND p.status = 'active'
  `

  if (result.length === 0) {
    return false
  }

  const partner = result[0]

  try {
    await sendPartnerWelcomeEmail({
      partnerId,
      partnerName: partner.company_name as string,
      partnerEmail: partner.email as string,
      micrositeUrl: partner.microsite_slug
        ? getMicrositeUrl(partner.microsite_slug as string)
        : null,
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/partner-portal/dashboard`,
      agreementsUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/partner-portal/onboarding/agreements`,
    })

    await sql`
      UPDATE partners
      SET
        welcome_email_sent = true,
        welcome_email_sent_at = NOW()
      WHERE id = ${partnerId}
    `

    return true
  } catch (error) {
    console.error('Error resending welcome email:', error)
    return false
  }
}
