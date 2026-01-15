import { Shield, FileText, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-gray-600">
              Cập nhật lần cuối: 15/01/2026
            </p>
          </div>

          {/* Disclaimer - PROMINENT */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ⚠️ MIỄN TRỪ TRÁCH NHIỆM QUAN TRỌNG
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Kết quả tư vấn của Thầy Tám chỉ mang tính chất tham khảo</strong>, 
                  dựa trên tri thức từ <strong>6 quyển sách phong thủy cổ truyền</strong> 
                  (Bát Trạch Minh Kinh, Ngọc Hạp Thông Thư, Tử Vi Đẩu Số, Tăng San Bốc Dịch, 
                  Hiệp Kỷ Biện Phương Thư). 
                  <br/><br/>
                  <strong>Chúng tôi KHÔNG chịu trách nhiệm</strong> cho bất kỳ quyết định nào 
                  của người dùng dựa trên kết quả này. Phong thủy và tử vi là nghệ thuật truyền thống, 
                  không thay thế cho tư vấn chuyên môn về tài chính, pháp lý, y tế, hoặc các lĩnh vực khác.
                  <br/><br/>
                  <strong>Vui lòng cân nhắc kỹ</strong> và tham khảo thêm ý kiến chuyên gia trước khi 
                  thực hiện bất kỳ thay đổi quan trọng nào trong cuộc sống.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giới Thiệu Dịch Vụ</h2>
              <p className="text-gray-700 leading-relaxed">
                Thầy Tám Phong Thủy là nền tảng tư vấn phong thủy sử dụng công nghệ trí tuệ nhân tạo (AI) 
                để trích xuất và tổng hợp kiến thức từ các sách phong thủy cổ truyền. Dịch vụ bao gồm:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Xem ngày tốt (khai trương, cưới hỏi, động thổ, nhập trạch)</li>
                <li>Xem tử vi năm 2026 (Ất Tỵ)</li>
                <li>Chat tư vấn phong thủy với Thầy Tám AI</li>
                <li>Các tính năng gamification: Số May Mắn, Xin Xăm, Test Duyên Số, Lì Xì Game</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Chấp Nhận Điều Khoản</h2>
              <p className="text-gray-700 leading-relaxed">
                Khi sử dụng dịch vụ Thầy Tám, bạn đồng ý với tất cả các điều khoản được nêu trong tài liệu này. 
                Nếu không đồng ý, vui lòng không sử dụng dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Tài Khoản Người Dùng</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Đăng ký:</strong> Bạn cần cung cấp email và mật khẩu hợp lệ để tạo tài khoản.</li>
                <li><strong>Bảo mật:</strong> Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
                <li><strong>Thông tin chính xác:</strong> Thông tin cá nhân (tên, ngày sinh, giới tính) cần chính xác để nhận tư vấn đúng.</li>
                <li><strong>Một tài khoản/người:</strong> Mỗi người chỉ được tạo một tài khoản.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Gói Dịch Vụ & Thanh Toán</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Các gói dịch vụ:</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Duyên Lành (Miễn phí):</strong> 3 lượt xem ngày, 1 lượt tử vi, 5 câu chat</li>
                    <li><strong>Lộc Phát (68,000 VNĐ/tháng):</strong> 30 lượt xem ngày, 10 lượt tử vi, 50 câu chat</li>
                    <li><strong>Đại Cát (168,000 VNĐ/tháng):</strong> Không giới hạn tất cả tính năng</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Thanh toán:</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Chấp nhận: VNPay, MoMo, chuyển khoản ngân hàng, thẻ tín dụng quốc tế</li>
                    <li>Thanh toán được xử lý qua cổng thanh toán bảo mật</li>
                    <li>Không hoàn tiền sau khi đã kích hoạt dịch vụ</li>
                    <li>Có thể hủy đăng ký bất cứ lúc nào (hiệu lực từ chu kỳ tiếp theo)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Quota & Giới Hạn Sử Dụng</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Reset quota:</strong> Gói Duyên Lành reset hàng ngày. Gói Lộc Phát reset hàng tháng.</li>
                <li><strong>Không chuyển nhượng:</strong> Quota không thể chuyển sang tháng sau hoặc tài khoản khác.</li>
                <li><strong>Rate limiting:</strong> Tối đa 60 requests/phút để đảm bảo chất lượng dịch vụ.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Nội Dung & Trí Tuệ Nhân Tạo</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Nguồn gốc:</strong> Tất cả tư vấn đều dựa trên 6 quyển sách phong thủy cổ truyền.</li>
                <li><strong>AI-generated:</strong> Kết quả được tạo bởi AI (Gemini 3 Flash Preview) dựa trên RAG (Retrieval-Augmented Generation).</li>
                <li><strong>Không đảm bảo:</strong> Chúng tôi không đảm bảo tính chính xác tuyệt đối của mọi kết quả.</li>
                <li><strong>Chỉ tham khảo:</strong> Không thay thế cho tư vấn chuyên môn trong các lĩnh vực khác.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Hành Vi Bị Cấm</h2>
              <p className="text-gray-700 mb-4">Người dùng KHÔNG được:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>Spam, gửi requests tự động bằng bot</li>
                <li>Chia sẻ tài khoản cho nhiều người dùng</li>
                <li>Reverse engineer, decompile hệ thống</li>
                <li>Sao chép, phân phối nội dung mà không có sự cho phép</li>
                <li>Gây tổn hại đến hệ thống hoặc người dùng khác</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sở Hữu Trí Tuệ</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Tất cả nội dung, thiết kế, code thuộc quyền sở hữu của Thầy Tám Phong Thủy</li>
                <li>Nội dung sách phong thủy thuộc quyền tác giả các sách gốc</li>
                <li>Logo, thương hiệu "Thầy Tám" được bảo hộ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Giới Hạn Trách Nhiệm</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  <strong>GIỚI HẠN TRÁCH NHIỆM TỐI ĐA:</strong> Trong mọi trường hợp, 
                  trách nhiệm của chúng tôi không vượt quá <strong>số tiền bạn đã thanh toán</strong> 
                  cho dịch vụ trong 30 ngày gần nhất.
                  <br/><br/>
                  Chúng tôi không chịu trách nhiệm cho:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                  <li>Thiệt hại trực tiếp, gián tiếp, ngẫu nhiên từ việc sử dụng dịch vụ</li>
                  <li>Mất mát lợi nhuận, doanh thu, dữ liệu</li>
                  <li>Quyết định cá nhân dựa trên kết quả tư vấn</li>
                  <li>Lỗi, gián đoạn dịch vụ do bên thứ ba (Cloudflare, Supabase, v.v.)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Thay Đổi Điều Khoản</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có quyền thay đổi điều khoản bất cứ lúc nào. Thay đổi sẽ có hiệu lực ngay khi đăng tải. 
                Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận điều khoản mới.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Luật Áp Dụng</h2>
              <p className="text-gray-700 leading-relaxed">
                Điều khoản này tuân theo pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Liên Hệ</h2>
              <p className="text-gray-700 leading-relaxed">
                Nếu có câu hỏi về điều khoản sử dụng, vui lòng liên hệ qua email: 
                <strong> thaytamphongthuy2026@gmail.com</strong>
              </p>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Chính Sách Bảo Mật
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
