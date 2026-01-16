import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface PaymentInstructions {
  success: boolean
  orderId: string
  plan: string
  amount: number
  paymentMethod: string
  qrCode: string
  bankInfo: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  transferInfo: {
    amount: string
    description: string
    orderId: string
  }
  instructions: {
    step1: string
    step2: string
    step3: string
    step4: string
    step5: string
    step6: string
  }
}

export default function QRPayment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const plan = searchParams.get('plan') as 'pro' | 'premium' | null

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentInstructions | null>(null)
  const [uploading, setUploading] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!plan || !['pro', 'premium'].includes(plan)) {
      navigate('/pricing')
      return
    }
    createQRPayment()
  }, [plan, navigate])

  const createQRPayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        navigate('/login?redirect=/qr-payment')
        return
      }

      const response = await fetch('/api/payment/create-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      })

      const data = await response.json()

      if (!response.ok) {
        // If 401 Unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('jwt_token')
          localStorage.removeItem('user_email')
          navigate('/login?redirect=/qr-payment?plan=' + plan)
          return
        }
        throw new Error(data.error || 'Không thể tạo thanh toán')
      }

      setPaymentData(data)
    } catch (err: any) {
      console.error('Create payment error:', err)
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh (PNG, JPG, JPEG)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB')
      return
    }

    setProofFile(file)
    
    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setProofPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setError(null)
  }

  const uploadProof = async () => {
    if (!proofFile || !paymentData) {
      setError('Vui lòng chọn ảnh chụp màn hình')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        navigate(`/login?redirect=${encodeURIComponent('/qr-payment')}`)
        return
      }

      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(proofFile)
      
      await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })

      const base64 = reader.result as string

      const response = await fetch('/api/payment/upload-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: paymentData.orderId,
          proofImage: base64
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tải lên ảnh')
      }

      // Navigate to payment status
      navigate(`/payment-status?orderId=${paymentData.orderId}`)
    } catch (err: any) {
      console.error('Upload proof error:', err)
      setError(err.message || 'Đã xảy ra lỗi khi tải lên ảnh')
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show notification (optional)
    alert('Đã sao chép!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tạo mã QR thanh toán...</p>
        </div>
      </div>
    )
  }

  if (error && !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Quay lại trang giá
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!paymentData) return null

  const planNames = {
    pro: 'Gói Pro',
    premium: 'Gói Premium'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                <i className="fas fa-qrcode mr-2 text-orange-500"></i>
                Thanh toán QR Code
              </h1>
              <p className="text-gray-600">
                Mã đơn hàng: <span className="font-mono font-semibold">{paymentData.orderId}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">{planNames[paymentData.plan as 'pro' | 'premium']}</div>
              <div className="text-2xl font-bold text-orange-500">{paymentData.transferInfo.amount}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-qrcode mr-2 text-orange-500"></i>
              Quét mã QR
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <img 
                src={paymentData.qrCode} 
                alt="QR Code"
                className="w-full max-w-xs mx-auto rounded-lg shadow-md"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Mở app ngân hàng và quét mã QR để thanh toán tự động
              </p>
            </div>
          </div>

          {/* Bank Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-university mr-2 text-orange-500"></i>
              Thông tin chuyển khoản
            </h2>

            <div className="space-y-4">
              {/* Bank Name */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Ngân hàng</div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-800">{paymentData.bankInfo.bankName}</div>
                </div>
              </div>

              {/* Account Number */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Số tài khoản</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono font-semibold text-gray-800">{paymentData.bankInfo.accountNumber}</div>
                  <button
                    onClick={() => copyToClipboard(paymentData.bankInfo.accountNumber)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Chủ tài khoản</div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-800">{paymentData.bankInfo.accountName}</div>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-sm text-orange-600 mb-1">Số tiền</div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-orange-600">{paymentData.transferInfo.amount}</div>
                  <button
                    onClick={() => copyToClipboard(paymentData.amount.toString())}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>

              {/* Transfer Description */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-sm text-orange-600 mb-1">Nội dung chuyển khoản</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm text-orange-600 break-all">{paymentData.transferInfo.description}</div>
                  <button
                    onClick={() => copyToClipboard(paymentData.transferInfo.description)}
                    className="text-orange-500 hover:text-orange-600 ml-2"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-red-800">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                <strong>Quan trọng:</strong> Vui lòng nhập CHÍNH XÁC nội dung chuyển khoản để được xử lý tự động
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-list-ol mr-2 text-orange-500"></i>
            Hướng dẫn thanh toán
          </h2>
          
          <div className="space-y-3">
            {Object.entries(paymentData.instructions).map(([key, value], index) => (
              <div key={key} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Proof Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-cloud-upload-alt mr-2 text-orange-500"></i>
            Upload ảnh xác nhận
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </p>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {proofPreview ? (
              <div>
                <img src={proofPreview} alt="Preview" className="max-w-full max-h-64 mx-auto mb-4 rounded-lg" />
                <button
                  onClick={() => {
                    setProofFile(null)
                    setProofPreview(null)
                  }}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  <i className="fas fa-times mr-1"></i>
                  Xóa ảnh
                </button>
              </div>
            ) : (
              <div>
                <i className="fas fa-image text-gray-400 text-5xl mb-4"></i>
                <p className="text-gray-600 mb-4">Chọn ảnh chụp màn hình xác nhận chuyển khoản</p>
                <label className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg cursor-pointer">
                  <i className="fas fa-upload mr-2"></i>
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG (tối đa 5MB)</p>
              </div>
            )}
          </div>

          {proofFile && (
            <button
              onClick={uploadProof}
              disabled={uploading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-lg mt-4 font-semibold"
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Đang tải lên...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Xác nhận và Upload
                </>
              )}
            </button>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/pricing')}
            className="text-gray-600 hover:text-gray-800"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Quay lại trang giá
          </button>
        </div>
      </div>
    </div>
  )
}
