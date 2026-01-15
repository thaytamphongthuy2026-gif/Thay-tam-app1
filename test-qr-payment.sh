#!/bin/bash

# Test QR Payment API
# This script helps debug the orders table issue

echo "======================================"
echo "🧪 Testing QR Payment API"
echo "======================================"
echo ""

# Check if JWT token is provided
if [ -z "$1" ]; then
  echo "❌ Error: JWT token required"
  echo ""
  echo "Usage: ./test-qr-payment.sh YOUR_JWT_TOKEN"
  echo ""
  echo "To get JWT token:"
  echo "1. Login to https://thaytamphongthuy.com"
  echo "2. Open DevTools Console"
  echo "3. Run: localStorage.getItem('jwt_token')"
  echo "4. Copy the token"
  exit 1
fi

JWT_TOKEN="$1"
API_URL="https://9b1af013.thaytam-phongthuy-v2.pages.dev/api/payment/create-qr"

echo "📍 API URL: $API_URL"
echo "🔑 JWT Token: ${JWT_TOKEN:0:20}..."
echo ""
echo "📤 Sending POST request..."
echo ""

# Make request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"plan":"pro"}')

# Split response and status code
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo "📥 Response Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ SUCCESS! QR Payment created"
  echo ""
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
elif [ "$HTTP_CODE" = "401" ]; then
  echo "❌ AUTHENTICATION ERROR"
  echo "JWT token is invalid or expired"
  echo ""
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
elif [ "$HTTP_CODE" = "500" ]; then
  echo "❌ SERVER ERROR"
  echo "This is the orders table issue"
  echo ""
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
  echo ""
  echo "💡 Possible causes:"
  echo "  1. Orders table missing columns"
  echo "  2. RLS policy blocking insert"
  echo "  3. SUPABASE_SERVICE_KEY incorrect"
else
  echo "⚠️  Unexpected status: $HTTP_CODE"
  echo ""
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
fi

echo ""
echo "======================================"
echo "🔍 Next Steps:"
echo "======================================"
echo ""
echo "If you see 500 error, run this SQL in Supabase:"
echo ""
cat << 'SQL'
-- 1. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 2. Check RLS policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'orders';

-- 3. Test insert (should work with service role)
INSERT INTO orders (
  id, user_id, plan, amount, status, payment_method, created_at
) VALUES (
  'TEST_ORDER_123',
  (SELECT id FROM auth.users LIMIT 1),
  'pro',
  68000,
  'pending',
  'qr_code',
  NOW()
);

-- 4. If insert fails, disable RLS temporarily
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- 5. Try insert again
-- If works, the issue is RLS policy

-- 6. Re-enable RLS and fix policy
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Service role full access" ON orders;

-- Create correct policy for service role
CREATE POLICY "Service role bypass RLS"
  ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
SQL

echo ""
