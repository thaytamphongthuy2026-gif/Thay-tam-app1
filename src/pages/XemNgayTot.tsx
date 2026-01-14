import { useState } from 'react'
import { Calendar, Loader2, AlertCircle } from 'lucide-react'
import { callGeminiAPI } from '../lib/gemini'
import { PROMPTS } from '../lib/prompts'

export default function XemNgayTot() {
  const [date, setDate] = useState('')
  const [purpose, setPurpose] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const prompt = PROMPTS.xemNgay(date, purpose)
      const response = await callGeminiAPI(prompt, 'xemNgay')

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Xem ngày tốt</h1>
          <p className="text-xl text-gray-600">
            Chọn ngày phù hợp cho sự kiện quan trọng
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ngày
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mục đích
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Chọn mục đích...</option>
                <option value="khai trương">Khai trương</option>
                <option value="cưới hỏi">Cưới hỏi</option>
                <option value="động thổ">Động thổ</option>
                <option value="xuất hành">Xuất hành</option>
                <option value="nhập trạch">Nhập trạch (dọn nhà)</option>
                <option value="ký hợp đồng">Ký hợp đồng</option>
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
                  <span>Đang xem...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Xem ngày tốt</span>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kết quả:</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{result}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
