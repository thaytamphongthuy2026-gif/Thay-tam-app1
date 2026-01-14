# Changelog - Thầy Tám Phong Thủy 2026

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-01-14 - PRODUCTION SECURITY RELEASE 🔒

### 🔒 Security Enhancements

#### Added
- **Enhanced JWT Validation**
  - Algorithm verification (ES256/HS256 support)
  - Detailed expiration checking with human-readable timestamps
  - Strict issuer and audience validation
  - Role-based access control enforcement
  - Future-date token detection

- **Rate Limiting System**
  - Per-user rate limiting (60 requests/minute)
  - In-memory cache with automatic cleanup
  - 429 status codes with Retry-After headers
  - Vietnamese error messages for better UX

- **Input Sanitization & Validation**
  - Prompt length validation (3-5000 characters)
  - XSS attack prevention
  - Script injection detection
  - Event handler blocking
  - Dangerous pattern filtering

- **Comprehensive Logging**
  - Timestamped error logs with stack traces
  - User action tracking (userId, quotaType)
  - API response time monitoring
  - Security event logging
  - Quota usage analytics

- **API Security Improvements**
  - Environment variable validation on startup
  - Sensitive data masking in responses
  - Cache-Control headers for quota endpoint
  - CORS properly configured
  - Content safety filters via Gemini API

### 🤖 AI Model Updates

#### Changed
- Upgraded to **Gemini 2.5 Flash** (`gemini-2.5-flash`) - LATEST MODEL!
- Enhanced generation config:
  - `temperature`: 0.7
  - `maxOutputTokens`: 2048
  - `topK`: 40
  - `topP`: 0.95

#### Added
- Safety settings for all harm categories:
  - `HARM_CATEGORY_HARASSMENT`: BLOCK_MEDIUM_AND_ABOVE
  - `HARM_CATEGORY_HATE_SPEECH`: BLOCK_MEDIUM_AND_ABOVE
  - `HARM_CATEGORY_SEXUALLY_EXPLICIT`: BLOCK_MEDIUM_AND_ABOVE
  - `HARM_CATEGORY_DANGEROUS_CONTENT`: BLOCK_MEDIUM_AND_ABOVE

### 🌐 Deployment

#### Changed
- Migrated to new Cloudflare Pages project: `thaytam-phongthuy-v2`
- New production URL: https://760e22cf.thaytam-phongthuy-v2.pages.dev

#### Added
- Environment variables properly configured in Cloudflare:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`
  - `SUPABASE_JWT_SECRET`
  - `GEMINI_API_KEY`

### 📚 Documentation

#### Added
- `PRODUCTION_READY.md`: Complete production deployment guide
- `CHANGELOG.md`: This file
- Enhanced `README.md` with security features and new URLs

#### Changed
- Updated API documentation with security notes
- Added error response codes and examples
- Documented rate limiting and validation rules

---

## [1.0.0] - 2026-01-13 - INITIAL RELEASE

### ✨ Features

- **Authentication**
  - User registration with Supabase Auth
  - Email/password login
  - JWT-based session management
  - Database trigger for automatic user profile creation

- **Core Features**
  - **Chat**: AI-powered feng shui consultation
  - **Xem Ngày Tốt**: Daily feng shui analysis for events
  - **Tử Vi**: 2026 fortune telling based on birth date/time

- **Quota Management**
  - Free plan: 3 xemNgay, 1 tuVi, 10 chat per day
  - Pro plan: 50 xemNgay, 10 tuVi, 100 chat per day
  - Premium plan: Unlimited access

- **UI/UX**
  - Responsive design with Tailwind CSS
  - Vietnamese language support
  - Header with quota display
  - Dashboard with quick access
  - Pricing page

### 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Cloudflare Functions (Serverless)
- **Database**: Supabase PostgreSQL + RLS
- **Auth**: Supabase Auth
- **AI**: Google Gemini 2.0 Flash API
- **Hosting**: Cloudflare Pages

### 🐛 Bug Fixes

- Fixed RLS policy for user registration
- Fixed persistent auth across page refreshes
- Fixed email validation error messages
- Fixed quota refresh after API calls

---

## Future Releases

### [2.1.0] - PLANNED
- Automatic daily quota reset
- Redis/KV-based distributed rate limiting
- Email confirmation with custom templates
- Password reset flow
- Chat history storage

### [3.0.0] - PLANNED
- Payment integration (VNPay/MoMo)
- Admin dashboard
- Export PDF reports
- Custom domain
- Analytics dashboard

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).
- MAJOR version: Incompatible API changes
- MINOR version: Backward-compatible functionality
- PATCH version: Backward-compatible bug fixes
