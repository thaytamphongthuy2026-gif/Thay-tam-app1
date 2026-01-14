# 🌐 HƯỚNG DẪN: SETUP CUSTOM DOMAIN CỐ ĐỊNH

**Domain**: thaytamphongthuy.com  
**Platform**: Cloudflare Pages  
**Mục tiêu**: Link cố định không đổi sau mỗi lần deploy

---

## ❌ VẤN ĐỀ HIỆN TẠI

Mỗi lần deploy, Cloudflare tạo URL mới:
- Deploy 1: `https://abc123.thaytam-phongthuy-v2.pages.dev`
- Deploy 2: `https://xyz456.thaytam-phongthuy-v2.pages.dev`
- Deploy 3: `https://def789.thaytam-phongthuy-v2.pages.dev`

→ **Link không cố định, khó chia sẻ cho người dùng**

---

## ✅ GIẢI PHÁP: CUSTOM DOMAIN

Setup custom domain `thaytamphongthuy.com` → Link cố định không đổi

---

## 📋 BƯỚC SETUP (15 PHÚT)

### **BƯỚC 1: MUA DOMAIN (NẾU CHƯA CÓ)**

#### Option A: Mua tại Cloudflare (Khuyến nghị)
1. Vào: https://dash.cloudflare.com/domains
2. Click: **"Register Domain"**
3. Search: `thaytamphongthuy.com`
4. Add to cart → Checkout
5. **Giá**: ~$10/năm (tùy TLD)

#### Option B: Mua tại nhà cung cấp khác (Vietnix, GoDaddy, etc.)
1. Mua domain `thaytamphongthuy.com`
2. Sau đó chuyển nameserver sang Cloudflare (xem Bước 2)

---

### **BƯỚC 2: ADD DOMAIN VÀO CLOUDFLARE (NẾU MUA Ở NƠI KHÁC)**

**Nếu mua domain tại Vietnix/GoDaddy:**

1. **Vào Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Click: **"Add a Site"**

2. **Nhập Domain**
   - Domain name: `thaytamphongthuy.com`
   - Click: **"Add site"**

3. **Chọn Plan**
   - Chọn: **"Free"** (đủ dùng)
   - Click: **"Continue"**

4. **Scan DNS Records**
   - Cloudflare tự động scan DNS records hiện tại
   - Click: **"Continue"**

5. **Change Nameservers**
   - Cloudflare cung cấp 2 nameservers:
     ```
     ns1.cloudflare.com
     ns2.cloudflare.com
     ```
   - Vào Vietnix/GoDaddy:
     - DNS Settings → Nameservers
     - Thay đổi sang Cloudflare nameservers
   - **Đợi 1-24 giờ** để nameserver propagation

---

### **BƯỚC 3: ADD CUSTOM DOMAIN VÀO PAGES PROJECT**

1. **Vào Cloudflare Pages Project**
   - URL: https://dash.cloudflare.com
   - Workers & Pages → **"thaytam-phongthuy-v2"**

2. **Click "Custom domains"**
   - Tab: **"Custom domains"**
   - Click: **"Set up a custom domain"**

3. **Nhập Domain**
   - Domain: `thaytamphongthuy.com`
   - Click: **"Continue"**

4. **Add DNS Records**
   - Cloudflare tự động tạo DNS records:
     ```
     Type: CNAME
     Name: thaytamphongthuy.com
     Content: thaytam-phongthuy-v2.pages.dev
     Proxy: Enabled (Orange cloud)
     ```
   - Click: **"Activate domain"**

5. **Add WWW Subdomain (Optional)**
   - Domain: `www.thaytamphongthuy.com`
   - Click: **"Continue"**
   - Cloudflare tự động tạo:
     ```
     Type: CNAME
     Name: www
     Content: thaytam-phongthuy-v2.pages.dev
     Proxy: Enabled
     ```

6. **SSL Certificate**
   - Cloudflare tự động issue SSL certificate
   - **Đợi 5-10 phút** để SSL active
   - Status: **"Active"** (màu xanh)

---

### **BƯỚC 4: VERIFY DOMAIN**

1. **Test Domain**
   ```bash
   # Check DNS propagation
   nslookup thaytamphongthuy.com
   
   # Check website
   curl -I https://thaytamphongthuy.com
   ```

2. **Open Browser**
   - URL: https://thaytamphongthuy.com
   - Kỳ vọng: Website hiển thị
   - SSL: 🔒 Secure (màu xanh)

3. **Test WWW**
   - URL: https://www.thaytamphongthuy.com
   - Kỳ vọng: Redirect về `https://thaytamphongthuy.com`

---

### **BƯỚC 5: UPDATE REDIRECT RULES (OPTIONAL)**

**Setup 301 Redirect từ www → non-www:**

