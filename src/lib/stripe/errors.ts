export const getStripeErrorMessage = (code: string): string => {
  const errorMessages: Record<string, string> = {
    'card_declined': 'Cartão recusado. Por favor, tente outro cartão.',
    'expired_card': 'Cartão expirado. Por favor, use um cartão válido.',
    'incorrect_cvc': 'Código CVC incorreto.',
    'processing_error': 'Erro ao processar o pagamento. Tente novamente.',
    'insufficient_funds': 'Saldo insuficiente no cartão.',
    'invalid_expiry_year': 'Ano de expiração inválido.',
    'invalid_expiry_month': 'Mês de expiração inválido.',
    'invalid_number': 'Número do cartão inválido.',
    'default': 'Ocorreu um erro ao processar o pagamento. Tente novamente.'
  };

  return errorMessages[code] || errorMessages.default;
};