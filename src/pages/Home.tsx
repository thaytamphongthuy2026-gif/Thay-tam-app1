import { Link } from 'react-router-dom'
import { MessageCircle, Calendar, Star, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold">
              Thầy Tám Phong Thủy 2026
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Tư vấn phong thủy chuyên nghiệp với công nghệ AI hiện đại. 
              Xem ngày tốt, xem tử vi, tư vấn trực tuyến 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Dùng thử miễn phí
              </Link>
              <Link
                to="/pricing"
                className="bg-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-400 transition"
              >
                Xem bảng giá
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Trải nghiệm phong thủy hiện đại với công nghệ AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tư vấn AI</h3>
              <p className="text-gray-600">
                Chat trực tiếp với Thầy Tám - chuyên gia phong thủy AI với 30 năm kinh nghiệm.
                Giải đáp mọi thắc mắc về phong thủy, tài lộc, sự nghiệp.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Xem ngày tốt</h3>
              <p className="text-gray-600">
                Chọn ngày khai trương, cưới hỏi, động thổ, xuất hành dựa trên lịch phong thủy.
                Phân tích Can Chi, Sao tốt xấu, Giờ hoàng đạo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Xem tử vi</h3>
              <p className="text-gray-600">
                Dự đoán vận mệnh năm 2026 dựa trên ngày giờ sinh. Phân tích tài lộc,
                sự nghiệp, tình duyên, sức khỏe chi tiết.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Thầy Tám?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nhanh chóng</h3>
              <p className="text-gray-600">
                Nhận tư vấn ngay lập tức, không cần chờ đợi
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bảo mật</h3>
              <p className="text-gray-600">
                Thông tin cá nhân được bảo vệ tuyệt đối
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chính xác</h3>
              <p className="text-gray-600">
                Dựa trên kiến thức phong thủy truyền thống kết hợp AI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Bắt đầu hành trình phong thủy của bạn
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Đăng ký ngay để nhận 3 lượt xem ngày tốt, 1 lượt xem tử vi và 10 câu hỏi miễn phí
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </section>
    </div>
  )
}
