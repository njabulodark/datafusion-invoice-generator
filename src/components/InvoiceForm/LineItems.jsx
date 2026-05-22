import React from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useInvoice } from '../../contexts/InvoiceContext';

/**
 * Dynamic list of line items with add/remove functionality
 * Each item: description, quantity, rate with auto-calculated amount
 */
export default function LineItems() {
  const { invoice, addLineItem, updateLineItem, removeLineItem } = useInvoice();
  const { lineItems } = invoice;

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(0, parseFloat(value) || 0);
    updateLineItem(id, { quantity: qty });
  };

  const handleRateChange = (id, value) => {
    const rate = Math.max(0, parseFloat(value) || 0);
    updateLineItem(id, { rate });
  };

  const handleDescriptionChange = (id, value) => {
    updateLineItem(id, { description: value });
  };

  const handleRemove = (id) => {
    if (lineItems.length > 1) {
      removeLineItem(id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Line Items</h3>
        <Button variant="secondary" onClick={addLineItem} className="text-xs">
          + Add Item
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-5">Description</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-1" />
        </div>

        {lineItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg"
          >
            <div className="col-span-5">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                placeholder="Item description"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.quantity || ''}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.rate || ''}
                onChange={(e) => handleRateChange(item.id, e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm font-medium text-gray-700">
                RR{(item.quantity * item.rate).toFixed(2)}
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => handleRemove(item.id)}
                disabled={lineItems.length <= 1}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Remove item"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <span className="font-medium">Subtotal: </span>
        <span className="float-right">${(lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)).toFixed(2)}</span>
      </div>
    </div>
  );
}
