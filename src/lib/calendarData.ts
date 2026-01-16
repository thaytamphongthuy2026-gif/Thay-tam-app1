// Static calendar data - pre-computed good/bad days for fast loading
// This eliminates 10s AI loading time for Lich Phong Thuy

interface StaticMonthData {
  goodDays: number[]
  badDays: number[]
  luckyColors: string[]
  luckyDirection: string
  advice: string
}

// Tet 2026 Calendar Data (Jan - Apr 2026)
export const CALENDAR_2026: Record<string, StaticMonthData> = {
  '2026-1': {
    goodDays: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    badDays: [5, 13, 17, 25],
    luckyColors: ['Đỏ', 'Vàng', 'Cam'],
    luckyDirection: 'Đông Nam',
    advice: 'Tháng Tết Bính Ngọ - Nên: Chuẩn bị Tết, dọn dẹp nhà cửa, cúng ông Công ông Táo, xông đất. Tránh: Khởi công công trình lớn, mua xe, đi xa.'
  },
  '2026-2': {
    goodDays: [2, 5, 8, 11, 14, 17, 20, 23, 26],
    badDays: [4, 12, 19, 28],
    luckyColors: ['Xanh lá', 'Trắng', 'Vàng'],
    luckyDirection: 'Đông Bắc',
    advice: 'Tháng đầu năm - Nên: Khai trương, khởi sự việc mới, cưới hỏi, động thổ. Tránh: Tranh cãi, vay nợ, mua bán đất đai quy mô lớn.'
  },
  '2026-3': {
    goodDays: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28],
    badDays: [3, 11, 18, 27],
    luckyColors: ['Xanh dương', 'Tím', 'Hồng'],
    luckyDirection: 'Nam',
    advice: 'Tháng xuân - Nên: Cưới hỏi, nhập trạch, khai trương, du xuân. Tránh: Động thổ hướng Bắc, sa thải nhân viên, mổ xẻ.'
  },
  '2026-4': {
    goodDays: [2, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    badDays: [5, 13, 20, 26],
    luckyColors: ['Vàng', 'Nâu', 'Be'],
    luckyDirection: 'Tây Nam',
    advice: 'Tháng Thanh Minh - Nên: Tảo mộ, dâng hương tổ tiên, sửa sang nhà cửa. Tránh: Khởi công lớn, mua bán nhà đất, đi xa.'
  },
  '2026-5': {
    goodDays: [3, 7, 10, 13, 16, 19, 22, 25, 28],
    badDays: [4, 12, 18, 29],
    luckyColors: ['Xanh lá', 'Trắng', 'Xanh dương'],
    luckyDirection: 'Đông',
    advice: 'Tháng Hạ - Nên: Khai trương, kinh doanh, thi cử, du lịch. Tránh: Động thổ hướng Tây, cưới hỏi vào ngày xấu.'
  },
  '2026-6': {
    goodDays: [1, 5, 8, 11, 14, 17, 20, 23, 26, 29],
    badDays: [6, 13, 19, 27],
    luckyColors: ['Đỏ', 'Cam', 'Vàng'],
    luckyDirection: 'Đông Nam',
    advice: 'Tháng Đoan Ngọ - Nên: Tắm thuốc, đuổi tà, sửa sang nhà cửa, cầu an. Tránh: Cưới hỏi, khởi công lớn, mua xe.'
  },
  '2026-7': {
    goodDays: [2, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    badDays: [5, 11, 20, 28],
    luckyColors: ['Tím', 'Xanh dương', 'Bạc'],
    luckyDirection: 'Bắc',
    advice: 'Tháng Vu Lan - Nên: Cúng dường, làm từ thiện, sửa mộ, cầu siêu. Tránh: Khởi sự việc lớn, đi xa, cưới hỏi.'
  },
  '2026-8': {
    goodDays: [3, 7, 10, 13, 16, 19, 22, 25, 28],
    badDays: [4, 12, 18, 26],
    luckyColors: ['Vàng', 'Xanh lá', 'Trắng'],
    luckyDirection: 'Tây',
    advice: 'Tháng Thu - Nên: Khai trương, kinh doanh, cưới hỏi, nhập trạch. Tránh: Động thổ hướng Đông, sa thải nhân viên.'
  },
  '2026-9': {
    goodDays: [1, 5, 8, 11, 14, 17, 20, 23, 26, 29],
    badDays: [6, 13, 19, 27],
    luckyColors: ['Xanh dương', 'Trắng', 'Bạc'],
    luckyDirection: 'Đông Bắc',
    advice: 'Tháng Trung Thu - Nên: Cúng trăng, đoàn viên gia đình, sửa sang nhà cửa. Tránh: Khởi công lớn, mua bán đất đai.'
  },
  '2026-10': {
    goodDays: [2, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    badDays: [5, 11, 20, 28],
    luckyColors: ['Nâu', 'Vàng', 'Cam'],
    luckyDirection: 'Nam',
    advice: 'Tháng Mười - Nên: Cưới hỏi, khai trương, động thổ, nhập trạch. Tránh: Đi xa vào ngày xấu, tranh cãi kiện tụng.'
  },
  '2026-11': {
    goodDays: [3, 7, 10, 13, 16, 19, 22, 25, 28],
    badDays: [4, 12, 18, 29],
    luckyColors: ['Đen', 'Xám', 'Xanh dương đậm'],
    luckyDirection: 'Bắc',
    advice: 'Tháng Đông - Nên: Tích trữ, sửa sang, chuẩn bị Tết. Tránh: Khởi sự việc lớn, cưới hỏi, động thổ.'
  },
  '2026-12': {
    goodDays: [1, 5, 8, 11, 14, 17, 20, 23, 26, 29],
    badDays: [6, 13, 19, 27],
    luckyColors: ['Đỏ', 'Vàng', 'Cam'],
    luckyDirection: 'Đông',
    advice: 'Tháng Chạp - Nên: Cúng ông Công ông Táo, chuẩn bị Tết, dọn dẹp nhà cửa. Tránh: Khởi công, cưới hỏi, mua xe.'
  }
}

// Get static calendar data (instant, no AI call)
export function getStaticCalendarData(month: number, year: number): StaticMonthData | null {
  const key = `${year}-${month}`
  return CALENDAR_2026[key] || null
}

// Cache key for localStorage
export function getCalendarCacheKey(month: number, year: number): string {
  return `calendar_${year}_${month}`
}

// Check if cache is valid (24 hours)
export function isCacheValid(cachedData: any): boolean {
  if (!cachedData || !cachedData.timestamp) return false
  const now = Date.now()
  const cacheAge = now - cachedData.timestamp
  const ONE_DAY = 24 * 60 * 60 * 1000
  return cacheAge < ONE_DAY
}

// Save to cache
export function saveToCache(month: number, year: number, data: StaticMonthData): void {
  const key = getCalendarCacheKey(month, year)
  const cacheData = {
    data,
    timestamp: Date.now()
  }
  try {
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (e) {
    console.error('Failed to save calendar cache:', e)
  }
}

// Load from cache
export function loadFromCache(month: number, year: number): StaticMonthData | null {
  const key = getCalendarCacheKey(month, year)
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const parsed = JSON.parse(cached)
    if (isCacheValid(parsed)) {
      return parsed.data
    }
    
    // Clear expired cache
    localStorage.removeItem(key)
    return null
  } catch (e) {
    console.error('Failed to load calendar cache:', e)
    return null
  }
}
