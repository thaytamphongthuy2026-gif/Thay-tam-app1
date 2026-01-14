import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/authContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import XemNgayTot from './pages/XemNgayTot'
import TuVi from './pages/TuVi'
import Pricing from './pages/Pricing'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/xem-ngay-tot" element={<XemNgayTot />} />
              <Route path="/tu-vi" element={<TuVi />} />
              <Route path="/pricing" element={<Pricing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
