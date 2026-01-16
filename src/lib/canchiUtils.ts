/**
 * Can Chi (Heavenly Stems and Earthly Branches) Utilities
 * Tính toán Can Chi và Mệnh dựa trên năm sinh
 */

// Thiên Can (Heavenly Stems)
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']

// Địa Chi (Earthly Branches)
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

// Mệnh Ngũ Hành theo Can Chi (Nayin - 納音)
// 60 năm mệnh trong một chu kỳ Hoa Giáp
const MENH_60_NAM = [
  'Hải Trung Kim', 'Hải Trung Kim',     // Giáp Tý, Ất Sửu (1984, 1985)
  'Lư Trung Hỏa', 'Lư Trung Hỏa',       // Bính Dần, Đinh Mão
  'Đại Lâm Mộc', 'Đại Lâm Mộc',         // Mậu Thìn, Kỷ Tỵ
  'Lộ Bàng Thổ', 'Lộ Bàng Thổ',         // Canh Ngọ, Tân Mùi
  'Kiếm Phong Kim', 'Kiếm Phong Kim',   // Nhâm Thân, Quý Dậu
  'Sơn Đầu Hỏa', 'Sơn Đầu Hỏa',         // Giáp Tuất, Ất Hợi
  
  'Giản Hạ Thủy', 'Giản Hạ Thủy',       // Bính Tý, Đinh Sửu
  'Thành Đầu Thổ', 'Thành Đầu Thổ',     // Mậu Dần, Kỷ Mão
  'Bạch Lạp Kim', 'Bạch Lạp Kim',       // Canh Thìn, Tân Tỵ
  'Dương Liễu Mộc', 'Dương Liễu Mộc',   // Nhâm Ngọ, Quý Mùi
  'Tuyền Trung Thủy', 'Tuyền Trung Thủy', // Giáp Thân, Ất Dậu
  'Ốc Thượng Thổ', 'Ốc Thượng Thổ',     // Bính Tuất, Đinh Hợi
  
  'Tích Lịch Hỏa', 'Tích Lịch Hỏa',     // Mậu Tý, Kỷ Sửu
  'Tùng Bách Mộc', 'Tùng Bách Mộc',     // Canh Dần, Tân Mão
  'Trường Lưu Thủy', 'Trường Lưu Thủy', // Nhâm Thìn, Quý Tỵ
  'Sa Trung Kim', 'Sa Trung Kim',       // Giáp Ngọ, Ất Mùi
  'Sơn Hạ Hỏa', 'Sơn Hạ Hỏa',           // Bính Thân, Đinh Dậu
  'Bình Địa Mộc', 'Bình Địa Mộc',       // Mậu Tuất, Kỷ Hợi
  
  'Bích Thượng Thổ', 'Bích Thượng Thổ', // Canh Tý, Tân Sửu
  'Kim Bạch Kim', 'Kim Bạch Kim',       // Nhâm Dần, Quý Mão
  'Phúc Đăng Hỏa', 'Phúc Đăng Hỏa',     // Giáp Thìn, Ất Tỵ
  'Thiên Hà Thủy', 'Thiên Hà Thủy',     // Bính Ngọ, Đinh Mùi
  'Đại Trạch Thổ', 'Đại Trạch Thổ',     // Mậu Thân, Kỷ Dậu
  'Thoa Xuyến Kim', 'Thoa Xuyến Kim',   // Canh Tuất, Tân Hợi
  
  'Tang Đố Mộc', 'Tang Đố Mộc',         // Nhâm Tý, Quý Sửu
  'Đại Khê Thủy', 'Đại Khê Thủy',       // Giáp Dần, Ất Mão
  'Sa Trung Thổ', 'Sa Trung Thổ',       // Bính Thìn, Đinh Tỵ
  'Thiên Thượng Hỏa', 'Thiên Thượng Hỏa' // Mậu Ngọ, Kỷ Mùi
]

/**
 * Lấy Can Chi của năm
 */
export function getCanChi(year: number): string {
  // 1984 = Giáp Tý (năm 0 trong chu kỳ 60 năm bắt đầu từ 1984)
  const offset = (year - 1984) % 60
  const canIndex = offset % 10
  const chiIndex = offset % 12
  return `${CAN[canIndex]} ${CHI[chiIndex]}`
}

/**
 * Lấy Mệnh Ngũ Hành dựa trên năm sinh
 */
export function getMenh(year: number): string {
  // 1984 = Giáp Tý (index 0)
  const offset = (year - 1984) % 60
  return MENH_60_NAM[offset] || 'Không xác định'
}

/**
 * Lấy ngũ hành chính từ mệnh
 */
export function getNguHanhFromMenh(menh: string): string {
  if (menh.includes('Kim')) return 'Kim'
  if (menh.includes('Mộc')) return 'Mộc'
  if (menh.includes('Thủy')) return 'Thủy'
  if (menh.includes('Hỏa')) return 'Hỏa'
  if (menh.includes('Thổ')) return 'Thổ'
  return 'Không xác định'
}

/**
 * Lấy thông tin đầy đủ về Can Chi và Mệnh
 */
export function getCanChiMenh(year: number): {
  canChi: string
  menh: string
  nguHanh: string
} {
  const canChi = getCanChi(year)
  const menh = getMenh(year)
  const nguHanh = getNguHanhFromMenh(menh)
  
  return { canChi, menh, nguHanh }
}
