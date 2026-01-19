/**
 * Lịch Phong Thủy Calculator
 * Calculate good/bad days based on Can Chi, 28 Constellations, 12 Officers
 */

// Thiên Can (10 Heavenly Stems)
const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']

// Địa Chi (12 Earthly Branches)
const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

// Nhị Thập Bát Tú (28 Constellations) - Cycle of 28 stars
const NHI_THAP_BAT_TU = [
  { name: 'Giác', status: 'good', activities: ['Khai trương', 'Cưới hỏi', 'Xuất hành'] },
  { name: 'Cang', status: 'bad', activities: [] },
  { name: 'Đê', status: 'good', activities: ['Động thổ', 'Xây dựng'] },
  { name: 'Phòng', status: 'good', activities: ['Nhập trạch', 'An táng'] },
  { name: 'Tâm', status: 'bad', activities: [] },
  { name: 'Vĩ', status: 'good', activities: ['Cưới hỏi', 'Khai trương'] },
  { name: 'Cơ', status: 'good', activities: ['Xuất hành', 'Ký hợp đồng'] },
  { name: 'Đẩu', status: 'good', activities: ['Khai trương', 'Mua sắm'] },
  { name: 'Ngưu', status: 'bad', activities: [] },
  { name: 'Nữ', status: 'bad', activities: [] },
  { name: 'Hư', status: 'bad', activities: [] },
  { name: 'Nguy', status: 'bad', activities: [] },
  { name: 'Thất', status: 'good', activities: ['An táng', 'Tu bổ'] },
  { name: 'Bích', status: 'good', activities: ['Khai trương', 'Động thổ'] },
  { name: 'Khuê', status: 'good', activities: ['Cưới hỏi', 'Ký hợp đồng'] },
  { name: 'Lâu', status: 'bad', activities: [] },
  { name: 'Vị', status: 'good', activities: ['Nhập trạch', 'An táng'] },
  { name: 'Mão', status: 'bad', activities: [] },
  { name: 'Tất', status: 'good', activities: ['Xuất hành', 'Khai trương'] },
  { name: 'Chủy', status: 'bad', activities: [] },
  { name: 'Sâm', status: 'good', activities: ['Cưới hỏi', 'Ký hợp đồng'] },
  { name: 'Tỉnh', status: 'good', activities: ['Động thổ', 'Xây dựng'] },
  { name: 'Quỷ', status: 'bad', activities: [] },
  { name: 'Liễu', status: 'bad', activities: [] },
  { name: 'Tinh', status: 'bad', activities: [] },
  { name: 'Trương', status: 'good', activities: ['Khai trương', 'Mua sắm'] },
  { name: 'Dực', status: 'good', activities: ['Cưới hỏi', 'Nhập trạch'] },
  { name: 'Chẩn', status: 'good', activities: ['Xuất hành', 'Ký hợp đồng'] }
]

// 12 Trực (12 Officers) - Daily cycle
const HAI_MUOI_TRUC = [
  { name: 'Kiến', status: 'good', activities: ['Khai trương', 'Cưới hỏi', 'Động thổ'] },
  { name: 'Trừ', status: 'neutral', activities: ['Xuất hành', 'Tẩy uế'] },
  { name: 'Mãn', status: 'good', activities: ['Khai trương', 'Ký hợp đồng'] },
  { name: 'Bình', status: 'good', activities: ['Cưới hỏi', 'Xuất hành'] },
  { name: 'Định', status: 'good', activities: ['Nhập trạch', 'An táng'] },
  { name: 'Chấp', status: 'neutral', activities: ['Tu bổ', 'Xây dựng'] },
  { name: 'Phá', status: 'bad', activities: [] },
  { name: 'Nguy', status: 'bad', activities: [] },
  { name: 'Thành', status: 'good', activities: ['Khai trương', 'Động thổ', 'Cưới hỏi'] },
  { name: 'Thâu', status: 'good', activities: ['Mua sắm', 'Thu hoạch'] },
  { name: 'Khai', status: 'good', activities: ['Khai trương', 'Xuất hành'] },
  { name: 'Bế', status: 'bad', activities: [] }
]

export interface GoodDate {
  solar: string // DD/MM/YYYY
  lunar: string // DD/MM
  dayName: string // Can Chi
  constellation: string // Nhị Thập Bát Tú
  officer: string // 12 Trực
  reasons: string[]
  bestHours: string[]
  avoid: string[]
  rating: number // 1-5
}

/**
 * Get Can Chi for a date
 */
export function getCanChi(date: Date): string {
  // Julian Day Number calculation
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  
  let a = Math.floor((14 - m) / 12)
  let y2 = y + 4800 - a
  let m2 = m + 12 * a - 3
  
  let jdn = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045
  
  // Can Chi starts from 甲子 (Giáp Tý) at JDN 2357141
  const offset = jdn - 2357141
  const canIndex = (offset + 10) % 10
  const chiIndex = (offset + 12) % 12
  
  return `${THIEN_CAN[canIndex]} ${DIA_CHI[chiIndex]}`
}

/**
 * Get constellation (Nhị Thập Bát Tú) for a date
 */
