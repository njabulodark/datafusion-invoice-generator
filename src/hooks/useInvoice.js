import { useMemo } from 'react';
import { useInvoiceContext } from '../contexts/InvoiceContext';
import {
  calculateSubtotal,
  calculateVATIncluded,
  calculateNetAmount,
  calculateDiscountAmount,
  calculateGrandTotal,
} from '../utils/calculations';

export function useInvoice() {
  const { invoice, dispatch } = useInvoiceContext();

  const subtotal = useMemo(() =>
    calculateSubtotal(invoice.lineItems),
    [invoice.lineItems]
  );

  const vatIncluded = useMemo(() =>
    calculateVATIncluded(subtotal),
    [subtotal]
  );

  const netAmount = useMemo(() =>
    calculateNetAmount(subtotal),
    [subtotal]
  );

  const discountAmount = useMemo(() =>
    calculateDiscountAmount(subtotal, invoice.financials.discountRate),
    [subtotal, invoice.financials.discountRate]
  );

  const grandTotal = useMemo(() =>
    calculateGrandTotal(subtotal, invoice.financials.discountRate),
    [subtotal, invoice.financials.discountRate]
  );

  const financials = useMemo(() => ({
    subtotal,
    vatIncluded,
    netAmount,
    discountRate: invoice.financials.discountRate,
    discountAmount,
    grandTotal,
  }), [subtotal, vatIncluded, netAmount, discountAmount, grandTotal, invoice.financials.discountRate]);

  return {
    invoice: { ...invoice, financials },
    dispatch,
  };
}