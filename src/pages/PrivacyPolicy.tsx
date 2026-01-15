import { useEffect } from 'react'
import { Shield, Lock, Eye, Database, Mail, UserCheck } from 'lucide-react'

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Chính Sách Bảo Mật - Thầy Tám Phong Thủy'
    
    // SEO meta tags
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Chính sách bảo mật thông tin cá nhân tại Thầy Tám Phong Thủy. Cam kết bảo vệ dữ liệu người dùng theo chuẩn GDPR.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Chính Sách Bảo Mật</h1>
              <p className="text-purple-100 mt-1">Cập nhật lần cuối: 15/01/2026</p>
            </div>
          </div>
          <p className="text-lg text-purple-50">
            Thầy Tám Phong Thủy cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. 
            Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Thông Tin Chúng Tôi Thu Thập</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin cá nhân:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Email (để tạo tài khoản và gửi thông báo)</li>
                  <li>Họ và tên (để cá nhân hóa dịch vụ)</li>
                  <li>Ngày sinh, giới tính (để tính toán phong thủy chính xác)</li>
                  <li>Loại lịch (âm/dương) để chuyển đổi ngày sinh</li>
                </ul>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">Dữ liệu sử dụng:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Lịch sử sử dụng dịch vụ (xem ngày tốt, tử vi, chat)</li>
                  <li>Thông tin thanh toán (qua cổng thanh toán bên thứ ba)</li>
                  <li>Cookies và dữ liệu phiên làm việc</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-green-600">✓</span> Mục đích chính
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Cung cấp dịch vụ tư vấn phong thủy</li>
                  <li>• Cá nhân hóa trải nghiệm người dùng</li>
                  <li>• Xử lý thanh toán và quản lý gói dịch vụ</li>
                  <li>• Gửi thông báo quan trọng về tài khoản</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">ℹ</span> Cải thiện dịch vụ
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Phân tích xu hướng sử dụng dịch vụ</li>
                  <li>• Cải thiện độ chính xác AI phong thủy</li>
                  <li>• Phát triển tính năng mới</li>
                  <li>• Hỗ trợ khách hàng hiệu quả hơn</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Bảo Mật Thông Tin</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">🔐 Các biện pháp bảo mật:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-green-900 mb-1">✓ Mã hóa dữ liệu</p>
                    <p className="text-sm text-gray-700">SSL/TLS cho mọi kết nối</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-900 mb-1">✓ Xác thực bảo mật</p>
                    <p className="text-sm text-gray-700">Email verification bắt buộc</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-900 mb-1">✓ Database an toàn</p>
                    <p className="text-sm text-gray-700">Supabase with Row Level Security</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-900 mb-1">✓ Backup định kỳ</p>
                    <p className="text-sm text-gray-700">Sao lưu dữ liệu hàng ngày</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Lưu ý:</strong> Không có hệ thống nào an toàn 100%. 
                  Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn ngành để bảo vệ dữ liệu của bạn.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Quyền Của Bạn</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition">
                <h3 className="font-semibold text-purple-900 mb-2">📋 Truy cập</h3>
                <p className="text-sm text-gray-700">Xem toàn bộ thông tin cá nhân của bạn</p>
              </div>
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition">
                <h3 className="font-semibold text-purple-900 mb-2">✏️ Chỉnh sửa</h3>
                <p className="text-sm text-gray-700">Cập nhật hoặc sửa thông tin bất kỳ lúc nào</p>
              </div>
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition">
                <h3 className="font-semibold text-purple-900 mb-2">🗑️ Xóa tài khoản</h3>
                <p className="text-sm text-gray-700">Yêu cầu xóa vĩnh viễn dữ liệu của bạn</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Để thực hiện các quyền trên, vui lòng liên hệ: 
                <a href="mailto:thaytamphongthuy2026@gmail.com" className="text-purple-600 font-semibold ml-1 hover:underline">
                  thaytamphongthuy2026@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Cookies và Tracking</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Chúng tôi sử dụng cookies để:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ghi nhớ phiên đăng nhập của bạn</li>
                <li>Lưu trữ tùy chọn ngôn ngữ và giao diện</li>
                <li>Phân tích lưu lượng truy cập (Google Analytics)</li>
                <li>Cải thiện trải nghiệm người dùng</li>
              </ul>
              <p className="text-sm bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                Bạn có thể vô hiệu hóa cookies trong cài đặt trình duyệt, nhưng một số tính năng có thể không hoạt động.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">6. Chia Sẻ Thông Tin</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900 mb-2">❌ Chúng tôi KHÔNG bao giờ:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-gray-700">
                  <li>Bán thông tin cá nhân của bạn cho bên thứ ba</li>
                  <li>Chia sẻ dữ liệu với các công ty quảng cáo</li>
                  <li>Sử dụng thông tin cho mục đích không liên quan</li>
                </ul>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">✓ Chúng tôi chỉ chia sẻ với:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm text-gray-700">
                  <li>Supabase (lưu trữ database) - đã ký hợp đồng bảo mật</li>
                  <li>Google Gemini API (xử lý AI) - chỉ nội dung câu hỏi, không lưu trữ</li>
                  <li>Cloudflare (hosting) - chỉ dữ liệu kỹ thuật cần thiết</li>
                  <li>Cơ quan pháp luật (nếu có yêu cầu hợp pháp)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">7. Lưu Trữ và Xóa Dữ Liệu</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Thời gian lưu trữ:</strong> Chúng tôi lưu trữ thông tin của bạn trong khi tài khoản còn hoạt động. 
                Sau khi bạn xóa tài khoản, dữ liệu sẽ được xóa vĩnh viễn trong vòng 30 ngày.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-semibold mb-2">Để xóa tài khoản:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                  <li>Đăng nhập vào tài khoản của bạn</li>
                  <li>Vào mục "Thông tin cá nhân"</li>
                  <li>Nhấn "Xóa tài khoản" ở cuối trang</li>
                  <li>Xác nhận qua email</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Liên Hệ</h2>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ:
              </p>
              <div className="flex items-center gap-3 text-purple-700">
                <Mail className="w-5 h-5" />
                <a href="mailto:thaytamphongthuy2026@gmail.com" className="font-semibold hover:underline">
                  thaytamphongthuy2026@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Last Update */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Chính sách này có hiệu lực từ ngày 15/01/2026 và có thể được cập nhật định kỳ. 
              Mọi thay đổi quan trọng sẽ được thông báo qua email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
