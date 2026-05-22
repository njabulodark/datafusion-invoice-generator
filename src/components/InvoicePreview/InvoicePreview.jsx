import React from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';

export default function InvoicePreview() {
  const { invoice } = useInvoice();
  const { invoiceNumber, issueDate, dueDate, status, business, client, lineItems, financials, notes, paymentTerms } = invoice;

  const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-8 sm:px-8 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-12">
          {/* Business Info */}
          <div className="flex-1 min-w-0">
            {business.logo && (
              <img src={business.logo} alt="Logo" className="h-12 mb-3 object-contain" onError={(e) => (e.target.style.display = 'none')} />
            )}
            <h2 className="text-xl font-bold mb-1 truncate">{business.name}</h2>
            {business.address && <p className="text-sm text-blue-100 mb-1 truncate">{business.address}</p>}
            <div className="text-sm text-blue-100 space-y-1">
              {business.email && <p className="truncate">{business.email}</p>}
              {business.phone && <p className="truncate">{business.phone}</p>}
              {business.website && <p className="truncate">{business.website}</p>}
            </div>
          </div>

          {/* Invoice Title */}
          <div className="flex-1 min-w-0 text-right flex flex-col items-end justify-center gap-3">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider uppercase">Invoice</h1>
              <p className="text-lg font-medium mt-1">#{invoiceNumber}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide self-end ${statusColors[status] || statusColors.draft}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div className="px-4 py-8 sm:px-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 border-b border-gray-200">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</h3>
          <p className="font-bold text-gray-800 text-lg mb-1">{client.name || '—'}</p>
          {client.address && <p className="text-sm text-gray-600 mb-1">{client.address}</p>}
          {client.email && <p className="text-sm text-gray-600 mb-1">{client.email}</p>}
          {client.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
        </div>
        <div className="flex flex-col justify-end items-start sm:items-end gap-4">
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Issue Date</span>
            <span className="font-semibold text-gray-800 text-base">{issueDate}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Due Date</span>
            <span className="font-semibold text-gray-800 text-base">{dueDate}</span>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="px-4 py-8 sm:px-8 sm:py-10 overflow-x-auto">
        <table className="w-full text-sm min-w-[320px]">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Description</th>
              <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Qty</th>
              <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Rate</th>
              <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length > 0 ? (
              lineItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4 text-gray-700 break-words">{item.description || '—'}</td>
                  <td className="py-4 text-right text-gray-700">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-700">R{item.rate.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-gray-800">R{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="py-8 text-center text-gray-400 italic">No line items added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Financials Summary */}
      <div className="px-4 py-8 sm:px-8 sm:py-10 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-4">
            <div className="flex justify-between text-gray-600">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">R{financials.subtotal.toFixed(2)}</span>
            </div>
            {financials.taxRate > 0 && (
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Tax ({financials.taxRate}%)</span>
                <span className="font-semibold">R{financials.taxAmount.toFixed(2)}</span>
              </div>
            )}
            {financials.discountRate > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Discount ({financials.discountRate}%)</span>
                <span className="font-semibold">-R{financials.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold text-gray-800 pt-4 border-t-2 border-gray-200">
              <span>Total</span>
              <span className="text-blue-600">R{financials.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(notes || paymentTerms) && (
        <div className="px-4 py-8 sm:px-8 sm:py-10 border-t border-gray-200">
          {notes && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{notes}</p>
            </div>
          )}
          {paymentTerms && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Terms</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{paymentTerms}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-6 bg-gray-100 border-t border-gray-200 text-center">
        <p className="text-xs font-medium text-gray-500">Thank you for your business!</p>
      </div>
    </div>
  );
}
