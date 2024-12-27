import React from 'react';
import { PaymentStatus } from '../components/checkout/PaymentStatus';

export function PaymentErrorPage() {
  return (
    <PaymentStatus 
      status="error"
      message="Houve um erro ao processar o pagamento."
    />
  );
}