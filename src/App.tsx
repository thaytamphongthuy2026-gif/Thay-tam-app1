import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './lib/authContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileSetup from './pages/ProfileSetup'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import XemNgayTot from './pages/XemNgayTot'
import TuVi from './pages/TuVi'
import Pricing from './pages/Pricing'
import LichPhongThuy from './pages/LichPhongThuy'
import Payment from './pages/Payment'
import PaymentResult from './pages/PaymentResult'
import QRPayment from './pages/QRPayment'
import PaymentStatus from './pages/PaymentStatus'
import AdminDashboard from './pages/AdminDashboard'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import SoMayMan from './pages/SoMayMan'
import XinXam from './pages/XinXam'
import TestDuyenSo from './pages/TestDuyenSo'
import LiXiGame from './pages/LiXiGame'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import FAQ from './pages/FAQ'
import XongDat from './pages/XongDat'

function AppContent() {
  const location = useLocation()
  const hideFooterPages = ['/chat']
  const shouldShowFooter = !hideFooterPages.includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
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
          <Route path="/qr-payment" element={<QRPayment />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/xong-dat" element={<XongDat />} />
        </Routes>
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
