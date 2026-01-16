import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: string
  link: string
  badge?: string
}

interface RelatedFeaturesProps {
  currentFeature: string
  suggestions: Feature[]
}

export default function RelatedFeatures({ currentFeature, suggestions }: RelatedFeaturesProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">✨</span>
        <h3 className="text-2xl font-bold text-gray-900">
          Bạn có thể thích
        </h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Các tính năng liên quan đến <strong className="text-purple-600">{currentFeature}</strong>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="group bg-white hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl flex-shrink-0">{feature.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h4>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                {feature.badge && (
                  <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                    {feature.badge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-purple-200 text-center">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
        >
          <span>Xem tất cả tính năng</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
