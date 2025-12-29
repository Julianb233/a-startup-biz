# Stripe Connect Webhook Handler

## Overview

The Stripe Connect webhook handler at `app/api/webhooks/stripe/route.ts` has been updated to handle all critical Stripe Connect events for the partner payout system.

## Events Handled

### 1. `account.updated`
**Purpose**: Track changes to partner Stripe Connect accounts

**Actions**:
- Determines account status based on Stripe account state:
  - `pending`: Details not yet submitted
  - `active`: Charges and payouts enabled
  - `disabled`: Has a disabled_reason
  - `restricted`: Has outstanding requirements
- Updates partner's Stripe status fields in database
- Logs event to `stripe_connect_events` table for idempotency

**Database Updates**:
- `partners.stripe_account_status`
- `partners.stripe_payouts_enabled`
- `partners.stripe_charges_enabled`
- `partners.stripe_details_submitted`
- `partners.stripe_onboarding_complete`

### 2. `account.application.deauthorized`
**Purpose**: Handle when a partner disconnects their Stripe account

**Actions**:
- Marks partner account as `disabled`
- Disables all Stripe capabilities
- Logs deauthorization event

**Database Updates**:
- Sets all Stripe flags to `false`/`disabled`

### 3. `transfer.created`
**Purpose**: Track when commission transfers are created

**Actions**:
- Updates transfer status to `paid` or `reversed`
- Logs transfer details
- **Note**: Transfers might not exist in our DB yet if created externally

**Database Updates**:
- `partner_transfers.status`

### 4. `transfer.updated`
**Purpose**: Track changes to transfer status

**Actions**:
- Updates transfer status based on Stripe state
- Handles reversals
- Logs updates

**Database Updates**:
- `partner_transfers.status`

### 5. `payout.created`
**Purpose**: Track when partners initiate payouts

**Actions**:
- Updates payout status to `pending` or `in_transit`
- Records arrival date if available
- Logs payout creation

**Database Updates**:
- `partner_payouts.status`
- `partner_payouts.arrival_date`
- `partner_payouts.destination_type`

### 6. `payout.paid`
**Purpose**: Mark payouts as successfully completed

**Actions**:
- Updates status to `paid`
- Records arrival date
- Triggers balance recalculation via DB trigger

**Database Updates**:
- `partner_payouts.status` → `paid`
- `partner_payouts.arrival_date`
- Automatically updates `partners.available_balance` (via trigger)

### 7. `payout.failed`
**Purpose**: Handle failed payout attempts

**Actions**:
- Updates status to `failed`
- Records failure code and message
- Logs failure details

**Database Updates**:
- `partner_payouts.status` → `failed`
- `partner_payouts.failure_code`
- `partner_payouts.failure_message`
- `partner_payouts.failed_at`

## Idempotency

All Connect events use the `stripe_connect_events` table for idempotency:

```typescript
const alreadyProcessed = await isConnectEventProcessed(event.id)
if (alreadyProcessed) {
  console.log(`Connect event ${event.id} already processed`)
  break
}
```

Every event is logged with:
- `event_id`: Stripe event ID (unique)
- `event_type`: Type of event
- `stripe_account_id`: Connected account ID
- `partner_id`: Partner record ID
- `event_data`: Full event payload
- `processed`: Success/failure flag
- `error_message`: Error details if failed

## Error Handling

### Critical Errors (throw)
- `account.updated`: Re-throws errors to retry
- `account.application.deauthorized`: Re-throws errors to retry

### Non-Critical Errors (don't throw)
- `transfer.*`: Logs error but doesn't throw (transfer might not exist in our DB)
- `payout.*`: Logs error but doesn't throw (payout might not exist in our DB)

This prevents webhook failures for events we don't manage directly.

## Balance Updates

Balance updates happen automatically via database triggers:

1. When `transfer.status` → `paid`:
   - Increases `partners.available_balance`

2. When `payout.status` → `paid`:
   - Decreases `partners.available_balance`

3. Pending balances calculated from:
   - `partner_transfers` with `status = 'pending'`

See: `scripts/migrations/006_stripe_connect.sql` → `update_partner_balance()` function

## Environment Variables

Required:
- `STRIPE_WEBHOOK_SECRET`: For payment events (existing)
- `STRIPE_CONNECT_WEBHOOK_SECRET`: For Connect events (optional, can use same secret)

## Testing

### Test in Stripe Dashboard

1. Go to **Developers → Webhooks**
2. Click "Test webhook"
3. Select event type (e.g., `account.updated`)
4. Send test event
5. Check logs in webhook endpoint details

### Local Testing with Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger account.updated
stripe trigger transfer.created
stripe trigger payout.paid
```

## Monitoring

All events are logged to:
- Console output (check Vercel logs)
- `stripe_connect_events` table (check database)

Query recent events:
```sql
SELECT * FROM stripe_connect_events
ORDER BY created_at DESC
LIMIT 20;
```

Query unprocessed events:
```sql
SELECT * FROM stripe_connect_events
WHERE processed = false
ORDER BY created_at DESC;
```

## Implementation Details

### Database Functions Used

From `lib/db-queries.ts`:

- `isConnectEventProcessed(eventId)`: Check if event already processed
- `logConnectEvent(data)`: Log event to database
- `getPartnerByStripeAccountId(accountId)`: Find partner by Stripe account
- `updatePartnerStripeStatus(accountId, data)`: Update partner Stripe fields
- `updatePartnerTransferStatus(transferId, status)`: Update transfer status
- `updatePartnerPayoutStatus(payoutId, status, data)`: Update payout status

### Type Definitions

All types imported from `lib/types/stripe-connect.ts`:

- `StripeAccountStatus`: Account state enum
- `TransferStatus`: Transfer state enum
- `PayoutStatus`: Payout state enum

## Next Steps

1. **Set up webhook in Stripe Dashboard**:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to select:
     - `account.updated`
     - `account.application.deauthorized`
     - `transfer.created`
     - `transfer.updated`
     - `payout.created`
     - `payout.paid`
     - `payout.failed`

2. **Add webhook secret to environment**:
   ```bash
   STRIPE_CONNECT_WEBHOOK_SECRET=whsec_xxxxx
   ```

3. **Monitor initial events**:
   - Check logs for any errors
   - Verify database updates
   - Test with Stripe CLI

## Security

- ✅ Signature verification via `stripe.webhooks.constructEvent()`
- ✅ Idempotency via `stripe_connect_events` table
- ✅ Error logging without exposing sensitive data
- ✅ Partner balance calculated server-side (not from webhooks)
- ✅ Database triggers ensure consistency

## Common Issues

### Event Not Processing

1. Check webhook signature in Stripe Dashboard
2. Verify event is in `stripe_connect_events` table
3. Check for errors in `stripe_connect_events.error_message`

### Balance Not Updating

1. Verify transfer/payout status is `paid`
2. Check database triggers are active:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%balance%';
   ```
3. Manually trigger balance recalculation:
   ```sql
   UPDATE partners SET updated_at = NOW() WHERE id = 'partner-id';
   ```

### Duplicate Events

- Handled automatically via `isConnectEventProcessed()`
- Returns `{ received: true, duplicate: true }` for duplicates
- Safe to retry webhook deliveries
