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
    price: 68000,  // Lộc Phát
    duration: 30,
    name: 'Gói Lộc Phát - 1 Tháng'
  },
  premium: {
    price: 168000,  // Đại Cát
    duration: 30,
    name: 'Gói Đại Cát - 1 Tháng'
  }
}

// Bank account configuration - Techcombank
const BANK_ACCOUNT: BankAccount = {
  bankId: '970407',  // Techcombank
  bankName: 'Techcombank',
  accountNumber: '70966668070',
  accountName: 'DAO QUOC CUONG'
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
    console.log('📝 Creating order:', {
      orderId,
      userId,
      plan,
      amount: planInfo.price,
      supabaseUrl: env.SUPABASE_URL?.substring(0, 30) + '...',
      hasServiceKey: !!env.SUPABASE_SERVICE_KEY
    })

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
      const errorText = await orderResponse.text()
      console.error('❌ Failed to create order:', {
        status: orderResponse.status,
        statusText: orderResponse.statusText,
        error: errorText,
        orderId,
        userId,
        plan,
        headers: Object.fromEntries(orderResponse.headers.entries())
      })
      
      // Check if it's RLS issue
      if (errorText.includes('RLS') || errorText.includes('policy') || orderResponse.status === 403) {
        return new Response(JSON.stringify({ 
          error: 'Database permission error. Please check Supabase RLS policies.',
          details: 'The service role should bypass RLS. Check if SUPABASE_SERVICE_KEY is correct.',
          technicalError: errorText,
          status: orderResponse.status
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
      }
      
      // Return detailed error for debugging
      return new Response(JSON.stringify({ 
        error: 'Failed to create order',
        details: errorText,
        status: orderResponse.status,
        hint: 'Check Cloudflare Worker logs for full error details'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const createdOrder = await orderResponse.json()
    console.log('✅ Order created successfully:', createdOrder)

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
