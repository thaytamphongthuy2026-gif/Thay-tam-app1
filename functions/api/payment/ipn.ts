/**
 * Payment API: VNPay IPN Callback
 * GET /api/payment/ipn
 * 
 * This endpoint receives payment notifications from VNPay
 */

import type { Env } from '../../_lib/database'
import { verifyIpnCall, getResponseMessage } from '../../_lib/vnpay'

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context

  try {
    const url = new URL(request.url)
    const vnpParams: Record<string, string> = {}
    
    // Extract all VNPay parameters
    url.searchParams.forEach((value, key) => {
      vnpParams[key] = value
    })

    console.log('📥 Received VNPay IPN:', {
      orderId: vnpParams.vnp_TxnRef,
      amount: vnpParams.vnp_Amount,
      responseCode: vnpParams.vnp_ResponseCode
    })

    // Verify signature
    const verification = verifyIpnCall(vnpParams, env.VNPAY_HASH_SECRET)

    if (!verification.isValid) {
      console.error('❌ Invalid VNPay signature')
      return new Response(JSON.stringify({ RspCode: '97', Message: 'Invalid signature' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const orderId = vnpParams.vnp_TxnRef
    const responseCode = vnpParams.vnp_ResponseCode
    const transactionId = vnpParams.vnp_TransactionNo
    const amount = parseInt(vnpParams.vnp_Amount, 10) / 100 // Convert back to VND

    // Get order from database
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
      console.error('Failed to fetch order')
      return new Response(JSON.stringify({ RspCode: '01', Message: 'Order not found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const orders = await orderResponse.json()
    const order = orders[0]

    if (!order) {
      console.error('Order not found:', orderId)
      return new Response(JSON.stringify({ RspCode: '01', Message: 'Order not found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if already processed
    if (order.status === 'paid') {
      console.log('Order already processed:', orderId)
      return new Response(JSON.stringify({ RspCode: '00', Message: 'Already confirmed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Payment successful
    if (responseCode === '00') {
      // Update order status
      await fetch(
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
            status: 'paid',
            transaction_id: transactionId,
            paid_at: new Date().toISOString(),
          }),
        }
      )

      // Update user plan and quota
      const newExpiry = new Date()
      newExpiry.setDate(newExpiry.getDate() + 30) // 30 days from now

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
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            plan: order.plan,
            quota: quota,
            plan_expiry: newExpiry.toISOString(),
          }),
        }
      )

      console.log(`✅ Payment successful for order ${orderId}`, {
        userId: order.user_id,
        plan: order.plan,
        amount,
        transactionId
      })

      return new Response(JSON.stringify({ RspCode: '00', Message: 'Confirm Success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // Payment failed
      await fetch(
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
            status: 'failed',
            transaction_id: transactionId,
          }),
        }
      )

      console.log(`❌ Payment failed for order ${orderId}`, {
        responseCode,
        message: getResponseMessage(responseCode)
      })

      return new Response(JSON.stringify({ RspCode: '00', Message: 'Confirm Success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error: any) {
    console.error('❌ Error processing VNPay IPN:', error)
    return new Response(JSON.stringify({ RspCode: '99', Message: 'Unknown error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
