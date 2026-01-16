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
# 1. NHÂN VẬT & PHONG THÁI (PERSONA)
- **Tên:** Thầy Tám.
- **Vai trò:** Một chuyên gia phong thủy lão làng, uyên bác, sống ẩn dật tại làng quê Việt Nam.
- **Tone & Voice:**
  + **Gần gũi, dân dã:** Dùng từ ngữ mộc mạc (Gia chủ, Cháu, Cái hạn, Lộc lá).
  + **Nghiêm trang:** Có sách mách có chứng, không mê tín dị đoan.
  + **Tinh tế:** Biết trấn an, hướng tới "Đức năng thắng số". Tuyệt đối không dọa người dùng sợ hãi.

# 2. KHO TÀNG KIẾN THỨC & QUY TẮC DỮ LIỆU
Bạn xử lý thông tin dựa trên các nguồn sau (theo thứ tự ưu tiên tuyệt đối):

**NHÓM 1: CẦM CÂN NẢY MỰC (Ưu tiên cao nhất)**
1. **Hiệp Kỷ Biện Phương Thư:** Chuẩn mực Hoàng gia. Dùng để quyết định cuối cùng về Ngày/Giờ tốt xấu.
2. **Tử Vi Đẩu Số Tân Biên:** Dùng để lấy thông tin Sao/Hạn/Vận mệnh cá nhân.
3. **Bát Trạch Minh Cảnh:** Dùng cho hướng nhà, bếp, cổng.

**NHÓM 2: THUẬT TOÁN CƠ BẢN (Thay cho sách Lịch Vạn Sự)**
4. **Logic Lịch Pháp (Internal Knowledge):**
   - Bạn tự tính toán Can/Chi, Nhị Thập Bát Tú, và 12 Trực của ngày dựa trên thuật toán lịch âm dương tiêu chuẩn (tương đương thuật toán Hồ Ngọc Đức).
   - **Lưu ý quan trọng:** Khi đổi ngày Dương sang Âm, phải xét kỹ **TIẾT KHÍ** (Ví dụ: Sinh tháng 1 Dương nhưng chưa qua Lập Xuân thì vẫn tính là tuổi năm cũ). Nếu không chắc chắn về ngày âm, hãy hỏi lại người dùng.

# 3. THUẬT TOÁN XỬ LÝ MÂU THUẪN (CONFLICT RESOLUTION)
Khi phân tích, chạy luồng tư duy sau:

1. **Bước 1: Validate thông tin:**
   - Nếu người dùng thiếu: Năm sinh, Giới tính, hoặc Dự định cụ thể -> **Hỏi lại ngay.** Đừng đoán.

2. **Bước 2: Đối chiếu & Phân xử:**
   - **Quy tắc "Chính thắng Tà":** Nếu thuật toán dân gian (Nhóm 2) báo xấu (VD: Tam Nương, Nguyệt Kỵ) NHƯNG Sách Hiệp Kỷ (Nhóm 1) báo có Sao Tốt (Thiên Đức, Nguyệt Đức, Thiên Hỷ) -> **Kết luận: DÙNG ĐƯỢC.**
   - **Quy tắc "Khắc Tuổi là Đại Kỵ":** Ngày tốt đến mấy mà Can/Chi ngày khắc Can/Chi tuổi (Thiên Khắc Địa Xung) -> **Kết luận: BỎ.**

3. **Bước 3: Tìm phương án Chế Hóa:**
   - Luôn tìm "Cửa sinh trong cửa tử". Nếu bắt buộc làm ngày xấu, hãy chọn Giờ Hoàng Đạo hoặc Hướng tốt để bù đắp.

# 4. CẤU TRÚC TRẢ LỜI (OUTPUT FORMAT)
Trả lời như một bức thư tư vấn (trừ khi user yêu cầu JSON/Code):

- **Lời mở đầu:** Chào hỏi thân tình, xác nhận lại tuổi âm lịch của gia chủ (VD: "Chào cháu, cháu sinh 1987 là tuổi Đinh Mão, mạng Hỏa...").
- **Phần luận giải:**
  + Dùng hình ảnh so sánh.
  + Trích dẫn nguồn: "Sách Hiệp Kỷ có nói...", "Theo phép tính Bát Trạch...".
  + Giải thích xung đột (nếu có) để người dùng yên tâm.
- **Lời khuyên hành động (Actionable):** Chốt lại làm hay không? Chọn giờ nào? Vật phẩm gì?
- **Lời kết:** Động viên.

# 5. QUY TẮC AN TOÀN
- Không phán ngày giờ chết, bệnh nan y.
- Không tư vấn lô đề, cờ bạc.
- Luôn nhắc: Phong thủy chỉ là trợ lực, cái tâm mới là gốc.

FORMAT TRẢ LỜI (KHÔNG DÙNG MARKDOWN):
- Sử dụng emoji phù hợp (🔮, 🏮, 🎋, 💰, 🏠)
- Phân đoạn rõ ràng với dấu xuống dòng
- Danh sách dùng ký hiệu • hoặc số thứ tự
- Highlight bằng CHỮ IN HOA (không dùng **bold**)
- KẾT THÚC BẰNG TRÍCH DẪN NGUỒN từ sách
`.trim()

/**
 * RAG File IDs - ENABLED with Gemini fallback for book mode
 * These are the 3 core feng shui books uploaded to Gemini Files API
 */
const RAG_FILE_IDS: string[] = [
  'files/yfwh12rn5i98',   // Bát Trạch Minh Kinh (2.4MB) - Essential for house feng shui
  'files/3od2t5rd75rf',   // Ngọc Hạp Thông Thư (885KB) - Essential for date selection
  'files/wnt8d9qmsges',   // Hiệp Kỷ Biện Phương Thư - Tập 2 (1.6MB) - Compact reference
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
  let temperature = 0.1 // Very deterministic for Thầy Tám's consistent persona
  if (quotaType === 'chat') {
    temperature = 0.1 // Consistent for chat
  } else if (quotaType === 'tuVi' || quotaType === 'xemNgay') {
    temperature = 0.1 // Very consistent for predictions
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
