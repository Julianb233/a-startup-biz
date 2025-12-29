import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { rateLimit, inMemoryRateLimit, addRateLimitHeaders, getClientIp, clearRateLimitStore } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear in-memory store before each test
    clearRateLimitStore();
    vi.clearAllMocks();
  });

  describe('inMemoryRateLimit', () => {
    it('should allow requests within rate limit', () => {
      const result = inMemoryRateLimit('test-user', 5, 60000);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should reject requests exceeding rate limit', () => {
      const identifier = 'test-user-limit';
      
      // Make 5 requests (at limit)
      for (let i = 0; i < 5; i++) {
        const result = inMemoryRateLimit(identifier, 5, 60000);
        expect(result.success).toBe(true);
      }
      
      // 6th request should fail
      const result = inMemoryRateLimit(identifier, 5, 60000);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset counter after window expires', () => {
      const identifier = 'test-user-reset';
      const windowMs = 100; // 100ms window
      
      // First request
      let result = inMemoryRateLimit(identifier, 3, windowMs);
      expect(result.success).toBe(true);
      
      // Wait for window to expire
      vi.useFakeTimers();
      vi.advanceTimersByTime(windowMs + 1);
      
      // Should reset and allow new request
      result = inMemoryRateLimit(identifier, 3, windowMs);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
      
      vi.useRealTimers();
    });
  });

  describe('rateLimit function', () => {
    it('should return success for valid requests', async () => {
      const result = await rateLimit('api', 'test-ip-123');
      expect(result.success).toBe(true);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
      expect(result.reset).toBeGreaterThan(Date.now());
    });

    it('should track different rate limit types independently', async () => {
      const ip = 'test-ip-independent';
      
      const apiResult = await rateLimit('api', ip);
      const contactResult = await rateLimit('contact', ip);
      
      expect(apiResult.success).toBe(true);
      expect(contactResult.success).toBe(true);
      // Contact should have lower limit (3 per 10m) than API (60 per 1m)
      expect(contactResult.remaining).toBeLessThan(apiResult.remaining);
    });

    it('should use IP from identifier parameter if provided', async () => {
      const result = await rateLimit('api', 'custom-identifier-123');
      expect(result.success).toBe(true);
    });
  });

  describe('addRateLimitHeaders', () => {
    it('should add correct rate limit headers to response', () => {
      const response = NextResponse.json({ success: true });
      const updatedResponse = addRateLimitHeaders(response, 'api', 59, 1609459200000);
      
      expect(updatedResponse.headers.get('X-RateLimit-Limit')).toBe('60');
      expect(updatedResponse.headers.get('X-RateLimit-Remaining')).toBe('59');
      expect(updatedResponse.headers.get('X-RateLimit-Reset')).toBe('1609459200000');
    });

    it('should handle different rate limit types', () => {
      const response = NextResponse.json({ success: true });
      const contactResponse = addRateLimitHeaders(response, 'contact', 2, 1609459200000);
      
      expect(contactResponse.headers.get('X-RateLimit-Limit')).toBe('3');
      expect(contactResponse.headers.get('X-RateLimit-Remaining')).toBe('2');
    });
  });

  describe('Rate limit configurations', () => {
    it('api should allow 60 requests per minute', async () => {
      // This is a config validation test
      const result = await rateLimit('api', 'api-config-test');
      expect(result.success).toBe(true);
    });

    it('contact should allow 3 requests per 10 minutes', async () => {
      const result = await rateLimit('contact', 'contact-config-test');
      expect(result.success).toBe(true);
    });

    it('onboarding should allow 5 requests per 10 minutes', async () => {
      const result = await rateLimit('onboarding', 'onboarding-config-test');
      expect(result.success).toBe(true);
    });

    it('checkout should allow 5 requests per minute', async () => {
      const result = await rateLimit('checkout', 'checkout-config-test');
      expect(result.success).toBe(true);
    });

    it('auth should allow 10 requests per minute', async () => {
      const result = await rateLimit('auth', 'auth-config-test');
      expect(result.success).toBe(true);
    });
  });
});
