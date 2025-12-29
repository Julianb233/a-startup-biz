/**
 * REFERRAL FRAUD DETECTION SYSTEM
 *
 * Implements multiple fraud detection patterns to flag suspicious activity
 * without blocking legitimate users. All signals are logged for manual review.
 *
 * Detection Patterns:
 * 1. IP Address Abuse - Same IP creating multiple codes/conversions
 * 2. Self-Referral - Referrer and referee are the same person
 * 3. Velocity Checks - Too many conversions too fast
 * 4. Email Pattern Detection - Suspicious email domain patterns
 * 5. User Agent Anomalies - Bot-like behavior
 * 6. Conversion Time Anomalies - Unrealistic conversion timing
 */

import { sql, query } from './db'
import type { Referral } from './types/referral'

/**
 * Fraud detection result with severity levels
 */
export interface FraudDetectionResult {
  isSuspicious: boolean
  riskScore: number // 0-100, higher is more suspicious
  signals: FraudSignal[]
  action: FraudAction
  metadata: Record<string, any>
}

/**
 * Individual fraud signal detected
 */
export interface FraudSignal {
  type: FraudSignalType
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  details: Record<string, any>
  timestamp: Date
}

/**
 * Types of fraud signals we detect
 */
export type FraudSignalType =
  | 'ip_abuse'
  | 'self_referral'
  | 'velocity_abuse'
  | 'email_pattern'
  | 'user_agent_anomaly'
  | 'conversion_timing'
  | 'duplicate_conversion'
  | 'suspicious_domain'
  | 'rapid_signup'

/**
 * Recommended action based on risk score
 */
export type FraudAction =
  | 'allow' // 0-30: Normal activity
  | 'monitor' // 31-60: Slightly suspicious, allow but watch
  | 'review' // 61-80: Suspicious, flag for manual review
  | 'block' // 81-100: Highly suspicious, block and review

/**
 * Fraud detection configuration
 */
export interface FraudConfig {
  // IP abuse thresholds
  maxCodesPerIpPerDay: number
  maxConversionsPerIpPerDay: number
  maxSignupsPerIpPerHour: number

  // Velocity thresholds
  maxConversionsPerHour: number
  maxConversionsPerDay: number
  minConversionTimeMinutes: number // Minimum time from signup to conversion

  // Email pattern detection
  suspiciousDomains: string[] // Disposable email domains
  maxSimilarEmails: number // Max similar emails from same referrer

  // Risk scoring weights
  weights: {
    ipAbuse: number
    selfReferral: number
    velocityAbuse: number
    emailPattern: number
    userAgentAnomaly: number
    conversionTiming: number
  }
}

/**
 * Default fraud detection configuration
 */
export const DEFAULT_FRAUD_CONFIG: FraudConfig = {
  maxCodesPerIpPerDay: 5,
  maxConversionsPerIpPerDay: 3,
  maxSignupsPerIpPerHour: 10,

  maxConversionsPerHour: 5,
  maxConversionsPerDay: 20,
  minConversionTimeMinutes: 5, // At least 5 minutes from signup to purchase

  suspiciousDomains: [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'throwaway.email',
    'mailinator.com',
    'trashmail.com',
  ],
  maxSimilarEmails: 3,

  weights: {
    ipAbuse: 30,
    selfReferral: 40,
    velocityAbuse: 25,
    emailPattern: 20,
    userAgentAnomaly: 15,
    conversionTiming: 20,
  },
}

/**
 * Main fraud detection function - checks all patterns
 */
