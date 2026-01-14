/**
 * Lunar Calendar Conversion Utilities
 * Chuyển đổi giữa Dương lịch và Âm lịch Việt Nam
 * 
 * Based on Vietnamese lunar calendar (Lịch Vạn Niên)
 */

// Constants
const PI = Math.PI

// Jd functions for Julian Day Number
function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12)
  const y = yy + 4800 - a
  const m = mm + 12 * a - 3
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083
  }
  return jd
}

function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a, b, c
  if (jd > 2299160) {
    // After 5/10/1582, Gregorian calendar
    a = jd + 32044
    b = Math.floor((4 * a + 3) / 146097)
    c = a - Math.floor((b * 146097) / 4)
  } else {
    b = 0
    c = jd + 32082
  }
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)
  const day = e - Math.floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * Math.floor(m / 10)
  const year = b * 100 + d - 4800 + Math.floor(m / 10)
  return { day, month, year }
}

// New Moon calculation
function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85 // Time in Julian centuries from 1900 January 0.5
  const T2 = T * T
  const T3 = T2 * T
  const dr = PI / 180
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr) // Mean new moon
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3 // Sun's mean anomaly
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3 // Moon's mean anomaly
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3 // Moon's argument of latitude
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M)
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr)
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr)
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr))
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M))
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr))
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M))
  let deltat
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2
  }
  const JdNew = Jd1 + C1 - deltat
  return Math.floor(JdNew + 0.5 + timeZone / 24)
}

// Sun longitude
function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525 // Time in Julian centuries from 2000-01-01 12:00:00 GMT
  const T2 = T * T
  const dr = PI / 180 // degree to radian
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2 // mean anomaly, degree
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2 // mean longitude, degree
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M)
  let L = L0 + DL // true longitude, degree
  L = L * dr
  L = L - PI * 2 * (Math.floor(L / (PI * 2))) // Normalize to (0, 2*PI)
  return Math.floor((L / PI) * 6)
}

// Lunar month 11 of a year
function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021
  const k = Math.floor(off / 29.530588853)
  let nm = getNewMoonDay(k, timeZone)
  const sunLong = getSunLongitude(nm, timeZone) // sun longitude at local midnight
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone)
  }
  return nm
}

// Leap year offset
function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5)
  let last = 0
  let i = 1 // We start with the month following lunar month 11
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  do {
    last = arc
    i++
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  } while (arc !== last && i < 14)
  return i - 1
}

/**
 * Convert Solar date to Lunar date
 * Chuyển Dương lịch sang Âm lịch
 */
export function solarToLunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone: number = 7
): { day: number; month: number; year: number; isLeapMonth: boolean } {
  const dayNumber = jdFromDate(dd, mm, yy)
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853)
  let monthStart = getNewMoonDay(k + 1, timeZone)
  
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone)
  }
  
  let a11 = getLunarMonth11(yy, timeZone)
  let b11 = a11
  let lunarYear = yy
  
  if (a11 >= monthStart) {
    lunarYear = yy
    a11 = getLunarMonth11(yy - 1, timeZone)
  } else {
    lunarYear = yy + 1
    b11 = getLunarMonth11(yy + 1, timeZone)
  }
  
  const lunarDay = dayNumber - monthStart + 1
  const diff = Math.floor((monthStart - a11) / 29)
  let lunarLeap = false
  let lunarMonth = diff + 11
  
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone)
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10
      if (diff === leapMonthDiff) {
        lunarLeap = true
      }
    }
  }
  
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear = yy - 1
  }
  
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth: lunarLeap
  }
}

/**
 * Convert Lunar date to Solar date
 * Chuyển Âm lịch sang Dương lịch
 */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth: boolean = false,
  timeZone: number = 7
): { day: number; month: number; year: number } {
  let a11, b11
  
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone)
    b11 = getLunarMonth11(lunarYear, timeZone)
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone)
    b11 = getLunarMonth11(lunarYear + 1, timeZone)
  }
  
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853)
  let off = lunarMonth - 11
  
  if (off < 0) {
    off += 12
  }
  
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone)
    let leapMonth = leapOff - 2
    if (leapMonth < 0) {
      leapMonth += 12
    }
    if (isLeapMonth && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0 } // Invalid leap month
    } else if (isLeapMonth || off >= leapOff) {
      off += 1
    }
  }
  
  const monthStart = getNewMoonDay(k + off, timeZone)
  return jdToDate(monthStart + lunarDay - 1)
}

/**
 * Get current lunar date
 * Lấy ngày âm lịch hiện tại
 */
export function getCurrentLunarDate() {
  const now = new Date()
  return solarToLunar(now.getDate(), now.getMonth() + 1, now.getFullYear())
}

/**
 * Format lunar date to Vietnamese string
 * Format ngày âm lịch sang chuỗi tiếng Việt
 */
export function formatLunarDate(lunar: {
  day: number
  month: number
  year: number
  isLeapMonth?: boolean
}): string {
  const { day, month, year, isLeapMonth } = lunar
  const leapText = isLeapMonth ? ' (nhuận)' : ''
  return `${day}/${month}${leapText}/${year} (Âm lịch)`
}

/**
 * Get zodiac sign from lunar year
 * Lấy con giáp từ năm âm lịch
 */
export function getZodiacSign(lunarYear: number): string {
  const zodiacs = [
    'Tý (Chuột)', 'Sửu (Trâu)', 'Dần (Hổ)', 'Mão (Mèo)',
    'Thìn (Rồng)', 'Tỵ (Rắn)', 'Ngọ (Ngựa)', 'Mùi (Dê)',
    'Thân (Khỉ)', 'Dậu (Gà)', 'Tuất (Chó)', 'Hợi (Heo)'
  ]
  return zodiacs[(lunarYear - 4) % 12]
}

/**
 * Get Vietnamese day name
 * Lấy tên ngày trong tuần tiếng Việt
 */
export function getVietnameseDayName(date: Date): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  return days[date.getDay()]
}
