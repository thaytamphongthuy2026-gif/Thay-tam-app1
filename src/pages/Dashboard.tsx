import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'
import { MessageCircle, Calendar, Star, TrendingUp, Crown } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    )
  }

  const quota = user.quota || { xemNgay: 0, tuVi: 0, chat: 0 }
  const isPremium = user.plan === 'premium'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Xin chào, {user.name}!
              </h1>
              <p className="text-purple-100">
                Chào mừng bạn trở lại với Thầy Tám Phong Thủy
              </p>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6" />
                <span className="font-semibold text-lg capitalize">{user.plan}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quota Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Chat Quota */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-purple-600">
                {isPremium ? '∞' : quota.chat}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Tư vấn Chat</h3>
            <p className="text-sm text-gray-600">
              {isPremium ? 'Không giới hạn' : `${quota.chat} câu hỏi còn lại`}
            </p>
            <Link
              to="/chat"
              className="mt-4 block text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Bắt đầu chat
            </Link>
          </div>

          {/* Xem Ngay Quota */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-purple-600">
                {isPremium ? '∞' : quota.xemNgay}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Xem ngày tốt</h3>
            <p className="text-sm text-gray-600">
              {isPremium ? 'Không giới hạn' : `${quota.xemNgay} lượt còn lại`}
            </p>
            <Link
              to="/xem-ngay-tot"
              className="mt-4 block text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Xem ngày tốt
            </Link>
          </div>

          {/* Tu Vi Quota */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-purple-600">
                {isPremium ? '∞' : quota.tuVi}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Xem tử vi</h3>
            <p className="text-sm text-gray-600">
              {isPremium ? 'Không giới hạn' : `${quota.tuVi} lượt còn lại`}
            </p>
            <Link
              to="/tu-vi"
              className="mt-4 block text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Xem tử vi
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dịch vụ nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/lich-phong-thuy"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:shadow-lg transition"
            >
              <Calendar className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lịch phong thủy 2026</h3>
              <p className="text-gray-600">Xem lịch phong thủy chi tiết theo tháng</p>
            </Link>

            <Link
              to="/pricing"
              className="p-6 border-2 border-purple-200 bg-purple-50 rounded-xl hover:border-purple-600 hover:shadow-lg transition"
            >
              <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nâng cấp gói Premium</h3>
              <p className="text-gray-600">Sử dụng không giới hạn mọi tính năng</p>
            </Link>
          </div>
        </div>

        {/* Upgrade Banner - Show only for free users */}
        {user.plan === 'free' && (
          <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Nâng cấp lên Premium</h3>
                <p className="text-purple-100">
                  Sử dụng không giới hạn mọi tính năng chỉ với 299,000 VNĐ/tháng
                </p>
              </div>
              <Link
                to="/pricing"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
