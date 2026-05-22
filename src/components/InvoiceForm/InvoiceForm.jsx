import React from 'react';
import BusinessDetails from './BusinessDetails';
import ClientDetails from './ClientDetails';
import LineItems from './LineItems';
import TaxDiscount from './TaxDiscount';
import Button from '../UI/Button';
import { useInvoice } from '../../contexts/InvoiceContext';
import { exportInvoicePDF } from '../../utils/pdfExport';

/**
 * Main Invoice Form container
 * Wraps BusinessDetails, ClientDetails, LineItems, and TaxDiscount
 * Provides reset and export actions
 */
export default function InvoiceForm() {
  const { resetInvoice, invoice } = useInvoice();

  const handleReset = () => {
    if (window.confirm('Reset all invoice data? This cannot be undone.')) {
      resetInvoice();
    }
  };

  const handleExport = () => {
    exportInvoicePDF(invoice);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Invoice Generator</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleExport}>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Invoice #{invoice.invoiceNumber} • {invoice.issueDate}
      </div>

      <BusinessDetails />
      <ClientDetails />
      <LineItems />
      <TaxDiscount />
    </div>
  );
}
