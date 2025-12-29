/**
 * Calculator Configurations for Service ROI/Value Calculators
 * Contains formulas, defaults, and configurations for each service type
 */

export type CalculatorType =
  | 'time-saved'
  | 'risk-mitigation'
  | 'tax-savings'
  | 'roi'
  | 'revenue-growth'
  | 'automation-savings';

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'slider' | 'number';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  suffix?: string;
  prefix?: string;
  tooltip?: string;
}

export interface CalculatorOutput {
  id: string;
  label: string;
  format: 'currency' | 'percentage' | 'hours' | 'number';
  color: 'primary' | 'success' | 'warning' | 'info';
  description?: string;
}

export interface CalculatorConfig {
  type: CalculatorType;
  title: string;
  description: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
  calculate: (inputs: Record<string, number>) => Record<string, number>;
  comparisonLabel: string;
  ctaText: string;
}

// Calculator configurations by service slug
export const calculatorConfigs: Record<string, CalculatorConfig> = {
  'ein-filing': {
    type: 'time-saved',
    title: 'EIN Filing Value Calculator',
    description: 'See how much you save by letting us handle your EIN filing (typically takes 5 hours DIY)',
    inputs: [
      {
        id: 'hourlyRate',
        label: 'Your Hourly Rate',
        type: 'slider',
        min: 25,
        max: 500,
        step: 25,
        defaultValue: 75,
        prefix: '$',
        tooltip: 'What is your time worth per hour?'
      }
    ],
    outputs: [
      { id: 'timeSaved', label: 'Time Saved', format: 'hours', color: 'primary', description: 'Based on 5-hour average DIY time' },
      { id: 'moneySaved', label: 'Value of Your Time', format: 'currency', color: 'success', description: '5 hours × your hourly rate' },
      { id: 'serviceCost', label: 'Our Service Fee', format: 'currency', color: 'info', description: 'One-time flat fee' },
      { id: 'netSavings', label: 'Your Net Savings', format: 'currency', color: 'success', description: 'Time value minus our fee' }
    ],
    calculate: (inputs) => {
      const fixedHours = 5; // Fixed 5-hour baseline
      const timeSaved = fixedHours;
      const moneySaved = inputs.hourlyRate * fixedHours;
      const serviceCost = 160;
      const netSavings = moneySaved - serviceCost;

      return {
        timeSaved,
        moneySaved,
        serviceCost,
        netSavings
      };
    },
    comparisonLabel: 'DIY (5 hrs) vs Our Service',
    ctaText: 'Get Your EIN Filed Today'
  },

  'legal-services': {
    type: 'risk-mitigation',
    title: 'Legal Risk Protection Calculator',
    description: 'Calculate the potential costs avoided with proper legal protection',
    inputs: [
      {
        id: 'businessRevenue',
        label: 'Annual Business Revenue',
        type: 'slider',
        min: 50000,
        max: 5000000,
        step: 50000,
        defaultValue: 500000,
        prefix: '$',
        tooltip: 'Your estimated annual revenue'
      },
      {
        id: 'riskLevel',
        label: 'Industry Risk Level (1-10)',
        type: 'slider',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 5,
        tooltip: 'How litigious is your industry? (1=low, 10=high)'
      }
    ],
    outputs: [
      { id: 'avgLawsuitCost', label: 'Average Lawsuit Cost', format: 'currency', color: 'warning', description: 'Estimated legal defense costs' },
      { id: 'potentialDamages', label: 'Potential Damages', format: 'currency', color: 'warning', description: 'Based on revenue exposure' },
      { id: 'protectionValue', label: 'Annual Protection Value', format: 'currency', color: 'success', description: 'Risk mitigation benefit' },
      { id: 'costToValueRatio', label: 'Cost to Protection Ratio', format: 'percentage', color: 'info', description: 'Service cost vs protection value' }
    ],
    calculate: (inputs) => {
      const avgLawsuitCost = 50000 + (inputs.riskLevel * 5000);
      const potentialDamages = inputs.businessRevenue * 0.1 * (inputs.riskLevel / 10);
      const protectionValue = (avgLawsuitCost + potentialDamages) * 0.7; // 70% risk reduction
      const serviceCost = 2500; // Average legal service cost
      const costToValueRatio = (serviceCost / protectionValue) * 100;

      return {
        avgLawsuitCost,
        potentialDamages,
        protectionValue,
        costToValueRatio
      };
    },
    comparisonLabel: 'Protected vs Unprotected',
    ctaText: 'Protect Your Business Now'
  },

  'accounting-services': {
    type: 'tax-savings',
    title: 'Tax Savings Calculator',
    description: 'Estimate how much you could save with professional accounting',
    inputs: [
      {
        id: 'monthlyRevenue',
        label: 'Monthly Revenue',
        type: 'slider',
        min: 5000,
        max: 500000,
        step: 5000,
        defaultValue: 40000,
        prefix: '$',
        tooltip: 'Your gross monthly revenue'
      },
      {
        id: 'currentTaxRate',
        label: 'Current Effective Tax Rate',
        type: 'slider',
        min: 15,
        max: 40,
        step: 1,
        defaultValue: 25,
        suffix: '%',
        tooltip: 'Your current tax percentage'
      }
    ],
    outputs: [
      { id: 'currentMonthlyTax', label: 'Current Monthly Taxes', format: 'currency', color: 'warning', description: 'Your estimated monthly tax' },
      { id: 'monthlySavings', label: 'Monthly Tax Savings', format: 'currency', color: 'success', description: 'Through strategic planning' },
      { id: 'annualSavings', label: 'Annual Tax Savings', format: 'currency', color: 'success', description: 'Total yearly savings' },
      { id: 'paybackPeriod', label: 'Payback Period', format: 'number', color: 'info', description: 'Months to recoup investment' }
    ],
    calculate: (inputs) => {
      const currentMonthlyTax = (inputs.monthlyRevenue * inputs.currentTaxRate) / 100;
      const savingsPercentage = 8; // Average 8% tax savings through optimization
      const monthlySavings = currentMonthlyTax * (savingsPercentage / 100);
      const annualSavings = monthlySavings * 12;
      const serviceCost = 3000; // Annual accounting service
      const paybackPeriod = serviceCost / monthlySavings;

      return {
        currentMonthlyTax,
        monthlySavings,
        annualSavings,
        paybackPeriod: Math.max(0, paybackPeriod)
      };
    },
    comparisonLabel: 'DIY vs Professional',
    ctaText: 'Start Saving on Taxes'
  },

  'marketing-services': {
    type: 'roi',
    title: 'Marketing ROI Calculator',
    description: 'Calculate your expected return on marketing investment',
    inputs: [
      {
        id: 'monthlyAdSpend',
        label: 'Monthly Ad Spend',
        type: 'slider',
        min: 500,
        max: 50000,
        step: 500,
        defaultValue: 5000,
        prefix: '$',
        tooltip: 'Current or planned monthly advertising budget'
      },
      {
        id: 'avgOrderValue',
        label: 'Average Order Value',
        type: 'slider',
        min: 50,
        max: 5000,
        step: 50,
        defaultValue: 500,
        prefix: '$',
        tooltip: 'Average customer purchase value'
      },
      {
        id: 'conversionRate',
        label: 'Current Conversion Rate',
        type: 'slider',
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 2,
        suffix: '%',
        tooltip: 'Percentage of visitors who become customers'
      }
    ],
    outputs: [
      { id: 'additionalRevenue', label: 'Additional Monthly Revenue', format: 'currency', color: 'success', description: 'Extra revenue per month with optimization' },
      { id: 'annualAdditionalRevenue', label: 'Additional Annual Revenue', format: 'currency', color: 'success', description: 'Yearly increase' },
      { id: 'currentRevenue', label: 'Current Monthly Revenue', format: 'currency', color: 'info', description: 'From current marketing' },
      { id: 'roi', label: 'Monthly ROI', format: 'percentage', color: 'primary', description: 'Return on ad spend' }
    ],
    calculate: (inputs) => {
      const clicksPerMonth = (inputs.monthlyAdSpend / 2); // Assume $2 CPC
      const currentConversions = clicksPerMonth * (inputs.conversionRate / 100);
      const currentRevenue = currentConversions * inputs.avgOrderValue;

      const improvedConversionRate = inputs.conversionRate * 1.5; // 50% improvement
      const improvedConversions = clicksPerMonth * (improvedConversionRate / 100);
      const improvedRevenue = improvedConversions * inputs.avgOrderValue;

      const additionalRevenue = improvedRevenue - currentRevenue;
      const annualAdditionalRevenue = additionalRevenue * 12;
      const serviceCost = 2000; // Monthly marketing service
      const totalInvestment = inputs.monthlyAdSpend + serviceCost;
      const roi = ((improvedRevenue - totalInvestment) / totalInvestment) * 100;

      return {
        currentRevenue,
        additionalRevenue,
        annualAdditionalRevenue,
        roi
      };
    },
    comparisonLabel: 'Before vs After Optimization',
    ctaText: 'Boost Your Marketing ROI'
  },

  'business-strategy': {
    type: 'revenue-growth',
    title: 'Revenue Growth Calculator',
    description: 'Project your business growth with strategic guidance',
    inputs: [
      {
        id: 'currentRevenue',
        label: 'Current Annual Revenue',
        type: 'slider',
        min: 100000,
        max: 10000000,
        step: 100000,
        defaultValue: 1000000,
        prefix: '$',
        tooltip: 'Your current annual revenue'
      },
      {
        id: 'growthGoal',
        label: 'Target Growth Rate',
        type: 'slider',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 25,
        suffix: '%',
        tooltip: 'Desired annual growth percentage'
      },
      {
        id: 'timeframe',
        label: 'Time Frame',
        type: 'slider',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 2,
        suffix: ' years',
        tooltip: 'Years to achieve growth'
      }
    ],
    outputs: [
      { id: 'projectedRevenue', label: 'Projected Revenue', format: 'currency', color: 'success', description: 'After strategic growth' },
      { id: 'revenueIncrease', label: 'Total Revenue Increase', format: 'currency', color: 'success', description: 'Additional revenue gained' },
      { id: 'investmentRequired', label: 'Strategy Investment', format: 'currency', color: 'info', description: 'Consulting fees' },
      { id: 'valueMultiple', label: 'Value Multiple', format: 'number', color: 'primary', description: 'Return for every $1 invested' }
    ],
    calculate: (inputs) => {
      const growthMultiplier = 1 + (inputs.growthGoal / 100);
      const projectedRevenue = inputs.currentRevenue * Math.pow(growthMultiplier, inputs.timeframe);
      const revenueIncrease = projectedRevenue - inputs.currentRevenue;
      const investmentRequired = 5000 * inputs.timeframe; // $5k per year
      const valueMultiple = revenueIncrease / investmentRequired;

      return {
        projectedRevenue,
        revenueIncrease,
        investmentRequired,
        valueMultiple
      };
    },
    comparisonLabel: 'Without vs With Strategy',
    ctaText: 'Accelerate Your Growth'
  },

  'ai-solutions': {
    type: 'automation-savings',
    title: 'Automation Savings Calculator',
    description: 'Calculate the ROI of automating your business processes',
    inputs: [
      {
        id: 'employeeCount',
        label: 'Number of Employees',
        type: 'slider',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        tooltip: 'Employees affected by automation'
      },
      {
        id: 'hoursPerWeek',
        label: 'Repetitive Task Hours/Week',
        type: 'slider',
        min: 5,
        max: 40,
        step: 5,
        defaultValue: 20,
        suffix: ' hrs',
        tooltip: 'Hours spent on automatable tasks per employee'
      },
      {
        id: 'avgHourlyWage',
        label: 'Average Hourly Wage',
        type: 'slider',
        min: 15,
        max: 150,
        step: 5,
        defaultValue: 30,
        prefix: '$',
        tooltip: 'Average employee hourly cost'
      }
    ],
    outputs: [
      { id: 'monthlyHoursSaved', label: 'Monthly Hours Saved', format: 'hours', color: 'primary', description: 'Time saved per month' },
      { id: 'monthlySavings', label: 'Monthly Savings', format: 'currency', color: 'success', description: 'Cost reduction per month' },
      { id: 'annualSavings', label: 'Annual Savings', format: 'currency', color: 'success', description: 'Total yearly value' },
      { id: 'paybackPeriod', label: 'Payback Period', format: 'number', color: 'info', description: 'Months to break even' }
    ],
    calculate: (inputs) => {
      const automationEfficiency = 0.7; // 70% of tasks can be automated
      const weeklyHoursSaved = inputs.employeeCount * inputs.hoursPerWeek * automationEfficiency;
      const monthlyHoursSaved = weeklyHoursSaved * 4.33;
      const monthlySavings = monthlyHoursSaved * inputs.avgHourlyWage;
      const annualSavings = monthlySavings * 12;
      const automationCost = 15000; // One-time + annual subscription
      const paybackPeriod = (automationCost / monthlySavings);

      return {
        monthlyHoursSaved,
        monthlySavings,
        annualSavings,
        paybackPeriod: Math.max(0, paybackPeriod)
      };
    },
    comparisonLabel: 'Manual vs Automated',
    ctaText: 'Automate Your Business'
  },

  // Use marketing ROI calculator for these services
  'social-media': {
    type: 'roi',
    title: 'Social Media ROI Calculator',
    description: 'See the potential return on your social media marketing investment',
    inputs: [
      {
        id: 'monthlyAdSpend',
        label: 'Monthly Ad Spend',
        type: 'slider',
        min: 500,
        max: 50000,
        step: 500,
        defaultValue: 3000,
        prefix: '$',
        tooltip: 'Social media advertising budget'
      },
      {
        id: 'avgOrderValue',
        label: 'Average Order Value',
        type: 'slider',
        min: 50,
        max: 5000,
        step: 50,
        defaultValue: 300,
        prefix: '$',
        tooltip: 'Average customer purchase value'
      },
      {
        id: 'conversionRate',
        label: 'Current Conversion Rate',
        type: 'slider',
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 2,
        suffix: '%',
        tooltip: 'Percentage of clicks that convert'
      }
    ],
    outputs: [
      { id: 'additionalRevenue', label: 'Additional Monthly Revenue', format: 'currency', color: 'success', description: 'Extra revenue per month' },
      { id: 'annualAdditionalRevenue', label: 'Additional Annual Revenue', format: 'currency', color: 'success', description: 'Yearly increase' },
      { id: 'currentRevenue', label: 'Current Monthly Revenue', format: 'currency', color: 'info', description: 'From current social marketing' },
      { id: 'roi', label: 'Monthly ROI', format: 'percentage', color: 'primary', description: 'Return on ad spend' }
    ],
    calculate: (inputs) => {
      const clicksPerMonth = (inputs.monthlyAdSpend / 1.5); // $1.50 CPC for social
      const currentConversions = clicksPerMonth * (inputs.conversionRate / 100);
      const currentRevenue = currentConversions * inputs.avgOrderValue;

      const improvedConversionRate = inputs.conversionRate * 1.6; // 60% improvement with management
      const improvedConversions = clicksPerMonth * (improvedConversionRate / 100);
      const improvedRevenue = improvedConversions * inputs.avgOrderValue;

      const additionalRevenue = improvedRevenue - currentRevenue;
      const annualAdditionalRevenue = additionalRevenue * 12;
      const serviceCost = 1500;
      const totalInvestment = inputs.monthlyAdSpend + serviceCost;
      const roi = ((improvedRevenue - totalInvestment) / totalInvestment) * 100;

      return {
        currentRevenue,
        additionalRevenue,
        annualAdditionalRevenue,
        roi
      };
    },
    comparisonLabel: 'DIY vs Professional Management',
    ctaText: 'Boost Your Social Media ROI'
  },

  'seo-services': {
    type: 'roi',
    title: 'SEO ROI Calculator',
    description: 'Calculate the potential return from professional SEO services',
    inputs: [
      {
        id: 'monthlyAdSpend',
        label: 'Current Monthly Marketing Spend',
        type: 'slider',
        min: 500,
        max: 50000,
        step: 500,
        defaultValue: 5000,
        prefix: '$',
        tooltip: 'Your current monthly marketing budget'
      },
      {
        id: 'avgOrderValue',
        label: 'Average Order Value',
        type: 'slider',
        min: 50,
        max: 5000,
        step: 50,
        defaultValue: 500,
        prefix: '$',
        tooltip: 'Average customer purchase value'
      },
      {
        id: 'conversionRate',
        label: 'Website Conversion Rate',
        type: 'slider',
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 3,
        suffix: '%',
        tooltip: 'Percentage of visitors who purchase'
      }
    ],
    outputs: [
      { id: 'additionalRevenue', label: 'Additional Monthly Revenue', format: 'currency', color: 'success', description: 'Organic revenue per month from SEO' },
      { id: 'annualAdditionalRevenue', label: 'Additional Annual Revenue', format: 'currency', color: 'success', description: 'Yearly organic traffic value' },
      { id: 'currentRevenue', label: 'Current Monthly Revenue', format: 'currency', color: 'info', description: 'From paid traffic' },
      { id: 'roi', label: 'Monthly SEO ROI', format: 'percentage', color: 'primary', description: 'Return on SEO investment' }
    ],
    calculate: (inputs) => {
      const paidClicks = (inputs.monthlyAdSpend / 2);
      const currentConversions = paidClicks * (inputs.conversionRate / 100);
      const currentRevenue = currentConversions * inputs.avgOrderValue;

      const organicClicks = paidClicks * 0.8; // SEO can drive 80% of paid traffic organically
      const organicConversions = organicClicks * (inputs.conversionRate / 100);
      const additionalRevenue = organicConversions * inputs.avgOrderValue;
      const annualAdditionalRevenue = additionalRevenue * 12;

      const serviceCost = 2500;
      const roi = ((additionalRevenue - serviceCost) / serviceCost) * 100;

      return {
        currentRevenue,
        additionalRevenue,
        annualAdditionalRevenue,
        roi
      };
    },
    comparisonLabel: 'Paid Only vs Paid + SEO',
    ctaText: 'Start Your SEO Journey'
  },

  // Use automation calculator for CRM and IT services
  'crm-implementation': {
    type: 'automation-savings',
    title: 'CRM ROI Calculator',
    description: 'Calculate time and money saved with a professional CRM system',
    inputs: [
      {
        id: 'employeeCount',
        label: 'Sales Team Size',
        type: 'slider',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 5,
        tooltip: 'Number of sales/customer service staff'
      },
      {
        id: 'hoursPerWeek',
        label: 'Manual Data Entry Hours/Week',
        type: 'slider',
        min: 5,
        max: 40,
        step: 5,
        defaultValue: 20,
        suffix: ' hrs',
        tooltip: 'Time spent on manual tracking and data entry per employee'
      },
      {
        id: 'avgHourlyWage',
        label: 'Average Hourly Cost',
        type: 'slider',
        min: 15,
        max: 150,
        step: 5,
        defaultValue: 40,
        prefix: '$',
        tooltip: 'Average cost per hour for sales staff'
      }
    ],
    outputs: [
      { id: 'monthlyHoursSaved', label: 'Monthly Hours Saved', format: 'hours', color: 'primary', description: 'Time back for selling each month' },
      { id: 'monthlySavings', label: 'Monthly Savings', format: 'currency', color: 'success', description: 'Value of saved time per month' },
      { id: 'annualSavings', label: 'Annual Savings', format: 'currency', color: 'success', description: 'Total yearly value' },
      { id: 'paybackPeriod', label: 'Payback Period', format: 'number', color: 'info', description: 'Months to ROI' }
    ],
    calculate: (inputs) => {
      const automationEfficiency = 0.8; // CRM automates 80% of manual work
      const weeklyHoursSaved = inputs.employeeCount * inputs.hoursPerWeek * automationEfficiency;
      const monthlyHoursSaved = weeklyHoursSaved * 4.33; // Average weeks per month
      const monthlySavings = monthlyHoursSaved * inputs.avgHourlyWage;
      const annualSavings = monthlySavings * 12;
      const crmCost = 8000; // Setup + annual subscription
      const paybackPeriod = (crmCost / monthlySavings);

      return {
        monthlyHoursSaved,
        monthlySavings,
        annualSavings,
        paybackPeriod: Math.max(0, paybackPeriod)
      };
    },
    comparisonLabel: 'Manual Tracking vs CRM',
    ctaText: 'Implement Your CRM'
  },

  'it-services': {
    type: 'automation-savings',
    title: 'IT Services ROI Calculator',
    description: 'Calculate the cost savings from professional IT management',
    inputs: [
      {
        id: 'employeeCount',
        label: 'Total Employees',
        type: 'slider',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 20,
        tooltip: 'Number of employees using technology'
      },
      {
        id: 'hoursPerWeek',
        label: 'IT Issues Hours/Week',
        type: 'slider',
        min: 5,
        max: 40,
        step: 5,
        defaultValue: 10,
        suffix: ' hrs',
        tooltip: 'Company-wide time lost to IT issues'
      },
      {
        id: 'avgHourlyWage',
        label: 'Average Hourly Cost',
        type: 'slider',
        min: 15,
        max: 150,
        step: 5,
        defaultValue: 35,
        prefix: '$',
        tooltip: 'Average employee hourly cost'
      }
    ],
    outputs: [
      { id: 'monthlyHoursSaved', label: 'Monthly Downtime Prevented', format: 'hours', color: 'primary', description: 'Productive hours saved per month' },
      { id: 'monthlySavings', label: 'Monthly Savings', format: 'currency', color: 'success', description: 'Value of prevented downtime per month' },
      { id: 'annualSavings', label: 'Annual Savings', format: 'currency', color: 'success', description: 'Total yearly value' },
      { id: 'paybackPeriod', label: 'Payback Period', format: 'number', color: 'info', description: 'Months to ROI' }
    ],
    calculate: (inputs) => {
      const preventionEfficiency = 0.75; // Managed IT prevents 75% of issues
      const weeklyHoursSaved = inputs.hoursPerWeek * preventionEfficiency;
      const monthlyHoursSaved = weeklyHoursSaved * 4.33;
      const monthlySavings = monthlyHoursSaved * inputs.avgHourlyWage;
      const annualSavings = monthlySavings * 12;
      const itServiceCost = 6000; // Annual managed IT
      const paybackPeriod = (itServiceCost / monthlySavings);

      return {
        monthlyHoursSaved,
        monthlySavings,
        annualSavings,
        paybackPeriod: Math.max(0, paybackPeriod)
      };
    },
    comparisonLabel: 'Reactive vs Proactive IT',
    ctaText: 'Secure Your IT Infrastructure'
  },

  // Use revenue growth calculator for coaching
  'business-coaching': {
    type: 'revenue-growth',
    title: 'Business Coaching ROI Calculator',
    description: 'Project your growth with personalized business coaching',
    inputs: [
      {
        id: 'currentRevenue',
        label: 'Current Annual Revenue',
        type: 'slider',
        min: 100000,
        max: 10000000,
        step: 100000,
        defaultValue: 500000,
        prefix: '$',
        tooltip: 'Your current annual revenue'
      },
      {
        id: 'growthGoal',
        label: 'Growth Target',
        type: 'slider',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 30,
        suffix: '%',
        tooltip: 'Desired annual growth rate'
      },
      {
        id: 'timeframe',
        label: 'Coaching Duration',
        type: 'slider',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 1,
        suffix: ' years',
        tooltip: 'Years of coaching engagement'
      }
    ],
    outputs: [
      { id: 'projectedRevenue', label: 'Projected Revenue', format: 'currency', color: 'success', description: 'Revenue after coaching' },
      { id: 'revenueIncrease', label: 'Revenue Growth', format: 'currency', color: 'success', description: 'Total increase achieved' },
      { id: 'investmentRequired', label: 'Coaching Investment', format: 'currency', color: 'info', description: 'Total coaching fees' },
      { id: 'valueMultiple', label: 'Return Multiple', format: 'number', color: 'primary', description: 'ROI for every $1 invested' }
    ],
    calculate: (inputs) => {
      const growthMultiplier = 1 + (inputs.growthGoal / 100);
      const projectedRevenue = inputs.currentRevenue * Math.pow(growthMultiplier, inputs.timeframe);
      const revenueIncrease = projectedRevenue - inputs.currentRevenue;
      const investmentRequired = 10000 * inputs.timeframe; // $10k per year for coaching
      const valueMultiple = revenueIncrease / investmentRequired;

      return {
        projectedRevenue,
        revenueIncrease,
        investmentRequired,
        valueMultiple
      };
    },
    comparisonLabel: 'Solo vs Coached Growth',
    ctaText: 'Start Your Coaching Journey'
  }
};

// Helper function to get calculator config by service slug
export function getCalculatorConfig(serviceSlug: string): CalculatorConfig | null {
  return calculatorConfigs[serviceSlug] || null;
}

// Helper function to format output values
export function formatOutputValue(value: number, format: CalculatorOutput['format']): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);

    case 'percentage':
      return `${value.toFixed(1)}%`;

    case 'hours':
      return `${value.toLocaleString()} hrs`;

    case 'number':
      if (value < 1) {
        return value.toFixed(2) + 'x';
      }
      return value.toFixed(1) + 'x';

    default:
      return value.toString();
  }
}
