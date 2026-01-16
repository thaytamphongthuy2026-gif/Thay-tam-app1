# 🎯 MIGRATION TO GEMINI 2.5 FLASH - SIMPLE APPROACH

## ✅ VẤN ĐỀ

- GROQ llama-3.3-70b **KHÔNG TUÂN THỦ** system prompt tốt cho Vietnamese pronouns
- Cần model **TỐT HƠN** để kiểm soát chất lượng

## ✅ GIẢI PHÁP

**Swap GROQ → Gemini 2.5 Flash**

| Feature | GROQ | Gemini 2.5 Flash |
|---------|------|------------------|
| Vietnamese | OK | ⭐⭐⭐⭐⭐ Excellent |
| System Prompt Following | ⭐⭐⭐ Poor | ⭐⭐⭐⭐⭐ Excellent |
| Cost | FREE | FREE |
| Speed | 500 tok/s | 200-300 tok/s |
| Quality Control | ❌ Poor | ✅ Excellent |

## 🧪 TEST KẾT QUẢ

**Gemini 2.5 Flash response:**
```
Á chào cháu! Cháu muốn hỏi về cách bố trí phòng ngủ...

Thầy Tám sẽ chỉ dẫn cháu cặn kẽ đây:

### 1. Vị Trí Giường Ngủ (Quan Trọng Nhất!)

* **Đầu giường phải tựa vào tường vững chắc:**...
```

✅ **"Thầy Tám sẽ chỉ dẫn"** - HOÀN HẢO!
✅ Xưng hô tự nhiên, không ép buộc
✅ Vietnamese xuất sắc

## 📋 IMPLEMENTATION PLAN

### Files to Update:
1. ✅ `.dev.vars` - Update GEMINI_API_KEY
2. ✅ `functions/_lib/geminiService.ts` - New Gemini 2.5 service
3. ⏳ `functions/_lib/aiService.ts` - Use Gemini as primary
4. ⏳ `functions/api/ai-stream.ts` - Use new Gemini service

### New Gemini API Key:
```
[KEY PROVIDED BY USER - stored in .dev.vars]
```

## 🚀 NEXT STEPS

**Option 1: Simple Swap (RECOMMENDED)**
- Just update `callAI()` to call Gemini first
- Keep GROQ as fallback
- 5 minutes implementation

**Option 2: Complete Rewrite**
- Remove old Gemini code
- Clean up imports
- 30 minutes implementation

## 💡 RECOMMENDATION

**Do Option 1 - Simple Swap:**
1. Update `.dev.vars` ✅ DONE
2. Add `geminiService.ts` ✅ DONE  
3. Update `callAI()` import to use new service
4. Update `transformStreamingResponse()` to handle both
5. Test!

---

**Status:** Ready to implement
**API Key:** ✅ Valid
**Test:** ✅ Passed
**Complexity:** ⭐⭐ (Medium)
