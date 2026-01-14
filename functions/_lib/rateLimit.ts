/**
 * Distributed Rate Limiting with Cloudflare KV
 * Replaces in-memory cache with globally distributed KV storage
 */

export interface RateLimitConfig {
  limit: number // Max requests
  window: number // Time window in seconds
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number
}

/**
 * Check rate limit using Cloudflare KV
 * @param kv - Cloudflare KV namespace
 * @param key - Unique identifier (userId, IP, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = Math.floor(now / (config.window * 1000)) * (config.window * 1000)
  const kvKey = `ratelimit:${key}:${windowStart}`

  try {
    // Get current count from KV
    const currentCountStr = await kv.get(kvKey)
    const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0

    // Check if limit exceeded
    if (currentCount >= config.limit) {
      const resetAt = windowStart + config.window * 1000
      const retryAfter = Math.ceil((resetAt - now) / 1000)

      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter,
      }
    }

    // Increment count
    const newCount = currentCount + 1
    await kv.put(kvKey, newCount.toString(), {
      expirationTtl: config.window + 60, // Add 60s buffer
    })

    return {
      allowed: true,
      remaining: config.limit - newCount,
      resetAt: windowStart + config.window * 1000,
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // On error, allow request (fail open)
    return {
      allowed: true,
      remaining: config.limit,
      resetAt: windowStart + config.window * 1000,
    }
  }
}

/**
 * Reset rate limit for a specific key
 * Useful for testing or manual overrides
 */
export async function resetRateLimit(kv: KVNamespace, key: string): Promise<void> {
  const now = Date.now()
  const windowStart = Math.floor(now / 60000) * 60000
  const kvKey = `ratelimit:${key}:${windowStart}`
  await kv.delete(kvKey)
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  kv: KVNamespace,
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = Math.floor(now / (config.window * 1000)) * (config.window * 1000)
  const kvKey = `ratelimit:${key}:${windowStart}`

  try {
    const currentCountStr = await kv.get(kvKey)
    const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0

    return {
      allowed: currentCount < config.limit,
      remaining: Math.max(0, config.limit - currentCount),
      resetAt: windowStart + config.window * 1000,
    }
  } catch (error) {
    console.error('Failed to get rate limit status:', error)
    return {
      allowed: true,
      remaining: config.limit,
      resetAt: windowStart + config.window * 1000,
    }
  }
}
