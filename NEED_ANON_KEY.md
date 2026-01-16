# 🎯 SUPABASE PROJECT FIXED - CẦN ANON KEY

## ✅ ĐÃ SỬA: Đổi sang project đúng

**Project cũ (SAI):** kwnuqxogswvmofpmwyxy ❌ (không tồn tại)  
**Project mới (ĐÚNG):** jnfpxvodlmfukpagozcw ✅ (project của bạn)

---

## 📋 KEYS HIỆN CÓ

✅ **SUPABASE_URL:** https://jnfpxvodlmfukpagozcw.supabase.co  
✅ **SUPABASE_SERVICE_KEY:** eyJhbGci... (có rồi)  
✅ **SUPABASE_JWT_SECRET:** ntgvQQYK... (có rồi)  
❌ **SUPABASE_ANON_KEY:** **THIẾU!**

---

## 🔑 CẦN: SUPABASE_ANON_KEY

### **Lấy từ đâu:**

1. Go to: https://supabase.com/dashboard/project/jnfpxvodlmfukpagozcw
2. **Settings** → **API**
3. **Project API keys** section
4. Copy **"anon public"** key
   - Should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Shorter than SERVICE_KEY (~150 chars)

### **Cho tôi key:**

Paste key vào đây, tôi sẽ:
1. Update `.dev.vars`
2. Restart server
3. Upload to production
4. Test chat

---

## 🔍 TẠI SAO CẦN ANON KEY?

**ANON KEY dùng cho:**
- Frontend authentication (login/signup)
- Public API calls from browser
- Row Level Security (RLS) policies

**SERVICE_KEY dùng cho:**
- Backend database queries (bypass RLS)
- Admin operations
- Server-side only

**JWT_SECRET dùng cho:**
- Verify user tokens
- Decode JWT payload
- Extract user ID

**➡️ Cần cả 3 keys để app hoạt động!**

---

## 📊 AFTER ADDING ANON KEY

### **Local:**
```bash
# Update .dev.vars with ANON key
# Restart
pm2 restart webapp

# User can login
# Chat works!
```

### **Production:**
```bash
# Upload all Supabase secrets
export CLOUDFLARE_API_TOKEN="Uk4UDmRuORtHaqvcR0E7gaFe_si3lUHNTT6NT_pJ"

echo "YOUR_ANON_KEY" | npx wrangler pages secret put SUPABASE_ANON_KEY --project-name thaytam-phongthuy-v2

# Also update SERVICE_KEY and JWT_SECRET
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZnB4dm9kbG1mdWtwYWdvemN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODIxODE5NiwiZXhwIjoyMDgzNzk0MTk2fQ.hT6i3hVdjHwlV6O4Bmsf7KecL3i0wK6XKuMFQk4TIUk" | npx wrangler pages secret put SUPABASE_SERVICE_KEY --project-name thaytam-phongthuy-v2

echo "ntgvQQYKmuuqTQ6DvXgICn7elNy0lj1oPGY24gYk1/LANFQUQhmtxLiefIMsuySgTap2DORmUGFNZvgoOT0/cg==" | npx wrangler pages secret put SUPABASE_JWT_SECRET --project-name thaytam-phongthuy-v2
```

---

## 🎯 CHECKLIST

### **Done:**
- [x] Fix project từ kwnuqxogswvmofpmwyxy → jnfpxvodlmfukpagozcw
- [x] Update SUPABASE_URL
- [x] Update SUPABASE_SERVICE_KEY
- [x] Update SUPABASE_JWT_SECRET
- [x] Update GROQ_API_KEY
- [x] Update OPENROUTER_API_KEY

### **Need:**
- [ ] Get SUPABASE_ANON_KEY from dashboard
- [ ] Add to .dev.vars
- [ ] Restart server
- [ ] Upload to production
- [ ] Test login
- [ ] Test chat

---

## 🚀 EXPECTED RESULT

**After adding ANON KEY:**

```
✅ User can login (ANON_KEY for auth)
✅ Token verified (JWT_SECRET correct)
✅ Database query works (SERVICE_KEY correct)
✅ Chat works with GROQ! (AI integration working)
```

---

## 📝 SUMMARY

**Problem:** Mixed 2 projects (kwnuqxogswvmofpmwyxy doesn't exist)  
**Solution:** Use correct project jnfpxvodlmfukpagozcw  
**Missing:** SUPABASE_ANON_KEY  
**Action:** Get from dashboard → Cho tôi → Config xong!

---

**Dashboard:** https://supabase.com/dashboard/project/jnfpxvodlmfukpagozcw  
**Section:** Settings → API → "anon public" key

**Cho tôi key và tôi sẽ config ngay!** 🚀
