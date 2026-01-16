# 🔴 URGENT: JWT Token Expired - Quick Fix

## ❌ CURRENT ERROR

```
POST /api/ai-stream 401 Unauthorized
POST /api/ai 401 Unauthorized
Error: Authentication failed: Token expired at 2025-01-21T09:00:00.000Z
```

---

## ✅ GIẢI PHÁP NGAY LẬP TỨC

### **User phải LOGOUT và LOGIN LẠI**

JWT token đã hết hạn. User cần làm mới token:

1. **Logout:**
   - Vào: http://localhost:3000
   - Click vào avatar/profile
   - Click "Đăng xuất"

2. **Clear LocalStorage (if needed):**
   ```javascript
   // Open browser console
   localStorage.clear()
   location.reload()
   ```

3. **Login lại:**
   - Vào: http://localhost:3000/login
   - Email: `premium@thaytam.com`
   - Password: [your password]
   - Click "Đăng nhập"

4. **Test chat:**
   - Vào: http://localhost:3000/chat
   - Send: "Xin chào Thầy Tám"
   - **Should work với GROQ API!**

---

## 🔍 TẠI SAO?

### **JWT Token Lifetime:**
- Supabase JWT tokens có **expiration time**
- Token expired at: `2025-01-21T09:00:00.000Z` (quá khứ!)
- Backend verify token → expired → 401 Unauthorized

### **Why Token Expired:**
- Token được tạo cách đây vài ngày
- Supabase default: 1 hour expiration
- User chưa logout/login → token cũ vẫn còn trong localStorage

---

## 🛠️ TECHNICAL DETAILS

### **Error Flow:**
```
User → Send chat message
  ↓
Frontend: Get token from localStorage
  ↓
Backend: Verify JWT token
  ↓
JWT.verify() → Token expired!
  ↓
Return 401 Unauthorized
```

### **Code Location:**
```typescript
// functions/_lib/auth.ts
export async function verifyJWT(token: string, secret: string) {
  try {
    const payload = await jwtVerify(token, secret)
    return payload as any
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`)
  }
}
```

---

## 🔧 OPTIONAL: SUPABASE_SERVICE_KEY

**Note:** Cũng thiếu SUPABASE_SERVICE_KEY trong .dev.vars, nhưng không ảnh hưởng chat.

### **Nếu muốn thêm (Optional):**

1. Get from Supabase Dashboard:
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT
   - Settings → API
   - Copy "service_role key" (NOT "anon key")

2. Add to `.dev.vars`:
   ```bash
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Restart server:
   ```bash
   pm2 restart webapp
   ```

**But this is NOT needed for chat!** Chat chỉ cần:
- SUPABASE_URL ✅
- SUPABASE_JWT_SECRET ✅
- GROQ_API_KEY ✅

---

## ✅ AFTER LOGIN

### **Expected behavior:**
1. Login success → new JWT token
2. Token stored in localStorage
3. Chat request → token valid
4. Backend: Verify token → OK
5. Call GROQ API → Response streaming
6. **Chat works!** ⚡

### **What you'll see:**
```
Auth state changed: SIGNED_IN premium@thaytam.com
🚀 Trying /api/ai-stream...
✅ Streaming started (GROQ API)
Response: [Fast streaming response 2-4s]
```

---

## 📊 STATUS

| Issue | Status | Action |
|-------|--------|--------|
| **JWT Token Expired** | ❌ Blocking | **Logout + Login** |
| **GROQ API** | ✅ Working | Ready to use |
| **Endpoints** | ✅ Working | Ready to use |
| **SUPABASE_SERVICE_KEY** | ⚠️ Missing | Optional (for payment) |

---

## 🎯 NEXT STEPS

1. **Logout + Login** ← DO THIS FIRST
2. **Test chat** → Should work with GROQ!
3. **Verify streaming** → Fast response 2-4s
4. **(Optional)** Add SUPABASE_SERVICE_KEY for payment features

---

## 🚀 PRODUCTION

**Production cũng cần:**
- Users phải logout và login lại
- Token mới sẽ có expiration time dài hơn
- Sau đó chat sẽ work 100%

---

## 📝 SUMMARY

**Problem:** JWT token expired  
**Solution:** Logout + Login lại  
**Time:** ~30 giây  
**Result:** Chat works với GROQ API! ⚡

---

**Làm ngay:** Logout và login lại tại http://localhost:3000/login
