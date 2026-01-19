import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './lib/authContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Breadcrumb from './components/Breadcrumb'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Chat = lazy(() => import('./pages/Chat'))
const XemNgayTot = lazy(() => import('./pages/XemNgayTot'))
const TuVi = lazy(() => import('./pages/TuVi'))
const LichPhongThuy = lazy(() => import('./pages/LichPhongThuy'))
const XongDat = lazy(() => import('./pages/XongDat'))
const LiXiGame = lazy(() => import('./pages/LiXiGame'))
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'))
const Profile = lazy(() => import('./pages/Profile'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Payment = lazy(() => import('./pages/Payment'))
const PaymentResult = lazy(() => import('./pages/PaymentResult'))
const SimplePayment = lazy(() => import('./pages/SimplePayment'))
const PaymentStatus = lazy(() => import('./pages/PaymentStatus'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const SoMayMan = lazy(() => import('./pages/SoMayMan'))
const XinXam = lazy(() => import('./pages/XinXam'))
const TestDuyenSo = lazy(() => import('./pages/TestDuyenSo'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const FAQ = lazy(() => import('./pages/FAQ'))

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const hideFooterPages = ['/chat']
  const shouldShowFooter = !hideFooterPages.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumb />
      <ScrollToTop />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/xem-ngay-tot" element={<XemNgayTot />} />
            <Route path="/tu-vi" element={<TuVi />} />
            <Route path="/lich-phong-thuy" element={<LichPhongThuy />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/so-may-man" element={<SoMayMan />} />
            <Route path="/xin-xam" element={<XinXam />} />
            <Route path="/test-duyen-so" element={<TestDuyenSo />} />
            <Route path="/li-xi-game" element={<LiXiGame />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/qr-payment" element={<SimplePayment />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dieu-khoan-su-dung" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/xong-dat" element={<XongDat />} />
          </Routes>
        </Suspense>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
