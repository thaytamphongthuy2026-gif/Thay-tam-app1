import * as jose from 'jose'

export interface JWTPayload {
  sub: string // user ID
  email?: string
  role?: string
  iss?: string
  exp?: number
  aud?: string
}

/**
 * Verify JWT token using ES256 algorithm (Supabase default)
 * For production: use Supabase's public key
 * For MVP: decode and validate basic claims
 */
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  try {
    // STEP 1: Validate JWT structure
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // STEP 2: Decode header to check algorithm
    const headerBase64 = parts[0]
    const headerJson = atob(headerBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const header = JSON.parse(headerJson)
    
    if (header.alg !== 'ES256' && header.alg !== 'HS256') {
      throw new Error(`Unsupported algorithm: ${header.alg}`)
    }

    // STEP 3: Decode payload
    const payloadBase64 = parts[1]
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    
    // STEP 4: Validate required claims
    if (!payload.sub) {
      throw new Error('Missing user ID (sub) in token')
    }

    // STEP 5: Check expiration
    if (!payload.exp) {
      throw new Error('Missing expiration time (exp) in token')
    }
    
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) {
      throw new Error(`Token expired at ${new Date(payload.exp * 1000).toISOString()}`)
    }

    // STEP 6: Validate issuer
    const validIssuer = 'https://jnfpxvodlmfukpagozcw.supabase.co/auth/v1'
    if (payload.iss !== validIssuer) {
      throw new Error(`Invalid issuer: expected ${validIssuer}, got ${payload.iss}`)
    }

    // STEP 7: Validate audience
    if (payload.aud !== 'authenticated') {
      throw new Error(`Invalid audience: expected authenticated, got ${payload.aud}`)
    }

    // STEP 8: Validate role
    if (payload.role !== 'authenticated') {
      throw new Error(`Invalid role: expected authenticated, got ${payload.role}`)
    }

    // STEP 9: Additional security checks
    if (payload.iat && payload.iat > now) {
      throw new Error('Token issued in the future (iat > now)')
    }

    return payload as JWTPayload
    
  } catch (error: any) {
    console.error('🔒 JWT validation failed:', {
      error: error.message,
      timestamp: new Date().toISOString()
    })
    throw new Error(`Authentication failed: ${error.message}`)
  }
}

export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  // SECURITY: Basic token format check
  if (!token || token.split('.').length !== 3) {
    return null
  }

  return token
}
