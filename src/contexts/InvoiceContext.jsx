import { createContext, useContext, useEffect, useState } from 'react';
import { generateInvoiceNumber } from '../utils/invoiceNumber';
import { calculateFinancials } from '../utils/calculations';
import dayjs from 'dayjs';

export const InvoiceContext = createContext();

const initialInvoiceState = {
  invoiceNumber: generateInvoiceNumber(),
  issueDate: dayjs().format('YYYY-MM-DD'),
  dueDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
  status: 'draft',
  business: {
    name: 'DataFusion Creation',
    email: 'contact@datafusion.com',
    phone: '',
    address: '',
    logo: '',
    website: 'www.datafusion.com'
  },
  client: {
    name: '',
    email: '',
    phone: '',
    address: ''
  },
  lineItems: [],
  financials: { subtotal: 0, taxRate: 10, taxAmount: 0, discountRate: 0, discountAmount: 0, grandTotal: 0 },
  notes: '',
  paymentTerms: ''
};

export function InvoiceContextProvider({ children }) {
  const [invoice, setInvoice] = useState(() => {
    try {
      const saved = localStorage.getItem('invoice_draft');
      return saved ? JSON.parse(saved) : initialInvoiceState;
    } catch {
      return initialInvoiceState;
    }
  });

  useEffect(() => {
    localStorage.setItem('invoice_draft', JSON.stringify(invoice));
  }, [invoice]);

  useEffect(() => {
    setInvoice(prev => {
      const newFinancials = calculateFinancials(prev);
      if (JSON.stringify(newFinancials) === JSON.stringify(prev.financials)) return prev;
      return { ...prev, financials: newFinancials };
    });
  }, [invoice.lineItems, invoice.financials.taxRate, invoice.financials.discountRate]);

  const updateBusiness = (data) => setInvoice(prev => ({ ...prev, business: { ...prev.business, ...data } }));
  const updateClient = (data) => setInvoice(prev => ({ ...prev, client: { ...prev.client, ...data } }));
  const addLineItem = () => setInvoice(prev => ({ ...prev, lineItems: [...prev.lineItems, { id: crypto.randomUUID(), description: '', quantity: 0, rate: 0, amount: 0 }] }));
  const updateLineItem = (id, data) => setInvoice(prev => ({ ...prev, lineItems: prev.lineItems.map(item => item.id === id ? { ...item, ...data, amount: (data.quantity || item.quantity) * (data.rate || item.rate) } : item) }));
  const removeLineItem = (id) => setInvoice(prev => ({ ...prev, lineItems: prev.lineItems.filter(item => item.id !== id) }));
  const updateFinancials = (data) => setInvoice(prev => ({ ...prev, financials: { ...prev.financials, ...data } }));
  const resetInvoice = () => setInvoice(initialInvoiceState);

  return (
    <InvoiceContext.Provider value={{ invoice, updateBusiness, updateClient, addLineItem, updateLineItem, removeLineItem, updateFinancials, resetInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoice = () => useContext(InvoiceContext);
