import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export function Input({ className, icon, error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          className={cn(
            'w-full px-3 py-2 pl-10 border rounded-lg shadow-sm',
            'placeholder-gray-400 focus:outline-none focus:ring-2',
            'focus:ring-purple-500 focus:border-purple-500',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {icon && (
          <span className="absolute left-3 top-2.5 text-gray-400">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}