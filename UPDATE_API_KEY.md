# 🔑 Hướng Dẫn Cập Nhật GEMINI_API_KEY

## 🚨 TẠI SAO CẦN UPDATE?

**Lỗi hiện tại:**
```
"Your API key was reported as leaked. Please use another API key."
```

Google đã phát hiện API key bị leak và vô hiệu hóa nó. Bạn cần tạo key mới.

---

## ⚡ QUICK FIX (5 phút)

### 1. Tạo API Key Mới

**👉 Đi tới:** https://aistudio.google.com/app/apikey

1. Click **"Create API Key"**
2. Chọn project (hoặc tạo mới)
3. Copy API key mới (dạng: `AIzaSy...`)

### 2. Update Local Development

**Mở file `.dev.vars` và sửa:**
```env
GEMINI_API_KEY=AIzaSy_YOUR_NEW_KEY_HERE
```

⚠️ **Lưu ý:** File này đã có trong `.gitignore` (an toàn)

### 3. Restart Dev Server

```bash
cd /home/user/webapp
pm2 restart webapp
```

### 4. Test

```bash
# Run test script
./test-gemini.sh

# Or test manually
curl -X POST http://localhost:3000/api/gemini-stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"prompt":"Xin chào","quotaType":"chat","useRag":false}'
```

### 5. Update Production

**Option A: Via Wrangler CLI**
```bash
npx wrangler pages secret put GEMINI_API_KEY --project-name thaytam-phongthuy-v2
# Paste your new API key when prompted
```

**Option B: Via Cloudflare Dashboard**
1. Đi tới: https://dash.cloudflare.com/
2. Pages → `thaytam-phongthuy-v2`
3. Settings → Environment variables
4. Edit `GEMINI_API_KEY`
5. Paste new key
6. Save (auto-deploys)

---

## ✅ VERIFICATION

### Local Testing

```bash
# Run automated tests
./test-gemini.sh

# Expected output:
# ✅ .dev.vars found
# ✅ Server is running
# ✅ Gemini API Key is valid
# ✅ Streaming endpoint is responding
```

### Production Testing

1. Đi tới: https://thaytam-phongthuy-v2.pages.dev/chat
2. Login: `premium@thaytam.com`
3. Gửi tin nhắn: "Xin chào Thầy Tám"
4. Kiểm tra streaming response (text từng chunk)

### Features to Test

- ✅ `/chat` - Quick mode (⚡) và Book mode (📚)
- ✅ `/xem-ngay-tot` - Xem ngày tốt cho khai trương/cưới hỏi
- ✅ `/tu-vi` - Tử vi năm 2026
- ✅ `/lich-phong-thuy` - Lịch tháng + chi tiết ngày
- ✅ `/xong-dat` - Phân tích người xông đất

---

## 🔐 BẢO MẬT API KEY

### DO's ✅

- ✅ Lưu trong `.dev.vars` (local)
- ✅ Lưu trong Cloudflare Secrets (production)
- ✅ Restrict API key permissions
- ✅ Rotate key định kỳ (3-6 tháng)

### DON'Ts ❌

- ❌ KHÔNG commit vào Git
- ❌ KHÔNG share công khai
- ❌ KHÔNG hardcode trong source code
- ❌ KHÔNG để trong frontend code

### Restrict API Key (khuyên dùng)

1. Đi tới: https://console.cloud.google.com/apis/credentials
2. Chọn API key của bạn
3. Application restrictions:
   - HTTP referrers: `*.pages.dev`, `thaytamphongthuy.com`
   - Or IP addresses: Your server IPs
4. API restrictions:
   - Chỉ enable: **Generative Language API**
5. Save

---

## 📊 CURRENT STATUS

**Code:**
- ✅ Model: `gemini-3-flash-preview` (LATEST)
- ✅ Endpoints: `/api/gemini-stream`, `/api/gemini`
- ✅ RAG: Supported
- ✅ Streaming: Implemented
- ✅ GitHub: Synced (commit `5a2fe75`)

**Deployment:**
- 🔴 API Key: **NEEDS UPDATE**
- 🟢 Code: Ready
- 🟢 Build: Success

**URLs:**
- Dev: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai
- Production: https://thaytam-phongthuy-v2.pages.dev
- GitHub: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1

---

## 🆘 TROUBLESHOOTING

### "API key still invalid"

- Đợi 1-2 phút sau khi tạo key mới
- Check key đã được restrict đúng scope
- Verify key đã copy đúng (không có space)

### "Still getting 500 error"

```bash
# Check PM2 logs
pm2 logs webapp --lines 50 | grep -i error

# Restart with fresh environment
pm2 delete webapp
pm2 start ecosystem.config.cjs
```

### "Production not updating"

```bash
# Force re-deploy
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2
```

---

## 📞 SUPPORT

**Files tham khảo:**
- `URGENT_FIX_REQUIRED.md` - Chi tiết vấn đề
- `test-gemini.sh` - Script test tự động
- `.dev.vars.example` - Template cho environment variables

**Thời gian fix:** ~5 phút
**Mức độ:** 🔴 CRITICAL (blocking production)
**Độ khó:** 🟢 EASY (chỉ cần update key)

---

**Last Updated:** 2026-01-16
**Status:** ⚠️ WAITING FOR NEW API KEY
