import React from 'react';
import Input from '../UI/Input';
import { useInvoice } from '../../contexts/InvoiceContext';

/**
 * Form inputs for business information
 * Fields: name, email, phone, address, website, logo URL
 */
export default function BusinessDetails() {
  const { invoice, updateBusiness } = useInvoice();
  const { business } = invoice;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBusiness({ [name]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Business Name"
          name="name"
          value={business.name}
          onChange={handleChange}
          placeholder="Your business name"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={business.email}
          onChange={handleChange}
          placeholder="contact@business.com"
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={business.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
        />
        <Input
          label="Website"
          name="website"
          type="url"
          value={business.website}
          onChange={handleChange}
          placeholder="www.business.com"
        />
        <Input
          label="Logo URL"
          name="logo"
          type="url"
          value={business.logo}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
          className="md:col-span-2"
        />
        <Input
          label="Address"
          name="address"
          value={business.address}
          onChange={handleChange}
          placeholder="Street, City, State, ZIP"
          className="md:col-span-2"
        />
      </div>
    </div>
  );
}
