import { onScheduled } from '../scheduled'
import type { Env } from '../_lib/database'

/**
 * Manual trigger endpoint for testing quota reset
 * GET /api/reset-quota-test (development only)
 */
export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context

  // SECURITY: Only allow in development
  if (env.ENVIRONMENT === 'production') {
    return new Response(
      JSON.stringify({ error: 'This endpoint is disabled in production' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    console.log('🧪 Manual quota reset triggered for testing')

    // Create mock ScheduledEvent
    const mockEvent = {
      scheduledTime: Date.now(),
      cron: '0 17 * * *', // 00:00 UTC+7
    }

    // Create mock ExecutionContext
    const mockCtx = {
      waitUntil: (promise: Promise<any>) => promise,
      passThroughOnException: () => {},
    }

    // Call the scheduled function
    await onScheduled(mockEvent, env, mockCtx)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Quota reset completed successfully!',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      }
    )
  } catch (error: any) {
    console.error('❌ Manual quota reset failed:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      }
    )
  }
}
