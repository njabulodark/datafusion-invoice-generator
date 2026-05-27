import { createContext, useContext, useReducer } from 'react';

const defaultLineItem = {
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
};

const defaultInvoice = {
  invoiceNumber: '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  status: 'draft',
  isPaid: false,
  business: {
    name: 'DataFusion Creation',
    email: 'contact@datafusion.co.za',
    phone: '',
    address: '',
    logo: '',
    website: 'www.datafusion.co.za',
  },
  client: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  lineItems: [defaultLineItem],
  financials: {
    subtotal: 0,
    vatIncluded: 0,
    netAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    grandTotal: 0,
  },
  notes: '',
  paymentTerms: '',
};

function invoiceReducer(state, action) {
  switch (action.type) {
    case 'SET_INVOICE_NUMBER':
      return { ...state, invoiceNumber: action.payload };
    case 'SET_ISSUE_DATE':
      return { ...state, issueDate: action.payload };
    case 'SET_DUE_DATE':
      return { ...state, dueDate: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_BUSINESS':
      return { ...state, business: { ...state.business, ...action.payload } };
    case 'SET_CLIENT':
      return { ...state, client: { ...state.client, ...action.payload } };
    case 'ADD_LINE_ITEM':
      return {
        ...state,
        lineItems: [...state.lineItems, { ...defaultLineItem, id: crypto.randomUUID() }],
      };
    case 'UPDATE_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload, amount: (action.payload.quantity || item.quantity) * (action.payload.rate || item.rate) } : item
        ),
      };
    case 'DELETE_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.filter(item => item.id !== action.payload),
      };
    case 'SET_DISCOUNT_RATE':
      return { ...state, financials: { ...state.financials, discountRate: action.payload } };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_PAYMENT_TERMS':
      return { ...state, paymentTerms: action.payload };
    case 'SET_PAID_STATUS':
      return { ...state, isPaid: action.payload };
    case 'RESET':
      return defaultInvoice;
    default:
      return state;
  }
}

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const [invoice, dispatch] = useReducer(invoiceReducer, defaultInvoice);

  return (
    <InvoiceContext.Provider value={{ invoice, dispatch }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within InvoiceProvider');
  }
  return context;
}