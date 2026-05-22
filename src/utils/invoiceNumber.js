import dayjs from 'dayjs';

/**
 * Generate sequential invoice number in format: DFC-YYYY-NNN
 * Reads counter from localStorage and increments
 */
export function generateInvoiceNumber() {
  const year = dayjs().year();
  const storageKey = `invoice_counter_${year}`;
  
  let counter = parseInt(localStorage.getItem(storageKey) || '0', 10);
  counter += 1;
  localStorage.setItem(storageKey, counter.toString());
  
  const sequence = counter.toString().padStart(3, '0');
  return `DFC-${year}-${sequence}`;
}
