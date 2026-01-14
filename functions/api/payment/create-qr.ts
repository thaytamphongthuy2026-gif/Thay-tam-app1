/**
 * Payment API: Create QR Code Payment
 * POST /api/payment/create-qr
 */

import { verifyJWT, extractToken } from '../../_lib/auth'
import { getUser } from '../../_lib/database'
import type { Env } from '../../_lib/database'
import { generatePaymentInstructions, type BankAccount } from '../../_lib/qrPayment'

interface CreateQRPaymentRequest {
  plan: 'pro' | 'premium'
}

// Plan pricing (VND)
const PLAN_PRICING = {
  pro: {
    price: 299000,
    duration: 30,
    name: 'Gói Pro - 1 Tháng'
  },
  premium: {
    price: 999000,
    duration: 30,
    name: 'Gói Premium - 1 Tháng'
  }
}

// Bank account configuration
// TODO: Replace with your actual bank account
const BANK_ACCOUNT: BankAccount = {
  bankId: '970422',  // MB Bank
  bankName: 'MB Bank',
  accountNumber: '0123456789',
  accountName: 'NGUYEN VAN A'
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
    const body = await request.json() as CreateQRPaymentRequest
    const { plan } = body

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
          payment_method: 'qr_code',
          created_at: new Date().toISOString(),
          metadata: {
            payment_type: 'qr_code',
            bank_account: BANK_ACCOUNT
          }
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

    // Generate QR code and payment instructions
    const paymentInstructions = generatePaymentInstructions({
      orderId,
      amount: planInfo.price,
      description: `${planInfo.name} - ${user.email}`,
      bankAccount: BANK_ACCOUNT
    })

    console.log(`✅ Created QR payment for user ${userId}:`, {
      orderId,
      plan,
      amount: planInfo.price
    })

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        plan,
        amount: planInfo.price,
        paymentMethod: 'qr_code',
        qrCode: paymentInstructions.qrUrl,
        bankInfo: paymentInstructions.bankInfo,
        transferInfo: paymentInstructions.transferInfo,
        instructions: {
          step1: 'Mở app ngân hàng của bạn',
          step2: 'Quét mã QR hoặc chuyển khoản thủ công',
          step3: 'Nhập CHÍNH XÁC số tiền và nội dung chuyển khoản',
          step4: 'Hoàn tất giao dịch',
          step5: 'Chụp màn hình xác nhận và upload',
          step6: 'Đợi admin xác nhận (thường trong 5-30 phút)'
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  } catch (error: any) {
    console.error('❌ Error creating QR payment:', error)
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
