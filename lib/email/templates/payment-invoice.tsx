/**
 * Payment Invoice Email Template
 * Sent with invoice details and payment link
 */

import React from 'react';
import { EmailLayout, EmailCard, EmailIcon, EmailCallout, EmailButton } from '../components/EmailLayout';

export interface PaymentInvoiceProps {
  customerName: string;
  invoiceNumber: string;
  items: Array<{
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax?: number;
  total: number;
  dueDate: string;
  paymentLink: string;
  currency?: string;
}

export default function PaymentInvoice({
  customerName,
  invoiceNumber,
  items,
  subtotal,
  tax = 0,
  total,
  dueDate,
  paymentLink,
  currency = 'USD',
}: PaymentInvoiceProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <EmailLayout previewText={`Invoice ${invoiceNumber} - ${formatCurrency(total)} due ${dueDate}`}>
      <EmailCard>
        <EmailIcon emoji="💳" />

        <h2 style={styles.heading}>Payment Invoice</h2>
        <p style={styles.invoiceNumber}>Invoice #{invoiceNumber}</p>

        <p style={styles.text}>
          Hi {customerName}, please find your invoice details below.
        </p>

        {/* Invoice Details */}
        <div style={styles.detailsBox}>
          <table style={styles.detailsTable}>
            <tbody>
              <tr>
                <td style={styles.detailLabel}>Invoice Number:</td>
                <td style={styles.detailValue}>{invoiceNumber}</td>
              </tr>
              <tr>
                <td style={styles.detailLabel}>Invoice Date:</td>
                <td style={styles.detailValue}>{new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style={styles.detailLabel}>Due Date:</td>
                <td style={{ ...styles.detailValue, fontWeight: '600', color: '#ff6a1a' }}>
                  {dueDate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Line Items */}
        <div style={styles.itemsSection}>
          <h3 style={styles.subheading}>Invoice Items</h3>
          <table style={styles.itemsTable}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={{ ...styles.tableHeaderCell, textAlign: 'left' }}>Item</th>
                <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Qty</th>
                <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Price</th>
                <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.itemCell}>
                    <div style={styles.itemName}>{item.name}</div>
                    {item.description && (
                      <div style={styles.itemDescription}>{item.description}</div>
                    )}
                  </td>
                  <td style={{ ...styles.itemCell, textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ ...styles.itemCell, textAlign: 'right' }}>
                    {formatCurrency(item.price)}
                  </td>
                  <td style={{ ...styles.itemCell, textAlign: 'right', fontWeight: '600' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={styles.totalRow}>
                <td colSpan={3} style={styles.totalLabel}>Subtotal</td>
                <td style={styles.totalValue}>{formatCurrency(subtotal)}</td>
              </tr>
              {tax > 0 && (
                <tr style={styles.totalRow}>
                  <td colSpan={3} style={styles.totalLabel}>Tax</td>
                  <td style={styles.totalValue}>{formatCurrency(tax)}</td>
                </tr>
              )}
              <tr style={styles.grandTotalRow}>
                <td colSpan={3} style={styles.grandTotalLabel}>Total Due</td>
                <td style={styles.grandTotalValue}>{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <EmailCallout type="info">
          <p style={styles.calloutText}>
            <strong style={{ color: '#333' }}>Payment due by {dueDate}</strong>
            <br />
            Click the button below to pay securely online.
          </p>
        </EmailCallout>

        <EmailButton href={paymentLink}>Pay Invoice</EmailButton>

        <p style={styles.footnote}>
          Questions about this invoice? Reply to this email or contact our billing team.
        </p>
      </EmailCard>
    </EmailLayout>
  );
}

const styles = {
  heading: {
    color: '#333',
    margin: '0 0 10px',
    fontSize: '28px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  invoiceNumber: {
    color: '#666',
    fontSize: '16px',
    textAlign: 'center' as const,
    marginBottom: '30px',
  } as React.CSSProperties,

  subheading: {
    color: '#333',
    margin: '0 0 15px',
    fontSize: '18px',
    fontWeight: '600',
  } as React.CSSProperties,

  text: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '30px',
  } as React.CSSProperties,

  detailsBox: {
    background: '#f8f8f8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
  } as React.CSSProperties,

  detailsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,

  detailLabel: {
    padding: '8px 0',
    color: '#666',
    fontSize: '14px',
  } as React.CSSProperties,

  detailValue: {
    padding: '8px 0',
    color: '#333',
    fontWeight: '600',
    textAlign: 'right' as const,
  } as React.CSSProperties,

  itemsSection: {
    marginBottom: '30px',
  } as React.CSSProperties,

  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,

  tableHeader: {
    background: '#f8f8f8',
  } as React.CSSProperties,

  tableHeaderCell: {
    padding: '12px',
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
  } as React.CSSProperties,

  tableRow: {
    borderBottom: '1px solid #eee',
  } as React.CSSProperties,

  itemCell: {
    padding: '12px',
    color: '#333',
  } as React.CSSProperties,

  itemName: {
    fontWeight: '600',
    marginBottom: '4px',
  } as React.CSSProperties,

  itemDescription: {
    fontSize: '13px',
    color: '#666',
  } as React.CSSProperties,

  totalRow: {
    borderTop: '1px solid #eee',
  } as React.CSSProperties,

  totalLabel: {
    padding: '12px',
    textAlign: 'right' as const,
    color: '#666',
  } as React.CSSProperties,

  totalValue: {
    padding: '12px',
    textAlign: 'right' as const,
    color: '#333',
    fontWeight: '600',
  } as React.CSSProperties,

  grandTotalRow: {
    background: '#f8f8f8',
  } as React.CSSProperties,

  grandTotalLabel: {
    padding: '16px 12px',
    textAlign: 'right' as const,
    color: '#333',
    fontWeight: '700',
    fontSize: '16px',
  } as React.CSSProperties,

  grandTotalValue: {
    padding: '16px 12px',
    textAlign: 'right' as const,
    color: '#ff6a1a',
    fontWeight: '700',
    fontSize: '20px',
  } as React.CSSProperties,

  calloutText: {
    margin: '0',
    color: '#666',
  } as React.CSSProperties,

  footnote: {
    marginTop: '30px',
    fontSize: '13px',
    color: '#999',
    textAlign: 'center' as const,
  } as React.CSSProperties,
};
