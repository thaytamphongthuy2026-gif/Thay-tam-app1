import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { supabase } from '../lib/supabase'
import { User, Calendar, Mail, Crown, Loader2 } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    birth_date_type: 'solar',
    gender: 'male',
  })

  useEffect(() => {
    if (!user) {
      // Redirect to login with current path for redirect back
      navigate(`/login?redirect=${encodeURIComponent('/profile')}`)
      return
    }

    // Convert database format (YYYY-MM-DD) to display format (DD/MM/YYYY)
    let displayBirthDate = user.birth_date || ''
    if (displayBirthDate && /^\d{4}-\d{2}-\d{2}$/.test(displayBirthDate)) {
      const [year, month, day] = displayBirthDate.split('-')
      displayBirthDate = `${day}/${month}/${year}`
    }

    // Pre-fill form with existing data
    setFormData({
      name: user.name || '',
      birth_date: displayBirthDate,
      birth_date_type: user.birth_date_type || 'solar',
      gender: user.gender || 'male',
    })
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      // Validate birth date format DD/MM/YYYY
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
      if (!dateRegex.test(formData.birth_date)) {
        throw new Error('Ngày sinh phải theo định dạng DD/MM/YYYY')
      }

      // Convert DD/MM/YYYY to YYYY-MM-DD for database
      const [day, month, year] = formData.birth_date.split('/')
      const dbDateFormat = `${year}-${month}-${day}`

      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: formData.name,
          birth_date: dbDateFormat, // Use YYYY-MM-DD format
          birth_date_type: formData.birth_date_type,
          gender: formData.gender,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (updateError) throw updateError

      await refreshUser()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8" />
              Thông Tin Cá Nhân
            </h1>
            <p className="text-purple-100 mt-2">
              Cập nhật thông tin để được tư vấn chính xác hơn
            </p>
          </div>

          <div className="p-8">
            {/* Account Info (Read-only) */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-600" />
                Tài Khoản
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Gói dịch vụ</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Crown className={`w-5 h-5 ${
                      user.plan === 'premium' ? 'text-yellow-500' :
                      user.plan === 'pro' ? 'text-purple-500' :
                      'text-gray-400'
                    }`} />
                    <span className="font-semibold text-gray-900">
                      {user.plan === 'premium' ? 'Đại Cát' :
                       user.plan === 'pro' ? 'Lộc Phát' :
                       'Duyên Lành'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Quota còn lại</label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs text-gray-500">Xem Ngày</p>
                      <p className="text-lg font-bold text-purple-600">{user.quota.xemNgay}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs text-gray-500">Tử Vi</p>
                      <p className="text-lg font-bold text-pink-600">{user.quota.tuVi}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-xs text-gray-500">Chat</p>
                      <p className="text-lg font-bold text-orange-600">{user.quota.chat}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông Tin Cá Nhân
              </h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              {/* Birth Date Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại Lịch <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, birth_date_type: 'solar' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                      formData.birth_date_type === 'solar'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    ☀️ Dương Lịch
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, birth_date_type: 'lunar' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                      formData.birth_date_type === 'lunar'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    🌙 Âm Lịch
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>Quan trọng:</strong> Chọn đúng loại lịch bạn biết. Nếu bạn chỉ biết ngày sinh Dương lịch, hệ thống sẽ tự động chuyển đổi sang Âm lịch khi Thầy Tám xem cho bạn.
                </p>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày Sinh <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ngày / Tháng / Năm sinh"
                    pattern="\d{2}/\d{2}/\d{4}"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ví dụ: 15/01/1990
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới Tính <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'male', label: 'Nam', icon: '👨' },
                    { value: 'female', label: 'Nữ', icon: '👩' },
                    { value: 'other', label: 'Khác', icon: '🧑' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: option.value })}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                        formData.gender === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success/Error Messages */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ✅ Cập nhật thông tin thành công!
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  ❌ {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Lưu Thông Tin
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
