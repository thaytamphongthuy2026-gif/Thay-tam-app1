-- ================================================================
-- ORDERS TABLE MIGRATION - QR CODE PAYMENT
-- Project: Thầy Tám Phong Thủy 2026
-- Purpose: QR Code payment order tracking and management
-- Date: 2026-01-14
-- ================================================================

-- ================================================================
-- 1. CREATE ORDERS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS orders (
  -- Primary key
  id TEXT PRIMARY KEY,
  
  -- Foreign keys
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Order details
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'premium')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  
  -- Order status for QR Payment
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'confirmed', 'rejected', 'expired')),
  
  -- Payment details
  payment_method TEXT DEFAULT 'qr_code',
  proof_image_url TEXT,
  admin_note TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Index on user_id (most common query: get orders by user)
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
  ON orders(user_id);

-- Index on status (filter by order status)
CREATE INDEX IF NOT EXISTS idx_orders_status 
  ON orders(status);

-- Index on created_at (sort by date, recent orders)
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
  ON orders(created_at DESC);

-- Composite index for user orders by status
CREATE INDEX IF NOT EXISTS idx_orders_user_status 
  ON orders(user_id, status);

-- Index on plan (analytics by plan)
CREATE INDEX IF NOT EXISTS idx_orders_plan 
  ON orders(plan);

-- ================================================================
-- 3. ADD COMMENTS FOR DOCUMENTATION
-- ================================================================

COMMENT ON TABLE orders IS 'QR Code payment orders for plan upgrades (Pro/Premium)';
COMMENT ON COLUMN orders.id IS 'Unique order ID (format: ORDER_{user_id}_{timestamp})';
COMMENT ON COLUMN orders.user_id IS 'User who created the order';
COMMENT ON COLUMN orders.plan IS 'Plan type: pro or premium';
COMMENT ON COLUMN orders.amount IS 'Order amount in VND (299000 or 999000)';
COMMENT ON COLUMN orders.status IS 'Order status: pending, uploaded, confirmed, rejected, expired';
COMMENT ON COLUMN orders.payment_method IS 'Payment method (qr_code)';
COMMENT ON COLUMN orders.proof_image_url IS 'URL of uploaded payment proof screenshot';
COMMENT ON COLUMN orders.admin_note IS 'Admin note for confirmation/rejection';
COMMENT ON COLUMN orders.created_at IS 'Order creation timestamp';
COMMENT ON COLUMN orders.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN orders.metadata IS 'Additional order metadata (bank info, etc.)';

-- ================================================================
-- 4. CREATE ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can do everything (for backend)
CREATE POLICY "Service role full access"
  ON orders
  FOR ALL
  USING (auth.role() = 'service_role');

-- ================================================================
-- 5. CREATE HELPER FUNCTIONS
-- ================================================================

-- Function: Get order statistics by user
CREATE OR REPLACE FUNCTION get_user_order_stats(p_user_id UUID)
RETURNS TABLE (
  total_orders BIGINT,
  total_spent INTEGER,
  confirmed_orders BIGINT,
  pending_orders BIGINT,
  rejected_orders BIGINT,
  last_order_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_orders,
    COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed'), 0)::INTEGER as total_spent,
    COUNT(*) FILTER (WHERE status = 'confirmed')::BIGINT as confirmed_orders,
    COUNT(*) FILTER (WHERE status IN ('pending', 'uploaded'))::BIGINT as pending_orders,
    COUNT(*) FILTER (WHERE status = 'rejected')::BIGINT as rejected_orders,
    MAX(created_at) as last_order_date
  FROM orders
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Expire old pending orders (run daily via cron)
CREATE OR REPLACE FUNCTION expire_pending_orders()
RETURNS TABLE (
  expired_count BIGINT
) AS $$
DECLARE
  v_count BIGINT;
BEGIN
  UPDATE orders
  SET 
    status = 'expired',
    updated_at = NOW()
  WHERE 
    status IN ('pending', 'uploaded')
    AND created_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 6. CREATE TRIGGERS
-- ================================================================

-- Trigger: Auto-update updated_at timestamp
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

-- ================================================================
-- 7. GRANT PERMISSIONS
-- ================================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT ON orders TO authenticated;

-- Grant full access to service_role (backend)
GRANT ALL ON orders TO service_role;

-- ================================================================
-- 8. CREATE VIEWS FOR ANALYTICS
-- ================================================================

-- View: Revenue summary by plan
CREATE OR REPLACE VIEW revenue_by_plan AS
SELECT 
  plan,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_orders,
  SUM(amount) FILTER (WHERE status = 'confirmed') as total_revenue,
  AVG(amount) FILTER (WHERE status = 'confirmed') as average_order_value,
  MIN(created_at) as first_order_date,
  MAX(created_at) as last_order_date
FROM orders
GROUP BY plan;

-- View: Recent orders with user info (for admin)
CREATE OR REPLACE VIEW recent_orders AS
SELECT 
  o.id,
  o.user_id,
  u.email,
  o.plan,
  o.amount,
  o.status,
  o.payment_method,
  o.proof_image_url,
  o.admin_note,
  o.created_at,
  o.updated_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 100;

-- View: Daily revenue summary
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_orders,
  COUNT(*) FILTER (WHERE status IN ('pending', 'uploaded')) as pending_orders,
  SUM(amount) FILTER (WHERE status = 'confirmed') as daily_revenue,
  COUNT(DISTINCT user_id) FILTER (WHERE status = 'confirmed') as unique_customers
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- ================================================================
-- 9. VERIFICATION QUERIES
-- ================================================================

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
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
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'orders';

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================

SELECT '✅ Orders table migration for QR Code Payment completed successfully!' as status;

-- Expected result:
-- ✅ orders table created with QR payment fields
-- ✅ 5 indexes created for performance
-- ✅ RLS policies enabled
-- ✅ Helper functions created
-- ✅ Triggers configured (auto updated_at)
-- ✅ Analytics views created
-- ✅ Permissions granted

-- Next steps:
-- 1. Test order creation: POST /api/payment/create-qr
-- 2. Test proof upload: POST /api/payment/upload-proof
-- 3. Test admin verification: POST /api/admin/verify-payment
-- 4. Monitor orders in admin dashboard: /admin
