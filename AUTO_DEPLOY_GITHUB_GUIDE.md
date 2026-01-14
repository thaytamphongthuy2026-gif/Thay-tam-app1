# 🚀 HƯỚNG DẪN: AUTO-DEPLOY TỪ GITHUB LÊN CLOUDFLARE PAGES

**Mục tiêu**: Mỗi khi push code lên GitHub → Cloudflare tự động build & deploy

---

## 📋 BƯỚC 1: CONNECT GITHUB VỚI CLOUDFLARE

### 1.1 Vào Cloudflare Dashboard

1. **Login Cloudflare**
   - URL: https://dash.cloudflare.com
   - Email: thaytamphongthuy2026@gmail.com

2. **Vào Pages**
   - Left sidebar → **"Workers & Pages"**
   - Tab → **"Pages"**

3. **Tìm Project**
   - Tìm: **"thaytam-phongthuy-v2"**
   - Click vào project name

---

### 1.2 Connect to Git Repository

**Cách A: Nếu chưa có Git connection**

1. **Click "Settings"**
   - Tab → **"Settings"** (góc trên)

2. **Connect to Git**
   - Section: **"Build & deployments"**
   - Subsection: **"Source"**
   - Click: **"Connect to Git"**

3. **Authorize GitHub**
   - Popup: "Authorize Cloudflare Pages"
   - Click: **"Authorize Cloudflare-Pages"**
   - Login GitHub (nếu chưa login)

4. **Select Repository**
   - Organization: **"thaytamphongthuy2026-gif"**
   - Repository: **"Thay-tam-app1"**
   - Click: **"Select"**

5. **Configure Build**
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - Framework preset: **"None"** (hoặc Vite)

6. **Environment Variables** (QUAN TRỌNG!)
   ```
   SUPABASE_URL=https://jnfpxvodlmfukpagozcw.supabase.co
   SUPABASE_SERVICE_KEY=<your_service_key>
   SUPABASE_JWT_SECRET=<your_jwt_secret>
   GEMINI_API_KEY=<your_gemini_key>
   ```

7. **Save & Deploy**
   - Click: **"Save and Deploy"**
   - Cloudflare sẽ trigger build đầu tiên

---

**Cách B: Nếu đã có Git connection (nhưng sai repo)**

1. **Settings → Build & deployments → Source**
2. Click: **"Disconnect"** (disconnect repo cũ)
3. Click: **"Connect to Git"** again
4. Chọn repo đúng: **"Thay-tam-app1"**
5. Configure build như Cách A

---

## 📋 BƯỚC 2: VERIFY AUTO-DEPLOY

### 2.1 Test Push to GitHub

1. **Local machine - Make a small change**
   ```bash
   cd /home/user/webapp
   
   # Edit file (ví dụ: thêm comment)
   echo "// Test auto-deploy" >> src/pages/Home.tsx
   
   # Commit & push
   git add .
   git commit -m "Test: Auto-deploy from GitHub"
   git push origin main
   ```

2. **Check Cloudflare Dashboard**
   - Vào: Cloudflare Pages → thaytam-phongthuy-v2
   - Tab: **"Deployments"**
   - Đợi 30 giây, sẽ thấy:
     ```
     🔄 Building... (main branch)
     📦 Deploying...
     ✅ Success! (2-3 phút)
     ```

3. **Verify new URL**
   - Cloudflare sẽ tạo URL mới: `https://abc123.thaytam-phongthuy-v2.pages.dev`
   - Test: `curl https://abc123.thaytam-phongthuy-v2.pages.dev/`

---

## 📋 BƯỚC 3: FIX BUILD FAILED (NẾU CÓ)

### Lỗi thường gặp:

#### A. "Module not found" hoặc "npm install failed"

**Nguyên nhân**: Cloudflare không có access đến dependencies

**Giải pháp:**
1. Check `package.json` có đầy đủ dependencies không
2. Cloudflare Settings → **Environment variables**
3. Add: `NODE_VERSION = 18` (hoặc 20)

---

#### B. "Build command not found"

**Nguyên nhân**: Build command sai hoặc không có

**Giải pháp:**
1. Settings → **Build & deployments**
2. Build command: `npm run build` (PHẢI có trong package.json)
3. Build output: `dist`

---

