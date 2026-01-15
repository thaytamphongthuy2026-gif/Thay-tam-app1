# 🔮 HƯỚNG DẪN ADMIN: Setup RAG Files Từ Google Drive

## 📋 Bạn Cần Làm

### **Bước 1: Share Files Từ Google Drive**

1. Mở Google Drive của bạn
2. Chọn các files PDF/DOCX phong thủy
3. Click chuột phải → **Get link** hoặc **Chia sẻ**
4. Đổi quyền thành: **"Anyone with the link can view"**
5. Copy links

**Ví dụ link:**
```
https://drive.google.com/file/d/1ABC123xyz456DEF/view
https://drive.google.com/file/d/2GHI789jkl012MNO/view
```

### **Bước 2: Paste Links Vào Đây**

**Reply message với format:**

```
Files phong thủy:
1. https://drive.google.com/file/d/1ABC123.../view - Lý thuyết Ngũ Hành
2. https://drive.google.com/file/d/2DEF456.../view - Phong thủy nhà ở
3. https://drive.google.com/file/d/3GHI789.../view - Tử vi 12 con giáp
```

**Tôi sẽ tự động:**
- Download files từ Google Drive
- Upload lên Gemini Files API
- Lấy File IDs
- Configure vào code
- Deploy production

---

## 🚀 Hoặc Cách Nhanh Hơn

### **Option A: Public Google Drive Folder**

```
1. Tạo 1 folder trong Google Drive
2. Bỏ tất cả files vào folder đó
3. Share folder với "Anyone with link"
4. Paste link folder vào đây
```

**Ví dụ:**
```
https://drive.google.com/drive/folders/1XYZ123ABC456?usp=sharing
```

### **Option B: Upload Trực Tiếp (File Wrapper)**

Nếu bạn có file wrapper URLs từ hệ thống:
```
https://www.genspark.ai/api/files/v1/...
https://www.genspark.ai/api/files/s/{short_id}
```

Paste vào đây, tôi sẽ download và upload lên Gemini.

---

## ⚡ Quy Trình Tự Động

**Khi bạn gửi links:**

```
1. Tôi download files từ Google Drive
2. Upload lên Gemini Files API  
3. Lấy File IDs: files/abc123,files/def456,...
4. Add vào code: functions/_lib/ragHelper.ts
5. Hardcode File IDs (không cần ENV variable)
6. Deploy production
7. Test và confirm
```

**Không cần user làm gì cả!** RAG sẵn sàng ngay!

---

## 📝 Template Reply

**Bạn chỉ cần reply:**

```
Files phong thủy của tôi:

[Paste Google Drive links hoặc folder link ở đây]

Hoặc:

Folder: https://drive.google.com/drive/folders/1XYZ123ABC456
```

Tôi sẽ làm hết phần còn lại! 🚀
