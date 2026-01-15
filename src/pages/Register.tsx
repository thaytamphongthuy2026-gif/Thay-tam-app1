import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { register } from '../lib/auth'
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      // Redirect to original page after successful registration
      navigate(redirectTo)
    } catch (err: any) {
      // Parse error message
      let errorMsg = 'Đăng ký thất bại'
      
      if (err.message.includes('already registered')) {
        errorMsg = '❌ Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.'
      } else if (err.message.includes('invalid') || err.message.includes('Invalid')) {
        errorMsg = '❌ Email không hợp lệ. Vui lòng dùng email thật (VD: yourname@gmail.com) hoặc email tạm từ temp-mail.org'
      } else if (err.message.includes('weak password')) {
        errorMsg = '❌ Mật khẩu quá yếu. Vui lòng dùng mật khẩu có ít nhất 6 ký tự, bao gồm chữ và số.'
      } else if (err.message.includes('rate limit') || err.message.includes('too many')) {
        errorMsg = '❌ Bạn đang thao tác quá nhanh. Vui lòng đợi 1-2 phút rồi thử lại.'
      } else if (err.message.includes('User already registered')) {
        errorMsg = '❌ Tài khoản đã tồn tại. Hãy thử đăng nhập.'
      } else if (err.message) {
        errorMsg = `❌ ${err.message}`
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Gói miễn phí bao gồm:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>3 lượt xem ngày tốt/ngày</li>
                <li>1 lượt xem tử vi/ngày</li>
                <li>10 câu hỏi chat/ngày</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="yourname@gmail.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Dùng email thật hoặc email tạm từ <a href="https://temp-mail.org" target="_blank" rel="noopener" className="text-purple-600 underline">temp-mail.org</a>
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Tôi đồng ý với{' '}
              <Link to="/terms" className="text-purple-600 hover:text-purple-700">
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link to="/privacy" className="text-purple-600 hover:text-purple-700">
                Chính sách bảo mật
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Đang đăng ký...</span>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Đăng ký</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
