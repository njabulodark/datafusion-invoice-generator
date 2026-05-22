import React from 'react';

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 border border-transparent',
};

/**
 * Reusable Button component with variants
 * @param {object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'} props.variant - Button style
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 */
export default function Button({
  variant = 'primary',
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
