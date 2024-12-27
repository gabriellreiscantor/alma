import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripe } from '../../lib/stripe';
import { STRIPE_CONFIG } from '../../lib/stripe/config';
import { CustomCheckoutForm } from './CustomCheckoutForm';

interface CheckoutWrapperProps {
  planName: string;
  planPrice: number;
  clientSecret: string;
}

export function CheckoutWrapper({ planName, planPrice, clientSecret }: CheckoutWrapperProps) {
  return (
    <Elements 
      stripe={stripe} 
      options={{
        clientSecret,
        appearance: STRIPE_CONFIG.appearance
      }}
    >
      <CustomCheckoutForm 
        planName={planName} 
        planPrice={planPrice} 
      />
    </Elements>
  );
}