# 🔮 RAG Setup Guide - Thầy Tám Phong Thủy

**Retrieval-Augmented Generation (RAG)** cho phép Thầy Tám trả lời dựa trên kiến thức phong thủy cổ truyền từ sách, tài liệu được upload.

---

## 📚 Tại sao cần RAG?

**Không có RAG:**
- AI tự suy diễn, có thể sai
- Không có căn cứ rõ ràng
- Thiếu tính nhất quán

**Có RAG:**
- ✅ Luôn dựa trên kiến thức từ sách phong thủy
- ✅ Trích dẫn nguồn chính xác
- ✅ Cá tính mạnh, tự tin, quyết đoán
- ✅ KHÔNG bao giờ suy diễn hoặc đoán mò

---

## 🚀 Cách Setup RAG (3 Bước Đơn Giản)

### **Bước 1: Upload tài liệu lên Google AI Studio**

1. **Truy cập Google AI Studio Files:**
   ```
   https://aistudio.google.com/app/files
   ```

2. **Upload files PDF/DOCX:**
   - Click nút **"Upload file"**
   - Chọn sách phong thủy (PDF, DOCX, TXT)
   - Tối đa 50MB mỗi file
   - Số lượng file: không giới hạn (khuyến nghị 5-10 files)

3. **Đợi xử lý (1-2 phút):**
   - Status sẽ hiển thị "Processing..."
   - Khi xong sẽ chuyển thành "Active"

4. **Copy File ID:**
   - Click vào file → Copy File ID
   - Format: `files/abc123xyz456...`
   - Lưu lại tất cả File IDs

**Ví dụ File IDs:**
```
files/abc123xyz456def789ghi012
files/jkl345mno678pqr901stu234
files/vwx567yza890bcd123efg456
```

---

### **Bước 2: Cấu hình File IDs trong Cloudflare**

#### **Option A: Development (Local)**

Thêm vào file `.dev.vars`:

```bash
RAG_FILE_IDS=files/abc123,files/def456,files/ghi789
```

#### **Option B: Production (Cloudflare Pages)**

**Cách 1: Dùng wrangler CLI**

```bash
# Cấu hình production environment variable
wrangler pages secret put RAG_FILE_IDS

# Nhập value khi được hỏi:
# files/abc123,files/def456,files/ghi789
```

**Cách 2: Dùng Cloudflare Dashboard**

1. Truy cập: https://dash.cloudflare.com
2. Chọn **Pages** → **thaytam-phongthuy-v2**
3. Tab **Settings** → **Environment variables**
4. Add variable:
   - Name: `RAG_FILE_IDS`
   - Value: `files/abc123,files/def456,files/ghi789`
   - Environment: **Production**
5. Click **Save**

---

### **Bước 3: Deploy và Test**

**Deploy lên production:**
```bash
cd /home/user/webapp
npm run deploy
```

**Test RAG có hoạt động:**
1. Truy cập: https://your-site.pages.dev/chat
2. Hỏi câu hỏi có trong sách phong thủy đã upload
3. Thầy Tám sẽ trả lời dựa trên kiến thức từ sách

**Ví dụ câu hỏi test:**
```
"Mệnh Kim năm 2026 có tốt không?"
"Hướng nào tốt cho tuổi Tý?"
"Màu sắc may mắn của mệnh Thủy?"
```

---

## 🎯 System Instruction - Tính Cách Thầy Tám

Code đã được cấu hình với system instruction để Thầy Tám có tính cách chuẩn:

```typescript
// functions/_lib/ragHelper.ts

const THAY_TAM_SYSTEM_INSTRUCTION = `
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
2. Nếu không có thông tin → thừa nhận: "Tôi không có thông tin về vấn đề này"
3. Không đưa ra lời khuyên dựa trên suy đoán
4. Luôn giải thích rõ CĂN CỨ của mỗi lời khuyên

