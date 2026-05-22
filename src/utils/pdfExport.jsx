import { pdf } from '@react-pdf/renderer';
import InvoiceDocument from '../components/PDFGenerator/InvoiceDocument';

/**
 * Export invoice as PDF and trigger browser download
 * @param {object} invoice - Invoice data object
 * @returns {Promise<void>}
 */
export async function exportInvoicePDF(invoice) {
  try {
    const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}
