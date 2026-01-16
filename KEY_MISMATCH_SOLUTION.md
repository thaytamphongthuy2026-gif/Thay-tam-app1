# 🔴 KEY MISMATCH ISSUE - GIẢI PHÁP TRIỆT ĐỂ

## ❌ VẤN ĐỀ HIỆN TẠI

**Bạn cung cấp SERVICE_KEY từ project CŨ:**
```
jnfpxvodlmfukpagozcw  ← Old project
```

**Nhưng đang dùng project MỚI:**
```
kwnuqxogswvmofpmwyxy  ← Current project
```

**➡️ Keys KHÔNG KHỚP → Backend không thể query database!**

---

## ✅ GIẢI PHÁP DỨT ĐIỂM

### **Option 1: Lấy keys đúng cho project hiện tại (RECOMMENDED)**

**Lấy từ dashboard:**
👉 https://supabase.com/dashboard/project/kwnuqxogswvmofpmwyxy

1. **Settings** → **API**
2. Copy 3 keys:
   - `service_role` key (SECRET, dài ~200 chars)
   - Confirm `anon` key matches (should be same as current)
   - Confirm `JWT secret` matches

3. Cho tôi **service_role** key mới

---

### **Option 2: Quay về project cũ (nếu có data quan trọng)**

Nếu project `jnfpxvodlmfukpagozcw` có users/data quan trọng:

1. Get full keys from: https://supabase.com/dashboard/project/jnfpxvodlmfukpagozcw

2. Replace ALL keys in `.dev.vars`:
   ```bash
   SUPABASE_URL=https://jnfpxvodlmfukpagozcw.supabase.co
   SUPABASE_ANON_KEY=<new_anon_key>
   SUPABASE_JWT_SECRET=<new_jwt_secret>
   SUPABASE_SERVICE_KEY=<your_service_key>
   ```

3. Update production secrets (ALL of them)

---

## 🔍 TẠI SAO JWT TOKEN HAY HẾT HẠN?

### **2 Loại Tokens:**

#### **1. User JWT Token (Frontend)**
- **Expiration:** 1 hour (default)
- **Auto-refresh:** Khi user active
- **Stored:** localStorage
- **Hết hạn khi:** User không active > 1 hour
- **Fix:** User logout & login

#### **2. SERVICE_KEY (Backend)**  
- **Expiration:** 2083-07-94 (59 năm nữa!)
- **Never expires** trong thực tế
- **Stored:** Backend env vars
- **Not affected** by user sessions

### **Tại sao bạn hay gặp lỗi hết hạn?**

1. **User JWT token** hết hạn sau 1 giờ không dùng
2. **LocalStorage** vẫn giữ token cũ
3. User gửi request với token cũ
4. Backend: "Token expired!" → 401

**Fix:** Logout & login để có token mới

---

## 🎯 RECOMMENDATION

**Best approach:**

1. **Xác định project đúng:**
   - Project nào có users?
   - Project nào đang production?
   - Dashboard nào bạn đang dùng?

2. **Lấy FULL keys từ dashboard:**
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_JWT_SECRET  
   - SUPABASE_SERVICE_KEY

3. **Update ALL keys cùng lúc:**
   - .dev.vars (local)
   - Cloudflare secrets (production)

4. **Restart & test:**
   - pm2 restart webapp
   - User logout & login
   - Test chat

---

## 📊 CURRENT STATUS

**Project in use:** kwnuqxogswvmofpmwyxy

**Keys status:**
- ✅ SUPABASE_URL: Correct
- ✅ SUPABASE_ANON_KEY: Correct  
- ✅ SUPABASE_JWT_SECRET: Correct
- ❌ SUPABASE_SERVICE_KEY: **WRONG PROJECT!**

**What happens:**
- User login → Works (JWT_SECRET correct)
- JWT verify → Works
- Database query → **FAILS** (SERVICE_KEY wrong)
- getUser() → Error
- Chat → 401

---

## ✅ NEXT STEPS

**Cho tôi biết:**

**Option A: Dùng project hiện tại `kwnuqxogswvmofpmwyxy`**
→ Cần: SERVICE_KEY từ dashboard

**Option B: Quay về project cũ `jnfpxvodlmfukpagozcw`**  
→ Cần: FULL keys (URL + ANON + JWT + SERVICE)

**Option C: Không chắc**
→ Tôi sẽ giúp check project nào có data

---

## 🚀 SAU KHI CÓ KEYS ĐÚNG

```bash
# Update .dev.vars
# Restart
pm2 restart webapp

# User logout & login
# Test chat → Should work!
```

---

**Bạn muốn chọn Option nào?** A, B, hay C?

Hoặc cho tôi biết: **Project nào là project production hiện tại?**
