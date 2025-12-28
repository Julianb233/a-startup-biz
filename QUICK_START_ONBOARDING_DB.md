# Quick Start: Onboarding Database Integration

## 🚀 Deploy in 3 Steps

### Step 1: Run Migration
```bash
cd /root/github-repos/a-startup-biz
pnpm db:migrate:enhanced
```

### Step 2: Verify
```sql
SELECT * FROM get_onboarding_stats();
```

### Step 3: Test
- Submit test onboarding form
- Check database for data

---

## 📝 What Was Added

### New Database Fields:
- `form_data` (JSONB) - All form fields in queryable format
- `source` - Where submission came from
- `ip_address` - Client IP
- `user_agent` - Browser info
- `referral_code` - Referral tracking
- `completion_percentage` - Progress (0-100)

---

## 🔍 Quick Queries

### Get All Submissions (Detailed)
```sql
SELECT * FROM onboarding_submissions_detailed
ORDER BY created_at DESC LIMIT 10;
```

### Get Statistics
```sql
SELECT * FROM get_onboarding_stats();
```

### Search by Service
```sql
SELECT * FROM search_onboarding_by_service('Web Design & Development');
```

### High Priority Leads
```sql
SELECT
  business_name,
  contact_email,
  form_data->>'priorityLevel' as priority
FROM onboarding_submissions
WHERE form_data->>'priorityLevel' = 'Critical - Need ASAP';
```

### Budget Range Filter
```sql
SELECT
  business_name,
  form_data->>'budgetRange' as budget
FROM onboarding_submissions
WHERE form_data->>'budgetRange' = '$25,000 - $50,000';
```

---

## 📦 NPM Scripts

```bash
pnpm db:migrate:enhanced    # Run onboarding migration
pnpm db:migrate:all         # Run all migrations
```

---

## 📚 Documentation

- **Full Summary**: `/ONBOARDING_INTEGRATION_SUMMARY.md`
- **Setup Guide**: `/ONBOARDING_DB_SETUP.md`
- **Migration Docs**: `/scripts/migrations/README.md`
- **Migration SQL**: `/scripts/migrations/004_enhanced_onboarding.sql`

---

## ✅ Checklist

- [ ] Run migration: `pnpm db:migrate:enhanced`
- [ ] Verify: `SELECT * FROM get_onboarding_stats();`
- [ ] Test form submission
- [ ] Check data in database
- [ ] Build admin dashboard (optional)

---

## 🆘 Troubleshooting

**Migration already run?** - Safe to re-run, uses IF NOT EXISTS

**Connection error?** - Check `DATABASE_URL` in `.env`

**TypeScript errors?** - Restart TS server in VS Code

---

## 💡 Pro Tips

1. Use `onboarding_submissions_detailed` view for easier queries
2. Index on `form_data` enables fast JSON searches
3. `get_onboarding_stats()` function for quick analytics
4. All migrations are idempotent (safe to re-run)

---

**Status**: ✅ Ready to Deploy
