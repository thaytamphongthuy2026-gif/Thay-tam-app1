# 🔧 HƯỚNG DẪN FIX LỖI - QR PAYMENT

## ❌ LỖI HIỆN TẠI

**Triệu chứng:** Click "Nâng cấp Pro/Premium" → Bị đá về trang login

**Nguyên nhân có thể:**
1. ⚠️ Orders table chưa tạo (90% khả năng)
2. JWT token expired
3. Network issues

---

## ✅ GIẢI PHÁP - LÀM THEO THỨ TỰ

### **BƯỚC 1: RUN SQL MIGRATION (QUAN TRỌNG NHẤT)**

#### **Cách 1: Version CỰC NGẮN (Khuyến nghị)**

1. **Vào Supabase:**
   ```
   https://supabase.com/dashboard/project/jnfpxvodlmfukpagozcw
   ```

2. **Click "SQL Editor"** (sidebar bên trái)

3. **Click "+ New query"** (nút góc phải)

4. **Copy & Paste code này:**

```sql
-- Tạo bảng orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan TEXT CHECK (plan IN ('pro', 'premium')),
  amount INTEGER,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'qr_code',
  proof_image_url TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Tạo indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Security policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY p1 ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY p2 ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY p3 ON orders FOR ALL USING (auth.role() = 'service_role');

-- Permissions
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT ALL ON orders TO service_role;

-- Verify
SELECT 'OK!' as status;
```

5. **Click "Run"** hoặc nhấn **Ctrl+Enter**

6. **Kiểm tra kết quả:**
   - Thấy "OK!" → Thành công ✅
   - Có lỗi → Chụp màn hình gửi tôi

---

#### **Cách 2: Video Step-by-Step**

**Hình ảnh minh họa từng bước:**

```
┌─────────────────────────────────────────┐
│ Step 1: Mở Supabase Dashboard          │
│ https://supabase.com/dashboard         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Step 2: Chọn Project                    │
│ jnfpxvodlmfukpagozcw                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Step 3: Click "SQL Editor"              │
│ (Icon database ở sidebar)               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Step 4: Click "+ New query"             │
│ (Nút xanh góc phải)                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Step 5: Paste SQL code                  │
│ (Copy từ trên)                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Step 6: Click "Run"                     │
│ (Nút xanh dưới editor)                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Step 7: Xem kết quả                     │
│ "OK!" = Thành công ✅                    │
└─────────────────────────────────────────┘
```

---

### **BƯỚC 2: CLEAR CACHE & LOGIN LẠI**

1. **Mở trình duyệt:**
   ```
   https://6d4dae29.thaytam-phongthuy-v2.pages.dev
   ```

2. **Mở Console (F12)**

3. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   ```

4. **Reload trang (Ctrl+R)**

5. **Login lại:**
   - Email: premium@thaytam.com
   - Password: password123

---

### **BƯỚC 3: TEST QR PAYMENT**

1. **Sau khi login, vào:**
   ```
   https://6d4dae29.thaytam-phongthuy-v2.pages.dev/pricing
   ```

2. **Click "Nâng cấp Pro"**

3. **Kiểm tra:**
   - ✅ Thấy trang QR payment?
   - ✅ QR code hiển thị?
   - ✅ Bank info đúng?
   - ❌ Vẫn bị đá về login?

---

## 🔍 KIỂM TRA LỖI CHI TIẾT

### **Check 1: Orders table đã tạo chưa?**

Vào Supabase → SQL Editor → Run:

```sql
SELECT * FROM orders LIMIT 1;
```

**Kết quả:**
- ✅ "Successfully run" (dù không có data) → Table tồn tại
- ❌ "relation 'orders' does not exist" → Chưa tạo, quay lại Bước 1

---

### **Check 2: JWT token có hợp lệ không?**

1. **Mở Console (F12)**

2. **Gõ lệnh:**
   ```javascript
   localStorage.getItem('jwt_token')
   ```

3. **Kết quả:**
   - ✅ Thấy chuỗi dài (JWT token) → OK
   - ❌ null → Chưa login, cần login lại

---

### **Check 3: API có hoạt động không?**

Mở Console (F12) → Gõ:

```javascript
fetch('/api/payment/create-qr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
  },
  body: JSON.stringify({ plan: 'pro' })
})
.then(r => r.json())
.then(d => console.log('Result:', d))
.catch(e => console.error('Error:', e))
```

**Kết quả:**
- ✅ `Result: {success: true, orderId: "ORDER_..."}`  → API OK
- ❌ `Error: ...` → Copy error gửi tôi

---

## 📋 CHECKLIST HOÀN CHỈNH

### **Bạn đã làm:**
- [ ] Run SQL migration trong Supabase
- [ ] Xác nhận orders table tạo thành công
- [ ] Clear localStorage
- [ ] Login lại
- [ ] Test click "Nâng cấp Pro"

### **Nếu vẫn lỗi:**
- [ ] Check Console (F12) → Tab Console
- [ ] Screenshot error message
- [ ] Copy error text
- [ ] Gửi cho tôi

---

## 🚨 COMMON ERRORS & SOLUTIONS

### **Error 1: "relation 'orders' does not exist"**
**Nghĩa:** Orders table chưa tạo
**Giải pháp:** Run SQL migration (Bước 1)

### **Error 2: "Missing authorization token"**
**Nghĩa:** JWT token bị mất
**Giải pháp:** Login lại

### **Error 3: "Invalid API key"**
**Nghĩa:** Supabase config sai
**Giải pháp:** Check environment variables

### **Error 4: "User not found"**
**Nghĩa:** User chưa tồn tại
**Giải pháp:** Đăng ký account mới

---

## 📞 NẾU VẪN KHÔNG ĐƯỢC

**Gửi cho tôi:**

1. **Screenshot Supabase** sau khi run SQL:
   ```
   - Tab SQL Editor
   - Result window
   ```

2. **Screenshot Console error:**
   ```
   - F12 → Console tab
   - Error messages (đỏ)
   ```

3. **Test API result:**
   ```javascript
   // Copy kết quả của lệnh này:
   fetch('/api/payment/create-qr', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
     },
     body: JSON.stringify({ plan: 'pro' })
   }).then(r => r.text()).then(console.log)
   ```

4. **JWT token:**
   ```javascript
   // Copy kết quả:
   localStorage.getItem('jwt_token')
   ```

---

## ✅ SAU KHI FIX XONG

**Test flow hoàn chỉnh:**

1. ✅ Login successful
2. ✅ Go to /pricing
3. ✅ Click "Nâng cấp Pro"
4. ✅ See QR payment page
5. ✅ QR code displays
6. ✅ Bank info correct:
   - Techcombank
   - 70966668070
   - DAO QUOC CUONG
7. ✅ Amount: 299,000 VNĐ
8. ✅ Can upload screenshot

**Nếu tất cả ✅ → THÀNH CÔNG!**

---

## 🎯 QUICK FIX SCRIPT

Nếu bạn muốn test nhanh, copy toàn bộ vào Console (F12):

```javascript
// Quick test script
(async function testQRPayment() {
  console.log('=== QR Payment Test ===');
  
  // Check JWT
  const token = localStorage.getItem('jwt_token');
  console.log('1. JWT Token:', token ? 'EXISTS ✅' : 'MISSING ❌');
  
  if (!token) {
    console.log('❌ Need to login first!');
    return;
  }
  
  // Test API
  console.log('2. Testing API...');
  try {
    const response = await fetch('/api/payment/create-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan: 'pro' })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API SUCCESS!');
      console.log('Order ID:', data.orderId);
      console.log('QR Code:', data.qrCode);
      console.log('Bank:', data.bankInfo);
    } else {
      console.log('❌ API FAILED!');
      console.log('Status:', response.status);
      console.log('Error:', data);
    }
  } catch (error) {
    console.log('❌ NETWORK ERROR!');
    console.log('Error:', error);
  }
  
  console.log('=== Test Complete ===');
})();
```

---

## 📚 FILES THAM KHẢO

- **SQL Migration:** `/home/user/webapp/SIMPLIFIED_MIGRATION.sql`
- **Full Migration:** `/home/user/webapp/migrations/create_orders_qr_payment.sql`
- **Deploy Guide:** `/home/user/webapp/DEPLOY_GUIDE.md`
- **This Guide:** `/home/user/webapp/TROUBLESHOOTING.md`

---

## 🎊 SUMMARY

**3 bước quan trọng:**

1. **Run SQL** trong Supabase → Tạo orders table
2. **Clear cache** → Login lại
3. **Test payment** → Click "Nâng cấp"

**Nếu làm đúng 3 bước → HỆ THỐNG HOẠT ĐỘNG!** ✅

---

**Updated:** 2026-01-14
**Status:** Hệ thống deployed, chờ SQL migration
**URL:** https://6d4dae29.thaytam-phongthuy-v2.pages.dev
