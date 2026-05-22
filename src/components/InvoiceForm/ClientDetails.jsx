import React from 'react';
import Input from '../UI/Input';
import { useInvoice } from '../../contexts/InvoiceContext';

/**
 * Form inputs for client information
 * Fields: name, email, phone, address
 */
export default function ClientDetails() {
  const { invoice, updateClient } = useInvoice();
  const { client } = invoice;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateClient({ [name]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Client Name"
          name="name"
          value={client.name}
          onChange={handleChange}
          placeholder="Client full name"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={client.email}
          onChange={handleChange}
          placeholder="client@example.com"
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={client.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
        />
        <Input
          label="Address"
          name="address"
          value={client.address}
          onChange={handleChange}
          placeholder="Street, City, State, ZIP"
          className="md:col-span-2"
        />
      </div>
    </div>
  );
}
