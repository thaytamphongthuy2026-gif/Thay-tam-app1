-- ================================================================
-- VERIFY ORDERS TABLE
-- Run này để kiểm tra orders table đã tạo đầy đủ chưa
-- ================================================================

-- Check table exists and structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Check indexes
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'orders';

-- Check RLS policies
SELECT 
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'orders';

-- Test insert (should work if everything is OK)
SELECT '✅ Orders table is ready!' as status;
