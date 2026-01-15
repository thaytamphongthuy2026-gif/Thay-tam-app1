/**
 * Enhanced Gemini API Call with RAG Support
 * 
 * HOW TO USE RAG:
 * 
 * 1. Upload documents in Google AI Studio:
 *    - Go to: https://aistudio.google.com/app/files
 *    - Click "Upload file"
 *    - Upload your PDF/DOCX feng shui books
 *    - Wait for processing (usually 1-2 minutes)
 *    - Copy the File ID (format: files/xxxxx)
 * 
 * 2. Store File IDs in Cloudflare environment:
 *    - Add to wrangler.jsonc:
 *      ```
 *      "vars": {
 *        "RAG_FILE_IDS": "files/abc123,files/def456,files/ghi789"
 *      }
 *      ```
 *    - Or use wrangler secret:
 *      ```
 *      wrangler secret put RAG_FILE_IDS
 *      ```
 * 
 * 3. The API will automatically include these files in every request
 * 
 * PERFORMANCE TIPS:
 * - Keep files under 50MB each for fast loading
 * - Use text-based PDFs (not scanned images)
 * - Maximum 10 files per request
 * - Files are cached by Gemini, so no performance hit after first load
 */

import { Env } from '../_lib/database'

const THAY_TAM_SYSTEM_INSTRUCTION = `
Bạn là Thầy Tám - chuyên gia phong thủy uy tín với 20 năm kinh nghiệm.

TÍNH CÁCH & PHONG CÁCH:
- Cá tính mạnh, tự tin, quyết đoán
- Nói chuyện thẳng thắn, rõ ràng, dễ hiểu
- Luôn dựa vào kiến thức phong thủy cổ truyền
- KHÔNG bao giờ suy diễn hoặc tự nghĩ
- KHÔNG bao giờ nói "có thể", "có lẽ", "theo ý kiến cá nhân"
- CHỈ trả lời dựa trên kiến thức được cung cấp trong tài liệu

NGUYÊN TẮC TRẢ LỜI:
1. LUÔN kiểm tra tài liệu được attach trước khi trả lời
2. Trích dẫn trực tiếp từ sách phong thủy
3. Nếu không có thông tin → thừa nhận thẳng: "Tôi không có thông tin về vấn đề này trong tài liệu phong thủy của tôi"
4. Không bao giờ đưa ra lời khuyên dựa trên suy đoán
5. Luôn giải thích rõ CĂN CỨ của mỗi lời khuyên

FORMAT TRẢ LỜI (KHÔNG DÙNG MARKDOWN):
- Sử dụng emoji phù hợp (🔮, 🏮, 🎋, 💰, 🏠)
- Phân đoạn rõ ràng với dấu xuống dòng
- Danh sách dùng ký hiệu • hoặc số thứ tự
- Highlight bằng CHỮ IN HOA (không dùng **bold**)
- Kết thúc bằng lời khuyên thực tế

VÍ DỤ ĐÚNG:
"🔮 THEO LÝ THUYẾT NGŨ HÀNH

Mệnh Kim của bạn:
• Hướng tốt: Tây, Tây Bắc, Tây Nam
• Màu sắc may mắn: Trắng, Vàng, Kim loại
• Năm 2026 là năm Ất Tỵ → Kim được Thổ sinh → ĐẠI CÁT

Lời khuyên cụ thể:
1. Đặt bàn làm việc hướng Tây
2. Mặc trang phục màu trắng/vàng
3. Tránh màu đỏ (Hỏa khắc Kim)

🏮 Căn cứ: Tài liệu Ngũ Hành Tương Sinh Tương Khắc"

VÍ DỤ SAI (KHÔNG LÀM):
"**Theo tôi nghĩ** thì bạn *có thể* thử..."
"Tôi không chắc lắm nhưng..."
"Theo kinh nghiệm cá nhân..."

LƯU Ý:
- TUYỆT ĐỐI không dùng markdown
- LUÔN dựa vào tài liệu được cung cấp
- Nếu không chắc chắn → THỪA NHẬN thẳng
`.trim()

/**
 * RAG File IDs - Hardcoded for production
 * 6 Phong Thủy books (~70MB total knowledge base)
 */
const RAG_FILE_IDS = [
  'files/yfwh12rn5i98',   // Bát Trạch Minh Kinh (2.4MB)
  'files/b1ixvmtyrkdv',   // Hiệp Kỷ Biện Phương Thư - Tập 1 (38MB)
  'files/wnt8d9qmsges',   // Hiệp Kỷ Biện Phương Thư - Tập 2 (1.6MB)
  'files/3od2t5rd75rf',   // Ngọc Hạp Thông Thư (885KB)
  'files/rg2t1hnbk7v6',   // Tăng San Bốc Dịch (29MB)
  'files/hbgvit2weaka',   // Tử Vi Đẩu Số Tân Biện (394KB)
]

/**
 * Build Gemini API request with RAG support
 */
export function buildGeminiRequestWithRAG(
  prompt: string,
  env: Env,
  quotaType: 'chat' | 'xemNgay' | 'tuVi'
): any {
  // Use hardcoded RAG_FILE_IDS (fallback to env if needed)
  const ragFileIds = RAG_FILE_IDS.length > 0 ? RAG_FILE_IDS : 
    (env.RAG_FILE_IDS ? env.RAG_FILE_IDS.split(',').map(id => id.trim()) : [])
  
  // Build contents array
  const contents: any[] = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ]
  
  // Add file references if available
  if (ragFileIds.length > 0) {
    // Add files as separate parts in the user message
    for (const fileId of ragFileIds) {
      contents[0].parts.push({
        fileData: {
          mimeType: 'application/pdf', // or detect from file
          fileUri: `https://generativelanguage.googleapis.com/v1beta/${fileId}`
        }
      })
    }
  }
  
  // Adjust temperature based on quotaType
  let temperature = 0.7
  if (quotaType === 'chat') {
    temperature = 0.5 // More consistent for chat
  } else if (quotaType === 'tuVi' || quotaType === 'xemNgay') {
    temperature = 0.3 // Very consistent for predictions
  }
  
  return {
    systemInstruction: {
      parts: [
        {
          text: THAY_TAM_SYSTEM_INSTRUCTION
        }
      ]
    },
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: 3072, // Increased for detailed responses
      topK: 40,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ]
  }
}

/**
 * Format response for beautiful chat display (no markdown)
 */
export function formatChatResponse(text: string): string {
  // Already formatted by Gemini based on system instruction
  // Just ensure no markdown leaked through
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*([^*]+)\*/g, '$1')      // Remove *italic*
    .replace(/`([^`]+)`/g, '$1')        // Remove `code`
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove [links](url)
}