FORMAT TRẢ LỜI (KHÔNG DÙNG MARKDOWN):
- Sử dụng emoji phù hợp (🔮, 🏮, 🎋, 💰, 🏠)
- Phân đoạn rõ ràng
- Danh sách dùng • hoặc số thứ tự
- Highlight bằng CHỮ IN HOA
`
```

---

## 💡 Chat Response Formatting

Code đã được cấu hình để format đẹp (KHÔNG dùng markdown):

### **Trước (với markdown):**
```
**Mệnh Kim** của bạn có *3 hướng tốt*:
- Tây
- Tây Bắc
```

### **Sau (format đẹp):**
```
🔮 MỆNH KIM CỦA BẠN

Các hướng tốt:
▸ Tây - Hướng chính, đại cát
▸ Tây Bắc - Hợp sự nghiệp
▸ Tây Nam - Hợp tài lộc

🏮 Căn cứ: Lý Thuyết Ngũ Hành
```

**Features:**
- ✅ Emoji headers với background màu
- ✅ Bullets với icon ▸
- ✅ Highlight CHỮ IN HOA với màu tím
- ✅ Line spacing đẹp, dễ đọc
- ✅ Không có markdown syntax

---

## 📊 Performance Tips

### **1. Chọn Files Tốt**
- ✅ **DO**: PDF text-based (có thể copy text)
- ✅ **DO**: DOCX với nội dung rõ ràng
- ❌ **DON'T**: PDF scanned (ảnh chụp)
- ❌ **DON'T**: Files > 50MB

### **2. Số Lượng Files**
- **Khuyến nghị**: 5-10 files
- **Tối đa**: Không giới hạn (nhưng càng nhiều càng chậm)
- **Ví dụ tốt**:
  ```
  1. ly-thuyet-ngu-hanh.pdf (2MB)
  2. phong-thuy-nha-o.pdf (3MB)
  3. tu-vi-12-con-giap.pdf (2.5MB)
  4. mau-sac-may-man.pdf (1.5MB)
  5. huong-nha-tot.pdf (2MB)
  ```

### **3. Cache Performance**
- Gemini tự động cache files sau lần đầu
- Lần 2 trở đi: KHÔNG tốn thời gian load files
- Response time: ~1-3 giây (rất nhanh!)

### **4. Token Limits**
- Max output: 3072 tokens (~2000 chữ)
- Context window: 2 triệu tokens (rất lớn!)
- Đủ cho 10-20 cuốn sách phong thủy

---

## 🔍 Verify RAG Đang Hoạt Động

### **Test 1: Check Environment Variable**

```bash
# Local
cat .dev.vars | grep RAG_FILE_IDS

# Production (via wrangler)
wrangler pages secret list
```

### **Test 2: Check API Response**

Sau khi call API, check metadata:
```json
{
  "success": true,
  "result": "...",
  "metadata": {
    "ragEnabled": true,  // ← Phải là true
    "model": "gemini-3-flash-preview"
  }
}
```

### **Test 3: Ask Specific Question**

Hỏi câu hỏi CHỈ có trong sách bạn upload:
```
"Theo sách Lý Thuyết Ngũ Hành trang 45, 
 mệnh Kim năm 2026 có tốt không?"
```

Nếu Thầy Tám trả lời chính xác từ sách → RAG hoạt động! ✅

---

## 🛠️ Troubleshooting

### **Problem 1: RAG không hoạt động**

**Triệu chứng:**
- Thầy Tám trả lời sai hoặc không dựa vào sách

**Giải pháp:**
1. Check `RAG_FILE_IDS` có đúng không:
   ```bash
   wrangler pages secret list
   ```

2. Check files có status "Active":
   ```
   https://aistudio.google.com/app/files
   ```

3. Redeploy:
   ```bash
   npm run deploy
   ```

### **Problem 2: Response chậm (>10 giây)**

**Nguyên nhân:**
- Quá nhiều files (>20 files)
- Files quá lớn (>50MB each)

