import { Check, Crown, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Pricing() {
  const plans = [
    {
      name: 'Duyên Lành',
      subtitle: 'Miễn phí',
      price: '0 VNĐ',
      period: 'mãi mãi',
      icon: '🍀',
      features: [
        '3 lượt xem ngày tốt',
        '1 lượt xem tử vi',
        '5 câu hỏi với Thầy Tám',
        'Truy cập blog phong thủy',
        'Tính năng cơ bản',
      ],
      cta: 'Đăng ký ngay',
      href: '/register',
      popular: false,
      gradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Lộc Phát',
      subtitle: 'Phổ biến nhất',
      price: '68,000 VNĐ',
      period: 'tháng',
      icon: '🎋',
      features: [
        '30 lượt xem ngày tốt/tháng',
        '10 lượt xem tử vi/tháng',
        '50 câu hỏi với Thầy Tám/tháng',
        'Tất cả tính năng cơ bản',
        'Tư vấn chi tiết hơn',
        'Xem lịch phong thủy đầy đủ',
        'Ưu tiên hỗ trợ',
      ],
      cta: 'Nâng cấp Lộc Phát',
      href: '/qr-payment?plan=pro&price=68000',
      popular: true,
      gradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'Đại Cát',
      subtitle: 'Không giới hạn',
      price: '168,000 VNĐ',
      period: 'tháng',
      icon: '👑',
      features: [
        '∞ Không giới hạn xem ngày tốt',
        '∞ Không giới hạn xem tử vi',
        '∞ Không giới hạn chat với Thầy Tám',
        'Tất cả tính năng Premium',
        'Tư vấn chuyên sâu từ sách cổ',
        'Báo cáo phong thủy chi tiết',
        'Hỗ trợ ưu tiên cao nhất',
        'Tính năng Mời Xông Đất 2026',
      ],
      cta: 'Nâng cấp Đại Cát',
      href: '/qr-payment?plan=premium&price=168000',
      popular: false,
      gradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Chọn gói phù hợp với bạn</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bảng Giá Dịch Vụ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Từ miễn phí đến không giới hạn - Thầy Tám luôn đồng hành cùng bạn
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-gradient-to-br ${plan.gradient} rounded-2xl shadow-xl overflow-hidden border-2 ${plan.borderColor} ${
                plan.popular ? 'ring-4 ring-purple-400 ring-opacity-50 transform scale-105 relative' : ''
              } transition-all hover:shadow-2xl`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg flex items-center space-x-1 text-sm font-bold">
                  <Crown className="w-4 h-4" />
                  <span>PHỔ BIẾN</span>
                </div>
              )}
              
              <div className="p-8">
                {/* Icon & Name */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{plan.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-600 font-medium">{plan.subtitle}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {plan.price.split(' ')[0]}
                    </span>
                    {plan.period !== 'mãi mãi' && (
                      <span className="text-lg text-gray-600">VNĐ</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">/{plan.period}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to={plan.href}
                  className={`block w-full text-center py-4 rounded-xl font-bold text-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                      : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            So Sánh Chi Tiết
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Tính năng</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">🍀 Duyên Lành</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-700 bg-purple-50">🎋 Lộc Phát</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">👑 Đại Cát</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 text-gray-700">Xem Ngày Tốt</td>
                  <td className="py-4 px-4 text-center text-gray-600">3 lần</td>
                  <td className="py-4 px-4 text-center font-semibold text-purple-600 bg-purple-50">30 lần</td>
                  <td className="py-4 px-4 text-center font-bold text-green-600">∞ Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Xem Tử Vi</td>
                  <td className="py-4 px-4 text-center text-gray-600">1 lần</td>
                  <td className="py-4 px-4 text-center font-semibold text-purple-600 bg-purple-50">10 lần</td>
                  <td className="py-4 px-4 text-center font-bold text-green-600">∞ Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Chat với Thầy Tám</td>
                  <td className="py-4 px-4 text-center text-gray-600">5 câu</td>
                  <td className="py-4 px-4 text-center font-semibold text-purple-600 bg-purple-50">50 câu</td>
                  <td className="py-4 px-4 text-center font-bold text-green-600">∞ Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Mời Xông Đất 2026</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-green-600 bg-purple-50">✓</td>
                  <td className="py-4 px-4 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Báo cáo chi tiết</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-gray-400 bg-purple-50">✗</td>
                  <td className="py-4 px-4 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Hỗ trợ ưu tiên</td>
                  <td className="py-4 px-4 text-center text-gray-400">✗</td>
                  <td className="py-4 px-4 text-center text-green-600 bg-purple-50">✓</td>
                  <td className="py-4 px-4 text-center text-green-600">✓ Cao nhất</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                Quota có được reset hàng tháng không?
              </h3>
              <p className="text-gray-600">
                Gói <strong>Duyên Lành</strong> reset hàng ngày. Gói <strong>Lộc Phát</strong> reset vào đầu mỗi tháng. 
                Gói <strong>Đại Cát</strong> không giới hạn nên không cần reset.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                Tôi có thể nâng cấp từ Lộc Phát lên Đại Cát không?
              </h3>
              <p className="text-gray-600">
                Có, bạn có thể nâng cấp bất cứ lúc nào. Chỉ cần trả phần chênh lệch (168k - 68k = 100k) 
                cho thời gian còn lại của tháng hiện tại.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                Phương thức thanh toán nào được hỗ trợ?
              </h3>
              <p className="text-gray-600">
                Chúng tôi hỗ trợ: <strong>VNPay, MoMo, chuyển khoản ngân hàng</strong> và thẻ tín dụng quốc tế. 
                Thanh toán an toàn và nhanh chóng.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                Thầy Tám tư vấn dựa trên nguồn gì?
              </h3>
              <p className="text-gray-600">
                Thầy Tám là AI được huấn luyện từ <strong>6 quyển sách phong thủy cổ truyền</strong> 
                (~70MB tri thức): Bát Trạch Minh Kinh, Ngọc Hạp Thông Thư, Tử Vi Đẩu Số... 
                Mọi lời tư vấn đều <strong>dựa trên sách</strong>, không phải kinh nghiệm cá nhân.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                Tôi có thể hủy gói đã mua không?
              </h3>
              <p className="text-gray-600">
                Có, bạn có thể hủy bất cứ lúc nào. Sau khi hủy, bạn vẫn sử dụng được đến hết chu kỳ thanh toán hiện tại.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Bắt đầu với gói <strong>Duyên Lành</strong> miễn phí ngay hôm nay!
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Đăng Ký Miễn Phí
          </Link>
        </div>
      </div>
    </div>
  )
}
