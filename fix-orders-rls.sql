-- ====================================
-- FIX: Orders Table RLS Issue
-- ====================================
-- Run this in Supabase SQL Editor

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Service role full access" ON orders;
DROP POLICY IF EXISTS "Service role bypass RLS" ON orders;

-- Step 2: Create proper policies

-- Policy 1: Users can view their own orders
CREATE POLICY "users_select_own_orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own orders
CREATE POLICY "users_insert_own_orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: CRITICAL - Service role bypasses RLS
-- This is needed for API to work with SUPABASE_SERVICE_KEY
CREATE POLICY "service_role_all_orders"
  ON orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 3: Verify policies
SELECT 
  policyname,
  cmd,
  roles::text,
  CASE 
    WHEN roles::text LIKE '%service_role%' THEN '✅ Service role policy'
    WHEN qual LIKE '%auth.uid()%' THEN '✅ User policy'
    ELSE '⚠️ Check this policy'
  END as status
FROM pg_policies
WHERE tablename = 'orders';

-- Step 4: Test insert (this should work)
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get first user ID
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- Test insert
  INSERT INTO orders (
    id, 
    user_id, 
    plan, 
    amount, 
    status, 
    payment_method, 
    created_at
  ) VALUES (
    'TEST_ORDER_' || floor(random() * 1000000),
    test_user_id,
    'pro',
    68000,
    'pending',
    'qr_code',
    NOW()
  );
  
  RAISE NOTICE '✅ Test insert successful!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Test insert failed: %', SQLERRM;
END $$;

-- Step 5: Check if test order was created
SELECT 
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE id LIKE 'TEST_%') as test_orders
FROM orders;

-- Step 6: Clean up test orders (optional)
-- DELETE FROM orders WHERE id LIKE 'TEST_%';
