# 🔮 HƯỚNG DẪN UPLOAD FILES CHO RAG - CÁCH ĐÚNG

## ❌ Lỗi Thường Gặp

Link `https://aistudio.google.com/app/files` báo **404** vì:
- Cần đăng nhập Google account trước
- Cần enable Gemini API
- Link có thể thay đổi theo region

---

## ✅ **PHƯƠNG PHÁP 1: Qua Google AI Studio (Khuyến Nghị)**

### **Bước 1: Truy cập Google AI Studio**

```
https://aistudio.google.com/
```

**Đăng nhập bằng Google Account** (account có Gemini API key)

### **Bước 2: Tạo hoặc Mở Project**

1. Click **"Create"** hoặc **"New Chat"**
2. Bạn sẽ thấy giao diện chat với Gemini

### **Bước 3: Upload File Trong Chat**

**Cách A: Drag & Drop**
- Kéo file PDF/DOCX vào khung chat
- File sẽ được upload tự động

**Cách B: Click Icon Attach**
1. Nhìn góc dưới của chat box
2. Click icon 📎 (Attach file) hoặc 🖼️ (Add media)
3. Chọn file từ máy tính
4. Upload (max 50MB per file)

### **Bước 4: Copy File URI**

Sau khi upload xong:

1. Click vào file đã upload trong chat
2. Hoặc hover vào file → Click 3 dots (⋮) → **"Copy URI"**
3. URI format: `https://generativelanguage.googleapis.com/v1beta/files/abc123xyz456`
4. **Lấy phần sau `/files/`** → Đó chính là File ID

**Ví dụ:**
```
Full URI: https://generativelanguage.googleapis.com/v1beta/files/abc123xyz456
File ID: files/abc123xyz456  ← LẤY CÁI NÀY
```

---

## ✅ **PHƯƠNG PHÁP 2: Dùng API Upload (Nâng Cao)**

### **Bước 1: Chuẩn bị**

```bash
# Install curl (đã có sẵn trên Linux/Mac)
# Lấy API key từ: https://aistudio.google.com/apikey

export GEMINI_API_KEY="your-api-key-here"
```

### **Bước 2: Upload File**

```bash
# Upload file PDF
curl -X POST \
  "https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -F "file=@/path/to/your/phong-thuy-book.pdf"
```

### **Bước 3: Lấy File ID từ Response**

Response sẽ trả về:
```json
{
  "file": {
    "name": "files/abc123xyz456",  ← ĐÂY LÀ FILE ID
    "displayName": "phong-thuy-book.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": "2048000",
    "createTime": "2026-01-15T10:30:00.000Z",
    "updateTime": "2026-01-15T10:30:00.000Z",
    "state": "PROCESSING"  ← Đợi thành "ACTIVE"
  }
}
```

### **Bước 4: Check Status**

```bash
# Check file status
curl "https://generativelanguage.googleapis.com/v1beta/files/abc123xyz456?key=${GEMINI_API_KEY}"

# Đợi cho đến khi "state": "ACTIVE"
```

---

## 🚀 **PHƯƠNG PHÁP 3: Dùng Script Tự Động (Fastest)**

Tôi sẽ tạo script upload tự động cho bạn:

<function_calls>
<invoke name="Write">
<parameter name="content">#!/bin/bash

# RAG File Upload Script
# Usage: ./upload-rag-files.sh /path/to/file.pdf

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔮 RAG File Upload Script${NC}"
echo ""

# Check if API key is set
if [ -z "$GEMINI_API_KEY" ]; then
  echo -e "${RED}❌ Error: GEMINI_API_KEY not set${NC}"
  echo "Please set it:"
  echo "  export GEMINI_API_KEY='your-api-key-here'"
  exit 1
fi

# Check if file path provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: No file provided${NC}"
  echo "Usage: ./upload-rag-files.sh /path/to/file.pdf"
  exit 1
fi

FILE_PATH="$1"

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
  echo -e "${RED}❌ Error: File not found: $FILE_PATH${NC}"
  exit 1
fi

FILE_NAME=$(basename "$FILE_PATH")
FILE_SIZE=$(du -h "$FILE_PATH" | cut -f1)

echo -e "${BLUE}📄 File: $FILE_NAME${NC}"
echo -e "${BLUE}📦 Size: $FILE_SIZE${NC}"
echo ""

# Upload file
echo -e "${BLUE}⬆️  Uploading...${NC}"

RESPONSE=$(curl -s -X POST \
  "https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}" \
  -H "X-Goog-Upload-Protocol: resumable" \
  -H "X-Goog-Upload-Command: start" \
  -H "X-Goog-Upload-Header-Content-Length: $(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH")" \
  -H "X-Goog-Upload-Header-Content-Type: application/pdf")

# Extract upload URL
UPLOAD_URL=$(echo "$RESPONSE" | grep -o 'https://[^"]*')

if [ -z "$UPLOAD_URL" ]; then
  echo -e "${RED}❌ Error: Failed to get upload URL${NC}"
  echo "Response: $RESPONSE"
  exit 1
fi

# Upload file content
UPLOAD_RESPONSE=$(curl -s -X POST \
  "$UPLOAD_URL" \
  -H "Content-Length: $(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH")" \
  -H "X-Goog-Upload-Offset: 0" \
  -H "X-Goog-Upload-Command: upload, finalize" \
  --data-binary "@$FILE_PATH")

# Extract file ID
FILE_ID=$(echo "$UPLOAD_RESPONSE" | grep -o '"name":"files/[^"]*"' | cut -d'"' -f4)

if [ -z "$FILE_ID" ]; then
  echo -e "${RED}❌ Error: Failed to upload file${NC}"
  echo "Response: $UPLOAD_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Upload successful!${NC}"
echo ""
echo -e "${BLUE}📋 File ID:${NC}"
echo "$FILE_ID"
echo ""

# Wait for processing
echo -e "${BLUE}⏳ Waiting for processing...${NC}"

for i in {1..30}; do
  STATUS=$(curl -s "https://generativelanguage.googleapis.com/v1beta/$FILE_ID?key=${GEMINI_API_KEY}" | grep -o '"state":"[^"]*"' | cut -d'"' -f4)
  
  if [ "$STATUS" = "ACTIVE" ]; then
    echo -e "${GREEN}✅ File is ready!${NC}"
    echo ""
    echo -e "${GREEN}🎉 SUCCESS! Use this File ID:${NC}"
    echo -e "${BLUE}$FILE_ID${NC}"
    echo ""
    echo -e "${BLUE}Add to .dev.vars or Cloudflare ENV:${NC}"
    echo "RAG_FILE_IDS=$FILE_ID"
    exit 0
  fi
  
  echo -n "."
  sleep 2
done

echo ""
echo -e "${RED}⚠️  Timeout waiting for file processing${NC}"
echo "File ID: $FILE_ID"
echo "Check status manually at: https://aistudio.google.com/"
