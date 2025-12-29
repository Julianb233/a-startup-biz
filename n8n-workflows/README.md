# n8n Workflow Integration

## Partner Onboarding Automation

Automates the partner onboarding process with FireCrawl website scraping, microsite creation, and notifications.

### Workflow: `partner-onboarding-automation.json`

**Triggers:**
- **Webhook:** Call when partner is approved
- **Schedule:** Every hour (for batch processing)

**Actions:**
1. Scrape partner website (FireCrawl)
2. Create branded microsite
3. Send welcome email
4. Notify Slack channel

### Setup Instructions

#### 1. Import Workflow

1. Open n8n
2. Click **Add Workflow** → **Import from JSON**
3. Paste contents of `partner-onboarding-automation.json`
4. Save workflow

#### 2. Configure Environment Variables

In n8n Settings → Environment Variables:

```
ASTARTUPBIZ_URL=https://astartupbiz.com
```

#### 3. Create Credentials

**HTTP Header Auth** (for webhook endpoint):
- Name: `Partner Webhook Auth`
- Header Name: `x-webhook-secret`
- Header Value: Your `N8N_WEBHOOK_SECRET` from A Startup Biz

**Slack** (for notifications):
- Connect your Slack workspace
- Name: `Slack Account`

#### 4. Add Webhook Secret to A Startup Biz

In `.env.local`:
```bash
N8N_WEBHOOK_SECRET=your-secure-webhook-secret
```

#### 5. Activate Workflow

Click **Activate** in n8n.

### Webhook Endpoint

**URL:** `https://astartupbiz.com/api/webhooks/n8n/partner-automation`

**Authentication:** Header `x-webhook-secret: your-secret`

**Actions:**

| Action | Description |
|--------|-------------|
| `scrape_website` | Scrape partner website and update microsite |
| `create_microsite` | Create a new microsite for partner |
| `send_welcome_email` | Send onboarding welcome email |
| `rescrape_all` | Re-scrape all outdated partner websites (30+ days) |
| `sync_partner` | Get partner data for external sync |

**Example Request:**
```bash
curl -X POST https://astartupbiz.com/api/webhooks/n8n/partner-automation \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{"action": "scrape_website", "partnerId": "uuid-here"}'
```

### Triggering from App

When a partner is approved in the admin panel, call the n8n webhook:

```typescript
// In approval-service.ts or admin approve endpoint
await fetch(`${process.env.N8N_HOST}/webhook/partner-approved`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ partnerId: partner.id })
})
```

### Monitoring

- Check n8n Executions tab for workflow runs
- Slack notifications sent to `#partners` channel
- Errors logged to Sentry

### Customization

**Change schedule:** Edit "Every Hour" node
**Add more notifications:** Duplicate Slack node, change channel
**Integrate CRM:** Add HTTP Request node after "Sync Partner" action
