import { verifyJWT, extractToken } from '../_lib/auth'
import { getUser, hasQuota, decrementQuota, updateUserQuota } from '../_lib/database'
import type { Env } from '../_lib/database'
import { checkRateLimit } from '../_lib/rateLimit'
import { getCachedResponse, setCachedResponse, generateCacheKey, getCacheConfig, incrementCacheHit, incrementCacheMiss } from '../_lib/cache'
import { callAI, buildSystemPrompt, type AIMessage } from '../_lib/aiService'

interface RequestBody {
  prompt: string
  quotaType: 'chat' | 'xemNgay' | 'tuVi'
}

// SECURITY: Input validation
function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt must be a non-empty string' }
  }
  
  if (prompt.length < 3) {
    return { valid: false, error: 'Prompt must be at least 3 characters' }
  }
  
  if (prompt.length > 5000) {
    return { valid: false, error: 'Prompt must be less than 5000 characters' }
  }
  
  // SECURITY: Check for potential injection patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(prompt)) {
      return { valid: false, error: 'Prompt contains potentially dangerous content' }
    }
  }
  
  return { valid: true }
}

/**
 * Non-streaming AI endpoint (fallback for streaming failures)
 * Uses same GROQ → DeepSeek fallback chain
 */
export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context

  // Enable CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    // Extract and verify JWT token
    const token = extractToken(request)
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing authorization token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const payload = await verifyJWT(token, env.SUPABASE_JWT_SECRET)
    const userId = payload.sub

    // Rate limiting
    const rateLimit = await checkRateLimit(env.RATE_LIMIT, userId, { limit: 60, window: 60 })
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Bạn đang thao tác quá nhanh. Vui lòng đợi 1 phút rồi thử lại.',
          retryAfter: rateLimit.retryAfter
        }), 
        {
          status: 429,
          headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
          },
        }
      )
    }

    // Get request body
    const body = await request.json() as RequestBody
    const { prompt, quotaType } = body

    if (!prompt || !quotaType) {
      return new Response(JSON.stringify({ error: 'Thiếu thông tin prompt hoặc quotaType' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Validate prompt
    const validation = validatePrompt(prompt)
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Check cache
    const cacheKey = generateCacheKey(prompt, quotaType)
    const cacheConfig = getCacheConfig(quotaType)
    
    if (cacheConfig.enabled && env.RESPONSE_CACHE) {
      const cached = await getCachedResponse(env.RESPONSE_CACHE, cacheKey)
      if (cached) {
        await incrementCacheHit(env.RESPONSE_CACHE)
        console.log('✅ Cache HIT:', cacheKey.slice(0, 20) + '...')
        return new Response(JSON.stringify({ 
          success: true, 
          result: cached,
          cached: true 
        }), {
          headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'HIT'
          },
        })
      }
      await incrementCacheMiss(env.RESPONSE_CACHE)
      console.log('❌ Cache MISS:', cacheKey.slice(0, 20) + '...')
    }

    // Get user data
    const user = await getUser(userId, env)
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Check quota
    const currentQuota = user.quota || { xemNgay: 0, tuVi: 0, chat: 0 }
    if (!hasQuota(currentQuota, quotaType)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Insufficient quota',
          quotaType,
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }

    // Build messages
    const systemPrompt = buildSystemPrompt(quotaType)
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ]

    // Call AI (non-streaming)
    console.log(`📝 Non-streaming AI Request: quotaType=${quotaType}`)
    
    // For non-streaming, we need to collect the full response
    const streamResponse = await callAI({ messages }, env)
    
    // Read the stream and collect full text
    const reader = streamResponse.body?.getReader()
    if (!reader) {
      throw new Error('No response body from AI')
    }

    const decoder = new TextDecoder()
    let fullText = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim() || line.trim() === 'data: [DONE]') continue
        
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6)
            const data = JSON.parse(jsonStr)
            const content = data.choices?.[0]?.delta?.content || data.chunk
            if (content) {
              fullText += content
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    // Decrement quota
    const newQuota = decrementQuota(currentQuota, quotaType)
    await updateUserQuota(userId, newQuota, env)

    // Cache the response
    if (cacheConfig.enabled && env.RESPONSE_CACHE) {
      await setCachedResponse(env.RESPONSE_CACHE, cacheKey, fullText, cacheConfig.ttl)
      console.log('💾 Response cached:', cacheKey.slice(0, 20) + '...')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: fullText,
        cached: false
      }),
      {
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'X-Cache': 'MISS'
        },
      }
    )
  } catch (error: any) {
    console.error('❌ Error in ai (non-streaming) function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}