export async function detectFraud(
  referralCode: string,
  referredEmail: string,
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrerId?: string
    referredUserId?: string
    purchaseValue?: number
  } = {},
  config: FraudConfig = DEFAULT_FRAUD_CONFIG
): Promise<FraudDetectionResult> {
  const signals: FraudSignal[] = []
  let riskScore = 0

  // 1. Check for self-referral
  const selfReferralSignal = await checkSelfReferral(
    referralCode,
    referredEmail,
    metadata.referredUserId
  )
  if (selfReferralSignal) {
    signals.push(selfReferralSignal)
    riskScore += config.weights.selfReferral
  }

  // 2. Check IP abuse patterns
  if (metadata.ipAddress) {
    const ipSignals = await checkIPAbuse(
      metadata.ipAddress,
      referralCode,
      config
    )
    signals.push(...ipSignals)
    riskScore += ipSignals.length * config.weights.ipAbuse
  }

  // 3. Check velocity abuse
  const velocitySignals = await checkVelocityAbuse(referralCode, config)
  signals.push(...velocitySignals)
  riskScore += velocitySignals.length * config.weights.velocityAbuse

  // 4. Check email patterns
  const emailSignals = await checkEmailPatterns(
    referralCode,
    referredEmail,
    config
  )
  signals.push(...emailSignals)
  riskScore += emailSignals.length * config.weights.emailPattern

  // 5. Check user agent anomalies
  if (metadata.userAgent) {
    const userAgentSignal = checkUserAgentAnomaly(metadata.userAgent)
    if (userAgentSignal) {
      signals.push(userAgentSignal)
      riskScore += config.weights.userAgentAnomaly
    }
  }

  // 6. Check conversion timing (if this is a conversion)
  if (metadata.purchaseValue) {
    const timingSignal = await checkConversionTiming(
      referredEmail,
      config
    )
    if (timingSignal) {
      signals.push(timingSignal)
      riskScore += config.weights.conversionTiming
    }
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100)

  // Determine action based on risk score
  let action: FraudAction
  if (riskScore <= 30) {
    action = 'allow'
  } else if (riskScore <= 60) {
    action = 'monitor'
  } else if (riskScore <= 80) {
    action = 'review'
  } else {
    action = 'block'
  }

  const result: FraudDetectionResult = {
    isSuspicious: signals.length > 0,
    riskScore,
    signals,
    action,
    metadata: {
      referralCode,
      referredEmail,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      checksPerformed: 6,
      timestamp: new Date(),
    },
  }

  // Log fraud detection result
  await logFraudDetection(result)

  return result
}

/**
 * Check if referrer is trying to refer themselves
 */
