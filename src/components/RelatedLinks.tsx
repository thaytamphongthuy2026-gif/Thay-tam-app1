import { Link } from 'react-router-dom'
import { MessageCircle, Calendar, Star, Gift, Dices, Flame, TrendingUp } from 'lucide-react'

interface RelatedLink {
  title: string
  description: string
  path: string
  icon: any
  color: string
}

interface RelatedLinksProps {
  currentPage: string
}

export default function RelatedLinks({ currentPage }: RelatedLinksProps) {
  const allLinks: Record<string, RelatedLink[]> = {
    chat: [
      { 
        title: 'Xem ngày tốt', 
        description: 'Chọn ngày tốt cho sự kiện quan trọng',
        path: '/xem-ngay-tot',
        icon: Calendar,
        color: 'from-green-500 to-emerald-600'
      },
      { 
        title: 'Xem tử vi', 
        description: 'Dự đoán vận mệnh năm 2026',
        path: '/tu-vi',
        icon: Star,
        color: 'from-purple-500 to-indigo-600'
      },
      { 
        title: 'Lịch phong thủy', 
        description: 'Lịch hàng tháng với ngày tốt xấu',
        path: '/lich-phong-thuy',
        icon: Calendar,
        color: 'from-blue-500 to-cyan-600'
      }
    ],
    'xem-ngay-tot': [
      { 
        title: 'Tư vấn AI', 
        description: 'Chat trực tiếp với Thầy Tám',
        path: '/chat',
        icon: MessageCircle,
        color: 'from-purple-500 to-pink-600'
      },
      { 
        title: 'Lịch phong thủy', 
        description: 'Xem ngày tốt cả tháng',
        path: '/lich-phong-thuy',
        icon: Calendar,
        color: 'from-blue-500 to-cyan-600'
      },
      { 
        title: 'Xông đất', 
        description: 'Tìm người xông đất hợp tuổi',
        path: '/xong-dat',
        icon: Gift,
        color: 'from-red-500 to-pink-600'
      }
    ],
    'tu-vi': [
      { 
        title: 'Tư vấn AI', 
        description: 'Hỏi đáp trực tiếp về tử vi',
        path: '/chat',
        icon: MessageCircle,
        color: 'from-purple-500 to-pink-600'
      },
      { 
        title: 'Xem ngày tốt', 
        description: 'Chọn ngày tốt theo tử vi',
        path: '/xem-ngay-tot',
        icon: Calendar,
        color: 'from-green-500 to-emerald-600'
      },
      { 
        title: 'Số may mắn', 
        description: 'Quay số may mắn hàng ngày',
        path: '/so-may-man',
        icon: Dices,
        color: 'from-orange-500 to-red-600'
      }
    ],
    'lich-phong-thuy': [
      { 
        title: 'Xem ngày tốt', 
        description: 'Chi tiết ngày tốt cụ thể',
        path: '/xem-ngay-tot',
        icon: Calendar,
        color: 'from-green-500 to-emerald-600'
      },
      { 
        title: 'Tư vấn AI', 
        description: 'Hỏi thêm về ngày tốt',
        path: '/chat',
        icon: MessageCircle,
        color: 'from-purple-500 to-pink-600'
      },
      { 
        title: 'Xông đất', 
        description: 'Chọn người xông đất đầu năm',
        path: '/xong-dat',
        icon: Gift,
        color: 'from-red-500 to-pink-600'
      }
    ],
    'xong-dat': [
      { 
        title: 'Lì xì thông minh', 
        description: 'Tính số tiền lì xì hợp phong thủy',
        path: '/li-xi-game',
        icon: Gift,
        color: 'from-red-500 to-pink-600'
      },
      { 
        title: 'Xem ngày tốt', 
        description: 'Chọn ngày xông đất',
        path: '/xem-ngay-tot',
        icon: Calendar,
        color: 'from-green-500 to-emerald-600'
      },
      { 
        title: 'Tư vấn AI', 
        description: 'Hỏi thêm về xông đất',
        path: '/chat',
        icon: MessageCircle,
        color: 'from-purple-500 to-pink-600'
      }
    ],
    'li-xi-game': [
      { 
        title: 'Xông đất', 
        description: 'Tìm người xông đất hợp tuổi',
        path: '/xong-dat',
        icon: Gift,
        color: 'from-red-500 to-pink-600'
      },
      { 
        title: 'Số may mắn', 
        description: 'Quay số may mắn hàng ngày',
        path: '/so-may-man',
        icon: Dices,
        color: 'from-orange-500 to-red-600'
      },
      { 
        title: 'Xin xăm', 
        description: 'Rút xăm online chuẩn xác',
        path: '/xin-xam',
        icon: Flame,
        color: 'from-pink-500 to-red-600'
      }
    ],
    'so-may-man': [
      { 
        title: 'Xin xăm', 
        description: 'Rút xăm xem vận may',
        path: '/xin-xam',
        icon: Flame,
        color: 'from-pink-500 to-red-600'
      },
      { 
        title: 'Lì xì thông minh', 
        description: 'Game tính lì xì vui nhộn',
        path: '/li-xi-game',
        icon: Gift,
        color: 'from-red-500 to-pink-600'
      },
      { 
        title: 'Xem tử vi', 
        description: 'Dự đoán vận mệnh năm 2026',
        path: '/tu-vi',
        icon: Star,
        color: 'from-purple-500 to-indigo-600'
      }
    ],
    'xin-xam': [
      { 
        title: 'Số may mắn', 
        description: 'Quay số may mắn hàng ngày',
        path: '/so-may-man',
        icon: Dices,
        color: 'from-orange-500 to-red-600'
      },
      { 
        title: 'Tư vấn AI', 
        description: 'Hỏi Thầy Tám giải xăm',
        path: '/chat',
        icon: MessageCircle,
        color: 'from-purple-500 to-pink-600'
      },
      { 
        title: 'Xem tử vi', 
        description: 'Xem vận mệnh chi tiết',
        path: '/tu-vi',
        icon: Star,
        color: 'from-purple-500 to-indigo-600'
      }
    ]
  }

  const links = allLinks[currentPage] || []

  if (links.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Có thể cháu quan tâm
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {links.map(link => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                  {link.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {link.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
