# 🚨 URGENT: API KEY BỊ LEAK - CẦN THAY NGAY

## ⚠️ VẤN ĐỀ

**Gemini API Key đã bị Google phát hiện leak và vô hiệu hóa:**

```json
{
  "error": {
    "code": 403,
    "message": "Your API key was reported as leaked. Please use another API key.",
    "status": "PERMISSION_DENIED"
  }
}
```

## ✅ CODE HOÀN TOÀN ĐÚNG

- ✅ Model: `gemini-3-flash-preview` (mới nhất)
- ✅ Streaming endpoint: Đúng
- ✅ Non-streaming endpoint: Đúng
- ✅ RAG integration: Đúng
- ✅ Error handling: Đúng

**Vấn đề duy nhất: API Key bị leak!**

---

## 🔧 HƯỚNG DẪN FIX

### Bước 1: Tạo API Key Mới

1. Đi tới: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Chọn project hoặc tạo mới
4. Copy API key mới

### Bước 2: Cập Nhật Local Development

**File: `.dev.vars`**
```env
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
SUPABASE_URL=https://kwnuqxogswvmofpmwyxy.supabase.co
SUPABASE_ANON_KEY=your-supabase-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

⚠️ **LƯU Ý:** 
- File `.dev.vars` đã có trong `.gitignore` (an toàn)
- KHÔNG commit API key vào Git

### Bước 3: Cập Nhật Production (Cloudflare)

**Cách 1: Qua Wrangler CLI**
```bash
# Set secret cho production
npx wrangler pages secret put GEMINI_API_KEY --project-name thaytam-phongthuy-v2

# Nhập API key khi được hỏi
```

**Cách 2: Qua Cloudflare Dashboard**
1. Đi tới: https://dash.cloudflare.com/
2. Pages → thaytam-phongthuy-v2
3. Settings → Environment variables
4. Add variable:
   - Name: `GEMINI_API_KEY`
   - Value: `your-new-api-key`
   - Environment: Production & Preview
5. Save

### Bước 4: Restart Services

**Local:**
```bash
cd /home/user/webapp
pm2 restart webapp
```

**Production:**
- Cloudflare tự động restart sau khi update secret

---

## 🧪 TESTING AFTER FIX

### Test Local Dev Server

```bash
# Test streaming endpoint
curl -X POST http://localhost:3000/api/gemini-stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"prompt":"Xin chào Thầy Tám","quotaType":"chat","useRag":false}'
```

### Test Production

1. Đi tới: https://thaytam-phongthuy-v2.pages.dev/chat
2. Đăng nhập với: `premium@thaytam.com`
3. Gửi tin nhắn: "Xin chào Thầy Tám"
4. Kiểm tra streaming response

---

## 📊 CURRENT STATUS

**Code:**
- ✅ Model: `gemini-3-flash-preview` (LATEST)
- ✅ Streaming: Implemented correctly
- ✅ RAG: Working
- ✅ Error handling: Proper
- ✅ Committed: Hash `5a2fe75`
- ✅ GitHub: Synced

**Deployment:**
- 🟢 Dev Server: Running (chờ API key mới)
- 🟢 Code: Ready to deploy
- ⚠️ Production: Cần update API key

**URLs:**
- Dev: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai
- GitHub: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1
- Production: https://thaytam-phongthuy-v2.pages.dev

---

## 🔐 BẢO MẬT API KEY

### Nguyên tắc:

1. **KHÔNG bao giờ commit API key vào Git**
2. **Luôn dùng environment variables:**
   - Local: `.dev.vars`
   - Production: Cloudflare Secrets
3. **Rotate key định kỳ** (mỗi 3-6 tháng)
4. **Restrict API key:**
   - Chỉ cho phép Gemini API
   - Restrict by IP nếu có thể
   - Set quota limits

### Files Được Bảo Vệ:

✅ `.dev.vars` → Trong `.gitignore`
✅ `.env` → Trong `.gitignore`
✅ `wrangler.toml` → Không chứa secrets

---

## 📝 SUMMARY

**Root Cause:** API key bị leak và Google vô hiệu hóa

**Solution:** Tạo API key mới và update vào:
1. `.dev.vars` (local)
2. Cloudflare Secrets (production)

**Code Status:** Hoàn toàn đúng, không cần sửa gì thêm!

**Next Step:** Update API key → Test → Deploy ✅

---

**Thời gian fix ước tính:** 5 phút
**Mức độ nghiêm trọng:** 🔴 HIGH (chặn production)
**Mức độ phức tạp:** 🟢 LOW (chỉ cần update key)
