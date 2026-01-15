# 🚨 URGENT FIXES - Implementation Plan

**Date:** 2026-01-15  
**Status:** In Progress  
**Priority:** HIGH

---

## ✅ COMPLETED (Deployed)

### 1. ✅ Fix 500 Error - Chat Not Working
- **Issue:** Wrong model name `gemini-3-flash-preview`
- **Fix:** Changed to `gemini-1.5-flash-latest`
- **Files:** `functions/api/gemini.ts`
- **Status:** ✅ DEPLOYED

### 2. ✅ Fix Chat Scroll
- **Issue:** Whole page scrolls, not just messages
- **Fix:** Fixed height container with internal scroll
- **Files:** `src/pages/Chat.tsx`
- **Status:** ✅ DEPLOYED

**Production URL:** https://ba244528.thaytam-phongthuy-v2.pages.dev

---

## 🔄 IN PROGRESS

### 3. Profile Data Reuse
**Current:** ProfileSetup data (name, birthdate, gender) not saved
**Need:**
- Save to users table when profile completed
- Auto-fill in other features (Xem Ngày Tốt, Tử Vi, etc.)
- Conditional trigger when data missing

**Implementation:**
```sql
-- Already exists in DB
birth_date DATE
birth_date_type VARCHAR (lunar/solar)
gender VARCHAR (male/female/other)
profile_completed BOOLEAN
```

**Action Items:**
- [ ] Ensure ProfileSetup saves to DB
- [ ] Create useProfile() hook for reuse
- [ ] Auto-trigger profile input when needed
- [ ] Pre-fill forms with saved data

---

### 4. Account Dropdown Bug
**Issue:** Can't click "Thông tin cá nhân" - page missing
**Need:**
- Create `/profile` page
- Show: name, email, birthdate, gender, plan
- Allow editing profile data
- Show quota usage

---

### 5. Pricing Structure Update
**Current:** Free / Pro / Premium
**New Structure:**
```
Duyên Lành (Free)
├─ Xem Ngày: 3 lần
├─ Tử Vi: 1 lần
└─ Chat: 5 câu

Lộc Phát (68,000 VNĐ)
├─ Xem Ngày: 30 lần
├─ Tử Vi: 10 lần
└─ Chat: 50 câu

Đại Cát (168,000 VNĐ)
├─ Xem Ngày: KHÔNG GIỚI HẠN
├─ Tử Vi: KHÔNG GIỚI HẠN
└─ Chat: KHÔNG GIỚI HẠN
```

**Files to Update:**
- `src/pages/Pricing.tsx`
- Database plan enum
- Payment pages

---

### 6. Chat Credibility - Show Sources
**Need:**
- Display which book the answer comes from
- Add "Căn cứ theo sách..." at end of responses
- Show confidence level

**Example:**
```
🔮 THEO LÝ THUYẾT NGŨ HÀNH

[Answer content...]

📚 Căn cứ:
• Ngọc Hạp Thông Thư - Chương 3
• Bát Trạch Minh Kinh - Trang 45
```

---

### 7. Calendar Display Improvements
**Current:** Just lists dates
**Need:**
- Show input info (user's birthdate, purpose)
- Clear good/bad indicators (✅ Tốt / ⚠️ Tránh)
- Explain why each date is good/bad
- Show hourly recommendations

---

### 8. Terms & Privacy Pages
**Missing Pages:**
- `/terms` - Điều khoản sử dụng
- `/privacy` - Chính sách bảo mật
- Add disclaimer: "Kết quả chỉ mang tính chất tham khảo..."

---

### 9. Homepage Rewrite
**Current Problems:**
- Says "30 năm kinh nghiệm"
- Says "Tư vấn trực tuyến 24/7"
- Says "Gửi email..."

**New Messaging:**
```
🔮 THẦY TÁM - AI PHONG THỦY DỰA TRÊN SÁCH CỔ

✨ Điểm Khác Biệt:
• Không dựa vào kinh nghiệm cá nhân
• Không suy diễn hay đoán mò
• CHỈ trích dẫn từ sách phong thủy cổ truyền

📚 Nguồn Kiến Thức:
• 6 sách phong thủy (~70MB)
• Bát Trạch Minh Kinh
• Ngọc Hạp Thông Thư
• Tử Vi Đẩu Số
• ...

🤖 Công Nghệ AI:
• Trích xuất chính xác nguồn
• Tổng hợp đa sách
• Suy luận logic dựa trên ngũ hành
• Tư vấn phù hợp từng cá nhân
```

---

### 10. Registration Flow
**Current:** Requires name immediately
**Need:**
- Simple registration: email + password only
- Trigger profile input when using features
- Save profile data for reuse

---

## 🆕 NEW FEATURES

### 11. Mời Xông Đất (Find Lucky Visitors)
**Concept:**
1. Input: Gia chủ info (birthdate, gender)
2. AI suggests: Best people to visit (tuổi hợp)
3. Shows: Why compatible (Tam hợp, Lục hợp, Ngũ hành)
4. Generates: Invitation card
5. Share: Zalo, Messenger, etc.

**Pricing:** Lộc Phát or Đại Cát only

---

### 12. Reusable Share Component
**Need:**
- Universal share button
- Web Share API + fallback
- Custom share messages per feature
- Track shares for viral growth

---

## 📊 PRIORITY ORDER

**Phase 1: Critical Fixes (Today)**
1. ✅ Fix 500 error ← DONE
2. ✅ Fix chat scroll ← DONE
3. 🔄 Profile data reuse
4. 🔄 Fix account dropdown
5. 🔄 Update pricing structure

**Phase 2: Content & UX (Tomorrow)**
6. Add chat sources/credibility
7. Improve calendar display
8. Create Terms & Privacy pages
9. Rewrite homepage copy

**Phase 3: New Features (Later)**
10. Registration flow update
11. Mời Xông Đất feature
12. Reusable share component

---

## 🎯 NEXT ACTIONS

**Immediate (Next 2 hours):**
1. Profile data reuse implementation
2. Fix account dropdown + create profile page
3. Update pricing structure

**Today (Next 4 hours):**
4. Add chat sources
5. Improve calendar
6. Create Terms/Privacy

**Tomorrow:**
7. Homepage rewrite
8. Registration flow
9. Xông Đất feature

---

*Updated: 2026-01-15 by AI Developer*
