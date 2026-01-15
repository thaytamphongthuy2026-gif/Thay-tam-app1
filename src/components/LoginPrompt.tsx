import { Link, useLocation } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'

interface LoginPromptProps {
  message?: string
  className?: string
}

export default function LoginPrompt({ 
  message = 'Bạn cần đăng nhập để sử dụng tính năng này',
  className = ''
}: LoginPromptProps) {
  const location = useLocation()
  
  // Save current path for redirect after login
  const redirectPath = location.pathname + location.search
  
  return (
    <div className={`bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Cần đăng nhập
          </h3>
          <p className="text-gray-700 mb-4">
            {message}
          </p>
          <div className="flex gap-3">
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <LogIn className="w-5 h-5" />
              Đăng nhập ngay
            </Link>
            <Link
              to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Đăng ký tài khoản
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
