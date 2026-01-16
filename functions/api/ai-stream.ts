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
    
    // Use RAG when useRag=true (book mode) - Slower but more accurate
    // Use GROQ when useRag=false (quick mode) - Fast responses
    let aiResponse: Response
    
    if (useRag) {
      console.log('📚 Using RAG with 3 books (Gemini)...')
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
      console.log('⚡ Using GROQ (fast mode, no RAG)...')
      // Quick mode: Use GROQ for fastest response
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
      
      // Call GROQ directly for speed (500+ tok/s)
      // Reduced maxTokens for faster completion
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
