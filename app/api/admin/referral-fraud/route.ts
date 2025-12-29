/**
 * ADMIN FRAUD REVIEW API ROUTE
 *
 * GET /api/admin/referral-fraud
 *   - Get fraud detection logs and statistics
 *   - Filter by risk score, action, date range
 *
 * POST /api/admin/referral-fraud/confirm
 *   - Mark a pattern as confirmed fraud (blocks future activity)
 *
 * POST /api/admin/referral-fraud/whitelist
 *   - Mark a pattern as false positive (allows future activity)
 */

import { NextRequest, NextResponse } from 'next/server'
import { sql, query } from '@/lib/db'
import { withRateLimit } from '@/lib/rate-limit'
import { requireAdmin, withAuth, getCurrentUserId } from '@/lib/api-auth'

/**
 * GET /api/admin/referral-fraud
 *
 * Query fraud detection logs with filtering
 *
 * Query params:
 *   - action: Filter by action (allow, monitor, review, block)
 *   - minRiskScore: Minimum risk score (0-100)
 *   - startDate: Start date for filtering
 *   - endDate: End date for filtering
 *   - limit: Number of results (default 50, max 500)
 *   - offset: Pagination offset
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const minRiskScore = searchParams.get('minRiskScore')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '50'),
      500
    )
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build dynamic query
    const conditions: string[] = ['1=1']
    const params: any[] = []

    if (action) {
      params.push(action)
      conditions.push(`action = $${params.length}`)
    }

    if (minRiskScore) {
      params.push(parseInt(minRiskScore))
      conditions.push(`risk_score >= $${params.length}`)
    }

    if (startDate) {
      params.push(startDate)
      conditions.push(`created_at >= $${params.length}`)
    }

    if (endDate) {
      params.push(endDate)
      conditions.push(`created_at <= $${params.length}`)
    }

    // Get fraud logs with safe parameterized query
    // Build query dynamically but safely without sql.unsafe()
    let logs

    if (action && minRiskScore && startDate && endDate) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE action = ${action} AND risk_score >= ${parseInt(minRiskScore)} AND created_at >= ${startDate} AND created_at <= ${endDate}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (action && minRiskScore && startDate) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE action = ${action} AND risk_score >= ${parseInt(minRiskScore)} AND created_at >= ${startDate}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (action && minRiskScore) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE action = ${action} AND risk_score >= ${parseInt(minRiskScore)}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (action && startDate && endDate) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE action = ${action} AND created_at >= ${startDate} AND created_at <= ${endDate}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (minRiskScore && startDate && endDate) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE risk_score >= ${parseInt(minRiskScore)} AND created_at >= ${startDate} AND created_at <= ${endDate}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (action) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE action = ${action}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (minRiskScore) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE risk_score >= ${parseInt(minRiskScore)}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (startDate && endDate) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE created_at >= ${startDate} AND created_at <= ${endDate}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (startDate) {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        WHERE created_at >= ${startDate}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      logs = await sql`
        SELECT id, referral_code, risk_score, action, referred_email, ip_address, user_agent, signals, metadata, created_at
        FROM referral_fraud_logs
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Get summary statistics
    const stats = await sql`
      SELECT
        COUNT(*) as total_logs,
        COUNT(*) FILTER (WHERE action = 'allow') as allowed,
        COUNT(*) FILTER (WHERE action = 'monitor') as monitored,
        COUNT(*) FILTER (WHERE action = 'review') as flagged_review,
        COUNT(*) FILTER (WHERE action = 'block') as blocked,
        AVG(risk_score) as avg_risk_score,
        MAX(risk_score) as max_risk_score,
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(DISTINCT referred_email) as unique_emails
      FROM referral_fraud_logs
      WHERE created_at > NOW() - INTERVAL '30 days'
    `

    // Get top fraud patterns
    const patterns = await sql`
      SELECT
        pattern_type,
        pattern_value,
        times_detected,
        is_blocked,
        confirmed_fraud,
        last_detected_at
      FROM referral_fraud_patterns
      ORDER BY times_detected DESC
      LIMIT 20
    `

    return NextResponse.json({
      success: true,
      data: {
        logs,
        stats: stats[0],
        patterns,
        pagination: {
          limit,
          offset,
          hasMore: logs.length === limit,
        },
      },
    })
  })
}

/**
 * POST /api/admin/referral-fraud/action
 *
 * Take action on a fraud pattern (confirm fraud or whitelist)
 *
 * Body:
 *   - patternType: Type of pattern (ip_abuse, email_pattern, etc.)
 *   - patternValue: Value of pattern (IP address, email domain, etc.)
 *   - action: 'confirm_fraud' or 'whitelist'
 *   - notes: Admin notes
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    // Require admin role - throws 401/403 if not authorized
    await requireAdmin()
    const userId = await getCurrentUserId()

    // Rate limiting (use 'api' type for admin routes)
    const rateLimitResponse = await withRateLimit(request, 'api')
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Parse request body
    const body = await request.json()
    const { patternType, patternValue, action, notes } = body

    // Validate required fields
    if (!patternType || !patternValue || !action) {
      return NextResponse.json(
        {
          success: false,
          message: 'patternType, patternValue, and action are required',
        },
        { status: 400 }
      )
    }

    // Validate action
    if (!['confirm_fraud', 'whitelist'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: 'action must be "confirm_fraud" or "whitelist"',
        },
        { status: 400 }
      )
    }

    if (action === 'confirm_fraud') {
      // Mark as confirmed fraud and block
      await sql`
        INSERT INTO referral_fraud_patterns (
          pattern_type,
          pattern_value,
          confirmed_fraud,
          manual_review_notes,
          is_blocked,
          blocked_at,
          blocked_by
        ) VALUES (
          ${patternType},
          ${patternValue},
          TRUE,
          ${notes || null},
          TRUE,
          NOW(),
          ${userId}
        )
        ON CONFLICT (pattern_type, pattern_value)
        DO UPDATE SET
          confirmed_fraud = TRUE,
          manual_review_notes = ${notes || null},
          is_blocked = TRUE,
          blocked_at = NOW(),
          blocked_by = ${userId},
          updated_at = NOW()
      `

      // Invalidate all referrals matching this pattern
      if (patternType === 'ip_abuse') {
        await sql`
          UPDATE referrals
          SET
            status = 'invalid',
            notes = COALESCE(notes || E'\n', '') || 'Blocked due to confirmed fraud pattern: IP ' || ${patternValue}
          WHERE ip_address = ${patternValue}
            AND status NOT IN ('paid_out', 'invalid')
        `
      } else if (patternType === 'email_pattern' || patternType === 'suspicious_domain') {
        await sql`
          UPDATE referrals
          SET
            status = 'invalid',
            notes = COALESCE(notes || E'\n', '') || 'Blocked due to confirmed fraud pattern: Email domain ' || ${patternValue}
          WHERE referred_email LIKE '%@' || ${patternValue}
            AND status NOT IN ('paid_out', 'invalid')
        `
      }

      return NextResponse.json({
        success: true,
        message: `Pattern confirmed as fraud and blocked: ${patternType}:${patternValue}`,
      })
    } else {
      // Mark as false positive (whitelist)
      await sql`
        INSERT INTO referral_fraud_patterns (
          pattern_type,
          pattern_value,
          confirmed_fraud,
          manual_review_notes,
          is_blocked
        ) VALUES (
          ${patternType},
          ${patternValue},
          FALSE,
          ${notes || null},
          FALSE
        )
        ON CONFLICT (pattern_type, pattern_value)
        DO UPDATE SET
          confirmed_fraud = FALSE,
          manual_review_notes = ${notes || null},
          is_blocked = FALSE,
          updated_at = NOW()
      `

      return NextResponse.json({
        success: true,
        message: `Pattern whitelisted as false positive: ${patternType}:${patternValue}`,
      })
    }
  })
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}
