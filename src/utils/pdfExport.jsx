import React from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoiceDocument from '../templates/invoice';

export async function exportToPDF(invoice) {
  // Create a clean copy without circular refs and with stringified values
  const pdfInvoice = {
    invoiceNumber: String(invoice.invoiceNumber || 'Draft'),
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    business: { ...invoice.business },
    client: { ...invoice.client },
    lineItems: invoice.lineItems.map(item => ({
      id: item.id,
      description: String(item.description || ''),
      quantity: Number(item.quantity) || 0,
      rate: Number(item.rate) || 0,
      amount: Number(item.amount) || 0,
    })),
    financials: { ...invoice.financials },
    notes: invoice.notes || '',
    paymentTerms: invoice.paymentTerms || '',
  };

  const pdfDoc = <InvoiceDocument invoice={pdfInvoice} />;
  const blob = await pdf(pdfDoc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice_${invoice.invoiceNumber || 'draft'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}