/**
 * VNPay Payment Gateway Integration
 * Documentation: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
 */

import crypto from 'crypto'

export interface VNPayConfig {
  tmnCode: string // Terminal ID (Mã website)
  hashSecret: string // Secret key for HMAC SHA512
  url: string // VNPay payment URL
  returnUrl: string // Return URL after payment
}

export interface PaymentRequest {
  orderId: string
  amount: number // VND amount
  orderInfo: string
  orderType: string
  locale?: 'vn' | 'en'
  ipAddr: string
  bankCode?: string // Optional: specify bank
}

/**
 * Sort object keys alphabetically (VNPay requirement)
 */
function sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {}
  const keys = Object.keys(obj).sort()
  
  keys.forEach(key => {
    sorted[key] = obj[key]
  })
  
  return sorted
}

/**
 * Create HMAC SHA512 signature
 */
function createSignature(data: string, secretKey: string): string {
  const hmac = crypto.createHmac('sha512', secretKey)
  return hmac.update(Buffer.from(data, 'utf-8')).digest('hex')
}

/**
 * Generate VNPay payment URL
 */
export function createPaymentUrl(
  config: VNPayConfig,
  payment: PaymentRequest
): string {
  const date = new Date()
  const createDate = formatDate(date)
  const expireDate = formatDate(new Date(date.getTime() + 15 * 60 * 1000)) // 15 minutes

  let vnpParams: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: config.tmnCode,
    vnp_Amount: (payment.amount * 100).toString(), // VNPay requires amount * 100
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: payment.ipAddr,
    vnp_Locale: payment.locale || 'vn',
    vnp_OrderInfo: payment.orderInfo,
    vnp_OrderType: payment.orderType,
    vnp_ReturnUrl: config.returnUrl,
    vnp_TxnRef: payment.orderId,
    vnp_ExpireDate: expireDate,
  }

  // Optional: Add bank code
  if (payment.bankCode) {
    vnpParams.vnp_BankCode = payment.bankCode
  }

  // Sort params
  vnpParams = sortObject(vnpParams)

  // Build query string
  const signData = new URLSearchParams(vnpParams).toString()
  
  // Create signature
  const signature = createSignature(signData, config.hashSecret)
  
  // Add signature to params
  vnpParams.vnp_SecureHash = signature

  // Build final URL
  const paymentUrl = `${config.url}?${new URLSearchParams(vnpParams).toString()}`
  
  return paymentUrl
}

/**
 * Verify VNPay IPN (Instant Payment Notification) callback
 */
export function verifyIpnCall(
  vnpParams: Record<string, string>,
  secretKey: string
): { isValid: boolean; message: string } {
  const secureHash = vnpParams.vnp_SecureHash
  delete vnpParams.vnp_SecureHash
  delete vnpParams.vnp_SecureHashType

  // Sort params
  const sortedParams = sortObject(vnpParams)
  const signData = new URLSearchParams(sortedParams).toString()
  
  // Verify signature
  const checkSum = createSignature(signData, secretKey)
  
  if (secureHash === checkSum) {
    // Check response code
    const responseCode = vnpParams.vnp_ResponseCode
    
    if (responseCode === '00') {
      return {
        isValid: true,
        message: 'Payment successful'
      }
    } else {
      return {
        isValid: false,
        message: `Payment failed with code: ${responseCode}`
      }
    }
  } else {
    return {
      isValid: false,
      message: 'Invalid signature'
    }
  }
}

/**
 * Format date for VNPay (yyyyMMddHHmmss)
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}${month}${day}${hour}${minute}${second}`
}

/**
 * VNPay response codes
 */
export const VNPayResponseCodes: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ',
  '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
  '10': 'Thẻ/Tài khoản không đúng',
  '11': 'Thẻ/Tài khoản đã hết hạn',
  '12': 'Thẻ/Tài khoản bị khóa',
  '13': 'Sai mật khẩu thanh toán',
  '24': 'Khách hàng hủy giao dịch',
  '51': 'Tài khoản không đủ số dư',
  '65': 'Tài khoản đã vượt quá hạn mức giao dịch',
  '75': 'Ngân hàng thanh toán đang bảo trì',
  '79': 'Giao dịch vượt quá số lần thanh toán cho phép',
  '99': 'Lỗi không xác định',
}

/**
 * Get response message from code
 */
export function getResponseMessage(code: string): string {
  return VNPayResponseCodes[code] || 'Lỗi không xác định'
}
