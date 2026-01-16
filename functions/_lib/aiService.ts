/**
 * AI Service Abstraction Layer
 * Supports multiple AI providers with auto-fallback
 * Primary: GROQ (fastest, FREE)
 * Backup: DeepSeek via OpenRouter (smartest, FREE unlimited)
 */

import type { Env } from './database'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIStreamOptions {
  messages: AIMessage[]
  temperature?: number
  maxTokens?: number
  onChunk?: (chunk: string) => void
}

/**
 * Call GROQ API (Primary - Fastest)
 * Model: llama-3.1-70b-versatile
 * Speed: 500+ tokens/second
 * Rate: 14,400 requests/day FREE
 */
export async function callGroq(options: AIStreamOptions, env: Env): Promise<Response> {
  const { messages, temperature = 0.7, maxTokens = 2048 } = options

  console.log('🚀 Calling GROQ API (llama-3.3-70b-versatile)...')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // Best for Vietnamese (newer!)
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true, // Enable streaming
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ GROQ API Error:', response.status, error)
    throw new Error(`GROQ API failed: ${response.status}`)
  }

  console.log('✅ GROQ API streaming started')
  return response
}

/**
 * Call DeepSeek via OpenRouter (Backup - Smartest)
 * Model: deepseek-chat
 * Speed: 200-300 tokens/second
 * Rate: Unlimited FREE
 */
export async function callDeepSeek(options: AIStreamOptions, env: Env): Promise<Response> {
  const { messages, temperature = 0.7, maxTokens = 2048 } = options

  console.log('🧠 Calling DeepSeek via OpenRouter...')

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://thaytamphongthuy.com', // Required by OpenRouter
      'X-Title': 'Thầy Tám Phong Thủy', // Optional but nice
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat', // FREE model, excellent quality
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ DeepSeek API Error:', response.status, error)
    throw new Error(`DeepSeek API failed: ${response.status}`)
  }

  console.log('✅ DeepSeek API streaming started')
  return response
}

/**
 * Main AI Service with Auto-Fallback
 * Try GROQ first (fastest) → fallback to DeepSeek (smartest)
 */
export async function callAI(options: AIStreamOptions, env: Env): Promise<Response> {
  try {
    // Primary: Try GROQ (90% success, fastest)
    return await callGroq(options, env)
  } catch (groqError) {
    console.warn('⚠️ GROQ failed, falling back to DeepSeek:', groqError)
    
    try {
      // Backup: Try DeepSeek (99% success)
      return await callDeepSeek(options, env)
    } catch (deepseekError) {
      console.error('❌ All AI providers failed')
      throw new Error('Không thể kết nối với AI. Vui lòng thử lại sau.')
    }
  }
}

/**
 * Build system prompt for Thầy Tám (ENHANCED VERSION WITH RAG RULES)
 */
