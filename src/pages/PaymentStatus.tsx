import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface Order {
  id: string
  user_id: string
  plan: string
  amount: number
  status: string
  payment_method: string
  proof_image_url?: string
  admin_note?: string
  created_at: string
  updated_at: string
}

export default function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!orderId) {
      navigate('/')
      return
    }
    fetchOrderStatus()
    
    // Auto-refresh every 30 seconds if status is pending/uploaded
    const interval = setInterval(() => {
      if (order && ['pending', 'uploaded'].includes(order.status)) {
        fetchOrderStatus(true)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [orderId, navigate])

  const fetchOrderStatus = async (silent = false) => {
    if (!silent) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    setError(null)

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tải thông tin đơn hàng')
      }

      setOrder(data)
    } catch (err: any) {
      console.error('Fetch order error:', err)
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: 'fa-clock',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Chờ thanh toán',
          description: 'Vui lòng hoàn tất chuyển khoản và upload ảnh xác nhận'
        }
      case 'uploaded':
        return {
          icon: 'fa-hourglass-half',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Đang xác nhận',
          description: 'Admin đang xác nhận thanh toán của bạn. Thường mất 5-30 phút.'
        }
      case 'confirmed':
        return {
          icon: 'fa-check-circle',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Thanh toán thành công',
          description: 'Gói dịch vụ của bạn đã được kích hoạt thành công!'
        }
      case 'rejected':
        return {
          icon: 'fa-times-circle',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Thanh toán thất bại',
          description: 'Thanh toán không được chấp nhận. Vui lòng kiểm tra lại.'
        }
      case 'expired':
        return {
          icon: 'fa-exclamation-triangle',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Đơn hàng hết hạn',
          description: 'Đơn hàng đã quá 24 giờ và bị hủy tự động.'
        }
      default:
        return {
          icon: 'fa-question-circle',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Không xác định',
          description: 'Trạng thái đơn hàng không xác định'
        }
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'Gói Pro'
      case 'premium':
        return 'Gói Premium'
      default:
        return plan
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-6">{error || 'Không tìm thấy đơn hàng'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Status Header */}
        <div className={`${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-lg p-6 mb-6`}>
          <div className="text-center">
            <i className={`fas ${statusInfo.icon} ${statusInfo.color} text-5xl mb-4`}></i>
            <h1 className={`text-2xl font-bold ${statusInfo.color} mb-2`}>{statusInfo.title}</h1>
            <p className="text-gray-600">{statusInfo.description}</p>
            
            {refreshing && (
              <p className="text-sm text-gray-500 mt-2">
                <i className="fas fa-sync fa-spin mr-1"></i>
                Đang cập nhật...
              </p>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-file-invoice mr-2 text-orange-500"></i>
            Thông tin đơn hàng
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-mono font-semibold text-gray-800">{order.id}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Gói dịch vụ:</span>
              <span className="font-semibold text-gray-800">{getPlanName(order.plan)}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-semibold text-orange-600">{formatAmount(order.amount)}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-semibold text-gray-800">
                {order.payment_method === 'qr_code' ? 'Chuyển khoản QR Code' : order.payment_method}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Thời gian tạo:</span>
              <span className="text-gray-800">{formatDate(order.created_at)}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-600">Cập nhật lần cuối:</span>
              <span className="text-gray-800">{formatDate(order.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Proof Image */}
        {order.proof_image_url && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-image mr-2 text-orange-500"></i>
              Ảnh xác nhận
            </h2>
            <img 
              src={order.proof_image_url} 
              alt="Payment Proof" 
              className="w-full rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* Admin Note */}
        {order.admin_note && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-yellow-800 mb-2">
              <i className="fas fa-sticky-note mr-2"></i>
              Ghi chú từ Admin
            </h2>
            <p className="text-yellow-900">{order.admin_note}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {order.status === 'confirmed' && (
            <button
              onClick={() => navigate('/')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              <i className="fas fa-home mr-2"></i>
              Về trang chủ
            </button>
          )}

          {order.status === 'rejected' && (
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              <i className="fas fa-redo mr-2"></i>
              Thanh toán lại
            </button>
          )}

          {['pending', 'uploaded'].includes(order.status) && (
            <button
              onClick={() => fetchOrderStatus()}
              disabled={refreshing}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              <i className={`fas fa-sync ${refreshing ? 'fa-spin' : ''} mr-2`}></i>
              Làm mới trạng thái
            </button>
          )}

          <button
            onClick={() => navigate('/pricing')}
            className="w-full text-gray-600 hover:text-gray-800 py-2"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Quay lại trang giá
          </button>
        </div>

        {/* Auto-refresh Notice */}
        {['pending', 'uploaded'].includes(order.status) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800 text-center">
              <i className="fas fa-info-circle mr-2"></i>
              Trang này sẽ tự động cập nhật mỗi 30 giây
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
