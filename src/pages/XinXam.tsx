import { useState, useEffect } from 'react'
import { Flame, Share2, BookOpen, Sparkles, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

interface XamResult {
  id: number
  title: string
  poem: string[]
  meaning: string
  advice: string
  goodMonths: string[]
}

export default function XinXam() {
  const [pulling, setPulling] = useState(false)
  const [result, setResult] = useState<XamResult | null>(null)
  const [pullsLeft, setPullsLeft] = useState(3)
  const [showSticks, setShowSticks] = useState(true)

  useEffect(() => {
    document.title = 'Xin Xăm Ảo - Rút Xăm Online - Thầy Tám Phong Thủy 2026'
  }, [])

  // Sample xăm data (in production, this would come from xinxam.json)
  const xamData: XamResult[] = [
    {
      id: 1,
      title: '大吉 - ĐẠI CÁT',
      poem: [
        'Trời xanh mây trắng gió xuân về',
        'Hoa nở rực rỡ khắp chốn nơi',
        'Vận may đến, tài lộc tràn đầy',
        'Mọi sự hanh thông, tâm an vui'
      ],
      meaning: 'Xăm đại cát, mọi việc hanh thông. Tài lộc dồi dào, sự nghiệp thăng tiến. Tình duyên thuận lợi, sức khỏe dồi dào. Đây là thời điểm tốt để khởi đầu những dự án mới.',
      advice: 'Hãy mạnh dạn thực hiện kế hoạch của bạn. Đây là lúc thuận lợi nhất để khởi nghiệp, đầu tư, hoặc bắt đầu công việc mới. Gặp gỡ bạn bè, mở rộng quan hệ sẽ mang lại nhiều cơ hội.',
      goodMonths: ['Tháng 1', 'Tháng 5', 'Tháng 9']
    },
    {
      id: 2,
      title: '中吉 - TRUNG CÁT',
      poem: [
        'Mây tan sương khói dần dần tan',
        'Ngày tốt đêm lành không lo phiền',
        'Công việc thuận lợi theo ý muốn',
        'Hãy kiên trì, may mắn sẽ đến'
      ],
      meaning: 'Xăm trung cát, vận may ổn định. Công việc tiến triển tốt, tuy không có bước đột phá lớn nhưng mọi thứ đều theo đúng kế hoạch. Tình duyên cần thêm thời gian để phát triển.',
      advice: 'Hãy kiên trì với công việc hiện tại. Đừng vội vàng thay đổi hoặc liều lĩnh. Tích lũy kinh nghiệm và xây dựng nền tảng vững chắc cho tương lai. Chú ý sức khỏe và cân bằng cuộc sống.',
      goodMonths: ['Tháng 3', 'Tháng 7', 'Tháng 11']
    },
    {
      id: 3,
      title: '平安 - BÌNH AN',
      poem: [
        'Bình an là phúc quý nhất đời',
        'Giữ được an yên đã tốt rồi',
        'Chớ vội vàng mà khởi việc lớn',
        'Hãy chờ thời cơ, vận sẽ xoay'
      ],
      meaning: 'Xăm bình an, mọi việc ổn định. Không có may mắn đặc biệt nhưng cũng không gặp rủi ro lớn. Đây là thời kỳ cần sự kiên nhẫn và chuẩn bị kỹ càng cho tương lai.',
      advice: 'Không nên đầu tư lớn hoặc thay đổi quan trọng trong giai đoạn này. Hãy tập trung củng cố những gì đã có, học hỏi thêm kỹ năng mới. Giữ tâm bình an, chờ đợi thời cơ thuận lợi hơn.',
      goodMonths: ['Tháng 2', 'Tháng 6', 'Tháng 10']
    }
  ]

  const handlePullStick = () => {
    if (pullsLeft === 0 || pulling) return

    setPulling(true)
    setShowSticks(false)

    // Simulate stick pulling animation
    setTimeout(() => {
      const randomResult = xamData[Math.floor(Math.random() * xamData.length)]
      setResult(randomResult)
      setPulling(false)
      setPullsLeft(prev => prev - 1)
    }, 2000)
  }

  const handleReset = () => {
    setResult(null)
    setShowSticks(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-gray-700">NEW Feature</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            🏮 Xin Xăm Ảo
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rút xăm online chuẩn xác • 100+ lời giải • Miễn phí 3 lần mỗi ngày
          </p>
        </div>

        {/* Pulls Left Counter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold text-gray-900">
              Còn <span className="text-red-600 text-2xl font-bold">{pullsLeft}</span> lượt rút xăm hôm nay
            </span>
          </div>
        </div>

        {!result ? (
          <>
            {/* Bamboo Sticks Container */}
            <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                {showSticks ? (
                  <div className="text-center">
                    {/* Bamboo Sticks Visualization */}
                    <div className="mb-8">
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-3 h-32 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform hover:-translate-y-2 transition-transform cursor-pointer"
                            style={{
                              height: `${120 + Math.random() * 40}px`,
                              animationDelay: `${i * 0.05}s`
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-2xl font-bold text-gray-800 mb-2">🙏 Hãy thành tâm rút xăm</p>
                      <p className="text-gray-600">Mặc định tâm, nghĩ điều bạn muốn hỏi...</p>
                    </div>

                    {/* Pull Button */}
                    <button
                      onClick={handlePullStick}
                      disabled={pullsLeft === 0 || pulling}
                      className={`
                        px-12 py-4 rounded-full text-xl font-bold text-white shadow-lg
                        transition-all duration-300 transform
                        ${pullsLeft === 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:scale-105'
                        }
                      `}
                    >
                      {pullsLeft === 0 ? 'Hết lượt rút xăm' : 'Rút Xăm 🎋'}
                    </button>

                    {pullsLeft === 0 && (
                      <p className="mt-4 text-sm text-gray-600">
                        Đăng ký để nhận thêm lượt rút xăm mỗi ngày! ✨
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="animate-pulse">
                      <Flame className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                      <p className="text-xl font-semibold text-gray-700">Đang giải xăm...</p>
                      <p className="text-sm text-gray-500 mt-2">Thành tâm chờ đợi ✨</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Result Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 animate-fade-in">
              {/* Title */}
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-2xl font-bold mb-4">
                  {result.title}
                </div>
              </div>

              {/* Poem */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900">Bài thơ xăm</h3>
                </div>
                <div className="space-y-2 text-center">
                  {result.poem.map((line, i) => (
                    <p key={i} className="text-gray-800 font-medium italic">{line}</p>
                  ))}
                </div>
              </div>

              {/* Meaning */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Ý nghĩa
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.meaning}</p>
              </div>

              {/* Advice */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Lời khuyên
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.advice}</p>
              </div>

              {/* Good Months */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-bold text-green-800 mb-2">🌟 Tháng tốt trong năm</h3>
                <div className="flex flex-wrap gap-2">
                  {result.goodMonths.map(month => (
                    <span key={month} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {month}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-red-600 transition"
                >
                  Rút lại xăm khác
                </button>
                <button className="px-6 py-3 bg-white border-2 border-pink-500 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition inline-flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>
            </div>

            {/* Save Result CTA */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  💾 Lưu kết quả xăm của bạn
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Đăng ký tài khoản để lưu lại tất cả kết quả rút xăm
                </p>
                <Link
                  to="/register"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📖 Về xin xăm</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Xin xăm là phương pháp xem vận mệnh truyền thống của người Việt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Mỗi ngày bạn có <strong>3 lượt rút xăm miễn phí</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Hệ thống có hơn <strong>100 quẻ xăm</strong> với lời giải chi tiết</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Kết quả dựa trên kiến thức phong thủy và kinh nghiệm hàng trăm năm</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
