// IDs dos preços no Stripe
export const STRIPE_PRICES = {
  MONTHLY: 'price_1QaFZJKpk2GcIUslDN69DraE',
  YEARLY: 'price_1QaFZXKpk2GcIUslQ9zVMbk5'
} as const;

export const PAYMENT_METHODS = ['card', 'pix'] as const;

// Configuração de aparência do Stripe
export const STRIPE_CONFIG = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#7C3AED',
      colorBackground: '#ffffff',
      borderRadius: '12px'
    }
  }
} as const;

// Função auxiliar para formatar preços
export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};