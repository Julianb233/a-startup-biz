/**
 * HubSpot Client Configuration
 *
 * Provides a configured HubSpot API client with error handling.
 * Uses the official HubSpot Node.js SDK.
 *
 * Environment Variables Required:
 * - HUBSPOT_API_KEY: HubSpot Private App access token
 */

import { Client } from '@hubspot/api-client'

// Singleton HubSpot client instance
let hubspotClient: Client | null = null

/**
 * Get or create the HubSpot client instance
 */
export function getHubSpotClient(): Client {
  if (hubspotClient) {
    return hubspotClient
  }

  const accessToken = process.env.HUBSPOT_API_KEY

  if (!accessToken) {
    throw new Error(
      'HUBSPOT_API_KEY environment variable is required. ' +
      'Create a Private App in HubSpot and add the access token.'
    )
  }

  hubspotClient = new Client({ accessToken })
  return hubspotClient
}

/**
 * Check if HubSpot integration is configured
 */
export function isHubSpotConfigured(): boolean {
  return Boolean(process.env.HUBSPOT_API_KEY)
}

/**
 * HubSpot API error type
 */
export interface HubSpotApiError {
  status: number
  message: string
  correlationId?: string
  category?: string
  errors?: Array<{
    message: string
    context?: Record<string, string[]>
  }>
}

/**
 * Parse HubSpot API error response
 */
export function parseHubSpotError(error: unknown): HubSpotApiError {
  if (error && typeof error === 'object') {
    const err = error as any

    // Handle HubSpot SDK errors
    if (err.response?.body) {
      const body = err.response.body
      return {
        status: err.response.statusCode || 500,
        message: body.message || 'HubSpot API error',
        correlationId: body.correlationId,
        category: body.category,
        errors: body.errors,
      }
    }

    // Handle Axios-style errors
    if (err.response?.data) {
      return {
        status: err.response.status || 500,
        message: err.response.data.message || err.message || 'HubSpot API error',
        correlationId: err.response.data.correlationId,
        category: err.response.data.category,
        errors: err.response.data.errors,
      }
    }

    // Handle standard errors
    if (err.message) {
      return {
        status: err.status || 500,
        message: err.message,
      }
    }
  }

  return {
    status: 500,
    message: 'Unknown HubSpot API error',
  }
}
