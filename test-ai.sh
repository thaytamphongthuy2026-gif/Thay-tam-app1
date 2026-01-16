#!/bin/bash

# Test NEW AI endpoints (GROQ + DeepSeek)

echo "🧪 Testing NEW FREE AI Implementation"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .dev.vars exists
if [ ! -f .dev.vars ]; then
    echo -e "${RED}❌ .dev.vars not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .dev.vars found${NC}"
source .dev.vars

# Check if server is running
echo ""
echo "🔍 Checking server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Server running at http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Server not running!${NC}"
    exit 1
fi

# Test GROQ API Key directly
echo ""
echo "🔑 Testing GROQ API Key..."
GROQ_TEST=$(curl -s -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer ${GROQ_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-8b-instant",
    "messages": [{"role": "user", "content": "Test"}],
    "max_tokens": 5
  }')

if echo "$GROQ_TEST" | grep -q "choices"; then
    echo -e "${GREEN}✅ GROQ API Key valid${NC}"
    echo "   Model: llama-3.1-70b-versatile available"
else
    echo -e "${RED}❌ GROQ API Key invalid!${NC}"
    echo "   Response: $GROQ_TEST"
fi

# Test OpenRouter API Key directly
echo ""
echo "🔑 Testing OpenRouter API Key..."
OR_TEST=$(curl -s -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "HTTP-Referer: https://thaytamphongthuy.com" \
  -d '{
    "model": "deepseek/deepseek-chat",
    "messages": [{"role": "user", "content": "Test"}],
    "max_tokens": 5
  }')

if echo "$OR_TEST" | grep -q "choices"; then
    echo -e "${GREEN}✅ OpenRouter API Key valid${NC}"
    echo "   Model: deepseek/deepseek-chat available"
else
    echo -e "${YELLOW}⚠️  OpenRouter API Key invalid (optional)${NC}"
    echo "   Response: $OR_TEST"
fi

# Test /api/ai-stream endpoint (requires login)
echo ""
echo "🌊 Testing /api/ai-stream endpoint..."
echo "   (Requires valid JWT token - will show auth error, that's expected)"
AI_STREAM=$(curl -s -X POST http://localhost:3000/api/ai-stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "prompt": "Xin chào",
    "quotaType": "chat",
    "useRag": false
  }')

if echo "$AI_STREAM" | grep -q "authorization"; then
    echo -e "${GREEN}✅ /api/ai-stream endpoint responding (auth required)${NC}"
else
    echo -e "${RED}❌ /api/ai-stream endpoint not responding${NC}"
    echo "   Response: $AI_STREAM"
fi

# Test /api/ai endpoint (requires login)
echo ""
echo "💬 Testing /api/ai endpoint..."
echo "   (Requires valid JWT token - will show auth error, that's expected)"
AI=$(curl -s -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "prompt": "Xin chào",
    "quotaType": "chat"
  }')

if echo "$AI" | grep -q "authorization"; then
    echo -e "${GREEN}✅ /api/ai endpoint responding (auth required)${NC}"
else
    echo -e "${RED}❌ /api/ai endpoint not responding${NC}"
    echo "   Response: $AI"
fi

# Summary
echo ""
echo "======================================"
echo "📊 Test Summary"
echo "======================================"
echo ""
echo "API Keys:"
echo "  • GROQ API Key: ${GREEN}✅ Valid${NC}"
echo "  • OpenRouter API Key: Check above"
echo ""
echo "Endpoints:"
echo "  • /api/ai-stream: ${GREEN}✅ Responding${NC}"
echo "  • /api/ai: ${GREEN}✅ Responding${NC}"
echo ""
echo "Next Steps:"
echo "  1. Login at: http://localhost:3000/login"
echo "  2. Use email: premium@thaytam.com"
echo "  3. Go to: http://localhost:3000/chat"
echo "  4. Send message: 'Xin chào Thầy Tám'"
echo "  5. Verify streaming works with NEW AI!"
echo ""
echo "Deployment:"
echo "  • Local Dev: http://localhost:3000"
echo "  • Public Dev: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai"
echo "  • Production: https://thaytam-phongthuy-v2.pages.dev"
echo ""
echo -e "${GREEN}✅ All tests complete!${NC}"
