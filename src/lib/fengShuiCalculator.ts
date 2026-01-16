// Can Chi Calendar Calculator for Vietnamese Feng Shui
// Based on Thiên Can Địa Chi system

const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']
const ZODIAC = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn']

// Ngũ Hành (Five Elements)
const NGU_HANH = {
  KIM: 'Kim',    // Metal
  MUC: 'Mộc',    // Wood
  THUY: 'Thủy',  // Water
  HOA: 'Hỏa',    // Fire
  THO: 'Thổ'     // Earth
}

// Can → Ngũ Hành mapping
const CAN_TO_HANH: { [key: string]: string } = {
  'Giáp': NGU_HANH.MUC, 'Ất': NGU_HANH.MUC,
  'Bính': NGU_HANH.HOA, 'Đinh': NGU_HANH.HOA,
  'Mậu': NGU_HANH.THO, 'Kỷ': NGU_HANH.THO,
  'Canh': NGU_HANH.KIM, 'Tân': NGU_HANH.KIM,
  'Nhâm': NGU_HANH.THUY, 'Quý': NGU_HANH.THUY
}

// Chi → Ngũ Hành mapping
const CHI_TO_HANH: { [key: string]: string } = {
  'Tý': NGU_HANH.THUY, 'Sửu': NGU_HANH.THO,
  'Dần': NGU_HANH.MUC, 'Mão': NGU_HANH.MUC,
  'Thìn': NGU_HANH.THO, 'Tỵ': NGU_HANH.HOA,
  'Ngọ': NGU_HANH.HOA, 'Mùi': NGU_HANH.THO,
  'Thân': NGU_HANH.KIM, 'Dậu': NGU_HANH.KIM,
  'Tuất': NGU_HANH.THO, 'Hợi': NGU_HANH.THUY
}

// Ngũ Hành compatibility rules
// Sinh (create): Thủy → Mộc → Hỏa → Thổ → Kim → Thủy
// Khắc (overcome): Thủy ← Kim ← Hỏa ← Mộc ← Thổ ← Thủy

export function canChiSinh(hanh1: string, hanh2: string): number {
  const sinhCycle: { [key: string]: string } = {
    [NGU_HANH.THUY]: NGU_HANH.MUC,
    [NGU_HANH.MUC]: NGU_HANH.HOA,
    [NGU_HANH.HOA]: NGU_HANH.THO,
    [NGU_HANH.THO]: NGU_HANH.KIM,
    [NGU_HANH.KIM]: NGU_HANH.THUY
  }
  
  if (sinhCycle[hanh1] === hanh2 || sinhCycle[hanh2] === hanh1) return 40 // Perfect harmony
  if (hanh1 === hanh2) return 30 // Same element
  return 20 // Neutral
}

export function canChiKhac(hanh1: string, hanh2: string): number {
  const khacCycle: { [key: string]: string } = {
    [NGU_HANH.THUY]: NGU_HANH.HOA,
    [NGU_HANH.HOA]: NGU_HANH.KIM,
    [NGU_HANH.KIM]: NGU_HANH.MUC,
    [NGU_HANH.MUC]: NGU_HANH.THO,
    [NGU_HANH.THO]: NGU_HANH.THUY
  }
  
  if (khacCycle[hanh1] === hanh2 || khacCycle[hanh2] === hanh1) return -20 // Conflict
  return 0
}

export function getCanChi(year: number): { can: string; chi: string; zodiac: string } {
  // Base year: 1984 = Giáp Tý
  const canIndex = (year - 4) % 10
  const chiIndex = (year - 4) % 12
  
  return {
    can: THIEN_CAN[canIndex],
    chi: DIA_CHI[chiIndex],
    zodiac: ZODIAC[chiIndex]
  }
}

export function getNguHanh(year: number): { can: string; chi: string } {
  const { can, chi } = getCanChi(year)
  return {
    can: CAN_TO_HANH[can],
    chi: CHI_TO_HANH[chi]
  }
}

