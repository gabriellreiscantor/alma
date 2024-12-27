import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PLANS } from '../constants/plans';
import { MercadoPagoCheckout } from '../components/checkout/MercadoPagoCheckout';

export function CheckoutPage() {
  const { planId } = useParams();
  const navigate = useNavigate();

  if (!planId || !PLANS[planId.toUpperCase() as keyof typeof PLANS]) {
    navigate('/');
    return null;
  }

  const plan = PLANS[planId.toUpperCase() as keyof typeof PLANS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 font-display">Finalizar Assinatura</h1>
        <MercadoPagoCheckout
          planId={planId}
          planName={plan.name}
          planPrice={plan.price}
        />
      </div>
    </div>
  );
}