**Giải pháp:**
- Giảm xuống 5-10 files
- Nén files xuống <10MB
- Tách files lớn thành nhiều files nhỏ

### **Problem 3: "File not found" error**

**Nguyên nhân:**
- File ID sai
- File đã bị xóa trong AI Studio

**Giải pháp:**
1. Re-check File ID trong AI Studio
2. Upload lại file nếu cần
3. Update `RAG_FILE_IDS`

---

## 📝 Example: Full Workflow

### **Scenario: Thêm sách "Phong Thủy Nhà Ở 2026"**

**Step 1: Upload**
```
1. Go to: https://aistudio.google.com/app/files
2. Upload: phong-thuy-nha-o-2026.pdf (5MB)
3. Wait for processing...
4. Copy File ID: files/xyz789abc123
```

**Step 2: Update ENV**
```bash
# Existing: files/abc123,files/def456
# New: files/abc123,files/def456,files/xyz789abc123

wrangler pages secret put RAG_FILE_IDS
# Enter: files/abc123,files/def456,files/xyz789abc123
```

**Step 3: Deploy**
```bash
npm run deploy
```

**Step 4: Test**
```
User: "Hướng nhà tốt năm 2026?"

Thầy Tám: 
"🏠 HƯỚNG NHÀ TỐT NĂM 2026

Theo sách Phong Thủy Nhà Ở 2026:

Các hướng đại cát:
▸ Đông Nam - Ngôi sao Chính Tài
▸ Tây Bắc - Ngôi sao Văn Xương
▸ Bắc - Ngôi sao Chính Quan

Nên tránh:
▸ Tây Nam - Sao Nhị Hắc (bệnh tật)

🏮 Căn cứ: Phong Thủy Nhà Ở 2026, Chương 3"
```

✅ **Success!** RAG đang hoạt động hoàn hảo!

---

## 🎓 Best Practices

### **1. Cấu trúc Files**
Tổ chức theo chủ đề:
```
files/ngu-hanh-tong-quan.pdf        (Lý thuyết chung)
files/phong-thuy-nha-o.pdf          (Nhà ở)
files/tu-vi-12-con-giap.pdf         (Tử vi)
files/xem-ngay-tot.pdf              (Chọn ngày)
files/mau-sac-may-man.pdf           (Màu sắc)
```

### **2. Update Định Kỳ**
- Thêm sách mới mỗi năm
- Xóa sách cũ không còn chuẩn
- Keep 5-10 files chất lượng cao

### **3. Monitor Performance**
```bash
# Check response time in logs
wrangler pages deployment tail

# Look for:
# ✅ processingTime < 3000ms (good)
# ⚠️ processingTime > 5000ms (slow, reduce files)
```

### **4. Security**
- KHÔNG share File IDs publicly
- File IDs chỉ work với API key của bạn
- An toàn khi lưu trong Cloudflare ENV

---

## ✅ Checklist: RAG Đã Setup Đúng?

- [ ] Upload files lên Google AI Studio
- [ ] Copy tất cả File IDs
- [ ] Add `RAG_FILE_IDS` vào Cloudflare ENV
- [ ] Deploy lên production
- [ ] Test với câu hỏi có trong sách
- [ ] Verify `ragEnabled: true` in response
- [ ] Response time < 3 seconds
- [ ] Thầy Tám trả lời dựa vào sách (không suy diễn)

---

## 🚀 Next Steps

1. **Upload 5-10 cuốn sách phong thủy chất lượng**
2. **Cấu hình RAG_FILE_IDS**
3. **Deploy và test kỹ**
4. **Monitor user feedback**
5. **Tiếp tục thêm kiến thức theo thời gian**

---

**RAG đã sẵn sàng! Thầy Tám giờ trả lời dựa trên kiến thức cổ truyền, cá tính mạnh, logic khoa học! 🔮**

---

*Guide Version: 1.0*  
*Last Updated: 15/01/2026*
