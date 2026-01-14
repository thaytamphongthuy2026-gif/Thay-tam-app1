# 🚀 HƯỚNG DẪN DEPLOY - QR PAYMENT SYSTEM

## 📋 OVERVIEW

System đã build thành công và sẵn sàng deploy!
- ✅ Code: 100% Complete
- ✅ Build: Successful (505KB)
- ⏳ Deploy: Pending (cần Cloudflare API key)

---

## 🎯 BƯỚC 1: CẤU HÌNH CLOUDFLARE API KEY

### **Tại sao cần?**
Wrangler cần API key để authenticate với Cloudflare Pages.

### **Cách làm:**

#### **Option A: Qua Deploy Tab (Khuyến nghị)**
1. Click vào tab **"Deploy"** ở sidebar
2. Làm theo hướng dẫn để tạo Cloudflare API token
3. Paste token vào form và Save
4. Xác nhận status: "✅ API Key Configured"

#### **Option B: Tạo thủ công**
1. Vào: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Chọn template: **"Edit Cloudflare Workers"**
4. Hoặc custom permissions:
   ```
   Account > Cloudflare Pages > Edit
   Account > Cloudflare Workers > Edit
   Zone > Workers Routes > Edit
   ```
5. Click **"Continue to summary"** → **"Create Token"**
6. **Copy token** (chỉ hiện 1 lần!)
7. Lưu vào Deploy tab

---

## 🗄️ BƯỚC 2: TẠO ORDERS TABLE TRONG SUPABASE

### **Tại sao cần?**
QR Payment system cần bảng `orders` để:
- Lưu thông tin đơn hàng
- Track trạng thái thanh toán
- Admin verification

### **Cách làm:**

1. **Vào Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/jnfpxvodlmfukpagozcw
   ```

2. **Mở SQL Editor:**
   - Click **"SQL Editor"** ở sidebar trái
   - Click **"+ New Query"**

3. **Copy toàn bộ SQL này và Run:**

```sql
-- Copy từ file: /home/user/webapp/migrations/create_orders_qr_payment.sql
-- Hoặc copy code dưới đây:

-- ================================================================
-- ORDERS TABLE MIGRATION - QR CODE PAYMENT
-- ================================================================

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'premium')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'confirmed', 'rejected', 'expired')),
  payment_method TEXT DEFAULT 'qr_code',
  proof_image_url TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_plan ON orders(plan);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role full access" ON orders FOR ALL USING (auth.role() = 'service_role');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Grant permissions
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT ALL ON orders TO service_role;

SELECT '✅ Orders table created successfully!' as status;
```

4. **Click "Run"** (hoặc Ctrl+Enter)

5. **Xác nhận kết quả:**
   - Bạn sẽ thấy: ✅ Orders table created successfully!
   - Không có lỗi nào

---

## 👤 BƯỚC 3: TẠO ADMIN ACCOUNT (TÙY CHỌN)

### **Admin emails mặc định:**
- `admin@thaytam.com`
- `cuong@thaytam.com`

### **Nếu bạn muốn thêm admin khác:**

```sql
-- Cách 1: Cập nhật email user hiện tại
UPDATE users 
SET email = 'cuong@thaytam.com'
WHERE id = 'your-user-id-here';

