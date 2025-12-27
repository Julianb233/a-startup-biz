# Calculator Quick Start Guide

## 5-Minute Setup for New Calculators

### Step 1: Choose Calculator Type (30 seconds)

Pick the calculator type that best fits your service:

| Type | Best For | Formula Complexity |
|------|----------|-------------------|
| `time-saved` | Services that save time | ⭐ Simple |
| `risk-mitigation` | Insurance/protection services | ⭐⭐ Medium |
| `tax-savings` | Financial services | ⭐⭐ Medium |
| `roi` | Marketing/advertising | ⭐⭐⭐ Complex |
| `revenue-growth` | Consulting/coaching | ⭐⭐ Medium |
| `automation-savings` | Technology/software | ⭐⭐ Medium |

---

### Step 2: Copy Template (1 minute)

Open `/root/github-repos/a-startup-biz/lib/calculator-config.ts`

Add this template at the bottom of the `calculatorConfigs` object:

```typescript
'your-service-slug': {
  type: 'time-saved', // Change to your type
  title: 'Your Calculator Title',
  description: 'Brief description of what this calculates',
  inputs: [
    {
      id: 'input1',
      label: 'First Input',
      type: 'slider',
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      prefix: '$',      // Optional: '$', '€', etc.
      suffix: ' hrs',   // Optional: ' hrs', ' days', '%', etc.
      tooltip: 'Explanation for users'
    },
    // Add more inputs as needed
  ],
  outputs: [
    {
      id: 'output1',
      label: 'First Output',
      format: 'currency', // or 'percentage', 'hours', 'number'
      color: 'success',   // or 'primary', 'warning', 'info'
      description: 'What this output means'
    },
    // Add more outputs as needed
  ],
  calculate: (inputs) => {
    // Your calculation logic here
    const result = inputs.input1 * 2;

    return {
      output1: result
    };
  },
  comparisonLabel: 'Before vs After',
  ctaText: 'Get Started Now'
}
```

---

### Step 3: Customize Values (2 minutes)

Replace the template values with your service-specific data:

#### Service Slug
```typescript
'your-service-slug': {  // Match your service's slug exactly
```
Example: `'website-development'`, `'hr-solutions'`

#### Title & Description
```typescript
title: 'Website ROI Calculator',
description: 'See the return on your website investment',
```

#### Inputs
Define what users will adjust:

```typescript
{
  id: 'monthlyVisitors',        // Unique ID
  label: 'Monthly Website Visitors',
  type: 'slider',               // 'slider' or 'number'
  min: 100,
  max: 100000,
  step: 100,
  defaultValue: 5000,
  tooltip: 'Your current monthly traffic'
}
```

**Input Types:**
- `slider`: Interactive slider (recommended for better UX)
- `number`: Direct number input field

**Common Ranges:**
- Revenue: $50,000 - $10,000,000
- Employees: 1 - 100
- Hours: 1 - 40
- Percentages: 1 - 100
- Rates: $15 - $500

#### Outputs
Define what will be calculated:

```typescript
{
  id: 'annualRevenue',
  label: 'Projected Annual Revenue',
  format: 'currency',
  color: 'success',
  description: 'Expected revenue from new website'
}
```

**Format Options:**
- `currency`: $1,234 (auto-formatted)
- `percentage`: 45.2%
- `hours`: 123 hrs
- `number`: 2.5x (for multipliers)

**Color Options:**
- `primary`: Orange (for key metrics, ROI)
- `success`: Green (for savings, gains)
- `warning`: Yellow (for costs, current state)
- `info`: Blue (for informational metrics)

#### Calculation Function
Write your formula:

```typescript
calculate: (inputs) => {
  // Extract inputs
  const visitors = inputs.monthlyVisitors;
  const conversionRate = inputs.conversionRate / 100;
  const avgOrderValue = inputs.avgOrderValue;

  // Calculate outputs
  const monthlyRevenue = visitors * conversionRate * avgOrderValue;
  const annualRevenue = monthlyRevenue * 12;
  const serviceCost = 5000;
  const roi = ((annualRevenue - serviceCost) / serviceCost) * 100;

  // Return all outputs
  return {
    monthlyRevenue,
    annualRevenue,
    roi
  };
}
```

**Tips:**
- Use clear variable names
- Add comments for complex calculations
- Include service costs in ROI calculations
- Use `Math.max(0, value)` to prevent negative numbers

#### Labels & CTA
```typescript
comparisonLabel: 'Without Website vs With Website',
ctaText: 'Build My Website'
```

---

### Step 4: Test (1 minute)

1. Save the file
2. Navigate to your service page: `/services/your-service-slug`
3. Scroll to calculator section
4. Move sliders and verify:
   - ✅ Numbers update instantly
   - ✅ Calculations are correct
   - ✅ Formatting looks right
   - ✅ Mobile layout works

---

### Step 5: Deploy (30 seconds)

```bash
npm run build
npm run start
```

