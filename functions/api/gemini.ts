import { verifyJWT, extractToken } from '../_lib/auth'
import { getUser, hasQuota, decrementQuota, updateUserQuota } from '../_lib/database'
import type { Env } from '../_lib/database'
import { checkRateLimit } from '../_lib/rateLimit'
import { getCachedResponse, setCachedResponse, generateCacheKey, getCacheConfig, incrementCacheHit, incrementCacheMiss } from '../_lib/cache'
import { buildGeminiRequestWithRAG, formatChatResponse } from '../_lib/ragHelper'

interface RequestBody {
  prompt: string
  quotaType: 'chat' | 'xemNgay' | 'tuVi'
}

// Rate limiting now handled by KV in rateLimit.ts
// Cache handling now in cache.ts

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
    /on\w+\s*=/i, // event handlers like onclick=
    /<iframe/i,
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(prompt)) {
      return { valid: false, error: 'Prompt contains potentially dangerous content' }
    }
  }
  
  return { valid: true }
}

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
    // Debug: Check if JWT secret exists
    if (!env.SUPABASE_JWT_SECRET) {
      console.error('SUPABASE_JWT_SECRET is missing!')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Extract and verify JWT token
    const token = extractToken(request)
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing authorization token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    console.log('🔒 Verifying JWT token...')
    const payload = await verifyJWT(token, env.SUPABASE_JWT_SECRET)
    console.log('✅ JWT verified, user ID:', payload.sub)
    const userId = payload.sub

    // PERFORMANCE: KV-based distributed rate limiting
    const rateLimit = await checkRateLimit(env.RATE_LIMIT, userId, { limit: 60, window: 60 })
    if (!rateLimit.allowed) {
      console.warn(`⚠️ Rate limit exceeded for user ${userId}`)
      return new Response(
        JSON.stringify({ 
          error: 'Bạn đang thao tác quá nhanh. Vui lòng đợi 1 phút rồi thử lại.',
          retryAfter: rateLimit.retryAfter,
          remaining: rateLimit.remaining
        }), 
        {
          status: 429,
          headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetAt.toString()
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

    // SECURITY: Validate prompt
    const validation = validatePrompt(prompt)
    if (!validation.valid) {
      console.warn(`⚠️ Invalid prompt from user ${userId}:`, validation.error)
      return new Response(
        JSON.stringify({ error: validation.error }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }

    // SECURITY: Validate quotaType
    if (!['chat', 'xemNgay', 'tuVi'].includes(quotaType)) {
      return new Response(
        JSON.stringify({ error: 'quotaType không hợp lệ' }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
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

    // PERFORMANCE: Check cache first
    const cacheConfig = getCacheConfig(quotaType)
    const cacheKey = generateCacheKey(cacheConfig.prefix, prompt, quotaType)
    
    const cachedResult = await getCachedResponse(env.RESPONSE_CACHE, cacheKey)
    if (cachedResult) {
      console.log(`💾 Cache hit for ${quotaType} - skipping Gemini API call`)
      await incrementCacheHit(env.RESPONSE_CACHE)
      
      // Still decrement quota
      const newQuota = decrementQuota(currentQuota, quotaType)
      await updateUserQuota(userId, newQuota, env)
      
      return new Response(
        JSON.stringify({
          success: true,
          result: cachedResult.result,
          remainingQuota: newQuota,
          metadata: {
            ...cachedResult.metadata,
            cached: true,
            cacheKey
          }
        }),
        {
          status: 200,
          headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'HIT',
            'Cache-Control': 'no-store'
          },
        }
      )
    }
    
    await incrementCacheMiss(env.RESPONSE_CACHE)
    
    // Call Gemini API with RAG support
    console.log(`📡 Calling Gemini API with RAG for user ${userId}, quotaType: ${quotaType}`)
    const geminiStartTime = Date.now()
    
    // Build request with RAG files and system instruction
    const requestBody = buildGeminiRequestWithRAG(prompt, env, quotaType)
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )

    const geminiDuration = Date.now() - geminiStartTime
    console.log(`⏱️ Gemini API responded in ${geminiDuration}ms`)

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('❌ Gemini API error:', {
        status: geminiResponse.status,
        statusText: geminiResponse.statusText,
        error: errorText,
        userId,
        quotaType
      })
      return new Response(
        JSON.stringify({ 
          error: 'Lỗi khi gọi AI. Vui lòng thử lại sau.',
          details: process.env.NODE_ENV === 'development' ? errorText : undefined 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }

    const geminiData = await geminiResponse.json()
    
    // SECURITY: Validate response structure
    if (!geminiData.candidates || !geminiData.candidates[0]) {
      console.error('❌ Invalid Gemini response structure:', geminiData)
      return new Response(
        JSON.stringify({ error: 'Phản hồi AI không hợp lệ' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }
    
    const result = geminiData.candidates[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ AI'
    
    // Format response to remove markdown and ensure beautiful display
    const formattedResult = formatChatResponse(result)

    // Decrement quota
    const newQuota = decrementQuota(currentQuota, quotaType)
    await updateUserQuota(userId, newQuota, env)
    
    console.log(`✅ Success for user ${userId}:`, {
      quotaType,
      oldQuota: currentQuota[quotaType],
      newQuota: newQuota[quotaType],
      responseLength: formattedResult.length,
      duration: geminiDuration,
      ragEnabled: !!env.RAG_FILE_IDS
    })

    // PERFORMANCE: Cache the response for future requests
    const responseData = {
      result: formattedResult,
      metadata: {
        model: 'gemini-2.0-flash-exp',
        processingTime: geminiDuration,
        quotaType,
        cached: false,
        ragEnabled: !!env.RAG_FILE_IDS
      }
    }
    
    await setCachedResponse(env.RESPONSE_CACHE, cacheKey, responseData, cacheConfig.ttl)

    return new Response(
      JSON.stringify({
        success: true,
        result: formattedResult,
        remainingQuota: newQuota,
        metadata: {
          model: 'gemini-2.0-flash-exp',
          processingTime: geminiDuration,
          quotaType,
          cached: false,
          ragEnabled: !!env.RAG_FILE_IDS
        }
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'X-Cache': 'MISS',
          'Cache-Control': 'no-store'
        },
      }
    )
  } catch (error: any) {
    console.error('❌ Error in gemini function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}
