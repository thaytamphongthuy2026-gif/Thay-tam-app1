import { Calendar } from 'lucide-react'

interface DateInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  showTime?: boolean
  timeValue?: string
  onTimeChange?: (value: string) => void
  showCalendarType?: boolean
  calendarType?: 'solar' | 'lunar'
  onCalendarTypeChange?: (type: 'solar' | 'lunar') => void
}

export default function DateInput({
  label,
  value,
  onChange,
  required = false,
  showTime = false,
  timeValue = '',
  onTimeChange,
  showCalendarType = true,
  calendarType = 'solar',
  onCalendarTypeChange
}: DateInputProps) {
  return (
    <div className="space-y-3">
      {/* Label with Calendar Type Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {showCalendarType && (
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => onCalendarTypeChange?.('solar')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                calendarType === 'solar'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🌞 Dương lịch
            </button>
            <button
              type="button"
              onClick={() => onCalendarTypeChange?.('lunar')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                calendarType === 'lunar'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🌙 Âm lịch
            </button>
          </div>
        )}
      </div>

      {/* Date Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          // Set default to 1990-01-01 when clicking (if empty)
          onFocus={(e) => {
            if (!e.target.value) {
              onChange('1990-01-01')
            }
          }}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Chọn ngày/tháng/năm sinh"
        />
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        💡 Click vào ô để chọn ngày. Mặc định hiển thị năm 1990 để dễ chọn.
      </p>

      {/* Optional Time Input */}
      {showTime && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giờ sinh (tùy chọn)
          </label>
          <input
            type="time"
            value={timeValue}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Chọn giờ sinh"
          />
          <p className="text-xs text-gray-500 mt-1">
            ⏰ Giờ sinh giúp xem tử vi chính xác hơn (không bắt buộc)
          </p>
        </div>
      )}
    </div>
  )
}
