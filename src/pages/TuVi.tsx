import { useState, useEffect } from 'react'
import { Star, Loader2, AlertCircle, Lock, Share2, TrendingUp, Heart, Briefcase, Activity, Sparkles, Users, Gift, ChevronRight } from 'lucide-react'
import { callGeminiAPI } from '../lib/gemini'
import { shareContent } from '../lib/shareUtils'
import LoginPrompt from '../components/LoginPrompt'
import DateInput from '../components/DateInput'

interface MonthPrediction {
  month: number
  monthName: string
  fortune: number // 1-5 stars
  career: number
  love: number
  health: number
  advice: string
  luckyColor: string
  luckyNumber: number
}

interface TuViResult {
  overview: string
  yearRating: number
  strongPoints: string[]
  challenges: string[]
  months: MonthPrediction[]
  luckyMonths: number[]
  unlocked: boolean
}

export default function TuVi() {
  const [step, setStep] = useState<'form' | 'result'>('form')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar')
  const [gender, setGender] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<TuViResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    document.title = 'Xem Tử Vi 2026 - Dự Đoán Vận Mệnh Năm Ất Tỵ'
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const prompt = `Bạn là chuyên gia tử vi phong thủy. Xem tử vi năm 2026 (Ất Tỵ) cho:
- Ngày sinh: ${birthDate} (${calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch'})
- Giờ sinh: ${birthTime}
- Giới tính: ${gender}
${name ? `- Tên: ${name}` : ''}

Hãy trả về CHÍNH XÁC theo format sau:

TỔNG QUAN:
[Mô tả tổng quan vận mệnh năm 2026, 100-150 từ]

ĐÁNH GIÁ NĂM: X/5

ĐIỂM MẠNH:
- Điểm 1
- Điểm 2
- Điểm 3

THÁCH THỨC:
- Thách thức 1
- Thách thức 2

THÁNG 1:
Vận may: X/5
Sự nghiệp: X/5
Tình duyên: X/5
Sức khỏe: X/5
Lời khuyên: [Lời khuyên ngắn gọn]
Màu sắc: [Tên màu]
Số may mắn: [Số]

THÁNG 2:
[Tương tự...]

(Tiếp tục cho 12 tháng)

THÁNG MAY MẮN: Tháng X, Tháng Y, Tháng Z`

      const response = await callGeminiAPI(prompt, 'tuVi')

      if (response.success && response.result) {
        const parsed = parseGeminiResponse(response.result)
        setResult(parsed)
        setStep('result')
      } else {
        setError(response.error || 'Có lỗi xảy ra khi xem tử vi')
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  function parseGeminiResponse(text: string): TuViResult {
    try {
      const overviewMatch = text.match(/TỔNG QUAN:([\s\S]*?)(?=ĐÁNH GIÁ NĂM:|$)/i)
      const ratingMatch = text.match(/ĐÁNH GIÁ NĂM:\s*(\d+)\/5/i)
      const strongMatch = text.match(/ĐIỂM MẠNH:([\s\S]*?)(?=THÁCH THỨC:|$)/i)
      const challengeMatch = text.match(/THÁCH THỨC:([\s\S]*?)(?=THÁNG \d+:|$)/i)
      const luckyMonthsMatch = text.match(/THÁNG MAY MẮN:(.*?)$/i)

      const overview = overviewMatch?.[1]?.trim() || 'Đang phân tích...'
      const yearRating = parseInt(ratingMatch?.[1] || '4')
      
      const strongPoints = (strongMatch?.[1] || '')
        .split('\n')
        .map(s => s.replace(/^-\s*/, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 3)

      const challenges = (challengeMatch?.[1] || '')
        .split('\n')
        .map(s => s.replace(/^-\s*/, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 2)

      const months: MonthPrediction[] = []
      const monthNames = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai']

      for (let i = 1; i <= 12; i++) {
        const monthRegex = new RegExp(`THÁNG ${i}:[\\s\\S]*?(?=THÁNG ${i + 1}:|THÁNG MAY MẮN:|$)`, 'i')
        const monthMatch = text.match(monthRegex)

        if (monthMatch) {
          const monthText = monthMatch[0]
          const fortune = parseInt(monthText.match(/Vận may:\s*(\d+)\/5/i)?.[1] || '3')
          const career = parseInt(monthText.match(/Sự nghiệp:\s*(\d+)\/5/i)?.[1] || '3')
          const love = parseInt(monthText.match(/Tình duyên:\s*(\d+)\/5/i)?.[1] || '3')
          const health = parseInt(monthText.match(/Sức khỏe:\s*(\d+)\/5/i)?.[1] || '3')
          const advice = monthText.match(/Lời khuyên:(.*?)(?=Màu sắc:|$)/i)?.[1]?.trim() || 'Giữ tâm bình an'
          const luckyColor = monthText.match(/Màu sắc:(.*?)(?=Số may mắn:|$)/i)?.[1]?.trim() || 'Đỏ'
          const luckyNumber = parseInt(monthText.match(/Số may mắn:\s*(\d+)/i)?.[1] || '8')

          months.push({
            month: i,
            monthName: monthNames[i - 1],
            fortune,
            career,
            love,
            health,
            advice,
            luckyColor,
            luckyNumber
          })
        }
      }

      const luckyMonthsText = luckyMonthsMatch?.[1] || ''
      const luckyMonths = luckyMonthsText
        .match(/Tháng (\d+)/g)
        ?.map(m => parseInt(m.replace('Tháng ', ''))) || [1, 5, 9]

      return {
        overview,
        yearRating,
        strongPoints,
        challenges,
        months: months.length > 0 ? months : generateDefaultMonths(),
        luckyMonths,
        unlocked: false
      }
    } catch (err) {
      console.error('Parse error:', err)
      return {
        overview: 'Năm 2026 là năm Ất Tỵ, mang nhiều may mắn và cơ hội mới...',
        yearRating: 4,
        strongPoints: ['Tài lộc dồi dào', 'Sự nghiệp thăng tiến', 'Sức khỏe tốt'],
        challenges: ['Cần chú ý tình cảm', 'Đề phòng tiểu nhân'],
        months: generateDefaultMonths(),
        luckyMonths: [1, 5, 9],
        unlocked: false
      }
    }
  }

  function generateDefaultMonths(): MonthPrediction[] {
    const monthNames = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai']
    return monthNames.map((name, i) => ({
      month: i + 1,
      monthName: name,
      fortune: 3 + Math.floor(Math.random() * 2),
      career: 3 + Math.floor(Math.random() * 2),
      love: 3 + Math.floor(Math.random() * 2),
      health: 3 + Math.floor(Math.random() * 2),
      advice: 'Giữ tâm bình an, chờ đợi thời cơ',
      luckyColor: ['Đỏ', 'Vàng', 'Xanh', 'Tím'][Math.floor(Math.random() * 4)],
      luckyNumber: Math.floor(Math.random() * 90) + 10
    }))
  }

  function getRatingColor(rating: number) {
    if (rating >= 5) return 'text-yellow-500'
    if (rating >= 4) return 'text-green-500'
    if (rating >= 3) return 'text-blue-500'
    return 'text-gray-400'
  }

  async function handleUnlock(method: 'share' | 'pay') {
    if (method === 'share') {
      // Implement actual share
      const shared = await shareContent({
        title: 'Xem Tử Vi 2026 - Thầy Tám Phong Thủy',
        text: `Tôi vừa xem tử vi năm 2026 rất chính xác! Bạn cũng thử xem nhé 🔮`
      })
      
      if (shared) {
        alert('🎉 Cảm ơn bạn đã chia sẻ! Đang mở khóa toàn bộ nội dung...')
        setUnlocked(true)
        if (result) {
          setResult({ ...result, unlocked: true })
        }
      }
    } else {
      // Redirect to pricing
      window.location.href = '/pricing'
    }
  }

  const freeMonths = 4 // Show first 4 months (30% of 12 months ≈ 4 months)
  const isLocked = result && !unlocked && !result.unlocked

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-gray-700">Xem 30% MIỄN PHÍ</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            ⭐ Xem Tử Vi 2026
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dự đoán vận mệnh năm Ất Tỵ • Tài lộc, sự nghiệp, tình duyên, sức khỏe
          </p>
        </div>

        {step === 'form' ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name (Optional) */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Tên của bạn (tuỳ chọn)
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên để cá nhân hóa kết quả"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Birth Date & Time */}
              <DateInput
                label="Ngày sinh"
                value={birthDate}
                onChange={setBirthDate}
                required={true}
                showTime={true}
                timeValue={birthTime}
                onTimeChange={setBirthTime}
                showCalendarType={true}
                calendarType={calendarType}
                onCalendarTypeChange={setCalendarType}
              />

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Giới tính *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'male', label: '👨 Nam', emoji: '👨' },
                    { value: 'female', label: '👩 Nữ', emoji: '👩' },
                    { value: 'other', label: '🧑 Khác', emoji: '🧑' }
                  ].map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setGender(g.value)}
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${gender === g.value
                          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="text-3xl mb-1">{g.emoji}</div>
                      <div className="text-sm font-medium text-gray-700">
                        {g.label.replace(g.emoji, '').trim()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !birthDate || !birthTime || !gender}
                className={`
                  w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg
                  transition-all duration-300 transform
                  ${loading || !birthDate || !birthTime || !gender
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Đang xem tử vi...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Xem Tử Vi Năm 2026 ⭐
                  </span>
                )}
              </button>
            </form>

            {error && (
              error.includes('đăng nhập') ? (
                <div className="mt-6">
                  <LoginPrompt message={error} />
                </div>
              ) : (
                <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Có lỗi xảy ra</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {name ? `Tử Vi 2026 - ${name}` : 'Tử Vi Năm 2026'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-600">Đánh giá năm:</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${i < result.yearRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-gray-900">{result.yearRating}/5</span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">{result.overview}</p>
              </div>

              {/* Strong Points & Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Điểm mạnh năm 2026
                  </h3>
                  <ul className="space-y-2">
                    {result.strongPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6">
                  <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Thách thức cần lưu ý
                  </h3>
                  <ul className="space-y-2">
                    {result.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-orange-700">
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Month-by-Month Timeline */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-purple-600" />
                Vận Mệnh 12 Tháng
              </h3>

              <div className="space-y-4">
                {result.months.map((month, index) => {
                  const isFree = index < freeMonths
                  const isLuckyMonth = result.luckyMonths.includes(month.month)

                  return (
                    <div
                      key={month.month}
                      className={`
                        relative rounded-2xl border-2 p-6 transition-all
                        ${isLuckyMonth ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'}
                        ${!isFree && isLocked ? 'opacity-40' : ''}
                      `}
                    >
                      {/* Lock Overlay */}
                      {!isFree && isLocked && (
                        <div className="absolute inset-0 backdrop-blur-sm bg-white/50 rounded-2xl flex items-center justify-center z-10">
                          <Lock className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Tháng {month.month} - {month.monthName}
                            {isLuckyMonth && <span className="text-yellow-500">⭐</span>}
                          </h4>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < month.fortune ? getRatingColor(month.fortune) : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Aspects */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-xs text-gray-600">Sự nghiệp</div>
                            <div className="font-bold text-gray-900">{month.career}/5</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-600" />
                          <div>
                            <div className="text-xs text-gray-600">Tình duyên</div>
                            <div className="font-bold text-gray-900">{month.love}/5</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="text-xs text-gray-600">Sức khỏe</div>
                            <div className="font-bold text-gray-900">{month.health}/5</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="text-xs text-gray-600">Số may mắn</div>
                            <div className="font-bold text-gray-900">{month.luckyNumber}</div>
                          </div>
                        </div>
                      </div>

                      {/* Advice */}
                      <div className="bg-white rounded-xl p-4 mb-3">
                        <p className="text-sm text-gray-700">{month.advice}</p>
                      </div>

                      {/* Lucky Color */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Màu may mắn:</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-800">
                          {month.luckyColor}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Unlock CTA */}
              {isLocked && (
                <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center">
                  <Lock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    🔓 Mở khóa toàn bộ tử vi 12 tháng
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bạn đang xem 4/12 tháng (30%). Mở khóa để xem chi tiết 8 tháng còn lại!
                  </p>

                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleUnlock('share')}
                      className="flex-1 md:flex-initial bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition inline-flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Chia sẻ để mở khóa MIỄN PHÍ
                    </button>
                    
                    <button
                      onClick={() => handleUnlock('pay')}
                      className="flex-1 md:flex-initial bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold transition inline-flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Nâng cấp Premium
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    💡 Chia sẻ lên Facebook/Zalo để mở khóa miễn phí 100%
                  </p>
                </div>
              )}
            </div>

            {/* Compare with Friends CTA */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Users className="w-12 h-12 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">So sánh tử vi với bạn bè</h3>
                    <p className="text-sm text-gray-600">Xem độ hợp tuổi và vận mệnh chung</p>
                  </div>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                  So sánh ngay
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => { setStep('form'); setResult(null); setUnlocked(false); }}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition border-2 border-gray-200"
              >
                Xem tử vi khác
              </button>
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Chia sẻ kết quả
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
