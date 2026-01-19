/**
 * Can Chi Calculator - Tính Tam Hợp, Lục Hợp, Ngũ Hành
 * Không dùng AI - Pure logic
 */

// 12 Con Giáp (Địa Chi)
const ZODIACS = [
  { name: 'Tý', animal: 'Chuột', element: 'Thủy' },
  { name: 'Sửu', animal: 'Trâu', element: 'Thổ' },
  { name: 'Dần', animal: 'Hổ', element: 'Mộc' },
  { name: 'Mão', animal: 'Mèo', element: 'Mộc' },
  { name: 'Thìn', animal: 'Rồng', element: 'Thổ' },
  { name: 'Tỵ', animal: 'Rắn', element: 'Hỏa' },
  { name: 'Ngọ', animal: 'Ngựa', element: 'Hỏa' },
  { name: 'Mùi', animal: 'Dê', element: 'Thổ' },
  { name: 'Thân', animal: 'Khỉ', element: 'Kim' },
  { name: 'Dậu', animal: 'Gà', element: 'Kim' },
  { name: 'Tuất', animal: 'Chó', element: 'Thổ' },
  { name: 'Hợi', animal: 'Lợn', element: 'Thủy' }
]

// Tam Hợp (3 hợp): Nhóm 3 con giáp hợp nhau
const TAM_HOP = [
  [0, 4, 8],   // Tý - Thìn - Thân (Thủy)
  [1, 5, 9],   // Sửu - Tỵ - Dậu (Kim)
  [2, 6, 10],  // Dần - Ngọ - Tuất (Hỏa)
  [3, 7, 11]   // Mão - Mùi - Hợi (Mộc)
]

// Lục Hợp (6 hợp): Cặp đôi hợp nhau
const LUC_HOP = [
  [0, 1],   // Tý - Sửu
  [2, 11],  // Dần - Hợi
  [3, 10],  // Mão - Tuất
  [4, 9],   // Thìn - Dậu
  [5, 8],   // Tỵ - Thân
  [6, 7]    // Ngọ - Mùi
]

// Ngũ Hành Tương Sinh: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc
const NGU_HANH_SINH: Record<string, string> = {
  'Mộc': 'Hỏa',
  'Hỏa': 'Thổ',
  'Thổ': 'Kim',
  'Kim': 'Thủy',
  'Thủy': 'Mộc'
}

// Ngũ Hành Tương Khắc (for future use)
// const NGU_HANH_KHAC: Record<string, string> = {
//   'Mộc': 'Thổ',
//   'Thổ': 'Thủy',
//   'Thủy': 'Hỏa',
//   'Hỏa': 'Kim',
//   'Kim': 'Mộc'
// }

export interface CompatiblePerson {
  ageRange: string
  zodiac: string
  element: string
  compatibility: string
  reasons: string[]
  luckyHours: string[]
  gifts: string[]
  rating: number
}

/**
 * Tính Con Giáp từ năm sinh
 */
export function getZodiacFromYear(year: number): number {
  // Tý bắt đầu từ 1924, 1936, 1948...
  // Formula: (year - 4) % 12
  return (year - 4) % 12
}

/**
 * Tìm người xông đất phù hợp dựa trên Tam Hợp, Lục Hợp, Ngũ Hành
 * Note: gender parameter reserved for future gender-specific calculations
 */
