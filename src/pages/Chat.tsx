import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, AlertCircle } from 'lucide-react'
import { callGeminiAPI, getQuota } from '../lib/gemini'
import { PROMPTS } from '../lib/prompts'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là Thầy Tám, chuyên gia phong thủy với 30 năm kinh nghiệm. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quota, setQuota] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadQuota()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function loadQuota() {
    try {
      const data = await getQuota()
      setQuota(data.quota)
    } catch (error) {
      console.error('Error loading quota:', error)
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const prompt = PROMPTS.chat(input)
      const response = await callGeminiAPI(prompt, 'chat')

      if (response.success && response.result) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.result,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        
        if (response.remainingQuota) {
          setQuota(response.remainingQuota)
        }
      } else {
        setError(response.error || 'Có lỗi xảy ra')
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gửi tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-lg p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tư vấn với Thầy Tám</h1>
              <p className="text-gray-600">Đặt câu hỏi về phong thủy, tài lộc, sự nghiệp...</p>
            </div>
            {quota && (
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <span className="text-purple-600 font-semibold">
                  Còn {quota.chat} câu hỏi
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white shadow-lg h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl p-4 flex items-center space-x-2">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="text-gray-600">Thầy Tám đang suy nghĩ...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-xl shadow-lg p-4">
          <div className="flex items-end space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Nhấn Enter để gửi, Shift+Enter để xuống dòng
          </p>
        </div>

        {/* Example Questions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Câu hỏi mẫu:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Hướng nào tốt để đặt bàn làm việc?',
              'Màu sắc may mắn của tuổi Tý?',
              'Cách bố trí phòng ngủ theo phong thủy?',
              'Nên đặt cây gì trong nhà để hút tài lộc?'
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
