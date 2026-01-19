import { useState, useEffect } from 'react'
import { X, Loader2, Sparkles } from 'lucide-react'
import { callGeminiAPI } from '../lib/gemini'
import ReactMarkdown from 'react-markdown'

interface DayDetailModalProps {
  date: {
    solar: string
    lunar: string
    dayName: string
    constellation: string
    officer: string
    reasons: string[]
    bestHours: string[]
    avoid: string[]
    rating: number
  }
  purposeLabel: string
  birthYear?: string
  userName?: string
  onClose: () => void
}

export default function DayDetailModal({ 
  date, 
  purposeLabel,
  birthYear,
  userName,
  onClose 
}: DayDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')

  // Auto-fetch details on mount
  useEffect(() => {
    fetchDetails()
  }, [])

  async function fetchDetails() {
    setLoading(true)
    setError('')

    try {
      const prompt = `Bạn là Thầy Tám - chuyên gia phong thủy.

📅 THÔNG TIN NGÀY:
- Dương lịch: ${date.solar}
- Âm lịch: ${date.lunar}
- Can Chi: ${date.dayName}
- 28 Sao: ${date.constellation}
- 12 Trực: ${date.officer}

🎯 MỤC ĐÍCH: ${purposeLabel}
${userName ? `👤 TÊN: ${userName}` : ''}
${birthYear ? `📅 NĂM SINH: ${birthYear}` : ''}

📊 ĐÁNH GIÁ: ${date.rating}/5 ⭐

YÊU CẦU:
Hãy tư vấn CHI TIẾT về ngày này cho mục đích "${purposeLabel}", bao gồm:

1. **Giải Thích 28 Sao (${date.constellation})**
   - Sao này có ý nghĩa gì?
   - Tốt hay xấu cho mục đích "${purposeLabel}"?
   - Lưu ý gì khi làm việc trong ngày này?

2. **Giải Thích 12 Trực (${date.officer})**
   - Trực này đại diện cho gì?
   - Phù hợp với hoạt động nào?
   - Nên tránh làm gì?

3. **Tư Vấn Cụ Thể**
   - Nên làm gì để tận dụng ngày tốt?
   - Màu sắc may mắn
   - Hướng tốt
   - Vật phẩm nên mang theo

4. **Lời Khuyên Cá Nhân**
   ${birthYear ? `- Dành riêng cho người sinh năm ${birthYear}` : ''}
   - Tips để công việc thuận lợi hơn

Format: Markdown, dùng emoji, ngắn gọn, dễ hiểu.
Độ dài: 300-500 từ.`

      const response = await callGeminiAPI(prompt, 'xemNgay')

      if (response.success && response.result) {
        setDetails(response.result)
      } else {
        throw new Error('Không thể tải chi tiết')
      }
    } catch (err: any) {
      console.error('Fetch details error:', err)
      setError(err.message || 'Có lỗi xảy ra khi tải chi tiết')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Chi Tiết Phong Thủy</h2>
              <p className="text-sm opacity-90 mt-1">
                📅 {date.solar} · 🌙 {date.lunar}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔮</div>
              <div className="text-xs text-gray-600">Can Chi</div>
              <div className="font-bold text-sm text-purple-700">{date.dayName}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🌟</div>
              <div className="text-xs text-gray-600">28 Sao</div>
              <div className="font-bold text-sm text-blue-700">{date.constellation}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-xs text-gray-600">12 Trực</div>
              <div className="font-bold text-sm text-green-700">{date.officer}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xs text-gray-600">Đánh giá</div>
              <div className="font-bold text-sm text-yellow-700">{date.rating}/5</div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
              <p className="text-gray-600 font-medium">Thầy Tám đang xem chi tiết...</p>
              <p className="text-sm text-gray-400 mt-2">Đang phân tích 28 Sao và 12 Trực...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">😔</div>
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <button
                onClick={fetchDetails}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Details Content */}
          {details && !loading && (
            <div className="prose prose-sm md:prose-base max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-900 mt-5 mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                  em: ({ node, ...props }) => <em className="italic text-purple-600" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 my-4" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
                  ),
                }}
              >
                {details}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
