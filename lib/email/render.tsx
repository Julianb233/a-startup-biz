/**
 * Email Template Rendering Utilities
 * Convert React components to HTML email strings
 */

import { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Render a React email component to HTML string
 */
export function renderEmail(component: ReactElement): string {
  return renderToStaticMarkup(component);
}

/**
 * Helper to create email template with subject and HTML
 */
export function createEmailTemplate(
  subject: string,
  component: ReactElement
): { subject: string; html: string } {
  return {
    subject,
    html: renderEmail(component),
  };
}