export function buildSystemPrompt(quotaType: 'chat' | 'xemNgay' | 'tuVi'): string {
  const basePrompt = `# 1. NHÂN VẬT & PHONG THÁI (PERSONA)
- **Tên:** Thầy Tám.
- **Vai trò:** Một chuyên gia phong thủy lão làng, uyên bác, sống ẩn dật tại làng quê Việt Nam.
- **XƯNG HÔ BẮT BUỘC:**
  + **BẠN XƯNG:** "Thầy" (KHÔNG BAO GIỜ xưng "tôi", "em", "cháu", "mình")
  + **GỌI NGƯỜI DÙNG:** "Gia chủ" hoặc "Bác" hoặc "Cháu" (tùy tuổi)
  + **VÍ DỤ ĐÚNG:** "Thầy xin trả lời gia chủ", "Thầy khuyên bác", "Thầy hy vọng cháu"
  + **VÍ DỤ SAI:** ❌ "Cháu xin trả lời", ❌ "Tôi nghĩ rằng", ❌ "Em hy vọng"
- **Tone & Voice:**
  + **Gần gũi, dân dã:** Dùng từ ngữ mộc mạc (Gia chủ, Cái hạn, Lộc lá).
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

- **Lời mở đầu:** Chào hỏi thân tình, xác nhận lại tuổi âm lịch của gia chủ (VD: "Chào gia chủ, Thầy xem gia chủ sinh 1987 là tuổi Đinh Mão, mạng Hỏa...").
- **Phần luận giải:**
  + Dùng hình ảnh so sánh.
  + Trích dẫn nguồn: "Sách Hiệp Kỷ có nói...", "Theo phép tính Bát Trạch...".
  + Giải thích xung đột (nếu có) để người dùng yên tâm.
- **Lời khuyên hành động (Actionable):** Chốt lại làm hay không? Chọn giờ nào? Vật phẩm gì?
- **Lời kết:** Động viên.

**VÍ DỤ TRẢ LỜI MẪU (BẮT BUỘC THEO):**

User: "Hướng nào tốt để đặt bàn làm việc?"

Response:
🔮 THẦY XIN TRẢ LỜI GIA CHỦ

Gia chủ hỏi về hướng đặt bàn làm việc, đây là việc quan trọng ảnh hưởng đến TÀI LỘC và SỰ NGHIỆP.

💡 THẦY KHUYÊN GIA CHỦ:

• Hướng CÁT: Đông Nam, Đông (gặp Mộc, sinh Hỏa mệnh)
• Ngồi quay lưng vào tường, mặt nhìn cửa
• Tránh đặt dưới xà ngang hoặc đối diện toilet

🏮 TÓM LẠI:

Gia chủ chọn hướng ĐÔNG NAM để đặt bàn, Thầy tin TÀI LỘC sẽ THÔNG THOÁNG, công việc HANH THÔNG!

Chúc gia chủ VẠN SỰ NHƯ Ý! 🎋

# 5. QUY TẮC AN TOÀN
- Không phán ngày giờ chết, bệnh nan y.
- Không tư vấn lô đề, cờ bạc.
- Luôn nhắc: Phong thủy chỉ là trợ lực, cái tâm mới là gốc.

FORMAT TRẢ LỜI (KHÔNG DÙNG MARKDOWN):
- Sử dụng emoji phù hợp (🔮, 🏮, 🎋, 💰, 🏠)
- Phân đoạn rõ ràng với dấu xuống dòng
- Danh sách dùng ký hiệu • hoặc số thứ tự
- Highlight bằng CHỮ IN HOA (không dùng **bold**)
- KẾT THÚC BẰNG TRÍCH DẪN NGUỒN từ sách`

  if (quotaType === 'xemNgay') {
    return basePrompt + `

# 6. CHUYÊN MÔN: XEM NGÀY TỐT
- Phân tích Can Chi, Ngũ Hành dựa trên Hiệp Kỷ Biện Phương Thư và Ngọc Hạp Thông Thư
- Đề xuất ngày tốt cho khai trương, cưới hỏi, xây nhà, di chuyển, an táng
- Xét Sao Tốt/Xấu (Thiên Đức, Nguyệt Đức, Tam Nương, Dương Công)
- Gợi ý hướng tốt, giờ Hoàng Đạo, màu sắc phù hợp theo mệnh
- Lưu ý điều kiêng kỵ và cách hóa giải`
  }

  if (quotaType === 'tuVi') {
    return basePrompt + `

# 6. CHUYÊN MÔN: TỬ VI ĐẨU SỐ
- Phân tích lá số tử vi theo năm sinh dựa trên Tử Vi Đẩu Số Tân Biên
- Xét Mệnh Cung, Thân Cung, 12 Cung (Phúc Đức, Tài Bạch, Quan Lộc, Thiên Di...)
- Dự đoán vận hạn theo năm (Đại Vận, Tiểu Vận), sự nghiệp, tài lộc, tình duyên, sức khỏe
- Tư vấn hướng đi phù hợp với Mệnh (Ngũ Hành, Sao Tốt/Xấu trong Cung)
- Gợi ý cách hóa giải vận xui (hướng Cát, màu sắc, vật phẩm phong thủy)
- Tăng cường vận may qua Phong Thủy Dương Trạch (nhà ở) và Phong Thủy Nội Tâm (tu dưỡng đức hạnh)`
  }

  return basePrompt + `

# 6. CHUYÊN MÔN: TƯ VẤN PHONG THỦY TỔNG QUÁT
- Phong thủy Dương Trạch (nhà ở, văn phòng) theo Bát Trạch Minh Cảnh
- Tư vấn hướng nhà, hướng cổng, vị trí bếp, giường ngủ, bàn làm việc
- Bố trí nội thất hợp mệnh, hóa giải Sát Khí (góc nhọn, xà ngang, đường thẳng xung)
- Giải đáp thắc mắc về Ngũ Hành, Sinh Khắc, Màu sắc, Vật phẩm phong thủy
- Lời khuyên cho năm 2026 (Bính Ngọ - năm Hỏa Mã): Hướng Cát, Sao Tốt, Việc nên/không nên làm`
}

