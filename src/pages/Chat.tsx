import { useState, useEffect, useRef } from 'react'
import { Send, AlertCircle, BookOpen, Zap } from 'lucide-react'
import { streamGeminiAPI, callGeminiAPI } from '../lib/gemini'
import LoginPrompt from '../components/LoginPrompt'
import { PROMPTS } from '../lib/prompts'
import { useAuth } from '../lib/authContext'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  mode?: 'quick' | 'book' // Track which mode was used
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
          <p className="text-base font-bold text-purple-900">{line}</p>
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
        <p key={elements.length} className="text-sm text-gray-800 leading-relaxed my-2">
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
  const [ragMode, setRagMode] = useState<'quick' | 'book'>('quick') // New: RAG mode toggle
  const inputRef = useRef<HTMLTextAreaElement>(null) // Input ref for auto-focus
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Tôi là Thầy Tám - Phong Thủy AI. Hỏi gì cũng được nhé! 🔮',
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

  // Auto-focus input when not loading
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [loading])

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

    const currentInput = input
    
    // Set loading FIRST for immediate feedback
    setLoading(true)
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setError('')

    // Add placeholder for streaming response
    const connectingMessage = ragMode === 'book' 
      ? '📚 Thầy Tám đang lật sách:\n• Bát Trạch Minh Kinh\n• Ngọc Hạp Thông Thư\n• Hiệp Kỷ Biện Phương Thư'
      : '' // Quick mode: only animation
      
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: connectingMessage,
      timestamp: new Date(),
      mode: ragMode
    }])

    try {
      // Build context-aware prompt with user birth info
      let contextPrompt = currentInput
      if (user?.birth_date && user?.gender) {
        const birthInfo = `[Thông tin người hỏi: Sinh ngày ${user.birth_date} (${user.birth_date_type === 'lunar' ? 'Âm lịch' : 'Dương lịch'}), Giới tính: ${user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}]\n\n`
        contextPrompt = birthInfo + currentInput
      }
      
      const prompt = PROMPTS.chat(contextPrompt)
      
      // Clear the "connecting" message and start streaming
      let isFirstChunk = true
      
      try {
        // TRY STREAMING FIRST (faster)
        await streamGeminiAPI(prompt, 'chat', (chunk: string) => {
          // Update the last message with streamed chunk
          setMessages(prev => {
            const updated = [...prev]
            const lastMsg = updated[updated.length - 1]
            if (lastMsg.role === 'assistant') {
              if (isFirstChunk) {
                // Replace "connecting" message with first chunk
                lastMsg.content = chunk
                isFirstChunk = false
              } else {
                lastMsg.content += chunk
              }
            }
            return updated
          })
        }, ragMode === 'book')  // Pass useRag flag based on mode

        // Refresh user quota in background
        refreshUser().catch(console.error)
      } catch (streamError: any) {
        console.error('Streaming failed:', streamError)
        
        // FALLBACK TO NON-STREAMING (more reliable)
        console.log('🔄 Falling back to non-streaming API...')
        
        // Update message to show fallback
        setMessages(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg.role === 'assistant') {
            lastMsg.content = '🔄 Đang thử phương án dự phòng...'
          }
          return updated
        })

        // Use non-streaming API as backup
        const result = await callGeminiAPI(prompt, 'chat')
        
        if (result.success && result.result) {
          // Replace with actual response
          setMessages(prev => {
            const updated = [...prev]
            const lastMsg = updated[updated.length - 1]
            if (lastMsg.role === 'assistant') {
              lastMsg.content = result.result || 'Không có phản hồi'
            }
            return updated
          })
          
          // Refresh quota
          refreshUser().catch(console.error)
        } else {
          throw new Error(result.error || 'Cả 2 phương án đều thất bại')
        }
      }
    } catch (err: any) {
      // Remove placeholder message on error
      setMessages(prev => prev.slice(0, -1))
      setError(err.message || 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.')
      console.error('Chat error:', err)
      
      // Auto-dismiss error after 10 seconds (except login errors)
      if (!err.message?.includes('đăng nhập')) {
        setTimeout(() => setError(''), 10000)
      }
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-screen px-0 md:px-4">
        {/* Header - Simplified for mobile */}
        <div className="bg-white rounded-t-xl shadow-lg p-3 md:p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            {/* Hide title on mobile, show quota only */}
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">Tư vấn với Thầy Tám</h1>
              <p className="text-sm text-gray-600">Đặt câu hỏi về phong thủy, tài lộc, sự nghiệp...</p>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">Thầy Tám</span>
            </div>
            {user && (
              <div className="bg-purple-100 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                <span className="text-xs md:text-sm text-purple-600 font-semibold">
                  {user.quota.chat} 💬
                </span>
              </div>
            )}
          </div>
          
          {/* RAG Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
            <button
              onClick={() => setRagMode('quick')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
                ragMode === 'quick'
                  ? 'bg-white text-purple-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Nhanh</span>
            </button>
            <button
              onClick={() => setRagMode('book')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
                ragMode === 'book'
                  ? 'bg-white text-purple-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Tra sách</span>
            </button>
          </div>
          
          {/* Hide note on mobile to save space */}
          {ragMode === 'book' && (
            <p className="text-xs text-gray-500 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2 hidden md:block">
              💡 Chế độ <strong>Tra sách</strong>: Thầy Tám sẽ dựa vào 6 quyển sách cổ để trả lời (chậm hơn nhưng có trích dẫn)
            </p>
          )}
        </div>

        {/* Messages - SCROLLABLE AREA */}
        <div className="bg-white shadow-lg flex-1 overflow-y-auto">
          <div className="p-2 md:p-4 space-y-3 md:space-y-4">{messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] md:max-w-[80%] rounded-xl p-3 md:p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : message.content === '' || message.content.startsWith('📚') ? (
                  // Show animation with optional text
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    {message.content && <p className="text-gray-700">{message.content}</p>}
                  </div>
                ) : (
                  // Use Markdown for 'book' mode, formatChatContent for 'quick' mode
                  message.mode === 'book' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    formatChatContent(message.content)
                  )
                )}
                {/* Remove timestamp on mobile */}
                <p
                  className={`text-xs mt-2 hidden md:block ${
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

          {/* Removed duplicate loading indicator - already shown in message bubble */}

          {error && (
            error.includes('đăng nhập') ? (
              <LoginPrompt message={error} />
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )
          )}

          {/* Sample Questions - Show when only initial greeting */}
          {messages.length === 1 && !loading && (
            <div className="flex justify-center">
              <div className="max-w-2xl w-full space-y-3">
                <p className="text-center text-sm text-gray-500 mb-3">
                  💡 Câu hỏi gợi ý:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Hướng nào tốt để đặt bàn làm việc?',
                    'Màu sắc may mắn của tuổi Tý năm 2026?',
                    'Cách bố trí phòng ngủ theo phong thủy?',
                    'Nên đặt cây gì trong nhà để hút tài lộc?',
                    'Xem ngày tốt khai trương tháng 2/2026?',
                    'Hướng xuất hành tốt cho tuổi Mão?'
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-400 transition text-sm text-gray-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Removed: Follow-up Suggestions */}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input - FIXED AT BOTTOM */}
        <div className="bg-white rounded-b-xl shadow-lg p-2 md:p-4 border-t flex-shrink-0">
          <div className="flex items-end space-x-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
              rows={2}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-purple-600 text-white p-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {/* Hide keyboard hint on mobile to save space */}
          <p className="text-xs text-gray-500 mt-1.5 hidden md:block">
            Nhấn Enter để gửi, Shift+Enter để xuống dòng
          </p>
        </div>
      </div>
    </div>
  )
}
