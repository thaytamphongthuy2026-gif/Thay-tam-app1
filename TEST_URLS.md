# 🌐 URLS ĐỂ TEST

## ✅ SANDBOX DEV (Đang chạy - RECOMMENDED)

**🔗 URL:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai

**Đặc điểm:**
- ✅ Code mới nhất (đã remove console logs)
- ✅ GROQ API working
- ✅ Silent fallback
- ✅ All 6 keys configured

**Test ngay:**
1. **Logout:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/login
   ```javascript
   // Paste vào Console (F12)
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

2. **Login:**
   - Email: `premium@thaytam.com`
   - Password: [your password]

3. **Chat:** https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat
   - Message: "Xin chào Thầy Tám"
   - Kỳ vọng: Streaming 2-4s, không có console logs

---

## ⚠️ PRODUCTION (Cần deploy lại)

**🔗 Latest:** https://b8a1ed5b.thaytam-phongthuy-v2.pages.dev  
**🔗 Main:** https://thaytam-phongthuy-v2.pages.dev

**Tình trạng:**
- ⚠️ Code cũ (còn console logs)
- ⚠️ Cloudflare API key expired
- ⚠️ Cần re-deploy

**Để deploy:**
1. Setup Cloudflare API key tại Deploy tab
2. Run: `npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2`

---

## 🎯 KHUYẾN NGHỊ

**TEST NGAY Ở:** 
👉 https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai

**Lý do:**
- ✅ Code mới nhất
- ✅ Silent fallback (không spam console)
- ✅ GROQ working
- ✅ Không cần setup gì thêm

---

## 📋 CHECKLIST TEST

### **Bước 1: Logout**
- [ ] Mở: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai
- [ ] F12 → Console
- [ ] Paste: `localStorage.clear(); sessionStorage.clear(); location.reload()`

### **Bước 2: Login**
- [ ] Vào: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/login
- [ ] Email: premium@thaytam.com
- [ ] Password: [your password]
- [ ] Click "Đăng nhập"

### **Bước 3: Chat**
- [ ] Vào: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat
- [ ] Gửi: "Xin chào Thầy Tám"
- [ ] Kiểm tra Console (F12): KHÔNG CÓ log về fallback
- [ ] Response: 2-4 giây

### **Bước 4: Verify**
- [ ] Streaming hoạt động ✅
- [ ] Không có lỗi 500 ✅
- [ ] Console sạch (không spam logs) ✅
- [ ] Response tiếng Việt tốt ✅

---

## 🆘 NẾU VẪN BỊ LỖI

**Báo cho tôi:**
1. URL đang test
2. Screenshot Console (F12)
3. Screenshot Network tab (POST /api/ai-stream)
4. Error message

---

## 🚀 QUICK START

**Copy và dán vào trình duyệt:**
```
https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat
```

**Nếu chưa login:**
1. Sẽ redirect về /login
2. Login với premium@thaytam.com
3. Tự động quay lại /chat
4. Test ngay!

---

**Status:** ✅ **SẴN SÀNG TEST!**
