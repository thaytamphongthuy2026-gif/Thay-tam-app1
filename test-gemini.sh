#!/bin/bash

# Test script for Gemini API integration
# Run after updating GEMINI_API_KEY

set -e

echo "🧪 TESTING GEMINI API INTEGRATION"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .dev.vars exists
if [ ! -f ".dev.vars" ]; then
    echo -e "${RED}❌ .dev.vars file not found!${NC}"
    echo "Please create .dev.vars with GEMINI_API_KEY"
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "GEMINI_API_KEY=" .dev.vars; then
    echo -e "${RED}❌ GEMINI_API_KEY not found in .dev.vars!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .dev.vars found${NC}"
echo ""

# Test 1: Check if server is running
echo "Test 1: Server Health Check"
echo "----------------------------"
if curl -s -f http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server is not running${NC}"
    echo "Run: pm2 start ecosystem.config.cjs"
    exit 1
fi
echo ""

# Test 2: Test Gemini API directly (mock call)
echo "Test 2: Gemini API Key Validation"
echo "----------------------------------"
API_KEY=$(grep "GEMINI_API_KEY=" .dev.vars | cut -d '=' -f2)

RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Content-Type: application/json" \
    -d '{
        "contents": [{
            "parts": [{"text": "Xin chào"}]
        }]
    }' \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$API_KEY")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Gemini API Key is valid${NC}"
    echo "Model: gemini-3-flash-preview"
    echo "Response length: ${#BODY} characters"
elif [ "$HTTP_CODE" = "403" ]; then
    echo -e "${RED}❌ API Key is invalid or leaked!${NC}"
    echo "Error: $(echo $BODY | jq -r '.error.message' 2>/dev/null || echo 'Unknown error')"
    echo ""
    echo "Please generate a new API key at:"
    echo "https://aistudio.google.com/app/apikey"
    exit 1
else
    echo -e "${YELLOW}⚠️  Unexpected status code: $HTTP_CODE${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi
echo ""

# Test 3: Test streaming endpoint (requires valid JWT)
echo "Test 3: Streaming Endpoint Structure"
echo "-------------------------------------"
echo -e "${YELLOW}ℹ️  This test requires valid JWT token${NC}"
echo "Checking endpoint availability..."

STREAM_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST http://localhost:3000/api/gemini-stream \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer test-token" \
    -d '{"prompt":"test","quotaType":"chat","useRag":false}')

STREAM_CODE=$(echo "$STREAM_RESPONSE" | tail -n 1)

if [ "$STREAM_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Streaming endpoint is responding${NC}"
    echo "Response: Requires authentication (expected)"
elif [ "$STREAM_CODE" = "500" ]; then
    echo -e "${RED}❌ Streaming endpoint error${NC}"
    echo "This usually means API key issue"
else
    echo -e "${YELLOW}⚠️  Unexpected code: $STREAM_CODE${NC}"
fi
echo ""

# Summary
echo "=================================="
echo "📊 TEST SUMMARY"
echo "=================================="
echo ""
echo "API Endpoint:"
echo "  https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview"
echo ""
echo "Deployment Status:"
echo "  - Local Dev: http://localhost:3000"
echo "  - Public Dev: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai"
echo "  - Production: https://thaytam-phongthuy-v2.pages.dev"
echo ""
echo "Features to Test:"
echo "  - /chat (streaming)"
echo "  - /xem-ngay-tot"
echo "  - /tu-vi"
echo "  - /lich-phong-thuy"
echo "  - /xong-dat"
echo ""
echo -e "${GREEN}✨ Testing complete!${NC}"
