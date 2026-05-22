import React from 'react';
import Input from '../UI/Input';
import { useInvoice } from '../../contexts/InvoiceContext';

/**
 * Inputs for tax rate and discount rate
 * Financials auto-calculated by InvoiceContext
 */
export default function TaxDiscount() {
  const { invoice, updateFinancials } = useInvoice();
  const { financials } = invoice;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, parseFloat(value) || 0);
    updateFinancials({ [name]: numValue });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax & Discount</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="VAT (15% Inclusive)"
          name="taxRate"
          type="number"
          value={financials.taxRate}
          onChange={handleChange}
          placeholder="15"
          min="0"
          max="100"
          step="0.1"
          disabled
        />
        <Input
          label="Discount Rate (%)"
          name="discountRate"
          type="number"
          value={financials.discountRate}
          onChange={handleChange}
          placeholder="0"
          min="0"
          max="100"
          step="0.1"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (incl. VAT)</span>
            <span>R{financials.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>VAT Amount (15%)</span>
            <span>R{financials.taxAmount.toFixed(2)}</span>
          </div>
          {financials.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({financials.discountRate}%)</span>
              <span>-R{financials.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold text-gray-800 pt-2 border-t border-gray-200">
            <span>Grand Total</span>
            <span>R{financials.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
