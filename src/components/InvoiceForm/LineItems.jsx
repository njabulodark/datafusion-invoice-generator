import React, { useState, useEffect, useRef } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useInvoiceContext } from '../../contexts/InvoiceContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function LineItems() {
  const { invoice, dispatch } = useInvoiceContext();
  const { user } = useAuth();
  const [descriptions, setDescriptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // which item index has open dropdown
  const [filteredDescs, setFilteredDescs] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetchDescriptions();
  }, [user]);

  async function fetchDescriptions() {
    const { data, error } = await supabase
      .from('line_item_descriptions')
      .select('description')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setDescriptions(data.map(d => d.description));
    }
  }

  const handleAddItem = () => {
    dispatch({ type: 'ADD_LINE_ITEM' });
  };

  const handleUpdateItem = (id, field, value) => {
    dispatch({ type: 'UPDATE_LINE_ITEM', payload: { id, [field]: parseFloat(value) || 0 } });
  };

  const handleDeleteItem = (id) => {
    dispatch({ type: 'DELETE_LINE_ITEM', payload: id });
  };

  const handleDescriptionChange = (id, index, value) => {
    dispatch({ type: 'UPDATE_LINE_ITEM', payload: { id, description: value } });

    if (value.trim().length > 0) {
      const matches = descriptions.filter(d =>
        d.toLowerCase().includes(value.toLowerCase()) && d.toLowerCase() !== value.toLowerCase()
      );
      setFilteredDescs(matches);
      setActiveIndex(index);
    } else {
      setFilteredDescs([]);
      setActiveIndex(null);
    }
  };

  const selectSuggestion = (id, suggestion) => {
    dispatch({ type: 'UPDATE_LINE_ITEM', payload: { id, description: suggestion } });
    setFilteredDescs([]);
    setActiveIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilteredDescs([]);
        setActiveIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Line Items</h3>
        <Button size="sm" onClick={handleAddItem}>+ Add Item</Button>
      </div>

      <div className="space-y-3 relative" ref={dropdownRef}>
        {invoice.lineItems.map((item, index) => (
          <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
              {invoice.lineItems.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>Remove</Button>
              )}
            </div>
            <div className="relative">
              <Input label="Description" value={item.description} onChange={(e) => handleDescriptionChange(item.id, index, e.target.value)} />
              {activeIndex === index && filteredDescs.length > 0 && (
                <ul className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredDescs.slice(0, 8).map((desc, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      onClick={() => selectSuggestion(item.id, desc)}
                    >
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input label="Quantity" type="number" min="0" value={item.quantity} onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)} />
              <Input label="Rate (R, incl. VAT)" type="number" min="0" step="0.01" value={item.rate} onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)} />
            </div>
            <p className="mt-2 text-sm font-medium text-right">Amount: R{item.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
