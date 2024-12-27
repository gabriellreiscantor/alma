import React from 'react';
import { formatPrice } from '../../lib/mercadopago/utils';

interface PaymentSummaryProps {
  planName: string;
  planPrice: number;
}

export function PaymentSummary({ planName, planPrice }: PaymentSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{planName}</h2>
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <span className="text-gray-600">Total:</span>
        <span className="text-2xl font-bold font-display">
          {formatPrice(planPrice)}
        </span>
      </div>
    </div>
  );
}