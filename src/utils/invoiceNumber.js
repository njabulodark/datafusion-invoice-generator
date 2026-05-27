import { supabase } from '../lib/supabase';

export async function generateInvoiceNumber(userId) {
  const year = new Date().getFullYear();
  const prefix = `DFC-${year}-`;

  // Query the latest invoice number for this user in the current year
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('user_id', userId)
    .ilike('invoice_number', `${prefix}%`)
    .order('invoice_number', { ascending: false })
    .limit(1);

  if (!error && data && data.length > 0) {
    const lastNumber = parseInt(data[0].invoice_number.split('-').pop(), 10);
    return `${prefix}${String(lastNumber + 1).padStart(3, '0')}`;
  }

  // First invoice of the year
  return `${prefix}001`;
}