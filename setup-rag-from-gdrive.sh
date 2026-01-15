#!/bin/bash

# Download and Upload RAG Files from Google Drive
# Usage: ./setup-rag-from-gdrive.sh "https://drive.google.com/file/d/FILE_ID/view"

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔮 RAG Setup from Google Drive${NC}"
echo ""

# Check API key
if [ -z "$GEMINI_API_KEY" ]; then
  echo -e "${RED}❌ Error: GEMINI_API_KEY not set${NC}"
  echo "Get it from: https://aistudio.google.com/apikey"
  echo "Then: export GEMINI_API_KEY='your-key'"
  exit 1
fi

# Check if URL provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: No Google Drive URL provided${NC}"
  echo ""
  echo "Usage examples:"
  echo "  ./setup-rag-from-gdrive.sh 'https://drive.google.com/file/d/1ABC123.../view'"
  echo "  ./setup-rag-from-gdrive.sh '1ABC123...' (just file ID)"
  exit 1
fi

URL="$1"

# Extract file ID from URL
if [[ "$URL" == *"drive.google.com"* ]]; then
  FILE_ID=$(echo "$URL" | grep -oP '(?<=/d/)[^/]+' || echo "$URL" | grep -oP '(?<=id=)[^&]+')
else
  FILE_ID="$URL"
fi

if [ -z "$FILE_ID" ]; then
  echo -e "${RED}❌ Error: Could not extract file ID${NC}"
  exit 1
fi

echo -e "${BLUE}📁 File ID: $FILE_ID${NC}"

# Download from Google Drive
TEMP_FILE="/tmp/rag_download_${FILE_ID}.pdf"
DOWNLOAD_URL="https://drive.google.com/uc?export=download&id=${FILE_ID}"

echo -e "${BLUE}⬇️  Downloading from Google Drive...${NC}"

# Try direct download first
curl -L -o "$TEMP_FILE" "$DOWNLOAD_URL" 2>/dev/null

# Check if it's HTML (means needs confirmation)
if file "$TEMP_FILE" | grep -q "HTML"; then
  echo -e "${YELLOW}⚠️  Large file detected, getting confirmation token...${NC}"
  
  # Get confirmation token
  CONFIRM_TOKEN=$(curl -sc /tmp/cookies.txt "$DOWNLOAD_URL" 2>/dev/null | grep -o 'confirm=[^&]*' | cut -d= -f2)
  
  if [ ! -z "$CONFIRM_TOKEN" ]; then
    curl -Lb /tmp/cookies.txt "${DOWNLOAD_URL}&confirm=${CONFIRM_TOKEN}" -o "$TEMP_FILE" 2>/dev/null
  fi
  
  rm -f /tmp/cookies.txt
fi

# Verify file
if [ ! -s "$TEMP_FILE" ]; then
  echo -e "${RED}❌ Error: Failed to download file${NC}"
  echo "Make sure the Google Drive link is public (Anyone with link can view)"
  rm -f "$TEMP_FILE"
  exit 1
fi

FILE_SIZE=$(du -h "$TEMP_FILE" | cut -f1)
echo -e "${GREEN}✅ Downloaded: $FILE_SIZE${NC}"

# Upload to Gemini
echo -e "${BLUE}⬆️  Uploading to Gemini...${NC}"

# Get file size for upload headers
FILE_SIZE_BYTES=$(stat -f%z "$TEMP_FILE" 2>/dev/null || stat -c%s "$TEMP_FILE")

# Start resumable upload
UPLOAD_RESPONSE=$(curl -s -X POST \
  "https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}" \
  -H "X-Goog-Upload-Protocol: resumable" \
  -H "X-Goog-Upload-Command: start" \
  -H "X-Goog-Upload-Header-Content-Length: ${FILE_SIZE_BYTES}" \
  -H "X-Goog-Upload-Header-Content-Type: application/pdf")

UPLOAD_URL=$(echo "$UPLOAD_RESPONSE" | grep -o 'https://[^"]*' | head -1)

if [ -z "$UPLOAD_URL" ]; then
  echo -e "${RED}❌ Error: Failed to get upload URL${NC}"
  rm -f "$TEMP_FILE"
  exit 1
fi

# Upload file content
FINAL_RESPONSE=$(curl -s -X POST \
  "$UPLOAD_URL" \
  -H "Content-Length: ${FILE_SIZE_BYTES}" \
  -H "X-Goog-Upload-Offset: 0" \
  -H "X-Goog-Upload-Command: upload, finalize" \
  --data-binary "@$TEMP_FILE")

# Extract file ID
GEMINI_FILE_ID=$(echo "$FINAL_RESPONSE" | grep -o '"name":"files/[^"]*"' | cut -d'"' -f4)

if [ -z "$GEMINI_FILE_ID" ]; then
  echo -e "${RED}❌ Error: Failed to upload to Gemini${NC}"
  rm -f "$TEMP_FILE"
  exit 1
fi

echo -e "${GREEN}✅ Uploaded successfully!${NC}"
echo ""

# Wait for processing
echo -e "${BLUE}⏳ Processing...${NC}"

for i in {1..30}; do
  STATUS=$(curl -s "https://generativelanguage.googleapis.com/v1beta/$GEMINI_FILE_ID?key=${GEMINI_API_KEY}" | grep -o '"state":"[^"]*"' | cut -d'"' -f4)
  
  if [ "$STATUS" = "ACTIVE" ]; then
    echo ""
    echo -e "${GREEN}✅ File ready!${NC}"
    echo ""
    echo -e "${GREEN}🎉 SUCCESS!${NC}"
    echo ""
    echo -e "${BLUE}File ID: ${GREEN}$GEMINI_FILE_ID${NC}"
    echo ""
    echo -e "${YELLOW}💡 Save this File ID to add to RAG_FILE_IDS${NC}"
    
    # Cleanup
    rm -f "$TEMP_FILE"
    exit 0
  fi
  
  echo -n "."
  sleep 2
done

echo ""
echo -e "${YELLOW}⚠️  Processing timeout${NC}"
echo "File ID: $GEMINI_FILE_ID"
echo "Check status later at: https://aistudio.google.com/"

# Cleanup
rm -f "$TEMP_FILE"
