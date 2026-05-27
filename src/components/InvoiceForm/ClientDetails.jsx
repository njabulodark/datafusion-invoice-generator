import React from 'react';
import Input from '../UI/Input';
import { useInvoiceContext } from '../../contexts/InvoiceContext';

export default function ClientDetails() {
  const { invoice, dispatch } = useInvoiceContext();

  const handleChange = (field) => (e) => {
    dispatch({ type: 'SET_CLIENT', payload: { [field]: e.target.value } });
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Client Info</h3>
      <Input label="Client Name" value={invoice.client.name} onChange={handleChange('name')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Email" type="email" value={invoice.client.email} onChange={handleChange('email')} />
        <Input label="Phone" type="tel" value={invoice.client.phone} onChange={handleChange('phone')} />
      </div>
      <Input label="Address" value={invoice.client.address} onChange={handleChange('address')} />
    </div>
  );
}
