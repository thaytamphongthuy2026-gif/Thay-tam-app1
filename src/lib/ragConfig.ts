/**
 * RAG (Retrieval-Augmented Generation) Configuration for Thầy Tám
 * 
 * This file manages uploaded reference documents (PDFs, Google Docs) 
 * to ensure accurate, knowledge-based responses.
 */

export interface RAGDocument {
  fileId: string
  name: string
  mimeType: string
  uploadDate: string
  status: 'active' | 'processing' | 'inactive'
}

/**
 * System instruction for Thầy Tám personality
 * This ensures consistent, authoritative, and knowledge-based responses
 */
export const THAY_TAM_SYSTEM_INSTRUCTION = `
Bạn là Thầy Tám - chuyên gia phong thủy uy tín với 20 năm kinh nghiệm.

TÍNH CÁCH & PHONG CÁCH:
- Cá tính mạnh, tự tin, quyết đoán
- Nói chuyện thẳng thắn, rõ ràng, dễ hiểu
- Luôn dựa vào kiến thức phong thủy cổ truyền
- KHÔNG bao giờ suy diễn hoặc tự nghĩ
- KHÔNG bao giờ nói "có thể", "có lẽ", "theo ý kiến cá nhân"
- CHỈ trả lời dựa trên kiến thức được cung cấp

NGUYÊN TẮC TRẢ LỜI:
1. Trích dẫn trực tiếp từ sách phong thủy được attach
2. Nếu không có thông tin trong tài liệu → thừa nhận thẳng: "Tôi không có thông tin về vấn đề này trong tài liệu phong thủy của tôi"
3. Không bao giờ đưa ra lời khuyên dựa trên suy đoán
4. Luôn giải thích rõ CĂN CỨ của mỗi lời khuyên

FORMAT TRẢ LỜI:
- Sử dụng emoji phù hợp (🔮, 🏮, 🎋, 💰, 🏠)
- Phân đoạn rõ ràng với dấu xuống dòng
- Danh sách đánh số hoặc gạch đầu dòng
- Highlight thông tin quan trọng bằng chữ in hoa
- Kết thúc bằng lời khuyên thực tế

VÍ DỤ PHONG CÁCH:
"🔮 THEO LÝ THUYẾT NGŨ HÀNH TRONG SÁCH PHONG THỦY:

Mệnh Kim của bạn:
• Hướng tốt: Tây, Tây Bắc, Tây Nam
• Màu sắc may mắn: Trắng, Vàng, Kim loại
• Năm 2026 là năm Ất Tỵ (Mộc Thổ) → Kim được Thổ sinh → ĐẠI CÁT

Lời khuyên cụ thể:
1. Đặt bàn làm việc hướng Tây
2. Mặc trang phục màu trắng/vàng khi gặp đối tác
3. Tránh màu đỏ (Hỏa khắc Kim)

🏮 Nguồn: Lý Thuyết Ngũ Hành - Chương 3, Trang 45"

LƯU Ý QUAN TRỌNG:
- KHÔNG dùng markdown (**bold**, *italic*)
- KHÔNG tự bịa ra sách hoặc trang số
- LUÔN kiểm tra tài liệu trước khi trả lời
- Nếu không chắc chắn → THỪA NHẬN thẳng
`.trim()

/**
 * Upload PDF/Document to Gemini File API for RAG
 * 
 * @param file - File to upload (PDF, DOCX, TXT)
 * @param apiKey - Gemini API key
 * @returns File ID and metadata
 */
