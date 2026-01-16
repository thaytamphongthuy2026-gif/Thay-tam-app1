import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Copy, Check, AlertCircle } from 'lucide-react'

const BANK_INFO = {
  bankName: 'Techcombank',
  accountNumber: '70966668070',
  accountName: 'DAO QUOC CUONG'
}

const PLAN_INFO = {
  pro: {
    name: 'Gói Lộc Phát',
    price: 68000,
    duration: '1 tháng'
  },
  premium: {
    name: 'Gói Đại Cát', 
    price: 168000,
    duration: '1 tháng'
  }
}

export default function SimplePayment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const plan = searchParams.get('plan') as 'pro' | 'premium' | null

  const [copied, setCopied] = useState<string | null>(null)

  if (!plan || !PLAN_INFO[plan]) {
    navigate('/pricing')
    return null
  }

  const planInfo = PLAN_INFO[plan]
  // Use plan name (Gói Lộc Phát / Gói Đại Cát) instead of PRO/PREMIUM
  const transferContent = `THAYTAM ${planInfo.name.replace('Gói ', '')}`

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💳 Thanh Toán {planInfo.name}
          </h1>
          <p className="text-gray-600">
            Chuyển khoản và chúng tôi sẽ kích hoạt gói dịch vụ cho bạn
          </p>
        </div>

        {/* Payment Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Amount */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-6 text-white">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-2">Số tiền cần chuyển</p>
              <p className="text-4xl font-bold">
                {planInfo.price.toLocaleString('vi-VN')}đ
              </p>
              <p className="text-sm opacity-90 mt-2">{planInfo.duration}</p>
            </div>
          </div>

          {/* Bank Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              📱 Thông tin chuyển khoản
            </h3>

            {/* Bank Name */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Ngân hàng</p>
                <p className="font-semibold text-gray-900">{BANK_INFO.bankName}</p>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Số tài khoản</p>
                <p className="font-bold text-xl text-gray-900">{BANK_INFO.accountNumber}</p>
              </div>
              <button
                onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'account')}
                className="ml-4 p-2 hover:bg-gray-200 rounded-lg transition"
              >
                {copied === 'account' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Account Name */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Chủ tài khoản</p>
                <p className="font-semibold text-gray-900">{BANK_INFO.accountName}</p>
              </div>
            </div>

            {/* Transfer Content */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-yellow-700 font-medium">Nội dung chuyển khoản</p>
                <p className="font-bold text-lg text-yellow-900">{transferContent}</p>
              </div>
              <button
                onClick={() => copyToClipboard(transferContent, 'content')}
                className="ml-4 p-2 hover:bg-yellow-100 rounded-lg transition"
              >
                {copied === 'content' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-yellow-700" />
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-2">Hướng dẫn:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Mở app ngân hàng của bạn</li>
                  <li>Chuyển khoản đến số tài khoản trên</li>
                  <li>Nhập đúng số tiền: <strong>{planInfo.price.toLocaleString('vi-VN')}đ</strong></li>
                  <li>Nhập nội dung: <strong>{transferContent}</strong></li>
                  <li>Xác nhận chuyển khoản</li>
                  <li>Đợi admin xác nhận (5-30 phút)</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900 font-medium">
              ⚠️ <strong>LƯU Ý:</strong> Vui lòng nhập CHÍNH XÁC nội dung chuyển khoản để hệ thống tự động kích hoạt nhanh nhất.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/pricing')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Quay lại
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition"
          >
            Về Dashboard
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Cần hỗ trợ? Email: <a href="mailto:thaytamphongthuy2026@gmail.com" className="text-orange-600 hover:underline">thaytamphongthuy2026@gmail.com</a></p>
        </div>
      </div>
    </div>
  )
}
