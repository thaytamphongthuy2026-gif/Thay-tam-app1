import { useEffect, useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Search, Star, CreditCard, Shield, Zap } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  // Tài khoản & Đăng ký
  {
    category: 'Tài khoản',
    question: 'Làm sao để tạo tài khoản?',
    answer: 'Nhấn nút "Đăng ký" ở góc trên cùng, nhập email và mật khẩu. Sau đó kiểm tra email để xác nhận tài khoản. Bạn sẽ nhận được gói Duyên Lành (miễn phí) ngay lập tức với 3 lượt xem ngày tốt, 1 lượt xem tử vi và 10 câu hỏi chat mỗi ngày.'
  },
  {
    category: 'Tài khoản',
    question: 'Tôi quên mật khẩu, phải làm sao?',
    answer: 'Nhấn "Quên mật khẩu?" ở trang đăng nhập, nhập email của bạn. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email. Link này có hiệu lực trong 1 giờ.'
  },
  {
    category: 'Tài khoản',
    question: 'Tôi có thể thay đổi thông tin cá nhân không?',
    answer: 'Có, bạn vào mục "Thông tin cá nhân" để cập nhật họ tên, ngày sinh, giới tính và loại lịch (âm/dương). Thông tin này sẽ được lưu và tự động điền vào các tính năng khác.'
  },

  // Gói dịch vụ
  {
    category: 'Gói dịch vụ',
    question: 'Có những gói dịch vụ nào?',
    answer: 'Chúng tôi có 3 gói:\n\n• Duyên Lành (Miễn phí): 3 lượt xem ngày tốt/ngày, 1 lượt tử vi/ngày, 10 câu chat/ngày\n\n• Lộc Phát (68,000đ/tháng): 10 lượt xem ngày tốt/ngày, 3 lượt tử vi/ngày, 30 câu chat/ngày + Tính năng Xông Đất Tết\n\n• Đại Cát (168,000đ/tháng): Không giới hạn mọi tính năng'
  },
  {
    category: 'Gói dịch vụ',
    question: 'Quota có reset hàng ngày không?',
    answer: 'Có, quota của bạn sẽ tự động reset về mức tối đa vào lúc 00:00 mỗi ngày (theo giờ Việt Nam). Ví dụ: nếu bạn dùng hết 3 lượt xem ngày tốt hôm nay, ngày mai bạn sẽ có lại 3 lượt mới.'
  },
  {
    category: 'Gói dịch vụ',
    question: 'Tôi có thể hủy gói trả phí không?',
    answer: 'Có, bạn có thể hủy bất kỳ lúc nào. Gói của bạn sẽ tiếp tục hoạt động đến hết chu kỳ thanh toán hiện tại (30 ngày). Sau đó tài khoản sẽ tự động chuyển về gói Duyên Lành (miễn phí).'
  },
  {
    category: 'Gói dịch vụ',
    question: 'Có được hoàn tiền không?',
    answer: 'Chúng tôi có chính sách hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ. Sau 7 ngày, chúng tôi không hoàn tiền nhưng bạn có thể hủy và không bị tính phí tháng sau.'
  },

  // Tính năng
  {
    category: 'Tính năng',
    question: 'Xem ngày tốt hoạt động như thế nào?',
    answer: 'Chọn mục đích (khai trương, cưới hỏi, động thổ...), nhập khoảng thời gian bạn muốn tìm (ví dụ: từ hôm nay đến 30 ngày sau). Thầy Tám sẽ phân tích và đưa ra 5 ngày TỐT NHẤT với giải thích chi tiết về Can Chi, sao tốt/xấu, giờ hoàng đạo và điều cần tránh.'
  },
  {
    category: 'Tính năng',
    question: 'Tử vi năm 2026 có chính xác không?',
    answer: 'Tử vi được tính dựa trên ngày giờ sinh, giới tính và 6 quyển sách phong thủy cổ truyền. Thầy Tám phân tích theo 12 tháng với đánh giá về tài lộc, sự nghiệp, tình duyên, sức khỏe. Độ chính xác phụ thuộc vào việc bạn nhập đúng thông tin sinh.'
  },
  {
    category: 'Tính năng',
    question: 'Tính năng Xông Đất Tết là gì?',
    answer: 'Dành cho gói Lộc Phát và Đại Cát. Nhập năm sinh và giới tính của gia chủ, Thầy Tám sẽ tìm 3 nhóm tuổi TỐT NHẤT để xông đất đầu năm Tết 2026 dựa trên Tam hợp, Lục hợp, Ngũ hành tương sinh. Kết quả bao gồm: tuổi con gì, mệnh, độ hợp, lý do, giờ tốt, quà tặng nên mang.'
  },
  {
    category: 'Tính năng',
    question: 'Loại lịch Âm/Dương là gì?',
    answer: 'Khi nhập ngày sinh, bạn chọn loại lịch bạn biết:\n\n• Dương lịch: Lịch quốc tế (theo bệnh viện, giấy khai sinh)\n\n• Âm lịch: Lịch truyền thống Việt Nam\n\nNếu bạn chỉ biết dương lịch, hệ thống sẽ tự động chuyển đổi sang âm lịch khi Thầy Tám xem cho bạn để kết quả chính xác hơn.'
  },
  {
    category: 'Tính năng',
    question: 'Chat với Thầy Tám có giới hạn gì không?',
    answer: 'Mỗi câu hỏi tính 1 lượt quota. Thầy Tám trả lời ngắn gọn (80-150 từ) và chỉ trích dẫn sách khi bạn hỏi cụ thể về nguồn gốc. Bạn có thể hỏi về: hướng nhà, màu sắc may mắn, bố trí phòng, chọn ngày, tử vi, v.v.'
  },

  // Thanh toán
  {
    category: 'Thanh toán',
    question: 'Có những hình thức thanh toán nào?',
    answer: 'Hiện tại chúng tôi hỗ trợ thanh toán qua QR Code (VietQR) cho tất cả các ngân hàng tại Việt Nam. Quét mã QR bằng app ngân hàng của bạn, hệ thống sẽ tự động kích hoạt gói sau khi nhận được thanh toán (thường trong vòng 1-2 phút).'
  },
  {
    category: 'Thanh toán',
    question: 'Thanh toán có an toàn không?',
    answer: 'Có, chúng tôi không lưu trữ thông tin thẻ ngân hàng của bạn. Thanh toán QR Code được xử lý trực tiếp qua hệ thống ngân hàng, đảm bảo an toàn tuyệt đối. Thông tin giao dịch được mã hóa SSL/TLS.'
  },
  {
    category: 'Thanh toán',
    question: 'Tôi đã thanh toán nhưng gói chưa kích hoạt?',
    answer: 'Hệ thống thường kích hoạt tự động trong 1-2 phút. Nếu sau 5 phút vẫn chưa kích hoạt:\n\n1. Kiểm tra email xác nhận thanh toán\n\n2. Refresh lại trang\n\n3. Liên hệ: thaytamphongthuy2026@gmail.com kèm mã giao dịch'
  },

  // Bảo mật
  {
    category: 'Bảo mật',
    question: 'Thông tin cá nhân của tôi có an toàn không?',
    answer: 'Chúng tôi sử dụng mã hóa SSL/TLS cho mọi kết nối, database được bảo vệ bằng Row Level Security (Supabase), và tuân thủ các tiêu chuẩn bảo mật quốc tế. Xem thêm tại Chính sách Bảo mật.'
  },
  {
    category: 'Bảo mật',
    question: 'Bạn có bán thông tin cá nhân của tôi không?',
    answer: 'KHÔNG, chúng tôi cam kết không bao giờ bán, chia sẻ hoặc sử dụng thông tin cá nhân của bạn cho mục đích ngoài việc cung cấp dịch vụ. Dữ liệu của bạn chỉ được dùng để tính toán phong thủy và cá nhân hóa trải nghiệm.'
  },
  {
    category: 'Bảo mật',
    question: 'Làm sao để xóa tài khoản và dữ liệu?',
    answer: 'Vào "Thông tin cá nhân" → Kéo xuống cuối trang → Nhấn "Xóa tài khoản" → Xác nhận qua email. Toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn trong vòng 30 ngày và không thể khôi phục.'
  },

  // Kỹ thuật
  {
    category: 'Kỹ thuật',
    question: 'Website hoạt động trên điện thoại không?',
    answer: 'Có, website được tối ưu cho mọi thiết bị: điện thoại, máy tính bảng, laptop. Bạn có thể truy cập mọi lúc mọi nơi chỉ cần có kết nối internet.'
  },
  {
    category: 'Kỹ thuật',
    question: 'Tôi gặp lỗi khi sử dụng, phải làm sao?',
    answer: 'Thử các bước sau:\n\n1. Refresh lại trang (F5)\n\n2. Xóa cache trình duyệt\n\n3. Thử trình duyệt khác (Chrome, Firefox, Safari)\n\n4. Đăng xuất và đăng nhập lại\n\nNếu vẫn lỗi, liên hệ: thaytamphongthuy2026@gmail.com'
  },
  {
    category: 'Kỹ thuật',
    question: 'Thầy Tám trả lời nhanh như thế nào?',
    answer: 'Trung bình 3-10 giây. Thầy Tám sử dụng Google Gemini AI kết hợp với 6 quyển sách phong thủy cổ truyền để phân tích và đưa ra lời khuyên. Với gói Đại Cát, bạn không giới hạn số lượng câu hỏi.'
  }
]

