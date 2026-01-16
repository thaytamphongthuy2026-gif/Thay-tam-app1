/**
 * Gemini 2.5 Flash Service
 * PRIMARY AI provider with BEST Vietnamese support and system prompt following
 */

import type { Env } from './database'
import type { AIMessage, AIStreamOptions } from './aiService'

/**
 * Call Gemini 2.5 Flash API (PRIMARY - BEST for Vietnamese)
 * Model: gemini-2.5-flash
 * Features: Excellent Vietnamese, Superior system prompt following, FREE
 */
export async function callGemini(options: AIStreamOptions, env: Env): Promise<Response> {
  const { messages, temperature = 0.7, maxTokens = 4096 } = options  // Increased from 2048 to 4096

  console.log('🔮 Calling Gemini 2.5 Flash API...')

  // Extract system message and user messages
  const systemMessage = messages.find(m => m.role === 'system')
  const userMessages = messages.filter(m => m.role !== 'system')

  // Build request body
  const requestBody: any = {
    contents: userMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    }
  }

  // Add system instruction if present
  if (systemMessage) {
    requestBody.systemInstruction = {
      parts: [{ text: systemMessage.content }]
    }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${env.GEMINI_API_KEY}&alt=sse`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ Gemini API Error:', response.status, error)
    throw new Error(`Gemini API failed: ${response.status}`)
  }

  console.log('✅ Gemini 2.5 Flash streaming started')
  return response
}

/**
 * Transform Gemini streaming response to our format
 * Gemini uses Server-Sent Events (SSE) format
 */
export async function transformGeminiStreamingResponse(
  geminiResponse: Response,
  writable: WritableStream
): Promise<void> {
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  try {
    const reader = geminiResponse.body?.getReader()
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
        
        // Gemini SSE format: "data: {json}"
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue
            
            const data = JSON.parse(jsonStr)
            
            // Extract text from Gemini response format
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text
            
            if (content) {
              // Send in our format
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`)
              )
            }

            // Check if done
            const finishReason = data.candidates?.[0]?.finishReason
            if (finishReason === 'STOP' || finishReason === 'MAX_TOKENS') {
              break
            }
          } catch (e) {
            // Skip invalid JSON
            console.warn('⚠️ Failed to parse Gemini response:', line.substring(0, 100))
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
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (content) {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`)
          )
        }
      } catch (e) {
        // Ignore
      }
    }

    // Send completion signal
    await writer.write(encoder.encode('data: [DONE]\n\n'))
    await writer.close()
  } catch (error) {
    console.error('❌ Gemini streaming error:', error)
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`)
    )
    await writer.close()
  }
}
