#!/bin/bash

# Auto-upload all RAG files to Gemini
# This script will upload all downloaded files and collect File IDs

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔮 Uploading RAG Files to Gemini${NC}"
echo ""

# Check API key
if [ -z "$GEMINI_API_KEY" ]; then
  echo -e "${RED}❌ GEMINI_API_KEY not set${NC}"
  echo ""
  echo "Please set your Gemini API key:"
  echo "  1. Get key from: https://aistudio.google.com/apikey"
  echo "  2. Run: export GEMINI_API_KEY='your-key-here'"
  echo "  3. Run this script again"
  exit 1
fi

TEMP_DIR="/tmp/rag_files"
FILE_IDS=()

# Function to upload a file
upload_file() {
  local file_path="$1"
  local file_name=$(basename "$file_path")
  
  echo -e "${BLUE}⬆️  Uploading: $file_name${NC}"
  
  # Get file size
  local file_size=$(stat -f%z "$file_path" 2>/dev/null || stat -c%s "$file_path")
  
  # Start resumable upload
  local upload_response=$(curl -s -X POST \
    "https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}" \
    -H "X-Goog-Upload-Protocol: resumable" \
    -H "X-Goog-Upload-Command: start" \
    -H "X-Goog-Upload-Header-Content-Length: ${file_size}" \
    -H "X-Goog-Upload-Header-Content-Type: application/pdf")
  
  local upload_url=$(echo "$upload_response" | grep -o 'https://[^"]*' | head -1)
  
  if [ -z "$upload_url" ]; then
    echo -e "${RED}  ❌ Failed to get upload URL${NC}"
    return 1
  fi
  
  # Upload file content
  local final_response=$(curl -s -X POST \
    "$upload_url" \
    -H "Content-Length: ${file_size}" \
    -H "X-Goog-Upload-Offset: 0" \
    -H "X-Goog-Upload-Command: upload, finalize" \
    --data-binary "@$file_path")
  
  # Extract file ID
  local gemini_file_id=$(echo "$final_response" | grep -o '"name":"files/[^"]*"' | cut -d'"' -f4)
  
  if [ -z "$gemini_file_id" ]; then
    echo -e "${RED}  ❌ Failed to upload${NC}"
    return 1
  fi
  
  echo -e "${GREEN}  ✅ Uploaded: $gemini_file_id${NC}"
  
  # Wait for processing
  echo -n "  ⏳ Processing"
  for i in {1..30}; do
    local status=$(curl -s "https://generativelanguage.googleapis.com/v1beta/$gemini_file_id?key=${GEMINI_API_KEY}" | grep -o '"state":"[^"]*"' | cut -d'"' -f4)
    
    if [ "$status" = "ACTIVE" ]; then
      echo ""
      echo -e "${GREEN}  ✅ Ready!${NC}"
      FILE_IDS+=("$gemini_file_id")
      return 0
    fi
    
    echo -n "."
    sleep 2
  done
  
  echo ""
  echo -e "${YELLOW}  ⚠️  Processing timeout${NC}"
  FILE_IDS+=("$gemini_file_id")
  return 0
}

# Upload all files
echo -e "${BLUE}Uploading 6 files...${NC}"
echo ""

upload_file "$TEMP_DIR/ngoc-hap-thong-thu.pdf"
upload_file "$TEMP_DIR/bat-trach-minh-kinh.pdf"
upload_file "$TEMP_DIR/tu-vi-dau-so.pdf"
upload_file "$TEMP_DIR/hiep-ky-tap-2.pdf"
upload_file "$TEMP_DIR/tang-san-boc-dich.pdf"
upload_file "$TEMP_DIR/hiep-ky-tap-1.pdf"

echo ""
echo -e "${GREEN}🎉 All files uploaded!${NC}"
echo ""
echo -e "${BLUE}📋 File IDs:${NC}"
for id in "${FILE_IDS[@]}"; do
  echo "  - $id"
done

echo ""
echo -e "${YELLOW}💾 Saving to file...${NC}"

# Save to file for code update
cat > /tmp/rag_file_ids.txt << EOF
# RAG File IDs - Generated $(date)
# Total files: ${#FILE_IDS[@]}

RAG_FILE_IDS = [
$(for id in "${FILE_IDS[@]}"; do echo "  '$id',"; done)
]

# For ENV variable (comma-separated):
$(IFS=,; echo "${FILE_IDS[*]}")
EOF

cat /tmp/rag_file_ids.txt

echo ""
echo -e "${GREEN}✅ Done! File IDs saved to: /tmp/rag_file_ids.txt${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Copy File IDs above"
echo "  2. Update functions/_lib/ragHelper.ts with these IDs"
echo "  3. Or set ENV: wrangler pages secret put RAG_FILE_IDS"
