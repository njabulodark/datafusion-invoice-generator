export function calculateFinancials(invoice) {
  // Subtotal is the sum of line item totals (prices are inclusive of VAT)
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  
  // 15% Inclusive VAT: Extract VAT from the inclusive subtotal
  // Formula: VAT = GrossAmount * (VAT_Rate / (100 + VAT_Rate))
  const taxRate = 15;
  const taxAmount = subtotal * (taxRate / (100 + taxRate));
  
  const discountRate = invoice.financials.discountRate || 0;
  const discountAmount = subtotal * (discountRate / 100);
  
  // Grand Total is the inclusive subtotal minus any discount
  const grandTotal = subtotal - discountAmount;

  return {
    subtotal,
    taxRate: taxRate,
    taxAmount,
    discountRate: discountRate,
    discountAmount,
    grandTotal
  };
}