/**
 * Fix persona addressing issues in real-time
 * Handle cases with emojis and various patterns
 */
function fixPersonaAddressing(text: string): string {
  let fixed = text
  
  // Fix "Cháu xin" with any prefix (including emojis)
  fixed = fixed.replace(/([🔮🏮🎋💰🏠🌟✨🎯⚠️📝💡]\s*)?Cháu xin trả lời/g, '$1Thầy xin trả lời')
  fixed = fixed.replace(/Cháu xin/g, 'Thầy xin')
  
  // Fix "Cháu" at start of sentences
  fixed = fixed.replace(/^Cháu\s+/gm, 'Thầy ')
  fixed = fixed.replace(/\.\s+Cháu\s+/g, '. Thầy ')
  fixed = fixed.replace(/\n\s*Cháu\s+/g, '\nThầy ')
  
  // Fix specific verbs with "Cháu"
  fixed = fixed.replace(/\bCháu hy vọng\b/g, 'Thầy hy vọng')
  fixed = fixed.replace(/\bCháu khuyên\b/g, 'Thầy khuyên')
  fixed = fixed.replace(/\bCháu tin\b/g, 'Thầy tin')
  fixed = fixed.replace(/\bCháu nghĩ\b/g, 'Thầy nghĩ')
  fixed = fixed.replace(/\bCháu sẽ\b/g, 'Thầy sẽ')
  fixed = fixed.replace(/\bCháu thấy\b/g, 'Thầy thấy')
  fixed = fixed.replace(/\bCháu muốn\b/g, 'Thầy muốn')
  fixed = fixed.replace(/\bCháu có thể\b/g, 'Thầy có thể')
  
  // Fix other wrong pronouns
  fixed = fixed.replace(/\btôi khuyên\b/gi, 'Thầy khuyên')
  fixed = fixed.replace(/\btôi nghĩ\b/gi, 'Thầy nghĩ')
  fixed = fixed.replace(/\btôi tin\b/gi, 'Thầy tin')
  fixed = fixed.replace(/\bem nghĩ\b/gi, 'Thầy nghĩ')
  fixed = fixed.replace(/\bmình nghĩ\b/gi, 'Thầy nghĩ')
  
  return fixed
}

/**
 * Transform Groq/OpenRouter streaming response to our format
 * Both use OpenAI-compatible format
 */
export async function transformStreamingResponse(
  aiResponse: Response,
  writable: WritableStream
): Promise<void> {
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  try {
    const reader = aiResponse.body?.getReader()
    if (!reader) {
      await writer.write(encoder.encode('data: {"error": "No response body"}\n\n'))
      await writer.close()
      return
    }

    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim() || line.trim() === 'data: [DONE]') continue
        
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6) // Remove "data: " prefix
            const data = JSON.parse(jsonStr)
            
            // Extract content from OpenAI format
            const content = data.choices?.[0]?.delta?.content
            
            if (content) {
              // Fix persona addressing before sending
              const fixedContent = fixPersonaAddressing(content)
              
              // Send in our format
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ chunk: fixedContent })}\n\n`)
              )
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim() && buffer.trim() !== 'data: [DONE]') {
      try {
        const jsonStr = buffer.trim().startsWith('data: ') 
          ? buffer.trim().slice(6) 
          : buffer.trim()
        const data = JSON.parse(jsonStr)
        const content = data.choices?.[0]?.delta?.content
        
        if (content) {
          const fixedContent = fixPersonaAddressing(content)
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ chunk: fixedContent })}\n\n`)
          )
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }

    await writer.write(encoder.encode('data: [DONE]\n\n'))
    await writer.close()
  } catch (error) {
    console.error('❌ Stream transformation error:', error)
    await writer.write(encoder.encode(`data: {"error": "${error}"}\n\n`))
    await writer.close()
  }
}
