/**
 * Admin API: Verify Payment
 * POST /api/admin/verify-payment
 * 
 * Admin confirms or rejects payment
 */

import { verifyJWT, extractToken } from '../../_lib/auth'
import { getUser } from '../../_lib/database'
import type { Env } from '../../_lib/database'

// Admin emails - TODO: Move to database or environment variable
const ADMIN_EMAILS = [
  'admin@thaytam.com', 
  'cuong@thaytam.com',
  'thaytamphongthuy2026@gmail.com'
]

interface VerifyPaymentRequest {
  orderId: string
  action: 'confirm' | 'reject'
  note?: string
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context

  // CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const adminId = payload.sub

    // Check if user is admin
    const admin = await getUser(adminId, env)
    if (!admin || !ADMIN_EMAILS.includes(admin.email)) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Admin access required.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Get request body
    const body = await request.json() as VerifyPaymentRequest
    const { orderId, action, note } = body

    if (!orderId || !action) {
      return new Response(JSON.stringify({ error: 'Missing orderId or action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Get order
    const orderResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=*`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      }
    )

    if (!orderResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch order' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const orders = await orderResponse.json()
    const order = orders[0]

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    if (action === 'confirm') {
      // Confirm payment
      await fetch(
        `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'paid',
            paid_at: new Date().toISOString(),
            metadata: {
              ...order.metadata,
              verified_by: adminId,
              verified_at: new Date().toISOString(),
              admin_note: note || ''
            }
          }),
        }
      )

      // Upgrade user plan
      const newExpiry = new Date()
      newExpiry.setDate(newExpiry.getDate() + 30)

      const quota = order.plan === 'pro'
        ? { xemNgay: 50, tuVi: 10, chat: 100 }
        : { xemNgay: 999, tuVi: 999, chat: 999 }

      await fetch(
        `${env.SUPABASE_URL}/rest/v1/users?id=eq.${order.user_id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: order.plan,
            quota: quota,
            plan_expiry: newExpiry.toISOString(),
          }),
        }
      )

      console.log(`✅ Payment confirmed for order ${orderId} by admin ${adminId}`)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment confirmed and user upgraded',
          orderId,
          status: 'paid'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    } else {
      // Reject payment
      await fetch(
        `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'failed',
            metadata: {
              ...order.metadata,
              verified_by: adminId,
              verified_at: new Date().toISOString(),
              admin_note: note || 'Payment rejected',
              rejection_reason: note
            }
          }),
        }
      )

      console.log(`❌ Payment rejected for order ${orderId} by admin ${adminId}`)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment rejected',
          orderId,
          status: 'failed'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }
  } catch (error: any) {
    console.error('❌ Error verifying payment:', error)
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
