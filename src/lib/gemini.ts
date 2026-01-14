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

export async function callGeminiAPI(
  prompt: string,
  quotaType: 'chat' | 'xemNgay' | 'tuVi'
): Promise<GeminiResponse> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')
  }

  const response = await fetch('/api/gemini', {
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
