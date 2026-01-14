/**
 * Payment API: Upload Payment Proof
 * POST /api/payment/upload-proof
 */

import { verifyJWT, extractToken } from '../../_lib/auth'
import type { Env } from '../../_lib/database'

interface UploadProofRequest {
  orderId: string
  proofImage: string // Base64 or URL
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
    const userId = payload.sub

    // Get request body
    const body = await request.json() as UploadProofRequest
    const { orderId, proofImage, note } = body

    if (!orderId || !proofImage) {
      return new Response(JSON.stringify({ error: 'Missing orderId or proofImage' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Get order from database
    const orderResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&user_id=eq.${userId}&select=*`,
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

    // Check if order is still pending
    if (order.status !== 'pending') {
      return new Response(
        JSON.stringify({ 
          error: `Order status is ${order.status}. Cannot upload proof.`
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }

    // Update order with payment proof
    const updateResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          status: 'uploaded',
          metadata: {
            ...order.metadata,
            payment_proof: proofImage,
            proof_uploaded_at: new Date().toISOString(),
            user_note: note || ''
          }
        }),
      }
    )

    if (!updateResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to update order' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    console.log(`📤 Payment proof uploaded for order ${orderId}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đã tải lên bằng chứng thanh toán. Admin sẽ xác nhận trong vòng 5-30 phút.',
        orderId,
        status: 'uploaded'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  } catch (error: any) {
    console.error('❌ Error uploading proof:', error)
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