const categories = ['Tất cả', 'Tài khoản', 'Gói dịch vụ', 'Tính năng', 'Thanh toán', 'Bảo mật', 'Kỹ thuật']

export default function FAQ() {
  useEffect(() => {
    document.title = 'Câu Hỏi Thường Gặp - Thầy Tám Phong Thủy'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Câu hỏi thường gặp về dịch vụ phong thủy AI. Hướng dẫn sử dụng, gói dịch vụ, thanh toán và bảo mật.')
    }
  }, [])

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tất cả' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryIcons: Record<string, typeof Star> = {
    'Tài khoản': Shield,
    'Gói dịch vụ': Star,
    'Tính năng': Zap,
    'Thanh toán': CreditCard,
    'Bảo mật': Shield,
    'Kỹ thuật': HelpCircle
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Câu Hỏi Thường Gặp</h1>
              <p className="text-blue-100 mt-1">Tìm câu trả lời cho mọi thắc mắc của bạn</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Không tìm thấy câu hỏi nào phù hợp</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => {
              const Icon = categoryIcons[faq.category] || HelpCircle
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-6 text-left flex items-start gap-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-6 pl-20">
                      <div className="text-gray-700 whitespace-pre-line border-l-4 border-blue-500 pl-4">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mt-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Vẫn còn thắc mắc?</h2>
          <p className="text-purple-100 mb-6">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn!
          </p>
          <a
            href="mailto:thaytamphongthuy2026@gmail.com"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>
    </div>
  )
}
