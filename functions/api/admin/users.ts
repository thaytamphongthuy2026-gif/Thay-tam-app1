/**
 * Admin API: Get all users
 * GET /api/admin/users
 */

import { verifyJWT, extractToken } from '../../_lib/auth'
import { getUser } from '../../_lib/database'
import type { Env } from '../../_lib/database'

// Admin emails - TODO: Move to database or environment variable
const ADMIN_EMAILS = ['admin@thaytam.com', 'cuong@thaytam.com']

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context

  // CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    // Verify JWT
    const token = extractToken(request)
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing authorization token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const payload = await verifyJWT(token, env.SUPABASE_JWT_SECRET)
    const userId = payload.sub

    // Get user to check admin status
    const user = await getUser(userId, env)
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Get all users
    const usersResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?select=id,email,plan,quota_xem_ngay,quota_tu_vi,quota_chat,plan_expiry,created_at&order=created_at.desc`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      }
    )

    if (!usersResponse.ok) {
      console.error('Failed to fetch users:', await usersResponse.text())
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const users = await usersResponse.json()

    console.log(`✅ Admin ${user.email} fetched ${users.length} users`)

    return new Response(
      JSON.stringify(users),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  } catch (error: any) {
    console.error('❌ Error fetching admin users:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}
