# 🔧 QR PAYMENT DEBUG GUIDE

**NEW Deployment**: https://ae1bb386.thaytam-phongthuy-v2.pages.dev

---

## ✅ Fixed Issues

### 1. Header Not Showing Username - FIXED ✅
**Problem**: User logged in but name not displayed
**Solution**: Fallback to email username if name is null

```typescript
// Before: {user.name}
// After: {user.name || user.email?.split('@')[0] || 'User'}
```

### 2. QR Payment Still Failing - NEEDS YOUR ACTION ⚠️

---

## 🚨 CRITICAL: QR Payment Fix Checklist

### Step 1: Verify Supabase Service Key (CRITICAL!)

1. **Get the CORRECT service key from Supabase:**
   ```
   Supabase Dashboard → Settings → API
   → Copy "service_role" key (NOT "anon public" key!)
   ```

2. **Update in Cloudflare:**
   ```
   Cloudflare Dashboard → Workers & Pages
   → thaytam-phongthuy-v2
   → Settings → Variables and Secrets
   → Edit SUPABASE_SERVICE_KEY
   → Paste the service_role key
   → IMPORTANT: Click "Save" then click "Redeploy"
   ```

3. **MUST Redeploy after changing env var:**
   ```
   Cloudflare Dashboard → Deployments
   → Click "..." on latest deployment
   → Click "Retry deployment"
   ```

### Step 2: Run RLS Fix SQL (REQUIRED!)

Copy and run this in Supabase SQL Editor:

```sql
-- Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Service role full access" ON orders;
DROP POLICY IF EXISTS "service_role_all_orders" ON orders;
DROP POLICY IF EXISTS "users_select_own_orders" ON orders;
DROP POLICY IF EXISTS "users_insert_own_orders" ON orders;

-- Create fresh policies
CREATE POLICY "users_select_own_orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- CRITICAL: Service role MUST bypass RLS
CREATE POLICY "service_role_all_orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify policies exist
SELECT 
  policyname,
  cmd,
  roles::text,
  CASE 
    WHEN roles::text LIKE '%service_role%' THEN '✅ GOOD'
    ELSE '❌ MISSING service_role!'
  END as status
FROM pg_policies
WHERE tablename = 'orders';
```

**Expected result**: You should see `service_role_all_orders` with status `✅ GOOD`

### Step 3: Test Insert Manually

Run this in Supabase SQL Editor to test if RLS is working:

```sql
-- Test 1: Manual insert (should work)
INSERT INTO orders (
  id, 
  user_id, 
  plan, 
  amount, 
  status, 
  payment_method,
  created_at
)
SELECT 
  'TEST_MANUAL_' || floor(random() * 10000)::text,
  id,
  'pro',
  68000,
  'pending',
  'qr_code',
  NOW()
FROM auth.users 
LIMIT 1;

-- Test 2: Check if order was created
SELECT * FROM orders WHERE id LIKE 'TEST_MANUAL_%';

-- Test 3: Clean up test orders
DELETE FROM orders WHERE id LIKE 'TEST_MANUAL_%';
```

If this works, RLS is OK. If fails, RLS is the problem.

---

## 🔍 Debug QR Payment (If Still Failing)

### Check Cloudflare Logs

1. Go to: https://dash.cloudflare.com
2. Select: `thaytam-phongthuy-v2` → Deployments
3. Click latest deployment → View logs
4. Look for:
   ```
   📝 Creating order: { orderId, userId, plan, amount }
   ✅ Order created successfully
   OR
   ❌ Failed to create order: { error details }
   ```

### Test QR Payment API Directly

Use this curl command (replace JWT_TOKEN):

```bash
# Get your JWT token:
# 1. Login to https://ae1bb386.thaytam-phongthuy-v2.pages.dev
# 2. DevTools Console → localStorage.getItem('jwt_token')

curl -X POST https://ae1bb386.thaytam-phongthuy-v2.pages.dev/api/payment/create-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"plan":"pro"}' \
  | jq .
```

**Expected success response:**
```json
{
  "success": true,
  "orderId": "ORDER_xxx",
  "qrCode": "https://...",
  "bankInfo": {...}
}
```

**If error:**
```json
{
  "error": "Database permission error...",
  "details": "RLS policy blocking...",
  "status": 403
}
```

---

## 🎯 Common Issues & Solutions

### Issue 1: "Missing authorization token"
- **Cause**: JWT expired or not saved
- **Fix**: Logout and login again

### Issue 2: "Database permission error"
- **Cause**: RLS policy missing or wrong
- **Fix**: Run Step 2 SQL again

### Issue 3: "Failed to create order" (500)
- **Cause**: Wrong SUPABASE_SERVICE_KEY
- **Fix**: 
  1. Double-check service key in Supabase Settings → API
  2. Update in Cloudflare
  3. **Redeploy** (critical!)

### Issue 4: Order created but empty table
- **Cause**: RLS blocking SELECT
- **Fix**: Check `users_select_own_orders` policy exists

---

## 📊 Verification Steps

After fixes, verify these:

### 1. Login Works ✓
- Go to https://ae1bb386.thaytam-phongthuy-v2.pages.dev/login
- Login with thaytamphongthuy2026@gmail.com
- Should see your email/name in header

### 2. QR Payment Works ✓
- Go to /pricing
- Click "Mua ngay"
- Should see QR code (NO "Failed to create order" error)

### 3. Orders Table Populated ✓
- Go to Supabase → Table Editor → orders
- Should see new orders appearing

### 4. Admin Dashboard Works ✓
- Go to /admin
- Should see orders list

---

## 🆘 If Nothing Works

Run this diagnostic SQL:

```sql
-- 1. Check if orders table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'orders'
);

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 3. Check RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'orders';

-- 4. List all policies
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- 5. Check if service_role policy exists
SELECT COUNT(*) as has_service_role_policy
FROM pg_policies
WHERE tablename = 'orders'
AND roles::text LIKE '%service_role%';
```

Share results with me if still stuck!

---

**Current Production**: https://ae1bb386.thaytam-phongthuy-v2.pages.dev
**Admin Dashboard**: https://ae1bb386.thaytam-phongthuy-v2.pages.dev/admin
