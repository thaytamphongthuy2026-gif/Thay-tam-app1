import { Link } from 'react-router-dom'
import { Star, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Thầy Tám</span>
            </div>
            <p className="text-gray-400 text-sm">
              Tư vấn phong thủy chuyên nghiệp với hơn 30 năm kinh nghiệm
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <div className="space-y-2">
              <Link to="/chat" className="block text-gray-400 hover:text-white text-sm">
                Tư vấn trực tuyến
              </Link>
              <Link to="/xem-ngay-tot" className="block text-gray-400 hover:text-white text-sm">
                Xem ngày tốt
              </Link>
              <Link to="/tu-vi" className="block text-gray-400 hover:text-white text-sm">
                Xem tử vi
              </Link>
              <Link to="/lich-phong-thuy" className="block text-gray-400 hover:text-white text-sm">
                Lịch phong thủy
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <div className="space-y-2">
              <Link to="/pricing" className="block text-gray-400 hover:text-white text-sm">
                Bảng giá
              </Link>
              <a href="#" className="block text-gray-400 hover:text-white text-sm">
                Hướng dẫn sử dụng
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm">
                Câu hỏi thường gặp
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm">
                Chính sách bảo mật
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:thaytamphongthuy2026@gmail.com" className="hover:text-white">
                  thaytamphongthuy2026@gmail.com
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Hỗ trợ trực tuyến 24/7 qua website.<br />
                Gửi email để được tư vấn chuyên sâu.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Thầy Tám Phong Thủy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