Or push to your deployment platform (Vercel, Netlify, etc.)

**Done!** Your calculator is live.

---

## Common Calculator Patterns

### Pattern 1: Time Savings Calculator

```typescript
'service-slug': {
  type: 'time-saved',
  title: 'Time Saved Calculator',
  description: 'Calculate how much time we save you',
  inputs: [
    {
      id: 'hourlyRate',
      label: 'Your Hourly Rate',
      type: 'slider',
      min: 25,
      max: 500,
      step: 25,
      defaultValue: 100,
      prefix: '$'
    },
    {
      id: 'hoursSpent',
      label: 'Hours You Would Spend',
      type: 'slider',
      min: 1,
      max: 40,
      step: 1,
      defaultValue: 10,
      suffix: ' hrs'
    }
  ],
  outputs: [
    { id: 'timeSaved', label: 'Time Saved', format: 'hours', color: 'primary' },
    { id: 'moneySaved', label: 'Money Saved', format: 'currency', color: 'success' },
    { id: 'roi', label: 'ROI', format: 'percentage', color: 'info' }
  ],
  calculate: (inputs) => {
    const timeSaved = inputs.hoursSpent;
    const moneySaved = inputs.hourlyRate * inputs.hoursSpent;
    const serviceCost = 500; // Your service cost
    const roi = ((moneySaved - serviceCost) / serviceCost) * 100;

    return { timeSaved, moneySaved, roi };
  },
  comparisonLabel: 'DIY vs Professional',
  ctaText: 'Save Time Now'
}
```

---

### Pattern 2: ROI Calculator

```typescript
'service-slug': {
  type: 'roi',
  title: 'ROI Calculator',
  description: 'Calculate your return on investment',
  inputs: [
    {
      id: 'currentRevenue',
      label: 'Current Monthly Revenue',
      type: 'slider',
      min: 1000,
      max: 100000,
      step: 1000,
      defaultValue: 10000,
      prefix: '$'
    },
    {
      id: 'growthRate',
      label: 'Target Growth',
      type: 'slider',
      min: 10,
      max: 100,
      step: 5,
      defaultValue: 25,
      suffix: '%'
    }
  ],
  outputs: [
    { id: 'currentAnnual', label: 'Current Annual Revenue', format: 'currency', color: 'info' },
    { id: 'projectedAnnual', label: 'Projected Revenue', format: 'currency', color: 'success' },
    { id: 'additionalRevenue', label: 'Additional Revenue', format: 'currency', color: 'success' },
    { id: 'roi', label: 'ROI', format: 'percentage', color: 'primary' }
  ],
  calculate: (inputs) => {
    const currentAnnual = inputs.currentRevenue * 12;
    const projectedAnnual = currentAnnual * (1 + inputs.growthRate / 100);
    const additionalRevenue = projectedAnnual - currentAnnual;
    const serviceCost = 5000;
    const roi = ((additionalRevenue - serviceCost) / serviceCost) * 100;

    return { currentAnnual, projectedAnnual, additionalRevenue, roi };
  },
  comparisonLabel: 'Current vs Optimized',
  ctaText: 'Grow My Revenue'
}
```

---

### Pattern 3: Cost Savings Calculator

```typescript
'service-slug': {
  type: 'automation-savings',
  title: 'Cost Savings Calculator',
  description: 'See how much you can save annually',
  inputs: [
    {
      id: 'employees',
      label: 'Number of Employees',
      type: 'slider',
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 10
    },
    {
      id: 'hoursPerWeek',
      label: 'Manual Task Hours/Week',
      type: 'slider',
      min: 5,
      max: 40,
      step: 5,
      defaultValue: 20,
      suffix: ' hrs'
    },
    {
      id: 'avgWage',
      label: 'Average Hourly Wage',
      type: 'slider',
      min: 15,
      max: 150,
      step: 5,
      defaultValue: 30,
      prefix: '$'
    }
  ],
  outputs: [
    { id: 'hoursAutomated', label: 'Annual Hours Saved', format: 'hours', color: 'primary' },
    { id: 'annualSavings', label: 'Annual Savings', format: 'currency', color: 'success' },
    { id: 'netSavings', label: 'Net Savings', format: 'currency', color: 'success' },
    { id: 'payback', label: 'Payback Period', format: 'number', color: 'info' }
  ],
  calculate: (inputs) => {
    const hoursAutomated = inputs.employees * inputs.hoursPerWeek * 52 * 0.7; // 70% automation
    const annualSavings = hoursAutomated * inputs.avgWage;
    const serviceCost = 10000;
    const netSavings = annualSavings - serviceCost;
    const payback = serviceCost / (annualSavings / 12); // months

    return { hoursAutomated, annualSavings, netSavings, payback };
  },
  comparisonLabel: 'Manual vs Automated',
  ctaText: 'Start Saving Now'
}
```

---

## Troubleshooting

### Calculator Not Showing?

