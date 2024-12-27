import React from 'react';
import { PaymentStatus } from '../components/checkout/PaymentStatus';

export function PaymentSuccessPage() {
  return (
    <PaymentStatus 
      status="success"
      message="Obrigado por assinar nosso plano!"
    />
  );
}