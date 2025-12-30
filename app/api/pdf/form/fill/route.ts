/**
 * PDF Form Fill API
 *
 * POST /api/pdf/form/fill
 *
 * Fills a PDF form with provided data and returns the completed PDF.
 * Supports auto-fill from personal memory or manual data input.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fillPDFForm,
  analyzePDFForm,
  pdfToBase64
} from '@/lib/pdf/form-operations';
import {
  autoFillFromPersonData,
  PersonData
} from '@/lib/pdf/form-autofill';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let pdfBytes: Uint8Array;
    let fillData: PersonData = {};
    let options = {
      flatten: false,
      includeDate: true,
      returnBase64: true
    };

    // Handle multipart form data
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('pdf') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No PDF file provided. Send as form-data with key "pdf"' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      pdfBytes = new Uint8Array(arrayBuffer);

      // Parse data from form fields
      const dataJson = formData.get('data') as string | null;
      if (dataJson) {
        try {
          fillData = JSON.parse(dataJson);
        } catch {
          return NextResponse.json(
            { error: 'Invalid JSON in "data" field' },
            { status: 400 }
          );
        }
      }

      // Parse options
      options.flatten = formData.get('flatten') === 'true';
      options.includeDate = formData.get('includeDate') !== 'false';
      options.returnBase64 = formData.get('returnBinary') !== 'true';

    } else if (contentType.includes('application/json')) {
      // Handle JSON with base64 PDF
      const body = await request.json();

      if (!body.pdfBase64) {
        return NextResponse.json(
          { error: 'No pdfBase64 provided in request body' },
          { status: 400 }
        );
      }

      // Decode base64 PDF
      try {
        const binary = atob(body.pdfBase64);
        pdfBytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          pdfBytes[i] = binary.charCodeAt(i);
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid base64 PDF data' },
          { status: 400 }
        );
      }

      fillData = body.data || {};
      options = { ...options, ...body.options };

    } else {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data or application/json' },
        { status: 400 }
      );
    }

    // Validate PDF has fields
    const analysis = await analyzePDFForm(pdfBytes);
    if (analysis.fillableFields === 0) {
      return NextResponse.json(
        {
          error: 'PDF has no fillable form fields',
          suggestion: 'This PDF may be a flat document without form fields'
        },
        { status: 400 }
      );
    }

    // Perform auto-fill
    const result = await autoFillFromPersonData(pdfBytes, fillData, {
      flatten: options.flatten,
      includeDate: options.includeDate
    });

    if (!result.success || !result.filledPdf) {
      return NextResponse.json(
        {
          error: 'Failed to fill PDF form',
          summary: result.summary,
          unmappedFields: result.unmappedFields.map(f => f.name),
          manualInputRequired: result.manualInputRequired
        },
        { status: 500 }
      );
    }

    // Return response based on format preference
    if (options.returnBase64) {
      return NextResponse.json({
        success: true,
        pdfBase64: pdfToBase64(result.filledPdf),
        summary: result.summary,
        filledFields: result.mappedFields,
        unmappedFields: result.unmappedFields.map(f => ({
          name: f.name,
          type: f.type
        })),
        manualInputRequired: result.manualInputRequired
      });
    } else {
      // Return binary PDF - convert Uint8Array to Buffer for NextResponse compatibility
      return new NextResponse(Buffer.from(result.filledPdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="filled-form.pdf"',
          'X-Filled-Fields': result.mappedFields.length.toString(),
          'X-Manual-Required': result.manualInputRequired.join(',')
        }
      });
    }

  } catch (error) {
    console.error('PDF fill error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to fill PDF', details: errorMessage },
      { status: 500 }
    );
  }
}

// Handle GET for API documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/pdf/form/fill',
    method: 'POST',
    description: 'Fill a PDF form with provided data',
    options: {
      'Option 1': {
        contentType: 'multipart/form-data',
        fields: {
          pdf: 'PDF file to fill (required)',
          data: 'JSON string with field values',
          flatten: 'boolean - make fields non-editable after fill',
          includeDate: 'boolean - auto-fill date fields with today',
          returnBinary: 'boolean - return binary PDF instead of base64'
        }
      },
      'Option 2': {
        contentType: 'application/json',
        body: {
          pdfBase64: 'Base64 encoded PDF (required)',
          data: 'object with field values',
          options: {
            flatten: 'boolean',
            includeDate: 'boolean',
            returnBase64: 'boolean'
          }
        }
      }
    },
    dataFields: {
      name: 'Full name',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      phone: 'Phone number',
      address: 'Street address',
      city: 'City',
      state: 'State/Province',
      zip: 'ZIP/Postal code',
      ssn: 'Social Security Number',
      dob: 'Date of birth',
      company: 'Company name',
      title: 'Job title'
    },
    response: {
      success: 'boolean',
      pdfBase64: 'filled PDF as base64 (if returnBase64)',
      summary: 'human-readable fill summary',
      filledFields: 'array of filled field mappings',
      unmappedFields: 'array of fields that could not be auto-filled',
      manualInputRequired: 'array of fields needing manual input'
    }
  });
}