-- Cách 2: Hoặc thêm vào code (sau khi deploy)
-- File: /functions/api/admin/*.ts
-- Sửa: const ADMIN_EMAILS = ['admin@thaytam.com', 'your-email@domain.com']
```

---

## 🚀 BƯỚC 4: DEPLOY LÊN CLOUDFLARE PAGES

### **Sau khi hoàn thành Bước 1 & 2:**

#### **Nếu đã có API key:**

```bash
# Build (đã build rồi, nhưng có thể build lại)
cd /home/user/webapp
npm run build

# Deploy
npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2
```

#### **Nếu chưa có API key:**
1. Hoàn thành **Bước 1** trước
2. Sau đó quay lại chạy lệnh deploy

---

## ✅ BƯỚC 5: VERIFY DEPLOYMENT

### **Sau khi deploy thành công:**

1. **Check deployment URL:**
   ```
   Wrangler sẽ hiển thị:
   ✨ Deployment complete! Take a peek over at https://xxx.thaytam-phongthuy-v2.pages.dev
   ```

2. **Test homepage:**
   ```bash
   curl https://xxx.thaytam-phongthuy-v2.pages.dev
   ```

3. **Test QR payment page:**
   - Vào: `https://xxx.pages.dev/pricing`
   - Click "Nâng cấp Pro"
   - Xem QR code hiển thị đúng

4. **Test Admin dashboard:**
   - Login với: `admin@thaytam.com`
   - Vào: `https://xxx.pages.dev/admin`
   - Xem dashboard load đúng

---

## 🧪 BƯỚC 6: TEST END-TO-END

### **Test Payment Flow:**

1. **As User:**
   ```
   1. Login: premium@thaytam.com / password123
   2. Go to: /pricing
   3. Click: "Nâng cấp Pro"
   4. Verify:
      ✅ QR code hiển thị
      ✅ Bank info: Techcombank 70966668070 DAO QUOC CUONG
      ✅ Amount: 299,000 VNĐ
      ✅ Description có mã đơn hàng
   5. Simulate: Upload screenshot (any image file)
   6. Go to: /payment-status?orderId=xxx
   7. Verify: Status "Chờ xác nhận"
   ```

2. **As Admin:**
   ```
   1. Login: admin@thaytam.com
   2. Go to: /admin
   3. Check Overview: Stats hiển thị đúng
   4. Check Orders: Thấy đơn "Chờ xác nhận"
   5. Click: "Xác nhận"
   6. View: Proof image
   7. Confirm: Nhập note (optional)
   8. Verify: Order status → "Đã xác nhận"
   ```

3. **Verify Auto-Upgrade:**
   ```
   - User plan: free → pro
   - Quotas: 50 ngày + 10 tử vi + 100 chat
   - plan_expiry: +30 days from now
   - Order status: confirmed
   ```

---

## 📊 MONITORING & LOGS

### **Check Cloudflare Logs:**

```bash
# Real-time logs
npx wrangler pages tail thaytam-phongthuy-v2

# Or check on dashboard:
https://dash.cloudflare.com/pages
```

### **Check Supabase Logs:**
```
https://supabase.com/dashboard/project/jnfpxvodlmfukpagozcw/logs
```

### **Key metrics to monitor:**
- Order creation rate
- Upload success rate
- Admin verification time
- User upgrade success rate

---

## ⚠️ TROUBLESHOOTING

### **Issue 1: Build fails**
```bash
# Clean and rebuild
cd /home/user/webapp
rm -rf node_modules dist
npm install
npm run build
```

### **Issue 2: Deploy fails (API key)**
```
✘ [ERROR] In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN

Solution:
1. Go to Deploy tab
2. Configure API key
3. Try deploy again
```

### **Issue 3: Orders table not found**
```sql
-- Check if table exists
SELECT * FROM information_schema.tables WHERE table_name = 'orders';

-- If not exists, run migration again (Bước 2)
```

### **Issue 4: Admin can't access dashboard**
```
Error: Unauthorized

Solution:
1. Check admin email in code:
   /functions/api/admin/*.ts
   const ADMIN_EMAILS = ['admin@thaytam.com', 'cuong@thaytam.com']
   
2. Make sure you're logged in with admin email

3. Check JWT token is valid
```

### **Issue 5: QR code không hiển thị**
```
Check:
1. Bank account configured correctly in:
   /functions/api/payment/create-qr.ts
   
2. VietQR API is accessible:
   https://img.vietqr.io/
   
3. Network tab shows QR image loads
```

---

## 🔐 SECURITY CHECKLIST

Before going live:

- ✅ Cloudflare API key stored securely
- ✅ Supabase RLS policies enabled
- ✅ Admin emails configured
- ✅ JWT tokens validated
- ✅ CORS configured properly
- ✅ Image upload validated (type, size)
- ⚠️ TODO: Add rate limiting (already implemented in KV)
- ⚠️ TODO: Add CAPTCHA on proof upload
- ⚠️ TODO: Add email notifications

---

## 📈 POST-DEPLOYMENT

### **After successful deployment:**

1. **Update documentation:**
   - Add production URL to README.md
   - Update QR_PAYMENT_COMPLETE.md

2. **Notify team:**
   - Share admin dashboard URL
   - Share testing guide
   - Share admin credentials

3. **Monitor first orders:**
   - Watch for errors
   - Check response times
   - Verify auto-upgrade works

4. **Gather feedback:**
   - Ask users about UX
   - Check admin workflow
   - Improve based on feedback

---

## 🎯 SUCCESS CRITERIA

Deployment is successful when:

- ✅ Homepage loads
- ✅ Users can create QR payments
- ✅ QR code displays with correct bank info
- ✅ Users can upload proof screenshots
- ✅ Admin can view orders dashboard
- ✅ Admin can verify payments
- ✅ User plans upgrade automatically
- ✅ No errors in logs

---

## 📞 SUPPORT

**If you encounter issues:**

1. **Check logs:** Cloudflare + Supabase
2. **Check database:** Orders table exists
3. **Check API key:** Configured properly
4. **Contact support:** Provide error logs

**Common commands:**

```bash
# Check build
npm run build

# Check deploy
npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2

# Check logs
npx wrangler pages tail thaytam-phongthuy-v2

# Test local
pm2 start ecosystem.config.cjs
curl http://localhost:3000
```

---

## 🎊 READY TO DEPLOY!

**Status:**
- ✅ Code: Complete
- ✅ Build: Success
- ✅ Docs: Complete
- ⏳ API Key: Pending
- ⏳ Database: Pending
- ⏳ Deploy: Pending

**Next action:**
1. Configure Cloudflare API key (Deploy tab)
2. Run database migration (Supabase)
3. Deploy! 🚀

---

**Created:** 2026-01-14
**Last Updated:** 2026-01-14
**Status:** Ready for deployment
**Time to deploy:** ~10 minutes after API key setup
