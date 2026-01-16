import { useNavigate } from 'react-router-dom'
import { Star, Mail } from 'lucide-react'

export default function Footer() {
  const navigate = useNavigate()

  const handleLinkClick = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
              Phong thủy AI dựa trên 6 quyển sách phong thủy cổ truyền
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <div className="space-y-2">
              <button onClick={() => handleLinkClick('/chat')} className="block text-left text-gray-400 hover:text-white text-sm">
                Tư vấn trực tuyến
              </button>
              <button onClick={() => handleLinkClick('/xem-ngay-tot')} className="block text-left text-gray-400 hover:text-white text-sm">
                Xem ngày tốt
              </button>
              <button onClick={() => handleLinkClick('/tu-vi')} className="block text-left text-gray-400 hover:text-white text-sm">
                Xem tử vi
              </button>
              <button onClick={() => handleLinkClick('/lich-phong-thuy')} className="block text-left text-gray-400 hover:text-white text-sm">
                Lịch phong thủy
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <div className="space-y-2">
              <button onClick={() => handleLinkClick('/pricing')} className="block text-left text-gray-400 hover:text-white text-sm">
                Bảng giá
              </button>
              <button onClick={() => handleLinkClick('/blog')} className="block text-left text-gray-400 hover:text-white text-sm">
                Blog
              </button>
              <button onClick={() => handleLinkClick('/faq')} className="block text-left text-gray-400 hover:text-white text-sm">
                Câu hỏi thường gặp
              </button>
              <button onClick={() => handleLinkClick('/privacy-policy')} className="block text-left text-gray-400 hover:text-white text-sm">
                Chính sách bảo mật
              </button>
              <button onClick={() => handleLinkClick('/terms')} className="block text-left text-gray-400 hover:text-white text-sm">
                Điều khoản sử dụng
              </button>
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
                Tư vấn qua website hoặc gửi email để được hỗ trợ.
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
