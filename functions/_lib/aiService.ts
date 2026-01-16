/**
 * AI Service Abstraction Layer
 * Supports multiple AI providers with auto-fallback
 * Primary: GROQ (fastest, FREE)
 * Backup: DeepSeek via OpenRouter (smartest, FREE unlimited)
 */

import type { Env } from './database'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIStreamOptions {
  messages: AIMessage[]
  temperature?: number
  maxTokens?: number
  onChunk?: (chunk: string) => void
}

/**
 * Call GROQ API (Primary - Fastest)
 * Model: llama-3.1-70b-versatile
 * Speed: 500+ tokens/second
 * Rate: 14,400 requests/day FREE
 */
export async function callGroq(options: AIStreamOptions, env: Env): Promise<Response> {
  const { messages, temperature = 0.7, maxTokens = 2048 } = options

  console.log('🚀 Calling GROQ API (llama-3.3-70b-versatile)...')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // Best for Vietnamese (newer!)
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true, // Enable streaming
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ GROQ API Error:', response.status, error)
    throw new Error(`GROQ API failed: ${response.status}`)
  }

  console.log('✅ GROQ API streaming started')
  return response
}

/**
 * Call DeepSeek via OpenRouter (Backup - Smartest)
 * Model: deepseek-chat
 * Speed: 200-300 tokens/second
 * Rate: Unlimited FREE
 */
export async function callDeepSeek(options: AIStreamOptions, env: Env): Promise<Response> {
  const { messages, temperature = 0.7, maxTokens = 2048 } = options

  console.log('🧠 Calling DeepSeek via OpenRouter...')

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://thaytamphongthuy.com', // Required by OpenRouter
      'X-Title': 'Thầy Tám Phong Thủy', // Optional but nice
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat', // FREE model, excellent quality
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ DeepSeek API Error:', response.status, error)
    throw new Error(`DeepSeek API failed: ${response.status}`)
  }

  console.log('✅ DeepSeek API streaming started')
  return response
}

/**
 * Main AI Service with Auto-Fallback
 * Try GROQ first (fastest) → fallback to DeepSeek (smartest)
 */
export async function callAI(options: AIStreamOptions, env: Env): Promise<Response> {
  try {
    // Primary: Try GROQ (90% success, fastest)
    return await callGroq(options, env)
  } catch (groqError) {
    console.warn('⚠️ GROQ failed, falling back to DeepSeek:', groqError)
    
    try {
      // Backup: Try DeepSeek (99% success)
      return await callDeepSeek(options, env)
    } catch (deepseekError) {
      console.error('❌ All AI providers failed')
      throw new Error('Không thể kết nối với AI. Vui lòng thử lại sau.')
    }
  }
}

/**
 * Build system prompt for Thầy Tám
 */
export function buildSystemPrompt(quotaType: 'chat' | 'xemNgay' | 'tuVi'): string {
  const basePrompt = `Bạn là "Thầy Tám" - chuyên gia phong thủy hàng đầu Việt Nam, với 30 năm kinh nghiệm.

Phong cách trả lời:
- Thân thiện, gần gũi, dễ hiểu
- Dựa trên kiến thức phong thủy cổ truyền Việt Nam
- Đưa ra lời khuyên cụ thể, thực tế
- Giải thích rõ ràng lý do đằng sau mỗi lời khuyên

Nguyên tắc:
- Luôn tích cực, mang lại niềm tin
- Tránh mê tín dị đoan thái quá
- Kết hợp phong thủy với khoa học hiện đại khi có thể
- Trả lời ngắn gọn (~200-300 chữ) trừ khi được yêu cầu chi tiết`

  if (quotaType === 'xemNgay') {
    return basePrompt + `

Chuyên môn: Xem ngày tốt
- Phân tích can chi, ngũ hành
- Đề xuất ngày tốt cho khai trương, cưới hỏi, xây nhà, di chuyển
- Gợi ý hướng tốt, màu sắc phù hợp
- Lưu ý điều kiêng kỵ`
  }

  if (quotaType === 'tuVi') {
    return basePrompt + `

Chuyên môn: Tử vi
- Phân tích lá số tử vi theo năm sinh
- Dự đoán vận hạn, sự nghiệp, tài lộc, tình duyên
- Tư vấn hướng đi phù hợp với mệnh
- Gợi ý cách hóa giải vận xui, tăng cường vận may`
  }

  return basePrompt + `

Chuyên môn: Tư vấn phong thủy tổng quát
- Phong thủy nhà ở, văn phòng
- Tư vấn hướng nhà, bố trí nội thất
- Giải đáp thắc mắc về phong thủy
- Lời khuyên cho năm 2026 (Ất Tỵ)`
}

/**
 * Transform Groq/OpenRouter streaming response to our format
 * Both use OpenAI-compatible format
 */
export async function transformStreamingResponse(
  aiResponse: Response,
  writable: WritableStream
): Promise<void> {
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  try {
    const reader = aiResponse.body?.getReader()
    if (!reader) {
      await writer.write(encoder.encode('data: {"error": "No response body"}\n\n'))
      await writer.close()
      return
    }

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
            const jsonStr = line.slice(6) // Remove "data: " prefix
            const data = JSON.parse(jsonStr)
            
            // Extract content from OpenAI format
            const content = data.choices?.[0]?.delta?.content
            
            if (content) {
              // Send in our format
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`)
              )
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim() && buffer.trim() !== 'data: [DONE]') {
      try {
        const jsonStr = buffer.trim().startsWith('data: ') 
          ? buffer.trim().slice(6) 
          : buffer.trim()
        const data = JSON.parse(jsonStr)
        const content = data.choices?.[0]?.delta?.content
        
        if (content) {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`)
          )
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }

    await writer.write(encoder.encode('data: [DONE]\n\n'))
    await writer.close()
  } catch (error) {
    console.error('❌ Stream transformation error:', error)
    await writer.write(encoder.encode(`data: {"error": "${error}"}\n\n`))
    await writer.close()
  }
}
