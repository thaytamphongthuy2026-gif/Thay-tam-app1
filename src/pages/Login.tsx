import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { LogIn, AlertCircle } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      
      // Wait for auth state to update (max 2 seconds)
      let attempts = 0
      const maxAttempts = 20 // 2 seconds with 100ms intervals
      
      while (attempts < maxAttempts) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // Auth state updated, safe to navigate to original page
          navigate(redirectTo)
          return
        }
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      // Timeout - navigate anyway
      navigate(redirectTo)
    } catch (err: any) {
      // Parse error messages
      let errorMsg = 'Đăng nhập thất bại'
      
      if (err.message.includes('Invalid login credentials')) {
        errorMsg = '❌ Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.\n\n💡 Nếu vừa đăng ký, bạn cần xác nhận email trước. Kiểm tra hộp thư (kể cả spam).'
      } else if (err.message.includes('Email not confirmed')) {
        errorMsg = '❌ Email chưa được xác nhận. Vui lòng kiểm tra hộp thư để xác nhận tài khoản.'
      } else if (err.message.includes('User not found')) {
        errorMsg = '❌ Tài khoản không tồn tại. Vui lòng đăng ký trước.'
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
          <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Đăng ký ngay
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
                placeholder="email@example.com"
              />
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Đang đăng nhập...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
