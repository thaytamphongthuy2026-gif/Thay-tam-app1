# 🎯 QR PAYMENT FIX - Step by Step

**Deployment**: https://fa69afbb.thaytam-phongthuy-v2.pages.dev

---

## ⚠️ CRITICAL ISSUE: QR Payment 500 Error

### Problem
- User clicks "Mua gói Pro/Premium"
- Error: `Failed to create order (500)`
- Orders table exists but is empty

### Root Cause
**RLS (Row Level Security) blocking service role inserts**

The Cloudflare Worker uses `SUPABASE_SERVICE_KEY` to insert orders, but RLS policies are blocking it.

---

## ✅ SOLUTION: Fix RLS Policies

### Step 1: Run SQL Fix (REQUIRED)

Open Supabase SQL Editor and run this:

```sql
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Service role full access" ON orders;

-- Create correct policies
CREATE POLICY "users_select_own_orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- CRITICAL: Service role must bypass RLS
CREATE POLICY "service_role_all_orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

**Or use the complete script**: `fix-orders-rls.sql`

---

## 🧪 Step 2: Test QR Payment

### Option A: Use Test Script

```bash
# Get your JWT token first
# 1. Login to https://fa69afbb.thaytam-phongthuy-v2.pages.dev
# 2. Open DevTools Console
# 3. Run: localStorage.getItem('jwt_token')
# 4. Copy token

./test-qr-payment.sh YOUR_JWT_TOKEN
```

### Option B: Manual Test

1. Login with `thaytamphongthuy2026@gmail.com`
2. Go to `/pricing`
3. Click "Mua ngay" for any plan
4. Should see QR code page (no 500 error)

---

## 📊 How to Check Logs

### Cloudflare Worker Logs
1. Go to: https://dash.cloudflare.com
2. Select: `thaytam-phongthuy-v2` project
3. View: Real-time logs
4. Look for:
   - `📝 Creating order:` (request details)
   - `✅ Order created successfully` (success)
   - `❌ Failed to create order` (error details)

### Supabase Logs
1. Go to Supabase Dashboard
2. Logs → API Logs
3. Filter: `POST /rest/v1/orders`
4. Check status codes

---

## 🔍 What's Fixed

### Enhanced Error Messages
Now when QR payment fails, you'll see:
```json
{
  "error": "Database permission error. Please check Supabase RLS policies.",
  "details": "The service role should bypass RLS. Check if SUPABASE_SERVICE_KEY is correct.",
  "technicalError": "...",
  "status": 403
}
```

### Better Logging
- Request details logged before insert
- Response headers included in errors
- RLS detection with helpful hints
- Service key validation check

---

## ✅ Expected Behavior After Fix

### Success Flow
1. User clicks "Mua ngay" → Redirects to `/qr-payment?plan=pro`
2. API creates order → Returns 200 with QR code
3. User sees:
   - QR code image
   - Bank details (Techcombank 70966668070)
   - Transfer amount (68,000đ for Pro)
   - Order ID
   - Upload button for payment proof

### If Still Fails
Check these in order:

1. **SUPABASE_SERVICE_KEY correct?**
   ```bash
   # In Cloudflare dashboard
   Settings → Environment Variables
   # Should match Supabase Project Settings → API → service_role key
   ```

2. **Orders table columns match?**
   ```sql
   -- Run in Supabase
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'orders';
   
   -- Should have: id, user_id, plan, amount, status, payment_method, etc.
   ```

3. **Service role policy exists?**
   ```sql
   SELECT policyname, roles::text
   FROM pg_policies 
   WHERE tablename = 'orders' 
   AND roles::text LIKE '%service_role%';
   
   -- Should return: service_role_all_orders
   ```

---

## 📝 Summary of All Fixes

| Fix | Status | Impact |
|-----|--------|--------|
| Chat Speed (Disabled RAG) | ✅ DONE | HIGH |
| Feng Shui Algorithm | ✅ DONE | MEDIUM |
| QR Payment Logging | ✅ DONE | HIGH |
| RLS Fix Script | ✅ READY | CRITICAL |

**Next**: Run `fix-orders-rls.sql` in Supabase SQL Editor

---

## 🎯 Quick Commands

```bash
# Test QR payment
./test-qr-payment.sh YOUR_JWT_TOKEN

# Check git status
git status

# View recent commits
git log --oneline -5

# Deploy
npm run build && npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2
```

---

**Production URL**: https://fa69afbb.thaytam-phongthuy-v2.pages.dev
**Admin URL**: https://fa69afbb.thaytam-phongthuy-v2.pages.dev/admin
