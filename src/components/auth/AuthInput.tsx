import React from 'react';

interface AuthInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export function AuthInput({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
  icon,
  required
}: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
        {icon && (
          <span className="absolute left-3 top-2.5 text-gray-400">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}