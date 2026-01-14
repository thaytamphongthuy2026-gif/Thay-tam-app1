import { verifyJWT, extractToken } from '../_lib/auth'
import { getUser } from '../_lib/database'
import type { Env } from '../_lib/database'

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context

  // Enable CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization',
      },
    })
  }

  try {
    // SECURITY: Validate JWT secret exists
    if (!env.SUPABASE_JWT_SECRET) {
      console.error('❌ SUPABASE_JWT_SECRET is missing!')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Extract and verify JWT token
    const token = extractToken(request)
    if (!token) {
      return new Response(JSON.stringify({ error: 'Thiếu token xác thực' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    console.log('🔒 Verifying JWT for quota check...')
    const payload = await verifyJWT(token, env.SUPABASE_JWT_SECRET)
    const userId = payload.sub
    console.log('✅ JWT verified for user:', userId)

    // Get user data
    const user = await getUser(userId, env)
    if (!user) {
      console.warn(`⚠️ User not found: ${userId}`)
      return new Response(JSON.stringify({ error: 'Không tìm thấy người dùng' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // SECURITY: Don't expose sensitive fields
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: sanitizedUser,
        quota: user.quota || { xemNgay: 0, tuVi: 0, chat: 0 },
        metadata: {
          timestamp: new Date().toISOString(),
          plan: user.plan
        }
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        },
      }
    )
  } catch (error: any) {
    console.error('❌ Error in quota function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}
