/**
 * Admin API: Get all orders with user info
 * GET /api/admin/orders
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

    // Get all orders with user info
    const ordersResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?select=*,users(email)&order=created_at.desc`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      }
    )

    if (!ordersResponse.ok) {
      console.error('Failed to fetch orders:', await ordersResponse.text())
      return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const orders = await ordersResponse.json()

    console.log(`✅ Admin ${user.email} fetched ${orders.length} orders`)

    return new Response(
      JSON.stringify(orders),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  } catch (error: any) {
    console.error('❌ Error fetching admin orders:', error)
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
