export function calculateFinancials(invoice) {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (invoice.financials.taxRate / 100);
  const discountAmount = subtotal * (invoice.financials.discountRate / 100);
  const grandTotal = subtotal + taxAmount - discountAmount;

  return {
    subtotal,
    taxRate: invoice.financials.taxRate,
    taxAmount,
    discountRate: invoice.financials.discountRate,
    discountAmount,
    grandTotal
  };
}
