#!/bin/bash

# Test Gemini 3.0 Flash Preview API
# This script verifies the API endpoint is working correctly

API_KEY="AIzaSyDEbls4ml51OEm-6z-c7oC1UrU4x3BDvhQ"
MODEL="gemini-3-flash-preview"
ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent"

echo "🧪 Testing Gemini 3.0 Flash Preview API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📡 Endpoint: ${ENDPOINT}"
echo "🤖 Model: ${MODEL}"
echo ""

# Test payload
PAYLOAD='{
  "contents": [
    {
      "parts": [
        {
          "text": "Hello! Please confirm you are Gemini 3.0 Flash Preview model. Reply in Vietnamese."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 2048,
    "topK": 40,
    "topP": 0.95
  }
}'

echo "📤 Sending test request..."
echo ""

# Make request
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Content-Type: application/json" \
  -d "${PAYLOAD}" \
  "${ENDPOINT}?key=${API_KEY}")

# Extract status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
# Extract body (everything except last line)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📥 Response Status: ${HTTP_CODE}"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ SUCCESS! API is working correctly."
  echo ""
  echo "📝 Response:"
  echo "$BODY" | jq -r '.candidates[0].content.parts[0].text' 2>/dev/null || echo "$BODY"
else
  echo "❌ ERROR! API returned status ${HTTP_CODE}"
  echo ""
  echo "📝 Error Details:"
  echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
