import { Link, useNavigate } from 'react-router-dom'
import { Home, MessageCircle, Calendar, Star, CreditCard, User, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCurrentUser, logout } from '../lib/auth'

export default function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  async function handleLogout() {
    await logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Thầy Tám</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-purple-600 flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/chat" className="text-gray-600 hover:text-purple-600 flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Tư vấn</span>
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-purple-600 flex items-center space-x-1">
                  <CreditCard className="w-4 h-4" />
                  <span>Gói dịch vụ</span>
                </Link>
                <div className="relative group">
                  <button className="text-gray-600 hover:text-purple-600 flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Thông tin cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/pricing" className="text-gray-600 hover:text-purple-600">
                  Bảng giá
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-purple-600">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block text-gray-600 hover:text-purple-600">
              Trang chủ
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-600 hover:text-purple-600">
                  Dashboard
                </Link>
                <Link to="/chat" className="block text-gray-600 hover:text-purple-600">
                  Tư vấn
                </Link>
                <Link to="/pricing" className="block text-gray-600 hover:text-purple-600">
                  Gói dịch vụ
                </Link>
                <Link to="/profile" className="block text-gray-600 hover:text-purple-600">
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/pricing" className="block text-gray-600 hover:text-purple-600">
                  Bảng giá
                </Link>
                <Link to="/login" className="block text-gray-600 hover:text-purple-600">
                  Đăng nhập
                </Link>
                <Link to="/register" className="block text-purple-600 font-semibold">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
