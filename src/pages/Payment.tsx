import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'

interface Plan {
  id: 'pro' | 'premium'
  name: string
  price: number
  duration: string
  features: string[]
  quota: {
    xemNgay: number
    tuVi: number
    chat: number
  }
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'Gói Pro',
    price: 299000,
    duration: '1 tháng',
    features: [
      '50 lượt Xem Ngày Tốt',
      '10 lượt Xem Tử Vi',
      '100 lượt Chat với Thầy Tám',
      'Lịch Phong Thủy chi tiết',
      'Hỗ trợ ưu tiên',
    ],
    quota: {
      xemNgay: 50,
      tuVi: 10,
      chat: 100,
    },
  },
  {
    id: 'premium',
    name: 'Gói Premium',
    price: 999000,
    duration: '1 tháng',
    features: [
      '999 lượt Xem Ngày Tốt (Không giới hạn)',
      '999 lượt Xem Tử Vi (Không giới hạn)',
      '999 lượt Chat với Thầy Tám (Không giới hạn)',
      'Lịch Phong Thủy chi tiết',
      'Hỗ trợ ưu tiên 24/7',
      'Tư vấn chuyên sâu',
    ],
    quota: {
      xemNgay: 999,
      tuVi: 999,
      chat: 999,
    },
    popular: true,
  },
]

export default function Payment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'premium'>('premium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    if (!user) {
      navigate('/login?redirect=/payment')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login?redirect=/payment')
        return
      }

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: selectedPlan,
          returnUrl: `${window.location.origin}/payment-result`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tạo thanh toán')
      }

      // Redirect to VNPay payment page
      window.location.href = data.paymentUrl
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nâng cấp tài khoản
          </h1>
          <p className="text-lg text-gray-600">
            Chọn gói phù hợp để trải nghiệm đầy đủ tính năng
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? 'ring-4 ring-purple-500 transform scale-105'
                  : 'hover:shadow-xl hover:scale-102'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Phổ biến nhất
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-gray-500 ml-2">/ {plan.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {selectedPlan === plan.id && (
                  <div className="text-center">
                    <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Đã chọn
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Button */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Tóm tắt đơn hàng
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Gói đã chọn:</span>
                <span className="font-semibold">
                  {PLANS.find((p) => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Thời hạn:</span>
                <span className="font-semibold">
                  {PLANS.find((p) => p.id === selectedPlan)?.duration}
                </span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Tổng cộng:</span>
                <span className="text-purple-600">
                  {formatPrice(PLANS.find((p) => p.id === selectedPlan)?.price || 0)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <>
                  <span className="mr-2">💳</span>
                  Thanh toán ngay
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Bằng cách thanh toán, bạn đồng ý với{' '}
              <a href="#" className="text-purple-600 hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              của chúng tôi
            </p>
          </div>

          {/* Security Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Thanh toán an toàn</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Mã hóa SSL</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span>VNPay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
