# 📋 VNPay Sandbox Setup Guide

## ✅ STEP 1: REGISTER VNPAY SANDBOX ACCOUNT

### 1.1 Access VNPay Sandbox
- **URL**: https://sandbox.vnpayment.vn/devreg
- **Purpose**: Test payment integration without real money

### 1.2 Registration Information
Fill in the registration form:

**Company Information**:
- Company Name: `Thầy Tám Phong Thủy` (or your business name)
- Tax Code: `0123456789` (sandbox accepts any 10-digit number)
- Address: Your address
- Phone: Your phone number
- Email: Your email address

**Contact Person**:
- Full Name: Your name
- Position: `Developer` or `CEO`
- Phone: Your phone
- Email: Your email

**Website Information**:
- Website URL: `https://thaytam-phongthuy-v2.pages.dev` (your Cloudflare Pages URL)
- Description: `Nền tảng tư vấn phong thủy trực tuyến với AI`

### 1.3 Submit and Wait for Approval
- Submit the form
- You will receive an email with:
  - **TMN_CODE** (Terminal Code / Mã website)
  - **HASH_SECRET** (Secret Key)
  - Login credentials for merchant portal

**⏱️ Expected Time**: Usually instant to 24 hours

---

## ✅ STEP 2: GET YOUR CREDENTIALS

After approval, you will receive an email with:

### 2.1 VNPay Credentials
```
TMN_CODE: XXXXXXXX (8 characters, e.g., VPAY1234)
HASH_SECRET: XXXXXXXXXXXXXXXX (32 characters hex string)
```

### 2.2 Sandbox Bank Accounts (For Testing)
VNPay provides test bank accounts:

**NCB Bank (National Citizen Bank)**:
- Card Number: `9704198526191432198`
- Card Holder: `NGUYEN VAN A`
- Expiry Date: `07/15`
- OTP: `123456`

**Other Test Banks**:
- VietcomBank: `9704060000000001`
- Techcombank: `9704030000000001`
- VietinBank: `9704050000000001`

**💡 Note**: All test cards use OTP `123456`

---

## ✅ STEP 3: CONFIGURE CLOUDFLARE SECRETS

Once you have the credentials, configure them in Cloudflare:

### 3.1 Set VNPay Secrets
```bash
# Navigate to project
cd /home/user/webapp

# Set Cloudflare API token
export CLOUDFLARE_API_TOKEN='AaPzeyO5p24r4lTMvz6-D2IRoRd1m-An3BmpFmBt'

# Set VNPay TMN_CODE
echo 'YOUR_TMN_CODE_HERE' | npx wrangler secret put VNPAY_TMN_CODE

# Set VNPay HASH_SECRET
echo 'YOUR_HASH_SECRET_HERE' | npx wrangler secret put VNPAY_HASH_SECRET

# Set VNPay URL (sandbox)
echo 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html' | npx wrangler secret put VNPAY_URL
```

### 3.2 Verify Secrets
```bash
# List all secrets (won't show values)
npx wrangler secret list
```

Expected output:
```
[
  { name: "GEMINI_API_KEY", type: "secret_text" },
  { name: "SUPABASE_JWT_SECRET", type: "secret_text" },
  { name: "SUPABASE_SERVICE_KEY", type: "secret_text" },
  { name: "SUPABASE_URL", type: "secret_text" },
  { name: "VNPAY_HASH_SECRET", type: "secret_text" },
  { name: "VNPAY_TMN_CODE", type: "secret_text" },
  { name: "VNPAY_URL", type: "secret_text" }
]
```

### 3.3 Update Local Dev Vars (Optional)
For local development:

```bash
# Update .dev.vars file
cat >> .dev.vars << 'EOF'
VNPAY_TMN_CODE=YOUR_TMN_CODE_HERE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET_HERE
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
EOF
```

---

## ✅ STEP 4: UPDATE DATABASE TYPES

Add VNPay environment variables to TypeScript types:

```typescript
// functions/_lib/database.ts
export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  SUPABASE_JWT_SECRET: string
  GEMINI_API_KEY: string
  RATE_LIMIT: KVNamespace
  RESPONSE_CACHE: KVNamespace
  
  // VNPay credentials
  VNPAY_TMN_CODE: string
  VNPAY_HASH_SECRET: string
  VNPAY_URL: string
}
```

---

## ✅ STEP 5: TEST PAYMENT FLOW

### 5.1 Test Creating Payment URL
```bash
# Get auth token (login first at https://d7ca51ba.thaytam-phongthuy-v2.pages.dev/login)
TOKEN="your_jwt_token_here"

# Create payment
curl -X POST https://d7ca51ba.thaytam-phongthuy-v2.pages.dev/api/payment/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "plan": "pro",
    "returnUrl": "https://d7ca51ba.thaytam-phongthuy-v2.pages.dev/payment-result"
  }' | jq .
```

