# 🧪 SANDBOX TEST GUIDE - PERSONA FIX

## ✅ SERVER STATUS
- **Status:** ✅ ONLINE
- **URL:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat
- **Code Version:** Latest (with emoji-aware persona fix)
- **Uptime:** 17 minutes

## 🎯 VẤN ĐỀ ĐÃ FIX

### Trước (SAI):
```
🔮 Cháu xin trả lời bác:
...
Cháu hy vọng những lời khuyên này...
```

### Sau (ĐÚNG):
```
🔮 Thầy xin trả lời bác:
...
Thầy hy vọng những lời khuyên này...
```

## 📋 TEST STEPS (30 GIÂY)

### Bước 1: Hard Refresh (5 giây)
**Windows/Linux:**
```
Ctrl + Shift + R
```

**Mac:**
```
Cmd + Shift + R
```

### Bước 2: Clear Cache (10 giây)
1. Nhấn `F12` để mở Developer Tools
2. Chọn tab **Console**
3. Dán đoạn code này và nhấn Enter:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Bước 3: Login (10 giây)
- **URL:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/login
- **Email:** `premium@thaytam.com`
- **Password:** [mật khẩu của bạn]

### Bước 4: Test Chat (5 giây)
1. Sau khi login, bạn sẽ tự động redirect về `/chat`
2. Gửi message test:
```
Hướng nào tốt để đặt bàn làm việc?
```

## ✅ KẾT QUẢ MONG ĐỢI

### Response sẽ bắt đầu bằng:
```
🔮 Thầy xin trả lời gia chủ:

GIA CHỦ THÂN MẾN,

Dựa vào phong thủy học, Thầy xin tư vấn...
```

### Các điểm kiểm tra:
- ✅ **"Thầy xin trả lời"** (KHÔNG phải "Cháu xin")
- ✅ **"Thầy hy vọng"** (KHÔNG phải "Cháu hy vọng")
- ✅ **"Thầy khuyên"** (KHÔNG phải "Cháu khuyên")
- ✅ **Emoji được giữ nguyên:** 🔮 🏮 🎋 💰 🏠 🌟 ✨ 🎯
- ✅ **Response 2-4 giây** (GROQ streaming)
- ✅ **Font size hợp lý** (16px header, 14px body)
- ✅ **Format đúng:** Emoji + IN HOA + xuống dòng

## 🐛 NẾU VẪN LỖI

### 1. Vẫn thấy "Cháu xin"?
→ Chưa clear cache đúng cách
→ Làm lại Bước 2 (clear localStorage)

### 2. Không login được?
→ Check email/password
→ Token có thể expired

### 3. Response quá chậm?
→ GROQ API đang busy
→ Thử lại sau 30 giây

## 📸 SCREENSHOT TEST

**Hãy chụp screenshot kết quả và gửi cho tôi nếu:**
- Vẫn thấy "Cháu xin trả lời"
- Font size vẫn quá to
- Response không có emoji
- Xưng hô vẫn sai

## 🎉 SAU KHI TEST OK

Nếu test sandbox OK, chúng ta sẽ:
1. **Setup Cloudflare API key** (vào Deploy tab)
2. **Deploy lên production:**
   - https://thaytam-phongthuy-v2.pages.dev
   - https://b8a1ed5b.thaytam-phongthuy-v2.pages.dev

## 🔗 QUICK LINKS

- **Login:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/login
- **Chat:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat
- **Dashboard:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/dashboard

## 🚀 HÃY TEST NGAY!

**Mở link này và làm theo 4 bước trên:**
👉 https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat

---

**Lưu ý:** Sandbox này chỉ tồn tại trong session hiện tại. Sau khi test OK, nhớ deploy lên production để có URL vĩnh viễn!
