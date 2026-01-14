import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Ngày Tốt Khai Trương Năm 2026 Theo Phong Thủy',
    excerpt: 'Xem ngày hoàng đạo khai trương kinh doanh năm Ất Tỵ 2026. Chọn ngày tốt giờ đẹp để thu hút tài lộc, khách hàng ùn ùn, kinh doanh phát đạt.',
    date: '14/01/2026',
    readTime: '8 phút',
    category: 'Xem Ngày Tốt',
    slug: 'ngay-tot-khai-truong-2026'
  },
  {
    id: '2',
    title: 'Tử Vi 12 Con Giáp Năm 2026: Ai Gặp Nhiều May Mắn Nhất?',
    excerpt: 'Xem tử vi 12 con giáp năm Rắn 2026. Dự đoán vận may tài lộc, sự nghiệp, tình duyên, sức khỏe cho từng tuổi. Năm 2026 tuổi nào hợp xui?',
    date: '13/01/2026',
    readTime: '12 phút',
    category: 'Tử Vi',
    slug: 'tu-vi-12-con-giap-2026'
  },
  {
    id: '3',
    title: 'Phong Thủy Tết 2026: Cách Bày Trí Nhà Cửa Đón Lộc Về',
    excerpt: 'Hướng dẫn bày trí phòng khách, bàn thờ Tết 2026 theo phong thủy. Màu sắc, vật phẩm may mắn cho năm Ất Tỵ. Đặt cây cảnh, tranh ảnh nơi nào?',
    date: '12/01/2026',
    readTime: '10 phút',
    category: 'Phong Thủy Nhà Ở',
    slug: 'phong-thuy-tet-2026'
  },
  {
    id: '4',
    title: 'Xem Ngày Cưới Tốt Năm 2026 Cho Cặp Đôi',
    excerpt: 'Chọn ngày cưới hỏi, ăn hỏi, đính hôn năm 2026 hợp tuổi vợ chồng. Tránh ngày xấu, chọn tháng tốt kết hôn để hôn nhân hạnh phúc trăm năm.',
    date: '11/01/2026',
    readTime: '9 phút',
    category: 'Xem Ngày Tốt',
    slug: 'ngay-cuoi-tot-2026'
  },
  {
    id: '5',
    title: 'Hướng Nhà Tốt Năm 2026: Xây Nhà Hướng Nào May Mắn?',
    excerpt: 'Phong thủy hướng nhà năm 2026. Hướng Đông, Tây, Nam, Bắc nào tốt cho tuổi chủ nhà? Cách chọn hướng cửa chính, hướng giường ngủ đón tài lộc.',
    date: '10/01/2026',
    readTime: '11 phút',
    category: 'Phong Thủy Nhà Ở',
    slug: 'huong-nha-tot-2026'
  },
  {
    id: '6',
    title: 'Tuổi Tỵ (Rắn) Năm 2026: Phạm Tuổi Có Xui Xẻo Không?',
    excerpt: 'Tuổi Tỵ năm Ất Tỵ 2026 phạm tuổi, vận may ra sao? Cách hóa giải tuổi phạm: đeo vật phẩm gì, làm gì để may mắn, tránh tai họa.',
    date: '09/01/2026',
    readTime: '7 phút',
    category: 'Tử Vi',
    slug: 'tuoi-ty-nam-2026'
  },
  {
    id: '7',
    title: 'Màu Sắc May Mắn Năm 2026 Theo Mệnh Kim Mộc Thủy Hỏa Thổ',
    excerpt: 'Màu sắc hợp phong thủy năm 2026 cho từng mệnh. Mệnh Kim, Mộc, Thủy, Hỏa, Thổ nên mặc màu gì, sơn nhà màu gì để thu hút tài lộc?',
    date: '08/01/2026',
    readTime: '8 phút',
    category: 'Phong Thủy',
    slug: 'mau-sac-may-man-2026'
  }
]

export default function Blog() {
  useEffect(() => {
    document.title = 'Blog Phong Thủy 2026 - Kiến Thức Xem Ngày Tử Vi | Thầy Tám'
    
    const metaTags = [
      { name: 'description', content: 'Chia sẻ kiến thức phong thủy, xem ngày tốt, tử vi 2026. Bài viết chuyên sâu về phong thủy Tết Ất Tỵ, ngày hoàng đạo, bày trí nhà cửa, màu sắc may mắn.' },
      { name: 'keywords', content: 'blog phong thủy 2026, kiến thức phong thủy, xem ngày tốt, tử vi 2026, phong thủy tết, ngày hoàng đạo, bày trí nhà cửa' }
    ]

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📚 Blog Phong Thủy 2026
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl">
            Kiến thức phong thủy, xem ngày tốt, tử vi năm Ất Tỵ 2026. 
            Chia sẻ từ chuyên gia giúp bạn đón Tết trọn vẹn.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block"
            >
              <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-purple-600 font-semibold group-hover:text-purple-700 transition">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 Nội dung đang được cập nhật
            </h3>
            <p className="text-gray-600 mb-6">
              Chúng tôi đang soạn thảo thêm nhiều bài viết chuyên sâu về phong thủy, 
              xem ngày tốt, và tử vi năm 2026. Quay lại sau nhé!
            </p>
            <Link
              to="/register"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Đăng ký để nhận thông báo
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tại Sao Nên Đọc Blog Phong Thủy Thầy Tám?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ✅ Kiến Thức Chính Thống
                </h3>
                <p className="text-gray-700">
                  Nội dung được biên soạn dựa trên kinh điển phong thủy truyền thống 
                  kết hợp với nghiên cứu hiện đại. Mỗi bài viết đều được chuyên gia 
                  phong thủy kiểm duyệt kỹ lưỡng.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ✅ Cập Nhật Theo Năm
                </h3>
                <p className="text-gray-700">
                  Phong thủy thay đổi theo năm. Blog luôn cập nhật thông tin mới nhất 
                  cho năm 2026, giúp bạn nắm bắt vận may, tránh xui xẻo kịp thời.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ✅ Dễ Hiểu, Dễ Áp Dụng
                </h3>
                <p className="text-gray-700">
                  Viết bằng ngôn ngữ đơn giản, dễ hiểu. Hướng dẫn cụ thể từng bước, 
                  kèm ví dụ thực tế để bạn có thể áp dụng ngay vào cuộc sống.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ✅ Miễn Phí 100%
                </h3>
                <p className="text-gray-700">
                  Tất cả bài viết đều miễn phí, không giới hạn lượt đọc. 
                  Chia sẻ kiến thức phong thủy để mọi người đón Tết vui vẻ, may mắn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Muốn Tư Vấn Trực Tiếp?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Chat với Thầy Tám AI để được tư vấn phong thủy chi tiết, 
            xem ngày tốt và tử vi riêng cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Chat ngay
            </Link>
            <Link
              to="/xem-ngay-tot"
              className="bg-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-400 transition"
            >
              Xem ngày tốt
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