1. **Vào Cloudflare Dashboard**
   - Domain: thaytamphongthuy.com
   - Left sidebar: **"Rules"** → **"Redirect Rules"**

2. **Create Redirect Rule**
   - Rule name: `Redirect WWW to non-WWW`
   - When incoming requests match:
     ```
     Hostname equals www.thaytamphongthuy.com
     ```
   - Then:
     ```
     Type: Dynamic
     Expression: concat("https://thaytamphongthuy.com", http.request.uri.path)
     Status code: 301 (Permanent Redirect)
     ```
   - Click: **"Deploy"**

---

### **BƯỚC 6: UPDATE CODE & SITEMAP**

**Update sitemap.xml:**
```bash
cd /home/user/webapp

# Replace all URLs in sitemap.xml
sed -i 's|https://5dacb420.thaytam-phongthuy-v2.pages.dev|https://thaytamphongthuy.com|g' public/sitemap.xml

# Commit changes
git add public/sitemap.xml
git commit -m "🌐 UPDATE: Custom domain in sitemap"
git push origin main
```

**Update README.md:**
```bash
# Update production URL
sed -i 's|https://5dacb420.thaytam-phongthuy-v2.pages.dev|https://thaytamphongthuy.com|g' README.md

git add README.md
git commit -m "📝 UPDATE: Production URL to custom domain"
git push origin main
```

---

## 📊 VERIFY SETUP

### Checklist Final:

**Domain:**
- [ ] Domain purchased
- [ ] Nameservers pointed to Cloudflare
- [ ] DNS propagated (wait 1-24 hours)

**Cloudflare Pages:**
- [ ] Custom domain added: `thaytamphongthuy.com`
- [ ] WWW subdomain added (optional)
- [ ] SSL certificate active (🔒)
- [ ] DNS records created (CNAME)

**Testing:**
- [ ] https://thaytamphongthuy.com → loads website
- [ ] https://www.thaytamphongthuy.com → redirects to non-www
- [ ] SSL secure (green lock)
- [ ] All pages accessible (/blog, /pricing, /chat, etc.)

**Code Updates:**
- [ ] sitemap.xml updated
- [ ] README.md updated
- [ ] Meta tags updated (if needed)

---

## 🎯 KẾT QUẢ

**Trước khi setup:**
- ❌ URL thay đổi mỗi lần deploy
- ❌ Khó chia sẻ link
- ❌ SEO không ổn định

**Sau khi setup:**
- ✅ URL cố định: https://thaytamphongthuy.com
- ✅ Dễ nhớ, dễ chia sẻ
- ✅ SSL miễn phí (Cloudflare)
- ✅ SEO tốt hơn
- ✅ Link không đổi sau mỗi deploy

---

## 🐛 TROUBLESHOOTING

### Issue 1: Domain chưa load sau 24 giờ

**Fix:**
1. Check nameservers tại Vietnix/GoDaddy
2. Verify nameservers đã đổi sang Cloudflare
3. Check DNS propagation: https://dnschecker.org
4. Clear browser cache: Ctrl+Shift+R

---

### Issue 2: SSL Certificate chưa active

**Fix:**
1. Đợi 5-10 phút để Cloudflare issue SSL
2. Check SSL status: Cloudflare Pages → Custom domains
3. If still pending: Disable/Enable Proxy (orange cloud)
4. Check DNS: Type must be CNAME with Proxy enabled

---

### Issue 3: WWW không redirect về non-WWW

**Fix:**
1. Setup Redirect Rule (xem Bước 5)
2. Or: Add Page Rule:
   - URL: `www.thaytamphongthuy.com/*`
   - Setting: Forwarding URL (301)
   - Destination: `https://thaytamphongthuy.com/$1`

---

### Issue 4: Some pages show 404

**Fix:**
1. Check Cloudflare Pages → Functions logs
2. Verify all routes in src/App.tsx
3. Clear Cloudflare cache:
   - Caching → Configuration → Purge Everything

---

## 📞 NEXT STEPS

1. **Setup Domain** (follow steps above)
2. **Wait for DNS propagation** (1-24 hours)
3. **Test website** (https://thaytamphongthuy.com)
4. **Update sitemap & code**
5. **Submit to Google Search Console**:
   - URL: https://search.google.com/search-console
   - Add property: `https://thaytamphongthuy.com`
   - Verify domain
   - Submit sitemap: `https://thaytamphongthuy.com/sitemap.xml`

---

## 🎉 HOÀN THÀNH!

**Your website is now live at:**
- 🌐 https://thaytamphongthuy.com
- 🔒 SSL Secure
- ⚡ Cloudflare CDN
- 🚀 Link cố định không đổi

**Last Updated**: 14/01/2026  
**Status**: ✅ Ready to setup
