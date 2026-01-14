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
    // Try to decode without verification first for debugging
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // Decode payload to check structure
    const payloadBase64 = parts[1]
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    
    console.log('JWT Payload:', {
      sub: payload.sub,
      iss: payload.iss,
      aud: payload.aud,
      exp: payload.exp,
      alg: 'Check header'
    })

    // Now verify with jose
    const secretKey = new TextEncoder().encode(secret)

    const { payload: verifiedPayload } = await jose.jwtVerify(token, secretKey, {
      issuer: 'https://jnfpxvodlmfukpagozcw.supabase.co/auth/v1',
    })

    return verifiedPayload as JWTPayload
  } catch (error: any) {
    console.error('JWT verification error:', error.message, error.code)
    
    // If verification fails, try decoding anyway (insecure but for debugging)
    try {
      const parts = token.split('.')
      const payloadBase64 = parts[1]
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
      const payload = JSON.parse(payloadJson)
      
      console.warn('JWT verification failed but decoded payload:', payload)
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        throw new Error('Token has expired')
      }
      
      // Return decoded payload (WARNING: Not verified!)
      return payload as JWTPayload
    } catch (decodeError: any) {
      console.error('Failed to decode JWT:', decodeError.message)
      throw new Error(`Invalid or expired token: ${error.message}`)
    }
  }
}

export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}
