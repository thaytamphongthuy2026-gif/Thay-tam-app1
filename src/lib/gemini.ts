import { getSession } from './auth'

export interface QuotaType {
  xemNgay: number
  tuVi: number
  chat: number
}

export interface GeminiResponse {
  success: boolean
  result?: string
  remainingQuota?: QuotaType
  error?: string
  quotaType?: string
}

// Non-streaming API call (fallback)
export async function callGeminiAPI(
  prompt: string,
  quotaType: 'chat' | 'xemNgay' | 'tuVi'
): Promise<GeminiResponse> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')
  }

  // Try new AI endpoint first, fallback to gemini
  const endpoints = ['/api/ai', '/api/gemini']
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prompt, quotaType }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Có lỗi xảy ra')
      }

      return response.json()
    } catch (error) {
      if (endpoint === endpoints[endpoints.length - 1]) {
        throw error // Last endpoint, throw error
      }
    }
  }
  
  throw new Error('All API endpoints failed')
}

// Streaming version for chat
export async function streamGeminiAPI(
  prompt: string,
  quotaType: 'chat' | 'xemNgay' | 'tuVi',
  onChunk: (text: string) => void,
  useRag: boolean = false
): Promise<GeminiResponse> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')
  }

  // Try new AI streaming endpoint first, fallback to gemini-stream
  const endpoints = ['/api/ai-stream', '/api/gemini-stream']
  
  for (const endpoint of endpoints) {
    try {
      // Add timeout protection (30 seconds)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prompt, quotaType, useRag }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Lỗi kết nối' }))
        throw new Error(error.error || 'Có lỗi xảy ra')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (!reader) {
        throw new Error('No response body')
      }

      // Streaming timeout protection (60 seconds for streaming)
      const streamTimeout = setTimeout(() => {
        reader.cancel()
        throw new Error('Timeout: Không nhận được phản hồi từ AI sau 60 giây')
      }, 60000)

      let hasReceivedData = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        hasReceivedData = true
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.chunk) {
                fullText += parsed.chunk
                onChunk(parsed.chunk)
              } else if (parsed.error) {
                clearTimeout(streamTimeout)
                throw new Error(parsed.error)
              }
            } catch (e: any) {
              if (e.message && !e.message.includes('JSON')) {
                throw e
              }
            }
          }
        }
      }

      clearTimeout(streamTimeout)

      if (!hasReceivedData) {
        throw new Error('Không nhận được phản hồi từ AI. Vui lòng thử lại.')
      }

      return {
        success: true,
        result: fullText
      }
    } catch (error: any) {
      if (endpoint === endpoints[endpoints.length - 1]) {
        // Last endpoint failed, throw error
        if (error.name === 'AbortError') {
          throw new Error('Timeout: Yêu cầu quá lâu. Vui lòng thử lại.')
        }
        throw error
      }
      
      // Try next endpoint
      continue
    }
  }
  
  throw new Error('All streaming endpoints failed')
}

export async function getQuota(): Promise<{ user: any; quota: QuotaType }> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Bạn cần đăng nhập để xem quota')
  }

  const response = await fetch('/api/quota', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Không thể lấy thông tin quota')
  }

  return response.json()
}