#### C. "Permission denied" hoặc "API key error"

**Nguyên nhân**: Thiếu environment variables

**Giải pháp:**
1. Settings → **Environment variables**
2. Add tất cả secrets (như đã list ở Bước 1.2)
3. **QUAN TRỌNG**: Phải add cho **Production** environment

---

#### D. "Wrangler build failed"

**Nguyên nhân**: wrangler.toml config sai

**Giải pháp:**
1. Check file `wrangler.toml`:
   ```toml
   name = "thaytam-phongthuy-v2"
   compatibility_date = "2024-01-01"
   pages_build_output_dir = "dist"
   ```

2. Đảm bảo `pages_build_output_dir = "dist"` (không phải "build")

---

## 📋 BƯỚC 4: SETUP PRODUCTION DOMAIN

### 4.1 Add Custom Domain (Optional)

1. **Cloudflare Pages → Settings → Custom domains**
2. Click: **"Set up a custom domain"**
3. Enter: `thaytamphongthuy.com`
4. Cloudflare sẽ tự động:
   - Add DNS records
   - Issue SSL certificate (5-10 phút)

---

## 🎯 WORKFLOW SAU KHI SETUP

### Local Development:
```bash
# 1. Code changes
vim src/pages/Home.tsx

# 2. Test local (optional)
npm run dev

# 3. Commit & push
git add .
git commit -m "Feature: Update homepage"
git push origin main

# 4. Cloudflare tự động:
#    - Detect push
#    - npm install
#    - npm run build
#    - Deploy to production
#    - New URL: https://xyz.thaytam-phongthuy-v2.pages.dev
```

### No need to run manually:
- ❌ `npm run build` (Cloudflare làm)
- ❌ `npx wrangler pages deploy` (Cloudflare làm)

---

## 📊 MONITORING DEPLOYMENTS

### Check Deployment Status:

1. **Cloudflare Dashboard → Deployments tab**
   - See all deployments history
   - Status: Success ✅ / Failed ❌
   - Deployment time
   - Commit message
   - URL for each deployment

2. **GitHub Actions (if enabled)**
   - GitHub repo → Actions tab
   - See Cloudflare Pages deployment workflow

---

## 🆘 TROUBLESHOOTING

### Issue: Push lên GitHub nhưng Cloudflare không build

**Check:**
1. Cloudflare Pages → Settings → Build & deployments
2. **Production branch** phải là `main` (đúng với branch bạn push)
3. **Automatic deployments** phải **Enabled**

**Fix:**
- Nếu disabled: Click **"Enable automatic deployments"**

---

### Issue: Build failed với error "Cannot find module"

**Solution:**
1. Local test build:
   ```bash
   cd /home/user/webapp
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. Nếu build OK local → issue là Cloudflare environment
3. Add environment variables đầy đủ (Bước 1.2)

---

### Issue: Deployment thành công nhưng website lỗi 500

**Check:**
1. Cloudflare Pages → Functions logs
2. Xem error message (thường là missing secrets)
3. Add missing environment variables

---

## ✅ CHECKLIST FINAL

**GitHub Connection:**
- [ ] Cloudflare Pages connected to Thay-tam-app1 repo
- [ ] Production branch: `main`
- [ ] Build command: `npm run build`
- [ ] Build output: `dist`

**Environment Variables (Production):**
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_KEY
- [ ] SUPABASE_JWT_SECRET
- [ ] GEMINI_API_KEY

**Auto-Deploy Test:**
- [ ] Push test commit to GitHub
- [ ] Cloudflare triggers build automatically
- [ ] Deployment success
- [ ] New URL accessible

**Optional:**
- [ ] Custom domain: thaytamphongthuy.com
- [ ] SSL certificate issued
- [ ] DNS records added

---

## 📞 NEXT STEPS

1. **Setup Git connection** (follow Bước 1)
2. **Test auto-deploy** (follow Bước 2)
3. **Fix any errors** (follow Bước 3)
4. **Enjoy automatic deployments!** 🎉

---

**Sau khi setup xong:**
- Push code → Auto deploy (2-3 phút)
- No manual `wrangler deploy` needed
- Check deployment status in Cloudflare Dashboard

---

**Last Updated**: 14/01/2026  
**Status**: ✅ Ready to use
