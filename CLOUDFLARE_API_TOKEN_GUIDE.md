# 🔑 HƯỚNG DẪN: LẤY CLOUDFLARE API TOKEN & ACCOUNT ID

## 📋 BƯỚC 1: LẤY CLOUDFLARE ACCOUNT ID

1. **Login Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Email: thaytamphongthuy2026@gmail.com

2. **Vào Pages Project**
   - Left sidebar → **Workers & Pages**
   - Click vào project: **thaytam-phongthuy-v2**

3. **Copy Account ID**
   - URL bar sẽ có dạng: `https://dash.cloudflare.com/<ACCOUNT_ID>/pages/view/thaytam-phongthuy-v2`
   - Copy phần `<ACCOUNT_ID>` (32 ký tự hex)
   
   **HOẶC:**
   
   - Click vào avatar (góc phải trên)
   - Click: **"My Profile"**
   - Left sidebar → **"API Tokens"**
   - Scroll xuống → Section **"Account ID"**
   - Click: **"Copy"**

---

## 📋 BƯỚC 2: TẠO CLOUDFLARE API TOKEN

1. **Vào API Tokens page**
   - URL: https://dash.cloudflare.com/profile/api-tokens
   - Hoặc: Avatar → My Profile → API Tokens

2. **Create Token**
   - Click: **"Create Token"**

3. **Use Template: "Edit Cloudflare Workers"**
   - Tìm template: **"Edit Cloudflare Workers"**
   - Click: **"Use template"**

4. **Configure Token Permissions**
   
   **Account Resources:**
   ```
   Account > Cloudflare Pages > Edit
   ```

   **Zone Resources:**
   ```
   Include > All zones (hoặc specific zone nếu có)
   ```

5. **Continue to Summary**
   - Review permissions
   - Click: **"Continue to summary"**

6. **Create Token**
   - Click: **"Create Token"**

7. **Copy Token**
   - Token sẽ hiện 1 lần duy nhất
   - Click: **"Copy"** và lưu vào nơi an toàn
   - Token có dạng: `aBcD1234eFgH5678...` (40+ ký tự)

---

## 📋 BƯỚC 3: ADD SECRETS VÀO GITHUB

1. **Vào GitHub Repository**
   - URL: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1
   - Tab: **Settings**

2. **Add Secrets**
   - Left sidebar → **Secrets and variables** → **Actions**
   - Click: **"New repository secret"**

3. **Add CLOUDFLARE_API_TOKEN**
   ```
   Name: CLOUDFLARE_API_TOKEN
   Value: <paste_token_from_step_2>
   ```
   - Click: **"Add secret"**

4. **Add CLOUDFLARE_ACCOUNT_ID**
   ```
   Name: CLOUDFLARE_ACCOUNT_ID
   Value: <paste_account_id_from_step_1>
   ```
   - Click: **"Add secret"**

5. **Add các secrets còn lại** (nếu chưa có)
   ```
   SUPABASE_URL
   SUPABASE_SERVICE_KEY
   SUPABASE_JWT_SECRET
   GEMINI_API_KEY
   ```

---

## 📋 BƯỚC 4: TEST AUTO-DEPLOY

1. **Push code to GitHub**
   ```bash
   cd /home/user/webapp
   git add .
   git commit -m "Setup: GitHub Actions auto-deploy"
   git push origin main
   ```

2. **Check GitHub Actions**
   - GitHub repo → Tab: **"Actions"**
   - Sẽ thấy workflow: **"Deploy to Cloudflare Pages"**
   - Status: 🔄 Running → ✅ Success (2-3 phút)

3. **Check Cloudflare Deployments**
   - Cloudflare Dashboard → thaytam-phongthuy-v2 → **Deployments**
   - Sẽ thấy deployment mới từ GitHub Actions

---

## ✅ CHECKLIST

**Cloudflare:**
- [ ] Lấy Account ID
- [ ] Tạo API Token (Edit Cloudflare Workers template)
- [ ] Copy token (lưu an toàn)

**GitHub:**
- [ ] Add CLOUDFLARE_API_TOKEN secret
- [ ] Add CLOUDFLARE_ACCOUNT_ID secret
- [ ] Add SUPABASE_URL secret
- [ ] Add SUPABASE_SERVICE_KEY secret
- [ ] Add SUPABASE_JWT_SECRET secret
- [ ] Add GEMINI_API_KEY secret

**Test:**
- [ ] Push commit to GitHub
- [ ] Check GitHub Actions → workflow running
- [ ] Check Cloudflare → new deployment
- [ ] Test new URL

---

## 🎯 KẾT QUẢ

**Sau khi setup xong:**
- ✅ Push code to GitHub → Auto-deploy (2-3 phút)
- ✅ GitHub Actions build & deploy
- ✅ Cloudflare Pages update tự động
- ✅ No manual `wrangler deploy` needed

---

**Last Updated**: 14/01/2026  
**Status**: ✅ Ready to use
