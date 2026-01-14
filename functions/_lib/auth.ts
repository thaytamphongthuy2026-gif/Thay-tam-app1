import * as jose from 'jose'

export interface JWTPayload {
  sub: string // user ID
  email?: string
  role?: string
  iss?: string
  exp?: number
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  try {
    // Decode JWT without verification (for MVP/demo only)
    // WARNING: This is not secure for production!
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // Decode payload
    const payloadBase64 = parts[1]
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    
    // Basic validation
    if (!payload.sub) {
      throw new Error('Missing user ID in token')
    }

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token has expired')
    }

    // Check issuer
    if (payload.iss !== 'https://jnfpxvodlmfukpagozcw.supabase.co/auth/v1') {
      throw new Error('Invalid token issuer')
    }

    console.log('JWT decoded successfully, user:', payload.sub)
    return payload as JWTPayload
    
  } catch (error: any) {
    console.error('JWT decode error:', error.message)
    throw new Error(`Invalid or expired token: ${error.message}`)
  }
}

export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}
