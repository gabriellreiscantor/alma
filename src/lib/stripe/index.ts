import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from './config';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  throw new Error('Chave pública do Stripe não encontrada');
}

export const stripe = loadStripe(stripePublicKey);
export * from './config';
export * from './utils';