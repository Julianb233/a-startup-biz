import { sql } from '@/lib/db'
import { hashContent } from '@/lib/encryption'
import type {
  Agreement,
  AgreementWithStatus,
  AgreementAcceptance,
  AcceptAgreementInput,
} from './types'

/**
 * Get all active agreements
 */
export async function getActiveAgreements(): Promise<Agreement[]> {
  const result = await sql`
    SELECT * FROM partner_agreements
    WHERE is_active = true
    ORDER BY sort_order ASC, created_at ASC
  `

  return result.map(mapAgreementRow)
}

/**
 * Get all required agreements
 */
export async function getRequiredAgreements(): Promise<Agreement[]> {
  const result = await sql`
    SELECT * FROM partner_agreements
    WHERE is_active = true AND is_required = true
    ORDER BY sort_order ASC
  `

  return result.map(mapAgreementRow)
}

/**
 * Get agreements with signing status for a partner
 */
export async function getAgreementsWithStatus(
  partnerId: string
): Promise<AgreementWithStatus[]> {
  const result = await sql`
    SELECT
      a.*,
      aa.id as acceptance_id,
      aa.accepted_at as signed_at
    FROM partner_agreements a
    LEFT JOIN partner_agreement_acceptances aa
      ON a.id = aa.agreement_id AND aa.partner_id = ${partnerId}
    WHERE a.is_active = true
    ORDER BY a.sort_order ASC
  `

  return result.map((row) => ({
    ...mapAgreementRow(row),
    isSigned: row.acceptance_id !== null,
    signedAt: row.signed_at ? new Date(row.signed_at as string) : null,
    acceptanceId: row.acceptance_id as string | null,
  }))
}

/**
 * Get a specific agreement by ID
 */
export async function getAgreementById(
  agreementId: string
): Promise<Agreement | null> {
  const result = await sql`
    SELECT * FROM partner_agreements
    WHERE id = ${agreementId}
  `

  if (result.length === 0) {
    return null
  }

  return mapAgreementRow(result[0])
}

/**
 * Accept/sign an agreement
 */
export async function acceptAgreement(
  input: AcceptAgreementInput
): Promise<AgreementAcceptance> {
  // Get the agreement to capture version and content hash
  const agreement = await getAgreementById(input.agreementId)
  if (!agreement) {
    throw new Error('Agreement not found')
  }

  const contentHash = hashContent(agreement.content)

  const result = await sql`
    INSERT INTO partner_agreement_acceptances (
      partner_id,
      agreement_id,
      accepted_by_user_id,
      accepted_by_name,
      accepted_by_email,
      ip_address,
      user_agent,
      agreement_version,
      agreement_content_hash,
      signature_text
    ) VALUES (
      ${input.partnerId},
      ${input.agreementId},
      ${input.userId},
      ${input.userName},
      ${input.userEmail},
      ${input.ipAddress}::inet,
      ${input.userAgent},
      ${agreement.version},
      ${contentHash},
      ${input.signatureText}
    )
    ON CONFLICT (partner_id, agreement_id) DO UPDATE
    SET
      accepted_at = NOW(),
      accepted_by_user_id = ${input.userId},
      accepted_by_name = ${input.userName},
      accepted_by_email = ${input.userEmail},
      ip_address = ${input.ipAddress}::inet,
      user_agent = ${input.userAgent},
      agreement_version = ${agreement.version},
      agreement_content_hash = ${contentHash},
      signature_text = ${input.signatureText}
    RETURNING *
  `

  return mapAcceptanceRow(result[0])
}

/**
 * Check if a partner has signed all required agreements
 */
export async function hasSignedAllRequiredAgreements(
  partnerId: string
): Promise<boolean> {
  const result = await sql`
    SELECT
      (SELECT COUNT(*) FROM partner_agreements WHERE is_active = true AND is_required = true) as required_count,
      (SELECT COUNT(*)
       FROM partner_agreement_acceptances aa
       JOIN partner_agreements a ON aa.agreement_id = a.id
       WHERE aa.partner_id = ${partnerId} AND a.is_required = true AND a.is_active = true
      ) as signed_count
  `

  const { required_count, signed_count } = result[0]
  return Number(signed_count) >= Number(required_count)
}

/**
 * Get signing progress for a partner
 */
export async function getSigningProgress(
  partnerId: string
): Promise<{ total: number; signed: number; remaining: number }> {
  const result = await sql`
    SELECT
      (SELECT COUNT(*) FROM partner_agreements WHERE is_active = true AND is_required = true) as total,
      (SELECT COUNT(*)
       FROM partner_agreement_acceptances aa
       JOIN partner_agreements a ON aa.agreement_id = a.id
       WHERE aa.partner_id = ${partnerId} AND a.is_required = true AND a.is_active = true
      ) as signed
  `

  const total = Number(result[0].total)
  const signed = Number(result[0].signed)

  return {
    total,
    signed,
    remaining: total - signed,
  }
}

/**
 * Get all acceptances for a partner
 */
export async function getPartnerAcceptances(
  partnerId: string
): Promise<AgreementAcceptance[]> {
  const result = await sql`
    SELECT * FROM partner_agreement_acceptances
    WHERE partner_id = ${partnerId}
    ORDER BY accepted_at DESC
  `

  return result.map(mapAcceptanceRow)
}

/**
 * Check if a specific agreement is signed by a partner
 */
export async function isAgreementSigned(
  partnerId: string,
  agreementId: string
): Promise<boolean> {
  const result = await sql`
    SELECT id FROM partner_agreement_acceptances
    WHERE partner_id = ${partnerId} AND agreement_id = ${agreementId}
  `

  return result.length > 0
}

/**
 * Map database row to Agreement type
 */
function mapAgreementRow(row: Record<string, unknown>): Agreement {
  return {
    id: row.id as string,
    agreementType: row.agreement_type as Agreement['agreementType'],
    title: row.title as string,
    version: row.version as string,
    content: row.content as string,
    summary: row.summary as string | null,
    isActive: row.is_active as boolean,
    isRequired: row.is_required as boolean,
    sortOrder: row.sort_order as number,
    effectiveDate: new Date(row.effective_date as string),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  }
}

/**
 * Map database row to AgreementAcceptance type
 */
function mapAcceptanceRow(row: Record<string, unknown>): AgreementAcceptance {
  return {
    id: row.id as string,
    partnerId: row.partner_id as string,
    agreementId: row.agreement_id as string,
    acceptedAt: new Date(row.accepted_at as string),
    acceptedByUserId: row.accepted_by_user_id as string | null,
    acceptedByName: row.accepted_by_name as string | null,
    acceptedByEmail: row.accepted_by_email as string | null,
    ipAddress: row.ip_address as string | null,
    userAgent: row.user_agent as string | null,
    agreementVersion: row.agreement_version as string,
    agreementContentHash: row.agreement_content_hash as string | null,
    signatureText: row.signature_text as string,
  }
}
