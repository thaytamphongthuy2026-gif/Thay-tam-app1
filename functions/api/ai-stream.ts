import { verifyJWT, extractToken } from '../_lib/auth'
import { getUser, hasQuota, decrementQuota, updateUserQuota } from '../_lib/database'
import type { Env } from '../_lib/database'
import { checkRateLimit } from '../_lib/rateLimit'
import { buildGeminiRequestWithRAG } from '../_lib/ragHelper'
import { callAI, buildSystemPrompt, transformStreamingResponse, type AIMessage } from '../_lib/aiService'
import { transformGeminiStreamingResponse } from '../_lib/geminiService'

interface RequestBody {
  prompt: string
  quotaType: 'chat' | 'xemNgay' | 'tuVi'
  useRag?: boolean  // Optional RAG flag
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
    const { prompt, quotaType, useRag = false } = body

    if (!prompt || !quotaType) {
      return new Response(JSON.stringify({ error: 'Thiếu thông tin prompt hoặc quotaType' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
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

    // Build messages for AI
    const systemPrompt = buildSystemPrompt(quotaType)
    
    // CHANGED: Use Gemini for ALL modes (better xưng hô consistency)
    // RAG mode: Gemini + 3 books (5-8s)
    // Quick mode: Gemini only (2-3s) - Slightly slower but MORE STABLE
    let aiResponse: Response
    
    if (useRag) {
      console.log('📚 Using Gemini + RAG (3 books)...')
      // Build Gemini request with RAG support
      const ragRequest = buildGeminiRequestWithRAG(prompt, env, quotaType)
      
      // Call Gemini directly with RAG
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${env.GEMINI_API_KEY}&alt=sse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ragRequest),
        }
      )
      
      if (!geminiResponse.ok) {
        const error = await geminiResponse.text()
        console.error('❌ Gemini RAG Error:', geminiResponse.status, error)
        throw new Error(`Gemini RAG failed: ${geminiResponse.status}`)
      }
      
      aiResponse = geminiResponse
      console.log('✅ Gemini RAG streaming started')
    } else {
      console.log('⚡ Using Gemini (fast mode, no RAG)...')
      // Quick mode: Use Gemini WITHOUT RAG for consistent xưng hô
      // Slightly slower than GROQ but MUCH more stable
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
      
      // Call Gemini directly (will use callAI with Gemini priority)
      aiResponse = await callAI({ messages, maxTokens: 2048 }, env)
    }

    console.log(`📝 AI Request: quotaType=${quotaType}, useRag=${useRag}, promptLength=${prompt.length}`)

    // Decrement quota immediately
    const newQuota = decrementQuota(currentQuota, quotaType)
    await updateUserQuota(userId, newQuota, env)

    console.log(`✅ Quota decremented: ${quotaType} ${currentQuota[quotaType]} → ${newQuota[quotaType]}`)

    // Stream response back to client
    const { readable, writable } = new TransformStream()

    // Transform and forward the stream
    // Use Gemini transformer (supports both Gemini SSE and OpenAI formats)
    transformGeminiStreamingResponse(aiResponse, writable)

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('❌ Error in ai-stream function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}