export async function uploadRAGDocument(
  file: File,
  apiKey: string
): Promise<RAGDocument> {
  // Step 1: Upload file to Gemini
  const formData = new FormData()
  formData.append('file', file)
  
  const uploadResponse = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
    {
      method: 'POST',
      body: formData
    }
  )
  
  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file to Gemini')
  }
  
  const uploadData = await uploadResponse.json()
  const fileId = uploadData.file.name // Format: files/{fileId}
  
  // Step 2: Wait for processing (files need time to be processed)
  let status = 'processing'
  let attempts = 0
  const maxAttempts = 30 // 30 seconds max
  
  while (status === 'processing' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const statusResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${fileId}?key=${apiKey}`
    )
    
    const statusData = await statusResponse.json()
    status = statusData.state
    attempts++
  }
  
  if (status !== 'ACTIVE') {
    throw new Error('File processing failed or timed out')
  }
  
  return {
    fileId,
    name: file.name,
    mimeType: file.type,
    uploadDate: new Date().toISOString(),
    status: 'active'
  }
}

/**
 * List all uploaded RAG documents
 */
export async function listRAGDocuments(apiKey: string): Promise<RAGDocument[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/files?key=${apiKey}`
  )
  
  if (!response.ok) {
    throw new Error('Failed to list files')
  }
  
  const data = await response.json()
  
  return (data.files || []).map((file: any) => ({
    fileId: file.name,
    name: file.displayName,
    mimeType: file.mimeType,
    uploadDate: file.createTime,
    status: file.state === 'ACTIVE' ? 'active' : 'inactive'
  }))
}

/**
 * Delete a RAG document
 */
export async function deleteRAGDocument(fileId: string, apiKey: string): Promise<void> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${fileId}?key=${apiKey}`,
    {
      method: 'DELETE'
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to delete file')
  }
}

/**
 * Format Gemini response for beautiful chat display
 * Converts markdown-like text to HTML with emojis and styling
 */
export function formatChatResponse(text: string): string {
  // Remove markdown formatting
  let formatted = text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold**
    .replace(/\*([^*]+)\*/g, '$1')     // Remove *italic*
    .replace(/`([^`]+)`/g, '$1')       // Remove `code`
  
  // Split into paragraphs
  const paragraphs = formatted.split('\n\n')
  
  let html = ''
  
  for (const para of paragraphs) {
    if (!para.trim()) continue
    
    // Check if it's a header (contains emoji at start)
    if (/^[🔮🏮🎋💰🏠🌟✨🎯⚠️📝💡]/.test(para.trim())) {
      html += `<div class="chat-header">${para.trim()}</div>`
    }
    // Check if it's a list
    else if (para.includes('\n•') || para.includes('\n-') || para.includes('\n1.')) {
      const lines = para.split('\n')
      const intro = lines[0]
      const items = lines.slice(1).filter(l => l.trim())
      
      html += `<div class="chat-section">`
      if (intro.trim()) {
        html += `<p class="chat-intro">${intro.trim()}</p>`
      }
      html += `<ul class="chat-list">`
      for (const item of items) {
        const cleaned = item.replace(/^[•\-\d\.]\s*/, '').trim()
        if (cleaned) {
          html += `<li>${cleaned}</li>`
        }
      }
      html += `</ul></div>`
    }
    // Regular paragraph
    else {
      // Highlight UPPERCASE words
      const highlighted = para.replace(/([A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]{3,})/g, 
        '<span class="chat-highlight">$1</span>')
      
      html += `<p class="chat-text">${highlighted}</p>`
    }
  }
  
  return html
}

/**
 * CSS styles for formatted chat (inject into page)
 */
export const CHAT_STYLES = `
.chat-header {
  font-size: 1.25rem;
  font-weight: 700;
  color: #7c3aed;
  margin: 1.5rem 0 1rem 0;
  padding: 0.75rem;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-left: 4px solid #7c3aed;
  border-radius: 0.5rem;
}

.chat-section {
  margin: 1rem 0;
}

.chat-intro {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.chat-list {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0;
}

.chat-list li {
  padding: 0.5rem 0 0.5rem 1.5rem;
  position: relative;
  color: #4b5563;
  line-height: 1.6;
}

.chat-list li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #7c3aed;
  font-weight: bold;
}

.chat-text {
  color: #374151;
  line-height: 1.8;
  margin: 0.75rem 0;
}

.chat-highlight {
  color: #7c3aed;
  font-weight: 700;
  background: #faf5ff;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.chat-response {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin: 1rem 0;
}
`.trim()
