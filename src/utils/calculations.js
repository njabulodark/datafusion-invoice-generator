const VAT_RATE = 0.15;

export function calculateSubtotal(lineItems) {
  return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
}

export function calculateVATIncluded(subtotal) {
  const netAmount = subtotal / (1 + VAT_RATE);
  return subtotal - netAmount;
}

export function calculateNetAmount(subtotal) {
  return subtotal / (1 + VAT_RATE);
}

export function calculateDiscountAmount(subtotal, discountRate) {
  return subtotal * (discountRate / 100);
}

export function calculateGrandTotal(subtotal, discountRate) {
  return subtotal - calculateDiscountAmount(subtotal, discountRate);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
}