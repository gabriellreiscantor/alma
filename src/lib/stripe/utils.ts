import { PLANS } from '../../constants/plans';

export const getStripePriceId = (planType: string): string => {
  const prices = {
    monthly: 'price_1QaFZJKpk2GcIUslDN69DraE',
    yearly: 'price_1QaFZXKpk2GcIUslQ9zVMbk5'
  };
  
  const id = prices[planType.toLowerCase()];
  if (!id) {
    throw new Error(`Tipo de plano inválido: ${planType}`);
  }
  
  return id;
};

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};