export const PROMPTS = {
  chat: (question: string) => `${question}

YÊU CẦU TRẢ LỜI:
- ĐI THẲNG VÀO VẤN ĐỀ - KHÔNG chào hỏi dài dòng
- Ngắn gọn, súc tích (100-200 từ)
- Chỉ nêu điểm chính, lời khuyên thực tế
- CHỈ trích dẫn sách khi khách hỏi cụ thể về nguồn gốc
- Giọng điệu tự nhiên, xưng "Thầy" với khách hàng

Format:
💡 [Trả lời trực tiếp ngay - 2-3 câu]

• [Lời khuyên 1]
• [Lời khuyên 2]

🏮 [Kết luận ngắn gọn 1 câu]`,

  xemNgay: (date: string, purpose: string) => `Hãy xem ngày ${date} có phù hợp để ${purpose} không?

Phân tích theo:
- Can Chi của ngày
- Sao tốt/xấu trong ngày
- Hướng tốt/xấu
- Giờ hoàng đạo
- Những điều cần tránh

Kết luận cuối cùng: NÊN hoặc KHÔNG NÊN ${purpose} vào ngày này.

Trả lời bằng tiếng Việt, rõ ràng và dễ hiểu.`,

  tuVi: (birthDate: string, birthTime: string, gender: string) => `Xem tử vi năm 2026 cho người:
- Ngày sinh: ${birthDate}
- Giờ sinh: ${birthTime}
- Giới tính: ${gender}

Hãy phân tích theo các mục sau:

1. CUNG MỆNH: Xác định cung mệnh và ý nghĩa
2. VẬN NĂM 2026: Tổng quan vận may năm nay
3. TÀI LỘC: Công việc kinh doanh, tiền bạc
4. SỰ NGHIỆP: Thăng tiến, phát triển
5. TÌNH DUYÊN: Tình yêu, hôn nhân, gia đình
6. SỨC KHỎE: Sức khỏe thể chất và tinh thần
7. LỜI KHUYÊN: Những điều nên làm và nên tránh trong năm

Trả lời bằng tiếng Việt, chi tiết nhưng dễ hiểu. Mỗi phần khoảng 50-100 từ.`,

  lichPhongThuy: (month: number, year: number) => `Hãy cung cấp thông tin lịch phong thủy cho tháng ${month} năm ${year}:

1. Các ngày tốt trong tháng (liệt kê 5-7 ngày)
2. Các ngày xấu cần tránh (liệt kê 3-5 ngày)
3. Những việc nên làm trong tháng này
4. Những việc nên tránh trong tháng này
5. Phương vị tốt của tháng
6. Màu sắc may mắn của tháng

Trả lời bằng tiếng Việt, rõ ràng và thực tế.`
}
