/**
 * PDF Form Operations
 *
 * Core utilities for reading and filling PDF forms using pdf-lib.
 * Supports:
 * - Analyzing form fields (text, checkbox, dropdown, signature)
 * - Filling form fields with data
 * - Flattening forms (making them non-editable)
 * - Extracting form field metadata
 */

import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup } from 'pdf-lib';

// ============================================================================
// Types
// ============================================================================

export type FieldType = 'text' | 'checkbox' | 'dropdown' | 'radio' | 'signature' | 'unknown';

export interface FormField {
  name: string;
  type: FieldType;
  value?: string | boolean;
  options?: string[];  // For dropdowns
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
}

export interface FormAnalysis {
  totalFields: number;
  fillableFields: number;
  fields: FormField[];
  fieldsByType: {
    text: number;
    checkbox: number;
    dropdown: number;
    radio: number;
    signature: number;
    unknown: number;
  };
}

export interface FillResult {
  success: boolean;
  filledFields: string[];
  failedFields: string[];
  errors: string[];
  outputPdf?: Uint8Array;
}

// ============================================================================
// Form Analysis
// ============================================================================

/**
 * Analyze a PDF and extract all form field information
 */
export async function analyzePDFForm(pdfBytes: Uint8Array | ArrayBuffer): Promise<FormAnalysis> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const analysis: FormAnalysis = {
    totalFields: fields.length,
    fillableFields: 0,
    fields: [],
    fieldsByType: {
      text: 0,
      checkbox: 0,
      dropdown: 0,
      radio: 0,
      signature: 0,
      unknown: 0
    }
  };

  for (const field of fields) {
    const fieldName = field.getName();
    const fieldInfo: FormField = {
      name: fieldName,
      type: 'unknown',
      readOnly: field.isReadOnly()
    };

    if (field instanceof PDFTextField) {
      fieldInfo.type = 'text';
      fieldInfo.value = field.getText() || '';
      fieldInfo.maxLength = field.getMaxLength();
      analysis.fieldsByType.text++;
    } else if (field instanceof PDFCheckBox) {
      fieldInfo.type = 'checkbox';
      fieldInfo.value = field.isChecked();
      analysis.fieldsByType.checkbox++;
    } else if (field instanceof PDFDropdown) {
      fieldInfo.type = 'dropdown';
      fieldInfo.options = field.getOptions();
      fieldInfo.value = field.getSelected()[0] || '';
      analysis.fieldsByType.dropdown++;
    } else if (field instanceof PDFRadioGroup) {
      fieldInfo.type = 'radio';
      fieldInfo.options = field.getOptions();
      fieldInfo.value = field.getSelected() || '';
      analysis.fieldsByType.radio++;
    } else {
      // Check if it might be a signature field by name
      if (fieldName.toLowerCase().includes('signature') || fieldName.toLowerCase().includes('sign')) {
        fieldInfo.type = 'signature';
        analysis.fieldsByType.signature++;
      } else {
        analysis.fieldsByType.unknown++;
      }
    }

    if (!field.isReadOnly()) {
      analysis.fillableFields++;
    }

    analysis.fields.push(fieldInfo);
  }

  return analysis;
}

// ============================================================================
// Form Filling
// ============================================================================

/**
 * Fill a PDF form with provided data
 *
 * @param pdfBytes - Original PDF as bytes
 * @param data - Object mapping field names to values
 * @param options - Fill options
 * @returns FillResult with filled PDF
 */
export async function fillPDFForm(
  pdfBytes: Uint8Array | ArrayBuffer,
  data: Record<string, string | boolean>,
  options: {
    flatten?: boolean;  // Make fields non-editable after filling
    skipMissing?: boolean;  // Don't error on missing fields
  } = {}
): Promise<FillResult> {
  const result: FillResult = {
    success: false,
    filledFields: [],
    failedFields: [],
    errors: []
  };

  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    for (const [fieldName, value] of Object.entries(data)) {
      try {
        const field = form.getField(fieldName);

        if (!field) {
          if (!options.skipMissing) {
            result.failedFields.push(fieldName);
            result.errors.push(`Field not found: ${fieldName}`);
          }
          continue;
        }

        if (field.isReadOnly()) {
          result.failedFields.push(fieldName);
          result.errors.push(`Field is read-only: ${fieldName}`);
          continue;
        }

        // Fill based on field type
        if (field instanceof PDFTextField) {
          field.setText(String(value));
          result.filledFields.push(fieldName);
        } else if (field instanceof PDFCheckBox) {
          if (value === true || value === 'true' || value === 'yes' || value === '1') {
            field.check();
          } else {
            field.uncheck();
          }
          result.filledFields.push(fieldName);
        } else if (field instanceof PDFDropdown) {
          field.select(String(value));
          result.filledFields.push(fieldName);
        } else if (field instanceof PDFRadioGroup) {
          field.select(String(value));
          result.filledFields.push(fieldName);
        } else {
          result.failedFields.push(fieldName);
          result.errors.push(`Unknown field type: ${fieldName}`);
        }
      } catch (fieldError) {
        result.failedFields.push(fieldName);
        result.errors.push(`Error filling ${fieldName}: ${fieldError}`);
      }
    }

    // Flatten if requested
    if (options.flatten) {
      form.flatten();
    }

    // Save the modified PDF
    result.outputPdf = await pdfDoc.save();
    result.success = result.errors.length === 0;

  } catch (error) {
    result.errors.push(`PDF processing error: ${error}`);
  }

  return result;
}

