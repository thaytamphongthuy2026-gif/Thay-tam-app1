# 🔴 CRITICAL: Missing SUPABASE_SERVICE_KEY

## ❌ VẤN ĐỀ

Backend chat đang bị **401 Unauthorized** vì 2 lý do:

1. **JWT Token Expired** - User cần logout/login
2. **SUPABASE_SERVICE_KEY Missing** - Backend không thể query database

---

## ✅ GIẢI PHÁP

### **1. Thêm SUPABASE_SERVICE_KEY (CRITICAL)**

#### **Get from Supabase Dashboard:**

1. Go to: https://supabase.com/dashboard/project/kwnuqxogswvmofpmwyxy
2. **Settings** → **API**
3. **Project API keys** section
4. Copy **"service_role"** key (NOT "anon" key)
   - Should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Should be LONG (~200+ characters)

#### **Add to .dev.vars:**

```bash
# Add this line
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_SERVICE_KEY...
```

#### **Update Production:**

```bash
# After getting the key
cd /home/user/webapp
export CLOUDFLARE_API_TOKEN="Uk4UDmRuORtHaqvcR0E7gaFe_si3lUHNTT6NT_pJ"
echo "YOUR_SERVICE_KEY" | npx wrangler pages secret put SUPABASE_SERVICE_KEY --project-name thaytam-phongthuy-v2
```

#### **Restart Server:**

```bash
pm2 restart webapp
```

---

### **2. User phải Logout & Login lại**

JWT token đã expired, user cần:

1. **Logout:**
   - Click avatar → "Đăng xuất"
   - Or clear localStorage: `localStorage.clear()`

2. **Login:**
   - Go to: /login
   - Email: `premium@thaytam.com`
   - Get new JWT token

3. **Test:**
   - Go to: /chat
   - Send message
   - Should work!

---

## 🔍 WHY SUPABASE_SERVICE_KEY IS NEEDED

### **Backend Flow:**
```typescript
// functions/api/ai-stream.ts
const user = await getUser(userId, env)
                    ↓
// functions/_lib/database.ts
export async function getUser(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
    {
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,  // ← CRITICAL!
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
    }
  )
  // ...
}
```

**Without SERVICE_KEY:**
- `getUser()` fails → 401 Unauthorized
- Cannot fetch user data → Cannot check quota
- API returns error → Chat fails

---

## 📊 WHAT'S WORKING vs BROKEN

| Component | Status | Reason |
|-----------|--------|--------|
| **GROQ API** | ✅ Working | Key configured |
| **Endpoints** | ✅ Deployed | Code correct |
| **JWT Auth** | ❌ **Token Expired** | User needs login |
| **Database** | ❌ **SERVICE_KEY Missing** | Cannot query users |
| **Chat** | ❌ **BLOCKED** | Both issues above |

---

## 🎯 PRIORITY

### **MUST DO (CRITICAL):**

1. ✅ **Get SUPABASE_SERVICE_KEY** from dashboard
2. ✅ **Add to .dev.vars**
3. ✅ **Add to production secrets**
4. ✅ **Restart server**
5. ✅ **User logout & login**

### **THEN TEST:**
- Chat should work với GROQ API
- Response streaming 2-4s
- All features functional

---

## 🚀 QUICK CHECKLIST

- [ ] Get SUPABASE_SERVICE_KEY from dashboard
- [ ] Add to `.dev.vars`
- [ ] Run: `pm2 restart webapp`
- [ ] Upload to production: `wrangler pages secret put`
- [ ] User logout & login
- [ ] Test chat: Send "Xin chào"
- [ ] **Verify:** Fast streaming response with GROQ!

---

## 📝 SUPABASE PROJECT INFO

**Current Project:**
- **URL:** https://kwnuqxogswvmofpmwyxy.supabase.co
- **Ref:** kwnuqxogswvmofpmwyxy
- **Dashboard:** https://supabase.com/dashboard/project/kwnuqxogswvmofpmwyxy

**What we have:**
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_JWT_SECRET
- ❌ **SUPABASE_SERVICE_KEY** ← MISSING!

---

## 🔧 AFTER ADDING KEY

### **Local Test:**
```bash
cd /home/user/webapp
pm2 restart webapp
sleep 5
curl http://localhost:3000/
# Should see homepage

# Then test with valid JWT:
# 1. Logout & Login in browser
# 2. Go to /chat
# 3. Send message
# 4. Should work!
```

### **Production:**
```bash
# Upload secret
export CLOUDFLARE_API_TOKEN="Uk4UDmRuORtHaqvcR0E7gaFe_si3lUHNTT6NT_pJ"
echo "YOUR_SERVICE_KEY" | npx wrangler pages secret put SUPABASE_SERVICE_KEY --project-name thaytam-phongthuy-v2

# Verify
npx wrangler pages secret list --project-name thaytam-phongthuy-v2
# Should see:
# - GROQ_API_KEY
# - OPENROUTER_API_KEY
# - GEMINI_API_KEY
# - SUPABASE_SERVICE_KEY ← NEW
```

---

## ✅ EXPECTED RESULT

**After fixing both issues:**

```
Auth state changed: SIGNED_IN premium@thaytam.com
🚀 Trying /api/ai-stream...
✅ JWT verified, user ID: xxx
✅ User loaded from database (via SERVICE_KEY)
✅ Quota checked: 100 remaining
🚀 Calling GROQ API...
✅ GROQ API streaming started
[Fast streaming response 2-4s]
✅ Chat working 100%!
```

---

## 🎯 SUMMARY

**Problem 1:** JWT token expired → User logout/login  
**Problem 2:** SUPABASE_SERVICE_KEY missing → Get from dashboard  

**Solution:** Get SERVICE_KEY + User login → Chat works!

**Time:** ~5 phút (get key + configure)

---

**Status:** ⏳ WAITING FOR SUPABASE_SERVICE_KEY

**Next:** Cho tôi SERVICE_KEY và tôi sẽ configure ngay!
