# Security Incident Response Checklist
**A Startup Biz - Immediate Actions Required**

## 🚨 CRITICAL: Credentials Exposure (COMPLETE WITHIN 24 HOURS)

### Step 1: Credential Rotation (PRIORITY 1)

**Status:** ⏳ PENDING

Rotate the following credentials immediately:

#### Database
- [ ] Neon PostgreSQL password
- [ ] Update `DATABASE_URL` in production environment
- [ ] Test database connectivity after rotation

#### Payment Processing
- [ ] Stripe Secret Key (production)
- [ ] Stripe Secret Key (test)
- [ ] Stripe Webhook Secret
- [ ] Stripe Connect Webhook Secret
- [ ] Update in Vercel/deployment platform

#### Authentication
- [ ] Supabase Service Role Key
- [ ] Supabase Anon Key
- [ ] Clerk Secret Key (if enabled)
- [ ] Update in Vercel environment variables

#### Third-Party APIs
- [ ] OpenAI API Key
- [ ] Twilio Account SID & Auth Token
- [ ] HubSpot API Key
- [ ] Resend API Key
- [ ] FireCrawl API Key
- [ ] Dropbox Sign API Key
- [ ] LiveKit API Key & Secret
- [ ] Upstash Redis URL & Token
- [ ] Sentry Auth Token

#### Webhook Secrets
- [ ] n8n Webhook Secret
- [ ] Custom webhook secrets

### Step 2: Git History Cleanup (PRIORITY 1)

**Status:** ⏳ PENDING

Remove sensitive files from git history:

```bash
# 1. Backup current repository
cd /Users/julianbradley/github-repos/a-startup-biz
git clone --mirror . ../a-startup-biz-backup

# 2. Remove .env files from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local .env.production" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push to remote (WARNING: This rewrites history)
git push origin --force --all
git push origin --force --tags

# 4. Clean up local references
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Verify files are gone
git log --all --full-history -- .env.local
git log --all --full-history -- .env.production
# Should return no results
```

- [ ] Backup repository created
- [ ] Files removed from history
- [ ] Force push completed
- [ ] Verification completed
- [ ] Team notified to re-clone repository

### Step 3: Verify .gitignore (PRIORITY 1)

**Status:** ⏳ PENDING

```bash
# Check current .gitignore
cat .gitignore | grep env

# Verify ignored files
git status --ignored | grep env

# Test by creating dummy .env.local
touch .env.local
git status
# Should show as ignored, not untracked
rm .env.local
```

- [ ] .gitignore verified
- [ ] Test file ignored correctly
- [ ] Documentation updated

### Step 4: Secrets Management Setup (PRIORITY 2)

**Status:** ⏳ PENDING

Choose one approach:

#### Option A: Vercel Environment Variables (Recommended for Next.js)
- [ ] Navigate to Vercel project settings
- [ ] Add all environment variables
- [ ] Separate by environment (Production, Preview, Development)
- [ ] Enable "Encrypted" for sensitive values
- [ ] Remove local .env files
- [ ] Use `vercel env pull` for local development

#### Option B: AWS Secrets Manager
- [ ] Create secrets in AWS Secrets Manager
- [ ] Configure IAM roles for access
- [ ] Update application to fetch secrets at runtime
- [ ] Document secret naming conventions

#### Option C: HashiCorp Vault
- [ ] Set up Vault server
- [ ] Configure authentication method
- [ ] Store secrets in Vault
- [ ] Update app to use Vault SDK

### Step 5: n8n Webhook Security Fix (PRIORITY 1)

**Status:** ✅ FIXED

- [x] Removed default webhook secret value
- [x] Added startup check for missing secret
- [x] Added request blocking when unconfigured
- [ ] Set `N8N_WEBHOOK_SECRET` in production environment
- [ ] Test webhook with new secret
- [ ] Update n8n integration documentation

---

## 🔒 HIGH PRIORITY: Multi-Factor Authentication (COMPLETE WITHIN 1 WEEK)

### Admin MFA Enforcement

**Platform:** Clerk / Supabase

- [ ] Enable MFA in Clerk/Supabase dashboard
- [ ] Set MFA as required for admin role
- [ ] Configure supported methods (TOTP, SMS, Biometric)
- [ ] Test admin login flow with MFA
- [ ] Document MFA recovery process

### User MFA Offering

- [ ] Enable optional MFA for all users
- [ ] Add MFA settings to user dashboard
- [ ] Create UI for MFA enrollment
- [ ] Add backup codes generation
- [ ] Test enrollment and login flows

---

## ⚠️ MEDIUM PRIORITY: Security Headers (COMPLETE WITHIN 2 WEEKS)

### Content Security Policy (CSP)

