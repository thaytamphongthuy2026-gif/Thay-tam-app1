import { useState, useEffect } from 'react'
import { Gift, Trophy, Star, TrendingUp, Sparkles, Clock } from 'lucide-react'
import RelatedFeatures from '../components/RelatedFeatures'

interface LixiScenario {
  id: number
  scenario: string
  options: number[]
  correctAnswer: number
  explanation: string
}

interface GameResult {
  score: number
  totalSuggested: number
  rating: string
  badge: string
  verdict: string
}

export default function LiXiGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [totalSuggested, setTotalSuggested] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)

  // Mock scenarios (in production: load from lixiScenarios.json)
  const scenarios: LixiScenario[] = [
    {
      id: 1,
      scenario: '👴 Lì xì ông bà nội/ngoại',
      options: [200000, 500000, 1000000],
      correctAnswer: 500000,
      explanation: 'Ông bà là người lớn tuổi nhất, nên lì xì 500k-1tr là phù hợp, thể hiện lòng hiếu thảo.'
    },
    {
      id: 2,
      scenario: '👨‍👩‍👧 Lì xì bố mẹ',
      options: [500000, 1000000, 2000000],
      correctAnswer: 1000000,
      explanation: 'Bố mẹ đã nuôi dưỡng ta, nên lì xì 1-2 triệu là hợp lý để báo hiếu.'
    },
    {
      id: 3,
      scenario: '👶 Lì xì cháu nhỏ (dưới 10 tuổi)',
      options: [20000, 50000, 100000],
      correctAnswer: 50000,
      explanation: 'Trẻ nhỏ nên nhận lì xì vừa phải 50-100k, đủ để mua đồ chơi nhỏ.'
    },
    {
      id: 4,
      scenario: '🎓 Lì xì cháu học sinh THPT',
      options: [100000, 200000, 500000],
      correctAnswer: 200000,
      explanation: 'Học sinh THPT nên nhận 200-300k, đủ để mua sách vở và tiết kiệm.'
    },
    {
      id: 5,
      scenario: '👷 Lì xì người giúp việc',
      options: [200000, 500000, 1000000],
      correctAnswer: 500000,
      explanation: 'Người giúp việc đã phục vụ gia đình cả năm, nên lì xì 500k-1tr để tri ân.'
    },
    {
      id: 6,
      scenario: '🏢 Lì xì đồng nghiệp thân',
      options: [50000, 100000, 200000],
      correctAnswer: 100000,
      explanation: 'Đồng nghiệp nên lì xì 100-200k, không quá nhiều nhưng thể hiện tình cảm.'
    },
    {
      id: 7,
      scenario: '🎁 Lì xì bạn thân chưa có gia đình',
      options: [100000, 200000, 500000],
      correctAnswer: 200000,
      explanation: 'Bạn thân nên lì xì 200-300k, vừa đủ để mua quà hoặc đi ăn.'
    },
    {
      id: 8,
      scenario: '🚗 Lì xì tài xế/bảo vệ',
      options: [100000, 200000, 500000],
      correctAnswer: 200000,
      explanation: 'Tài xế/bảo vệ nên nhận 200-300k để động viên trong năm mới.'
    },
    {
      id: 9,
      scenario: '🎓 Lì xì sinh viên đại học',
      options: [200000, 500000, 1000000],
      correctAnswer: 500000,
      explanation: 'Sinh viên cần nhiều chi phí học tập, nên lì xì 500k-1tr là hợp lý.'
    },
    {
      id: 10,
      scenario: '👨‍🍳 Lì xì nhân viên nhà hàng quen',
      options: [20000, 50000, 100000],
      correctAnswer: 50000,
      explanation: 'Nhân viên phục vụ nên nhận 50-100k như một lời cảm ơn.'
    }
  ]

  const totalRounds = 10

  useEffect(() => {
    document.title = 'Lì Xì Game - Test Kiến Thức Phong Tục Tết'
  }, [])

  useEffect(() => {
    if (gameStarted && !showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showFeedback) {
      handleTimeout()
    }
  }, [gameStarted, showFeedback, timeLeft])

  function handleTimeout() {
    setShowFeedback(true)
    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextRound()
    }, 2000)
  }

  function handleAnswer(amount: number) {
    if (showFeedback) return

    setSelectedAmount(amount)
    setShowFeedback(true)

    const correct = amount === scenarios[currentRound].correctAnswer
    if (correct) {
      setScore(score + 100)
    }
    setTotalSuggested(totalSuggested + amount)

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextRound()
    }, 2000)
  }

  function nextRound() {
    if (currentRound + 1 >= totalRounds) {
      endGame()
    } else {
      setCurrentRound(currentRound + 1)
      setSelectedAmount(null)
      setShowFeedback(false)
      setTimeLeft(5)
    }
  }

  function endGame() {
    const finalScore = score
    const rating = finalScore >= 800 ? 'Xuất sắc! 🌟' : finalScore >= 600 ? 'Giỏi! ✨' : finalScore >= 400 ? 'Khá! 👍' : 'Cần cải thiện 💪'
    const badge = finalScore >= 800 ? '🏆 Bậc thầy lì xì' : finalScore >= 600 ? '⭐ Chuyên gia' : finalScore >= 400 ? '✨ Thành thạo' : '🎯 Người mới'
    const verdict = totalSuggested >= 8000000 ? 'Hào phóng 💰' : totalSuggested >= 5000000 ? 'Hợp lý ✅' : 'Tiết kiệm 🎯'

    setGameResult({
      score: finalScore,
      totalSuggested,
      rating,
      badge,
      verdict
    })
  }

  function restartGame() {
    setGameStarted(false)
    setCurrentRound(0)
    setSelectedAmount(null)
    setShowFeedback(false)
    setScore(0)
    setTotalSuggested(0)
    setTimeLeft(5)
    setGameResult(null)
  }

  const currentScenario = scenarios[currentRound]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Gift className="w-4 h-4 text-red-600" />
            <span className="text-gray-700">Hoàn toàn MIỄN PHÍ</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            🧧 Lì Xì Game
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test kiến thức về phong tục lì xì Tết • 10 tình huống • 5 giây/câu
          </p>
        </div>

        {!gameStarted && !gameResult ? (
          /* Start Screen */
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">🧧</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sẵn sàng chơi game?
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn sẽ có 5 giây để chọn số tiền lì xì phù hợp cho mỗi tình huống.
              <br />
              Chọn càng chính xác = điểm càng cao!
            </p>

            <div className="bg-yellow-50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-3">📖 Cách chơi</h3>
              <ul className="text-left text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">1.</span>
                  <span>Đọc tình huống (ví dụ: Lì xì ông bà)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">2.</span>
                  <span>Chọn 1 trong 3 mức tiền (có 5 giây)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">3.</span>
                  <span>Xem giải thích sau mỗi câu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">4.</span>
                  <span>Sau 10 câu, xem kết quả và xếp hạng</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                Bắt đầu chơi!
              </span>
            </button>
          </div>
        ) : gameResult ? (
          /* Result Screen */
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-4">
                Kết quả của bạn
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-4xl font-bold">{gameResult.score}</div>
                  <div className="text-sm">Điểm</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-4xl font-bold">{(gameResult.totalSuggested / 1000).toFixed(0)}K</div>
                  <div className="text-sm">Tổng lì xì</div>
                </div>
              </div>
              <div className="text-2xl font-semibold mb-2">{gameResult.rating}</div>
              <div className="text-xl">{gameResult.badge}</div>
            </div>

            {/* Verdict */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Đánh giá
              </h3>
              <div className="text-5xl mb-4">
                {gameResult.verdict.includes('Hào phóng') ? '💰' : gameResult.verdict.includes('Hợp lý') ? '✅' : '🎯'}
              </div>
              <p className="text-3xl font-bold text-orange-600 mb-2">
                {gameResult.verdict}
              </p>
              <p className="text-gray-600">
                {gameResult.verdict.includes('Hào phóng') 
                  ? 'Bạn rất hào phóng! Nhưng hãy cân nhắc ngân sách nhé 😊'
                  : gameResult.verdict.includes('Hợp lý')
                    ? 'Bạn biết cách cân bằng giữa lòng hảo tâm và tài chính!'
                    : 'Bạn tiết kiệm hợp lý. Đôi khi có thể hào phóng hơn chút! 😉'
                }
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{score}</div>
                <div className="text-xs text-gray-600">Điểm</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{Math.floor(score / 100)}/10</div>
                <div className="text-xs text-gray-600">Đúng</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <Gift className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{(gameResult.totalSuggested / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-gray-600">Tổng</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-semibold transition"
              >
                Chơi lại
              </button>
              <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition border-2 border-gray-200">
                Chia sẻ kết quả
              </button>
            </div>
          </div>
        ) : (
          /* Game Screen */
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Câu {currentRound + 1}/{totalRounds}
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className={`text-lg font-bold ${timeLeft <= 2 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                  style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
                />
              </div>
            </div>

            {/* Scenario Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🧧</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentScenario.scenario}
                </h3>
                <p className="text-gray-600">Bạn sẽ lì xì bao nhiêu?</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {currentScenario.options.map((amount, i) => {
                  const isSelected = selectedAmount === amount
                  const isCorrect = amount === currentScenario.correctAnswer
                  const showCorrect = showFeedback && isCorrect
                  const showWrong = showFeedback && isSelected && !isCorrect

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(amount)}
                      disabled={showFeedback}
                      className={`
                        p-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform
                        ${showCorrect ? 'bg-green-500 text-white scale-105 shadow-2xl' : ''}
                        ${showWrong ? 'bg-red-500 text-white' : ''}
                        ${!showFeedback ? 'bg-gradient-to-br from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 hover:scale-105 shadow-lg' : ''}
                        ${showFeedback && !isSelected && !isCorrect ? 'opacity-50' : ''}
                      `}
                    >
                      {(amount / 1000).toFixed(0)}K
                    </button>
                  )
                })}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className={`
                  rounded-2xl p-6 animate-fade-in
                  ${selectedAmount === currentScenario.correctAnswer ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}
                `}>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">
                      {selectedAmount === currentScenario.correctAnswer ? '✅' : '❌'}
                    </div>
                    <div>
                      <p className={`font-bold mb-1 ${selectedAmount === currentScenario.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                        {selectedAmount === currentScenario.correctAnswer ? 'Chính xác!' : 'Chưa chính xác!'}
                      </p>
                      <p className="text-sm text-gray-700">{currentScenario.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Score Display */}
            <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-sm text-gray-600">Điểm hiện tại</div>
                  <div className="text-2xl font-bold text-gray-900">{score}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Gift className="w-6 h-6 text-red-600" />
                <div>
                  <div className="text-sm text-gray-600">Tổng lì xì</div>
                  <div className="text-2xl font-bold text-gray-900">{(totalSuggested / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Features - Always visible */}
        <div className="mt-8">
          <RelatedFeatures
            currentFeature="Lì Xì Thông Minh"
            suggestions={[
              {
                title: 'Xông Đất Tết',
                description: 'Tìm người xông nhà may mắn năm mới',
                icon: '🎊',
                link: '/xong-dat',
                badge: 'TẾT 2026'
              },
              {
                title: 'Số May Mắn',
                description: 'Xem số phát tài năm Ngựa',
                icon: '🎲',
                link: '/so-may-man'
              },
              {
                title: 'Xin Xăm Ảo',
                description: 'Rút xăm xem vận đầu năm',
                icon: '🏮',
                link: '/xin-xam'
              },
              {
                title: 'Xem Tử Vi 2026',
                description: 'Vận mệnh năm Bính Ngọ',
                icon: '🔮',
                link: '/tu-vi'
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}
