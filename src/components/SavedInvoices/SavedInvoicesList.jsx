import React, { useState } from 'react';
import dayjs from 'dayjs';

export default function SavedInvoicesList({ savedInvoices, onTogglePaymentStatus, onDelete, onViewInvoice }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!savedInvoices || savedInvoices.length === 0) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return dayjs(dateStr).format('D MMM YYYY');
    } catch {
      return dateStr;
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs w-8"></th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs">Invoice #</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs">Client</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs">Issue Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs">Due Date</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs">Amount</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedInvoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleExpand(invoice.id)}
                      className={`p-1 rounded text-gray-500 hover:bg-gray-200 transition-transform ${expandedId === invoice.id ? 'rotate-90' : ''}`}
                      title="Show line items"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-primary-600">{invoice.invoice_number}</td>
                  <td className="px-4 py-3 truncate max-w-[200px]">{invoice.client_name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(invoice.issue_date)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(invoice.due_date)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(Number(invoice.grand_total) || 0)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onTogglePaymentStatus(invoice.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors min-h-[32px]
                        ${invoice.is_paid
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      title={invoice.is_paid ? 'Mark as unpaid' : 'Mark as paid'}
                    >
                      {invoice.is_paid ? (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Paid
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Unpaid
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* View */}
                      <button
                        onClick={() => onViewInvoice(invoice)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="View invoice"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => onDelete(invoice.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Delete invoice"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expanded Line Items Row */}
                {expandedId === invoice.id && (
                  <tr>
                    <td colSpan="8" className="px-4 py-0 bg-gray-50">
                      <div className="py-3 pl-12 pr-4">
                        {invoice.line_items && invoice.line_items.length > 0 ? (
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 font-semibold text-gray-600 uppercase tracking-wide">Description</th>
                                <th className="text-right py-2 font-semibold text-gray-600 uppercase tracking-wide">Qty</th>
                                <th className="text-right py-2 font-semibold text-gray-600 uppercase tracking-wide">Rate</th>
                                <th className="text-right py-2 font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.line_items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100 last:border-0">
                                  <td className="py-2 pr-3">{item.description || '-'}</td>
                                  <td className="py-2 text-right px-2">{Number(item.quantity) || 0}</td>
                                  <td className="py-2 text-right px-2">{formatCurrency(Number(item.rate) || 0)}</td>
                                  <td className="py-2 text-right font-medium px-2">{formatCurrency(Number(item.amount) || 0)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-xs text-gray-500 py-2">No line items stored</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {savedInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-primary-600">{invoice.invoice_number}</p>
                <p className="text-xs text-gray-500 mt-0.5">{invoice.client_name || 'No client'}</p>
              </div>
              <button
                onClick={() => onTogglePaymentStatus(invoice.id)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors min-h-[32px] shrink-0
                  ${invoice.is_paid
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                title={invoice.is_paid ? 'Mark as unpaid' : 'Mark as paid'}
              >
                {invoice.is_paid ? (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Paid
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Unpaid
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <p className="text-xs text-gray-500">Issued</p>
                <p className="text-sm font-medium">{formatDate(invoice.issue_date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Due</p>
                <p className="text-sm font-medium">{formatDate(invoice.due_date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-bold">{formatCurrency(Number(invoice.grand_total) || 0)}</p>
              </div>
            </div>

            {/* Expandable Line Items */}
            {invoice.line_items && invoice.line_items.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => toggleExpand(invoice.id)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 min-h-[44px] w-full"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${expandedId === invoice.id ? 'rotate-90' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {invoice.line_items.length} item{invoice.line_items.length !== 1 ? 's' : ''}
                </button>
                {expandedId === invoice.id && (
                  <div className="mt-2 space-y-2">
                    {invoice.line_items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between py-1.5 border-b border-gray-100 last:border-0">
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-xs font-medium text-gray-900 truncate">{item.description || '-'}</p>
                          <p className="text-xs text-gray-500">{Number(item.quantity) || 0} × {formatCurrency(Number(item.rate) || 0)}</p>
                        </div>
                        <p className="text-xs font-semibold shrink-0">{formatCurrency(Number(item.amount) || 0)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              {/* View */}
              <button
                onClick={() => onViewInvoice(invoice)}
                className="px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] flex items-center gap-1"
                title="View invoice"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View
              </button>
              {/* Delete */}
              <button
                onClick={() => onDelete(invoice.id)}
                className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] flex items-center gap-1"
                title="Delete invoice"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{savedInvoices.length}</span> invoice{savedInvoices.length !== 1 ? 's' : ''} · 
          Total value: <span className="font-bold text-gray-900">{formatCurrency(savedInvoices.reduce((sum, inv) => sum + (Number(inv.grand_total) || 0), 0))}</span>
        </p>
      </div>
    </div>
  );
}
