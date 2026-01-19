/**
 * Xông Đất Card Generator
 * Generate beautiful JPG invitation cards with watercolor horse theme
 */

export interface CardData {
  zodiac: string      // e.g., "Tuổi Mão (Mèo)"
  element: string     // e.g., "Mộc"
  ageRange: string    // e.g., "25-35 tuổi"
  compatibility: string // e.g., "Tam Hợp"
  luckyHours: string[]  // e.g., ["Mão (05:00-07:00)", ...]
  gifts: string[]       // e.g., ["Cây cảnh", "Trái cây"]
  year: number          // e.g., 2026
}

/**
 * Generate watercolor-style invitation card as JPG
 */
export async function generateInvitationCard(data: CardData): Promise<Blob> {
  // Create canvas
  const canvas = document.createElement('canvas')
  const size = 1080
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Background - Red-Gold Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, '#dc2626')  // red-600
  gradient.addColorStop(0.5, '#f97316') // orange-500
  gradient.addColorStop(1, '#fbbf24')   // yellow-400
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  // Watercolor texture overlay (semi-transparent white circles)
  ctx.globalAlpha = 0.1
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const radius = Math.random() * 100 + 50
    const gradientCircle = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradientCircle.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    gradientCircle.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradientCircle
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Border - Gold frame
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 20
  ctx.strokeRect(40, 40, size - 80, size - 80)

  // Inner border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 4
  ctx.strokeRect(60, 60, size - 120, size - 120)

  // Title - "MỜI XÔNG ĐẤT TẾT 2026"
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 72px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = 10
  ctx.fillText('🏮 MỜI XÔNG ĐẤT 🏮', size / 2, 180)

  ctx.font = 'bold 64px Arial, sans-serif'
  ctx.fillText(`TẾT ${data.year}`, size / 2, 260)

  // Horse emoji (larger)
  ctx.font = '120px Arial'
  ctx.fillText('🐴', size / 2, 400)

  ctx.shadowBlur = 0

  // Main content - White rounded box
  const boxX = 120
  const boxY = 450
  const boxWidth = size - 240
  const boxHeight = 480

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.beginPath()
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 30)
  ctx.fill()

  // Content text
  ctx.fillStyle = '#1f2937' // gray-800
  ctx.textAlign = 'left'
  
  let yOffset = boxY + 60

  // Line 1: Zodiac + Element
  ctx.font = 'bold 48px Arial, sans-serif'
  ctx.fillStyle = '#dc2626' // red-600
  ctx.fillText(data.zodiac, boxX + 40, yOffset)
  yOffset += 70

  ctx.font = '36px Arial, sans-serif'
  ctx.fillStyle = '#6b7280' // gray-500
  ctx.fillText(`🔮 Mệnh ${data.element} | ${data.ageRange}`, boxX + 40, yOffset)
  yOffset += 60

  // Line 2: Compatibility
  ctx.font = 'bold 40px Arial, sans-serif'
  ctx.fillStyle = '#059669' // green-600
  ctx.fillText(`⭐ ${data.compatibility}`, boxX + 40, yOffset)
  yOffset += 80

  // Line 3: Lucky Hours
  ctx.font = 'bold 36px Arial, sans-serif'
  ctx.fillStyle = '#1f2937'
  ctx.fillText('⏰ Giờ tốt:', boxX + 40, yOffset)
  yOffset += 50

  ctx.font = '32px Arial, sans-serif'
  ctx.fillStyle = '#4b5563' // gray-600
  data.luckyHours.slice(0, 2).forEach(hour => {
    ctx.fillText(`  • ${hour}`, boxX + 40, yOffset)
    yOffset += 45
  })
  
  yOffset += 20

  // Line 4: Gifts
  ctx.font = 'bold 36px Arial, sans-serif'
  ctx.fillStyle = '#1f2937'
  ctx.fillText('🎁 Quà mang theo:', boxX + 40, yOffset)
  yOffset += 50

  ctx.font = '32px Arial, sans-serif'
  ctx.fillStyle = '#4b5563'
  ctx.fillText(`  ${data.gifts.slice(0, 3).join(' • ')}`, boxX + 40, yOffset)

  // Footer
  ctx.fillStyle = '#ffffff'
  ctx.font = 'italic 28px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🧧 Chúc bạn năm mới phát tài, phát lộc! 🧧', size / 2, size - 80)

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to generate card'))
      }
    }, 'image/jpeg', 0.95)
  })
}

/**
 * Download card as JPG file
 */
export async function downloadInvitationCard(data: CardData, filename: string = 'moi-xong-dat.jpg') {
  const blob = await generateInvitationCard(data)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
