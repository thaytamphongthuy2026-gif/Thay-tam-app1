# 🚀 QUICK START: AUTO-DEPLOY TỪ GITHUB

**Mục tiêu**: Mỗi khi edit code trong GitHub → Website tự động update

---

## 📋 TÓM TẮT VẤN ĐỀ

### ❌ Trước đây:
1. Edit file trong GitHub repo `Thay-tam-app1`
2. Cloudflare **KHÔNG update** website
3. Build failed ở Cloudflare

### ✅ Giải pháp:
- Setup **GitHub Actions** để auto-deploy
- Push code → GitHub Actions build → Deploy to Cloudflare

---

## 🔧 BƯỚC SETUP (5 PHÚT)

### **BƯỚC 1: LẤY CLOUDFLARE CREDENTIALS**

#### 1.1 Lấy Account ID
1. Login: https://dash.cloudflare.com
2. Click avatar (góc phải) → **"My Profile"**
3. Left sidebar → **"API Tokens"**
4. Scroll down → **Account ID** → Click **"Copy"**
5. Lưu lại: `<ACCOUNT_ID>` (32 ký tự hex)

#### 1.2 Tạo API Token
1. Trên cùng trang → Click **"Create Token"**
2. Tìm template: **"Edit Cloudflare Workers"** → Click **"Use template"**
3. Review permissions → Click **"Continue to summary"**
4. Click **"Create Token"**
5. **QUAN TRỌNG**: Copy token ngay (chỉ hiện 1 lần!)
6. Lưu lại: `<API_TOKEN>` (40+ ký tự)

---

### **BƯỚC 2: ADD SECRETS VÀO GITHUB**

1. **Vào GitHub Repository**
   - URL: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1
   - Tab: **"Settings"**

2. **Add Secrets**
   - Left sidebar → **"Secrets and variables"** → **"Actions"**
   - Click: **"New repository secret"** (7 lần)

3. **Add 7 secrets** (copy/paste values):

```
Secret 1:
Name: CLOUDFLARE_API_TOKEN
Value: <paste_api_token_from_step_1.2>

Secret 2:
Name: CLOUDFLARE_ACCOUNT_ID
Value: <paste_account_id_from_step_1.1>

Secret 3:
Name: SUPABASE_URL
Value: https://jnfpxvodlmfukpagozcw.supabase.co

Secret 4:
Name: SUPABASE_SERVICE_KEY
Value: <your_supabase_service_key>

Secret 5:
Name: SUPABASE_JWT_SECRET
Value: <your_supabase_jwt_secret>

Secret 6:
Name: GEMINI_API_KEY
Value: <your_gemini_api_key>

Secret 7 (auto-provided, skip):
Name: GITHUB_TOKEN
Value: (GitHub tự tạo, không cần add)
```

---

### **BƯỚC 3: PUSH CODE & TEST**

1. **Push commit test**
   - Edit bất kỳ file nào trong repo (ví dụ: `README.md`)
   - Commit & push to `main` branch

2. **Check GitHub Actions**
   - GitHub repo → Tab **"Actions"**
   - Sẽ thấy workflow: **"Deploy to Cloudflare Pages"**
   - Status: 🔄 Running → ✅ Success (2-3 phút)

3. **Check Cloudflare Deployments**
   - Cloudflare Dashboard → Project `thaytam-phongthuy-v2`
   - Tab **"Deployments"**
   - Sẽ thấy deployment mới với commit message

4. **Test new URL**
   - GitHub Actions output → Copy URL mới
   - Test: `https://xyz.thaytam-phongthuy-v2.pages.dev`

---

## ✅ WORKFLOW SAU KHI SETUP

```bash
# Option A: Edit trực tiếp trên GitHub UI
1. Vào GitHub repo
2. Click file cần edit (ví dụ: src/pages/Home.tsx)
3. Click icon ✏️ (edit)
4. Edit code
5. Commit changes → push to main
6. GitHub Actions tự động deploy (2-3 phút)

# Option B: Edit local → push
1. git clone repo
2. Edit code
3. git add . && git commit -m "Update"
4. git push origin main
5. GitHub Actions tự động deploy (2-3 phút)
```

---

## 📊 MONITORING

### Check Deployment Status:

**GitHub Actions:**
- URL: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1/actions
- See: Workflow runs, logs, success/failure status

**Cloudflare Pages:**
- URL: https://dash.cloudflare.com → thaytam-phongthuy-v2 → Deployments
- See: All deployments, URLs, commit messages

---

## 🐛 TROUBLESHOOTING

### Issue 1: GitHub Actions failed với "Authentication error"

**Fix**: Check secrets trong GitHub
1. Settings → Secrets and variables → Actions
2. Verify: CLOUDFLARE_API_TOKEN và CLOUDFLARE_ACCOUNT_ID đã add chưa
3. Nếu chưa → Add lại (follow Bước 2)

---

### Issue 2: Build failed với "Module not found"

**Fix**: Thiếu dependencies
1. Check `package.json` có đầy đủ dependencies
2. GitHub Actions logs → Xem error chi tiết
3. Local test: `npm install && npm run build`

---

### Issue 3: Deployment thành công nhưng website lỗi 500

**Fix**: Thiếu environment variables
1. GitHub Settings → Secrets
2. Add đầy đủ 6 secrets (SUPABASE_URL, SERVICE_KEY, JWT_SECRET, GEMINI_API_KEY)

---

### Issue 4: Push lên GitHub nhưng không trigger Actions

**Fix**: Check workflow file
1. Verify file tồn tại: `.github/workflows/deploy.yml`
2. Check branch trigger: `branches: - main`
3. Đảm bảo push to `main` branch (không phải `master`)

---

## ✅ CHECKLIST FINAL

**Cloudflare:**
- [ ] Account ID copied
- [ ] API Token created và copied

**GitHub:**
- [ ] CLOUDFLARE_API_TOKEN secret added
- [ ] CLOUDFLARE_ACCOUNT_ID secret added
- [ ] SUPABASE_URL secret added
- [ ] SUPABASE_SERVICE_KEY secret added
- [ ] SUPABASE_JWT_SECRET secret added
- [ ] GEMINI_API_KEY secret added

**Test:**
- [ ] Push commit test
- [ ] GitHub Actions running → success
- [ ] Cloudflare Pages deployment success
- [ ] New URL accessible
- [ ] Website works (no 500 errors)

---

## 🎯 KẾT QUẢ

**Sau khi setup xong:**
- ✅ Push code → Auto-deploy (2-3 phút)
- ✅ No manual `wrangler deploy` needed
- ✅ Check deployment status trong GitHub Actions
- ✅ Monitor URLs trong Cloudflare Pages
- ✅ Edit code trực tiếp trên GitHub UI → auto-update website

---

## 📞 NEXT STEPS

1. **Follow Bước 1-3** (setup trong 5 phút)
2. **Test push commit** để verify auto-deploy
3. **Enjoy automatic deployments!** 🎉

---

**Files liên quan:**
- `AUTO_DEPLOY_GITHUB_GUIDE.md` - Hướng dẫn chi tiết đầy đủ
- `CLOUDFLARE_API_TOKEN_GUIDE.md` - Hướng dẫn lấy API token
- `.github/workflows/deploy.yml` - GitHub Actions workflow file

**Last Updated**: 14/01/2026  
**Status**: ✅ Ready to use
