# 🔐 HƯỚNG DẪN BẢO MẬT API KEY - TRÁNH LEAK

## ⚠️ TẠI SAO API KEY BỊ LEAK?

### Nguyên nhân phổ biến:

1. **Commit vào Git history** ❌
   - Hardcode trong source code
   - Commit file `.env` hoặc `.dev.vars`
   - Lưu trong config files không có trong `.gitignore`

2. **Share công khai** ❌
   - Paste trong chat/email/Slack không mã hóa
   - Upload lên pastebin/gist
   - Screenshot có chứa key

3. **Lưu không an toàn** ❌
   - Lưu trong frontend code (JavaScript)
   - Để trong URL parameters
   - Log ra console/terminal

---

## ✅ GIẢI PHÁP HOÀN CHỈNH

### 1. Sử Dụng Environment Variables

**✅ ĐÚNG:**
```typescript
// functions/api/gemini-stream.ts
const apiKey = env.GEMINI_API_KEY  // Từ environment variable
```

**❌ SAI:**
```typescript
// NEVER DO THIS!
const apiKey = "AIzaSy..."  // Hardcoded
```

### 2. Git Configuration

**File: `.gitignore`**
```gitignore
# Environment variables - CRITICAL!
.env
.env.*
.dev.vars
.wrangler/

# Secrets
secrets/
*.key
*.pem

# Local config
config.local.js
.local

# Build artifacts
node_modules/
dist/
.cache/

# Logs (có thể chứa keys)
*.log
logs/
```

**Verify `.gitignore` hoạt động:**
```bash
# Check nếu .dev.vars đã được ignore
git status

# Output mong đợi: .dev.vars KHÔNG xuất hiện trong danh sách
```

### 3. Git History Cleanup (NẾU ĐÃ COMMIT KEY)

**⚠️ Nếu key đã commit vào Git:**

```bash
# Option 1: Xóa file khỏi Git history (recommended)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .dev.vars" \
  --prune-empty --tag-name-filter cat -- --all

# Option 2: Sử dụng BFG Repo-Cleaner (nhanh hơn)
# Download từ: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .dev.vars
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (cẩn thận!)
git push origin --force --all
```

**⚠️ QUAN TRỌNG:** Sau khi xóa key khỏi Git history, key cũ vẫn bị leak! Phải tạo key mới!

### 4. Restrict API Key Permissions

**Đi tới:** https://console.cloud.google.com/apis/credentials

**Chọn API key → Edit:**

#### A. Application Restrictions
```
✅ HTTP referrers (websites)
   - https://thaytam-phongthuy-v2.pages.dev/*
   - https://*.pages.dev/*
   - https://thaytamphongthuy.com/*
   - https://www.thaytamphongthuy.com/*
```

#### B. API Restrictions
```
✅ Restrict key
   - Chỉ enable: Generative Language API
   - Disable tất cả APIs khác
```

#### C. Set Quotas (khuyên dùng)
```
✅ Rate Limiting:
   - Queries per minute: 60
   - Queries per day: 1500
   
   (Ngăn chặn abuse nếu key bị lộ)
```

### 5. Development vs Production Keys

**Chiến lược tốt nhất: Sử dụng 2 keys riêng biệt**

**Development Key:**
- Restrict: localhost, *.sandbox.novita.ai
- Lower quota (500 requests/day)
- Easier to rotate

**Production Key:**
- Restrict: Production domains only
- Higher quota (10,000 requests/day)
- Stored in Cloudflare Secrets

**File structure:**
```
.dev.vars              # Development key (local)
.gitignore             # Must include .dev.vars
Cloudflare Secrets     # Production key (cloud)
```

### 6. Cloudflare Pages Secrets

**✅ Production secrets (AN TOÀN):**

```bash
# Set secret qua Wrangler
echo "YOUR_KEY" | npx wrangler pages secret put GEMINI_API_KEY \
  --project-name thaytam-phongthuy-v2

# Hoặc qua Dashboard:
# https://dash.cloudflare.com/
# → Pages → thaytam-phongthuy-v2
# → Settings → Environment variables
```

**Lợi ích:**
- ✅ Không lưu trong Git
- ✅ Encrypted at rest
- ✅ Chỉ accessible trong runtime
- ✅ Có thể rotate dễ dàng

### 7. Code Review Checklist

**Trước mỗi commit, check:**

```bash
# 1. Search for hardcoded keys
grep -r "AIzaSy" . --exclude-dir=node_modules --exclude-dir=.git

# 2. Check staged files
git diff --cached | grep -i "api.*key\|secret\|password"

# 3. Verify .gitignore
git ls-files --others --ignored --exclude-standard | grep -E "\.env|\.dev\.vars"

# Output mong đợi: Không có keys hoặc .dev.vars
```

### 8. Pre-commit Hook (Tự động kiểm tra)

