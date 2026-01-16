import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  path: string
}

export default function Breadcrumb() {
  const location = useLocation()
  
  // Map routes to readable names
  const routeNames: Record<string, string> = {
    '/': 'Trang chủ',
    '/chat': 'Tư vấn trực tuyến',
    '/dashboard': 'Dashboard',
    '/xem-ngay-tot': 'Xem ngày tốt',
    '/tu-vi': 'Xem tử vi',
    '/lich-phong-thuy': 'Lịch phong thủy',
    '/xong-dat': 'Xông đất',
    '/li-xi-game': 'Lì xì thông minh',
    '/so-may-man': 'Số may mắn',
    '/xin-xam': 'Xin xăm ảo',
    '/pricing': 'Bảng giá',
    '/blog': 'Blog',
    '/faq': 'Câu hỏi thường gặp',
    '/profile': 'Thông tin cá nhân',
    '/login': 'Đăng nhập',
    '/register': 'Đăng ký',
    '/privacy-policy': 'Chính sách bảo mật',
    '/terms': 'Điều khoản sử dụng'
  }

  const pathnames = location.pathname.split('/').filter(x => x)
  
  // Don't show breadcrumb on homepage
  if (location.pathname === '/') return null

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', path: '/' }
  ]

  let currentPath = ''
  pathnames.forEach(segment => {
    currentPath += `/${segment}`
    const label = routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({ label, path: currentPath })
  })

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-purple-600 font-medium flex items-center gap-1">
                  {index === 0 && <Home className="w-4 h-4" />}
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  to={crumb.path} 
                  className="text-gray-600 hover:text-purple-600 transition flex items-center gap-1"
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
