import { useState, useEffect } from 'react'
import { Heart, Loader2, AlertCircle, TrendingUp, Gift, Users, Share2, Sparkles, Star, ChevronRight } from 'lucide-react'

interface CompatibilityResult {
  totalScore: number
  ngu_hanh: number
  ngu_giap: number
  can_chi: number
  breakdown: {
    ngu_hanh_detail: string
    ngu_giap_detail: string
    can_chi_detail: string
  }
  advice: string[]
  bestMonths: string[]
  giftSuggestions: string[]
  celebMatch: string
}

export default function TestDuyenSo() {
  const [step, setStep] = useState<'form' | 'result'>('form')
  const [name1, setName1] = useState('')
  const [birthDate1, setBirthDate1] = useState('')
  const [name2, setName2] = useState('')
  const [birthDate2, setBirthDate2] = useState('')
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Test Duyên Số - Xem Độ Hợp Tuổi 2026'
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Simple compatibility calculation (in production: call API)
      const score1 = Math.floor(Math.random() * 30) + 10 // 10-40
      const score2 = Math.floor(Math.random() * 30) + 10 // 10-40
      const score3 = Math.floor(Math.random() * 30) + 10 // 10-40
      const total = score1 + score2 + score3

      const mockResult: CompatibilityResult = {
        totalScore: total,
        ngu_hanh: score1,
        ngu_giap: score2,
        can_chi: score3,
        breakdown: {
          ngu_hanh_detail: total >= 75 ? 'Ngũ hành tương sinh, rất hợp nhau' : total >= 50 ? 'Ngũ hành hòa hợp' : 'Ngũ hành tương khắc, cần hòa giải',
          ngu_giap_detail: total >= 75 ? 'Can Chi của hai người rất hợp, hôn nhân viên mãn' : total >= 50 ? 'Can Chi tương đối hợp' : 'Can Chi có chút xung khắc',
          can_chi_detail: total >= 75 ? 'Tuổi tác rất hợp, dễ hiểu nhau' : total >= 50 ? 'Tuổi tác khá hợp' : 'Tuổi tác có khoảng cách nhất định'
        },
        advice: [
          total >= 75 ? 'Đây là duyên trời định! Hai bạn rất hợp nhau.' : 'Cần thêm thời gian để hiểu nhau hơn.',
          'Hãy thường xuyên giao tiếp và chia sẻ.',
          'Tôn trọng sở thích và không gian riêng của nhau.',
          total >= 50 ? 'Cùng nhau vượt qua khó khăn.' : 'Hãy kiên nhẫn và thấu hiểu.'
        ],
        bestMonths: ['Tháng 1', 'Tháng 5', 'Tháng 9'],
        giftSuggestions: [
          total >= 75 ? '💍 Nhẫn cặp' : '🌹 Hoa hồng',
          '📱 Đồng hồ cặp',
          '✈️ Chuyến du lịch 2 người',
          '🍽️ Bữa tối lãng mạn'
        ],
        celebMatch: total >= 75 ? 'Brad Pitt & Angelina Jolie' : total >= 50 ? 'David & Victoria Beckham' : 'Ryan Gosling & Eva Mendes'
      }

      setTimeout(() => {
        setResult(mockResult)
        setStep('result')
        setLoading(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
      setLoading(false)
    }
  }

  function getScoreColor(score: number) {
    if (score >= 75) return 'from-green-400 to-emerald-500'
    if (score >= 50) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  function getScoreLabel(score: number) {
    if (score >= 75) return 'Rất Hợp! 💖'
    if (score >= 50) return 'Khá Hợp ✨'
    return 'Cần Cố Gắng 💪'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Heart className="w-4 h-4 text-pink-600" />
            <span className="text-gray-700">5 lượt test MIỄN PHÍ</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            💕 Test Duyên Số
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Xem độ hợp tuổi dựa trên <strong>Ngũ Hành, Can Chi</strong> • So sánh với celebrity
          </p>
        </div>

        {step === 'form' ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Person 1 */}
              <div className="bg-pink-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-pink-600" />
                  Người thứ nhất
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={birthDate1}
                      onChange={(e) => setBirthDate1(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Heart Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
              </div>

              {/* Person 2 */}
              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Người thứ hai
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Trần Thị B"
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={birthDate2}
                      onChange={(e) => setBirthDate2(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg
                  transition-all duration-300 transform
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:scale-105'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Đang tính toán...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Xem Độ Hợp! 💕
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
        ) : result ? (
          <div className="space-y-6">
            {/* Total Score Card */}
            <div className={`bg-gradient-to-br ${getScoreColor(result.totalScore)} rounded-3xl shadow-2xl p-8 text-white text-center`}>
              <div className="text-6xl mb-4">💑</div>
              <h2 className="text-3xl font-bold mb-2">
                {name1} & {name2}
              </h2>
              <div className="text-7xl font-bold mb-4">
                {result.totalScore}/100
              </div>
              <div className="text-2xl font-semibold">
                {getScoreLabel(result.totalScore)}
              </div>
            </div>

            {/* Breakdown Radar Chart (Visual Representation) */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📊 Phân Tích Chi Tiết
              </h3>
              
              <div className="space-y-4">
                {/* Ngũ Hành */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Ngũ Hành (40%)</span>
                    <span className="font-bold text-purple-600">{result.ngu_hanh}/40</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${(result.ngu_hanh / 40) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.breakdown.ngu_hanh_detail}</p>
                </div>

                {/* Can Chi */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Can Chi (40%)</span>
                    <span className="font-bold text-blue-600">{result.ngu_giap}/40</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${(result.ngu_giap / 40) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.breakdown.ngu_giap_detail}</p>
                </div>

                {/* Tuổi tác */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Độ tuổi (20%)</span>
                    <span className="font-bold text-green-600">{result.can_chi}/20</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${(result.can_chi / 20) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.breakdown.can_chi_detail}</p>
                </div>
              </div>
            </div>

            {/* Advice */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Lời Khuyên
              </h3>
              <div className="space-y-3">
                {result.advice.map((advice, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{advice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Months & Gifts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best Months */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Tháng tốt để hẹn hò
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.bestMonths.map((month, i) => (
                    <span key={i} className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-800">
                      {month}
                    </span>
                  ))}
                </div>
              </div>

              {/* Celebrity Match */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Giống cặp đôi nổi tiếng
                </h3>
                <p className="text-2xl font-bold text-purple-600">{result.celebMatch}</p>
              </div>
            </div>

            {/* Gift Suggestions */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6 text-red-600" />
                Gợi Ý Quà Tặng
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {result.giftSuggestions.map((gift, i) => (
                  <div key={i} className="bg-red-50 p-4 rounded-xl text-center">
                    <p className="text-lg">{gift}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => { setStep('form'); setResult(null); }}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition border-2 border-gray-200"
              >
                Test cặp khác
              </button>
              <button className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2">
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
