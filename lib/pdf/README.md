# PDF Quote Generation System

A comprehensive PDF quote generation system for A Startup Biz, built with TypeScript, jsPDF, and Next.js.

## Features

- **Professional PDF Quotes**: Generate branded, professional-looking PDF quotes
- **Customizable Templates**: Multiple quote templates for different service types
- **Automatic Pricing**: Smart pricing based on business type and stage
- **Onboarding Integration**: Auto-generate quotes from onboarding submissions
- **Database Storage**: Full quote tracking with line items and activity logs
- **RESTful API**: Complete API for quote generation and management
- **Type-Safe**: Comprehensive TypeScript types and interfaces

## Quick Start

### 1. Run Database Migration

```bash
npm run db:migrate
tsx scripts/create-quotes-table.ts
```

### 2. Generate a Quote

#### From API (Manual Quote)

```typescript
// POST /api/pdf/generate
const response = await fetch('/api/pdf/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: {
      name: 'John Doe',
      businessName: 'Tech Startup Inc',
      email: 'john@techstartup.com',
      phone: '(555) 123-4567',
    },
    lineItems: [
      {
        id: '1',
        description: 'Brand Strategy Consultation',
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
        category: 'consulting',
      },
      {
        id: '2',
        description: 'Website Development',
        quantity: 1,
        unitPrice: 8000,
        total: 8000,
        category: 'web-development',
      },
    ],
    taxRate: 8.5,
    notes: 'Custom project requirements',
  }),
})

const { quote, pdf } = await response.json()

// Download PDF
const pdfData = atob(pdf.data) // Base64 decode
const blob = new Blob([pdfData], { type: 'application/pdf' })
const url = URL.createObjectURL(blob)
window.open(url)
```

#### From Onboarding Submission

```typescript
// POST /api/onboarding/[id]/quote
const response = await fetch(`/api/onboarding/${submissionId}/quote`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    includeDisclaimer: true,
    taxRate: 8.5,
  }),
})

const { quoteId } = await response.json()
```

### 3. Retrieve a Quote

```typescript
// GET /api/pdf/quotes/[id]
const response = await fetch(`/api/pdf/quotes/${quoteId}`)
const { quote, lineItems, activities } = await response.json()

// Download PDF
const pdfResponse = await fetch(`/api/pdf/quotes/${quoteId}?download=true`)
const blob = await pdfResponse.blob()
const url = URL.createObjectURL(blob)
window.open(url)
```

## API Reference

### POST /api/pdf/generate

Generate a new quote.

**Request Body:**

```typescript
{
  customer: {
    name: string
    businessName: string
    email: string
    phone?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
  }
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    category?: string
    notes?: string
  }>
  taxRate?: number
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    description: string
  }
  notes?: string
  onboardingSubmissionId?: string
  options?: {
    includeWatermark?: boolean
    watermarkText?: string
    format?: 'letter' | 'a4'
    currency?: string
    locale?: string
  }
}
```

**Response:**

```typescript
{
  success: true
  quote: {
    id: string
    quoteNumber: string
    status: string
    total: number
    issueDate: Date
    expiryDate: Date
  }
  pdf: {
    filename: string
    size: number
    pageCount: number
    data: string // Base64 encoded PDF
  }
}
```

### GET /api/pdf/quotes/[id]

Retrieve quote details.

**Query Parameters:**

- `regenerate=true` - Regenerate the PDF
- `download=true` - Download PDF file

**Response:**

```typescript
{
  quote: Quote
  lineItems: QuoteLineItem[]
  activities: QuoteActivity[]
}
```

### PUT /api/pdf/quotes/[id]

Update quote status or details.

**Request Body:**

```typescript
{
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  signatureUrl?: string
  customer?: Partial<CustomerInfo>
  lineItems?: QuoteLineItem[]
  terms?: Partial<QuoteTerms>
}
```

### POST /api/onboarding/[id]/quote

