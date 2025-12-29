import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, withAuth } from '@/lib/api-auth'
import { sql } from '@/lib/db'

interface NotificationPreferences {
  id: string
  user_id: string
  in_app_lead_converted: boolean
  in_app_lead_qualified: boolean
  in_app_payout_completed: boolean
  in_app_payout_failed: boolean
  in_app_account_updates: boolean
  email_lead_converted: boolean
  email_lead_qualified: boolean
  email_payout_completed: boolean
  email_payout_failed: boolean
  email_account_updates: boolean
  email_weekly_digest: boolean
  digest_day: string
  notifications_enabled: boolean
  email_enabled: boolean
}

/**
 * GET /api/notifications/preferences
 * Get current user's notification preferences
 */
export async function GET() {
  return withAuth(async () => {
    const userId = await requireAuth()

    // Get user's internal ID from clerk ID
    const users = await sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    ` as unknown as { id: string }[]

    if (!users.length) {
      // Try email lookup as fallback
      return NextResponse.json({
        success: true,
        preferences: getDefaultPreferences(),
        isDefault: true
      })
    }

    const internalUserId = users[0].id

    // Get preferences or create default
    let prefs = await sql`
      SELECT * FROM notification_preferences WHERE user_id = ${internalUserId}
    ` as unknown as NotificationPreferences[]

    if (!prefs.length) {
      // Create default preferences
      prefs = await sql`
        INSERT INTO notification_preferences (user_id)
        VALUES (${internalUserId})
        RETURNING *
      ` as unknown as NotificationPreferences[]
    }

    return NextResponse.json({
      success: true,
      preferences: prefs[0]
    })
  })
}

/**
 * PATCH /api/notifications/preferences
 * Update notification preferences
 */
export async function PATCH(request: NextRequest) {
  return withAuth(async () => {
    const userId = await requireAuth()
    const body = await request.json()

    // Get user's internal ID
    const users = await sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    ` as unknown as { id: string }[]

    if (!users.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const internalUserId = users[0].id

    // Build update query dynamically based on provided fields
    const allowedFields = [
      'in_app_lead_converted',
      'in_app_lead_qualified',
      'in_app_payout_completed',
      'in_app_payout_failed',
      'in_app_account_updates',
      'email_lead_converted',
      'email_lead_qualified',
      'email_payout_completed',
      'email_payout_failed',
      'email_account_updates',
      'email_weekly_digest',
      'digest_day',
      'notifications_enabled',
      'email_enabled'
    ]

    // Filter to only allowed fields
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Upsert preferences
    const prefs = await sql`
      INSERT INTO notification_preferences (
        user_id,
        in_app_lead_converted,
        in_app_lead_qualified,
        in_app_payout_completed,
        in_app_payout_failed,
        in_app_account_updates,
        email_lead_converted,
        email_lead_qualified,
        email_payout_completed,
        email_payout_failed,
        email_account_updates,
        email_weekly_digest,
        digest_day,
        notifications_enabled,
        email_enabled,
        updated_at
      )
      VALUES (
        ${internalUserId},
        ${updates.in_app_lead_converted ?? true},
        ${updates.in_app_lead_qualified ?? true},
        ${updates.in_app_payout_completed ?? true},
        ${updates.in_app_payout_failed ?? true},
        ${updates.in_app_account_updates ?? true},
        ${updates.email_lead_converted ?? true},
        ${updates.email_lead_qualified ?? false},
        ${updates.email_payout_completed ?? true},
        ${updates.email_payout_failed ?? true},
        ${updates.email_account_updates ?? true},
        ${updates.email_weekly_digest ?? true},
        ${updates.digest_day ?? 'monday'},
        ${updates.notifications_enabled ?? true},
        ${updates.email_enabled ?? true},
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        in_app_lead_converted = COALESCE(${updates.in_app_lead_converted ?? null}, notification_preferences.in_app_lead_converted),
        in_app_lead_qualified = COALESCE(${updates.in_app_lead_qualified ?? null}, notification_preferences.in_app_lead_qualified),
        in_app_payout_completed = COALESCE(${updates.in_app_payout_completed ?? null}, notification_preferences.in_app_payout_completed),
        in_app_payout_failed = COALESCE(${updates.in_app_payout_failed ?? null}, notification_preferences.in_app_payout_failed),
        in_app_account_updates = COALESCE(${updates.in_app_account_updates ?? null}, notification_preferences.in_app_account_updates),
        email_lead_converted = COALESCE(${updates.email_lead_converted ?? null}, notification_preferences.email_lead_converted),
        email_lead_qualified = COALESCE(${updates.email_lead_qualified ?? null}, notification_preferences.email_lead_qualified),
        email_payout_completed = COALESCE(${updates.email_payout_completed ?? null}, notification_preferences.email_payout_completed),
        email_payout_failed = COALESCE(${updates.email_payout_failed ?? null}, notification_preferences.email_payout_failed),
        email_account_updates = COALESCE(${updates.email_account_updates ?? null}, notification_preferences.email_account_updates),
        email_weekly_digest = COALESCE(${updates.email_weekly_digest ?? null}, notification_preferences.email_weekly_digest),
        digest_day = COALESCE(${updates.digest_day ?? null}, notification_preferences.digest_day),
        notifications_enabled = COALESCE(${updates.notifications_enabled ?? null}, notification_preferences.notifications_enabled),
        email_enabled = COALESCE(${updates.email_enabled ?? null}, notification_preferences.email_enabled),
        updated_at = NOW()
      RETURNING *
    ` as unknown as NotificationPreferences[]

    return NextResponse.json({
      success: true,
      preferences: prefs[0]
    })
  })
}

function getDefaultPreferences() {
  return {
    in_app_lead_converted: true,
    in_app_lead_qualified: true,
    in_app_payout_completed: true,
    in_app_payout_failed: true,
    in_app_account_updates: true,
    email_lead_converted: true,
    email_lead_qualified: false,
    email_payout_completed: true,
    email_payout_failed: true,
    email_account_updates: true,
    email_weekly_digest: true,
    digest_day: 'monday',
    notifications_enabled: true,
    email_enabled: true
  }
}
