# 🔮 Thầy Tám Phong Thủy 2026 - Tư Vấn Phong Thủy Tết Ất Tỵ

Nền tảng tư vấn phong thủy chuyên nghiệp cho Tết 2026 (Ất Tỵ) với công nghệ AI. Xem ngày tốt khai trương, cưới hỏi, động thổ. Xem tử vi 12 con giáp năm Rắn 2026. Tư vấn phong thủy trực tuyến 24/7.

## 🌐 Production URLs

- **Latest Deploy:** https://101a0c31.thaytam-phongthuy-v2.pages.dev
- **Main Domain:** https://thaytam-phongthuy-v2.pages.dev
- **Custom Domain:** https://thaytamphongthuy.com
- **GitHub:** https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1

## 🚀 Latest Updates (2026-01-16)

### ✅ Completed Features
1. **Scroll-to-Top Bug Fix** - Auto scroll lên đầu trang khi navigate
2. **Pure Logic Calculations** - All non-AI features dùng logic thuần (không tốn quota)
3. **Test Duyên Số** - Real Feng Shui Calculator (Ngũ Hành, Can Chi, Zodiac)
4. **Lịch Phong Thủy** - 2-column layout (Desktop), responsive mobile
5. **Tết 2026 Section** - Dedicated section trên homepage với 9 features
6. **Cross-Feature Recommendations** - Loop gợi ý giữa các tính năng
7. **API Key Security** - Pre-commit hook + comprehensive security guide
8. **Production Deployment** - Deployed với Gemini 3 Flash Preview (latest model)

### 🔧 Technical Improvements
- **Bundle Size:** 472 KB → 134 KB (gzip) - giảm 38%
- **Code Splitting:** 46 chunks, lazy loading cho tất cả routes
- **Model:** gemini-3-flash-preview (latest Google AI model)
- **Security:** Pre-commit hook auto-check secrets
- **Performance:** Initial load ~12s, cached <3s

## 🎯 Features

### 🤖 AI-Powered Features
- **Chat với Thầy Tám** - Streaming AI với RAG (Quick mode ⚡ / Book mode 📚)
- **Xem Ngày Tốt** - Chọn ngày hoàng đạo cho khai trương, cưới hỏi
- **Tử Vi 2026** - Xem tử vi chi tiết theo năm sinh và giới tính
- **Lịch Phong Thủy** - Xem lịch tháng + chi tiết từng ngày
- **Xông Đất Tết** - Phân tích độ hợp của người xông đất + thiệp mời

### ⚡ Pure Logic Features (No AI)
- **Test Duyên Số** - Tính độ hợp tuổi theo Ngũ Hành, Can Chi, Zodiac
- **Số May Mắn** - Quay số may mắn ngẫu nhiên (0-99)
- **Lì Xì Thông Minh** - Game trắc nghiệm kiến thức Tết (5-10 rounds)
- **Xin Xăm Ảo** - Xin xăm phong thủy với lời giải

### 🎊 Tết 2026 Section
9 features được gom vào section riêng:
1. Xem Ngày Tốt 2026
2. Xem Tử Vi 2026
3. Xông Đất Tết
4. Lịch Phong Thủy
5. Test Duyên Số
6. Số May Mắn
7. Lì Xì Thông Minh
8. Xin Xăm Ảo
9. Chat với Thầy Tám

## 🛡️ Security

### Pre-commit Hook
- Auto-scan API keys trước mỗi commit
- Ngăn chặn commit `.dev.vars`, `.env` files
- Detect patterns: Google API keys, OpenAI keys, JWT secrets

### Documentation
- **SECURITY_BEST_PRACTICES.md** - 10 security measures + emergency procedures
- **UPDATE_API_KEY.md** - Quick fix guide (5 phút)
- **URGENT_FIX_REQUIRED.md** - Root cause analysis

### Best Practices
- ✅ Environment variables (`.dev.vars` local, Cloudflare Secrets production)
- ✅ Pre-commit hook (automatic prevention)
- ✅ Key rotation schedule (Dev: 1 month, Prod: 3 months)
- ✅ API restrictions (HTTP referrers + API scopes)
- ✅ Monitoring & alerts

## 🧪 Testing

### Automated Tests
```bash
# Test Gemini API integration
./test-gemini.sh

# Expected output:
# ✅ .dev.vars found
# ✅ Server is running
# ✅ Gemini API Key is valid
# ✅ Streaming endpoint is responding
```

### Manual Tests
1. **Chat** (`/chat`) - Quick mode (⚡) và Book mode (📚)
2. **Xem Ngày Tốt** (`/xem-ngay-tot`) - Chọn ngày tốt
3. **Tử Vi** (`/tu-vi`) - Xem tử vi năm 2026
4. **Lịch Phong Thủy** (`/lich-phong-thuy`) - 2-column layout
5. **Test Duyên Số** (`/test-duyen-so`) - Real calculator
6. **Lì Xì Game** (`/li-xi-game`) - Public access

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (CDN)
- **React Router** - Client-side routing
- **Vite** - Build tool
- **Lazy Loading** - Code splitting (46 chunks)

### Backend
- **Hono** - Lightweight web framework
- **Cloudflare Pages** - Edge deployment
- **Cloudflare Workers** - Serverless functions
- **Supabase** - Authentication & Database

### AI & APIs
- **Google Gemini 3 Flash Preview** - Latest AI model
- **RAG (Retrieval-Augmented Generation)** - Book mode với context từ sách cổ
- **Streaming API** - Real-time text generation

## 📊 Performance

### Bundle Sizes
- **Main Bundle:** 472 KB (134 KB gzip)
- **Largest Chunk:** BlogPost ~36 KB (11 KB gzip)
- **Chat:** 11 KB (4.5 KB gzip)
- **Total Chunks:** 46 files

### Load Times
- **Initial Load:** ~12-13s (with lazy loading)
- **Cached Pages:** <3s
- **Streaming Response:** 0.5-1s (Quick mode), 2-4s (Book mode)

## 🔧 Development

### Setup
```bash
# Install dependencies
npm install

# Start dev server (sandbox)
npm run build
pm2 start ecosystem.config.cjs

# Or local development
npm run dev
```

### Environment Variables
Create `.dev.vars` file:
```env
GEMINI_API_KEY=your_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
```

### Deployment
```bash
# Build
npm run build

# Deploy to Cloudflare Pages
export CLOUDFLARE_API_TOKEN=your_token
npx wrangler pages deploy dist --project-name thaytam-phongthuy-v2
```

## 📝 Recent Commits

```
889d943 - 🔒 SECURITY: Add comprehensive security guide and pre-commit hook
a082c1e - 📚 DOCS: Add API key update guides and test script
5a2fe75 - ✅ FIX: Use correct model gemini-3-flash-preview (latest)
6a0edd7 - 🎊 FINAL ENHANCEMENTS: Tết 2026 section + Cross-feature recommendations
6b8ae5a - ✨ FEATURE IMPROVEMENTS: Pure logic calculations, 2-column calendar, scroll-to-top
```

## 📞 Support

- **Email:** thaytamphongthuy2026@gmail.com
- **GitHub Issues:** https://github.com/thaytamphongthuy2026-gif/Thay-tam-app1/issues

## 📄 License

Private project - All rights reserved

---

**Last Updated:** 2026-01-16  
**Status:** 🟢 PRODUCTION READY  
**Latest Deploy:** https://101a0c31.thaytam-phongthuy-v2.pages.dev

