import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  plan: string
  quota_xem_ngay: number
  quota_tu_vi: number
  quota_chat: number
  plan_expiry: string | null
  created_at: string
}

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
  users?: {
    email: string
  }
}

interface Stats {
  totalUsers: number
  totalOrders: number
  pendingOrders: number
  confirmedOrders: number
  totalRevenue: number
  freeUsers: number
  proUsers: number
  premiumUsers: number
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users'>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
    freeUsers: 0,
    proUsers: 0,
    premiumUsers: 0
  })

  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [verifyingOrder, setVerifyingOrder] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    const userEmail = localStorage.getItem('user_email')
    
    // Simple admin check - check if user email is admin
    // TODO: Replace with proper admin role check
    const ADMIN_EMAILS = ['admin@thaytam.com', 'cuong@thaytam.com']
    
    if (!token || !userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      navigate('/login')
      return
    }

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        navigate('/login')
        return
      }

      // Fetch orders with user info
      const ordersResponse = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders')
      }

      const ordersData = await ordersResponse.json()
      setOrders(ordersData)

      // Fetch users
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users')
      }

      const usersData = await usersResponse.json()
      setUsers(usersData)

      // Calculate stats
      const newStats: Stats = {
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        pendingOrders: ordersData.filter((o: Order) => o.status === 'pending' || o.status === 'uploaded').length,
        confirmedOrders: ordersData.filter((o: Order) => o.status === 'confirmed').length,
        totalRevenue: ordersData
          .filter((o: Order) => o.status === 'confirmed')
          .reduce((sum: number, o: Order) => sum + o.amount, 0),
        freeUsers: usersData.filter((u: User) => u.plan === 'free').length,
        proUsers: usersData.filter((u: User) => u.plan === 'pro').length,
        premiumUsers: usersData.filter((u: User) => u.plan === 'premium').length
      }

      setStats(newStats)
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPayment = async (orderId: string, action: 'confirm' | 'reject', note: string = '') => {
    setVerifyingOrder(orderId)

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          action,
          adminNote: note
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify payment')
      }

      // Refresh data
      await fetchData()
      setSelectedOrder(null)
      alert(`Đã ${action === 'confirm' ? 'xác nhận' : 'từ chối'} thanh toán thành công!`)
    } catch (err: any) {
      console.error('Verify error:', err)
      alert(err.message || 'Lỗi xác nhận thanh toán')
    } finally {
      setVerifyingOrder(null)
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ thanh toán' },
      uploaded: { color: 'bg-blue-100 text-blue-800', text: 'Chờ xác nhận' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Đã xác nhận' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Đã từ chối' },
      expired: { color: 'bg-gray-100 text-gray-800', text: 'Hết hạn' }
    }

    const badge = badges[status] || { color: 'bg-gray-100 text-gray-800', text: status }
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.text}</span>
  }

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      free: { color: 'bg-gray-100 text-gray-800', text: 'Free' },
      pro: { color: 'bg-blue-100 text-blue-800', text: 'Pro' },
      premium: { color: 'bg-purple-100 text-purple-800', text: 'Premium' }
    }

    const badge = badges[plan] || { color: 'bg-gray-100 text-gray-800', text: plan }
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.text}</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                <i className="fas fa-shield-alt mr-2 text-orange-500"></i>
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Quản lý người dùng và thanh toán</p>
            </div>
            <button
              onClick={() => fetchData()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              <i className="fas fa-sync mr-2"></i>
              Làm mới
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-chart-line mr-2"></i>
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Đơn hàng
                {stats.pendingOrders > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-users mr-2"></i>
                Người dùng
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                    <div className="text-3xl font-bold mb-2">{stats.totalUsers}</div>
                    <div className="text-blue-100">Tổng người dùng</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                    <div className="text-3xl font-bold mb-2">{stats.totalOrders}</div>
                    <div className="text-green-100">Tổng đơn hàng</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
                    <div className="text-3xl font-bold mb-2">{stats.pendingOrders}</div>
                    <div className="text-orange-100">Chờ xác nhận</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                    <div className="text-2xl font-bold mb-2">{formatAmount(stats.totalRevenue)}</div>
                    <div className="text-purple-100">Tổng doanh thu</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-2">{stats.freeUsers}</div>
                    <div className="text-gray-600">Free Users</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stats.proUsers}</div>
                    <div className="text-blue-600">Pro Users</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{stats.premiumUsers}</div>
                    <div className="text-purple-600">Premium Users</div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gói</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            Chưa có đơn hàng nào
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-mono">{order.id.substring(0, 20)}...</td>
                            <td className="px-4 py-3 text-sm">{order.users?.email || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">{getPlanBadge(order.plan)}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-orange-600">{formatAmount(order.amount)}</td>
                            <td className="px-4 py-3 text-sm">{getStatusBadge(order.status)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                            <td className="px-4 py-3 text-sm">
                              {order.status === 'uploaded' && (
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
                                >
                                  Xác nhận
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gói</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quota Ngày</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quota Tử Vi</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quota Chat</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hết hạn</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đăng ký</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            Chưa có người dùng nào
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{user.email}</td>
                            <td className="px-4 py-3 text-sm">{getPlanBadge(user.plan)}</td>
                            <td className="px-4 py-3 text-sm">{user.quota_xem_ngay}</td>
                            <td className="px-4 py-3 text-sm">{user.quota_tu_vi}</td>
                            <td className="px-4 py-3 text-sm">{user.quota_chat}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {user.plan_expiry ? formatDate(user.plan_expiry) : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Verification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Xác nhận thanh toán
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500">Mã đơn hàng</div>
                  <div className="font-mono font-semibold">{selectedOrder.id}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{selectedOrder.users?.email || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Gói dịch vụ</div>
                  <div>{getPlanBadge(selectedOrder.plan)}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Số tiền</div>
                  <div className="font-semibold text-orange-600">{formatAmount(selectedOrder.amount)}</div>
                </div>

                {selectedOrder.proof_image_url && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Ảnh xác nhận</div>
                    <img 
                      src={selectedOrder.proof_image_url} 
                      alt="Payment Proof" 
                      className="w-full rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const note = prompt('Ghi chú (tùy chọn):')
                    if (note !== null) {
                      handleVerifyPayment(selectedOrder.id, 'confirm', note)
                    }
                  }}
                  disabled={verifyingOrder === selectedOrder.id}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  <i className="fas fa-check mr-2"></i>
                  Xác nhận
                </button>

                <button
                  onClick={() => {
                    const note = prompt('Lý do từ chối:')
                    if (note) {
                      handleVerifyPayment(selectedOrder.id, 'reject', note)
                    }
                  }}
                  disabled={verifyingOrder === selectedOrder.id}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  <i className="fas fa-times mr-2"></i>
                  Từ chối
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  disabled={verifyingOrder === selectedOrder.id}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
