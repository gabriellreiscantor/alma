import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  isLoading,
  loadingText = 'Aguarde...',
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={cn(
        "flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium",
        "text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
          {loadingText}
        </div>
      ) : children}
    </button>
  );
}