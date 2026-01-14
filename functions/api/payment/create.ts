/**
 * Payment API: Create Payment URL
 * POST /api/payment/create
 */

import { verifyJWT, extractToken } from '../../_lib/auth'
import { getUser } from '../../_lib/database'
import type { Env } from '../../_lib/database'
import { createPaymentUrl } from '../../_lib/vnpay'
import type { VNPayConfig, PaymentRequest } from '../../_lib/vnpay'

interface CreatePaymentRequest {
  plan: 'pro' | 'premium'
  returnUrl?: string
}

// Plan pricing (VND)
const PLAN_PRICING = {
  pro: {
    price: 299000, // 299k VND / month
    duration: 30, // days
    name: 'Gói Pro - 1 Tháng'
  },
  premium: {
    price: 999000, // 999k VND / month
    duration: 30, // days
    name: 'Gói Premium - 1 Tháng'
  }
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

    // Get user
    const user = await getUser(userId, env)
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Get request body
    const body = await request.json() as CreatePaymentRequest
    const { plan, returnUrl } = body

    // Validate plan
    if (!plan || !PLAN_PRICING[plan]) {
      return new Response(JSON.stringify({ error: 'Invalid plan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const planInfo = PLAN_PRICING[plan]

    // Generate order ID
    const orderId = `ORDER_${userId.substring(0, 8)}_${Date.now()}`

    // Create order in database
    const orderResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders`,
      {
        method: 'POST',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          id: orderId,
          user_id: userId,
          plan: plan,
          amount: planInfo.price,
          status: 'pending',
          created_at: new Date().toISOString(),
        }),
      }
    )

    if (!orderResponse.ok) {
      console.error('Failed to create order:', await orderResponse.text())
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Get client IP
    const ipAddr = request.headers.get('cf-connecting-ip') || '127.0.0.1'

    // VNPay config
    const vnpayConfig: VNPayConfig = {
      tmnCode: env.VNPAY_TMN_CODE,
      hashSecret: env.VNPAY_HASH_SECRET,
      url: env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      returnUrl: returnUrl || `${new URL(request.url).origin}/payment-result`,
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      orderId: orderId,
      amount: planInfo.price,
      orderInfo: `${planInfo.name} - ${user.email}`,
      orderType: 'billpayment',
      locale: 'vn',
      ipAddr: ipAddr,
    }

    // Generate payment URL
    const paymentUrl = createPaymentUrl(vnpayConfig, paymentRequest)

    console.log(`✅ Created payment for user ${userId}:`, {
      orderId,
      plan,
      amount: planInfo.price,
      paymentUrl: paymentUrl.substring(0, 100) + '...'
    })

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl,
        orderId,
        plan,
        amount: planInfo.price,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  } catch (error: any) {
    console.error('❌ Error creating payment:', error)
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
