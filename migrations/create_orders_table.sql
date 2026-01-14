-- ================================================================
-- ORDERS TABLE MIGRATION
-- Project: Thầy Tám Phong Thủy 2026
-- Purpose: Payment order tracking and management
-- Date: 2026-01-14
-- ================================================================

-- ================================================================
-- 1. CREATE ORDERS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS orders (
  -- Primary key
  id TEXT PRIMARY KEY,
  
  -- Foreign keys
  user_id UUID NOT NULL,
  
  -- Order details
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'premium')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  
  -- Order status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
  
  -- Payment details
  transaction_id TEXT,
  payment_method TEXT DEFAULT 'vnpay',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Foreign key constraint
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
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

-- Index on transaction_id (lookup by VNPay transaction)
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id 
  ON orders(transaction_id) 
  WHERE transaction_id IS NOT NULL;

-- ================================================================
-- 3. ADD COMMENTS FOR DOCUMENTATION
-- ================================================================

COMMENT ON TABLE orders IS 'Payment orders for plan upgrades (Pro/Premium)';
COMMENT ON COLUMN orders.id IS 'Unique order ID (format: ORDER_{user_id}_{timestamp})';
COMMENT ON COLUMN orders.user_id IS 'User who created the order';
COMMENT ON COLUMN orders.plan IS 'Plan type: pro or premium';
COMMENT ON COLUMN orders.amount IS 'Order amount in VND';
COMMENT ON COLUMN orders.status IS 'Order status: pending, paid, failed, expired';
COMMENT ON COLUMN orders.transaction_id IS 'VNPay transaction ID (from IPN callback)';
COMMENT ON COLUMN orders.payment_method IS 'Payment gateway used (default: vnpay)';
COMMENT ON COLUMN orders.created_at IS 'Order creation timestamp';
COMMENT ON COLUMN orders.paid_at IS 'Payment completion timestamp';
COMMENT ON COLUMN orders.expired_at IS 'Order expiration timestamp (pending orders)';
COMMENT ON COLUMN orders.metadata IS 'Additional order metadata (JSON)';

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
  successful_orders BIGINT,
  pending_orders BIGINT,
  failed_orders BIGINT,
  last_order_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_orders,
    COALESCE(SUM(amount), 0)::INTEGER as total_spent,
    COUNT(*) FILTER (WHERE status = 'paid')::BIGINT as successful_orders,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_orders,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failed_orders,
    MAX(created_at) as last_order_date
  FROM orders
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Expire old pending orders (run daily)
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
    expired_at = NOW()
  WHERE 
    status = 'pending'
    AND created_at < NOW() - INTERVAL '24 hours'
  RETURNING COUNT(*) INTO v_count;
  
  RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 6. CREATE TRIGGERS
-- ================================================================

-- Trigger: Auto-expire orders after 24 hours
CREATE OR REPLACE FUNCTION trigger_expire_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.created_at < NOW() - INTERVAL '24 hours' THEN
    NEW.status := 'expired';
    NEW.expired_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_expire_order
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_expire_order();

-- ================================================================
-- 7. INSERT SAMPLE DATA (FOR TESTING)
-- ================================================================

-- NOTE: Uncomment below to insert sample data
-- Replace 'your-user-id' with actual user UUID from auth.users

/*
-- Sample Pro order (pending)
INSERT INTO orders (id, user_id, plan, amount, status)
VALUES (
  'ORDER_SAMPLE_PRO_' || extract(epoch from now())::TEXT,
  'your-user-id',
  'pro',
  299000,
  'pending'
);

-- Sample Premium order (paid)
INSERT INTO orders (id, user_id, plan, amount, status, transaction_id, paid_at)
VALUES (
  'ORDER_SAMPLE_PREMIUM_' || extract(epoch from now())::TEXT,
  'your-user-id',
  'premium',
  999000,
  'paid',
  'VNPAY_' || extract(epoch from now())::TEXT,
  NOW()
);
*/

-- ================================================================
-- 8. GRANT PERMISSIONS
-- ================================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT ON orders TO authenticated;

-- Grant full access to service_role (backend)
GRANT ALL ON orders TO service_role;

-- ================================================================
-- 9. CREATE VIEWS FOR ANALYTICS
-- ================================================================

-- View: Revenue summary by plan
CREATE OR REPLACE VIEW revenue_by_plan AS
SELECT 
  plan,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'paid') as paid_orders,
  SUM(amount) FILTER (WHERE status = 'paid') as total_revenue,
  AVG(amount) FILTER (WHERE status = 'paid') as average_order_value,
  MIN(created_at) as first_order_date,
  MAX(created_at) as last_order_date
FROM orders
GROUP BY plan;

-- View: Recent orders (last 100)
CREATE OR REPLACE VIEW recent_orders AS
SELECT 
  o.id,
  o.user_id,
  u.email,
  o.plan,
  o.amount,
  o.status,
  o.transaction_id,
  o.created_at,
  o.paid_at
FROM orders o
LEFT JOIN auth.users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 100;

-- View: Daily revenue summary
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'paid') as paid_orders,
  SUM(amount) FILTER (WHERE status = 'paid') as daily_revenue,
  COUNT(DISTINCT user_id) FILTER (WHERE status = 'paid') as unique_customers
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- ================================================================
-- 10. VERIFICATION QUERIES
-- ================================================================

-- Check table structure
SELECT 
  table_name, 
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
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'orders';

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================

-- Expected result:
-- ✅ orders table created
-- ✅ 6 indexes created for performance
-- ✅ RLS policies enabled
-- ✅ Helper functions created
-- ✅ Triggers configured
-- ✅ Analytics views created
-- ✅ Permissions granted

-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify table creation
-- 3. Test payment flow
-- 4. Monitor order creation

SELECT 'Orders table migration completed successfully! ✅' as status;
