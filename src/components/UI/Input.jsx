import React from 'react';

/**
 * Reusable Input component with label and error support
 * @param {object} props
 * @param {string} props.label - Input label text
 * @param {string} props.error - Error message to display
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.type - Input type (text, email, number, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field indicator
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 */
export default function Input({
  label,
  error,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error
            ? 'border-red-300 bg-red-50 placeholder-red-300'
            : 'border-gray-300 bg-white'
        } ${className}`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