Expected response:
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "orderId": "ORDER_xxx_xxx",
  "plan": "pro",
  "amount": 299000
}
```

### 5.2 Complete Payment in Browser
1. Copy `paymentUrl` from response
2. Open in browser
3. Select bank: `NCB` (National Citizen Bank)
4. Enter test card: `9704198526191432198`
5. Enter card holder: `NGUYEN VAN A`
6. Enter expiry: `07/15`
7. Enter OTP: `123456`
8. Complete payment

### 5.3 Verify IPN Callback
VNPay will send IPN to: `https://d7ca51ba.thaytam-phongthuy-v2.pages.dev/api/payment/ipn`

Check Cloudflare logs:
```bash
npx wrangler pages deployment tail thaytam-phongthuy-v2
```

Look for:
- `📥 Received VNPay IPN`
- `✅ Payment successful for order`
- `⬆️ User plan upgraded`

---

## ✅ STEP 6: TROUBLESHOOTING

### Common Issues

#### 1. Invalid Signature Error
**Problem**: `RspCode: 97, Message: Invalid signature`

**Solution**:
- Verify `VNPAY_HASH_SECRET` is correct
- Check no extra spaces in secret
- Ensure Web Crypto API is working

#### 2. Project Not Found Error
**Problem**: `RspCode: 01, Message: Order not found`

**Solution**:
- Create orders table in Supabase (Task 2)
- Verify order was created successfully

#### 3. Payment URL Not Working
**Problem**: VNPay shows error page

**Solution**:
- Verify `VNPAY_TMN_CODE` is correct
- Check `VNPAY_URL` is sandbox URL
- Ensure all required parameters are present

#### 4. IPN Not Received
**Problem**: Order status not updated after payment

**Solution**:
- Check Cloudflare Functions logs
- Verify return URL is accessible
- Test IPN endpoint manually

---

## ✅ STEP 7: GO TO PRODUCTION

### 7.1 Register Production Account
- **URL**: https://vnpay.vn
- Submit production application
- Provide business license
- Wait for approval (1-7 days)

### 7.2 Update Production Secrets
```bash
# Production TMN_CODE and HASH_SECRET
echo 'PRODUCTION_TMN_CODE' | npx wrangler secret put VNPAY_TMN_CODE
echo 'PRODUCTION_HASH_SECRET' | npx wrangler secret put VNPAY_HASH_SECRET
echo 'https://pay.vnpay.vn/paymentv2/vpcpay.html' | npx wrangler secret put VNPAY_URL
```

### 7.3 Production Testing
- Use real bank accounts
- Start with small amounts
- Monitor all transactions
- Setup alerts for failures

---

## 📞 SUPPORT

### VNPay Support
- **Sandbox Support**: support.sandbox@vnpay.vn
- **Production Support**: hotro@vnpay.vn
- **Hotline**: 1900 55 55 77
- **Documentation**: https://sandbox.vnpayment.vn/apis/docs

### Project Support
- Check `/PHASE2_COMPLETE.md`
- Check Cloudflare Functions logs
- Review payment flow documentation

---

## ✅ QUICK CHECKLIST

- [ ] Register VNPay sandbox account
- [ ] Receive TMN_CODE and HASH_SECRET via email
- [ ] Configure Cloudflare secrets
- [ ] Update database types
- [ ] Create orders table (Task 2)
- [ ] Test payment flow (Task 3)
- [ ] Verify IPN callback
- [ ] Check order status updated
- [ ] Verify user plan upgraded
- [ ] Test with different plans (Pro/Premium)

---

## 🎯 NEXT STEPS

Once you have VNPay credentials:
1. ✅ Set Cloudflare secrets (Step 3)
2. ✅ Update Env types (Step 4)
3. ✅ Create orders table (Task 2 - I'll do this next)
4. ✅ Test payment flow (Task 3)
5. ✅ Build admin dashboard (Task 4)

**Status**: Waiting for your VNPay credentials to proceed! 🚀

---

## 📝 IMPORTANT NOTES

1. **Sandbox vs Production**:
   - Sandbox: For testing only, no real money
   - Production: Real transactions, requires business license

2. **Security**:
   - Never commit secrets to git
   - Use Cloudflare secrets for all credentials
   - Keep HASH_SECRET confidential

3. **Testing**:
   - Always test in sandbox first
   - Use test bank accounts only
   - Monitor all transactions

4. **Production**:
   - Apply for production account early (takes time)
   - Test thoroughly in sandbox before switching
   - Have support plan ready

**Ready to continue? Let me know when you have the VNPay credentials!** 📧
