import { useState, useEffect } from 'react'
import { Dices, Trophy, Share2, Flame, Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { shareContent } from '../lib/shareUtils'

export default function SoMayMan() {
  const [spinning, setSpinning] = useState(false)
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null)
  const [spinsLeft, setSpinsLeft] = useState(3)
  const [streak, setStreak] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    document.title = 'Số May Mắn Hôm Nay - Thầy Tám Phong Thủy 2026'
  }, [])

  const handleSpin = () => {
    if (spinsLeft === 0 || spinning) return

    setSpinning(true)
    setShowResult(false)

    // Animate spinning
    let counter = 0
    const interval = setInterval(() => {
      setLuckyNumber(Math.floor(Math.random() * 100))
      counter++
      
      if (counter > 20) {
        clearInterval(interval)
        // Final lucky number
        const finalNumber = Math.floor(Math.random() * 100)
        setLuckyNumber(finalNumber)
        setSpinning(false)
        setShowResult(true)
        setSpinsLeft(prev => prev - 1)
        setStreak(prev => prev + 1)
      }
    }, 100)
  }

  const getLuckyMeaning = (num: number) => {
    if (num >= 88) return { title: 'Siêu Đại Cát! 🎊', desc: 'Số vô cùng may mắn! Hôm nay là ngày tuyệt vời cho tài lộc.', color: 'from-yellow-400 to-orange-500' }
    if (num >= 70) return { title: 'Đại Cát! 🌟', desc: 'Số rất may mắn! Hãy tận dụng cơ hội.', color: 'from-green-400 to-emerald-500' }
    if (num >= 50) return { title: 'Trung Cát! ✨', desc: 'Số khá tốt. Ngày bình an thuận lợi.', color: 'from-blue-400 to-indigo-500' }
    if (num >= 30) return { title: 'Bình Thường! 😊', desc: 'Số trung bình. Hãy cẩn thận và chờ đợi.', color: 'from-purple-400 to-pink-500' }
    return { title: 'Hãy Thử Lại! 🙏', desc: 'Đừng lo lắng, may mắn sẽ đến sau.', color: 'from-gray-400 to-gray-500' }
  }

  const meaning = luckyNumber !== null ? getLuckyMeaning(luckyNumber) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-gray-700">HOT Feature</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            🎰 Số May Mắn Hôm Nay
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quay số may mắn mỗi ngày • Tích lũy streak • So tài với bạn bè
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <Dices className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{spinsLeft}</div>
            <div className="text-xs text-gray-600">Lượt còn lại</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{streak}</div>
            <div className="text-xs text-gray-600">Streak hôm nay</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">-</div>
            <div className="text-xs text-gray-600">Rank</div>
          </div>
        </div>

        {/* Main Spin Area */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center">
            {/* Number Display */}
            <div className={`
              w-48 h-48 mx-auto rounded-full flex items-center justify-center mb-8
              bg-gradient-to-br ${spinning ? 'from-gray-200 to-gray-300' : meaning?.color || 'from-orange-400 to-red-500'}
              ${spinning ? 'animate-spin' : ''}
              shadow-2xl
            `}>
              <div className="text-7xl font-bold text-white">
                {luckyNumber !== null ? luckyNumber : '?'}
              </div>
            </div>

            {/* Result */}
            {showResult && meaning && (
              <div className="mb-6 animate-fade-in">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{meaning.title}</h3>
                <p className="text-lg text-gray-600">{meaning.desc}</p>
              </div>
            )}

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={spinsLeft === 0 || spinning}
              className={`
                px-12 py-4 rounded-full text-xl font-bold text-white shadow-lg
                transition-all duration-300 transform
                ${spinsLeft === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : spinning
                    ? 'bg-orange-400 cursor-wait'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105'
                }
              `}
            >
              {spinning ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 animate-spin" />
                  Đang quay...
                </span>
              ) : spinsLeft === 0 ? (
                'Hết lượt quay'
              ) : (
                'Quay Số May Mắn! 🎲'
              )}
            </button>

            {spinsLeft === 0 && (
              <p className="mt-4 text-sm text-gray-600">
                Đăng ký để nhận thêm lượt quay mỗi ngày! ✨
              </p>
            )}
          </div>
        </div>

        {/* Share & Unlock */}
        {showResult && (
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                🎁 Mở khóa thêm 3 lượt quay!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Chia sẻ kết quả với bạn bè để nhận thêm lượt quay
              </p>
              <button 
                onClick={() => shareContent({
                  title: `Số may mắn hôm nay của tôi: ${luckyNumber}`,
                  text: `Tôi vừa quay được số ${luckyNumber}! Bạn cũng thử nhé 🎰`
                })}
                className="bg-white px-6 py-3 rounded-full font-semibold text-purple-600 hover:bg-purple-50 transition inline-flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Chia sẻ ngay
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard Teaser */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Bảng Xếp Hạng
            </h3>
            <Link to="/login" className="text-sm text-purple-600 font-semibold hover:text-purple-700">
              Xem tất cả →
            </Link>
          </div>
          
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Nguyễn V.A', number: 99, streak: 15 },
              { rank: 2, name: 'Trần T.B', number: 96, streak: 12 },
              { rank: 3, name: 'Lê V.C', number: 93, streak: 10 }
            ].map(user => (
              <div key={user.rank} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                  ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'}
                `}>
                  {user.rank}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-600">Số {user.number} • Streak {user.streak}</div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📖 Cách chơi</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Mỗi ngày bạn có <strong>3 lượt quay miễn phí</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Số càng cao = May mắn càng lớn (88+ là Siêu Cát!)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span><strong>Chia sẻ</strong> kết quả để mở khóa thêm lượt quay</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Tích lũy <strong>streak</strong> mỗi ngày để leo top bảng xếp hạng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">5.</span>
              <span>Đăng ký tài khoản để lưu kết quả và nhận thưởng đặc biệt 🎁</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
