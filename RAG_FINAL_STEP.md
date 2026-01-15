# 🎯 FINAL STEP: Upload RAG Files to Gemini

## ✅ Status: Files Downloaded (70MB total)

**6 tài liệu phong thủy đã sẵn sàng:**

1. ✅ Ngọc Hạp Thông Thư (865KB)
2. ✅ Bát Trạch Minh Kinh (2.3MB)
3. ✅ Tử Vi Đẩu Số Tân Biện (385KB)
4. ✅ Hiệp Kỷ Biện Phương Thư Tập 2 (1.6MB)
5. ✅ Tăng San Bốc Dịch (29MB)
6. ✅ Hiệp Kỷ Biện Phương Thư Tập 1 (37MB)

**Location:** `/tmp/rag_files/`

---

## 🔑 BẠN CẦN: Gemini API Key

### **Lấy API Key (2 phút)**

1. Truy cập: **https://aistudio.google.com/apikey**
2. Đăng nhập Google account
3. Click **"Create API Key"** (hoặc dùng key có sẵn)
4. Copy API key (format: `AIzaSy...`)

---

## 🚀 CÁCH 1: Upload Tự Động (Khuyến Nghị)

### **Bước 1: Set API Key**

```bash
cd /home/user/webapp

# Paste API key của bạn vào đây:
export GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

### **Bước 2: Run Upload Script**

```bash
./upload-all-rag-files.sh
```

**Script sẽ tự động:**
- ✅ Upload 6 files lên Gemini
- ✅ Đợi processing (mỗi file ~10-30 giây)
- ✅ Collect tất cả File IDs
- ✅ Save vào file để dễ copy

**Output mẫu:**
```
🔮 Uploading RAG Files to Gemini

⬆️  Uploading: ngoc-hap-thong-thu.pdf
  ✅ Uploaded: files/abc123xyz...
  ⏳ Processing...........
  ✅ Ready!

[...5 files khác...]

🎉 All files uploaded!

📋 File IDs:
  - files/abc123xyz
  - files/def456abc
  - files/ghi789def
  - files/jkl012ghi
  - files/mno345jkl
  - files/pqr678mno

For ENV variable:
files/abc123xyz,files/def456abc,files/ghi789def,files/jkl012ghi,files/mno345jkl,files/pqr678mno
```

### **Bước 3: Hardcode File IDs Vào Code**

Tôi sẽ update code với File IDs từ output trên.

---

## 🔧 CÁCH 2: Upload Thủ Công (Nếu Script Fail)

### **Upload từng file:**

```bash
export GEMINI_API_KEY="your-key"

./upload-rag-files.sh /tmp/rag_files/ngoc-hap-thong-thu.pdf
# File ID: files/abc123

./upload-rag-files.sh /tmp/rag_files/bat-trach-minh-kinh.pdf  
# File ID: files/def456

# ...lặp lại cho 4 files còn lại
```

---

## 📝 CÁCH 3: Tôi Làm Hết (Nếu Bạn Share API Key)

**Nếu bạn tin tưởng:**

Reply message:
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXX
```

Tôi sẽ:
1. Upload tất cả files
2. Lấy File IDs
3. Hardcode vào code
4. Deploy production
5. Test và confirm

**Lưu ý:** API key sẽ chỉ dùng trong session này và không lưu lại.

---

## ⚡ After Upload

**Tôi sẽ:**

1. **Update code** với File IDs:
   ```typescript
   // functions/_lib/ragHelper.ts
   const DEFAULT_RAG_FILE_IDS = [
     'files/abc123xyz',
     'files/def456abc',
     // ... 6 files
   ]
   ```

2. **Deploy production**:
   ```bash
   npm run deploy
   ```

3. **Test RAG**:
   ```
   User: "Theo Bát Trạch Minh Kinh, hướng nào tốt?"
   
   Thầy Tám: "🏠 THEO BÁT TRẠCH MINH KINH
   
   8 hướng được phân loại:
   ▸ Sinh Khí - Hướng đại cát
   ▸ Thiên Y - Hợp sức khỏe
   ▸ Diên Niên - Hợp tình duyên
   
   🏮 Căn cứ: Bát Trạch Minh Kinh"
   ```

---

## 🎯 Choose Your Method

**Reply với 1 trong 3:**

### **Option 1: Tôi tự upload (Cách 1)**
```
export GEMINI_API_KEY="AIzaSy..."
./upload-all-rag-files.sh
```
Rồi paste File IDs output vào đây.

### **Option 2: Share API key (Cách 3)**
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXX
```

### **Option 3: Tôi upload thủ công (Cách 2)**
```
Hướng dẫn chi tiết [ở trên]
```

---

## ⏱️ Time Estimate

- **Upload**: ~5-10 phút (6 files, 70MB total)
- **Code update**: ~2 phút
- **Deploy**: ~2 phút
- **Test**: ~1 phút

**Total: ~15-20 phút → RAG sẵn sàng!** 🚀

---

**Bạn muốn chọn cách nào? Paste API key hoặc upload rồi gửi File IDs! 🔑**
