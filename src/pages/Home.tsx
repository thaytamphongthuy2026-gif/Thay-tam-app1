import { Link } from 'react-router-dom'
import { MessageCircle, Calendar, Star, TrendingUp, Shield, Zap } from 'lucide-react'
import { useEffect } from 'react'

export default function Home() {
  // Set SEO meta tags
  useEffect(() => {
    document.title = 'Thầy Tám Phong Thủy 2026 - Xem Ngày Tốt, Tử Vi, Tư Vấn Phong Thủy Tết Ất Tỵ'
    
    const metaTags = [
      { name: 'description', content: 'Tư vấn phong thủy Tết 2026 (Ất Tỵ) chuyên nghiệp. Xem ngày tốt khai trương, cưới hỏi, động thổ. Xem tử vi năm 2026. Chuyên gia phong thủy AI 24/7.' },
      { name: 'keywords', content: 'phong thủy 2026, tết 2026, xem ngày tốt 2026, tử vi 2026, phong thủy tết ất tỵ, ngày hoàng đạo 2026, xem ngày khai trương, xem ngày cưới hỏi, thầy phong thủy' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://thaytamphongthuy.com/' },
      { property: 'og:title', content: 'Thầy Tám Phong Thủy 2026 - Tư Vấn Phong Thủy Tết Ất Tỵ' },
      { property: 'og:description', content: 'Xem ngày tốt, tử vi năm 2026, tư vấn phong thủy Tết Ất Tỵ chuyên nghiệp với AI. Miễn phí 3 lượt xem ngày tốt.' },
      { property: 'og:image', content: 'https://thaytamphongthuy.com/og-image.jpg' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: 'https://thaytamphongthuy.com/' },
      { property: 'twitter:title', content: 'Thầy Tám Phong Thủy 2026 - Xem Ngày Tốt Tết Ất Tỵ' },
      { property: 'twitter:description', content: 'Tư vấn phong thủy Tết 2026, xem ngày tốt, xem tử vi với AI. Dùng thử miễn phí.' },
      { property: 'twitter:image', content: 'https://thaytamphongthuy.com/og-image.jpg' }
    ]

    metaTags.forEach(({ name, property, content }) => {
      const attr = name ? 'name' : 'property'
      const value = name || property
      let meta = document.querySelector(`meta[${attr}="${value}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, value)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    })

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', 'https://thaytamphongthuy.com/')

    // Add JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'Thầy Tám Phong Thủy 2026',
      'description': 'Tư vấn phong thủy chuyên nghiệp, xem ngày tốt, xem tử vi năm 2026 (Ất Tỵ) với công nghệ AI.',
      'url': 'https://thaytamphongthuy.com',
      'telephone': '',
      'email': 'thaytamphongthuy2026@gmail.com',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'VN'
      },
      'priceRange': 'Miễn phí - 999,000 VNĐ',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'reviewCount': '10247'
      },
      'serviceType': [
        'Tư vấn phong thủy',
        'Xem ngày tốt',
        'Xem tử vi',
        'Tư vấn phong thủy nhà ở',
        'Chọn ngày khai trương',
        'Chọn ngày cưới hỏi'
      ],
      'areaServed': 'Vietnam',
      'availableLanguage': 'Vietnamese',
      'openingHours': 'Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59',
      'potentialAction': {
        '@type': 'ReserveAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://thaytamphongthuy.com/register'
        },
        'result': {
          '@type': 'Reservation',
          'name': 'Đăng ký dùng thử miễn phí'
        }
      }
    }

    let script = document.querySelector('script[type="application/ld+json"]')
    if (!script) {
      script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold">
              Thầy Tám Phong Thủy Tết 2026 - Năm Ất Tỵ
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Chuyên gia phong thủy hàng đầu cho Tết Ất Tỵ 2026. 
              <strong>Xem ngày tốt khai trương, cưới hỏi, động thổ</strong> - Xem tử vi năm Rắn - Tư vấn phong thủy 24/7 với AI.
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
              Dịch Vụ Phong Thủy Tết 2026
            </h2>
            <p className="text-xl text-gray-600">
              Chuẩn bị trọn vẹn cho năm Ất Tỵ 2026 với tư vấn phong thủy chuyên sâu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tư Vấn Phong Thủy Tết 2026</h3>
              <p className="text-gray-600">
                Chat trực tiếp với Thầy Tám - chuyên gia phong thủy cho năm Ất Tỵ.
                <strong>Hỏi về hướng nhà, màu sắc may mắn, cách bày trí phòng khách Tết</strong>, tài lộc, sự nghiệp năm Rắn.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Xem Ngày Tốt 2026</h3>
              <p className="text-gray-600">
                <strong>Chọn ngày hoàng đạo khai trương, cưới hỏi, động thổ, xuất hành</strong> năm 2026 dựa trên lịch phong thủy Ất Tỵ.
                Phân tích Can Chi, Sao tốt xấu, Giờ Hoàng Đạo. Tránh ngày xấu, chọn giờ tốt.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Xem Tử Vi Năm Rắn 2026</h3>
              <p className="text-gray-600">
                <strong>Dự đoán vận mệnh năm Ất Tỵ 2026</strong> theo ngày giờ sinh. Phân tích chi tiết 
                <strong>tài lộc, sự nghiệp, tình duyên, sức khỏe</strong> cho 12 con giáp. Biết trước để chuẩn bị tốt.
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
              Tại Sao 10,000+ Người Chọn Thầy Tám Cho Tết 2026?
            </h2>
            <p className="text-xl text-gray-600">
              Đồng hành cùng bạn chuẩn bị trọn vẹn cho năm Ất Tỵ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tư Vấn Tức Thì 24/7</h3>
              <p className="text-gray-600">
                Nhận tư vấn phong thủy Tết ngay lập tức, kể cả đêm khuya. Không chờ đợi.
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chính Xác Từ Kinh Điển</h3>
              <p className="text-gray-600">
                Dựa trên 300 năm kiến thức phong thủy truyền thống + AI hiện đại
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Đón Tết Ất Tỵ 2026 Với Vận May Trọn Vẹn
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            🎁 <strong>Miễn phí</strong>: 3 lượt xem ngày tốt + 1 lượt xem tử vi năm 2026 + 10 câu hỏi phong thủy Tết
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </section>

      {/* SEO-Rich Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Phong Thủy Tết 2026 - Năm Ất Tỵ: Điều Cần Biết
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">🐍 Năm Rắn 2026 Là Năm Gì?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Năm 2026 là <strong>năm Bính Ngọ (Ất Tỵ)</strong> theo âm lịch, mệnh <strong>Hỏa</strong>. 
                  Năm Rắn mang lại cơ hội lớn về tài lộc, nhưng cần thận trọng trong các quyết định quan trọng.
                  Xem ngày tốt trước khi khai trương, cưới hỏi, động thổ là vô cùng quan trọng.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">📅 Khi Nào Cần Xem Ngày Tốt?</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Khai trương kinh doanh</strong>: Chọn ngày hoàng đạo để khai trương thu hút tài lộc</li>
                  <li><strong>Cưới hỏi, đính hôn</strong>: Ngày tốt giúp hôn nhân hạnh phúc, bền lâu</li>
                  <li><strong>Động thổ, xây nhà</strong>: Tránh ngày xấu, chọn giờ tốt khởi công</li>
                  <li><strong>Xuất hành xa</strong>: Đi công tác, du lịch gặp may mắn</li>
                  <li><strong>Mua nhà, mua xe</strong>: Tài sản phát triển, không gặp rủi ro</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Tại Sao Nên Tư Vấn Phong Thủy Online?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-purple-700 mb-2">⚡ Nhanh - Tiện</h4>
                  <p className="text-gray-700 text-sm">Tư vấn ngay tại nhà, không cần đi xa, tiết kiệm thời gian</p>
                </div>
                <div>
                  <h4 className="font-bold text-purple-700 mb-2">💰 Tiết Kiệm Chi Phí</h4>
                  <p className="text-gray-700 text-sm">Miễn phí 3 lượt xem ngày, rẻ hơn 80% so với gặp trực tiếp</p>
                </div>
                <div>
                  <h4 className="font-bold text-purple-700 mb-2">🔒 Bảo Mật Thông Tin</h4>
                  <p className="text-gray-700 text-sm">Thông tin cá nhân, ngày sinh được bảo mật tuyệt đối</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🌟 12 Con Giáp Năm 2026 - Vận May Ra Sao?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Năm Ất Tỵ 2026 có những con giáp gặp nhiều may mắn, nhưng cũng có tuổi cần đề phòng.
                <strong> Xem tử vi năm 2026 theo ngày giờ sinh</strong> để biết chính xác vận mệnh của bạn:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐭</span>
                  <p className="font-semibold">Tý (Chuột)</p>
                  <p className="text-sm text-green-600">★★★★☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐮</span>
                  <p className="font-semibold">Sửu (Trâu)</p>
                  <p className="text-sm text-yellow-600">★★★☆☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐯</span>
                  <p className="font-semibold">Dần (Hổ)</p>
                  <p className="text-sm text-green-600">★★★★★</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐰</span>
                  <p className="font-semibold">Mão (Mèo)</p>
                  <p className="text-sm text-yellow-600">★★★☆☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐲</span>
                  <p className="font-semibold">Thìn (Rồng)</p>
                  <p className="text-sm text-green-600">★★★★☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐍</span>
                  <p className="font-semibold">Tỵ (Rắn)</p>
                  <p className="text-sm text-red-600">★★☆☆☆ Tuổi phạm</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐴</span>
                  <p className="font-semibold">Ngọ (Ngựa)</p>
                  <p className="text-sm text-green-600">★★★★☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐐</span>
                  <p className="font-semibold">Mùi (Dê)</p>
                  <p className="text-sm text-yellow-600">★★★☆☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐵</span>
                  <p className="font-semibold">Thân (Khỉ)</p>
                  <p className="text-sm text-green-600">★★★★★</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐔</span>
                  <p className="font-semibold">Dậu (Gà)</p>
                  <p className="text-sm text-yellow-600">★★★☆☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐶</span>
                  <p className="font-semibold">Tuất (Chó)</p>
                  <p className="text-sm text-green-600">★★★★☆</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl mb-2">🐷</span>
                  <p className="font-semibold">Hợi (Lợn)</p>
                  <p className="text-sm text-red-600">★★☆☆☆</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                🎊 Chuẩn Bị Tết 2026 Với Thầy Tám
              </h3>
              <p className="text-center text-gray-700 mb-6">
                Đăng ký ngay để nhận tư vấn phong thủy miễn phí cho năm Ất Tỵ 2026
              </p>
              <div className="flex justify-center">
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition text-lg"
                >
                  🎁 Nhận Ưu Đãi Tết Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
