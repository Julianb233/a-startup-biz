# Service Calculator Component - Documentation

## Overview

The Service Calculator component provides interactive ROI and value calculators for service pages. It allows potential clients to input their specific information and see real-time calculations of the value they'll receive from our services.

## Files Created

1. **lib/calculator-config.ts** - Calculator configurations and formulas
2. **components/service-calculator.tsx** - Main calculator component
3. **components/ui/slider.tsx** - Radix UI slider component

## Calculator Types

We have 6 calculator types, each mapped to specific services:

### 1. Time-Saved Calculator (EIN Filing)
**Service:** `ein-filing`

**Inputs:**
- Hourly Rate ($25 - $500)
- Hours You Would Spend DIY (2-20 hrs)

**Outputs:**
- Time Saved
- Value of Time Saved
- Net Savings (after service fee)
- ROI

**Formula:**
```typescript
timeSaved = hoursSpent
moneySaved = hourlyRate × hoursSpent
netSavings = moneySaved - $160 (service cost)
roi = ((moneySaved - serviceCost) / serviceCost) × 100
```

### 2. Risk-Mitigation Calculator (Legal Services)
**Service:** `legal-services`

**Inputs:**
- Annual Business Revenue ($50k - $5M)
- Industry Risk Level (1-10)

**Outputs:**
- Average Lawsuit Cost
- Potential Damages
- Annual Protection Value
- Cost to Protection Ratio

**Formula:**
```typescript
avgLawsuitCost = $50,000 + (riskLevel × $5,000)
potentialDamages = revenue × 0.1 × (riskLevel / 10)
protectionValue = (avgLawsuitCost + potentialDamages) × 0.7
costToValueRatio = (serviceCost / protectionValue) × 100
```

### 3. Tax-Savings Calculator (Accounting)
**Service:** `accounting-services`

**Inputs:**
- Annual Revenue ($50k - $5M)
- Current Effective Tax Rate (15% - 40%)

**Outputs:**
- Current Annual Taxes
- Potential Tax Savings
- Net Annual Savings
- Payback Period

**Formula:**
```typescript
currentTaxBill = revenue × (taxRate / 100)
potentialSavings = currentTaxBill × 0.08 // 8% average savings
netSavings = potentialSavings - $3,000 (service cost)
paybackPeriod = serviceCost / (potentialSavings / 12) // in months
```

### 4. Marketing ROI Calculator
**Services:** `marketing-services`, `social-media`, `seo-services`

**Inputs:**
- Monthly Ad Spend ($500 - $50k)
- Average Order Value ($50 - $5k)
- Current Conversion Rate (1% - 20%)

**Outputs:**
- Current Monthly Revenue
- Projected Revenue (with optimization)
- Additional Revenue
- Marketing ROI

**Formula:**
```typescript
clicksPerMonth = monthlyAdSpend / $2 // $2 CPC assumption
currentConversions = clicksPerMonth × (conversionRate / 100)
currentRevenue = currentConversions × avgOrderValue
improvedConversionRate = conversionRate × 1.5 // 50% improvement
improvedRevenue = clicksPerMonth × (improvedConversionRate / 100) × avgOrderValue
roi = ((improvedRevenue - totalInvestment) / totalInvestment) × 100
```

### 5. Revenue-Growth Calculator
**Service:** `business-strategy`, `business-coaching`

**Inputs:**
- Current Annual Revenue ($100k - $10M)
- Target Growth Rate (10% - 100%)
- Time Frame (1-5 years)

**Outputs:**
- Projected Revenue
- Total Revenue Increase
- Strategy Investment
- Value Multiple (return per $1 invested)

**Formula:**
```typescript
growthMultiplier = 1 + (growthGoal / 100)
projectedRevenue = currentRevenue × Math.pow(growthMultiplier, timeframe)
revenueIncrease = projectedRevenue - currentRevenue
investmentRequired = $5,000 × timeframe
valueMultiple = revenueIncrease / investmentRequired
```

### 6. Automation-Savings Calculator
**Service:** `ai-solutions`, `crm-implementation`, `it-services`

**Inputs:**
- Number of Employees (1-100)
- Repetitive Task Hours/Week (5-40 hrs)
- Average Hourly Wage ($15 - $150)

**Outputs:**
- Annual Hours Automated
- Annual Labor Savings
- Net Annual Savings
- Payback Period

