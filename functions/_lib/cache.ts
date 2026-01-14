/**
 * Response Caching with Cloudflare KV
 * Caches Gemini API responses to reduce API calls and improve performance
 */

export interface CacheConfig {
  ttl: number // Time to live in seconds
  prefix: string // Cache key prefix
}

/**
 * Generate cache key from prompt and quota type
 * Uses hash for shorter keys and better performance
 */
export function generateCacheKey(
  prefix: string,
  prompt: string,
  quotaType: string
): string {
  // Simple hash function for cache keys
  const hash = simpleHash(prompt + quotaType)
  return `${prefix}:${quotaType}:${hash}`
}

/**
 * Simple hash function for generating cache keys
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Get cached response from KV
 */
export async function getCachedResponse(
  kv: KVNamespace,
  cacheKey: string
): Promise<any | null> {
  try {
    const cached = await kv.get(cacheKey, { type: 'json' })
    
    if (cached) {
      console.log(`✅ Cache hit: ${cacheKey}`)
      return cached
    }
    
    console.log(`❌ Cache miss: ${cacheKey}`)
    return null
  } catch (error) {
    console.error('Failed to get cached response:', error)
    return null
  }
}

/**
 * Set cached response in KV
 */
export async function setCachedResponse(
  kv: KVNamespace,
  cacheKey: string,
  response: any,
  ttl: number
): Promise<void> {
  try {
    await kv.put(cacheKey, JSON.stringify(response), {
      expirationTtl: ttl,
    })
    console.log(`💾 Cached response: ${cacheKey} (TTL: ${ttl}s)`)
  } catch (error) {
    console.error('Failed to cache response:', error)
    // Don't throw - caching failure should not break the app
  }
}

/**
 * Invalidate cache for specific pattern
 */
export async function invalidateCache(
  kv: KVNamespace,
  pattern: string
): Promise<void> {
  try {
    // KV doesn't support pattern-based deletion directly
    // This is a placeholder for future implementation
    console.log(`🗑️ Cache invalidation requested: ${pattern}`)
    // In production, you might maintain a list of cache keys
    // or use a different strategy
  } catch (error) {
    console.error('Failed to invalidate cache:', error)
  }
}

/**
 * Smart caching strategy for different quota types
 */
export function getCacheConfig(quotaType: string): CacheConfig {
  switch (quotaType) {
    case 'chat':
      // Chat responses - cache for 1 hour
      // Similar questions might be asked frequently
      return { ttl: 3600, prefix: 'gemini_chat' }
    
    case 'xemNgay':
      // Date analysis - cache for 24 hours
      // Same date analysis is identical for all users
      return { ttl: 86400, prefix: 'gemini_xemngay' }
    
    case 'tuVi':
      // Astrology - cache for 7 days
      // Birth chart doesn't change
      return { ttl: 604800, prefix: 'gemini_tuvi' }
    
    default:
      // Default: 1 hour
      return { ttl: 3600, prefix: 'gemini_default' }
  }
}

/**
 * Calculate cache hit rate (for monitoring)
 */
export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
}

export async function getCacheStats(kv: KVNamespace): Promise<CacheStats> {
  try {
    const hitsStr = await kv.get('cache_stats:hits')
    const missesStr = await kv.get('cache_stats:misses')
    
    const hits = hitsStr ? parseInt(hitsStr, 10) : 0
    const misses = missesStr ? parseInt(missesStr, 10) : 0
    const total = hits + misses
    const hitRate = total > 0 ? (hits / total) * 100 : 0
    
    return { hits, misses, hitRate }
  } catch (error) {
    console.error('Failed to get cache stats:', error)
    return { hits: 0, misses: 0, hitRate: 0 }
  }
}

export async function incrementCacheHit(kv: KVNamespace): Promise<void> {
  try {
    const currentStr = await kv.get('cache_stats:hits')
    const current = currentStr ? parseInt(currentStr, 10) : 0
    await kv.put('cache_stats:hits', (current + 1).toString())
  } catch (error) {
    console.error('Failed to increment cache hit:', error)
  }
}

export async function incrementCacheMiss(kv: KVNamespace): Promise<void> {
  try {
    const currentStr = await kv.get('cache_stats:misses')
    const current = currentStr ? parseInt(currentStr, 10) : 0
    await kv.put('cache_stats:misses', (current + 1).toString())
  } catch (error) {
    console.error('Failed to increment cache miss:', error)
  }
}
