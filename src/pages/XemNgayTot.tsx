import { useState, useEffect } from 'react'
import { Calendar, Loader2, AlertCircle, Star, Clock, Users, Share2, Download, ChevronRight, Sparkles } from 'lucide-react'
import { callGeminiAPI } from '../lib/gemini'

interface GoodDate {
  solar: string
  lunar: string
  dayName: string
  reasons: string[]
  bestHours: string[]
  avoid: string[]
  rating: number
}

export default function XemNgayTot() {
  const [step, setStep] = useState<'form' | 'result'>('form')
  const [purpose, setPurpose] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [userName, setUserName] = useState('')
  const [results, setResults] = useState<GoodDate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Xem Ngày Tốt 2026 - Chọn Ngày Hoàng Đạo Khai Trương, Cưới Hỏi'
    
    // Set default date range (next 30 days)
    const today = new Date()
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    setDateFrom(today.toISOString().split('T')[0])
    setDateTo(nextMonth.toISOString().split('T')[0])
  }, [])

  const purposes = [
    { value: 'khai-truong', label: '🏪 Khai trương kinh doanh', emoji: '🏪' },
    { value: 'cuoi-hoi', label: '💒 Cưới hỏi, đính hôn', emoji: '💒' },
    { value: 'dong-tho', label: '🏗️ Động thổ, xây nhà', emoji: '🏗️' },
    { value: 'xuat-hanh', label: '✈️ Xuất hành xa', emoji: '✈️' },
    { value: 'nhap-trach', label: '🏠 Nhập trạch (dọn nhà)', emoji: '🏠' },
    { value: 'ky-hop-dong', label: '📝 Ký hợp đồng', emoji: '📝' },
    { value: 'mua-xe', label: '🚗 Mua xe, mua nhà', emoji: '🚗' },
    { value: 'mo-tai-khoan', label: '💰 Mở tài khoản ngân hàng', emoji: '💰' }
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const purposeLabel = purposes.find(p => p.value === purpose)?.label || purpose
      
      const prompt = `Bạn là chuyên gia phong thủy. Hãy tìm 5 ngày TỐT NHẤT từ ${dateFrom} đến ${dateTo} cho mục đích: ${purposeLabel}.
      
Người hỏi: ${userName || 'Không cung cấp'}, năm sinh: ${birthYear || 'Không cung cấp'}.

Hãy trả về CHÍNH XÁC theo format sau (không thêm bớt):

NGÀY 1:
Dương lịch: DD/MM/YYYY
Âm lịch: DD/MM (Tên ngày Can Chi)
Lý do: Lý do 1 | Lý do 2 | Lý do 3
Giờ tốt: Giờ 1 (07:00-09:00) | Giờ 2 (13:00-15:00) | Giờ 3 (19:00-21:00)
Tránh: Tuổi 1 | Tuổi 2
Đánh giá: 5/5

NGÀY 2:
Dương lịch: DD/MM/YYYY
...

(Tiếp tục cho 5 ngày)`

      const response = await callGeminiAPI(prompt, 'xemNgay')

      if (response.success && response.result) {
        const parsed = parseGeminiResponse(response.result)
        setResults(parsed)
        setStep('result')
      } else {
        setError(response.error || 'Có lỗi xảy ra khi xem ngày tốt')
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  function parseGeminiResponse(text: string): GoodDate[] {
    const dates: GoodDate[] = []
    const dayBlocks = text.split(/NGÀY \d+:/).filter(b => b.trim())

    dayBlocks.forEach(block => {
      try {
        const lines = block.split('\n').filter(l => l.trim())
        
        const solarMatch = lines.find(l => l.includes('Dương lịch:'))
        const lunarMatch = lines.find(l => l.includes('Âm lịch:'))
        const reasonMatch = lines.find(l => l.includes('Lý do:'))
        const hoursMatch = lines.find(l => l.includes('Giờ tốt:'))
        const avoidMatch = lines.find(l => l.includes('Tránh:'))
        const ratingMatch = lines.find(l => l.includes('Đánh giá:'))

        if (solarMatch && lunarMatch) {
          const solar = solarMatch.split(':')[1]?.trim() || ''
          const lunar = lunarMatch.split(':')[1]?.trim() || ''
          const reasons = reasonMatch?.split(':')[1]?.split('|').map(r => r.trim()) || []
          const bestHours = hoursMatch?.split(':')[1]?.split('|').map(h => h.trim()) || []
          const avoid = avoidMatch?.split(':')[1]?.split('|').map(a => a.trim()) || []
          const ratingText = ratingMatch?.split(':')[1]?.trim() || '5/5'
          const rating = parseInt(ratingText.split('/')[0]) || 5

          dates.push({
            solar,
            lunar,
            dayName: lunar.split('(')[1]?.replace(')', '') || '',
            reasons,
            bestHours,
            avoid,
            rating
          })
        }
      } catch (err) {
        console.error('Parse error:', err)
      }
    })

    return dates.slice(0, 5) // Max 5 dates
  }

  function getRatingColor(rating: number) {
    if (rating >= 5) return 'from-yellow-400 to-orange-500'
    if (rating >= 4) return 'from-green-400 to-emerald-500'
    if (rating >= 3) return 'from-blue-400 to-indigo-500'
    return 'from-gray-400 to-gray-500'
  }

  function getRatingLabel(rating: number) {
    if (rating >= 5) return 'Đại Cát 🌟'
    if (rating >= 4) return 'Trung Cát ✨'
    if (rating >= 3) return 'Tiểu Cát 💫'
    return 'Bình Thường'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">3 lượt xem MIỄN PHÍ</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📅 Xem Ngày Tốt 2026
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chọn ngày hoàng đạo cho <strong>khai trương, cưới hỏi, động thổ</strong> dựa trên phong thủy và Can Chi
          </p>
        </div>

        {step === 'form' ? (
          <>
            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Purpose */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    1️⃣ Mục đích xem ngày
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {purposes.map(p => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPurpose(p.value)}
                        className={`
                          p-4 rounded-xl border-2 transition-all text-left
                          ${purpose === p.value
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="text-2xl mb-1">{p.emoji}</div>
                        <div className="text-xs font-medium text-gray-700">
                          {p.label.replace(p.emoji, '').trim()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birth Year */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    2️⃣ Năm sinh của bạn (tuỳ chọn)
                  </label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 1990"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    min="1900"
                    max="2025"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Để trống nếu không muốn cung cấp. Cung cấp năm sinh giúp kết quả chính xác hơn.
                  </p>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      3️⃣ Từ ngày
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Đến ngày
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Optional Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Tên của bạn (tuỳ chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên để kết quả được cá nhân hoá"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !purpose}
                  className={`
                    w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg
                    transition-all duration-300 transform
                    ${loading || !purpose
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Đang tìm ngày tốt nhất...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      Xem Ngày Tốt Ngay! 🔮
                    </span>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Có lỗi xảy ra</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Chính Xác</h3>
                <p className="text-sm text-gray-600">
                  Dựa trên Can Chi, Ngũ Hành, Sao tốt xấu
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Giờ Hoàng Đạo</h3>
                <p className="text-sm text-gray-600">
                  Gợi ý giờ tốt nhất trong ngày
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Tuổi Phạm</h3>
                <p className="text-sm text-gray-600">
                  Cảnh báo tuổi cần tránh
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="space-y-6">
              {/* Result Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎉 Tìm được {results.length} ngày tốt cho bạn!
                </h2>
                <p className="text-gray-600">
                  {userName && `Xin chào ${userName}! `}
                  Dưới đây là những ngày phù hợp nhất cho {purposes.find(p => p.value === purpose)?.label}
                </p>
              </div>

              {/* Date Cards */}
              {results.map((date, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-gray-900">
                          Ngày {index + 1}
                        </span>
                        <div className={`px-4 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getRatingColor(date.rating)}`}>
                          {getRatingLabel(date.rating)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-blue-600">
                          📅 {date.solar}
                        </p>
                        <p className="text-lg text-gray-600">
                          🌙 Âm lịch: {date.lunar}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {'⭐'.repeat(date.rating)}
                    </div>
                  </div>

                  {/* Reasons */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Tại sao ngày này tốt?
                    </h4>
                    <div className="space-y-2">
                      {date.reasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Hours */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Giờ tốt nhất
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {date.bestHours.map((hour, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          ⏰ {hour}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Avoid */}
                  {date.avoid.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        Tuổi nên tránh
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {date.avoid.map((a, i) => (
                          <span
                            key={i}
                            className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            🚫 {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Thêm vào lịch
                    </button>
                    <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Chia sẻ
                    </button>
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => { setStep('form'); setResults([]); }}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition border-2 border-gray-200"
                >
                  Xem ngày khác
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-semibold transition">
                  Lưu kết quả
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
