import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import dayjs from 'dayjs';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 10,
  },
  billTo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  billToLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
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
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 4,
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colRate: { flex: 1, textAlign: 'right' },
  colAmount: { flex: 1, textAlign: 'right', fontWeight: 'bold' },
  totals: {
    marginLeft: 'auto',
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 10,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#111827',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    fontSize: 9,
    color: '#6b7280',
  },
});

export default function InvoiceDocument({ invoice }) {
  const formatCurrency = (amount) =>
    'R ' + amount.toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {invoice.business.logo && (
              <Image src={invoice.business.logo} style={{ height: 40, marginBottom: 4 }} />
            )}
            <Text style={styles.businessName}>{invoice.business.name}</Text>
            {invoice.business.email && <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.business.email}</Text>}
            {invoice.business.website && <Text style={{ fontSize: 9, color: '#6b7280' }}>{invoice.business.website}</Text>}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber || 'Draft'}</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.dates}>
          <Text>Issue: {dayjs(invoice.issueDate).format('D MMM YYYY')}</Text>
          <Text>Due: {invoice.dueDate ? dayjs(invoice.dueDate).format('D MMM YYYY') : '—'}</Text>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>Bill To</Text>
          <Text style={{ fontWeight: 'bold' }}>{invoice.client.name || '—'}</Text>
          {invoice.client.address && <Text style={{ fontSize: 9 }}>{invoice.client.address}</Text>}
          {invoice.client.email && <Text style={{ fontSize: 9 }}>{invoice.client.email}</Text>}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>
          {invoice.lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDesc}>{String(item.description || '—')}</Text>
              <Text style={styles.colQty}>{String(item.quantity)}</Text>
              <Text style={styles.colRate}>{formatCurrency(Number(item.rate))}</Text>
              <Text style={styles.colAmount}>{formatCurrency(Number(item.amount))}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Amount (excl. VAT)</Text>
            <Text>{formatCurrency(Number(invoice.financials.netAmount))}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>VAT (15%)</Text>
            <Text>{formatCurrency(Number(invoice.financials.vatIncluded))}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Total (incl. VAT)</Text>
            <Text>{formatCurrency(Number(invoice.financials.subtotal))}</Text>
          </View>
          {Number(invoice.financials.discountRate) > 0 && (
            <View style={styles.totalRow}>
              <Text>Discount ({invoice.financials.discountRate}%)</Text>
              <Text>{formatCurrency(Number(invoice.financials.discountAmount))}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text>Grand Total</Text>
            <Text style={{ color: '#2563eb' }}>{formatCurrency(Number(invoice.financials.grandTotal))}</Text>
          </View>
        </View>

        {/* Footer */}
        {(invoice.notes || invoice.paymentTerms) && (
          <View style={styles.footer}>
            {invoice.notes && <Text>Notes: {invoice.notes}</Text>}
            {invoice.paymentTerms && <Text>Payment Terms: {invoice.paymentTerms}</Text>}
          </View>
        )}
      </Page>
    </Document>
  );
}