import React from 'react';
import Input from '../UI/Input';
import { useInvoiceContext } from '../../contexts/InvoiceContext';
import { useInvoice } from '../../hooks/useInvoice';
import { formatCurrency } from '../../utils/calculations';

export default function DiscountSummary() {
  const { dispatch } = useInvoiceContext();
  const { invoice } = useInvoice();

  return (
    <div className="space-y-3 lg:space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Discount & Summary</h3>

      <Input label="Discount (%)" type="number" min="0" max="100" value={invoice.financials.discountRate} onChange={(e) => dispatch({ type: 'SET_DISCOUNT_RATE', payload: parseFloat(e.target.value) || 0 })} />

      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
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
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-semibold">Grand Total</span>
          <span className="font-semibold text-primary-600">{formatCurrency(invoice.financials.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
