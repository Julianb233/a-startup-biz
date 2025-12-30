/**
 * PDF Form Analysis API
 *
 * POST /api/pdf/form/analyze
 *
 * Analyzes a PDF and extracts all form field information.
 * Returns field names, types, and whether they can be auto-filled.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  analyzePDFForm,
  generateAnalysisReport,
  matchFieldToDataKey
} from '@/lib/pdf/form-operations';
import { getRequiredDataKeys } from '@/lib/pdf/form-autofill';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided. Send as form-data with key "pdf"' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Read file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Analyze the form
    const analysis = await analyzePDFForm(pdfBytes);

    // Get required data keys for auto-fill
    const requiredDataKeys = await getRequiredDataKeys(pdfBytes);

    // Enrich field info with auto-fill potential
    const enrichedFields = analysis.fields.map(field => {
      const dataKey = matchFieldToDataKey(field.name);
      return {
        ...field,
        canAutoFill: !!dataKey,
        suggestedDataKey: dataKey
      };
    });

    // Generate human-readable report
    const report = generateAnalysisReport(analysis);

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        fields: enrichedFields
      },
      autoFill: {
        potentialFields: enrichedFields.filter(f => f.canAutoFill).length,
        requiredDataKeys
      },
      report
    });

  } catch (error) {
    console.error('PDF analysis error:', error);

    // Check for specific pdf-lib errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('encrypt') || errorMessage.includes('password')) {
      return NextResponse.json(
        { error: 'PDF is password-protected. Please provide an unprotected PDF.' },
        { status: 400 }
      );
    }

    if (errorMessage.includes('parse') || errorMessage.includes('invalid')) {
      return NextResponse.json(
        { error: 'Invalid or corrupted PDF file.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze PDF', details: errorMessage },
      { status: 500 }
    );
  }
}

// Handle GET for API documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/pdf/form/analyze',
    method: 'POST',
    description: 'Analyze a PDF form and extract field information',
    request: {
      contentType: 'multipart/form-data',
      body: {
        pdf: 'PDF file to analyze (required)'
      }
    },
    response: {
      analysis: {
        totalFields: 'number',
        fillableFields: 'number',
        fields: 'array of field objects',
        fieldsByType: 'count by type'
      },
      autoFill: {
        potentialFields: 'number of fields that can be auto-filled',
        requiredDataKeys: 'array of data keys needed'
      },
      report: 'human-readable analysis report'
    }
  });
}
