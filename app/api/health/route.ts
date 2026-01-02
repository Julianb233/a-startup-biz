/**
 * Health Check Endpoint
 *
 * Monitors critical service dependencies
 * Used by uptime monitoring services
 */

import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  error?: string;
}

export async function GET() {
  const checks: HealthCheck[] = [];
  const startTime = Date.now();

  // Check database connectivity
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const dbStart = Date.now();
    await sql`SELECT 1`;
    checks.push({
      service: 'database',
      status: 'healthy',
      latency: Date.now() - dbStart,
    });
  } catch (error) {
    checks.push({
      service: 'database',
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Check Redis (Upstash) connectivity
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const redisStart = Date.now();
      const response = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/ping`,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
        }
      );

      checks.push({
        service: 'redis',
        status: response.ok ? 'healthy' : 'degraded',
        latency: Date.now() - redisStart,
      });
    } catch (error) {
      checks.push({
        service: 'redis',
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Check Supabase connectivity
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabaseStart = Date.now();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      );

      checks.push({
        service: 'supabase',
        status: response.ok ? 'healthy' : 'degraded',
        latency: Date.now() - supabaseStart,
      });
    } catch (error) {
      checks.push({
        service: 'supabase',
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Determine overall health
  const hasDownService = checks.some((c) => c.status === 'down');
  const hasDegradedService = checks.some((c) => c.status === 'degraded');

  let overallStatus: 'healthy' | 'degraded' | 'down';
  if (hasDownService) {
    overallStatus = 'down';
  } else if (hasDegradedService) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'healthy';
  }

  const statusCode = overallStatus === 'healthy' ? 200 : 503;

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      checks,
      version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
    },
    { status: statusCode }
  );
}

// Allow both GET and HEAD requests for uptime monitoring
export const HEAD = GET;
