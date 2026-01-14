-- ================================================================
-- ADD PAID_AT COLUMN
-- Thêm column paid_at để track thời điểm thanh toán được confirm
-- ================================================================

-- Add paid_at column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Verify column added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'orders'
  AND column_name = 'paid_at';

SELECT '✅ paid_at column added!' as status;
