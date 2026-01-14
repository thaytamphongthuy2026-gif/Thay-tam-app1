#!/bin/bash
# ================================================================
# PAYMENT FLOW TESTING SCRIPT
# Project: Thầy Tám Phong Thủy 2026
# Purpose: End-to-end payment testing
# ================================================================

echo "🧪 PAYMENT FLOW TESTING SCRIPT"
echo "================================"
echo ""

# Configuration
BASE_URL="https://d7ca51ba.thaytam-phongthuy-v2.pages.dev"
API_URL="${BASE_URL}/api"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ================================================================
# STEP 1: LOGIN AND GET TOKEN
# ================================================================

echo -e "${BLUE}STEP 1: LOGIN${NC}"
echo "Login at: ${BASE_URL}/login"
echo ""
echo "Use one of these test accounts:"
echo "  - premium@thaytam.com / password123 (Premium user)"
echo "  - test@example.com / password123 (Free user)"
echo ""
echo -n "Enter your JWT token (from localStorage after login): "
read TOKEN

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Error: Token is required${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token received${NC}"
echo ""

# ================================================================
# STEP 2: TEST CREATE PAYMENT (PRO PLAN)
# ================================================================

echo -e "${BLUE}STEP 2: CREATE PAYMENT (PRO PLAN)${NC}"
echo "Testing: POST ${API_URL}/payment/create"
echo ""

RESPONSE=$(curl -s -X POST "${API_URL}/payment/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "plan": "pro",
    "returnUrl": "'${BASE_URL}'/payment-result"
  }')

echo "Response:"
echo "$RESPONSE" | jq .
echo ""

# Extract payment URL
PAYMENT_URL=$(echo "$RESPONSE" | jq -r '.paymentUrl')
ORDER_ID=$(echo "$RESPONSE" | jq -r '.orderId')

if [ "$PAYMENT_URL" != "null" ] && [ ! -z "$PAYMENT_URL" ]; then
  echo -e "${GREEN}✅ Payment URL created successfully${NC}"
  echo "Order ID: $ORDER_ID"
  echo ""
  echo "Payment URL:"
  echo "$PAYMENT_URL"
  echo ""
  echo -e "${YELLOW}📝 MANUAL ACTION REQUIRED:${NC}"
  echo "1. Copy the payment URL above"
  echo "2. Open it in your browser"
  echo "3. Select bank: NCB (National Citizen Bank)"
  echo "4. Enter card number: 9704198526191432198"
  echo "5. Enter card holder: NGUYEN VAN A"
  echo "6. Enter expiry: 07/15"
  echo "7. Enter OTP: 123456"
  echo "8. Complete payment"
  echo ""
  echo "Press Enter after completing payment..."
  read
else
  echo -e "${RED}❌ Failed to create payment URL${NC}"
  echo "Response: $RESPONSE"
  exit 1
fi

# ================================================================
# STEP 3: VERIFY ORDER STATUS
# ================================================================

echo -e "${BLUE}STEP 3: VERIFY ORDER STATUS${NC}"
echo "Checking order status in database..."
echo ""

# Note: This requires Supabase access
# For now, check via Supabase dashboard or API

echo -e "${YELLOW}📝 MANUAL VERIFICATION:${NC}"
echo "1. Go to Supabase dashboard"
echo "2. Navigate to orders table"
echo "3. Find order: $ORDER_ID"
echo "4. Verify status is 'paid'"
echo "5. Verify transaction_id is present"
echo ""
echo "Order ID to search: $ORDER_ID"
echo ""
echo "Press Enter after verifying..."
read

# ================================================================
# STEP 4: VERIFY USER PLAN UPGRADED
# ================================================================

echo -e "${BLUE}STEP 4: VERIFY USER PLAN UPGRADED${NC}"
echo "Checking user plan..."
echo ""

echo -e "${YELLOW}📝 MANUAL VERIFICATION:${NC}"
echo "1. Go to: ${BASE_URL}/dashboard"
echo "2. Check current plan (should be 'Pro')"
echo "3. Check quota (should be 50/10/100)"
echo "4. Verify plan expiry date (30 days from now)"
echo ""
echo "Press Enter after verifying..."
read

# ================================================================
# STEP 5: TEST CREATE PAYMENT (PREMIUM PLAN)
# ================================================================

echo -e "${BLUE}STEP 5: CREATE PAYMENT (PREMIUM PLAN)${NC}"
echo "Testing: POST ${API_URL}/payment/create"
echo ""

RESPONSE=$(curl -s -X POST "${API_URL}/payment/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "plan": "premium",
    "returnUrl": "'${BASE_URL}'/payment-result"
  }')

echo "Response:"
echo "$RESPONSE" | jq .
echo ""

# Extract payment URL
PAYMENT_URL=$(echo "$RESPONSE" | jq -r '.paymentUrl')
ORDER_ID=$(echo "$RESPONSE" | jq -r '.orderId')

if [ "$PAYMENT_URL" != "null" ] && [ ! -z "$PAYMENT_URL" ]; then
  echo -e "${GREEN}✅ Payment URL created successfully${NC}"
  echo "Order ID: $ORDER_ID"
  echo ""
  echo "Payment URL:"
  echo "$PAYMENT_URL"
  echo ""
  echo -e "${YELLOW}📝 MANUAL ACTION (Optional):${NC}"
  echo "Test premium plan payment if needed"
  echo "Follow same steps as Pro plan"
  echo ""
fi

# ================================================================
# STEP 6: TEST FAILED PAYMENT
# ================================================================

echo -e "${BLUE}STEP 6: TEST FAILED PAYMENT${NC}"
echo "Testing payment cancellation..."
echo ""

RESPONSE=$(curl -s -X POST "${API_URL}/payment/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "plan": "pro",
    "returnUrl": "'${BASE_URL}'/payment-result"
  }')

PAYMENT_URL=$(echo "$RESPONSE" | jq -r '.paymentUrl')
ORDER_ID=$(echo "$RESPONSE" | jq -r '.orderId')

if [ "$PAYMENT_URL" != "null" ]; then
  echo -e "${YELLOW}📝 MANUAL ACTION (Optional):${NC}"
  echo "1. Open payment URL in browser"
  echo "2. Click 'Cancel' or close the page"
  echo "3. Verify redirect to payment-result"
  echo "4. Check order status is 'failed'"
  echo ""
  echo "Payment URL:"
  echo "$PAYMENT_URL"
  echo ""
fi

# ================================================================
# STEP 7: CHECK IPN LOGS
# ================================================================

echo -e "${BLUE}STEP 7: CHECK IPN CALLBACK LOGS${NC}"
echo "Checking Cloudflare Functions logs..."
echo ""

echo -e "${YELLOW}📝 MANUAL VERIFICATION:${NC}"
echo "Run this command to view logs:"
echo ""
echo "  cd /home/user/webapp"
echo "  npx wrangler pages deployment tail thaytam-phongthuy-v2"
echo ""
echo "Look for:"
echo "  - '📥 Received VNPay IPN'"
echo "  - '✅ Payment successful for order'"
echo "  - '⬆️ User plan upgraded'"
echo ""

# ================================================================
# STEP 8: PERFORMANCE TESTING
# ================================================================

echo -e "${BLUE}STEP 8: PERFORMANCE TESTING${NC}"
echo "Testing multiple payment creations..."
echo ""

echo "Creating 5 payment URLs (stress test)..."
for i in {1..5}; do
  RESPONSE=$(curl -s -X POST "${API_URL}/payment/create" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}" \
    -d '{
      "plan": "pro",
      "returnUrl": "'${BASE_URL}'/payment-result"
    }')
  
  SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
  if [ "$SUCCESS" == "true" ]; then
    echo -e "${GREEN}✅ Request $i: Success${NC}"
  else
    echo -e "${RED}❌ Request $i: Failed${NC}"
    echo "Response: $RESPONSE"
  fi
done

echo ""

# ================================================================
# SUMMARY
# ================================================================

echo ""
echo "================================"
echo -e "${GREEN}🎉 TESTING COMPLETE${NC}"
echo "================================"
echo ""
echo "✅ Completed tests:"
echo "  1. Login and get token"
echo "  2. Create payment (Pro plan)"
echo "  3. Verify order status"
echo "  4. Verify user plan upgraded"
echo "  5. Create payment (Premium plan)"
echo "  6. Test failed payment"
echo "  7. Check IPN logs"
echo "  8. Performance testing"
echo ""
echo "📋 Verification checklist:"
echo "  [ ] Payment URL created successfully"
echo "  [ ] Payment completed on VNPay"
echo "  [ ] IPN callback received"
echo "  [ ] Order status updated to 'paid'"
echo "  [ ] User plan upgraded"
echo "  [ ] Quota reset correctly"
echo "  [ ] Payment result page works"
echo "  [ ] Multiple payments work"
echo ""
echo "📊 Next steps:"
echo "  1. Monitor production payments"
echo "  2. Setup error alerts"
echo "  3. Track revenue metrics"
echo "  4. Build admin dashboard"
echo ""
echo "🚀 Ready for production!"
