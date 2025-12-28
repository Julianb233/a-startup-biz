# PDF Quote Generation System

Complete PDF quote generation system for A Startup Biz with professional templates, database integration, and API endpoints.

## 📁 File Structure

```
/lib/pdf/
├── generator.ts              # Core PDF generation (existing)
├── pdf-generator.ts          # Enhanced PDF generator with templates (NEW)
├── quote-template.ts         # Professional template components (NEW)
├── types.ts                  # PDF-specific types (existing)
└── QUOTE_SYSTEM_README.md    # This file (NEW)

/lib/types/
└── quote.ts                  # Quote type definitions (NEW)

/app/api/
├── pdf/
│   └── generate/
│       └── route.ts          # PDF generation endpoint (existing, enhanced)
└── quotes/
    └── route.ts              # Quote CRUD operations (NEW)
```

## 🚀 Features

### Core Functionality
- ✅ Professional PDF generation with jsPDF
- ✅ Auto-table generation with jspdf-autotable
- ✅ Database persistence (PostgreSQL via Neon)
- ✅ Rate limiting (10 PDFs per 10 minutes)
- ✅ Quote number auto-generation (QT-YYYYMMDD-XXX)
- ✅ Tax calculations and discounts
- ✅ Line item management
- ✅ Activity logging

### Design Features
- ✅ A Startup Biz branding (orange #ff6a1a)
- ✅ Gradient headers
- ✅ Professional layout with rounded corners
- ✅ Alternating row colors in tables
- ✅ Visual hierarchy for totals
- ✅ Terms and conditions section
- ✅ Custom watermarks (DRAFT, PREVIEW, etc.)
- ✅ Multi-page support

## 📝 API Endpoints

### 1. Create Quote with PDF
**POST** `/api/quotes`

Creates a new quote and generates PDF.

**Rate Limit:** 20 requests per hour

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
  },
  lineItems: [
    {
      description: string
      quantity: number
      unitPrice: number
      category?: string
      notes?: string
    }
  ],
  taxRate?: number,              // e.g., 8.5 for 8.5%
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    description: string
  },
  terms?: {
    paymentTerms?: string
    deliveryTerms?: string
    validityPeriod?: string
    notes?: string[]
    conditions?: string[]
  },
  notes?: string,
  onboardingSubmissionId?: string,
  options?: {
    includeWatermark?: boolean
    watermarkText?: string
    format?: 'letter' | 'a4'
    locale?: string
    currency?: string
  }
}
```

**Response:**
```typescript
{
  success: true,
  quote: {
    id: string
    quoteNumber: string
    status: string
    total: number
    subtotal: number
    taxAmount: number
    discountAmount?: number
    issueDate: Date
    expiryDate: Date
    customer: { ... }
  },
  pdf: {
    filename: string
    data: string              // Base64 encoded PDF
    size: number
    pageCount: number
  }
}
```

### 2. List Quotes
**GET** `/api/quotes`

List user's quotes with filtering and pagination.

**Query Parameters:**
- `status` - Filter by status (draft, sent, accepted, rejected, expired, all)
- `customerEmail` - Filter by customer email
- `search` - Search in customer name, business name, or quote number
- `minTotal` - Minimum total amount
- `maxTotal` - Maximum total amount
- `onboardingSubmissionId` - Filter by onboarding submission
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset
- `sortBy` - Sort field (created_at, issue_date, total, status)
- `sortOrder` - Sort direction (asc, desc)
- `stats` - Include statistics (true/false)

**Response:**
```typescript
{
  success: true,
  quotes: QuoteListItem[],
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  },
  statistics?: {
    total: number
    byStatus: { ... }
    totalValue: number
    acceptedValue: number
    averageValue: number
    conversionRate: number
    expiringSoon: number
  }
}
```

### 3. Generate PDF (Direct)
**POST** `/api/pdf/generate`

Generates PDF without full quote creation flow.

**Rate Limit:** 10 requests per 10 minutes

### 4. Get Quote by ID
**GET** `/api/pdf/quotes/[id]`

Retrieves a specific quote with line items and activities.

**Query Parameters:**
- `regenerate` - Regenerate PDF (true/false)
- `download` - Return as downloadable file (true/false)

### 5. Update Quote
**PUT** `/api/pdf/quotes/[id]`

Updates quote status, customer info, or line items.

### 6. Delete Quote
**DELETE** `/api/pdf/quotes/[id]`

Soft deletes a quote (marks as expired).

## 💻 Usage Examples

### Create a Quote

```typescript
const response = await fetch('/api/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: {
      name: 'John Doe',
      businessName: 'Acme Corp',
      email: 'john@acme.com',
      phone: '(555) 123-4567',
    },
    lineItems: [
      {
        description: 'Website Development',
        quantity: 1,
        unitPrice: 5000,
        category: 'Web Development',
      },
      {
        description: 'SEO Optimization',
        quantity: 3,
        unitPrice: 500,
        category: 'Marketing',
      },
    ],
    taxRate: 8.5,
    discount: {
      type: 'percentage',
      value: 10,
      description: 'Early bird discount',
    },
  }),
})

const data = await response.json()

// Download PDF
const pdfData = atob(data.pdf.data)
const blob = new Blob([pdfData], { type: 'application/pdf' })
const url = URL.createObjectURL(blob)
window.open(url)
```

### List Quotes with Filters

```typescript
const params = new URLSearchParams({
  status: 'sent',
  limit: '25',
  sortBy: 'created_at',
  sortOrder: 'desc',
  stats: 'true',
})

