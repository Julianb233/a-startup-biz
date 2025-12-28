/**
 * Email Layout Component
 * Reusable email template layout with consistent branding
 */

import React from 'react';

export interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {previewText && (
          <meta name="description" content={previewText} />
        )}
      </head>
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: 0,
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* Preview text (hidden but shows in email clients) */}
        {previewText && (
          <div
            style={{
              display: 'none',
              maxHeight: 0,
              overflow: 'hidden',
              opacity: 0,
            }}
          >
            {previewText}
          </div>
        )}

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1
              style={{ color: '#ff6a1a', margin: 0, fontSize: '28px' }}
            >
              A Startup Biz
            </h1>
          </div>

          {/* Main Content */}
          {children}

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '30px',
              color: '#999',
              fontSize: '14px',
            }}
          >
            <p>
              Questions? Reply to this email or contact us at support@astartupbiz.com
            </p>
            <p style={{ marginTop: '10px' }}>
              © {new Date().getFullYear()} A Startup Biz. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

interface EmailCardProps {
  children: React.ReactNode;
}

export function EmailCard({ children }: EmailCardProps) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </div>
  );
}

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success';
}

export function EmailButton({
  href,
  children,
  color = 'primary',
}: EmailButtonProps) {
  const colors = {
    primary: 'linear-gradient(135deg, #ff6a1a, #ea580c)',
    secondary: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    success: 'linear-gradient(135deg, #10b981, #059669)',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <a
        href={href}
        style={{
          display: 'inline-block',
          background: colors[color],
          color: 'white',
          textDecoration: 'none',
          padding: '14px 28px',
          borderRadius: '8px',
          fontWeight: 600,
        }}
      >
        {children}
      </a>
    </div>
  );
}

interface EmailInfoBoxProps {
  children: React.ReactNode;
  color?: 'default' | 'warning' | 'success';
}

export function EmailInfoBox({ children, color = 'default' }: EmailInfoBoxProps) {
  const colors = {
    default: {
      background: '#f8f8f8',
      border: '#f8f8f8',
    },
    warning: {
      background: '#fff8f5',
      border: '#ffe0d0',
    },
    success: {
      background: '#f0fdf4',
      border: '#bbf7d0',
    },
  };

  return (
    <div
      style={{
        background: colors[color].background,
        border: `1px solid ${colors[color].border}`,
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
      }}
    >
      {children}
    </div>
  );
}

interface EmailIconBadgeProps {
  icon?: string;
  emoji?: string; // Alias for icon
  color?: 'primary' | 'secondary' | 'success';
}

export function EmailIconBadge({ icon, emoji, color = 'primary' }: EmailIconBadgeProps) {
  const displayIcon = icon || emoji || '✓';
  const colors = {
    primary: 'linear-gradient(135deg, #ff6a1a, #ea580c)',
    secondary: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    success: 'linear-gradient(135deg, #10b981, #059669)',
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <div
        style={{
          width: '60px',
          height: '60px',
          background: colors[color],
          borderRadius: '50%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'white', fontSize: '28px' }}>{displayIcon}</span>
      </div>
    </div>
  );
}

// Aliases for consistency with new templates
export const EmailIcon = EmailIconBadge;

// EmailCallout with support for 'type' prop (maps to 'color')
export function EmailCallout({ children, color, type }: EmailInfoBoxProps & { type?: string }) {
  // Map 'type' to 'color' for backward compatibility
  const mappedColor = type === 'warning' ? 'warning' as const
    : type === 'success' ? 'success' as const
    : type === 'info' ? 'default' as const
    : color || 'default';

  return <EmailInfoBox color={mappedColor}>{children}</EmailInfoBox>;
}
