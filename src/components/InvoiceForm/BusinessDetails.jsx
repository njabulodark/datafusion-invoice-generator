import React from 'react';
import Input from '../UI/Input';
import { useInvoiceContext } from '../../contexts/InvoiceContext';

export default function BusinessDetails() {
  const { invoice, dispatch } = useInvoiceContext();

  const handleChange = (field) => (e) => {
    dispatch({ type: 'SET_BUSINESS', payload: { [field]: e.target.value } });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: 'SET_BUSINESS', payload: { logo: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      <Input
        label="Business Name"
        value={invoice.business.name}
        onChange={handleChange('name')}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Email"
          type="email"
          value={invoice.business.email}
          onChange={handleChange('email')}
        />
        <Input
          label="Phone"
          type="tel"
          value={invoice.business.phone}
          onChange={handleChange('phone')}
        />
      </div>

      <Input
        label="Address"
        value={invoice.business.address}
        onChange={handleChange('address')}
      />

      <Input
        label="Website"
        value={invoice.business.website}
        onChange={handleChange('website')}
      />

      <div>
        <label className="text-sm font-medium text-gray-700">Logo</label>
        <div className="mt-1 flex items-center gap-3">
          {invoice.business.logo && (
            <img src={invoice.business.logo} alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded shrink-0" />
          )}
          <label className="cursor-pointer px-3 py-2.5 text-sm text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 active:bg-primary-100 min-h-[44px] flex items-center">
            Upload Logo
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}