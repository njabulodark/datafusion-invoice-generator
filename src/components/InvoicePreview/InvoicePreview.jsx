import React from 'react';
import { useInvoice } from '../../hooks/useInvoice';
import { formatCurrency } from '../../utils/calculations';
import dayjs from 'dayjs';

export default function InvoicePreview() {
  const { invoice } = useInvoice();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-8 min-h-full">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 lg:mb-8 gap-3">
        <div className="min-w-0">
          {invoice.business.logo && (
            <img src={invoice.business.logo} alt="Logo" className="h-10 lg:h-12 mb-2 object-contain" />
          )}
          <h2 className="text-base lg:text-xl font-bold text-gray-900 truncate">{invoice.business.name}</h2>
          {invoice.business.website && (
            <p className="text-xs lg:text-sm text-gray-500 truncate">{invoice.business.website}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <h1 className="text-xl lg:text-2xl font-bold text-primary-600">INVOICE</h1>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">#{invoice.invoiceNumber || 'Draft'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8 text-xs lg:text-sm">
        <div>
          <span className="text-gray-500">Issue Date:</span>
          <span className="ml-2 font-medium">{dayjs(invoice.issueDate).format('D MMM YYYY')}</span>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-gray-500">Due Date:</span>
          <span className="ml-2 font-medium">{invoice.dueDate ? dayjs(invoice.dueDate).format('D MMM YYYY') : '—'}</span>
        </div>
      </div>

      <div className="mb-6 lg:mb-8 p-3 lg:p-4 bg-gray-50 rounded-lg">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</p>
        <p className="font-medium">{invoice.client.name || '—'}</p>
        {invoice.client.address && <p className="text-xs lg:text-sm text-gray-600">{invoice.client.address}</p>}
        {invoice.client.email && <p className="text-xs lg:text-sm text-gray-600 break-all">{invoice.client.email}</p>}
      </div>

      <div className="overflow-x-auto -mx-4 lg:mx-0 px-4 lg:px-0 mb-6 lg:mb-8">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 text-xs lg:text-sm font-semibold text-gray-700">Description</th>
              <th className="text-right py-2 text-xs lg:text-sm font-semibold text-gray-700">Qty</th>
              <th className="text-right py-2 text-xs lg:text-sm font-semibold text-gray-700">Rate</th>
              <th className="text-right py-2 text-xs lg:text-sm font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2 text-xs lg:text-sm">{item.description || '—'}</td>
                <td className="py-2 text-xs lg:text-sm text-right">{item.quantity}</td>
                <td className="py-2 text-xs lg:text-sm text-right">{formatCurrency(item.rate)}</td>
                <td className="py-2 text-xs lg:text-sm text-right font-medium">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full sm:w-64 space-y-2 text-xs lg:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount (excl. VAT)</span>
            <span className="font-medium">{formatCurrency(invoice.financials.netAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">VAT (15%)</span>
            <span className="font-medium">{formatCurrency(invoice.financials.vatIncluded)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total (incl. VAT)</span>
            <span className="font-medium">{formatCurrency(invoice.financials.subtotal)}</span>
          </div>
          {invoice.financials.discountRate > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount ({invoice.financials.discountRate}%)</span>
              <span className="font-medium text-green-600">-{formatCurrency(invoice.financials.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t-2 border-gray-900">
            <span className="font-bold text-sm lg:text-base">Grand Total</span>
            <span className="font-bold text-sm lg:text-base text-primary-600">{formatCurrency(invoice.financials.grandTotal)}</span>
          </div>
        </div>
      </div>

      {(invoice.notes || invoice.paymentTerms) && (
        <div className="mt-6 lg:mt-8 pt-4 border-t border-gray-200 text-xs lg:text-sm text-gray-600">
          {invoice.notes && <p><span className="font-medium">Notes:</span> {invoice.notes}</p>}
          {invoice.paymentTerms && <p className="mt-1"><span className="font-medium">Payment Terms:</span> {invoice.paymentTerms}</p>}
        </div>
      )}

      <p className="mt-4 lg:mt-6 text-center text-xs text-gray-400">Thank you for your business!</p>
    </div>
  );
}
