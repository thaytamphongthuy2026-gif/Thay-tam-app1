/**
 * Order API: Get order details
 * GET /api/orders/:orderId
 */

import { verifyJWT, extractToken } from '../../_lib/auth'
import type { Env } from '../../_lib/database'

export async function onRequestGet(context: { request: Request; env: Env; params: { orderId: string } }) {
  const { request, env, params } = context
  const { orderId } = params

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

    // Get order from database
    const orderResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&user_id=eq.${userId}`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      }
    )

    if (!orderResponse.ok) {
      console.error('Failed to fetch order:', await orderResponse.text())
      return new Response(JSON.stringify({ error: 'Failed to fetch order' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const orders = await orderResponse.json()
    
    if (!orders || orders.length === 0) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const order = orders[0]

    console.log(`✅ Fetched order ${orderId} for user ${userId}:`, order.status)

    return new Response(
      JSON.stringify(order),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  } catch (error: any) {
    console.error('❌ Error fetching order:', error)
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