const response = await fetch(`/api/quotes?${params}`)
const data = await response.json()

console.log('Total quotes:', data.pagination.total)
console.log('Conversion rate:', data.statistics.conversionRate)
```

### Download Quote PDF

```typescript
const quoteId = 'abc-123'
const response = await fetch(`/api/pdf/quotes/${quoteId}?download=true`)
const blob = await response.blob()

// Create download link
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `quote-${quoteId}.pdf`
a.click()
```

## 🎨 Customization

### Brand Colors

Defined in `/lib/pdf/quote-template.ts`:

```typescript
export const BRAND_COLORS = {
  primary: '#ff6a1a',        // A Startup Biz Orange
  accent: '#ea580c',         // Darker Orange
  secondary: '#c0c0c0',      // Silver
  // ... more colors
}
```

### Template Layout

Customize spacing and dimensions:

```typescript
export const TEMPLATE_LAYOUT = {
  margins: { top: 15, right: 15, bottom: 20, left: 15 },
  header: { height: 35, logoWidth: 40, logoHeight: 20 },
  sections: { spacing: 10, gap: 8 },
  footer: { height: 20 },
}
```

### Default Terms

Modify in `/lib/pdf/types.ts`:

```typescript
export const DEFAULT_QUOTE_TERMS: QuoteTerms = {
  paymentTerms: 'Payment due within 30 days of invoice date',
  deliveryTerms: 'Services to be delivered within agreed timeline',
  validityPeriod: '30 days',
  notes: [...],
  conditions: [...],
}
```

## 🗄️ Database Schema

### quotes table
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `onboarding_submission_id` - Foreign key to onboarding_submissions
- `quote_number` - Unique quote identifier (QT-YYYYMMDD-XXX)
- `customer_email`, `customer_name`, `business_name`
- `quote_data` - JSONB full quote object
- `pdf_url`, `pdf_storage_path`
- `status` - draft | sent | accepted | rejected | expired
- `subtotal`, `tax_amount`, `discount_amount`, `total`
- `issue_date`, `expiry_date`
- `sent_at`, `accepted_at`, `rejected_at`
- `created_at`, `updated_at`

### quote_line_items table
- `id` - UUID primary key
- `quote_id` - Foreign key to quotes
- `description`, `category`
- `quantity`, `unit_price`, `total`
- `notes`
- `sort_order`
- `created_at`

### quote_activities table
- `id` - UUID primary key
- `quote_id` - Foreign key to quotes
- `activity_type` - created | updated | sent | accepted | rejected
- `description`
- `performed_by`
- `metadata` - JSONB
- `created_at`

## 🔒 Security

### Rate Limiting
- **PDF Generation:** 10 requests per 10 minutes (resource intensive)
- **Quote Creation:** 20 requests per hour
- Uses Upstash Redis or in-memory fallback

### Authentication
- Uses Clerk for authentication
- `userId` automatically attached to quotes
- API routes check authentication state

### Validation
- Customer email required
- At least one line item required
- Positive amounts validated
- SQL injection protection via parameterized queries

## 🧪 Testing

### Manual Testing

```bash
# Create a test quote
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "businessName": "Test Corp",
      "email": "test@example.com"
    },
    "lineItems": [
      {
        "description": "Test Service",
        "quantity": 1,
        "unitPrice": 1000
      }
    ]
  }'

# List quotes
curl http://localhost:3000/api/quotes?limit=10

# Download quote
curl http://localhost:3000/api/pdf/quotes/QUOTE_ID?download=true -o quote.pdf
```

## 📊 Quote Number Format

Auto-generated in format: `QT-YYYYMMDD-XXXX`

Example: `QT-20231228-A7F3`

- `QT` - Prefix (customizable)
- `YYYYMMDD` - Date (20231228)
- `XXXX` - Random alphanumeric (A7F3)

## 🎯 Next Steps

### Potential Enhancements
- [ ] Email quote delivery
- [ ] E-signature integration
- [ ] Quote templates management UI
- [ ] Recurring quotes
- [ ] Quote analytics dashboard
- [ ] Export to other formats (DOCX, Excel)
- [ ] Multi-currency support
- [ ] Quote versioning
- [ ] Approval workflows
- [ ] Custom branding per quote

## 🐛 Troubleshooting

### PDF Not Generating

**Issue:** PDF generation fails
**Solution:**
1. Check jsPDF and jspdf-autotable are installed
2. Verify quote data validation
3. Check browser console for errors
4. Review rate limit status

### Quote Not Saving

**Issue:** Quote created but not in database
**Solution:**
1. Check database connection
2. Verify all required fields
3. Check PostgreSQL logs
4. Ensure tables exist (run migrations)

### Rate Limit Errors

**Issue:** "Too many requests" error
**Solution:**
1. Check Upstash Redis configuration
2. Wait for rate limit window to reset
3. Use different API endpoint if available

## 📚 Related Files

- `/lib/db.ts` - Database types and connection
- `/lib/db-queries.ts` - Database query functions
- `/scripts/create-quotes-table.ts` - Database migration script
- `/app/api/onboarding/[id]/quote/route.ts` - Onboarding integration

## 🤝 Contributing

When modifying the quote system:

1. Update type definitions in `/lib/types/quote.ts`
2. Add database migrations if schema changes
3. Update this README with new features
4. Test all API endpoints
5. Update rate limits if needed

## 📄 License

Part of A Startup Biz project.

---

**Last Updated:** 2025-12-28
**System Version:** 1.0.0