export function calculateCompatibility(birthDate1: string, birthDate2: string) {
  const year1 = new Date(birthDate1).getFullYear()
  const year2 = new Date(birthDate2).getFullYear()
  
  const canChi1 = getCanChi(year1)
  const canChi2 = getCanChi(year2)
  
  const hanh1 = getNguHanh(year1)
  const hanh2 = getNguHanh(year2)
  
  // Calculate Ngũ Hành score (40 points max)
  const nguHanhScore = Math.max(
    canChiSinh(hanh1.can, hanh2.can) + canChiKhac(hanh1.can, hanh2.can),
    20
  )
  
  // Calculate Can Chi compatibility (40 points max)
  const chiDiff = Math.abs((year1 - 4) % 12 - (year2 - 4) % 12)
  let canChiScore = 40
  if (chiDiff === 6) canChiScore = 10 // Opposite zodiac (conflict)
  else if (chiDiff === 3 || chiDiff === 9) canChiScore = 20 // Square aspect
  else if (chiDiff === 4 || chiDiff === 8) canChiScore = 30 // Trine aspect
  else if (chiDiff === 1 || chiDiff === 11) canChiScore = 35 // Adjacent
  
  // Age difference score (20 points max)
  const ageDiff = Math.abs(year1 - year2)
  let ageDiffScore = 20
  if (ageDiff > 10) ageDiffScore = 10
  else if (ageDiff > 5) ageDiffScore = 15
  
  const totalScore = nguHanhScore + canChiScore + ageDiffScore
  
  return {
    totalScore,
    ngu_hanh: nguHanhScore,
    ngu_giap: canChiScore,
    can_chi: ageDiffScore,
    breakdown: {
      ngu_hanh_detail: 
        nguHanhScore >= 35 ? `Ngũ hành ${hanh1.can} và ${hanh2.can} tương sinh, rất hợp nhau` :
        nguHanhScore >= 25 ? `Ngũ hành ${hanh1.can} và ${hanh2.can} hòa hợp` :
        `Ngũ hành ${hanh1.can} và ${hanh2.can} có chút xung khắc, cần hòa giải`,
      ngu_giap_detail:
        canChiScore >= 35 ? `Can Chi ${canChi1.chi} và ${canChi2.chi} rất hợp, hôn nhân viên mãn` :
        canChiScore >= 25 ? `Can Chi ${canChi1.chi} và ${canChi2.chi} tương đối hợp` :
        `Can Chi ${canChi1.chi} và ${canChi2.chi} có xung khắc, cần cân nhắc`,
      can_chi_detail:
        ageDiffScore >= 18 ? 'Tuổi tác rất hợp, dễ hiểu nhau' :
        ageDiffScore >= 12 ? 'Tuổi tác khá hợp' :
        'Tuổi tác có khoảng cách nhất định'
    },
    advice: [
      totalScore >= 75 ? 'Đây là duyên trời định! Hai bạn rất hợp nhau về mặt phong thủy.' : 
        totalScore >= 50 ? 'Hai bạn khá hợp nhau. Cần thêm thời gian để hiểu nhau hơn.' :
        'Hai bạn có một số xung khắc. Hãy kiên nhẫn và thấu hiểu nhau.',
      'Hãy thường xuyên giao tiếu và chia sẻ cảm xúc với nhau.',
      'Tôn trọng sở thích và không gian riêng của đối phương.',
      totalScore >= 50 ? 'Cùng nhau vượt qua khó khăn, tình yêu sẽ bền vững.' : 
        'Học cách bao dung và tha thứ cho nhau.'
    ],
    bestMonths: chiDiff <= 4 ? ['Tháng 1', 'Tháng 5', 'Tháng 9'] : 
                 chiDiff <= 6 ? ['Tháng 3', 'Tháng 7', 'Tháng 11'] :
                 ['Tháng 2', 'Tháng 6', 'Tháng 10'],
    giftSuggestions: [
      totalScore >= 75 ? '💍 Nhẫn cặp' : '🌹 Hoa hồng',
      '📱 Đồng hồ cặp',
      '✈️ Chuyến du lịch 2 người',
      '🍽️ Bữa tối lãng mạn'
    ],
    celebMatch: 
      totalScore >= 75 ? 'Brad Pitt & Angelina Jolie' :
      totalScore >= 50 ? 'David & Victoria Beckham' :
      'Ryan Gosling & Eva Mendes',
    element1: hanh1,
    element2: hanh2,
    zodiac1: canChi1.zodiac,
    zodiac2: canChi2.zodiac
  }
}