**Check:**
1. ✅ Service slug matches exactly in config
2. ✅ Service has `serviceCards` defined
3. ✅ No syntax errors in config file
4. ✅ Build completed successfully

### Numbers Not Updating?

**Check:**
1. ✅ Input IDs match in calculate function
2. ✅ Output IDs match in return statement
3. ✅ No JavaScript errors in console

### Formatting Issues?

**Check:**
1. ✅ Using correct format type ('currency', 'percentage', etc.)
2. ✅ Numbers are valid (not NaN or undefined)
3. ✅ Using `Math.max(0, value)` for positive-only outputs

### Styling Problems?

**Check:**
1. ✅ Using correct color values ('primary', 'success', etc.)
2. ✅ Tailwind CSS classes are valid
3. ✅ Build includes all necessary CSS

---

## Input Configuration Reference

### Slider Input
```typescript
{
  id: 'uniqueId',           // Required: unique identifier
  label: 'Display Name',    // Required: shown to user
  type: 'slider',           // Required: 'slider' or 'number'
  min: 0,                   // Required: minimum value
  max: 100,                 // Required: maximum value
  step: 1,                  // Required: increment step
  defaultValue: 50,         // Required: starting value
  prefix: '$',              // Optional: shown before value
  suffix: ' hrs',           // Optional: shown after value
  tooltip: 'Help text'      // Optional: info icon tooltip
}
```

### Number Input
```typescript
{
  id: 'uniqueId',
  label: 'Display Name',
  type: 'number',           // Direct input field
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  prefix: '$',
  suffix: ' units',
  tooltip: 'Help text'
}
```

**When to use:**
- **Slider:** Better UX, visual feedback, most cases
- **Number:** Precise values, large ranges (1-1,000,000)

---

## Output Configuration Reference

```typescript
{
  id: 'outputId',                    // Required: matches calculate return
  label: 'Display Label',            // Required: shown to user
  format: 'currency',                // Required: how to format
  color: 'success',                  // Required: visual indicator
  description: 'What this means'     // Optional: subtitle text
}
```

**Format Types:**
```typescript
'currency'    → $1,234
'percentage'  → 45.2%
'hours'       → 123 hrs
'number'      → 2.5x
```

**Color Types:**
```typescript
'primary'  → Orange (#ff6a1a) - Key metrics
'success'  → Green - Positive outcomes
'warning'  → Yellow - Costs, caution
'info'     → Blue - Informational
```

---

## Common Calculations

### ROI Formula
```typescript
const roi = ((return - investment) / investment) * 100;
```

### Payback Period (months)
```typescript
const paybackMonths = investment / (annualSavings / 12);
```

### Annual from Monthly
```typescript
const annual = monthly * 12;
```

### Growth Projection
```typescript
const future = current * Math.pow(1 + growthRate / 100, years);
```

### Percentage of Total
```typescript
const percentage = (part / whole) * 100;
```

### Time Value of Money
```typescript
const value = hours * hourlyRate;
```

---

## Best Practices

### ✅ DO:
- Use realistic default values
- Provide helpful tooltips
- Keep calculations simple and transparent
- Test with edge cases (0, max values)
- Use appropriate number ranges
- Format outputs consistently
- Add descriptive labels

### ❌ DON'T:
- Make ranges too wide (1-1,000,000)
- Use complex multi-step formulas
- Hide calculation logic
- Use ambiguous labels
- Forget to handle negative numbers
- Overcomplicate with too many inputs
- Use misleading default values

---

## Performance Tips

1. **Keep calculate() fast** - No API calls, simple math only
2. **Limit outputs** - 4-6 outputs maximum for readability
3. **Use appropriate steps** - Large ranges need larger steps
4. **Memoize when possible** - React handles this automatically
5. **Test on mobile** - Sliders should work smoothly on touch

---

## Next Steps

After creating your calculator:

1. **Test thoroughly** - Try all edge cases
2. **Get feedback** - Show to colleagues/users
3. **Monitor conversions** - Track if calculator increases bookings
4. **Iterate** - Adjust based on user behavior
5. **Document** - Add to internal wiki

---

## Support & Resources

- **Full Documentation:** `/CALCULATOR_IMPLEMENTATION.md`
- **Visual Guide:** `/CALCULATOR_VISUAL_GUIDE.md`
- **Component Demo:** `/components/calculator-demo.md`
- **Source Code:** `/lib/calculator-config.ts`
- **Component:** `/components/service-calculator.tsx`

---

## Quick Reference

| Need | File | Line |
|------|------|------|
| Add calculator | `/lib/calculator-config.ts` | Bottom of object |
| Change styling | `/components/service-calculator.tsx` | Line 180+ |
| Update slider | `/components/ui/slider.tsx` | Entire file |
| Modify layout | `/components/service-detail.tsx` | Line 305-308 |

---

**Total Time to Add Calculator:** ~5 minutes
**Difficulty:** ⭐⭐ (Easy with templates)
**Impact:** ⭐⭐⭐⭐⭐ (High conversion boost)
