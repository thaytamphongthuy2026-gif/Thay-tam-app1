import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { callGeminiAPI } from '../lib/gemini'
import { solarToLunar } from '../lib/lunarCalendar'
import { getStaticCalendarData, loadFromCache, saveToCache } from '../lib/calendarData'

interface MonthData {
  month: number
  year: number
  goodDays: number[]
  badDays: number[]
  details: string
  monthlyAdvice: string
  luckyColors: string[]
  luckyDirection: string
}

export default function LichPhongThuy() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthData, setMonthData] = useState<MonthData | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [dayDetails, setDayDetails] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [loadingDay, setLoadingDay] = useState(false)
  const [error, setError] = useState('')

  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  // Load month data when component mounts or month changes
  useEffect(() => {
    loadMonthData()
  }, [currentMonth, currentYear])

  const loadMonthData = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Step 1: Try static data first (instant)
      const staticData = getStaticCalendarData(currentMonth, currentYear)
      if (staticData) {
        console.log('✅ Using static calendar data (instant)')
        setMonthData({
          month: currentMonth,
          year: currentYear,
          goodDays: staticData.goodDays,
          badDays: staticData.badDays,
          details: staticData.advice,
          monthlyAdvice: staticData.advice,
          luckyColors: staticData.luckyColors,
          luckyDirection: staticData.luckyDirection
        })
        setLoading(false)
        return
      }

      // Step 2: Try cache (fast)
      const cachedData = loadFromCache(currentMonth, currentYear)
      if (cachedData) {
        console.log('✅ Using cached calendar data (fast)')
        setMonthData({
          month: currentMonth,
          year: currentYear,
          goodDays: cachedData.goodDays,
          badDays: cachedData.badDays,
          details: cachedData.advice,
          monthlyAdvice: cachedData.advice,
          luckyColors: cachedData.luckyColors,
          luckyDirection: cachedData.luckyDirection
        })
        setLoading(false)
        return
      }

      // Step 3: Fallback to AI (slow but comprehensive)
      console.log('⏳ Loading from AI (10s)...')
      const prompt = `Hãy cung cấp thông tin lịch phong thủy cho tháng ${currentMonth} năm ${currentYear}:

1. Các ngày tốt trong tháng (liệt kê 7-10 ngày tốt nhất)
2. Các ngày xấu cần tránh (liệt kê 3-5 ngày)
3. Những việc nên làm trong tháng này
4. Những việc nên tránh trong tháng này
5. Phương vị tốt của tháng
6. Màu sắc may mắn của tháng (2-3 màu)

Trả lời theo format sau:
NGÀY TỐT: [danh sách ngày, VD: 1, 5, 8, 12]
NGÀY XẤU: [danh sách ngày, VD: 3, 7, 15]
NÊN LÀM: [danh sách]
NÊN TRÁNH: [danh sách]
PHƯƠNG VỊ: [phương hướng]
MÀU SẮC: [danh sách màu]`

      const result = await callGeminiAPI(prompt, 'chat')
      
      // Parse response
      const response = result.result || ''
      
      // Extract good days
      const goodDaysMatch = response.match(/NGÀY TỐT:([^\n]+)/)
      const goodDays = goodDaysMatch 
        ? goodDaysMatch[1].match(/\d+/g)?.map(Number) || []
        : []

      // Extract bad days
      const badDaysMatch = response.match(/NGÀY XẤU:([^\n]+)/)
      const badDays = badDaysMatch
        ? badDaysMatch[1].match(/\d+/g)?.map(Number) || []
        : []

      // Extract colors
      const colorsMatch = response.match(/MÀU SẮC:([^\n]+)/)
      const colors = colorsMatch
        ? colorsMatch[1].split(',').map(c => c.trim()).filter(c => c)
        : ['Xanh', 'Vàng']

      // Extract direction
      const directionMatch = response.match(/PHƯƠNG VỊ:([^\n]+)/)
      const direction = directionMatch ? directionMatch[1].trim() : 'Đông Nam'

      const monthDataResult = {
        month: currentMonth,
        year: currentYear,
        goodDays,
        badDays,
        details: response || '',
        monthlyAdvice: response || '',
        luckyColors: colors,
        luckyDirection: direction
      }

      // Save to cache for future use
      saveToCache(currentMonth, currentYear, {
        goodDays,
        badDays,
        luckyColors: colors,
        luckyDirection: direction,
        advice: response
      })

      setMonthData(monthDataResult)
    } catch (err: any) {
      console.error('Error loading month data:', err)
      setError(err.message || 'Không thể tải lịch phong thủy. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const loadDayDetails = async (day: number) => {
    setLoadingDay(true)
    setError('')
    
    try {
      const dateStr = `${day}/${currentMonth}/${currentYear}`
      
      const prompt = `Xem chi tiết ngày ${dateStr} theo phong thủy:

1. Can Chi của ngày
2. Sao tốt/xấu chiếu
3. Giờ hoàng đạo trong ngày
4. Việc nên làm trong ngày này
5. Việc cần tránh trong ngày này
6. Hướng tốt của ngày
7. Đánh giá tổng quan (Rất tốt/Tốt/Bình thường/Xấu/Rất xấu)

Trả lời chi tiết bằng tiếng Việt, dễ hiểu.`

      const result = await callGeminiAPI(prompt, 'chat')
      setDayDetails(result.result || 'Không có thông tin chi tiết.')
    } catch (err: any) {
      console.error('Error loading day details:', err)
      setError(err.message || 'Không thể tải thông tin ngày. Vui lòng thử lại.')
    } finally {
      setLoadingDay(false)
    }
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    loadDayDetails(day)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1))
    setSelectedDay(null)
    setDayDetails('')
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1))
    setSelectedDay(null)
    setDayDetails('')
  }

  // Generate calendar days
  const getDaysInMonth = () => {
    return new Date(currentYear, currentMonth, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth - 1, 1).getDay()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth()
    const firstDay = getFirstDayOfMonth()
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isGoodDay = monthData?.goodDays.includes(day)
      const isBadDay = monthData?.badDays.includes(day)
      const isSelected = day === selectedDay
      const isToday = day === new Date().getDate() && 
                      currentMonth === new Date().getMonth() + 1 && 
                      currentYear === new Date().getFullYear()

      // Calculate lunar date for this day
      const lunar = solarToLunar(day, currentMonth, currentYear)

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={loading}
          className={`
            aspect-square p-2 rounded-lg border-2 transition-all flex flex-col items-center justify-center
            ${isSelected ? 'border-purple-600 bg-purple-50 scale-105' : 'border-gray-200'}
            ${isGoodDay && !isSelected ? 'bg-green-50 border-green-300' : ''}
            ${isBadDay && !isSelected ? 'bg-red-50 border-red-300' : ''}
            ${isToday ? 'font-bold ring-2 ring-blue-400' : ''}
            ${!isGoodDay && !isBadDay && !isSelected ? 'hover:bg-gray-50' : ''}
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}
          `}
        >
          <div className="text-lg font-semibold">{day}</div>
          <div className="text-xs text-gray-500">{lunar.day}/{lunar.month}</div>
          {isGoodDay && <div className="text-xs text-green-600 mt-1">✓ Tốt</div>}
          {isBadDay && <div className="text-xs text-red-600 mt-1">✗ Xấu</div>}
        </button>
      )
    }

    return days
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Lịch Phong Thủy 2026
            </h1>
          </div>
          <p className="text-gray-600">
            Xem ngày tốt xấu theo tháng để sắp xếp công việc hợp lý • Click vào ngày để xem chi tiết
          </p>
        </div>

        {/* 2-COLUMN LAYOUT: Desktop only */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN: Calendar (3/5 width on desktop) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              {/* Month Navigator */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-800">
                  {monthNames[currentMonth - 1]} {currentYear}
                </h2>
                
                <button
                  onClick={nextMonth}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

          {/* Month Info */}
          {monthData && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Phương vị may mắn</div>
                <div className="text-lg font-bold text-purple-600">{monthData.luckyDirection}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Màu sắc may mắn</div>
                <div className="flex gap-2 justify-center mt-1">
                  {monthData.luckyColors.map((color, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Ngày tốt</div>
                <div className="text-lg font-bold text-green-600">{monthData.goodDays.length} ngày</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Đang tải lịch phong thủy...</p>
            </div>
          )}

          {/* Calendar Grid */}
          {!loading && monthData && (
            <>
              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 justify-center mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded" />
                  <span>Ngày tốt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border-2 border-red-300 rounded" />
                  <span>Ngày xấu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-200 rounded ring-2 ring-blue-400" />
                  <span>Hôm nay</span>
                </div>
              </div>
            </>
          )}
            </div>
          </div>

          {/* RIGHT COLUMN: Day Details (2/5 width on desktop) */}
          <div className="lg:col-span-2">
            {!selectedDay && !loading && (
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-lg p-8 text-center h-full flex flex-col items-center justify-center">
                <Calendar className="w-16 h-16 text-purple-600 mb-4 opacity-50" />
                <p className="text-lg text-gray-700 font-medium mb-2">
                  👆 Click vào một ngày
                </p>
                <p className="text-sm text-gray-600">
                  Để xem chi tiết phong thủy của ngày đó
                </p>
              </div>
            )}

            {selectedDay && (
              <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-3">
                  📅 Ngày {selectedDay}/{currentMonth}/{currentYear}
                </h3>

                {loadingDay && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                    <span className="text-gray-600">Đang tải thông tin...</span>
                  </div>
                )}

                {!loadingDay && dayDetails && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {dayDetails}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">💬 Có thắc mắc về ngày này?</p>
                      <a
                        href="/chat"
                        className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                      >
                        Chat với Thầy Tám
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