**Status:** ⏳ PENDING

Edit `next.config.mjs`:

```javascript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.livekit.cloud",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.livekit.cloud wss://*.livekit.cloud",
    "frame-src 'self' https://js.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}
```

- [ ] Add CSP headers to next.config.mjs
- [ ] Test all pages with CSP enabled
- [ ] Fix any CSP violations
- [ ] Add CSP report endpoint
- [ ] Monitor CSP reports

### CORS Configuration

- [ ] Identify APIs requiring CORS
- [ ] Implement CORS middleware
- [ ] Whitelist specific origins
- [ ] Add preflight OPTIONS handling
- [ ] Test cross-origin requests

---

## 📝 MEDIUM PRIORITY: Logging & Monitoring (COMPLETE WITHIN 2 WEEKS)

### Structured Logging

**Status:** ⏳ PENDING

Create `lib/logger.ts`:

```typescript
import { logger as sentryLogger } from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  requestId?: string
  [key: string]: any
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'production') {
      return level === 'error' || level === 'warn'
    }
    return true
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.debug(message, context)
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(message, context)
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(message, context)
      sentryLogger.warn(message, context)
    }
  }

  error(message: string, error: Error, context?: LogContext) {
    console.error(message, error, context)
    sentryLogger.error(message, { error, ...context })
  }
}

export const logger = new Logger()
```

- [ ] Create logger utility
- [ ] Replace console.log in API routes
- [ ] Replace console.error with logger.error
- [ ] Configure Sentry error tracking
- [ ] Set up log aggregation (CloudWatch/Datadog)

### Security Monitoring

- [ ] Set up Sentry performance monitoring
- [ ] Configure rate limit alerts
- [ ] Add failed authentication alerts
- [ ] Monitor webhook signature failures
- [ ] Create security dashboard

---

## 🔍 LOW PRIORITY: Security Enhancements (COMPLETE WITHIN 1 MONTH)

### CSRF Protection

- [ ] Install `next-csrf` package
- [ ] Add CSRF middleware
- [ ] Update forms with CSRF tokens
- [ ] Test form submissions
- [ ] Document CSRF implementation

### Session Management

- [ ] Configure Supabase session timeout (7 days absolute, 24h idle)
- [ ] Enable refresh token rotation
- [ ] Add session activity logging
- [ ] Test session expiration
- [ ] Document session policies

### Password Policies

- [ ] Document minimum requirements
- [ ] Configure in Supabase/Clerk dashboard
- [ ] Add password strength meter to signup
- [ ] Test password validation
- [ ] Add "forgot password" flow monitoring

### API Response Sanitization

- [ ] Review all error responses
- [ ] Replace detailed errors with codes
- [ ] Create error code documentation
- [ ] Update API clients
- [ ] Test error handling

---

## 🛡️ ONGOING: Security Maintenance

### Weekly
- [ ] Review security logs in Sentry
- [ ] Check for failed authentication attempts
- [ ] Monitor rate limit violations
- [ ] Review webhook failures

### Monthly
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review access logs for suspicious activity
- [ ] Rotate webhook secrets
- [ ] Update dependencies
- [ ] Test incident response procedures

### Quarterly
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review and update security policies
- [ ] Team security training
- [ ] Disaster recovery drill

---

## 📞 Incident Response Contacts

| Role | Name | Contact |
|------|------|---------|
| Security Lead | TBD | security@astartupbiz.com |
| DevOps Lead | TBD | devops@astartupbiz.com |
| CEO | TBD | ceo@astartupbiz.com |
| Legal | TBD | legal@astartupbiz.com |

---

## 📚 Documentation Required

- [ ] Security incident response plan
- [ ] Credential rotation procedures
- [ ] Disaster recovery plan
- [ ] Data breach notification procedures
- [ ] Security training materials
- [ ] Third-party security questionnaire responses

---

## ✅ Completion Checklist

### Critical (24 hours)
- [ ] All credentials rotated
- [ ] .env files removed from git history
- [ ] n8n webhook secured
- [ ] Secrets management platform configured

### High Priority (1 week)
- [ ] MFA enforced for admin accounts
- [ ] MFA available for all users
- [ ] Structured logging implemented

### Medium Priority (2 weeks)
- [ ] CSP headers configured
- [ ] CORS properly configured
- [ ] console.log replaced with structured logging
- [ ] Security monitoring dashboard

### Low Priority (1 month)
- [ ] CSRF protection implemented
- [ ] Session timeouts configured
- [ ] Password policies documented
- [ ] API responses sanitized

---

**Last Updated:** January 2, 2026
**Review Date:** February 1, 2026
**Assigned To:** Engineering Team
**Status:** 🚨 CRITICAL ACTION REQUIRED
