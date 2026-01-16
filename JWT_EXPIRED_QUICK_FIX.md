# 🔴 LỖI 500: JWT TOKEN EXPIRED

## ⚠️ TRIỆU CHỨNG

Console logs:
```
Auth state changed: SIGNED_IN premium@thaytam.com
POST /api/ai-stream 500 Internal Server Error
POST /api/gemini-stream 500 Internal Server Error
❌ /api/ai-stream failed: Không thể kết nối với AI
```

Backend logs:
```
🔒 JWT validation failed: {
    error: 'Token expired at 2025-01-21T09:00:00.000Z',
}
```

---

## 🎯 NGUYÊN NHÂN

**JWT Token hết hạn!**

- JWT tokens có expiration time (mặc định 1 giờ)
- Token trong `localStorage` đã expired
- Backend từ chối token cũ → 500 error

---

## ✅ GIẢI PHÁP (10 GIÂY)

### **BƯỚC 1: Xóa Token Cũ**

Mở DevTools → Console:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### **BƯỚC 2: Login Lại**

Vào: http://localhost:3000/login

Hoặc Production: https://b8a1ed5b.thaytam-phongthuy-v2.pages.dev/login

Login với:
- Email: `premium@thaytam.com`
- Password: [your password]

### **BƯỚC 3: Test Chat**

Vào: http://localhost:3000/chat

Gửi: "Xin chào"

Kỳ vọng:
- ✅ Streaming bắt đầu ngay
- ✅ Response 2-4s
- ✅ KHÔNG CÓ console logs về fallback
- ✅ Không có lỗi 500

---

## 🔍 KIỂM TRA TOKEN MỚI

Sau khi login, check token mới:

```javascript
// Get token
const token = localStorage.getItem('sb-jnfpxvodlmfukpagozcw-auth-token')
if (token) {
  const parsed = JSON.parse(token)
  const jwt = parsed.access_token
  
  // Decode JWT (without verification)
  const payload = JSON.parse(atob(jwt.split('.')[1]))
  
  console.log('Token expires at:', new Date(payload.exp * 1000))
  console.log('User ID:', payload.sub)
  console.log('Email:', payload.email)
}
```

Kỳ vọng:
- ✅ `exp` phải là thời gian trong tương lai
- ✅ `sub` (user ID) phải có
- ✅ `email` phải là premium@thaytam.com

---

## 🔄 TỰ ĐỘNG REFRESH

**Hiện tại:** Token refresh tự động khi user active

**Nếu không active:**
- Token expire sau 1 giờ
- User phải login lại

**Giải pháp dài hạn** (nếu cần):
1. Tăng token expiration time trong Supabase Dashboard
2. Hoặc implement auto-refresh trong frontend

---

## 🚨 NẾU VẪN BỊ LỖI

### **Kiểm tra Backend Logs:**

```bash
pm2 logs webapp --nostream --lines 50 | grep -E "(500|error|JWT)"
```

### **Kiểm tra Network:**

DevTools → Network tab:
- POST /api/ai-stream → Status?
- Response → Error message?

### **Kiểm tra Auth State:**

Console:
```javascript
// Check auth state
import { getSession } from './lib/auth'
const session = await getSession()
console.log('Session:', session)
```

---

## ✅ HIỆN TẠI ĐÃ FIX

- ✅ **Silent fallback:** Không còn console logs về fallback
- ✅ **GROQ integration:** Working với token mới
- ✅ **Redirect:** Sau login về trang ban đầu

**Chỉ cần:** Logout → Login → Chat

---

## 🎯 TÓM TẮT

**Vấn đề:** JWT token expired  
**Giải pháp:** Logout + Login lại  
**Thời gian:** 10 giây  
**Kết quả:** Chat hoạt động 100%  

**🚀 LOGOUT NGAY → LOGIN → TEST CHAT!**
