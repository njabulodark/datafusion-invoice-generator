import React from 'react';
import SavedInvoicesList from '../components/SavedInvoices/SavedInvoicesList';

export default function InvoiceHistoryPage({ savedInvoices, onTogglePaymentStatus, onDelete, onViewEdit, onViewInvoice }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
  };

  const paidCount = savedInvoices.filter(inv => inv.is_paid).length;
  const unpaidCount = savedInvoices.length - paidCount;
  const totalValue = savedInvoices.reduce((sum, inv) => sum + (Number(inv.grand_total) || 0), 0);
  const paidValue = savedInvoices.filter(inv => inv.is_paid).reduce((sum, inv) => sum + (Number(inv.grand_total) || 0), 0);
  const unpaidValue = totalValue - paidValue;

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px] lg:pt-[64px]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onViewEdit}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Back to editor"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">Invoice History</h1>
              <p className="text-sm text-gray-500 mt-1">
                {savedInvoices.length} invoice{savedInvoices.length !== 1 ? 's' : ''} · 
                <span className="text-green-600 font-medium ml-1">{paidCount} paid</span>
                <span className="text-red-600 font-medium ml-2">{unpaidCount} unpaid</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {savedInvoices.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {/* Total Invoices */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-xl font-bold text-gray-900">{savedInvoices.length}</p>
            </div>
            {/* Paid */}
            <div className="bg-white rounded-xl border border-green-200 p-4">
              <p className="text-xs text-green-600 mb-1">Paid</p>
              <p className="text-xl font-bold text-green-700">{paidCount}</p>
            </div>
            {/* Unpaid */}
            <div className="bg-white rounded-xl border border-red-200 p-4">
              <p className="text-xs text-red-600 mb-1">Unpaid</p>
              <p className="text-xl font-bold text-red-700">{unpaidCount}</p>
            </div>
            {/* Total Value */}
            <div className="bg-white rounded-xl border border-blue-200 p-4 col-span-2 sm:col-span-1">
              <p className="text-xs text-blue-600 mb-1">Total Value</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(totalValue)}</p>
            </div>
            {/* Outstanding */}
            <div className="bg-white rounded-xl border border-orange-200 p-4 col-span-2 sm:col-span-1">
              <p className="text-xs text-orange-600 mb-1">Outstanding</p>
              <p className="text-lg font-bold text-orange-700">{formatCurrency(unpaidValue)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice List */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-8">
        {savedInvoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 lg:p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-sm text-gray-500">Create your first invoice to get started.</p>
          </div>
        ) : (
          <SavedInvoicesList 
            savedInvoices={savedInvoices}
            onTogglePaymentStatus={onTogglePaymentStatus}
            onDelete={onDelete}
            onViewInvoice={onViewInvoice}
          />
        )}
      </div>
    </div>
  );
}
