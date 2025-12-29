/**
 * HubSpot CRM Integration - API Client
 *
 * Handles authentication, rate limiting, and error handling for HubSpot API
 */

import {
  HubSpotConfig,
  HubSpotError,
  RateLimitInfo,
} from './types';

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com';

/**
 * HubSpot API Client
 * Manages all communication with HubSpot CRM
 */
export class HubSpotClient {
  private apiKey: string;
  private baseUrl: string;
  private retryAttempts: number;
  private retryDelay: number;
  private timeout: number;
  private rateLimitInfo: RateLimitInfo | null = null;

  constructor(config: HubSpotConfig) {
    if (!config.apiKey) {
      throw new Error('HubSpot API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || HUBSPOT_API_BASE_URL;
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make authenticated request to HubSpot API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Update rate limit info from headers
        this.updateRateLimitInfo(response.headers);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.retryDelay * Math.pow(2, attempt);

          console.warn(`Rate limited by HubSpot. Retrying after ${delay}ms...`);
          await this.sleep(delay);
          continue;
        }

        // Handle error responses
        if (!response.ok) {
          const errorData: HubSpotError = await response.json().catch(() => ({
            status: 'error',
            message: response.statusText,
          }));

          throw new Error(
            `HubSpot API error (${response.status}): ${errorData.message || response.statusText}`
          );
        }

        // Success - return parsed JSON
        const data = await response.json();
        return data as T;

      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof Error &&
          (error.message.includes('401') || // Unauthorized
           error.message.includes('403') || // Forbidden
           error.message.includes('404'))   // Not Found
        ) {
          throw error;
        }

        // Retry with exponential backoff
        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          console.warn(`Request failed, retrying in ${delay}ms... (Attempt ${attempt + 1}/${this.retryAttempts})`);
          await this.sleep(delay);
        }
      }
    }

    // All retries exhausted
    throw new Error(
      `HubSpot API request failed after ${this.retryAttempts} retries: ${lastError?.message}`
    );
  }

  /**
   * GET request with optional query parameters
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    return this.request<T>(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimitInfo(headers: Headers): void {
    const dailyLimit = headers.get('X-HubSpot-RateLimit-Daily');
    const dailyRemaining = headers.get('X-HubSpot-RateLimit-Daily-Remaining');
    const intervalMilliseconds = headers.get('X-HubSpot-RateLimit-Interval-Milliseconds');
    const currentUsage = headers.get('X-HubSpot-RateLimit-Secondly');

    if (dailyLimit && dailyRemaining) {
      this.rateLimitInfo = {
        currentUsage: parseInt(currentUsage || '0'),
        dailyLimit: parseInt(dailyLimit),
        intervalMilliseconds: parseInt(intervalMilliseconds || '10000'),
        callsRemaining: parseInt(dailyRemaining),
      };
    }
  }

  /**
   * Get current rate limit info
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  /**
   * Check if we're approaching rate limits
   */
  isApproachingRateLimit(): boolean {
    if (!this.rateLimitInfo) return false;
    const percentUsed = (this.rateLimitInfo.dailyLimit - this.rateLimitInfo.callsRemaining) / this.rateLimitInfo.dailyLimit;
    return percentUsed > 0.9; // 90% of daily limit used
  }

  /**
   * Sleep helper for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verify API key is valid
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.get('/integrations/v1/me');
      return true;
    } catch (error) {
      console.error('Failed to verify HubSpot connection:', error);
      return false;
    }
  }
}

/**
 * Create singleton client instance
 */
let clientInstance: HubSpotClient | null = null;

export function getHubSpotClient(): HubSpotClient {
  if (!clientInstance) {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is not set');
    }

    clientInstance = new HubSpotClient({
      apiKey,
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 30000,
    });
  }

  return clientInstance;
}

/**
 * Reset client instance (useful for testing)
 */
export function resetHubSpotClient(): void {
  clientInstance = null;
}
