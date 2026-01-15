import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, AlertCircle } from 'lucide-react'
import { callGeminiAPI } from '../lib/gemini'
import { PROMPTS } from '../lib/prompts'
import { useAuth } from '../lib/authContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Format chat response for beautiful display (no markdown)
 */
function formatChatContent(text: string): React.ReactElement {
  const lines = text.split('\n')
  const elements: React.ReactElement[] = []
  let currentList: string[] = []
  
  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={elements.length} className="my-3 space-y-2">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">▸</span>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )
      currentList = []
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) {
      flushList()
      continue
    }
    
    // Check for header (starts with emoji)
    if (/^[🔮🏮🎋💰🏠🌟✨🎯⚠️📝💡]/.test(line)) {
      flushList()
      elements.push(
        <div key={elements.length} className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600 rounded-lg p-4 my-4">
          <p className="text-lg font-bold text-purple-900">{line}</p>
        </div>
      )
    }
    // Check for list items
    else if (/^[•\-]\s/.test(line)) {
      currentList.push(line.replace(/^[•\-]\s/, ''))
    }
    else if (/^\d+\.\s/.test(line)) {
      currentList.push(line.replace(/^\d+\.\s/, ''))
    }
    // Regular text
    else {
      flushList()
      // Highlight UPPERCASE words
      const parts = line.split(/([A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]{3,})/)
      elements.push(
        <p key={elements.length} className="text-gray-800 leading-relaxed my-2">
          {parts.map((part, idx) => {
            if (/^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]{3,}$/.test(part)) {
              return (
                <span key={idx} className="font-bold text-purple-700 bg-purple-50 px-1 rounded">
                  {part}
                </span>
              )
            }
            return <span key={idx}>{part}</span>
          })}
        </p>
      )
    }
  }
  
  flushList()
  
  return <div className="space-y-1">{elements}</div>
}

export default function Chat() {
  const { user, refreshUser } = useAuth()
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        
        // Refresh user quota
        await refreshUser()
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-lg p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tư vấn với Thầy Tám</h1>
              <p className="text-gray-600">Đặt câu hỏi về phong thủy, tài lộc, sự nghiệp...</p>
            </div>
            {user && (
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <span className="text-purple-600 font-semibold">
                  Còn {user.quota.chat} câu hỏi
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages - FIXED HEIGHT WITH INTERNAL SCROLL */}
        <div className="bg-white shadow-lg" style={{ height: 'calc(100vh - 400px)', minHeight: '400px', maxHeight: '600px' }}>
          <div className="h-full overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  formatChatContent(message.content)
                )}
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