Generate quote from onboarding submission.

**Request Body:**

```typescript
{
  includeDisclaimer?: boolean
  customServices?: Array<{
    name: string
    price: number
  }>
  taxRate?: number
}
```

**Response:**

```typescript
{
  success: true
  quoteId: string
  message: string
}
```

## Database Schema

### quotes

```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY,
  user_id TEXT,
  onboarding_submission_id UUID,
  quote_number VARCHAR(50) UNIQUE,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  business_name VARCHAR(255),
  quote_data JSONB,
  pdf_url TEXT,
  pdf_storage_path TEXT,
  status VARCHAR(20),
  subtotal DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  total DECIMAL(10, 2),
  issue_date TIMESTAMP,
  expiry_date TIMESTAMP,
  sent_at TIMESTAMP,
  accepted_at TIMESTAMP,
  rejected_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### quote_line_items

```sql
CREATE TABLE quote_line_items (
  id UUID PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id),
  description TEXT,
  category VARCHAR(100),
  quantity DECIMAL(10, 2),
  unit_price DECIMAL(10, 2),
  total DECIMAL(10, 2),
  notes TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP
)
```

### quote_activities

```sql
CREATE TABLE quote_activities (
  id UUID PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id),
  activity_type VARCHAR(50),
  description TEXT,
  performed_by TEXT,
  metadata JSONB,
  created_at TIMESTAMP
)
```

## Type Definitions

All TypeScript types are defined in `/lib/pdf/types.ts`:

- `Quote` - Complete quote object
- `QuoteLineItem` - Individual line item
- `CustomerInfo` - Customer details
- `QuoteMetadata` - Quote metadata
- `PDFGenerationOptions` - PDF generation options
- `QuoteCreateInput` - Input for creating quotes
- `QuoteUpdateInput` - Input for updating quotes

## Pricing Logic

The system includes smart pricing based on:

1. **Business Type**: Different pricing for tech startups, e-commerce, service businesses
2. **Business Stage**: Multipliers for idea (0.8x), startup (1.0x), growing (1.2x), established (1.5x)
3. **Goals**: Services automatically added based on customer goals
4. **Timeline**: Priority pricing for urgent timelines

### Example Pricing

```typescript
Tech Startup (Growing Stage):
- Base Consultation: $5,000 × 1.2 = $6,000
- Brand Strategy: $3,000 × 1.2 = $3,600
- Web Development: $8,000 × 1.2 = $9,600
Total: $19,200
```

## Customization

### Custom Templates

Create custom templates by modifying the PDF generator:

```typescript
// lib/pdf/generator.ts
export async function generateQuotePDF(
  quote: Quote,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  // Customize header, colors, layout, etc.
}
```

### Custom Pricing

Add custom pricing rules in:

```typescript
// lib/pdf/onboarding-integration.ts
const SERVICE_PRICING = {
  'your-business-type': {
    basePrice: 5000,
    services: {
      'your-service': 3000,
    },
  },
}
```

## Error Handling

All API endpoints include comprehensive error handling:

```typescript
{
  error: string
  details?: string
}
```

Common error codes:

- `400` - Bad request (missing/invalid data)
- `404` - Quote/submission not found
- `500` - Server error (PDF generation failed, database error)

## Testing

### Manual Test

```bash
# Generate test quote
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test Customer",
      "businessName": "Test Business",
      "email": "test@example.com"
    },
    "lineItems": [{
      "id": "1",
      "description": "Test Service",
      "quantity": 1,
      "unitPrice": 1000,
      "total": 1000
    }]
  }'
```

## Future Enhancements

- [ ] Email quote delivery
- [ ] E-signature integration
- [ ] Payment link integration
- [ ] Quote templates library
- [ ] Bulk quote generation
- [ ] Quote analytics dashboard
- [ ] Custom branding per quote
- [ ] Multi-currency support
- [ ] Invoice conversion

## License

Proprietary - A Startup Biz © 2024
