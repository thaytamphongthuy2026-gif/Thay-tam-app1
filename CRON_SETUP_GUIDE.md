# 🔄 Hướng Dẫn Setup Cloudflare Worker Cron Job

## ✅ Đã Hoàn Thành

### 1. Worker Information
- **Worker Name**: `quota-reset-worker`
- **Worker URL**: https://quota-reset-worker.thaytamphongthuy2026.workers.dev
- **Cron Schedule**: `0 17 * * *` (Daily at 17:00 UTC / 00:00 Vietnam Time)
- **Status**: ✅ **ACTIVE & TESTED**

### 2. Test Results
```json
{
  "success": true,
  "stats": {
    "free": 3,
    "pro": 0,
    "premium": 1,
    "expired": 0,
    "total": 4,
    "duration": 2499
  }
}
```

### 3. Deployment Details
- **Location**: `/home/user/quota-reset-worker/`
- **Main File**: `src/index.ts`
- **Environment Variables**:
  - `SUPABASE_URL`: ✅ Configured
  - `SUPABASE_SERVICE_KEY`: ✅ Secret set

---

## 🎯 Quota Reset Logic

### Plans & Quotas
| Plan | Xem Ngày Tốt | Tử Vi | Chat |
|------|--------------|-------|------|
| Free | 3 | 1 | 10 |
| Pro | 50 | 10 | 100 |
| Premium | 999 | 999 | 999 |

### Reset Process
1. **Reset Free Users**: All users with `plan=free`
2. **Reset Pro Users**: Active users with `plan=pro` and `plan_expiry > now()`
3. **Reset Premium Users**: Active users with `plan=premium` and `plan_expiry > now()`
4. **Downgrade Expired Users**: Pro/Premium users with `plan_expiry < now()` → Downgrade to Free

---

## 📅 Cron Schedule Details

### Schedule: `0 17 * * *`
- **Cron Expression**: `0 17 * * *`
- **UTC Time**: 17:00 (5:00 PM)
- **Vietnam Time (UTC+7)**: 00:00 (Midnight)
- **Frequency**: Daily

### When It Runs
- **Production**: Automatically every day at midnight Vietnam time
- **Trigger**: Cloudflare Cron Triggers (managed by Cloudflare)

---

## 🧪 Testing

### Manual Test (Anytime)
```bash
# Test worker immediately
curl https://quota-reset-worker.thaytamphongthuy2026.workers.dev/

# With formatted output
curl -s https://quota-reset-worker.thaytamphongthuy2026.workers.dev/ | jq .
```

### Expected Response
```json
{
  "success": true,
  "stats": {
    "free": 3,
    "pro": 0,
    "premium": 1,
    "expired": 0,
    "total": 4,
    "duration": 2499
  }
}
```

---

## 📊 Monitoring

### Check Cron Trigger Status
1. **Dashboard**: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **quota-reset-worker**
3. Go to: **Settings** → **Triggers** → **Cron Triggers**
4. Verify: `0 17 * * *` is listed

### View Logs (Real-time)
```bash
# View real-time logs
npx wrangler tail quota-reset-worker

# View logs with filters
npx wrangler tail quota-reset-worker --status ok
npx wrangler tail quota-reset-worker --status error
```

### Log Output Example
```
🕐 Cron triggered at: 2026-01-14T17:00:00.000Z
📅 Cron pattern: 0 17 * * *
✅ Reset 3 free users
✅ Reset 0 pro users
✅ Reset 1 premium users
⬇️ Downgraded 0 expired users to free
🎉 Quota reset completed successfully!
📊 Stats: { free: 3, pro: 0, premium: 1, expired: 0, total: 4, duration: 2499 }
```

---

## 🛠️ Maintenance

### Update Worker Code
```bash
cd /home/user/quota-reset-worker
npm run deploy
```

### Update Environment Variables
```bash
# Update SUPABASE_SERVICE_KEY
echo 'NEW_KEY_HERE' | npx wrangler secret put SUPABASE_SERVICE_KEY

# List all secrets
npx wrangler secret list
```

### Delete Worker (If needed)
```bash
npx wrangler delete
```

---

## 🔐 Security

### Secrets Management
- ✅ `SUPABASE_SERVICE_KEY`: Stored as Cloudflare Secret (encrypted)
- ✅ `SUPABASE_URL`: Stored as Environment Variable
- ⚠️ **Never commit secrets to Git**
- ⚠️ **Never expose service key in logs**

### Best Practices
- Use Cloudflare secrets for sensitive data
- Rotate service keys regularly
- Monitor logs for suspicious activity
- Set up alerts for failed cron jobs

---

## 📖 Additional Resources

### Cloudflare Documentation
- [Workers Cron Triggers](https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/)
- [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Workers Observability](https://developers.cloudflare.com/workers/observability/)

### Project Documentation
- Main: `/home/user/webapp/README.md`
- Production: `/home/user/webapp/PRODUCTION_READY.md`
- New Features: `/home/user/webapp/NEW_FEATURES.md`

---

## ✅ Verification Checklist

- [x] Worker created and deployed
- [x] Cron trigger configured (`0 17 * * *`)
- [x] Environment variables set
- [x] Secrets configured
- [x] Manual test successful
- [x] Stats returned correctly
- [ ] Verify in Cloudflare Dashboard
- [ ] Monitor first automated run (tonight at 00:00 Vietnam time)

---

## 🎉 Summary

**Cloudflare Worker `quota-reset-worker` đã được thiết lập thành công!**

- ✅ Daily automatic quota reset at 00:00 Vietnam Time
- ✅ Downgrade expired users automatically
- ✅ Full logging and monitoring
- ✅ Manual testing available anytime
- ✅ Production-ready with security best practices

**Next Monitoring**: Kiểm tra logs sau khi cron chạy lần đầu (hôm nay lúc 00:00)
