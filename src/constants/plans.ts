export const PLANS = {
  TRIAL: {
    id: 'trial',
    name: 'Plano Gratuito',
    price: 0,
    period: 'Limitado'
  },
  MONTHLY: {
    id: 'monthly',
    name: 'Plano Mensal',
    price: 29.99,
    period: 'mês'
  },
  YEARLY: {
    id: 'yearly',
    name: 'Plano Anual',
    price: 99.99,
    period: 'ano'
  }
} as const;