export function findCompatiblePeople(birthYear: number, _gender: 'male' | 'female'): CompatiblePerson[] {
  const ownerZodiacIndex = getZodiacFromYear(birthYear)
  const ownerZodiac = ZODIACS[ownerZodiacIndex]
  const currentYear = 2026
  const results: CompatiblePerson[] = []

  // 1. TÌM TAM HỢP (Cực kỳ may mắn - 5 sao)
  const tamHopGroup = TAM_HOP.find(group => group.includes(ownerZodiacIndex))
  if (tamHopGroup) {
    const compatibleZodiacs = tamHopGroup.filter(idx => idx !== ownerZodiacIndex)
    compatibleZodiacs.forEach(zodiacIdx => {
      const zodiac = ZODIACS[zodiacIdx]
      const age = getAgeRange(zodiacIdx, birthYear, currentYear)
      
      results.push({
        ageRange: age,
        zodiac: `Tuổi ${zodiac.name} (${zodiac.animal})`,
        element: zodiac.element,
        compatibility: 'Tam Hợp - Cực kỳ may mắn',
        reasons: [
          `Tam hợp với tuổi ${ownerZodiac.name}, tạo ra năng lượng cực mạnh`,
          `Mệnh ${zodiac.element} hòa hợp, mang lại tài lộc dồi dào`,
          `Xông đất sẽ mang đến may mắn suốt cả năm 2026`
        ],
        luckyHours: getLuckyHours(zodiacIdx),
        gifts: getGiftSuggestions(zodiac.element),
        rating: 5
      })
    })
  }

  // 2. TÌM LỤC HỢP (Rất may mắn - 4 sao)
  const lucHopPair = LUC_HOP.find(pair => pair.includes(ownerZodiacIndex))
  if (lucHopPair) {
    const compatibleIdx = lucHopPair.find(idx => idx !== ownerZodiacIndex)
    if (compatibleIdx !== undefined) {
      const zodiac = ZODIACS[compatibleIdx]
      const age = getAgeRange(compatibleIdx, birthYear, currentYear)
      
      results.push({
        ageRange: age,
        zodiac: `Tuổi ${zodiac.name} (${zodiac.animal})`,
        element: zodiac.element,
        compatibility: 'Lục Hợp - Rất may mắn',
        reasons: [
          `Lục hợp với tuổi ${ownerZodiac.name}, tương trợ lẫn nhau`,
          `Mệnh ${zodiac.element} tạo sự hài hòa, cân bằng`,
          `Giúp gia chủ gặp nhiều quý nhân trong năm mới`
        ],
        luckyHours: getLuckyHours(compatibleIdx),
        gifts: getGiftSuggestions(zodiac.element),
        rating: 4
      })
    }
  }

  // 3. TÌM NGŨ HÀNH TƯƠNG SINH (May mắn - 4 sao)
  const sinhElement = NGU_HANH_SINH[ownerZodiac.element]
  const sinhZodiacs = ZODIACS.filter(z => z.element === sinhElement)
  if (sinhZodiacs.length > 0) {
    const zodiac = sinhZodiacs[0] // Lấy con đầu tiên
    const zodiacIdx = ZODIACS.findIndex(z => z.name === zodiac.name)
    const age = getAgeRange(zodiacIdx, birthYear, currentYear)
    
    // Chỉ thêm nếu chưa có trong Tam Hợp/Lục Hợp
    if (!results.find(r => r.zodiac.includes(zodiac.name))) {
      results.push({
        ageRange: age,
        zodiac: `Tuổi ${zodiac.name} (${zodiac.animal})`,
        element: zodiac.element,
        compatibility: 'Ngũ Hành Tương Sinh - May mắn',
        reasons: [
          `Mệnh ${zodiac.element} sinh cho mệnh ${ownerZodiac.element}`,
          `Tạo ra vòng tuần hoàn tốt lành, tài lộc dồi dào`,
          `Giúp gia đình phát đạt, sự nghiệp hanh thông`
        ],
        luckyHours: getLuckyHours(zodiacIdx),
        gifts: getGiftSuggestions(zodiac.element),
        rating: 4
      })
    }
  }

  return results.slice(0, 3) // Trả về tối đa 3 nhóm
}

/**
 * Tính khoảng tuổi dựa trên con giáp
 */
function getAgeRange(zodiacIdx: number, ownerBirthYear: number, currentYear: number): string {
  // Tìm năm sinh gần nhất của zodiacIdx
  const ownerZodiacIdx = getZodiacFromYear(ownerBirthYear)
  const diff = (zodiacIdx - ownerZodiacIdx + 12) % 12
  
  // Tính các năm sinh có thể
  const possibleYears = []
  for (let offset = -24; offset <= 24; offset += 12) {
    const year = ownerBirthYear + diff + offset
    const age = currentYear - year
    if (age >= 18 && age <= 70) {
      possibleYears.push(age)
    }
  }
  
  if (possibleYears.length === 0) return '25-35 tuổi'
  
  const minAge = Math.min(...possibleYears)
  const maxAge = Math.max(...possibleYears)
  return `${minAge}-${maxAge} tuổi`
}

/**
 * Lấy giờ hoàng đạo dựa trên con giáp
 */
function getLuckyHours(zodiacIdx: number): string[] {
  const zodiac = ZODIACS[zodiacIdx]
  const hours = [
    `Giờ ${zodiac.name} (${(zodiacIdx * 2 + 23) % 24}:00-${(zodiacIdx * 2 + 1) % 24}:00)`,
    `Giờ Tý (23:00-01:00)`, // Giờ đầu ngày - luôn tốt
    `Giờ Mão (05:00-07:00)` // Giờ mặt trời mọc - may mắn
  ]
  return hours.slice(0, 3)
}

/**
 * Gợi ý quà tặng dựa trên mệnh
 */
function getGiftSuggestions(element: string): string[] {
  const gifts: Record<string, string[]> = {
    'Mộc': ['Cây cảnh', 'Trái cây tươi', 'Hoa tươi'],
    'Hỏa': ['Nến thơm', 'Đèn trang trí', 'Quà màu đỏ'],
    'Thổ': ['Gốm sứ', 'Bánh kẹo', 'Trái cây sấy'],
    'Kim': ['Đồ kim loại', 'Tiền lì xì', 'Đồng xu may mắn'],
    'Thủy': ['Nước hoa', 'Rượu', 'Nước ngọt cao cấp']
  }
  return gifts[element] || ['Bánh kẹo', 'Trái cây', 'Hoa tươi']
}
