export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

export function getPlanPrice(planId: string): number {
  const prices = {
    monthly: 29.99,
    yearly: 99.99
  };
  return prices[planId.toLowerCase()] || 0;
}

export function getPlanTitle(planId: string): string {
  return planId.toLowerCase() === 'monthly' ? 'Plano Mensal' : 'Plano Anual';
}