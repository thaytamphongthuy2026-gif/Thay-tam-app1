#!/bin/bash

# Simple RAG File Upload Script
# Uploads files to Gemini Files API using multipart/form-data

set -e

GEMINI_API_KEY="${GEMINI_API_KEY}"
RAG_DIR="/tmp/rag_files"

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY not set"
  echo "Run: export GEMINI_API_KEY=your-key"
  exit 1
fi

echo "🔮 Uploading RAG Files to Gemini Files API"
echo ""

# Array to store file IDs
declare -a FILE_IDS

# Upload each file
for file in "$RAG_DIR"/*.pdf; do
  if [ ! -f "$file" ]; then
    continue
  fi
  
  filename=$(basename "$file")
  echo "⬆️  Uploading: $filename"
  
  # Upload using simple POST with file
  response=$(curl -s -X POST \
    "https://generativelanguage.googleapis.com/upload/v1beta/files?key=$GEMINI_API_KEY" \
    -H "Content-Type: application/pdf" \
    --data-binary "@$file")
  
  # Extract file ID from response
  file_id=$(echo "$response" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ -n "$file_id" ]; then
    echo "  ✅ Success: $file_id"
    FILE_IDS+=("$file_id")
  else
    echo "  ❌ Failed: $response"
  fi
  
  echo ""
  sleep 2  # Rate limiting
done

echo ""
echo "📝 Summary:"
echo "Uploaded ${#FILE_IDS[@]} files"
echo ""
echo "🔑 File IDs:"
for id in "${FILE_IDS[@]}"; do
  echo "  - $id"
done

echo ""
echo "✅ Done! Copy these IDs to functions/_lib/ragHelper.ts"
