import { useState, useEffect } from 'react'
import { useAuth } from '../lib/authContext'
import { Home, Loader2, AlertCircle, Share2, Users, Sparkles, Calendar, Download, Gift, Star, Image as ImageIcon } from 'lucide-react'
import { findCompatiblePeople, type CompatiblePerson } from '../lib/canChiCalculator'
import { downloadInvitationCard, type CardData } from '../lib/cardGenerator'
import { shareContent } from '../lib/shareUtils'
import { Link } from 'react-router-dom'
import LoginPrompt from '../components/LoginPrompt'

export default function XongDat() {
  const { user, updateUserInfo } = useAuth()
  const [step, setStep] = useState<'form' | 'result'>('form')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [results, setResults] = useState<CompatiblePerson[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Mời Xông Đất Tết 2026 - Tìm Người May Mắn'
    
    // Pre-fill from user profile if available
    if (user?.birth_date) {
      // Extract year from YYYY-MM-DD or DD/MM/YYYY
      const yearMatch = user.birth_date.match(/\d{4}/)
      if (yearMatch) setBirthYear(yearMatch[0])
    }
    if (user?.gender) {
      setGender(user.gender as 'male' | 'female')
    }
  }, [user])

  const canUseFeature = user && (user.plan === 'pro' || user.plan === 'premium')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Auto-save gender to profile
      if (user && updateUserInfo) {
        await updateUserInfo({
          gender: gender,
        })
      }

      // Validate input
      const year = parseInt(birthYear)
      if (isNaN(year) || year < 1900 || year > 2025) {
        setError('Năm sinh không hợp lệ')
        return
      }

      // Use Can Chi calculator - NO AI
      const compatiblePeople = findCompatiblePeople(year, gender)
      
      if (compatiblePeople.length > 0) {
        setResults(compatiblePeople)
        setStep('result')
      } else {
        setError('Không tìm thấy người phù hợp. Vui lòng thử lại.')
      }
    } catch (err: any) {
      console.error('XongDat error:', err)
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  function getRatingColor(rating: number) {
    if (rating >= 5) return 'from-red-400 to-pink-500'
    if (rating >= 4) return 'from-yellow-400 to-orange-500'
    return 'from-blue-400 to-indigo-500'
  }

  function generateInvitationCard(person: CompatiblePerson) {
    const card = `
🏮 MỜI XÔNG ĐẤT TẾT 2026 🏮

Kính mời bạn là người xông đất đầu năm cho gia đình tôi!

👤 Bạn thuộc: ${person.zodiac}
🔮 Mệnh: ${person.element}
⭐ Độ hợp: ${person.compatibility}

⏰ Giờ tốt nhất:
${person.luckyHours.map(h => `• ${h}`).join('\n')}

🎁 Gợi ý quà:
${person.gifts.map(g => `• ${g}`).join('\n')}

🧧 Chúc bạn năm mới nhiều may mắn, tài lộc!
    `.trim()

    return card
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Home className="w-4 h-4 text-red-600" />
            <span className="text-gray-700">
              {canUseFeature ? 'Gói Lộc Phát hoặc Đại Cát' : 'Cần gói Lộc Phát hoặc Đại Cát'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🏮 Mời Xông Đất Tết 2026
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tìm người may mắn để xông đất đầu năm dựa trên <strong>Tam hợp, Lục hợp, Ngũ hành tương sinh</strong>
          </p>
        </div>

        {!user ? (
          // Not logged in - show login prompt
          <LoginPrompt message="Bạn cần đăng nhập để sử dụng tính năng Mời Xông Đất" />
        ) : !canUseFeature ? (
          // Logged in but no premium plan
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tính năng đặc biệt cho gói Lộc Phát & Đại Cát
            </h2>
            <p className="text-gray-600 mb-8">
              Nâng cấp lên gói Lộc Phát (68,000 VNĐ/tháng) hoặc Đại Cát (168,000 VNĐ/tháng) để sử dụng tính năng tìm người xông đất may mắn
            </p>
            <Link
              to="/pricing"
              className="inline-block bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Xem gói nâng cấp
            </Link>
          </div>
        ) : step === 'form' ? (
          <>
            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-red-600" />
                    Thông tin gia chủ
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cung cấp thông tin của người chủ nhà để tìm người xông đất phù hợp nhất
                  </p>
                </div>

                {/* Birth Year */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    1️⃣ Năm sinh của gia chủ
                  </label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 1990"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    required
                    min="1900"
                    max="2025"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Năm sinh âm lịch hoặc dương lịch đều được
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    2️⃣ Giới tính của gia chủ
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${gender === 'male'
                          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="text-3xl mb-2">👨</div>
                      <div className="font-semibold text-gray-900">Nam</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${gender === 'female'
                          ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="text-3xl mb-2">👩</div>
                      <div className="font-semibold text-gray-900">Nữ</div>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !birthYear}
                  className={`
                    w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg
                    transition-all duration-300 transform
                    ${loading || !birthYear
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-105'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Đang tìm người may mắn...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Users className="w-6 h-6" />
                      Tìm Người Xông Đất 🧧
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

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Tam Hợp - Lục Hợp</h3>
                <p className="text-sm text-gray-600">
                  Dựa trên lý thuyết Tam hợp và Lục hợp trong phong thủy
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Ngũ Hành Tương Sinh</h3>
                <p className="text-sm text-gray-600">
                  Kim - Thủy - Mộc - Hỏa - Thổ tương sinh với nhau
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Gợi Ý Quà Tặng</h3>
                <p className="text-sm text-gray-600">
                  Quà mang theo phù hợp với mệnh và ý nghĩa
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="space-y-6">
              {/* User Input Summary */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Kết Quả Tìm Người Xông Đất
                </h2>
                
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 opacity-80" />
                    <div>
                      <p className="text-xs opacity-80">Gia chủ sinh năm</p>
                      <p className="font-semibold">{birthYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 opacity-80" />
                    <div>
                      <p className="text-xs opacity-80">Giới tính</p>
                      <p className="font-semibold">{gender === 'male' ? 'Nam' : 'Nữ'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🎉 Tìm được {results.length} nhóm người may mắn!
                </h3>
                <p className="text-gray-600">
                  Dưới đây là những người phù hợp nhất để xông đất cho gia đình bạn
                </p>
              </div>

              {/* People Cards */}
              {results.map((person, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow border-4 border-red-200"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-gray-100">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">🧧</span>
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            Nhóm {index + 1}
                          </span>
                          <div className={`inline-block ml-3 px-4 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getRatingColor(person.rating)}`}>
                            {person.compatibility}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 ml-12">
                        <p className="text-2xl font-bold text-red-600">
                          👤 {person.ageRange}
                        </p>
                        <p className="text-lg text-gray-600">
                          {person.zodiac}
                        </p>
                        <p className="text-md text-purple-600 font-semibold">
                          🔮 Mệnh {person.element}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 items-end">
                      <div className="text-2xl">
                        {'⭐'.repeat(person.rating)}
                      </div>
                      <span className="text-sm font-bold text-gray-600">
                        {person.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Reasons */}
                  <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Sparkles className="w-6 h-6 text-green-600" />
                      Tại sao người này phù hợp?
                    </h4>
                    <div className="space-y-3">
                      {person.reasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm">
                          <span className="text-2xl flex-shrink-0">
                            {i === 0 ? '🔥' : i === 1 ? '💎' : '✨'}
                          </span>
                          <p className="text-gray-800 font-medium leading-relaxed">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lucky Hours */}
                  <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      Giờ tốt để xông đất
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {person.luckyHours.map((hour, i) => (
                        <div
                          key={i}
                          className="bg-white border-2 border-blue-300 text-blue-800 px-4 py-3 rounded-xl font-semibold text-center shadow-sm"
                        >
                          <div className="text-2xl mb-1">⏰</div>
                          <div className="text-sm">{hour}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gifts */}
                  <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Gift className="w-6 h-6 text-yellow-600" />
                      Quà tặng nên mang theo
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {person.gifts.map((gift, i) => (
                        <div
                          key={i}
                          className="bg-white border-2 border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl font-semibold text-center shadow-sm"
                        >
                          🎁 {gift}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                    {/* Download Text */}
                    <button 
                      onClick={() => {
                        const card = generateInvitationCard(person)
                        const blob = new Blob([card], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `moi-xong-dat-${person.zodiac}.txt`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Text
                    </button>

                    {/* Download JPG */}
                    <button 
                      onClick={async () => {
                        const cardData: CardData = {
                          zodiac: person.zodiac,
                          element: person.element,
                          ageRange: person.ageRange,
                          compatibility: person.compatibility,
                          luckyHours: person.luckyHours,
                          gifts: person.gifts,
                          year: 2026
                        }
                        await downloadInvitationCard(cardData, `thiep-xong-dat-${person.zodiac.replace(/[^a-zA-Z0-9]/g, '')}.jpg`)
                      }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Thiệp JPG
                    </button>

                    {/* Share */}
                    <button 
                      onClick={() => {
                        const card = generateInvitationCard(person)
                        shareContent({
                          title: 'Mời Xông Đất Tết 2026',
                          text: card
                        })
                      }}
                      className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Chia sẻ
                    </button>
                  </div>
                </div>
              ))}

              {/* Back Button */}
              <button
                onClick={() => { setStep('form'); setResults([]); }}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition border-2 border-gray-200"
              >
                Tìm người khác
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