**File: `.git/hooks/pre-commit`**
```bash
#!/bin/bash

# Check for API keys in staged files
if git diff --cached | grep -E "AIzaSy|sk-[a-zA-Z0-9]{48}"; then
    echo "❌ ERROR: API key detected in staged files!"
    echo "Remove the key and use environment variables instead."
    exit 1
fi

# Check if .dev.vars is staged
if git diff --cached --name-only | grep -E "\.dev\.vars|\.env"; then
    echo "❌ ERROR: Environment file detected in commit!"
    echo "These files should be in .gitignore"
    exit 1
fi

echo "✅ No secrets detected. Commit allowed."
exit 0
```

**Make executable:**
```bash
chmod +x .git/hooks/pre-commit
```

### 9. Monitoring & Alerts

**Setup Google Cloud Monitoring:**

```bash
# Enable Cloud Monitoring API
gcloud services enable monitoring.googleapis.com

# Create alert for unusual API usage
# → Google Cloud Console
# → Monitoring → Alerting
# → Create Policy:
#    - Condition: API requests > 100/minute
#    - Notification: Email/SMS
```

### 10. Key Rotation Schedule

**Lịch rotate key định kỳ:**

- **Development:** Mỗi 1 tháng
- **Production:** Mỗi 3 tháng
- **After leak:** Ngay lập tức!

**Process:**
```bash
# 1. Tạo key mới
# 2. Update .dev.vars (dev)
# 3. Update Cloudflare Secret (prod)
# 4. Test cả 2 environments
# 5. Revoke key cũ sau 7 ngày (grace period)
```

---

## 🚨 EMERGENCY RESPONSE - NẾU KEY BỊ LEAK

### Hành động ngay lập tức:

1. **Revoke key ngay:**
   - https://console.cloud.google.com/apis/credentials
   - Chọn key → Delete

2. **Tạo key mới:**
   - Create API Key
   - Restrict permissions
   - Update ngay

3. **Scan Git history:**
   ```bash
   git log -p | grep "AIzaSy"
   ```

4. **Clean Git history nếu cần:**
   ```bash
   # Sử dụng BFG hoặc filter-branch (xem phần 3)
   ```

5. **Force push (cẩn thận):**
   ```bash
   git push origin --force --all
   ```

6. **Notify team:**
   - Thông báo key bị leak
   - Yêu cầu tất cả pull code mới

---

## ✅ CHECKLIST BẢO MẬT

### Trước khi deploy:

- [ ] `.dev.vars` có trong `.gitignore`
- [ ] Không có hardcoded keys trong source code
- [ ] API key đã được restrict (HTTP referrers + API restrictions)
- [ ] Production key khác development key
- [ ] Cloudflare Secrets đã được set
- [ ] Pre-commit hook đã được cài đặt
- [ ] Team đã được training về bảo mật

### Hàng tháng:

- [ ] Review API usage logs
- [ ] Check cho unusual spikes
- [ ] Rotate development key
- [ ] Verify restrictions vẫn hoạt động

### Hàng quý:

- [ ] Rotate production key
- [ ] Audit codebase cho secrets
- [ ] Review access logs
- [ ] Update security policies

---

## 📚 RESOURCES

**Tools:**
- [git-secrets](https://github.com/awslabs/git-secrets) - Prevent secrets commits
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - Clean Git history
- [truffleHog](https://github.com/trufflesecurity/trufflehog) - Find secrets in Git repos

**Documentation:**
- [Google Cloud API Keys Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/environment-variables/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## 📊 PROJECT STATUS

**Current Setup:**

✅ **Local Development:**
- File: `.dev.vars` (in `.gitignore`)
- Key: Development key với restrictions
- Server: PM2 với environment reload

✅ **Production:**
- Storage: Cloudflare Pages Secrets
- Key: Production key với stricter restrictions
- Deployment: Automatic secret injection

✅ **Security:**
- Pre-commit hook: Enabled
- API restrictions: Configured
- Rate limiting: 60 requests/minute
- Monitoring: Google Cloud Alerts

---

## 🎯 SUMMARY

**Để tránh leak API key:**

1. ✅ **NEVER commit keys to Git**
2. ✅ **Always use environment variables**
3. ✅ **Add pre-commit hooks**
4. ✅ **Restrict API key permissions**
5. ✅ **Use separate dev/prod keys**
6. ✅ **Rotate keys regularly**
7. ✅ **Monitor API usage**
8. ✅ **Train team on security**

**Files quan trọng:**
- ✅ `.gitignore` → Phải có `.dev.vars`, `.env`
- ✅ `.dev.vars` → Local secrets only
- ✅ `Cloudflare Secrets` → Production secrets
- ✅ `.git/hooks/pre-commit` → Auto-check secrets

---

**Key mới đã được cập nhật và hoạt động! 🎉**

**Thời điểm rotate tiếp:** 2026-04-16 (3 tháng sau)
