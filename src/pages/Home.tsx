import { Link } from 'react-router-dom'
import { MessageCircle, Calendar, Star, TrendingUp, Shield, Zap, Sparkles, Dices, Flame, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  // Real-time user count animation (simulated)
  const [userCount, setUserCount] = useState(12847)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Set SEO meta tags
  useEffect(() => {
    document.title = 'Thầy Tám Phong Thủy 2026 - Xem Ngày Tốt, Tử Vi, Tư Vấn Phong Thủy Tết Ất Tỵ'
    
    const metaTags = [
      { name: 'description', content: 'Tư vấn phong thủy Tết 2026 (Ất Tỵ) dựa trên 6 sách cổ thư. Xem ngày tốt khai trương, cưới hỏi, động thổ. Xem tử vi năm 2026. AI trích xuất từ Bát Trạch Minh Kinh, Ngọc Hạp Thông Thư.' },
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
      const value = (name || property) as string
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
      'description': 'AI phong thủy dựa trên 6 sách cổ thư (~70MB tri thức). Xem ngày tốt, xem tử vi năm 2026 (Ất Tỵ). Trích dẫn từ Bát Trạch Minh Kinh, Ngọc Hạp Thông Thư, Tử Vi Đẩu Số.',
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
      {/* Hero Section - REDESIGNED: Zero friction entry */}
      <section className="relative bg-gradient-to-br from-red-600 via-purple-600 to-pink-600 text-white py-16 md:py-24 overflow-hidden">
        {/* Animated Tet decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🏮</div>
          <div className="absolute top-20 right-20 text-5xl animate-pulse">🐍</div>
          <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce" style={{animationDelay: '1s'}}>🧧</div>
          <div className="absolute bottom-20 right-1/3 text-5xl animate-pulse" style={{animationDelay: '0.5s'}}>🎆</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
              <Users className="w-4 h-4" />
              <span>{userCount.toLocaleString()} người đã dùng hôm nay</span>
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              🎊 Tết 2026 - Xem Tử Vi, Xin Xăm, Lì Xì Thông Minh
            </h1>
            
            <p className="text-lg md:text-2xl text-purple-100 max-w-4xl mx-auto font-medium">
              Trải nghiệm Phong Thủy AI - Dựa Trên Sách Cổ Truyền ✨
            </p>

            {/* 3 BIG Instant CTAs - NO LOGIN REQUIRED */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-10">
              {/* CTA 1: Xem Tử Vi AI */}
              <Link
                to="/tu-vi"
                className="group relative bg-white text-purple-700 p-6 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">🔮 Xem Tử Vi AI</h3>
                  <p className="text-sm text-gray-600">Dự đoán năm Rắn 2026</p>
                  <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full font-semibold">MIỄN PHÍ</span>
                </div>
              </Link>

              {/* CTA 2: Số May Mắn */}
              <Link
                to="/so-may-man"
                className="group relative bg-white text-orange-700 p-6 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Dices className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">🎰 Số May Mắn</h3>
                  <p className="text-sm text-gray-600">Quay số may mắn hôm nay</p>
                  <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold animate-pulse">HOT 🔥</span>
                </div>
              </Link>

              {/* CTA 3: Xin Xăm */}
              <Link
                to="/xin-xam"
                className="group relative bg-white text-pink-700 p-6 rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">🏮 Xin Xăm Ảo</h3>
                  <p className="text-sm text-gray-600">Rút xăm online chuẩn xác</p>
                  <span className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold">MỚI ⚡</span>
                </div>
              </Link>
            </div>

            {/* Secondary CTAs - Smaller */}
            <div className="flex flex-wrap gap-3 justify-center items-center mt-8 text-sm">
              <Link
                to="/xem-ngay-tot"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full font-medium transition inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Xem Ngày Tốt
              </Link>
              <Link
                to="/chat"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full font-medium transition inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Với Thầy Tám
              </Link>
              <Link
                to="/pricing"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-6 py-3 rounded-full font-semibold transition inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Xem Bảng Giá
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Thầy Tám's Unique Approach - Book-Based AI */}
      <section className="py-16 bg-white border-t-4 border-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-full text-sm font-bold mb-6">
              <span className="text-2xl">📚</span>
              <span>ĐIỂM KHÁC BIỆT CỦA THẦY TÁM</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tri Thức Phong Thủy Từ Sách Cổ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Thầy Tám không dựa vào "kinh nghiệm cá nhân" hay "30 năm tu luyện".
              <strong className="text-purple-600"> Mọi lời tư vấn đều trích dẫn từ sách phong thủy cổ truyền có nguồn gốc rõ ràng.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: What makes us different */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Phong Thủy Truyền Thống</h3>
                  <p className="text-gray-600">Dựa vào "kinh nghiệm" • Không thể kiểm chứng • Mỗi thầy nói khác nhau</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-600 mb-1">Phong Thủy AI - Thầy Tám</h3>
                  <p className="text-gray-600">
                    <strong>Trích dẫn từ sách cổ</strong> • 
                    Có sách mách có chứng • Nguồn gốc minh bạch, ai cũng kiểm chứng được
                  </p>
                </div>
              </div>
            </div>

            {/* Right: The books */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📚 Kho Tàng Tri Thức
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <strong className="text-gray-900">Bát Trạch Minh Kinh</strong>
                    <p className="text-sm text-gray-600">Chuẩn mực hướng nhà, bếp, cổng theo phong thủy</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">📕</span>
                  <div>
                    <strong className="text-gray-900">Ngọc Hạp Thông Thư</strong>
                    <p className="text-sm text-gray-600">Chọn ngày giờ hoàng đạo cho mọi việc</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">📗</span>
                  <div>
                    <strong className="text-gray-900">Tử Vi Đẩu Số Tân Biện</strong>
                    <p className="text-sm text-gray-600">Luận giải vận mệnh, dự báo tương lai</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">📘</span>
                  <div>
                    <strong className="text-gray-900">Tăng San Bốc Dịch</strong>
                    <p className="text-sm text-gray-600">Kinh Dịch và nghệ thuật xem quẻ</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-2xl">📙</span>
                  <div>
                    <strong className="text-gray-900">Hiệp Kỷ Biện Phương Thư (2 tập)</strong>
                    <p className="text-sm text-gray-600">Bách khoa toàn thư phong thủy Hoàng gia</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-purple-200 text-center">
                <p className="text-sm text-gray-600">
                  <strong className="text-purple-600">~70MB</strong> tri thức phong thủy cổ truyền
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-16 bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              🤖 Công Nghệ AI Tiên Tiến
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📖</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">1. Trích Xuất</h4>
                <p className="text-sm text-gray-600">Đọc và phân tích 6 quyển sách</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">2. Tìm Kiếm</h4>
                <p className="text-sm text-gray-600">Tìm thông tin liên quan chính xác</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧠</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">3. Suy Luận</h4>
                <p className="text-sm text-gray-600">Kết hợp logic ngũ hành</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">4. Tư Vấn</h4>
                <p className="text-sm text-gray-600">Trả lời cá nhân hóa + trích dẫn nguồn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Feature Grid - All Clickable Without Login */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 Trải Nghiệm Ngay - Không Cần Đăng Ký
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Mọi tính năng đều miễn phí dùng thử • Đăng ký để lưu kết quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Tử Vi AI */}
            <Link
              to="/tu-vi"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">Xem Tử Vi 2026</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Dự đoán vận mệnh năm Rắn • Tài lộc, tình duyên, sự nghiệp
                  </p>
                  <span className="inline-block text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">30% Xem Miễn Phí</span>
                </div>
              </div>
            </Link>

            {/* Feature 2: Số May Mắn */}
            <Link
              to="/so-may-man"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-orange-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Dices className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">Số May Mắn Hôm Nay</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Quay số may mắn • Streak thưởng • Bảng xếp hạng
                  </p>
                  <span className="inline-block text-xs bg-red-500 text-white px-3 py-1 rounded-full font-semibold animate-pulse">HOT 🔥</span>
                </div>
              </div>
            </Link>

            {/* Feature 3: Xin Xăm */}
            <Link
              to="/xin-xam"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-pink-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition">Xin Xăm Ảo</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Rút xăm online • 100+ lời giải • 3D bamboo sticks
                  </p>
                  <span className="inline-block text-xs bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold">MỚI ⚡</span>
                </div>
              </div>
            </Link>

            {/* Feature 4: Xem Ngày Tốt */}
            <Link
              to="/xem-ngay-tot"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">Xem Ngày Tốt 2026</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Khai trương, cưới hỏi, động thổ • Can Chi • Giờ Hoàng Đạo
                  </p>
                  <span className="inline-block text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">3 Lượt Free</span>
                </div>
              </div>
            </Link>

            {/* Feature 5: Chat AI */}
            <Link
              to="/chat"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">Chat Với Thầy Tám</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Tư vấn phong thủy 24/7 • AI chuyên gia • Trả lời tức thì
                  </p>
                  <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">10 Câu Miễn Phí</span>
                </div>
              </div>
            </Link>

            {/* Feature 6: Lịch Phong Thủy */}
            <Link
              to="/lich-phong-thuy"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">Lịch Phong Thủy</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Lịch âm • Ngày tốt xấu • Hướng tốt • Màu sắc may mắn
                  </p>
                  <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">Miễn Phí Hoàn Toàn</span>
                </div>
              </div>
            </Link>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Dựa Trên Sách Cổ</h3>
              <p className="text-gray-600">
                6 quyển sách phong thủy cổ truyền (~70MB). Thầy Tám trích dẫn chính xác, không suy diễn.
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nguồn Gốc Rõ Ràng</h3>
              <p className="text-gray-600">
                Bát Trạch Minh Kinh • Ngọc Hạp Thông Thư • Tử Vi Đẩu Số • Tăng San Bốc Dịch + 2 sách khác
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
