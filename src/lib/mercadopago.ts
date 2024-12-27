import { loadMercadoPago } from "@mercadopago/sdk-react";

const MP_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

if (!MP_PUBLIC_KEY) {
  throw new Error('Chave pública do Mercado Pago não encontrada');
}

export const initMercadoPago = () => {
  loadMercadoPago();
};

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};