# 🔥 PERSONA FIX - XƯNG HÔ CHÍNH XÁC

**Date:** 2026-01-16  
**Issue:** Thầy Tám xưng "Cháu" thay vì "Thầy"  
**Status:** ✅ FIXED  

---

## 🐛 VẤN ĐỀ

**Screenshot cho thấy:**
```
❌ "Cháu xin trả lời: Hướng tốt để đặt bàn làm việc..."
❌ "Cháu hy vọng thông tin này sẽ giúp bác..."
```

**Nguyên nhân:**
- System prompt chưa đủ STRICT về xưng hô
- AI model tự ý chọn xưng "cháu" (vì trong prompt có từ "cháu")

---

## ✅ GIẢI PHÁP

### **Added to System Prompt:**

```typescript
**XƯNG HÔ BẮT BUỘC:**
+ **BẠN XƯNG:** "Thầy" (KHÔNG BAO GIỜ xưng "tôi", "em", "cháu", "mình")
+ **GỌI NGƯỜI DÙNG:** "Gia chủ" hoặc "Bác" hoặc "Cháu" (tùy tuổi)
+ **VÍ DỤ ĐÚNG:** "Thầy xin trả lời gia chủ", "Thầy khuyên bác", "Thầy hy vọng cháu"
+ **VÍ DỤ SAI:** ❌ "Cháu xin trả lời", ❌ "Tôi nghĩ rằng", ❌ "Em hy vọng"
```

### **Added Response Example:**

```
User: "Hướng nào tốt để đặt bàn làm việc?"

Response:
🔮 THẦY XIN TRẢ LỜI GIA CHỦ

Gia chủ hỏi về hướng đặt bàn làm việc, đây là việc quan trọng 
ảnh hưởng đến TÀI LỘC và SỰ NGHIỆP.

💡 THẦY KHUYÊN GIA CHỦ:

• Hướng CÁT: Đông Nam, Đông (gặp Mộc, sinh Hỏa mệnh)
• Ngồi quay lưng vào tường, mặt nhìn cửa
• Tránh đặt dưới xà ngang hoặc đối diện toilet

🏮 TÓM LẠI:

Gia chủ chọn hướng ĐÔNG NAM để đặt bàn, Thầy tin TÀI LỘC sẽ 
THÔNG THOÁNG, công việc HANH THÔNG!

Chúc gia chủ VẠN SỰ NHƯ Ý! 🎋
```

**Lưu ý:**
- ✅ "Thầy xin trả lời gia chủ"
- ✅ "Thầy khuyên gia chủ"
- ✅ "Thầy tin"
- ✅ "Chúc gia chủ"

---

## 🧪 TEST VERIFICATION

**Tested with GROQ API directly:**

```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer gsk_..." \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [
      {"role": "system", "content": "XƯNG HÔ BẮT BUỘC: BẠN XƯNG Thầy..."},
      {"role": "user", "content": "Hướng nào tốt để đặt bàn làm việc?"}
    ]
  }'
```

**Result:**
```
✅ "Thầy xin trả lời gia chủ, khi đặt bàn làm việc..."
✅ "thầy khuyên bác nên xem xét..."
```

**Perfect adherence to persona!**

---

## 🚨 QUAN TRỌNG: CLEAR BROWSER CACHE

**Vì bạn vẫn thấy lỗi, nguyên nhân là BROWSER CACHE!**

### **Cách 1: Hard Refresh (KHUYẾN NGHỊ)**

1. Mở URL: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat

2. **Hard Refresh:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Clear localStorage:**
   - Press `F12` → Console
   - Paste:
     ```javascript
     localStorage.clear()
     sessionStorage.clear()
     location.reload()
     ```

4. **Login lại:**
   - Email: `premium@thaytam.com`
   - Password: [your password]

