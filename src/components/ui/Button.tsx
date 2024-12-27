import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full font-semibold transition-all duration-200',
        {
          'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90': variant === 'primary',
          'bg-white text-purple-600 hover:bg-white/90': variant === 'secondary',
          'border-2 border-purple-600 text-purple-600 hover:bg-purple-50': variant === 'outline',
        },
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}