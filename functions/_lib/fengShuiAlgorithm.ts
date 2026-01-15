/**
 * Feng Shui Algorithm Library
 * Real feng shui calculations based on traditional Chinese almanac
 */

// Can (Heavenly Stems) - 10 items
export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']

// Chi (Earthly Branches) - 12 items
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

// Vietnamese zodiac animals
export const CON_GIAP = ['Tý (Chuột)', 'Sửu (Trâu)', 'Dần (Cọp)', 'Mão (Mèo)', 'Thìn (Rồng)', 'Tỵ (Rắn)', 'Ngọ (Ngựa)', 'Mùi (Dê)', 'Thân (Khỉ)', 'Dậu (Gà)', 'Tuất (Chó)', 'Hợi (Lợn)']

// Wu Xing (Five Elements)
export const NGU_HANH = ['Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc']

// Five Elements for Heavenly Stems
const CAN_NGU_HANH = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy']

// Five Elements for Earthly Branches
const CHI_NGU_HANH = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy']

// 12 Truc (12 Duties)
export const TRUC_12 = [
  { name: 'Kiến', good: ['Gieo trồng', 'Khai trương'], bad: ['Xuất hành', 'Chuyển nhà'] },
  { name: 'Trừ', good: ['Dọn dẹp', 'Tắm gội'], bad: ['Cầu tài', 'Hôn nhân'] },
  { name: 'Mãn', good: ['Cầu phúc', 'Cúng tế'], bad: ['Kiện tụng', 'Động thổ'] },
  { name: 'Bình', good: ['Xuất hành', 'Giao dịch'], bad: ['Kiện tụng'] },
  { name: 'Định', good: ['Hôn nhân', 'Xây dựng'], bad: ['Kiện tụng', 'Xuất hành'] },
  { name: 'Chấp', good: ['Tu sửa', 'Khai trương'], bad: ['Xuất hành', 'Chuyển nhà'] },
  { name: 'Phá', good: [], bad: ['Mọi việc đều xấu'] },
  { name: 'Nguy', good: ['Đào ao', 'Chặt cây'], bad: ['Hôn nhân', 'Xuất hành'] },
  { name: 'Thành', good: ['Khai trương', 'Hôn nhân'], bad: ['Kiện tụng'] },
  { name: 'Thâu', good: ['Cầu tài', 'Giao dịch'], bad: ['Chôn cất', 'Động thổ'] },
  { name: 'Khai', good: ['Khai trương', 'Xây dựng'], bad: ['Chôn cất'] },
  { name: 'Bế', good: ['Cầu phúc', 'Tu sửa'], bad: ['Xuất hành', 'Khai trương'] }
]

// Good and bad stars
export const SAO_TOT = [
  'Thiên Đức', 'Nguyệt Đức', 'Thiên Hỷ', 'Thiên Y', 'Thiên Quý',
  'Tam Hợp', 'Lục Hợp', 'Ngũ Phú', 'Thiên Thành', 'Hoàng Đạo'
]

export const SAO_XAU = [
  'Nguyệt Kỵ', 'Nguyệt Kiến', 'Nguyệt Hình', 'Tam Nương',
  'Dương Công', 'Hồng Sa', 'Thiên Hỏa', 'Hắc Đạo'
]

/**
 * Calculate Can Chi for a given year
 */
export function getCanChiYear(year: number): string {
  const canIndex = (year - 4) % 10
  const chiIndex = (year - 4) % 12
  return `${CAN[canIndex]} ${CHI[chiIndex]}`
}

/**
 * Calculate Can Chi for a given date (Julian Day Number)
 */
export function getCanChiDay(jd: number): string {
  const canIndex = (jd + 9) % 10
  const chiIndex = (jd + 1) % 12
  return `${CAN[canIndex]} ${CHI[chiIndex]}`
}

/**
 * Get zodiac animal for a year
 */
export function getConGiap(year: number): string {
  const chiIndex = (year - 4) % 12
  return CON_GIAP[chiIndex]
}

/**
 * Get Five Element (Ngu Hanh) for Can Chi
 */
export function getNguHanh(canChi: string): string {
  const [can, chi] = canChi.split(' ')
  const canIndex = CAN.indexOf(can)
  const chiIndex = CHI.indexOf(chi)
  
  if (canIndex === -1 || chiIndex === -1) return 'Unknown'
  
  const canElement = CAN_NGU_HANH[canIndex]
  const chiElement = CHI_NGU_HANH[chiIndex]
  
  return `${canElement} (${can}) - ${chiElement} (${chi})`
}

/**
 * Check if two Can Chi clash (Thiên Khắc Địa Xung)
 */
export function isCanChiClash(canChi1: string, canChi2: string): boolean {
  const [can1, chi1] = canChi1.split(' ')
  const [can2, chi2] = canChi2.split(' ')
  
  const canIndex1 = CAN.indexOf(can1)
  const canIndex2 = CAN.indexOf(can2)
  const chiIndex1 = CHI.indexOf(chi1)
  const chiIndex2 = CHI.indexOf(chi2)
  
  // Thiên Khắc: Can elements clash
  const canClash = Math.abs(canIndex1 - canIndex2) === 5
  
  // Địa Xung: Chi opposite clash (6 positions apart)
  const chiClash = Math.abs(chiIndex1 - chiIndex2) === 6
  
  return canClash && chiClash
}

/**
 * Calculate 12 Truc for a given day
 */
