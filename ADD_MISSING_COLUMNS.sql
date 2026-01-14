-- ================================================================
-- ADD MISSING COLUMNS TO ORDERS TABLE
-- Run này để thêm các columns còn thiếu
-- ================================================================

-- Add payment_method column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'qr_code';

-- Add proof_image_url column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS proof_image_url TEXT;

-- Add admin_note column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS admin_note TEXT;

-- Add updated_at column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add metadata column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS set_updated_at ON orders;
CREATE TRIGGER set_updated_at 
BEFORE UPDATE ON orders
FOR EACH ROW 
EXECUTE FUNCTION trigger_set_updated_at();

-- Verify all columns exist
SELECT 
  column_name, 
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

SELECT '✅ All columns added successfully!' as status;
