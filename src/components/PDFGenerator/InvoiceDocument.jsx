import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  businessDetail: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  invoiceTitle: {
    textAlign: 'right',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    letterSpacing: 2,
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  status: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
    marginTop: 6,
    textAlign: 'center',
    display: 'inline-block',
    width: 40,
  },
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  billingColumn: {
    flex: 1,
  },
  billingLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  clientDetail: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  dateInfo: {
    textAlign: 'right',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  dateValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 6,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 6,
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colRate: { flex: 1, textAlign: 'right' },
  colAmount: { flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#1f2937' },
  financials: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  financialsBox: {
    width: 180,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  financialLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  financialValue: {
    fontSize: 9,
    color: '#374151',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  discount: {
    color: '#16a34a',
  },
  notesSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  noteTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 9,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

/**
 * PDF Document component using @react-pdf/renderer
 * Mirrors the InvoicePreview design for consistent output
 * @param {object} props
 * @param {object} props.invoice - Invoice data object
 */
export default function InvoiceDocument({ invoice }) {
  const {
    invoiceNumber,
    issueDate,
    dueDate,
    status,
    business,
    client,
    lineItems,
    financials,
    notes,
    paymentTerms,
  } = invoice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.businessInfo}>
            {business.logo && (
              <Image src={business.logo} style={{ height: 30, marginBottom: 6 }} />
            )}
            <Text style={styles.businessName}>{business.name}</Text>
            {business.address && <Text style={styles.businessDetail}>{business.address}</Text>}
            {business.email && <Text style={styles.businessDetail}>{business.email}</Text>}
            {business.phone && <Text style={styles.businessDetail}>{business.phone}</Text>}
            {business.website && <Text style={styles.businessDetail}>{business.website}</Text>}
          </View>
          <View style={styles.invoiceTitle}>
            <Text style={styles.titleText}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
            <Text style={styles.status}>{status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Billing Info */}
        <View style={styles.billingSection}>
          <View style={styles.billingColumn}>
            <Text style={styles.billingLabel}>Bill To</Text>
            <Text style={styles.clientName}>{client.name || '—'}</Text>
            {client.address && <Text style={styles.clientDetail}>{client.address}</Text>}
            {client.email && <Text style={styles.clientDetail}>{client.email}</Text>}
            {client.phone && <Text style={styles.clientDetail}>{client.phone}</Text>}
          </View>
          <View style={[styles.billingColumn, styles.dateInfo]}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Issue Date:</Text>
              <Text style={styles.dateValue}>{issueDate}</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Due Date:</Text>
              <Text style={styles.dateValue}>{dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
          </View>
          {lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.description || '—'}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colRate]}>RR{item.rate.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.colAmount]}>RR{(item.quantity * item.rate).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Financials Summary */}
        <View style={styles.financials}>
          <View style={styles.financialsBox}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Subtotal</Text>
              <Text style={styles.financialValue}>RR{financials.subtotal.toFixed(2)}</Text>
            </View>
            {financials.taxRate > 0 && (
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Tax ({financials.taxRate}%)</Text>
                <Text style={styles.financialValue}>RR{financials.taxAmount.toFixed(2)}</Text>
              </View>
            )}
            {financials.discountRate > 0 && (
              <View style={styles.financialRow}>
                <Text style={[styles.financialLabel, styles.discount]}>Discount ({financials.discountRate}%)</Text>
                <Text style={[styles.financialValue, styles.discount]}>RR{financials.discountAmount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>RR{financials.grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes & Terms */}
        {(notes || paymentTerms) && (
          <View style={styles.notesSection}>
            {notes && (
              <View>
                <Text style={styles.noteTitle}>Notes</Text>
                <Text style={styles.noteText}>{notes}</Text>
              </View>
            )}
            {paymentTerms && (
              <View style={{ marginTop: notes ? 8 : 0 }}>
                <Text style={styles.noteTitle}>Payment Terms</Text>
                <Text style={styles.noteText}>{paymentTerms}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
}
