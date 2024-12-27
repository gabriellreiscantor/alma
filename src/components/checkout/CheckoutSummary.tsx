import React from 'react';
import { formatPrice } from '../../lib/utils';

interface CheckoutSummaryProps {
  planName: string;
  planPrice: number;
}

export function CheckoutSummary({ planName, planPrice }: CheckoutSummaryProps) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold">{planName}</h3>
        <p className="text-sm text-gray-500">Assinatura recorrente</p>
      </div>
      <span className="text-2xl font-bold font-display">
        {formatPrice(planPrice)}
      </span>
    </div>
  );
}