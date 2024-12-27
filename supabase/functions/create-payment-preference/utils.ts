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