// ============================================================================
// Field Mapping Utilities
// ============================================================================

/**
 * Common field name patterns for auto-mapping
 */
export const FIELD_PATTERNS: Record<string, string[]> = {
  // Personal info
  'name': ['name', 'full_name', 'applicant_name', 'fullname', 'your_name', 'client_name'],
  'firstName': ['first_name', 'fname', 'firstname', 'given_name'],
  'lastName': ['last_name', 'lname', 'lastname', 'surname', 'family_name'],
  'middleName': ['middle_name', 'mname', 'middlename'],

  // Contact
  'email': ['email', 'email_address', 'emailaddress', 'e_mail'],
  'phone': ['phone', 'telephone', 'mobile', 'cell', 'phone_number', 'tel'],

  // Address
  'address': ['address', 'street_address', 'streetaddress', 'address1', 'street'],
  'address2': ['address2', 'apt', 'suite', 'unit', 'apartment'],
  'city': ['city', 'town'],
  'state': ['state', 'province', 'region'],
  'zip': ['zip', 'zipcode', 'zip_code', 'postal_code', 'postalcode'],
  'country': ['country', 'nation'],

  // Identification
  'ssn': ['ssn', 'social_security', 'social_security_number', 'ss_number'],
  'dob': ['dob', 'date_of_birth', 'dateofbirth', 'birthday', 'birth_date'],
  'driversLicense': ['drivers_license', 'dl', 'license_number', 'dl_number'],

  // Dates
  'date': ['date', 'current_date', 'todays_date', 'today'],
  'signatureDate': ['signature_date', 'sign_date', 'dated'],

  // Work
  'company': ['company', 'employer', 'company_name', 'business_name', 'organization'],
  'title': ['title', 'job_title', 'position', 'role', 'occupation'],

  // Financial
  'bankName': ['bank_name', 'bank', 'financial_institution'],
  'accountNumber': ['account_number', 'acct_number', 'account'],
  'routingNumber': ['routing_number', 'routing', 'aba_number', 'aba'],
};

/**
 * Try to match a PDF field name to a standard data field
 */
export function matchFieldToDataKey(fieldName: string): string | null {
  const normalizedField = fieldName.toLowerCase().replace(/[\s_-]/g, '');

  for (const [dataKey, patterns] of Object.entries(FIELD_PATTERNS)) {
    for (const pattern of patterns) {
      const normalizedPattern = pattern.toLowerCase().replace(/[\s_-]/g, '');
      if (normalizedField === normalizedPattern || normalizedField.includes(normalizedPattern)) {
        return dataKey;
      }
    }
  }

  return null;
}

/**
 * Create a field mapping from form analysis
 */
export function createFieldMapping(
  analysis: FormAnalysis,
  availableData: Record<string, string>
): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const field of analysis.fields) {
    if (field.type === 'text' && !field.readOnly) {
      const dataKey = matchFieldToDataKey(field.name);
      if (dataKey && availableData[dataKey]) {
        mapping[field.name] = availableData[dataKey];
      }
    }
  }

  return mapping;
}

// ============================================================================
// Export Utilities
// ============================================================================

/**
 * Convert Uint8Array to base64 for API responses
 */
export function pdfToBase64(pdfBytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < pdfBytes.length; i++) {
    binary += String.fromCharCode(pdfBytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 to Uint8Array for processing
 */
export function base64ToPdf(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Generate a summary report of form analysis
 */
export function generateAnalysisReport(analysis: FormAnalysis): string {
  const lines = [
    '# PDF Form Analysis Report',
    '',
    `**Total Fields:** ${analysis.totalFields}`,
    `**Fillable Fields:** ${analysis.fillableFields}`,
    '',
    '## Field Types',
    `- Text fields: ${analysis.fieldsByType.text}`,
    `- Checkboxes: ${analysis.fieldsByType.checkbox}`,
    `- Dropdowns: ${analysis.fieldsByType.dropdown}`,
    `- Radio buttons: ${analysis.fieldsByType.radio}`,
    `- Signature fields: ${analysis.fieldsByType.signature}`,
    `- Unknown: ${analysis.fieldsByType.unknown}`,
    '',
    '## All Fields',
    ''
  ];

  for (const field of analysis.fields) {
    const readOnlyFlag = field.readOnly ? ' (read-only)' : '';
    lines.push(`- **${field.name}**: ${field.type}${readOnlyFlag}`);
    if (field.options) {
      lines.push(`  - Options: ${field.options.join(', ')}`);
    }
    if (field.maxLength) {
      lines.push(`  - Max length: ${field.maxLength}`);
    }
  }

  return lines.join('\n');
}
