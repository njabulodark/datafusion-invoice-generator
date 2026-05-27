import React, { useState, useRef, useEffect } from 'react';
import { InvoiceProvider, useInvoiceContext } from './contexts/InvoiceContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useInvoice } from './hooks/useInvoice';
import { supabase } from './lib/supabase';
import { generateInvoiceNumber } from './utils/invoiceNumber';
import { exportToPDF } from './utils/pdfExport';
import BusinessDetails from './components/InvoiceForm/BusinessDetails';
import ClientDetails from './components/InvoiceForm/ClientDetails';
import LineItems from './components/InvoiceForm/LineItems';
import DiscountSummary from './components/InvoiceForm/TaxDiscount';
import InvoicePreview from './components/InvoicePreview/InvoicePreview';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import SavedInvoicesList from './components/SavedInvoices/SavedInvoicesList';
import Button from './components/UI/Button';
import Input from './components/UI/Input';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import dayjs from 'dayjs';

function InvoiceApp() {
  const { invoice, dispatch } = useInvoiceContext();
  const { user, logout } = useAuth();
  const { invoice: computedInvoice } = useInvoice();
  const [drafts, setDrafts] = useState([]);
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [autoSavedToast, setAutoSavedToast] = useState(false);
  const [view, setView] = useState('edit'); // 'edit' | 'history'
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [mobileView, setMobileView] = useState('edit');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const currentInvoiceSavedRef = useRef(false);

  // Fetch invoices, drafts, business info, and generate invoice number on mount / user change
  useEffect(() => {
    if (!user) return;
    fetchInvoices();
    fetchDrafts();
    generateNextInvoiceNumber();
    loadBusinessInfo();
  }, [user]);

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setSavedInvoices(data);
  }

  async function fetchDrafts() {
    const { data, error } = await supabase
      .from('invoice_drafts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setDrafts(data);
  }

  async function loadBusinessInfo() {
    const { data, error } = await supabase
      .from('profiles')
      .select('business_info')
      .eq('id', user.id)
      .single();
    if (!error && data?.business_info) {
      Object.keys(data.business_info).forEach(field => {
        dispatch({ type: 'SET_BUSINESS', payload: { [field]: data.business_info[field] } });
      });
    }
  }

  // Auto-save business info when it changes
  useEffect(() => {
    if (!user) return;
    const saveBusinessInfo = async () => {
      try {
        await supabase.from('profiles').update({
          business_info: invoice.business,
        }).eq('id', user.id);
      } catch {} // ignore errors silently
    };
    saveBusinessInfo();
  }, [invoice.business]);

  // Auto-save invoice when it has meaningful data (client name + line items)
  useEffect(() => {
    const hasClient = computedInvoice.client?.name && computedInvoice.client.name.trim().length > 0;
    const hasLineItems = computedInvoice.lineItems && computedInvoice.lineItems.some(item => item.amount > 0);
    const alreadySaved = savedInvoices.find(inv => inv.invoice_number === computedInvoice.invoiceNumber);

    // Save line item descriptions to DB for autocomplete
    async function saveDescriptions() {
      if (!computedInvoice.lineItems) return;
      for (const item of computedInvoice.lineItems) {
        if (item.description && item.description.trim().length > 0) {
          try {
            await supabase.from('line_item_descriptions').insert({
              user_id: user.id,
              description: item.description.trim(),
            });
          } catch {} // ignore duplicates
        }
      }
    }

    if (!hasClient || !hasLineItems) return;

    if (alreadySaved) {
      // Invoice already in DB — update it with latest data
      supabase.from('invoices').update({
        client_name: computedInvoice.client.name,
        grand_total: computedInvoice.financials?.grandTotal || 0,
        issue_date: computedInvoice.issueDate,
        due_date: computedInvoice.dueDate,
        line_items: computedInvoice.lineItems.map(item => ({
          description: item.description,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          amount: Number(item.amount) || 0,
        })),
      }).eq('invoice_number', computedInvoice.invoiceNumber).eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setSavedInvoices(data);
        });
    } else {
      // First time saving this invoice — insert it
      supabase.from('invoices').insert({
        user_id: user.id,
        invoice_number: computedInvoice.invoiceNumber,
        issue_date: computedInvoice.issueDate,
        due_date: computedInvoice.dueDate,
        client_name: computedInvoice.client.name,
        grand_total: computedInvoice.financials?.grandTotal || 0,
        is_paid: false,
        line_items: computedInvoice.lineItems.map(item => ({
          description: item.description,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          amount: Number(item.amount) || 0,
        })),
      }).then(({ data }) => {
        if (data) setSavedInvoices(prev => [...prev, ...data]);
        currentInvoiceSavedRef.current = true;
        setAutoSavedToast(true);
        setTimeout(() => setAutoSavedToast(false), 2500);
      });
    }

    saveDescriptions();
  }, [computedInvoice.client?.name, computedInvoice.lineItems, computedInvoice.financials?.grandTotal, computedInvoice.invoiceNumber]);

  const generateNextInvoiceNumber = async () => {
    const num = await generateInvoiceNumber(user.id);
    dispatch({ type: 'SET_INVOICE_NUMBER', payload: num });
  };

  const handleNewInvoice = async () => {
    currentInvoiceSavedRef.current = false;
    dispatch({ type: 'RESET' });
    const num = await generateInvoiceNumber(user.id);
    dispatch({ type: 'SET_INVOICE_NUMBER', payload: num });
    // Restore saved business info after reset
    loadBusinessInfo();
  };

  const handleSaveDraft = async () => {
    const draftName = prompt('Enter draft name:');
    if (!draftName) return;

    await supabase.from('invoice_drafts').insert({
      user_id: user.id,
      name: draftName,
      data: computedInvoice,
    });
    fetchDrafts();
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  const togglePaymentStatus = async (id) => {
    const localInvoice = savedInvoices.find(inv => inv.id === id);
    if (!localInvoice) return;

    const newPaidState = !localInvoice.is_paid;
    setSavedInvoices(prev => prev.map(inv =>
      inv.id === id ? { ...inv, is_paid: newPaidState } : inv
    ));

    await supabase.from('invoices').update({ is_paid: newPaidState }).eq('id', id);
  };

  const handleDeleteSavedInvoice = async (id) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    setSavedInvoices(prev => prev.filter(inv => inv.id !== id));
    await supabase.from('invoices').delete().eq('id', id);
  };

  const handleLoadDraft = (draft) => {
    const data = draft.data;
    Object.keys(data).forEach(key => {
      if (key === 'business') {
        Object.keys(data.business).forEach(field => {
          dispatch({ type: 'SET_BUSINESS', payload: { [field]: data.business[field] } });
        });
      } else if (key === 'client') {
        Object.keys(data.client).forEach(field => {
          dispatch({ type: 'SET_CLIENT', payload: { [field]: data.client[field] } });
        });
      } else if (key === 'financials') {
        dispatch({ type: 'SET_DISCOUNT_RATE', payload: data.financials.discountRate });
      } else if (key === 'lineItems') {
        dispatch({ type: 'RESET' });
        data.lineItems.forEach(item => {
          dispatch({ type: 'ADD_LINE_ITEM' });
        });
      } else {
        dispatch({ type: `SET_${key.toUpperCase()}`, payload: data[key] });
      }
    });
  };

  const handleDeleteDraft = async (id) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    await supabase.from('invoice_drafts').delete().eq('id', id);
  };

  const handleGenerate = async () => {
    // Ensure invoice is saved to DB first
    const hasClient = computedInvoice.client?.name && computedInvoice.client.name.trim().length > 0;
    const hasLineItems = computedInvoice.lineItems && computedInvoice.lineItems.some(item => item.amount > 0);

    if (hasClient && hasLineItems) {
      const alreadySaved = savedInvoices.find(inv => inv.invoice_number === computedInvoice.invoiceNumber);

      try {
        if (!alreadySaved) {
          const insertData = {
            user_id: user.id,
            invoice_number: computedInvoice.invoiceNumber,
            issue_date: computedInvoice.issueDate || null,
            due_date: computedInvoice.dueDate || null,
            client_name: computedInvoice.client.name,
            grand_total: Number(computedInvoice.financials?.grandTotal) || 0,
            is_paid: false,
            line_items: computedInvoice.lineItems.map(item => ({
              description: item.description,
              quantity: Number(item.quantity) || 0,
              rate: Number(item.rate) || 0,
              amount: Number(item.amount) || 0,
            })),
          };

          const { data, error } = await supabase.from('invoices').insert(insertData);
          if (error) throw new Error(error.message);

          // Save descriptions for autocomplete
          if (computedInvoice.lineItems) {
            for (const item of computedInvoice.lineItems) {
              if (item.description && item.description.trim().length > 0) {
                try {
                  await supabase.from('line_item_descriptions').insert({
                    user_id: user.id,
                    description: item.description.trim(),
                  });
                } catch {} // ignore duplicates
              }
            }
          }

          await fetchInvoices();
        } else {
          // Update existing invoice
          await supabase.from('invoices').update({
            client_name: computedInvoice.client.name,
            grand_total: Number(computedInvoice.financials?.grandTotal) || 0,
            issue_date: computedInvoice.issueDate || null,
            due_date: computedInvoice.dueDate || null,
            line_items: computedInvoice.lineItems.map(item => ({
              description: item.description,
              quantity: Number(item.quantity) || 0,
              rate: Number(item.rate) || 0,
              amount: Number(item.amount) || 0,
            })),
          }).eq('invoice_number', computedInvoice.invoiceNumber).eq('user_id', user.id);

          await fetchInvoices();
        }
      } catch (err) {
        console.error('Failed to save invoice:', err.message, err.details);
        alert('Failed to save invoice: ' + err.message);
        return; // Don't download PDF if save fails
      }
    }

    // Download PDF
    await exportToPDF(computedInvoice);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return dayjs(dateStr).format('D MMM YYYY');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs lg:text-sm">DF</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-bold text-gray-900 truncate">DataFusion Creation</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Invoice Generator</p>
            </div>
          </div>
          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {view === 'edit' ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => setView('history')}>
                  Invoice History
                </Button>
                <Button variant="secondary" size="sm" onClick={handleNewInvoice}>
                  New Invoice
                </Button>
                <Button variant="secondary" size="sm" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button onClick={handleGenerate}>
                  Generate
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setView('edit')}>
                New Invoice
              </Button>
            )}

            {/* User info + logout */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <span className="text-xs text-gray-500 truncate max-w-[120px]">{user?.name || user?.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
          {/* Mobile buttons - icon only */}
          <div className="flex lg:hidden items-center gap-1">
            {view === 'edit' ? (
              <>
                <button
                  onClick={handleNewInvoice}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                  title="New Invoice"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                  title="Save Draft"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </button>
                <button
                  onClick={handleGenerate}
                  className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 active:bg-primary-100"
                  title="Generate Invoice"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => setView('edit')}
                className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 active:bg-primary-100"
                title="New Invoice"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setView(view === 'edit' ? 'history' : 'edit')}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200"
              title={view === 'edit' ? 'Invoice History' : 'Edit Invoice'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {view === 'edit' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                )}
              </svg>
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H3m7 6V6" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Save Confirmation */}
      {showSaveConfirm && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          Draft saved successfully!
        </div>
      )}

      {/* Auto-Save Toast */}
      {autoSavedToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg shadow-lg text-sm z-50 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Invoice auto-saved!
        </div>
      )}

      {view === 'edit' ? (
        <main className="max-w-7xl mx-auto px-3 lg:px-6 py-4 lg:py-6 pt-[72px] lg:pt-[64px]">
          {/* Invoice Number & Dates */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4 mb-4 lg:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Invoice Number</label>
                <p className="text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">{invoice.invoiceNumber || 'Generating...'}</p>
              </div>
              <Input
                label="Issue Date"
                type="date"
                value={invoice.issueDate}
                onChange={(e) => dispatch({ type: 'SET_ISSUE_DATE', payload: e.target.value })}
              />
              <Input
                label="Due Date"
                type="date"
                value={invoice.dueDate}
                onChange={(e) => dispatch({ type: 'SET_DUE_DATE', payload: e.target.value })}
              />
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden gap-2 mb-4">
            <button
              onClick={() => setMobileView('edit')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors min-h-[44px]
                ${mobileView === 'edit'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 active:bg-gray-50'}`}
            >
              Edit Invoice
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors min-h-[44px]
                ${mobileView === 'preview'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 active:bg-gray-50'}`}
            >
              Preview
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Left Panel - Form (hidden on mobile when preview active) */}
            <div className={`space-y-4 lg:space-y-6 ${mobileView === 'preview' ? 'hidden lg:block' : ''}`}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
                <button
                  onClick={() => setShowBusinessInfo(!showBusinessInfo)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 min-h-[44px]"
                >
                  Business Info
                  <svg
                    className={`w-4 h-4 transition-transform ${showBusinessInfo ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showBusinessInfo && <BusinessDetails />}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
                <ClientDetails />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
                <LineItems />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
                <DiscountSummary />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Notes & Terms</h3>
                <Input
                  label="Notes"
                  value={invoice.notes}
                  onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
                />
                <Input
                  label="Payment Terms"
                  value={invoice.paymentTerms}
                  onChange={(e) => dispatch({ type: 'SET_PAYMENT_TERMS', payload: e.target.value })}
                  className="mt-3"
                />
              </div>

              {/* Saved Drafts */}
              {drafts.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Saved Drafts</h3>
                  <div className="space-y-2">
                    {drafts.map(draft => (
                      <div key={draft.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{draft.name}</p>
                          <p className="text-xs text-gray-500">{dayjs(draft.created_at).format('D MMM YYYY')}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => handleLoadDraft(draft)}>Load</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteDraft(draft.id)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Invoices (inline preview) */}
              {savedInvoices.length > 0 && view === 'edit' && (
                <SavedInvoicesList
                  savedInvoices={savedInvoices.slice(-3)}
                  onTogglePaymentStatus={togglePaymentStatus}
                  onDelete={handleDeleteSavedInvoice}
                  onViewInvoice={(inv) => { setViewingInvoice(inv); }}
                />
              )}
            </div>

            {/* Right Panel - Preview (hidden on mobile when preview active) */}
            <div className={`lg:sticky lg:top-6 ${mobileView === 'edit' ? 'hidden lg:block' : ''}`}>
              <InvoicePreview />
            </div>
          </div>
        </main>
      ) : (
        <InvoiceHistoryPage
          savedInvoices={savedInvoices}
          onTogglePaymentStatus={togglePaymentStatus}
          onDelete={handleDeleteSavedInvoice}
          onViewEdit={() => setView('edit')}
          onViewInvoice={(inv) => { setViewingInvoice(inv); }}
        />
      )}

      {/* Invoice Detail Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Invoice Details</h2>
              <button
                onClick={() => setViewingInvoice(null)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Invoice Number & Status */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary-600">{viewingInvoice.invoice_number}</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${viewingInvoice.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {viewingInvoice.is_paid ? (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Paid
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Unpaid
                    </>
                  )}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Client</p>
                  <p className="text-sm font-medium">{viewingInvoice.client_name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-sm font-bold">{formatCurrency(Number(viewingInvoice.grand_total) || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Issue Date</p>
                  <p className="text-sm font-medium">{viewingInvoice.issue_date ? formatDate(viewingInvoice.issue_date) : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Due Date</p>
                  <p className="text-sm font-medium">{viewingInvoice.due_date ? formatDate(viewingInvoice.due_date) : '-'}</p>
                </div>
              </div>

              {/* Created At */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-sm">{viewingInvoice.created_at ? formatDate(viewingInvoice.created_at) : '-'}</p>
              </div>

              {/* Line Items */}
              {viewingInvoice.line_items && viewingInvoice.line_items.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Line Items</p>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">Qty</th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">Rate</th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingInvoice.line_items.map((item, idx) => (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-3 py-2 truncate max-w-[180px]">{item.description || '-'}</td>
                            <td className="px-3 py-2 text-right">{Number(item.quantity) || 0}</td>
                            <td className="px-3 py-2 text-right">{formatCurrency(Number(item.rate) || 0)}</td>
                            <td className="px-3 py-2 text-right font-medium">{formatCurrency(Number(item.amount) || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <InvoiceProvider>
          <InvoiceApp />
        </InvoiceProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
}
