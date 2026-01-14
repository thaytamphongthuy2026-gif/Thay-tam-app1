import { Check, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Pricing() {
  const plans = [
    {
      name: 'Miễn phí',
      price: '0 VNĐ',
      period: 'mãi mãi',
      features: [
        '3 lượt xem ngày tốt/ngày',
        '1 lượt xem tử vi/ngày',
        '10 câu hỏi chat/ngày',
        'Lịch phong thủy cơ bản',
      ],
      cta: 'Đăng ký ngay',
      href: '/register',
      popular: false
    },
    {
      name: 'Pro',
      price: '299,000 VNĐ',
      period: 'tháng',
      features: [
        '50 lượt xem ngày tốt/tháng',
        '10 lượt xem tử vi/tháng',
        '100 câu hỏi chat/tháng',
        'Lịch phong thủy đầy đủ',
        'Hỗ trợ ưu tiên',
      ],
      cta: 'Nâng cấp Pro',
      href: '/qr-payment?plan=pro',
      popular: false
    },
    {
      name: 'Premium',
      price: '999,000 VNĐ',
      period: 'tháng',
      features: [
        'Không giới hạn xem ngày tốt',
        'Không giới hạn xem tử vi',
        'Không giới hạn chat',
        'Lịch phong thủy VIP',
        'Tư vấn chuyên sâu',
        'Báo cáo chi tiết',
        'Hỗ trợ 24/7',
      ],
      cta: 'Nâng cấp Premium',
      href: '/qr-payment?plan=premium',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bảng giá dịch vụ
          </h1>
          <p className="text-xl text-gray-600">
            Chọn gói phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-purple-600 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 px-4 flex items-center justify-center space-x-2">
                  <Crown className="w-4 h-4" />
                  <span className="font-semibold">PHỔ BIẾN NHẤT</span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.href}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Tôi có thể hủy gói Premium bất cứ lúc nào không?
              </h3>
              <p className="text-gray-600">
                Có, bạn có thể hủy bất cứ lúc nào. Sau khi hủy, bạn vẫn sử dụng được đến hết chu kỳ thanh toán.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quota có được reset hàng ngày không?
              </h3>
              <p className="text-gray-600">
                Có, quota của gói Free và Pro được reset vào 00:00 hàng ngày theo giờ Việt Nam.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Tôi có thể nâng cấp từ gói Pro lên Premium không?
              </h3>
              <p className="text-gray-600">
                Có, bạn có thể nâng cấp bất cứ lúc nào và chỉ cần trả phần chênh lệch.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Phương thức thanh toán nào được hỗ trợ?
              </h3>
              <p className="text-gray-600">
                Chúng tôi hỗ trợ thanh toán qua VNPay, MoMo, chuyển khoản ngân hàng và thẻ tín dụng quốc tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
