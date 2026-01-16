# 🔥 HƯỚNG DẪN CLEAR CACHE HOÀN TOÀN

## ❌ VẤN ĐỀ

Browser của bạn vẫn đang load **CODE CŨ**:
- File cũ: `gemini-pv8OUNNC.js` (có Gemini fallback)
- File mới: Build hash khác (không có Gemini fallback)

**Logs từ browser:**
```
gemini-pv8OUNNC.js:1 🚀 Trying /api/ai-stream...
gemini-pv8OUNNC.js:2 ❌ /api/ai-stream failed: Không thể kết nối với AI
gemini-pv8OUNNC.js:1 🚀 Trying /api/gemini-stream...  ← VẪN CÒN FALLBACK!
gemini-pv8OUNNC.js:2 ✅ /api/gemini-stream succeeded!   ← XƯNG HÔ SAI!
```

## ✅ GIẢI PHÁP

### Option 1: INCOGNITO MODE (NHANH NHẤT - 10 GIÂY)

**Chrome:**
```
Ctrl + Shift + N (Windows/Linux)
Cmd + Shift + N (Mac)
```

**Firefox:**
```
Ctrl + Shift + P (Windows/Linux)
Cmd + Shift + P (Mac)
```

Sau đó:
1. Mở URL: https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai/chat
2. Login: premium@thaytam.com
3. Test: "Hướng nào tốt để đặt bàn làm việc?"

---

### Option 2: CLEAR CACHE THỦ CÔNG (30 GIÂY)

#### Chrome:
1. Nhấn **F12** (Developer Tools)
2. **Right-click** vào nút Reload (hoặc nhấn giữ reload button)
3. Chọn **"Empty Cache and Hard Reload"**

Hoặc:

1. Nhấn **Ctrl + Shift + Delete** (Windows) hoặc **Cmd + Shift + Delete** (Mac)
2. Chọn **"Cached images and files"**
3. Time range: **"All time"**
4. Click **"Clear data"**

#### Firefox:
1. Nhấn **Ctrl + Shift + Delete** (Windows) hoặc **Cmd + Shift + Delete** (Mac)
2. Chọn **"Cache"**
3. Time range: **"Everything"**
4. Click **"Clear Now"**

---

### Option 3: DISABLE CACHE TRONG DEVTOOLS (CHO DEVELOPERS)

1. Nhấn **F12** (Developer Tools)
2. Vào tab **Network**
3. Check **"Disable cache"**
4. Giữ DevTools mở và reload page

---

## 🧪 VERIFY CACHE ĐÃ CLEAR

Sau khi clear cache, check Console (F12 → Console):

### ✅ CODE MỚI (ĐÚNG):
```javascript
// Console không có logs "🚀 Trying /api/gemini-stream..."
// hoặc file name khác: gemini-<hash_khác>.js
```

### ❌ CODE CŨ (SAI):
```javascript
gemini-pv8OUNNC.js:1 🚀 Trying /api/ai-stream...
gemini-pv8OUNNC.js:1 🚀 Trying /api/gemini-stream...  ← VẪN CÒN!
```

---

## 🎯 SAU KHI CLEAR CACHE

### 1. Login lại để lấy JWT token mới

**F12 → Console:**
```javascript
localStorage.clear();
sessionStorage.clear();
location.href = '/login';
```

### 2. Login với credentials:
- Email: `premium@thaytam.com`
- Password: [mật khẩu của bạn]

### 3. Test chat:
Message: "Hướng nào tốt để đặt bàn làm việc?"

---

## ✅ KẾT QUẢ MONG ĐỢI

### Response phải có dạng:
```
🔮 THẦY XIN TRẢ LỜI GIA CHỦ

Gia chủ hỏi về hướng đặt bàn làm việc...

💡 THẦY KHUYÊN GIA CHỦ:
• Hướng CÁT: Đông Nam, Đông
...
```

### Console logs (F12):
```
Auth state changed: SIGNED_IN premium@thaytam.com
🚀 Trying /api/ai-stream...
✅ /api/ai-stream succeeded!  ← CHỈ GỌI MỘT ENDPOINT!
```

**KHÔNG CÒN:**
- ❌ "🚀 Trying /api/gemini-stream..."
- ❌ "Cháu xin trả lời"

---

## 🚨 NẾU VẪN KHÔNG HOẠT ĐỘNG

### Check list:
1. ✅ Đã clear cache? (Incognito mode là chắc nhất)
2. ✅ Đã login lại với token mới?
3. ✅ URL đúng? (https://3000-i5ar0ch63wtmgl16at744-dfc00ec5.sandbox.novita.ai)
4. ✅ Console có lỗi gì? (F12 → Console)

### Gửi cho tôi:
1. **Screenshot** response sai
2. **Console logs** (F12 → Console → copy all)
3. **Network logs** (F12 → Network → filter "/api/ai-stream" → click → Headers)
4. **Confirm:** Đã dùng Incognito mode chưa?

---

## 💡 TẠI SAO PHẢI CLEAR CACHE?

**Browser caching strategy:**
- Static assets (JS, CSS) được cache **rất lâu** (days/weeks)
- Mặc dù server đã build mới, browser vẫn dùng file cũ
- File hash mới: `index-D1TfMiY6.js`
- Browser load: `gemini-pv8OUNNC.js` (cũ)

**Fix:**
- Hard reload: `Ctrl + Shift + R` (KHÔNG ĐỦ vì Service Worker)
- Clear cache: Delete cached files (TỐT HƠN)
- Incognito: Fresh browser state (CHẮC NHẤT!)

---

## 🎉 TÓM TẮT

1. **Vấn đề:** Browser cache code cũ (có Gemini fallback)
2. **Giải pháp:** Clear cache hoặc dùng Incognito mode
3. **Verify:** Check Console không còn "Trying /api/gemini-stream"
4. **Test:** Response phải là "THẦY XIN TRẢ LỜI"

**RECOMMENDATION: DÙNG INCOGNITO MODE ĐỂ TEST NHANH NHẤT!** 🚀
