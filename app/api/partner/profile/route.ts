import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { getPartnerByUserId, sql } from '@/lib/db-queries'
import type { Partner } from '@/lib/db-queries'

/**
 * Partner profile settings interface
 */
interface PartnerProfile extends Partner {
  payment_email?: string | null
  payment_method?: string | null
  bank_account_last4?: string | null
  tax_id?: string | null
  contact_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  website?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  notifications_enabled?: boolean
  email_notifications?: boolean
  monthly_reports?: boolean
}

/**
 * GET /api/partner/profile
 *
 * Retrieves partner profile information including:
 * - Basic partner details
 * - Payment information
 * - Contact information
 * - Notification preferences
 *
 * @returns {Object} Partner profile data
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    // Get partner record with extended profile data
    const result = await sql`
      SELECT
        p.*,
        pp.payment_email,
        pp.payment_method,
        pp.bank_account_last4,
        pp.tax_id,
        pp.contact_name,
        pp.contact_email,
        pp.contact_phone,
        pp.website,
        pp.address,
        pp.city,
        pp.state,
        pp.zip,
        pp.country,
        pp.notifications_enabled,
        pp.email_notifications,
        pp.monthly_reports
      FROM partners p
      LEFT JOIN partner_profiles pp ON p.id = pp.partner_id
      WHERE p.user_id = ${userId}
      LIMIT 1
    ` as unknown as PartnerProfile[]

    const partner = result[0]

    if (!partner) {
      return NextResponse.json(
        {
          error: 'Partner account not found',
          message: 'No partner account is associated with this user'
        },
        { status: 404 }
      )
    }

    // Return profile data
    return NextResponse.json({
      profile: {
        // Basic information
        id: partner.id,
        userId: partner.user_id,
        companyName: partner.company_name,
        status: partner.status,
        commissionRate: Number(partner.commission_rate),
        rank: partner.rank || 'Bronze',
        memberSince: partner.created_at,

        // Payment information
        paymentEmail: partner.payment_email,
        paymentMethod: partner.payment_method,
        bankAccountLast4: partner.bank_account_last4,
        taxId: partner.tax_id,

        // Contact information
        contactName: partner.contact_name,
        contactEmail: partner.contact_email,
        contactPhone: partner.contact_phone,
        website: partner.website,

        // Address
        address: partner.address,
        city: partner.city,
        state: partner.state,
        zip: partner.zip,
        country: partner.country || 'US',

        // Notification preferences
        notificationsEnabled: partner.notifications_enabled ?? true,
        emailNotifications: partner.email_notifications ?? true,
        monthlyReports: partner.monthly_reports ?? true,
      }
    })
  } catch (error) {
    console.error('Error fetching partner profile:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch partner profile',
        message: 'An unexpected error occurred while loading your profile'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/partner/profile
 *
 * Updates partner profile information
 *
 * Allows updates to:
 * - Payment information
 * - Contact information
 * - Address
 * - Notification preferences
 *
 * @returns {Object} Updated profile data
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      )
    }

    // Get partner record
    const partner = await getPartnerByUserId(userId)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner account not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      paymentEmail,
      paymentMethod,
      bankAccountLast4,
      taxId,
      contactName,
      contactEmail,
      contactPhone,
      website,
      address,
      city,
      state,
      zip,
      country,
      notificationsEnabled,
      emailNotifications,
      monthlyReports,
    } = body

    // Check if partner_profiles record exists, if not create it
    const profileExists = await sql`
      SELECT id FROM partner_profiles WHERE partner_id = ${partner.id}
    ` as unknown as { id: string }[]

    if (profileExists.length === 0) {
      // Create new profile record
      await sql`
        INSERT INTO partner_profiles (
          partner_id,
          payment_email,
          payment_method,
          bank_account_last4,
          tax_id,
          contact_name,
          contact_email,
          contact_phone,
          website,
          address,
          city,
          state,
          zip,
          country,
          notifications_enabled,
          email_notifications,
          monthly_reports
        ) VALUES (
          ${partner.id},
          ${paymentEmail || null},
          ${paymentMethod || null},
          ${bankAccountLast4 || null},
          ${taxId || null},
          ${contactName || null},
          ${contactEmail || null},
          ${contactPhone || null},
          ${website || null},
          ${address || null},
          ${city || null},
          ${state || null},
          ${zip || null},
          ${country || 'US'},
          ${notificationsEnabled ?? true},
          ${emailNotifications ?? true},
          ${monthlyReports ?? true}
        )
      `
    } else {
      // Update existing profile - only update fields that are provided
      const updates: string[] = []
      const values: any[] = []

      if (paymentEmail !== undefined) {
        updates.push('payment_email')
        values.push(paymentEmail)
      }
      if (paymentMethod !== undefined) {
        updates.push('payment_method')
        values.push(paymentMethod)
      }
      if (bankAccountLast4 !== undefined) {
        updates.push('bank_account_last4')
        values.push(bankAccountLast4)
      }
      if (taxId !== undefined) {
        updates.push('tax_id')
        values.push(taxId)
      }
      if (contactName !== undefined) {
        updates.push('contact_name')
        values.push(contactName)
      }
      if (contactEmail !== undefined) {
        updates.push('contact_email')
        values.push(contactEmail)
      }
      if (contactPhone !== undefined) {
        updates.push('contact_phone')
        values.push(contactPhone)
      }
      if (website !== undefined) {
        updates.push('website')
        values.push(website)
      }
      if (address !== undefined) {
        updates.push('address')
        values.push(address)
      }
      if (city !== undefined) {
        updates.push('city')
        values.push(city)
      }
      if (state !== undefined) {
        updates.push('state')
        values.push(state)
      }
      if (zip !== undefined) {
        updates.push('zip')
        values.push(zip)
      }
      if (country !== undefined) {
        updates.push('country')
        values.push(country)
      }
      if (notificationsEnabled !== undefined) {
        updates.push('notifications_enabled')
        values.push(notificationsEnabled)
      }
      if (emailNotifications !== undefined) {
        updates.push('email_notifications')
        values.push(emailNotifications)
      }
      if (monthlyReports !== undefined) {
        updates.push('monthly_reports')
        values.push(monthlyReports)
      }

      if (updates.length > 0) {
        // Build dynamic SQL update statement
        await sql`
          UPDATE partner_profiles
          SET
            payment_email = COALESCE(${paymentEmail}, payment_email),
            payment_method = COALESCE(${paymentMethod}, payment_method),
            bank_account_last4 = COALESCE(${bankAccountLast4}, bank_account_last4),
            tax_id = COALESCE(${taxId}, tax_id),
            contact_name = COALESCE(${contactName}, contact_name),
            contact_email = COALESCE(${contactEmail}, contact_email),
            contact_phone = COALESCE(${contactPhone}, contact_phone),
            website = COALESCE(${website}, website),
            address = COALESCE(${address}, address),
            city = COALESCE(${city}, city),
            state = COALESCE(${state}, state),
            zip = COALESCE(${zip}, zip),
            country = COALESCE(${country}, country),
            notifications_enabled = COALESCE(${notificationsEnabled}, notifications_enabled),
            email_notifications = COALESCE(${emailNotifications}, email_notifications),
            monthly_reports = COALESCE(${monthlyReports}, monthly_reports),
            updated_at = NOW()
          WHERE partner_id = ${partner.id}
        `
      }
    }

    // Fetch updated profile
    const updatedProfile = await sql`
      SELECT
        p.*,
        pp.payment_email,
        pp.payment_method,
        pp.bank_account_last4,
        pp.tax_id,
        pp.contact_name,
        pp.contact_email,
        pp.contact_phone,
        pp.website,
        pp.address,
        pp.city,
        pp.state,
        pp.zip,
        pp.country,
        pp.notifications_enabled,
        pp.email_notifications,
        pp.monthly_reports
      FROM partners p
      LEFT JOIN partner_profiles pp ON p.id = pp.partner_id
      WHERE p.id = ${partner.id}
      LIMIT 1
    ` as unknown as PartnerProfile[]

    const updated = updatedProfile[0]

    return NextResponse.json({
      profile: {
        // Basic information
        id: updated.id,
        userId: updated.user_id,
        companyName: updated.company_name,
        status: updated.status,
        commissionRate: Number(updated.commission_rate),
        rank: updated.rank || 'Bronze',
        memberSince: updated.created_at,

        // Payment information
        paymentEmail: updated.payment_email,
        paymentMethod: updated.payment_method,
        bankAccountLast4: updated.bank_account_last4,
        taxId: updated.tax_id,

        // Contact information
        contactName: updated.contact_name,
        contactEmail: updated.contact_email,
        contactPhone: updated.contact_phone,
        website: updated.website,

        // Address
        address: updated.address,
        city: updated.city,
        state: updated.state,
        zip: updated.zip,
        country: updated.country || 'US',

        // Notification preferences
        notificationsEnabled: updated.notifications_enabled ?? true,
        emailNotifications: updated.email_notifications ?? true,
        monthlyReports: updated.monthly_reports ?? true,
      },
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating partner profile:', error)
    return NextResponse.json(
      {
        error: 'Failed to update partner profile',
        message: 'An unexpected error occurred while updating your profile'
      },
      { status: 500 }
    )
  }
}