async function checkSelfReferral(
  referralCode: string,
  referredEmail: string,
  referredUserId?: string
): Promise<FraudSignal | null> {
  try {
    // Get referrer info
    const referrer = await sql`
      SELECT referrer_id, referrer_email
      FROM referrals
      WHERE referral_code = ${referralCode}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (referrer.length === 0) return null

    const { referrer_id, referrer_email } = referrer[0]

    // Check email match (case-insensitive)
    const normalizedReferredEmail = referredEmail.toLowerCase().trim()
    const normalizedReferrerEmail = referrer_email.toLowerCase().trim()

    if (normalizedReferredEmail === normalizedReferrerEmail) {
      return {
        type: 'self_referral',
        severity: 'critical',
        description: 'Referrer and referee have the same email address',
        details: {
          referrerEmail: referrer_email,
          referredEmail: referredEmail,
        },
        timestamp: new Date(),
      }
    }

    // Check user ID match (if provided)
    if (referredUserId && referredUserId === referrer_id) {
      return {
        type: 'self_referral',
        severity: 'critical',
        description: 'Referrer and referee have the same user ID',
        details: {
          referrerId: referrer_id,
          referredUserId: referredUserId,
        },
        timestamp: new Date(),
      }
    }

    return null
  } catch (error) {
    console.error('Error in checkSelfReferral:', error)
    return null
  }
}

/**
 * Check for IP address abuse patterns
 */
async function checkIPAbuse(
  ipAddress: string,
  referralCode: string,
  config: FraudConfig
): Promise<FraudSignal[]> {
  const signals: FraudSignal[] = []

  try {
    // Check codes created from this IP in last 24 hours
    const codesFromIP = await sql`
      SELECT COUNT(DISTINCT referral_code) as count
      FROM referrals
      WHERE ip_address = ${ipAddress}
      AND created_at > NOW() - INTERVAL '24 hours'
    `

    if (codesFromIP[0].count > config.maxCodesPerIpPerDay) {
      signals.push({
        type: 'ip_abuse',
        severity: 'high',
        description: `${codesFromIP[0].count} referral codes created from same IP in 24 hours`,
        details: {
          ipAddress,
          codeCount: codesFromIP[0].count,
          threshold: config.maxCodesPerIpPerDay,
        },
        timestamp: new Date(),
      })
    }

    // Check conversions from this IP in last 24 hours
    const conversionsFromIP = await sql`
      SELECT COUNT(*) as count
      FROM referrals
      WHERE ip_address = ${ipAddress}
      AND status = 'converted'
      AND conversion_date > NOW() - INTERVAL '24 hours'
    `

    if (conversionsFromIP[0].count > config.maxConversionsPerIpPerDay) {
      signals.push({
        type: 'ip_abuse',
        severity: 'critical',
        description: `${conversionsFromIP[0].count} conversions from same IP in 24 hours`,
        details: {
          ipAddress,
          conversionCount: conversionsFromIP[0].count,
          threshold: config.maxConversionsPerIpPerDay,
        },
        timestamp: new Date(),
      })
    }

    // Check signups from this IP in last hour
    const signupsFromIP = await sql`
      SELECT COUNT(*) as count
      FROM referrals
      WHERE ip_address = ${ipAddress}
      AND status IN ('signed_up', 'converted')
      AND signup_date > NOW() - INTERVAL '1 hour'
    `

    if (signupsFromIP[0].count > config.maxSignupsPerIpPerHour) {
      signals.push({
        type: 'rapid_signup',
        severity: 'high',
        description: `${signupsFromIP[0].count} signups from same IP in 1 hour`,
        details: {
          ipAddress,
          signupCount: signupsFromIP[0].count,
          threshold: config.maxSignupsPerIpPerHour,
        },
        timestamp: new Date(),
      })
    }
  } catch (error) {
    console.error('Error in checkIPAbuse:', error)
  }

  return signals
}

/**
 * Check for velocity abuse (too many conversions too fast)
 */
async function checkVelocityAbuse(
  referralCode: string,
  config: FraudConfig
): Promise<FraudSignal[]> {
  const signals: FraudSignal[] = []

  try {
    // Get referrer ID
    const referrer = await sql`
      SELECT referrer_id
      FROM referrals
      WHERE referral_code = ${referralCode}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (referrer.length === 0) return signals

    const referrerId = referrer[0].referrer_id

    // Check conversions in last hour
    const conversionsLastHour = await sql`
      SELECT COUNT(*) as count
      FROM referrals
      WHERE referrer_id = ${referrerId}
      AND status = 'converted'
      AND conversion_date > NOW() - INTERVAL '1 hour'
    `

    if (conversionsLastHour[0].count > config.maxConversionsPerHour) {
      signals.push({
        type: 'velocity_abuse',
        severity: 'critical',
        description: `${conversionsLastHour[0].count} conversions in 1 hour`,
        details: {
          referrerId,
          conversionCount: conversionsLastHour[0].count,
          threshold: config.maxConversionsPerHour,
          timeWindow: '1 hour',
        },
        timestamp: new Date(),
      })
    }

    // Check conversions in last 24 hours
    const conversionsLastDay = await sql`
      SELECT COUNT(*) as count
      FROM referrals
      WHERE referrer_id = ${referrerId}
      AND status = 'converted'
      AND conversion_date > NOW() - INTERVAL '24 hours'
    `

    if (conversionsLastDay[0].count > config.maxConversionsPerDay) {
      signals.push({
        type: 'velocity_abuse',
        severity: 'high',
        description: `${conversionsLastDay[0].count} conversions in 24 hours`,
        details: {
          referrerId,
          conversionCount: conversionsLastDay[0].count,
          threshold: config.maxConversionsPerDay,
          timeWindow: '24 hours',
        },
        timestamp: new Date(),
      })
    }
  } catch (error) {
    console.error('Error in checkVelocityAbuse:', error)
  }

  return signals
}

/**
 * Check for suspicious email patterns
 */
