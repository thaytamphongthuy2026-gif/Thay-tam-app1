#!/bin/bash

# Download Google Docs as PDF for RAG
# Handles both Google Docs and Google Drive PDF files

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📚 Processing RAG files...${NC}"
echo ""

# Create temp directory
TEMP_DIR="/tmp/rag_files"
mkdir -p "$TEMP_DIR"

# File 1: Ngọc Hạp Thông Thư (Google Docs)
DOC_ID_1="1o2wi5iOMQF1AdhqQ4K5T-WpalDBHM0A4Mbb5o_GzxDA"
echo -e "${BLUE}1/6 Downloading Ngọc Hạp Thông Thư...${NC}"
curl -L "https://docs.google.com/document/d/${DOC_ID_1}/export?format=pdf" \
  -o "${TEMP_DIR}/ngoc-hap-thong-thu.pdf" 2>/dev/null
echo -e "${GREEN}✅ Downloaded${NC}"

# File 2: Bát Trạch Minh Kinh (Google Docs)
DOC_ID_2="1Om-xJ3rVDpY7zN32qFlGYMoJMSum7I-fuaizDAn4gaQ"
echo -e "${BLUE}2/6 Downloading Bát Trạch Minh Kinh...${NC}"
curl -L "https://docs.google.com/document/d/${DOC_ID_2}/export?format=pdf" \
  -o "${TEMP_DIR}/bat-trach-minh-kinh.pdf" 2>/dev/null
echo -e "${GREEN}✅ Downloaded${NC}"

# File 3: Tử Vi Đẩu Số (Google Docs)
DOC_ID_3="18eK9K2-hqmMkBTxRrCV_Tg3Ku39de5ak1APNSs0ulzw"
echo -e "${BLUE}3/6 Downloading Tử Vi Đẩu Số...${NC}"
curl -L "https://docs.google.com/document/d/${DOC_ID_3}/export?format=pdf" \
  -o "${TEMP_DIR}/tu-vi-dau-so.pdf" 2>/dev/null
echo -e "${GREEN}✅ Downloaded${NC}"

# File 4: Hiệp Kỷ Biện Phương Thư Tập 2 (Google Docs)
DOC_ID_4="1lb-GEOucIrVYG_YKn-QR4hroaNi3EBsk4ub9ZdDK8wc"
echo -e "${BLUE}4/6 Downloading Hiệp Kỷ Biện Phương Thư Tập 2...${NC}"
curl -L "https://docs.google.com/document/d/${DOC_ID_4}/export?format=pdf" \
  -o "${TEMP_DIR}/hiep-ky-tap-2.pdf" 2>/dev/null
echo -e "${GREEN}✅ Downloaded${NC}"

# File 5: Tăng San Bốc Dịch (PDF)
FILE_ID_5="1QfUcpc9hDhX3XB290fcucjOJanGqLovQ"
echo -e "${BLUE}5/6 Downloading Tăng San Bốc Dịch...${NC}"
curl -L "https://drive.google.com/uc?export=download&id=${FILE_ID_5}" \
  -o "${TEMP_DIR}/tang-san-boc-dich.pdf" 2>/dev/null
echo -e "${GREEN}✅ Downloaded${NC}"

# File 6: Hiệp Kỷ Biện Phương Thư Tập 1 (PDF)
FILE_ID_6="1ZhiGi2-h-sYG5tcpWjk0iafeZa_l52Yr"
echo -e "${BLUE}6/6 Downloading Hiệp Kỷ Biện Phương Thư Tập 1...${NC}"
curl -L "https://drive.google.com/uc?export=download&id=${FILE_ID_6}" \
  -o "${TEMP_DIR}/hiep-ky-tap-1.pdf" 2>/dev/null
echo -e "${GREEN}✅ Downloaded${NC}"

echo ""
echo -e "${GREEN}✅ All files downloaded to: ${TEMP_DIR}${NC}"
echo ""
echo "Files:"
ls -lh "$TEMP_DIR"

echo ""
echo -e "${YELLOW}📝 Next step: Run upload script for each file${NC}"
echo "Or I'll do it automatically..."