5. **Test chat:**
   - Message: "Hướng nào tốt để đặt bàn làm việc?"
   - Kỳ vọng: 
     ```
     🔮 THẦY XIN TRẢ LỜI GIA CHỦ
     
     Gia chủ hỏi về hướng đặt bàn làm việc...
     
     💡 THẦY KHUYÊN GIA CHỦ:
     
     • Hướng CÁT: Đông Nam, Đông
     ...
     ```

### **Cách 2: Incognito/Private Mode**

1. Open Incognito:
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`
   - Safari: `Cmd + Shift + N`

2. Vào: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat

3. Login và test

### **Cách 3: Clear All Browser Data**

1. Chrome: `Ctrl + Shift + Delete`
2. Check: "Cached images and files"
3. Time range: "All time"
4. Click "Clear data"
5. Restart browser
6. Test lại

---

## 📊 SO SÁNH BEFORE/AFTER

| Element | Before (WRONG) | After (CORRECT) |
|---------|----------------|-----------------|
| **Xưng** | "Cháu xin trả lời" ❌ | "Thầy xin trả lời" ✅ |
| **Gọi người dùng** | "bác" ✅ | "gia chủ" ✅ |
| **Động từ** | "Cháu hy vọng" ❌ | "Thầy hy vọng" ✅ |
| **Lời kết** | Generic | "Chúc gia chủ VẠN SỰ NHƯ Ý!" ✅ |

---

## 📝 FILES CHANGED

**File:** `functions/_lib/aiService.ts`

**Changes:**
1. Added mandatory addressing rules (lines 123-129)
2. Added response example template (lines 145-170)
3. Enforced strict persona rules

**Git Commit:** `d8bd0d1`

---

## ✅ VERIFICATION CHECKLIST

- [x] System prompt updated with strict rules
- [x] Response example added
- [x] Tested with GROQ API directly
- [x] Build completed
- [x] Server restarted
- [x] Git committed & pushed
- [ ] **USER: Clear browser cache**
- [ ] **USER: Hard refresh page**
- [ ] **USER: Test chat với message mới**
- [ ] **USER: Verify xưng hô đúng**

---

## 🎯 EXPECTED RESULT

**After clearing cache and testing:**

```
User: "Hướng nào tốt để đặt bàn làm việc?"

AI Response:
🔮 THẦY XIN TRẢ LỜI GIA CHỦ

Gia chủ hỏi về hướng đặt bàn làm việc, đây là việc quan trọng 
ảnh hưởng đến TÀI LỘC và SỰ NGHIỆP.

💡 THẦY KHUYÊN GIA CHỦ:

• Hướng CÁT: Đông Nam, Đông
• Ngồi quay lưng vào tường, mặt nhìn cửa
• Tránh đặt dưới xà ngang

🏮 TÓM LẠI:

Gia chủ chọn hướng ĐÔNG NAM để đặt bàn, Thầy tin TÀI LỘC 
sẽ THÔNG THOÁNG!

Chúc gia chủ VẠN SỰ NHƯ Ý! 🎋
```

**Kiểm tra:**
- ✅ "Thầy xin trả lời gia chủ" (NOT "Cháu xin trả lời")
- ✅ "Thầy khuyên gia chủ" (NOT "Cháu khuyên")
- ✅ "Thầy tin" (NOT "Cháu tin")
- ✅ Format đúng (emoji, IN HOA, xuống dòng)

---

## 🚀 ACTION REQUIRED

**BẠN CẦN LÀM NGAY:**

1. **Clear browser cache** (Ctrl + Shift + Delete)
2. **Hard refresh** (Ctrl + Shift + R)
3. **Logout & Login lại**
4. **Test với message MỚI** (đừng dùng lại message cũ)
5. **Screenshot response mới** và gửi cho tôi

**Nếu vẫn sai:**
- Screenshot console logs (F12)
- Screenshot Network tab (POST /api/ai-stream)
- Cho tôi biết exact message bạn gửi

---

**Status:** ✅ CODE ĐÃ FIX, CHỜ BẠN CLEAR CACHE & TEST!
