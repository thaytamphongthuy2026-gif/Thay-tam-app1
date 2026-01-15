import { Link } from 'react-router-dom'
import { MessageCircle, Calendar, Star, TrendingUp, Crown, Gift, Lock } from 'lucide-react'
import { useAuth } from '../lib/authContext'

export default function Dashboard() {
  const { user, loading } = useAuth()

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
  
  // Plan detection
  const isPremium = user.plan === 'premium' // Đại Cát
  const isPro = user.plan === 'pro' // Lộc Phát
  const isFree = user.plan === 'free' // Duyên Lành
  
  // Plan display
  const planName = isPremium ? 'Đại Cát' : isPro ? 'Lộc Phát' : 'Duyên Lành'
  const planColor = isPremium ? 'yellow' : isPro ? 'purple' : 'gray'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className={`bg-gradient-to-r ${
          isPremium ? 'from-yellow-500 to-orange-500' :
          isPro ? 'from-purple-600 to-purple-800' :
          'from-gray-500 to-gray-700'
        } rounded-xl shadow-lg p-8 text-white mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Xin chào, {user.name}!
              </h1>
              <p className={isPremium ? 'text-yellow-100' : isPro ? 'text-purple-100' : 'text-gray-200'}>
                Gói hiện tại: <strong>{planName}</strong>
              </p>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6" />
                <span className="font-semibold text-lg">{planName}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lịch Phong Thủy - All plans */}
            <Link
              to="/lich-phong-thuy"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:shadow-lg transition"
            >
              <Calendar className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lịch Phong Thủy 2026</h3>
              <p className="text-gray-600">Xem lịch phong thủy chi tiết theo tháng</p>
              <span className="inline-block mt-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                TẤT CẢ GÓI
              </span>
            </Link>

            {/* Xông Đất - Lộc Phát & Đại Cát only */}
            {(isPro || isPremium) ? (
              <Link
                to="/xong-dat"
                className="p-6 border-2 border-orange-200 bg-orange-50 rounded-xl hover:border-orange-600 hover:shadow-lg transition"
              >
                <Gift className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mời Xông Đất Tết</h3>
                <p className="text-gray-600">Tìm người xông nhà may mắn năm 2026</p>
                <span className="inline-block mt-3 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                  {isPremium ? 'ĐẠI CÁT' : 'LỘC PHÁT'}
                </span>
              </Link>
            ) : (
              <div className="p-6 border-2 border-gray-200 bg-gray-50 rounded-xl opacity-60 relative">
                <Lock className="absolute top-4 right-4 w-6 h-6 text-gray-400" />
                <Gift className="w-10 h-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">Mời Xông Đất Tết</h3>
                <p className="text-gray-500">Nâng cấp lên Lộc Phát hoặc Đại Cát</p>
                <Link
                  to="/pricing"
                  className="inline-block mt-3 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold hover:bg-purple-200"
                >
                  🔓 NÂNG CẤP
                </Link>
              </div>
            )}

            {/* Nâng cấp gói */}
            {!isPremium && (
              <Link
                to="/pricing"
                className="p-6 border-2 border-purple-200 bg-purple-50 rounded-xl hover:border-purple-600 hover:shadow-lg transition"
              >
                <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isFree ? 'Nâng cấp lên Lộc Phát' : 'Nâng cấp lên Đại Cát'}
                </h3>
                <p className="text-gray-600">
                  {isFree ? 'Mở khóa tính năng Xông Đất & nhiều hơn' : 'Sử dụng không giới hạn'}
                </p>
                <span className="inline-block mt-3 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  {isFree ? '68K/THÁNG' : '168K/THÁNG'}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Upgrade Banner - Show for free & pro users */}
        {!isPremium && (
          <div className={`mt-8 bg-gradient-to-r ${
            isFree ? 'from-purple-500 to-pink-500' : 'from-yellow-500 to-orange-500'
          } rounded-xl shadow-lg p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {isFree ? 'Nâng cấp lên Lộc Phát' : 'Nâng cấp lên Đại Cát'}
                </h3>
                <p className={isFree ? 'text-purple-100' : 'text-yellow-100'}>
                  {isFree ? 
                    'Mở khóa tính năng Xông Đất, tăng quota - Chỉ 68,000 VNĐ/tháng' :
                    'Sử dụng không giới hạn mọi tính năng - Chỉ 168,000 VNĐ/tháng'
                  }
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
