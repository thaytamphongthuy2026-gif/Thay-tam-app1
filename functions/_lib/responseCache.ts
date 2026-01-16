/**
 * Response Cache for Common Questions
 * Reduces load on AI APIs by caching frequent queries
 */

export interface CacheEntry {
  response: string
  timestamp: number
  hits: number
}

// Common questions cache (in-memory for now, can move to KV later)
const CACHE_TTL = 3600 * 1000 // 1 hour
const MAX_CACHE_SIZE = 100

export class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map()

  /**
   * Generate cache key from prompt
   */
  private getCacheKey(prompt: string, mode: 'quick' | 'book'): string {
    // Normalize prompt: lowercase, remove special chars, trim whitespace
    const normalized = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    return `${mode}:${normalized}`
  }

  /**
   * Check if response is cached
   */
  get(prompt: string, mode: 'quick' | 'book'): string | null {
    const key = this.getCacheKey(prompt, mode)
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key)
      return null
    }

    // Increment hit counter
    entry.hits++
    console.log(`✅ Cache HIT: ${key} (${entry.hits} hits)`)
    
    return entry.response
  }

  /**
   * Store response in cache
   */
  set(prompt: string, mode: 'quick' | 'book', response: string): void {
    // Don't cache if response is too short (likely error)
    if (response.length < 50) return

    const key = this.getCacheKey(prompt, mode)

    // Evict oldest entries if cache is full
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      hits: 0
    })

    console.log(`📦 Cached response: ${key}`)
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; totalHits: number } {
    let totalHits = 0
    for (const entry of this.cache.values()) {
      totalHits += entry.hits
    }

    return {
      size: this.cache.size,
      totalHits
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
  }
}

// Singleton instance
export const responseCache = new ResponseCache()
