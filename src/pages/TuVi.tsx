import { useState } from 'react'
import { Star, Loader2, AlertCircle } from 'lucide-react'
import { callGeminiAPI } from '../lib/gemini'
import { PROMPTS } from '../lib/prompts'

export default function TuVi() {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [gender, setGender] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const prompt = PROMPTS.tuVi(birthDate, birthTime, gender)
      const response = await callGeminiAPI(prompt, 'tuVi')

      if (response.success && response.result) {
        setResult(response.result)
      } else {
        setError(response.error || 'Có lỗi xảy ra')
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Xem tử vi năm 2026</h1>
          <p className="text-xl text-gray-600">
            Khám phá vận mệnh và hướng đi cho năm mới
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh (Dương lịch)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ sinh
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Nếu không nhớ chính xác, có thể chọn khoảng giờ gần nhất
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Chọn giới tính...</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xem tử vi...</span>
                </>
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  <span>Xem tử vi</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tử vi năm 2026:</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{result}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg">
          <h4 className="font-semibold mb-2">Lưu ý:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Tử vi chỉ mang tính chất tham khảo</li>
            <li>Kết quả dựa trên ngày giờ sinh theo Dương lịch</li>
            <li>Để có kết quả chính xác nhất, nên biết giờ sinh cụ thể</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
