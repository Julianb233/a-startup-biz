# HubSpot CRM Integration

Complete HubSpot integration for A Startup Biz - automatically syncs onboarding submissions to HubSpot CRM.

## Features

- **Auto-sync on submission**: Contacts and deals are created/updated in HubSpot when users submit the onboarding form
- **Duplicate detection**: Automatically finds and updates existing contacts by email
- **Deal qualification**: Creates deals for qualified leads based on budget and priority
- **Webhook support**: Receives updates from HubSpot when deals change
- **Rate limiting**: Built-in retry logic and rate limit handling
- **Error resilience**: Non-blocking sync - won't fail onboarding if HubSpot is down

## Setup

### 1. Get HubSpot API Key

1. Log in to your HubSpot account
2. Navigate to **Settings** → **Integrations** → **API Key**
3. Click **Generate API Key** (or copy existing)
4. Copy the API key

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# Required
HUBSPOT_API_KEY=your_api_key_here

# Optional (for webhook signature verification)
HUBSPOT_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Set Up Custom Properties in HubSpot (Optional)

For best results, create these custom contact properties in HubSpot:

**Contact Properties:**
- `business_name` (Single-line text)
- `business_type` (Single-line text)
- `business_stage` (Single-line text)
- `business_size` (Dropdown)
- `revenue_range` (Single-line text)
- `years_in_business` (Number)
- `timeline` (Dropdown)
- `budget_range` (Single-line text)
- `primary_challenge` (Single-line text)
- `services_interested` (Multi-line text)
- `priority_level` (Dropdown: Low, Medium, High, Urgent)
- `referral_source` (Single-line text)
- `referral_code` (Single-line text)

**Deal Properties:**
- `deal_type` (Dropdown)
- `deal_source` (Dropdown)
- `services_requested` (Multi-line text)

Navigate to: **Settings** → **Properties** → **Contact/Deal Properties** → **Create Property**

### 4. Configure Webhooks (Optional)

To receive updates from HubSpot:

1. Go to **Settings** → **Integrations** → **Webhooks**
2. Click **Create webhook**
3. Set webhook URL: `https://yourdomain.com/api/crm/hubspot/webhook`
4. Select events to subscribe:
   - `deal.propertyChange`
   - `deal.creation`
   - `contact.propertyChange`
5. Set a webhook secret and add it to `HUBSPOT_WEBHOOK_SECRET` in `.env.local`

## Usage

### Automatic Sync

The integration automatically syncs when users submit the onboarding form. No additional code needed!

### Manual Sync via API

```bash
# Sync a contact
curl -X POST https://yourdomain.com/api/crm/hubspot/sync \
  -H "Content-Type: application/json" \
  -d '{
    "contactEmail": "user@example.com",
    "contactName": "John Doe",
    "companyName": "Acme Corp",
    "timeline": "1-3 months",
    "budgetRange": "$5,000 - $10,000",
    "createDeal": true
  }'

# Check sync status
curl https://yourdomain.com/api/crm/hubspot/sync?email=user@example.com
```

### Programmatic Usage

```typescript
import { upsertContact, createDealFromOnboarding } from '@/lib/hubspot';

// Create or update contact
const { contact, created } = await upsertContact({
  contactEmail: 'user@example.com',
  contactName: 'John Doe',
  companyName: 'Acme Corp',
  timeline: '1-3 months',
  budgetRange: '$5,000 - $10,000',
});

// Create deal for qualified lead
const deal = await createDealFromOnboarding(
  {
    contactEmail: 'user@example.com',
    companyName: 'Acme Corp',
    budgetRange: '$5,000 - $10,000',
    priorityLevel: 'high',
  },
  contact.id
);
```

## Architecture

```
┌─────────────────────────┐
│  Onboarding Form        │
│  /app/api/onboarding    │
└──────────┬──────────────┘
           │
           ├─→ Database (Neon PostgreSQL)
           │
           └─→ HubSpot CRM
               │
               ├─→ Contact (upsert by email)
               └─→ Deal (if qualified)

┌─────────────────────────┐
│  HubSpot Webhooks       │
└──────────┬──────────────┘
           │
           ├─→ Deal updates
           ├─→ Contact updates
           └─→ Sync back to database
```

## File Structure

```
/lib/hubspot/
├── client.ts          # API client with retry & rate limiting
├── contacts.ts        # Contact CRUD operations
├── deals.ts          # Deal management & pipelines
├── types.ts          # TypeScript interfaces
├── index.ts          # Convenience exports
└── README.md         # This file

/app/api/crm/hubspot/
├── sync/route.ts     # Manual sync endpoint
└── webhook/route.ts  # Webhook handler
```

## Data Mapping

### Contact Properties

| Onboarding Field | HubSpot Property |
|-----------------|------------------|
| contactEmail | email |
| contactName | firstname, lastname |
| contactPhone | phone |
| companyName | company, business_name |
| website | website |
| industry | industry, business_type |
| timeline | timeline |
| budgetRange | budget_range |
| priorityLevel | priority_level |
| servicesInterested | services_interested |

### Deal Properties

| Field | HubSpot Property |
|-------|------------------|
| Company Name | dealname |
| Timeline → Days | closedate |
| Budget Range → Amount | amount |
| Deal Stage | dealstage |
| Pipeline | pipeline |

### Lifecycle Stages

Contacts are automatically assigned lifecycle stages:

- New submission → `lead`
- Has budget & timeline → `marketingqualifiedlead`
- Deal created → `opportunitylead`

### Deal Stages

Deals progress through stages:

- Initial → `appointmentscheduled`
- Qualified → `qualifiedtobuy`
- Won → `closedwon`
- Lost → `closedlost`

## Error Handling

The integration is designed to be resilient:

- **Non-blocking**: If HubSpot is down, onboarding still succeeds
- **Automatic retries**: Failed requests retry with exponential backoff
- **Rate limiting**: Respects HubSpot's API limits automatically
- **Detailed logging**: All sync attempts logged for debugging

## Rate Limits

HubSpot API limits (as of 2024):

- **Daily**: 250,000 requests
- **Per 10 seconds**: 100 requests (burst)

The client automatically handles rate limiting with retries.

## Testing

### Test the connection

```typescript
import { getHubSpotClient } from '@/lib/hubspot/client';

const client = getHubSpotClient();
const isConnected = await client.verifyConnection();
console.log('HubSpot connected:', isConnected);
```

### Test contact creation

```bash
# Via API
curl -X POST http://localhost:3000/api/crm/hubspot/sync \
  -H "Content-Type: application/json" \
  -d '{
    "contactEmail": "test@example.com",
    "contactName": "Test User",
    "companyName": "Test Company"
  }'
```

## Troubleshooting

### "HubSpot API key is required" error

Make sure `HUBSPOT_API_KEY` is set in `.env.local`

### Contact not syncing

Check logs for errors. Common issues:
- Invalid API key
- HubSpot rate limit exceeded
- Network timeout

### Webhook not receiving events

1. Verify webhook URL is publicly accessible
2. Check webhook secret matches
3. Ensure webhook is active in HubSpot settings
4. Check webhook logs in HubSpot

### Custom properties not populating

Create the custom properties in HubSpot first (see Setup step 3)

## Security

- API key stored securely in environment variables
- Webhook signatures verified (if secret configured)
- No sensitive data logged
- Rate limiting on sync endpoint

## Support

For issues or questions:
- Check HubSpot API documentation: https://developers.hubspot.com/docs/api/overview
- Review integration logs
- Verify API key has correct permissions

## License

Part of A Startup Biz project
