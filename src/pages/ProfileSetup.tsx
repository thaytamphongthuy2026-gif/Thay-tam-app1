import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Calendar, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface UserProfile {
  full_name: string
  birth_date: string
  birth_time?: string
  birth_date_type: 'solar' | 'lunar'
  gender: 'male' | 'female' | 'other'
}

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    birth_date: '',
    birth_time: '',
    birth_date_type: 'solar', // Default to solar
    gender: 'male'
  })

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Vui lòng đăng nhập lại')
      }

      // Update user profile in Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: profile.full_name,
          birth_date: profile.birth_date,
          birth_time: profile.birth_time || null,
          birth_date_type: profile.birth_date_type,
          gender: profile.gender,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id)

      if (updateError) throw updateError

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-100 p-4 rounded-full mb-4">
            <User className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hoàn Thiện Hồ Sơ
          </h1>
          <p className="text-gray-600">
            Để tư vấn phong thủy chính xác, chúng tôi cần một số thông tin cá nhân của bạn
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Đăng ký</span>
            </div>
            <div className="w-12 h-1 bg-purple-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-sm text-gray-900 font-semibold">Hoàn thiện hồ sơ</span>
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Sử dụng dịch vụ</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Họ và tên đầy đủ *</span>
              </div>
            </label>
            <input
              type="text"
              required
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ví dụ: Nguyễn Văn An"
            />
            <p className="mt-2 text-sm text-gray-500">
              Tên của bạn sẽ được sử dụng trong các báo cáo tử vi và tư vấn phong thủy
            </p>
          </div>

          {/* Birth Date Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Loại ngày sinh *</span>
              </div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, birth_date_type: 'solar' })}
                className={`p-4 rounded-lg border-2 transition ${
                  profile.birth_date_type === 'solar'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="font-semibold text-gray-900">Dương lịch</div>
                  <div className="text-sm text-gray-600 mt-1">Lịch quốc tế (khuyến nghị)</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, birth_date_type: 'lunar' })}
                className={`p-4 rounded-lg border-2 transition ${
                  profile.birth_date_type === 'lunar'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌙</div>
                  <div className="font-semibold text-gray-900">Âm lịch</div>
                  <div className="text-sm text-gray-600 mt-1">Lịch Việt Nam truyền thống</div>
                </div>
              </button>
            </div>
          </div>

          {/* Birth Date with DD/MM/YYYY format */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ngày sinh * <span className="text-gray-500 font-normal">(Ngày / Tháng / Năm sinh)</span>
            </label>
            <input
              type="text"
              required
              value={profile.birth_date}
              onChange={(e) => {
                // Only allow numbers and /
                const value = e.target.value.replace(/[^\d/]/g, '')
                setProfile({ ...profile, birth_date: value })
              }}
              placeholder="Ngày / Tháng / Năm sinh (ví dụ: 15/01/1990)"
              pattern="\d{2}/\d{2}/\d{4}"
              maxLength={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              {profile.birth_date_type === 'lunar' 
                ? '⚠️ Chú ý: Nếu chọn Âm lịch, nhập ngày âm lịch (ví dụ: mùng 5 tháng Giêng = 05/01)' 
                : 'Nhập ngày sinh dương lịch (định dạng: Ngày/Tháng/Năm)'}
            </p>
          </div>

          {/* Birth Time (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Giờ sinh <span className="text-gray-500 font-normal">(không bắt buộc)</span>
            </label>
            <input
              type="time"
              value={profile.birth_time}
              onChange={(e) => setProfile({ ...profile, birth_time: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              💡 Giờ sinh giúp xem tử vi chính xác hơn. Nếu không nhớ rõ, có thể bỏ qua.
            </p>
          </div>

          {/* Gender */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Giới tính *</span>
              </div>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, gender: 'male' })}
                className={`p-4 rounded-lg border-2 transition ${
                  profile.gender === 'male'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">👨</div>
                  <div className="font-semibold text-gray-900">Nam</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, gender: 'female' })}
                className={`p-4 rounded-lg border-2 transition ${
                  profile.gender === 'female'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">👩</div>
                  <div className="font-semibold text-gray-900">Nữ</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, gender: 'other' })}
                className={`p-4 rounded-lg border-2 transition ${
                  profile.gender === 'other'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🧑</div>
                  <div className="font-semibold text-gray-900">Khác</div>
                </div>
              </button>
            </div>
          </div>

          {/* Why we need this */}
          <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">
              🔮 Tại sao cần thông tin này?
            </h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Tử vi chính xác:</strong> Dựa vào ngày sinh, giờ sinh để xác định can chi, mệnh, cung</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Xem ngày tốt:</strong> Chọn ngày phù hợp với tuổi, mệnh của bạn</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Tư vấn phong thủy:</strong> Đưa ra giải pháp phù hợp với giới tính, tuổi tác</span>
              </li>
            </ul>
          </div>

          {/* Privacy Notice */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              🔒 <strong>Bảo mật:</strong> Thông tin của bạn được mã hóa và chỉ dùng cho mục đích tư vấn phong thủy. 
              Chúng tôi cam kết không chia sẻ thông tin cá nhân của bạn với bên thứ ba.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang lưu thông tin...' : 'Hoàn tất & Bắt đầu sử dụng'}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 py-3 rounded-lg font-semibold transition"
          >
            Bỏ qua bước này (không khuyến khích)
          </button>
        </form>
      </div>
    </div>
  )
}
