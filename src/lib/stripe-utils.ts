import { PLANS } from '../constants/plans';

export const STRIPE_PRICES = {
  MONTHLY: 'price_1QaFZJKpk2GcIUslDN69DraE', // ID do plano mensal
  YEARLY: 'price_1QaFZXKpk2GcIUslQ9zVMbk5'   // ID do plano anual
} as const;

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const getPlanDetails = (planType: keyof typeof PLANS) => {
  return {
    priceId: STRIPE_PRICES[planType],
    ...PLANS[planType]
  };
};