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
    const encoder = new TextEncoder()
    const secretKey = encoder.encode(secret)

    const { payload } = await jose.jwtVerify(token, secretKey, {
      issuer: 'https://jnfpxvodlmfukpagozcw.supabase.co/auth/v1',
    })

    return payload as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}
