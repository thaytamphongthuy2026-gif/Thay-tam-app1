# 🚀 HƯỚNG DẪN DEPLOY LÊN CLOUDFLARE PAGES

## ✅ CODE ĐÃ SẴN SÀNG
- Commit mới nhất: `c7ab73f`
- GitHub: https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1
- Sandbox: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat

---

## 🔑 BƯỚC 1: LẤY CLOUDFLARE API TOKEN

### **Cách A: Qua Deploy Tab (Dễ nhất)**
1. Click **Deploy tab** bên sidebar
2. Follow hướng dẫn setup
3. Paste API token → Save
4. Quay lại đây để deploy!

### **Cách B: Thủ công**
1. Vào: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Chọn template **"Edit Cloudflare Workers"**
4. Permissions:
   - `Account` → `Cloudflare Pages` → `Edit`
5. Click **"Create Token"**
6. **Copy token** (chỉ hiện 1 lần!)

---

## 📦 BƯỚC 2: DEPLOY BẰNG WRANGLER

### **Option A: Qua GenSpark (sau khi setup Deploy tab)**
```bash
# Tôi sẽ chạy lệnh này sau khi bạn setup xong:
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2
```

### **Option B: Trên máy local của bạn**
```bash
# Clone repo về
git clone https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1.git
cd Thay-tam-app1

# Install dependencies
npm install

# Login Cloudflare
npx wrangler login

# Build & Deploy
npm run build
npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2
```

---

## 🎯 BƯỚC 3: XÁC NHẬN DEPLOYMENT

Sau khi deploy thành công, bạn sẽ nhận được URL:
- **Production**: `https://thaytam-phongthuy-v2.pages.dev`
- **Branch**: `https://main.thaytam-phongthuy-v2.pages.dev`

---

## 📋 CHECKLIST

- [ ] Setup Cloudflare API token qua Deploy tab
- [ ] Deploy lên Cloudflare Pages
- [ ] Test production URL
- [ ] Xác nhận các tính năng hoạt động:
  - [ ] Chat mode (Quick + Book)
  - [ ] RAG animation hiển thị 3 quyển sách
  - [ ] Mobile UI tối ưu
  - [ ] Xưng hô nhất quán
  - [ ] Không có lỗi timeout

---

## 🐛 TROUBLESHOOTING

### **Lỗi: "Authentication failed"**
→ Token hết hạn hoặc sai permissions
→ Tạo token mới với đúng permissions

### **Lỗi: "Project not found"**
→ Chưa tạo project trên Cloudflare
→ Chạy: `npx wrangler pages project create thaytam-phongthuy-v2`

### **Lỗi: "Build failed"**
→ Kiểm tra `npm run build` locally trước
→ Fix lỗi rồi deploy lại

---

## 💡 LƯU Ý

- ⚠️ **KHÔNG commit API token vào Git**
- 🔄 Rotate token mỗi 90 ngày
- 📊 Monitor deployment logs tại Cloudflare dashboard
- 🚀 Sau deploy, GitHub Actions sẽ tự động deploy các lần sau (nếu đã setup secrets)

---

## 📞 NEXT STEPS

Sau khi deploy xong:
1. Test production URL
2. Setup GitHub secrets cho auto-deploy (optional)
3. Monitor error logs
4. Thu thập user feedback

**Deploy ngay bây giờ?** → Setup Deploy tab → Quay lại đây! 🚀