export function get12Truc(dayJD: number, monthChi: number): typeof TRUC_12[0] {
  // Formula: (Day Chi + Month Chi) % 12
  const dayChi = (dayJD + 1) % 12
  const trucIndex = (dayChi + monthChi) % 12
  return TRUC_12[trucIndex]
}

/**
 * Simplified Julian Day calculation (for date conversion)
 */
export function getJulianDayNumber(year: number, month: number, day: number): number {
  let a = Math.floor((14 - month) / 12)
  let y = year + 4800 - a
  let m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

/**
 * Get lucky stars for a date (simplified algorithm)
 */
export function getLuckyStars(dayCanChi: string, monthChi: number): string[] {
  const stars: string[] = []
  
  const [dayCan, dayChi] = dayCanChi.split(' ')
  const dayCanIndex = CAN.indexOf(dayCan)
  const dayChiIndex = CHI.indexOf(dayChi)
  
  // Thiên Đức (Heavenly Virtue) - based on month
  const thienDucMap = [4, 1, 7, 0, 4, 1, 7, 0, 4, 1, 7, 0] // Can index for each month
  if (dayCanIndex === thienDucMap[monthChi]) {
    stars.push('Thiên Đức')
  }
  
  // Nguyệt Đức (Monthly Virtue) - based on month
  const nguyetDucMap = [6, 0, 9, 3, 6, 0, 9, 3, 6, 0, 9, 3] // Chi index for each month
  if (dayChiIndex === nguyetDucMap[monthChi]) {
    stars.push('Nguyệt Đức')
  }
  
  // Tam Hợp (Three Harmony) - based on day Chi
  const tamHopMap = [
    [0, 4, 8],   // Tý, Thìn, Thân
    [1, 5, 9],   // Sửu, Tỵ, Dậu
    [2, 6, 10],  // Dần, Ngọ, Tuất
    [3, 7, 11]   // Mão, Mùi, Hợi
  ]
  
  for (const group of tamHopMap) {
    if (group.includes(dayChiIndex) && group.includes(monthChi)) {
      stars.push('Tam Hợp')
      break
    }
  }
  
  return stars
}

/**
 * Get unlucky stars for a date
 */
export function getUnluckyStars(dayCanChi: string, monthChi: number, yearChi: number): string[] {
  const stars: string[] = []
  
  const [, dayChi] = dayCanChi.split(' ')
  const dayChiIndex = CHI.indexOf(dayChi)
  
  // Nguyệt Kỵ (Monthly Taboo) - day Chi clashes with month Chi
  if (Math.abs(dayChiIndex - monthChi) === 6) {
    stars.push('Nguyệt Kỵ')
  }
  
  // Tam Nương Sa (Three Lady Death) - specific days
  if ([2, 6, 10, 14, 18, 22, 26].includes(dayChiIndex)) {
    stars.push('Tam Nương Sa')
  }
  
  // Nguyệt Phá (Monthly Break) - day Chi breaks month Chi
  const nguyetPhaMap = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]
  if (dayChiIndex === nguyetPhaMap[monthChi]) {
    stars.push('Nguyệt Phá')
  }
  
  return stars
}

/**
 * Comprehensive date analysis
 */
export interface DateAnalysis {
  date: string
  canChiDay: string
  canChiYear: string
  nguHanh: string
  truc12: typeof TRUC_12[0]
  luckyStars: string[]
  unluckyStars: string[]
  score: number // 0-10
  recommendation: 'Tốt' | 'Trung bình' | 'Xấu'
  reason: string
}

export function analyzeFengShuiDate(
  year: number,
  month: number, 
  day: number,
  birthYear?: number
): DateAnalysis {
  const jd = getJulianDayNumber(year, month, day)
  const canChiDay = getCanChiDay(jd)
  const canChiYear = getCanChiYear(year)
  const nguHanh = getNguHanh(canChiDay)
  const monthChi = (month + 1) % 12 // Approximate month Chi
  const yearChi = (year - 4) % 12
  
  const truc12 = get12Truc(jd, monthChi)
  const luckyStars = getLuckyStars(canChiDay, monthChi)
  const unluckyStars = getUnluckyStars(canChiDay, monthChi, yearChi)
  
  // Calculate score
  let score = 5 // Base score
  
  // Good Truc
  if (['Thành', 'Khai', 'Mãn', 'Định'].includes(truc12.name)) score += 2
  if (truc12.name === 'Phá') score -= 3
  
  // Lucky stars
  score += luckyStars.length
  
  // Unlucky stars
  score -= unluckyStars.length * 1.5
  
  // Check clash with birth year
  if (birthYear) {
    const birthCanChi = getCanChiYear(birthYear)
    if (isCanChiClash(canChiDay, birthCanChi)) {
      score -= 3
      unluckyStars.push('Xung tuổi')
    }
  }
  
  // Normalize score
  score = Math.max(0, Math.min(10, score))
  
  const recommendation = score >= 7 ? 'Tốt' : score >= 4 ? 'Trung bình' : 'Xấu'
  
  const reason = [
    `Can Chi: ${canChiDay}`,
    `Ngũ hành: ${nguHanh}`,
    `12 Trực: ${truc12.name}`,
    luckyStars.length > 0 ? `Sao tốt: ${luckyStars.join(', ')}` : null,
    unluckyStars.length > 0 ? `Sao xấu: ${unluckyStars.join(', ')}` : null
  ].filter(Boolean).join(' | ')
  
  return {
    date: `${day}/${month}/${year}`,
    canChiDay,
    canChiYear,
    nguHanh,
    truc12,
    luckyStars,
    unluckyStars,
    score: Math.round(score * 10) / 10,
    recommendation,
    reason
  }
}
