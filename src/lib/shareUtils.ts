/**
 * Share utilities for social sharing and Web Share API
 */

export interface ShareData {
  title: string
  text: string
  url?: string
}

/**
 * Share using Web Share API (mobile-first) or fallback to clipboard
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  const fullUrl = data.url || window.location.href
  
  try {
    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: fullUrl
      })
      return true
    }
    
    // Fallback: Copy to clipboard
    await navigator.clipboard.writeText(`${data.title}\n\n${data.text}\n\n${fullUrl}`)
    alert('✅ Đã sao chép nội dung! Bạn có thể chia sẻ ngay.')
    return true
  } catch (error: any) {
    // User cancelled share (not an error, just return false)
    if (error.name === 'AbortError') {
      console.log('Share cancelled by user')
      return false
    }
    
    // Real error - try clipboard fallback
    try {
      await navigator.clipboard.writeText(`${data.title}\n\n${data.text}\n\n${fullUrl}`)
      alert('✅ Đã sao chép nội dung! Bạn có thể chia sẻ ngay.')
      return true
    } catch (clipboardError) {
      console.error('Share failed:', error)
      alert('❌ Không thể chia sẻ. Vui lòng thử lại.')
      return false
    }
  }
}

/**
 * Share to Facebook
 */
export function shareToFacebook(url?: string) {
  const shareUrl = url || window.location.href
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}

/**
 * Share to Zalo (if Zalo Web SDK is available)
 */
export function shareToZalo(data: ShareData) {
  const shareUrl = data.url || window.location.href
  const zaloUrl = `https://page.zalo.me/api/share?link=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(data.title)}&desc=${encodeURIComponent(data.text)}`
  window.open(zaloUrl, '_blank', 'width=600,height=400')
}

/**
 * Generate share URL for current page with optional parameters
 */
export function generateShareUrl(params?: Record<string, string>): string {
  const url = new URL(window.location.href)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}
