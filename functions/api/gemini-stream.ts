import { verifyJWT, extractToken } from '../_lib/auth'
import { getUser, hasQuota, decrementQuota, updateUserQuota } from '../_lib/database'
import type { Env } from '../_lib/database'
import { checkRateLimit } from '../_lib/rateLimit'
import { buildGeminiRequestWithRAG } from '../_lib/ragHelper'

interface RequestBody {
  prompt: string
  quotaType: 'chat' | 'xemNgay' | 'tuVi'
  useRag?: boolean  // NEW: Optional RAG flag
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
    const { prompt, quotaType, useRag = false } = body  // Default to false for quick mode

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

    // Call Gemini API with streaming
    // Only use RAG if explicitly requested (book mode)
    const requestBody = useRag 
      ? buildGeminiRequestWithRAG(prompt, env, quotaType)
      : {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API Error:', geminiResponse.status, errorText)
      return new Response(
        JSON.stringify({ 
          error: 'Lỗi khi gọi AI. Vui lòng thử lại sau.',
          details: env.ENVIRONMENT === 'development' ? errorText : undefined
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }

    // Decrement quota immediately
    const newQuota = decrementQuota(currentQuota, quotaType)
    await updateUserQuota(userId, newQuota, env)

    // Stream response back to client
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()

    // Start streaming
    ;(async () => {
      try {
        const reader = geminiResponse.body?.getReader()
        if (!reader) {
          await writer.write(encoder.encode('data: {"error": "No response body"}\n\n'))
          await writer.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line)
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text
                if (text) {
                  await writer.write(
                    encoder.encode(`data: ${JSON.stringify({ chunk: text })}\n\n`)
                  )
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        // Process remaining buffer
        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer)
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) {
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ chunk: text })}\n\n`)
              )
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }

        await writer.write(encoder.encode('data: [DONE]\n\n'))
        await writer.close()
      } catch (error) {
        console.error('Streaming error:', error)
        await writer.write(encoder.encode(`data: {"error": "${error}"}\n\n`))
        await writer.close()
      }
    })()

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('❌ Error in gemini-stream function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}