async function checkEmailPatterns(
  referralCode: string,
  referredEmail: string,
  config: FraudConfig
): Promise<FraudSignal[]> {
  const signals: FraudSignal[] = []

  try {
    // Check for disposable email domains
    const emailDomain = referredEmail.split('@')[1]?.toLowerCase()
    if (emailDomain && config.suspiciousDomains.includes(emailDomain)) {
      signals.push({
        type: 'suspicious_domain',
        severity: 'medium',
        description: `Email uses disposable domain: ${emailDomain}`,
        details: {
          email: referredEmail,
          domain: emailDomain,
        },
        timestamp: new Date(),
      })
    }

    // Check for similar email patterns from same referrer
    const referrer = await sql`
      SELECT referrer_id
      FROM referrals
      WHERE referral_code = ${referralCode}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (referrer.length > 0) {
      const referrerId = referrer[0].referrer_id

      // Get all referred emails from this referrer
      const allReferredEmails = await sql`
        SELECT referred_email
        FROM referrals
        WHERE referrer_id = ${referrerId}
        AND referred_email != ''
      `

      // Check for similar email patterns (same local part before @)
      const localPart = referredEmail.split('@')[0]?.toLowerCase()
      const similarEmails = allReferredEmails.filter((row: any) => {
        const otherLocalPart = row.referred_email.split('@')[0]?.toLowerCase()
        return otherLocalPart && isSimilarString(localPart, otherLocalPart, 0.8)
      })

      if (similarEmails.length >= config.maxSimilarEmails) {
        signals.push({
          type: 'email_pattern',
          severity: 'medium',
          description: `${similarEmails.length} similar email patterns detected`,
          details: {
            referrerId,
            similarEmailCount: similarEmails.length,
            threshold: config.maxSimilarEmails,
            exampleEmails: similarEmails.slice(0, 3).map((e: any) => e.referred_email),
          },
          timestamp: new Date(),
        })
      }
    }
  } catch (error) {
    console.error('Error in checkEmailPatterns:', error)
  }

  return signals
}

/**
 * Check for user agent anomalies (bot-like behavior)
 */
function checkUserAgentAnomaly(userAgent: string): FraudSignal | null {
  // Check for missing user agent
  if (!userAgent || userAgent === 'unknown' || userAgent.length < 10) {
    return {
      type: 'user_agent_anomaly',
      severity: 'low',
      description: 'Missing or invalid user agent',
      details: {
        userAgent,
      },
      timestamp: new Date(),
    }
  }

  // Check for bot indicators
  const botIndicators = [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
    'python-requests',
    'headless',
  ]

  const lowerUA = userAgent.toLowerCase()
  const foundIndicators = botIndicators.filter((indicator) =>
    lowerUA.includes(indicator)
  )

  if (foundIndicators.length > 0) {
    return {
      type: 'user_agent_anomaly',
      severity: 'medium',
      description: `Bot-like user agent detected: ${foundIndicators.join(', ')}`,
      details: {
        userAgent,
        indicators: foundIndicators,
      },
      timestamp: new Date(),
    }
  }

  return null
}

/**
 * Check conversion timing (unrealistic timing from signup to purchase)
 */
async function checkConversionTiming(
  referredEmail: string,
  config: FraudConfig
): Promise<FraudSignal | null> {
  try {
    // Find the signup record for this email
    const signup = await sql`
      SELECT signup_date
      FROM referrals
      WHERE referred_email = ${referredEmail}
      AND signup_date IS NOT NULL
      ORDER BY signup_date DESC
      LIMIT 1
    `

    if (signup.length === 0 || !signup[0].signup_date) {
      return null
    }

    const signupDate = new Date(signup[0].signup_date)
    const now = new Date()
    const minutesSinceSignup = (now.getTime() - signupDate.getTime()) / (1000 * 60)

    // Check if conversion happened too quickly
    if (minutesSinceSignup < config.minConversionTimeMinutes) {
      return {
        type: 'conversion_timing',
        severity: 'high',
        description: `Conversion happened ${Math.floor(minutesSinceSignup)} minutes after signup`,
        details: {
          referredEmail,
          minutesSinceSignup: Math.floor(minutesSinceSignup),
          threshold: config.minConversionTimeMinutes,
          signupDate: signupDate.toISOString(),
          conversionDate: now.toISOString(),
        },
        timestamp: new Date(),
      }
    }

    return null
  } catch (error) {
    console.error('Error in checkConversionTiming:', error)
    return null
  }
}

/**
 * Log fraud detection result to database
 */
async function logFraudDetection(
  result: FraudDetectionResult
): Promise<void> {
  try {
    const referralCode = result.metadata.referralCode as string | undefined
    const referredEmail = result.metadata.referredEmail as string | undefined
    const ipAddress = result.metadata.ipAddress as string | undefined
    const userAgent = result.metadata.userAgent as string | undefined

    // Log to console
    console.log('[Fraud Detection]', {
      riskScore: result.riskScore,
      action: result.action,
      signals: result.signals.length,
      metadata: result.metadata,
    })

    // Insert into fraud logs table for comprehensive tracking
    await sql`
      INSERT INTO referral_fraud_logs (
        referral_code,
        risk_score,
        action,
        referred_email,
        ip_address,
        user_agent,
        signals,
        metadata
      ) VALUES (
        ${referralCode || null},
        ${result.riskScore},
        ${result.action},
        ${referredEmail || null},
        ${ipAddress || null},
        ${userAgent || null},
        ${JSON.stringify(result.signals)}::jsonb,
        ${JSON.stringify(result.metadata)}::jsonb
      )
    `

    // If suspicious, update the referral's metadata with fraud signals
    if (result.isSuspicious && referralCode) {
      await sql`
        UPDATE referrals
        SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
          'fraud_detection', jsonb_build_object(
            'risk_score', ${result.riskScore},
            'action', ${result.action},
            'signals', ${JSON.stringify(result.signals)},
            'detected_at', ${new Date().toISOString()}
          )
        )
        WHERE referral_code = ${referralCode}
      `
    }

    // Update fraud patterns for learning
    for (const signal of result.signals) {
      if (signal.severity === 'high' || signal.severity === 'critical') {
        await updateFraudPattern(signal, ipAddress, referredEmail)
      }
    }
  } catch (error) {
    console.error('Error logging fraud detection:', error)
  }
}

/**
 * Update fraud pattern tracking for learning
 */
async function updateFraudPattern(
  signal: FraudSignal,
  ipAddress?: string,
  email?: string
): Promise<void> {
  try {
    let patternType = signal.type
    let patternValue = ''

    // Determine pattern value based on signal type
    switch (signal.type) {
      case 'ip_abuse':
      case 'rapid_signup':
        if (ipAddress) {
          patternValue = ipAddress
          patternType = 'ip_abuse'
        }
        break
      case 'suspicious_domain':
        if (email) {
          const domain = email.split('@')[1]
          if (domain) {
            patternValue = domain
            patternType = 'suspicious_domain'
          }
        }
        break
      case 'email_pattern':
        if (email) {
          const domain = email.split('@')[1]
          if (domain) {
            patternValue = domain
            patternType = 'email_pattern'
          }
        }
        break
    }

    if (!patternValue) return

    // Upsert fraud pattern
    await sql`
      INSERT INTO referral_fraud_patterns (
        pattern_type,
        pattern_value,
        times_detected,
        first_detected_at,
        last_detected_at,
        metadata
      ) VALUES (
        ${patternType},
        ${patternValue},
        1,
        NOW(),
        NOW(),
        ${JSON.stringify({ signal })}::jsonb
      )
      ON CONFLICT (pattern_type, pattern_value)
      DO UPDATE SET
        times_detected = referral_fraud_patterns.times_detected + 1,
        last_detected_at = NOW(),
        metadata = referral_fraud_patterns.metadata || ${JSON.stringify({ signal })}::jsonb
    `
  } catch (error) {
    // Ignore constraint errors (unique constraint might not exist yet)
    if (!error?.toString().includes('duplicate key')) {
      console.error('Error updating fraud pattern:', error)
    }
  }
}

/**
 * Helper: Calculate string similarity (Levenshtein distance based)
 */
function isSimilarString(str1: string, str2: string, threshold: number = 0.8): boolean {
  if (str1 === str2) return true

  const maxLen = Math.max(str1.length, str2.length)
  if (maxLen === 0) return true

  const distance = levenshteinDistance(str1, str2)
  const similarity = 1 - distance / maxLen

  return similarity >= threshold
}

/**
 * Helper: Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Get fraud statistics for a referrer
 */
export async function getReferrerFraudStats(referrerId: string): Promise<{
  totalReferrals: number
  flaggedReferrals: number
  avgRiskScore: number
  topSignals: Array<{ type: FraudSignalType; count: number }>
}> {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (
          WHERE metadata->'fraud_detection' IS NOT NULL
        ) as flagged_referrals,
        AVG(
          CAST(metadata->'fraud_detection'->>'risk_score' AS NUMERIC)
        ) as avg_risk_score
      FROM referrals
      WHERE referrer_id = ${referrerId}
    `

    return {
      totalReferrals: Number(stats[0].total_referrals) || 0,
      flaggedReferrals: Number(stats[0].flagged_referrals) || 0,
      avgRiskScore: Number(stats[0].avg_risk_score) || 0,
      topSignals: [], // Would need more complex query to extract from JSONB
    }
  } catch (error) {
    console.error('Error in getReferrerFraudStats:', error)
    return {
      totalReferrals: 0,
      flaggedReferrals: 0,
      avgRiskScore: 0,
      topSignals: [],
    }
  }
}
