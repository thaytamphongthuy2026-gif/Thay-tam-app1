import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/authContext'

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')
  const [orderInfo, setOrderInfo] = useState({
    orderId: '',
    amount: '',
    transactionId: '',
    responseCode: '',
  })

  useEffect(() => {
    // Extract VNPay response parameters
    const responseCode = searchParams.get('vnp_ResponseCode')
    const orderId = searchParams.get('vnp_TxnRef')
    const amount = searchParams.get('vnp_Amount')
    const transactionId = searchParams.get('vnp_TransactionNo')

    setOrderInfo({
      orderId: orderId || '',
      amount: amount ? (parseInt(amount) / 100).toLocaleString('vi-VN') : '',
      transactionId: transactionId || '',
      responseCode: responseCode || '',
    })

    // Check payment result
    if (responseCode === '00') {
      setStatus('success')
      setMessage('Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.')
      
      // Refresh user data to get updated plan
      setTimeout(() => {
        refreshUser()
      }, 2000)
    } else if (responseCode === '24') {
      setStatus('failed')
      setMessage('Bạn đã hủy thanh toán.')
    } else {
      setStatus('failed')
      setMessage(getErrorMessage(responseCode || ''))
    }
  }, [searchParams, refreshUser])

  const getErrorMessage = (code: string): string => {
    const messages: Record<string, string> = {
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên hệ ngân hàng để xác nhận)',
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
    return messages[code] || 'Thanh toán không thành công. Vui lòng thử lại sau.'
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Status Header */}
          <div
            className={`py-12 text-center ${
              status === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
          >
            {status === 'success' ? (
              <div>
                <div className="mb-4">
                  <svg
                    className="w-20 h-20 mx-auto text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Thanh toán thành công!</h1>
                <p className="text-white text-lg">Chúc mừng bạn đã nâng cấp tài khoản</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <svg
                    className="w-20 h-20 mx-auto text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Thanh toán không thành công</h1>
                <p className="text-white text-lg">{message}</p>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin giao dịch</h2>
            <div className="space-y-3">
              {orderInfo.orderId && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-gray-900">{orderInfo.orderId}</span>
                </div>
              )}
              {orderInfo.transactionId && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-semibold text-gray-900">{orderInfo.transactionId}</span>
                </div>
              )}
              {orderInfo.amount && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-gray-900">{orderInfo.amount} VNĐ</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`font-semibold ${
                    status === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {status === 'success' ? 'Thành công' : 'Thất bại'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {status === 'success' ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Về Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full py-3 px-6 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200"
                  >
                    Bắt đầu sử dụng ngay
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/payment')}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Về Dashboard
                  </button>
                </>
              )}
            </div>

            {/* Support Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm">
                  <p className="text-blue-900 font-semibold mb-1">Cần hỗ trợ?</p>
                  <p className="text-blue-700">
                    Nếu bạn có bất kỳ thắc mắc nào về giao dịch, vui lòng liên hệ:{' '}
                    <a href="mailto:support@thaytam.com" className="underline font-semibold">
                      support@thaytam.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
