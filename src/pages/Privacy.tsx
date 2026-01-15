import { Shield, Lock, Eye, Database, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-gray-600">
              Cập nhật lần cuối: 15/01/2026
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
            <div className="flex items-start space-x-3">
              <Lock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  🔒 CAM KẾT BẢO MẬT
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi cam kết <strong>bảo vệ tuyệt đối</strong> thông tin cá nhân của bạn. 
                  Thông tin chỉ được sử dụng để cung cấp dịch vụ phong thủy và 
                  <strong> KHÔNG BAO GIỜ</strong> chia sẻ cho bên thứ ba mà không có sự đồng ý của bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-purple-600" />
                1. Thông Tin Chúng Tôi Thu Thập
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">A. Thông tin bạn cung cấp:</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Đăng ký tài khoản:</strong> Email, mật khẩu (được mã hóa)</li>
                    <li><strong>Hồ sơ cá nhân:</strong> Họ tên, ngày sinh, giới tính, loại lịch (âm/dương)</li>
                    <li><strong>Câu hỏi tư vấn:</strong> Nội dung chat với Thầy Tám</li>
                    <li><strong>Thanh toán:</strong> Thông tin giao dịch (qua VNPay/MoMo - không lưu thẻ)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">B. Thông tin tự động thu thập:</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị</li>
                    <li><strong>Sử dụng:</strong> Tính năng bạn dùng, thời gian truy cập</li>
                    <li><strong>Cookies:</strong> Session cookies để duy trì đăng nhập</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-600" />
                2. Cách Chúng Tôi Sử Dụng Thông Tin
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Cung cấp dịch vụ:</strong> Xem ngày tốt, tử vi, chat phong thủy phù hợp với bạn</li>
                <li><strong>Cá nhân hóa:</strong> Tư vấn dựa trên ngày sinh, giới tính, mệnh của bạn</li>
                <li><strong>Quản lý tài khoản:</strong> Xác thực, phục hồi mật khẩu, quản lý quota</li>
                <li><strong>Thanh toán:</strong> Xử lý giao dịch, xuất hóa đơn</li>
                <li><strong>Cải thiện dịch vụ:</strong> Phân tích sử dụng, fix bug, nâng cấp tính năng</li>
                <li><strong>Bảo mật:</strong> Phát hiện gian lận, ngăn chặn spam/abuse</li>
                <li><strong>Thông báo:</strong> Email về quota, ưu đãi (có thể từ chối)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Chia Sẻ Thông Tin</h2>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-gray-700 font-semibold">
                    ❌ Chúng tôi <strong>KHÔNG BAO GIỜ</strong> bán thông tin cá nhân của bạn.
                  </p>
                </div>

                <p className="text-gray-700">Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Với sự đồng ý của bạn:</strong> Khi bạn cho phép rõ ràng</li>
                  <li><strong>Bên cung cấp dịch vụ:</strong>
                    <ul className="list-circle pl-6 mt-2 space-y-1">
                      <li>Supabase (database) - lưu trữ dữ liệu</li>
                      <li>Cloudflare Pages/Workers - hosting website</li>
                      <li>Google Gemini AI - xử lý chat (không lưu trữ lâu dài)</li>
                      <li>VNPay/MoMo - xử lý thanh toán</li>
                    </ul>
                  </li>
                  <li><strong>Yêu cầu pháp lý:</strong> Khi bắt buộc bởi pháp luật hoặc cơ quan chức năng</li>
                  <li><strong>Bảo vệ quyền lợi:</strong> Ngăn chặn gian lận, bảo vệ an ninh hệ thống</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bảo Mật Thông Tin</h2>
              <p className="text-gray-700 mb-4">Chúng tôi áp dụng các biện pháp bảo mật:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Mã hóa:</strong> HTTPS/TLS cho tất cả kết nối</li>
                <li><strong>Mật khẩu:</strong> Bcrypt hashing, không lưu plain text</li>
                <li><strong>JWT:</strong> Token-based authentication với expiry</li>
                <li><strong>Database:</strong> Supabase RLS (Row Level Security)</li>
                <li><strong>Rate limiting:</strong> Ngăn chặn brute force attacks</li>
                <li><strong>Monitoring:</strong> Theo dõi và cảnh báo hoạt động bất thường</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies & Tracking</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Chúng tôi sử dụng:</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Session cookies:</strong> Duy trì đăng nhập (cần thiết)</li>
                    <li><strong>Local storage:</strong> Cache JWT token, user preferences</li>
                    <li><strong>Analytics:</strong> Theo dõi lưu lượng truy cập (ẩn danh)</li>
                  </ul>
                </div>

                <p className="text-gray-700">
                  Bạn có thể tắt cookies trong trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Quyền Của Bạn</h2>
              <p className="text-gray-700 mb-4">Bạn có quyền:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Truy cập:</strong> Xem thông tin cá nhân của bạn (trang /profile)</li>
                <li><strong>Chỉnh sửa:</strong> Cập nhật họ tên, ngày sinh, giới tính</li>
                <li><strong>Xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu liên quan</li>
                <li><strong>Từ chối:</strong> Hủy đăng ký email marketing</li>
                <li><strong>Export:</strong> Xuất dữ liệu cá nhân (định dạng JSON/CSV)</li>
                <li><strong>Khiếu nại:</strong> Liên hệ nếu có vi phạm bảo mật</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Để thực hiện quyền của bạn:</strong> Liên hệ email 
                  <strong> thaytamphongthuy2026@gmail.com</strong> với tiêu đề 
                  "[QUYỀN CÁ NHÂN] + yêu cầu của bạn"
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Lưu Trữ Dữ Liệu</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Thời gian:</strong> Lưu trữ đến khi bạn yêu cầu xóa hoặc 2 năm không hoạt động</li>
                <li><strong>Vị trí:</strong> Dữ liệu lưu trên Supabase (Singapore) và Cloudflare (global CDN)</li>
                <li><strong>Backup:</strong> Sao lưu định kỳ để khôi phục khi cần</li>
                <li><strong>Xóa vĩnh viễn:</strong> Sau khi xóa tài khoản, dữ liệu sẽ bị xóa trong 30 ngày</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Trẻ Em</h2>
              <p className="text-gray-700 leading-relaxed">
                Dịch vụ dành cho người từ <strong>18 tuổi trở lên</strong>. 
                Chúng tôi không cố ý thu thập thông tin từ trẻ em dưới 18 tuổi. 
                Nếu phát hiện, chúng tôi sẽ xóa ngay lập tức.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Thay Đổi Chính Sách</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có thể cập nhật chính sách này. Thay đổi quan trọng sẽ được thông báo qua email. 
                "Cập nhật lần cuối" ở đầu trang cho biết phiên bản mới nhất.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Liên Hệ</h2>
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Nếu có câu hỏi về chính sách bảo mật:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="font-bold">📧 Email:</span>
                    <span>thaytamphongthuy2026@gmail.com</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="font-bold">🌐 Website:</span>
                    <span>https://thaytamphongthuy.com</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Điều Khoản Sử Dụng
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Trang Chủ
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
                Bảng Giá
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
