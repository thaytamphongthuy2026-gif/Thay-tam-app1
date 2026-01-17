# 🔐 CLOUDFLARE AUTO-DEPLOY SETUP

**Status**: ⚠️ DISABLED (Missing API Token)  
**Current Deploy Method**: Manual via `wrangler`

---

## 🚨 ISSUE

GitHub Actions đang fail với error:
```
Error: Input required and not supplied: apiToken
```

**Root Cause**: Missing GitHub Secrets:
- `CLOUDFLARE_API_TOKEN` ❌
- `CLOUDFLARE_ACCOUNT_ID` ❌

---

## ✅ SOLUTION: CẤU HÌNH GITHUB SECRETS

### Step 1: Lấy Cloudflare API Token

1. Vào: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Chọn template: **"Edit Cloudflare Workers"** hoặc tự custom
4. **Permissions** (tối thiểu):
   ```
   Account > Cloudflare Pages > Edit
   ```
5. Click **"Continue to summary"** → **"Create Token"**
6. **COPY TOKEN NGAY** (chỉ hiện 1 lần!)

**Example token**:
```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

### Step 2: Lấy Cloudflare Account ID

1. Vào: https://dash.cloudflare.com/
2. Chọn bất kỳ site/project nào
3. Ở sidebar bên phải, tìm **"Account ID"**
4. Click **Copy**

**Example Account ID**:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

### Step 3: Thêm Secrets vào GitHub

1. Vào repository: 
   ```
   https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1/settings/secrets/actions
   ```

2. Click **"New repository secret"**

3. Thêm **Secret #1**:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: (paste token từ Step 1)
   - Click **"Add secret"**

4. Thêm **Secret #2**:
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: (paste ID từ Step 2)
   - Click **"Add secret"**

---

### Step 4: Re-enable GitHub Actions

Sau khi đã thêm secrets, chạy:

```bash
cd /home/user/webapp

# Move workflow file back
mv .github/workflows-disabled/deploy.yml.disabled .github/workflows/deploy.yml

# Commit
git add .github/
git commit -m "🚀 Re-enable auto-deploy (secrets configured)"
git push origin main
```

**Done!** GitHub Actions sẽ tự động deploy mỗi khi push code.

---

## 🛠️ MANUAL DEPLOY (CURRENT METHOD)

Vì auto-deploy đang tắt, bạn cần deploy thủ công:

### Prerequisites:
1. Cloudflare API token đã setup trong sandbox:
   ```bash
   # Check if token exists
   wrangler whoami
   ```

2. Nếu chưa có, gọi tool:
   ```bash
   # This will setup CLOUDFLARE_API_TOKEN
   setup_cloudflare_api_key
   ```

### Deploy Command:

```bash
cd /home/user/webapp

# 1. Build
npm run build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2

# 3. Done! Check URL in output
```

**Expected Output**:
```
✨ Success! Uploaded 15 files (3.2 sec)
✨ Deployment complete! Take a peek over at https://abc123.thaytam-phongthuy-v2.pages.dev
```

---

## 📊 COMPARISON: Auto vs Manual Deploy

| Method | Speed | Setup | When to Use |
|--------|-------|-------|-------------|
| **Auto (GitHub Actions)** | 3-5 min | One-time setup | Production |
| **Manual (wrangler)** | 30 sec | No setup needed | Development |

**Recommendation**: 
- **Development**: Use manual deploy (faster feedback)
- **Production**: Setup auto-deploy (consistency)

---

## 🔄 WORKFLOW STATUS

### Current Status:
```
GitHub Push → ❌ No Auto-Deploy
Manual Deploy → ✅ Working (via wrangler)
```

### After Setup:
```
GitHub Push → ✅ Auto-Deploy (3-5 min)
Manual Deploy → ✅ Still available
```

---

## 🧪 TEST AUTO-DEPLOY

After re-enabling, test it:

```bash
# 1. Make a small change
echo "// Test deploy" >> src/lib/prompts.ts

# 2. Commit and push
git add .
git commit -m "test: auto-deploy"
git push origin main

# 3. Check GitHub Actions
# Go to: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1/actions

# 4. Wait for green checkmark ✅
# 5. Check deployment URL
```

---

## 🐛 TROUBLESHOOTING

### Error: "apiToken not found"
- **Fix**: Add `CLOUDFLARE_API_TOKEN` to GitHub Secrets

### Error: "accountId not found"
- **Fix**: Add `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets

### Error: "Project not found"
- **Fix**: Create project first via `wrangler pages project create`

### Error: "Authentication failed"
- **Fix**: Token expired → create new token

---

## 📝 NOTES

1. **API Token Security**:
   - ⚠️ NEVER commit token to code
   - ✅ Always use GitHub Secrets
   - ✅ Rotate token every 90 days

2. **Account ID**:
   - ✅ Safe to expose (not secret)
   - But still use Secrets for consistency

3. **Workflow File**:
   - Currently: `.github/workflows-disabled/deploy.yml.disabled`
   - After setup: `.github/workflows/deploy.yml`

---

## ✅ CHECKLIST

Before re-enabling auto-deploy:

- [ ] Cloudflare API Token obtained
- [ ] Cloudflare Account ID obtained
- [ ] `CLOUDFLARE_API_TOKEN` added to GitHub Secrets
- [ ] `CLOUDFLARE_ACCOUNT_ID` added to GitHub Secrets
- [ ] Workflow file moved back to `workflows/`
- [ ] Test push to main branch
- [ ] Check GitHub Actions pass ✅
- [ ] Verify deployment URL works

---

## 🔗 USEFUL LINKS

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **API Tokens**: https://dash.cloudflare.com/profile/api-tokens
- **GitHub Secrets**: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1/settings/secrets/actions
- **GitHub Actions**: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1/actions
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/

---

**Current Deployment Method**: ✅ **MANUAL** (working)  
**Goal**: ✅ **AUTO** (needs setup)  
**Status**: ⏳ **PENDING** (waiting for secrets)