export function getConstellation(date: Date): typeof NHI_THAP_BAT_TU[0] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const index = dayOfYear % 28
  return NHI_THAP_BAT_TU[index]
}

/**
 * Get officer (12 Trực) for a date
 */
export function getOfficer(date: Date): typeof HAI_MUOI_TRUC[0] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const index = dayOfYear % 12
  return HAI_MUOI_TRUC[index]
}

/**
 * Calculate compatibility with user's birth year
 */
export function isCompatibleYear(date: Date, birthYear: number): boolean {
  const currentYear = date.getFullYear()
  const userZodiac = (birthYear - 4) % 12
  const dateZodiac = (currentYear - 4) % 12
  
  // Tam Hợp, Lục Hợp logic (reuse from canChiCalculator)
  const TAM_HOP = [
    [0, 4, 8],   // Tý - Thìn - Thân
    [1, 5, 9],   // Sửu - Tỵ - Dậu
    [2, 6, 10],  // Dần - Ngọ - Tuất
    [3, 7, 11]   // Mão - Mùi - Hợi
  ]
  
  const LUC_HOP = [
    [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]
  ]
  
  // Check Tam Hợp
  for (const group of TAM_HOP) {
    if (group.includes(userZodiac) && group.includes(dateZodiac)) {
      return true
    }
  }
  
  // Check Lục Hợp
  for (const pair of LUC_HOP) {
    if ((pair[0] === userZodiac && pair[1] === dateZodiac) ||
        (pair[1] === userZodiac && pair[0] === dateZodiac)) {
      return true
    }
  }
  
  return false
}

/**
 * Get lucky hours for a day (based on Địa Chi)
 */
export function getLuckyHours(date: Date): string[] {
  const canChi = getCanChi(date)
  const chi = canChi.split(' ')[1]
  const chiIndex = DIA_CHI.indexOf(chi)
  
  // Calculate 3 lucky hours
  const hours = [
    `Giờ ${DIA_CHI[chiIndex]} (${(chiIndex * 2 + 23) % 24}:00-${(chiIndex * 2 + 1) % 24}:00)`,
    `Giờ ${DIA_CHI[(chiIndex + 4) % 12]} (${((chiIndex + 4) * 2 + 23) % 24}:00-${((chiIndex + 4) * 2 + 1) % 24}:00)`,
    `Giờ ${DIA_CHI[(chiIndex + 8) % 12]} (${((chiIndex + 8) * 2 + 23) % 24}:00-${((chiIndex + 8) * 2 + 1) % 24}:00)`
  ]
  
  return hours
}

/**
 * Find good dates for a purpose
 */
export function findGoodDates(
  startDate: Date,
  endDate: Date,
  purpose: string,
  birthYear?: number
): GoodDate[] {
  const results: GoodDate[] = []
  const currentDate = new Date(startDate)
  
  // Purpose mapping
  const purposeKeywords = {
    'khai-truong': ['Khai trương', 'Mua sắm'],
    'cuoi-hoi': ['Cưới hỏi'],
    'dong-tho': ['Động thổ', 'Xây dựng'],
    'xuat-hanh': ['Xuất hành'],
    'nhap-trach': ['Nhập trạch'],
    'ky-hop-dong': ['Ký hợp đồng'],
    'mua-xe': ['Mua sắm'],
    'mo-tai-khoan': ['Mua sắm', 'Khai trương']
  }
  
  const keywords = purposeKeywords[purpose as keyof typeof purposeKeywords] || []
  
  while (currentDate <= endDate) {
    const canChi = getCanChi(currentDate)
    const constellation = getConstellation(currentDate)
    const officer = getOfficer(currentDate)
    
    // Calculate rating
    let rating = 0
    const reasons: string[] = []
    
    // Check constellation
    if (constellation.status === 'good' && 
        keywords.some(k => constellation.activities.includes(k))) {
      rating += 2
      reasons.push(`Sao ${constellation.name} - tốt cho ${keywords.join(', ')}`)
    }
    
    // Check officer
    if (officer.status === 'good' && 
        keywords.some(k => officer.activities.includes(k))) {
      rating += 2
      reasons.push(`Trực ${officer.name} - cát tinh`)
    }
    
    // Check year compatibility
    if (birthYear && isCompatibleYear(currentDate, birthYear)) {
      rating += 1
      reasons.push(`Hợp tuổi - năm sinh ${birthYear}`)
    }
    
    // Only include dates with rating >= 3
    if (rating >= 3) {
      const solarStr = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`
      const lunarStr = `${currentDate.getDate()}/${currentDate.getMonth() + 1}` // Simplified
      
      results.push({
        solar: solarStr,
        lunar: lunarStr,
        dayName: canChi,
        constellation: constellation.name,
        officer: officer.name,
        reasons,
        bestHours: getLuckyHours(currentDate),
        avoid: officer.status === 'bad' ? ['Mọi việc'] : [],
        rating: Math.min(rating, 5)
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Sort by rating desc, return top 5
  return results.sort((a, b) => b.rating - a.rating).slice(0, 5)
}
