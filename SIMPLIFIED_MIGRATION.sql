-- ================================================================
-- ORDERS TABLE - QR CODE PAYMENT (Simplified Version)
-- Copy toàn bộ file này và paste vào Supabase SQL Editor
-- ================================================================

-- 1. Create orders table
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

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_plan ON orders(plan);

-- 3. Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can view own orders" ON orders 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON orders 
FOR ALL USING (auth.role() = 'service_role');

-- 5. Auto-update trigger
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at 
BEFORE UPDATE ON orders
FOR EACH ROW 
EXECUTE FUNCTION trigger_set_updated_at();

-- 6. Grant permissions
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT ALL ON orders TO service_role;

-- 7. Verify
SELECT '✅ Orders table created successfully!' as status;
