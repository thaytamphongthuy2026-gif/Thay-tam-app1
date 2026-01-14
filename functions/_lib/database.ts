export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  SUPABASE_JWT_SECRET: string
  GEMINI_API_KEY: string
  RATE_LIMIT: KVNamespace
  RESPONSE_CACHE: KVNamespace
}

export async function getUser(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`,
    {
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  const users = await response.json()
  return users[0] || null
}

export async function updateUserQuota(
  userId: string,
  quota: { xemNgay: number; tuVi: number; chat: number },
  env: Env
) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ quota }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update quota')
  }

  return response.json()
}

export function hasQuota(
  currentQuota: { xemNgay: number; tuVi: number; chat: number },
  quotaType: 'xemNgay' | 'tuVi' | 'chat'
): boolean {
  return currentQuota[quotaType] > 0
}

export function decrementQuota(
  currentQuota: { xemNgay: number; tuVi: number; chat: number },
  quotaType: 'xemNgay' | 'tuVi' | 'chat'
): { xemNgay: number; tuVi: number; chat: number } {
  return {
    ...currentQuota,
    [quotaType]: Math.max(0, currentQuota[quotaType] - 1),
  }
}
