import { initMercadoPago as initMP } from "@mercadopago/sdk-react";

const MP_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

if (!MP_PUBLIC_KEY) {
  throw new Error('Chave pública do Mercado Pago não encontrada');
}

export const MP_CONFIG = {
  publicKey: MP_PUBLIC_KEY,
  installments: {
    max: 12,
    defaultPaymentMethod: 'credit_card'
  }
} as const;

export function initMercadoPago() {
  initMP(MP_CONFIG.publicKey);
}