**Formula:**
```typescript
automationEfficiency = 0.7 // 70% of tasks automatable
hoursAutomated = employees × hoursPerWeek × 52 × automationEfficiency
annualSavings = hoursAutomated × avgHourlyWage
netAnnualSavings = annualSavings - $15,000 (automation cost)
paybackPeriod = automationCost / (annualSavings / 12) // in months
```

## Adding a Calculator to a Service

### Step 1: Add Calculator Config

In `lib/calculator-config.ts`, add a new calculator configuration:

```typescript
export const calculatorConfigs: Record<string, CalculatorConfig> = {
  // ... existing configs

  'your-service-slug': {
    type: 'time-saved', // or another type
    title: 'Your Calculator Title',
    description: 'Description of what this calculator does',
    inputs: [
      {
        id: 'inputId',
        label: 'Input Label',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        prefix: '$', // optional
        suffix: ' units', // optional
        tooltip: 'Help text' // optional
      }
    ],
    outputs: [
      {
        id: 'outputId',
        label: 'Output Label',
        format: 'currency', // or 'percentage', 'hours', 'number'
        color: 'success', // or 'primary', 'warning', 'info'
        description: 'What this output means'
      }
    ],
    calculate: (inputs) => {
      // Your calculation logic
      return {
        outputId: calculatedValue
      }
    },
    comparisonLabel: 'Before vs After',
    ctaText: 'Get Started Now'
  }
}
```

### Step 2: Calculator is Automatically Displayed

The calculator will automatically appear on the service page if:
1. A calculator config exists for the service slug
2. The service has `serviceCards` defined (it appears after service cards)

No additional changes needed in `service-detail.tsx`!

## Customization

### Colors

Each output can have a different color scheme:
- `primary` - Orange (#ff6a1a)
- `success` - Green
- `warning` - Yellow
- `info` - Blue

### Input Types

- `slider` - Interactive slider with min/max
- `number` - Direct number input field

### Output Formats

- `currency` - Formatted as USD ($1,234)
- `percentage` - Formatted as % (12.5%)
- `hours` - Formatted with "hrs" (123 hrs)
- `number` - Formatted with multiplier (2.5x)

## Features

✅ Real-time calculations as user adjusts sliders
✅ Animated number counters on value changes
✅ Mobile-responsive design
✅ Accessible with keyboard navigation
✅ Tooltips for input explanations
✅ Visual progress bars for currency values
✅ Trust indicators below calculator
✅ Integrated CTAs to contact/book
✅ Gradient styling matching site theme

## Usage Example

```tsx
import ServiceCalculator from "@/components/service-calculator"
import { getCalculatorConfig } from "@/lib/calculator-config"

const config = getCalculatorConfig('ein-filing')

if (config) {
  <ServiceCalculator
    config={config}
    serviceSlug="ein-filing"
  />
}
```

## Current Services with Calculators

1. ✅ EIN Filing - Time Saved
2. ✅ Legal Services - Risk Mitigation
3. ✅ Accounting Services - Tax Savings
4. ✅ Marketing Services - ROI
5. ✅ Business Strategy - Revenue Growth
6. ✅ AI Solutions - Automation Savings

## Services That Can Use Existing Calculators

You can map these services to existing calculator configs:

- `social-media` → Use marketing ROI calculator
- `seo-services` → Use marketing ROI calculator
- `crm-implementation` → Use automation calculator
- `it-services` → Use automation calculator
- `business-coaching` → Use revenue growth calculator
- `website-development` → Create custom calculator or use marketing ROI

## Testing

To test a calculator:

1. Navigate to a service page (e.g., `/services/ein-filing`)
2. Scroll to the calculator section
3. Adjust sliders and verify:
   - Real-time calculation updates
   - Numbers animate on change
   - Values are formatted correctly
   - Mobile responsiveness
   - CTA buttons work

## Maintenance

When updating calculator formulas:

1. Update the `calculate` function in `lib/calculator-config.ts`
2. Adjust default values if needed
3. Update documentation above
4. Test calculations with various inputs

## Performance

- Calculator only renders if config exists for service
- Calculations are memoized using useEffect
- Framer Motion animations are hardware-accelerated
- No external API calls - all client-side

## Accessibility

- Sliders are keyboard-accessible (arrow keys)
- Proper ARIA labels on all inputs
- Tooltips on hover with Info icons
- High contrast colors for readability
- Font size follows site standards
