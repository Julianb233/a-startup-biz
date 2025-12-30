/**
 * PDF Form Auto-Fill Integration
 *
 * Connects PDF form filling with Personal Memory system.
 * Can auto-fill forms using:
 * - User's personal profile (julian-profile)
 * - Specific person from personal memory
 * - Legal documents stored in memory
 */

import {
  analyzePDFForm,
  fillPDFForm,
  createFieldMapping,
  matchFieldToDataKey,
  FormAnalysis,
  FillResult,
  FormField,
  FIELD_PATTERNS
} from './form-operations';

// ============================================================================
// Types
// ============================================================================

export interface PersonData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  ssn?: string;
  dob?: string;
  company?: string;
  title?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  driversLicense?: string;
  [key: string]: string | undefined;
}

export interface AutoFillResult {
  success: boolean;
  filledPdf?: Uint8Array;
  mappedFields: { pdfField: string; dataKey: string; value: string }[];
  unmappedFields: FormField[];
  manualInputRequired: string[];
  summary: string;
}

export interface AutoFillOptions {
  flatten?: boolean;
  includeDate?: boolean;
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

// ============================================================================
// Auto-Fill from Person Data
// ============================================================================

/**
 * Auto-fill a PDF form using person data from memory
 */
export async function autoFillFromPersonData(
  pdfBytes: Uint8Array | ArrayBuffer,
  personData: PersonData,
  options: AutoFillOptions = {}
): Promise<AutoFillResult> {
  // Analyze the form first
  const analysis = await analyzePDFForm(pdfBytes);

  // Prepare data with computed fields
  const enrichedData = enrichPersonData(personData, options);

  // Map fields
  const { mapping, mappedFields, unmappedFields } = mapFieldsToData(analysis, enrichedData);

  // Identify fields that need manual input
  const manualInputRequired = findManualInputFields(unmappedFields);

  // Fill the form
  const fillResult = await fillPDFForm(pdfBytes, mapping, {
    flatten: options.flatten,
    skipMissing: true
  });

  // Build summary
  const summary = buildAutoFillSummary(mappedFields, unmappedFields, manualInputRequired);

  return {
    success: fillResult.success,
    filledPdf: fillResult.outputPdf,
    mappedFields,
    unmappedFields,
    manualInputRequired,
    summary
  };
}

// ============================================================================
// Data Enrichment
// ============================================================================

/**
 * Enrich person data with computed fields
 */
function enrichPersonData(
  data: PersonData,
  options: AutoFillOptions
): Record<string, string> {
  const enriched: Record<string, string> = {};

  // Copy all existing string values
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && value) {
      enriched[key] = value;
    }
  }

  // Compute first/last name if only full name is provided
  if (data.name && (!data.firstName || !data.lastName)) {
    const parts = data.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      enriched.firstName = parts[0];
      enriched.lastName = parts.slice(1).join(' ');
    } else if (parts.length === 1) {
      enriched.firstName = parts[0];
    }
  }

  // Compute full name if only first/last provided
  if (!data.name && (data.firstName || data.lastName)) {
    enriched.name = [data.firstName, data.lastName].filter(Boolean).join(' ');
  }

  // Add current date if requested
  if (options.includeDate) {
    const now = new Date();
    let dateStr: string;

    switch (options.dateFormat) {
      case 'DD/MM/YYYY':
        dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
        break;
      case 'YYYY-MM-DD':
        dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        break;
      case 'MM/DD/YYYY':
      default:
        dateStr = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`;
    }

    enriched.date = dateStr;
    enriched.signatureDate = dateStr;
  }

  return enriched;
}

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

// ============================================================================
// Field Mapping
// ============================================================================

interface MappingResult {
  mapping: Record<string, string>;
  mappedFields: { pdfField: string; dataKey: string; value: string }[];
  unmappedFields: FormField[];
}

/**
 * Map PDF form fields to available person data
 */
function mapFieldsToData(
  analysis: FormAnalysis,
  data: Record<string, string>
): MappingResult {
  const mapping: Record<string, string> = {};
  const mappedFields: { pdfField: string; dataKey: string; value: string }[] = [];
  const unmappedFields: FormField[] = [];

  for (const field of analysis.fields) {
    // Skip read-only fields
    if (field.readOnly) continue;

    // Only process text fields for now
    if (field.type !== 'text') {
      unmappedFields.push(field);
      continue;
    }

    // Try to match field name to data key
    const dataKey = matchFieldToDataKey(field.name);

    if (dataKey && data[dataKey]) {
      mapping[field.name] = data[dataKey];
      mappedFields.push({
        pdfField: field.name,
        dataKey,
        value: data[dataKey]
      });
    } else {
      unmappedFields.push(field);
    }
  }

  return { mapping, mappedFields, unmappedFields };
}

// ============================================================================
// Manual Input Detection
// ============================================================================

/**
 * Identify fields that require manual input (can't be auto-filled)
 */
function findManualInputFields(unmappedFields: FormField[]): string[] {
  const manualFields: string[] = [];

  // Categories of fields that typically need manual input
  const sensitivePatterns = [
    'signature',
    'sign',
    'initials',
    'ssn',
    'social',
    'password',
    'pin',
    'account',
    'routing',
    'bank'
  ];

  for (const field of unmappedFields) {
    const nameLower = field.name.toLowerCase();

    // Signatures always need manual input
    if (field.type === 'signature') {
      manualFields.push(field.name);
      continue;
    }

    // Check for sensitive fields
    if (sensitivePatterns.some(p => nameLower.includes(p))) {
      manualFields.push(field.name);
    }
  }

  return manualFields;
}

// ============================================================================
// Summary Generation
// ============================================================================

/**
 * Build a human-readable summary of the auto-fill operation
 */
function buildAutoFillSummary(
  mappedFields: { pdfField: string; dataKey: string; value: string }[],
  unmappedFields: FormField[],
  manualInputRequired: string[]
): string {
  const lines: string[] = [];

  lines.push(`## Auto-Fill Summary`);
  lines.push('');
  lines.push(`✅ **Filled ${mappedFields.length} fields automatically**`);

  if (mappedFields.length > 0) {
    lines.push('');
    for (const m of mappedFields) {
      // Mask sensitive values
      const displayValue = m.dataKey === 'ssn' || m.dataKey === 'accountNumber'
        ? '****' + m.value.slice(-4)
        : m.value;
      lines.push(`  - ${m.pdfField} → ${displayValue}`);
    }
  }

  if (unmappedFields.length > 0) {
    lines.push('');
    lines.push(`⚠️ **${unmappedFields.length} fields could not be auto-filled**`);
    lines.push('');
    for (const f of unmappedFields.slice(0, 10)) {  // Limit to first 10
      lines.push(`  - ${f.name} (${f.type})`);
    }
    if (unmappedFields.length > 10) {
      lines.push(`  - ... and ${unmappedFields.length - 10} more`);
    }
  }

  if (manualInputRequired.length > 0) {
    lines.push('');
    lines.push(`🖊️ **Manual input required for:**`);
    lines.push('');
    for (const f of manualInputRequired) {
      lines.push(`  - ${f}`);
    }
  }

  return lines.join('\n');
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Quick check if a PDF has fillable forms
 */
export async function hasFillableFields(pdfBytes: Uint8Array | ArrayBuffer): Promise<boolean> {
  const analysis = await analyzePDFForm(pdfBytes);
  return analysis.fillableFields > 0;
}

/**
 * Get list of required data keys for a PDF form
 */
export async function getRequiredDataKeys(pdfBytes: Uint8Array | ArrayBuffer): Promise<string[]> {
  const analysis = await analyzePDFForm(pdfBytes);
  const requiredKeys = new Set<string>();

  for (const field of analysis.fields) {
    if (field.type === 'text' && !field.readOnly) {
      const dataKey = matchFieldToDataKey(field.name);
      if (dataKey) {
        requiredKeys.add(dataKey);
      }
    }
  }

  return Array.from(requiredKeys);
}

/**
 * Create a template object with all the data keys needed for a form
 */
export async function createDataTemplate(pdfBytes: Uint8Array | ArrayBuffer): Promise<PersonData> {
  const keys = await getRequiredDataKeys(pdfBytes);
  const template: PersonData = {};

  for (const key of keys) {
    template[key] = '';
  }

  return template;
}
