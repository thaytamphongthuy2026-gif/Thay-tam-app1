/**
 * QR Code Payment Integration
 * Using VietQR standard for Vietnamese banks
 */

export interface BankAccount {
  bankId: string        // Bank ID (VietQR standard)
  bankName: string      // Bank name (display)
  accountNumber: string // Account number
  accountName: string   // Account holder name
}

export interface QRPaymentRequest {
  orderId: string
  amount: number
  description: string
  bankAccount: BankAccount
}

/**
 * Generate VietQR payment link
 * Standard: https://www.vietqr.io/
 */
export function generateVietQR(request: QRPaymentRequest): string {
  const { orderId, amount, description, bankAccount } = request
  
  // VietQR API format
  const qrContent = {
    accountNo: bankAccount.accountNumber,
    accountName: bankAccount.accountName,
    acqId: bankAccount.bankId,
    amount: amount,
    addInfo: `${description} - Ma GD: ${orderId}`,
    format: 'text',
    template: 'compact'
  }
  
  // Build VietQR URL
  const qrUrl = `https://img.vietqr.io/image/${qrContent.acqId}-${qrContent.accountNo}-${qrContent.template}.png?amount=${qrContent.amount}&addInfo=${encodeURIComponent(qrContent.addInfo)}&accountName=${encodeURIComponent(qrContent.accountName)}`
  
  return qrUrl
}

/**
 * Generate payment instructions
 */
export function generatePaymentInstructions(request: QRPaymentRequest): {
  qrUrl: string
  bankInfo: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  transferInfo: {
    amount: string
    description: string
    orderId: string
  }
} {
  const { orderId, amount, description, bankAccount } = request
  
  return {
    qrUrl: generateVietQR(request),
    bankInfo: {
      bankName: bankAccount.bankName,
      accountNumber: bankAccount.accountNumber,
      accountName: bankAccount.accountName
    },
    transferInfo: {
      amount: amount.toLocaleString('vi-VN') + ' VNĐ',
      description: description,
      orderId: orderId
    }
  }
}

/**
 * Bank list (popular Vietnamese banks)
 */
export const SUPPORTED_BANKS = {
  VCB: { id: '970436', name: 'Vietcombank' },
  TCB: { id: '970407', name: 'Techcombank' },
  MB: { id: '970422', name: 'MB Bank' },
  VTB: { id: '970415', name: 'VietinBank' },
  ACB: { id: '970416', name: 'ACB' },
  TPB: { id: '970423', name: 'TPBank' },
  BIDV: { id: '970418', name: 'BIDV' },
  VPB: { id: '970432', name: 'VPBank' },
  AGRI: { id: '970405', name: 'Agribank' },
  SCB: { id: '970429', name: 'SCB' }
}

/**
 * Payment verification statuses
 */
export enum PaymentVerificationStatus {
  PENDING = 'pending',           // Waiting for payment
  UPLOADED = 'uploaded',         // Screenshot uploaded
  VERIFYING = 'verifying',       // Admin verifying
  CONFIRMED = 'confirmed',       // Payment confirmed
  REJECTED = 'rejected'          // Payment rejected
}

/**
 * Parse transfer description to extract order ID
 */
export function extractOrderId(description: string): string | null {
  // Match patterns like: "Ma GD: ORDER_xxx" or "ORDER_xxx"
  const patterns = [
    /Ma GD:\s*([A-Z0-9_-]+)/i,
    /(ORDER_[A-Z0-9_-]+)/i
  ]
  
  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(
  expectedAmount: number,
  actualAmount: number,
  tolerance: number = 0 // Allow exact match only by default
): boolean {
  const diff = Math.abs(expectedAmount - actualAmount)
  return diff <= tolerance
}
