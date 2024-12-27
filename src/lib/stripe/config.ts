import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  throw new Error('Chave pública do Stripe não encontrada');
}

export const STRIPE_CONFIG = {
  prices: {
    MONTHLY: 'price_1QaFZJKpk2GcIUslDN69DraE',
    YEARLY: 'price_1QaFZXKpk2GcIUslQ9zVMbk5'
  },
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#7C3AED',
      colorBackground: '#ffffff',
      borderRadius: '12px'
    }
  }
} as const;

export const stripe = loadStripe(stripePublicKey);