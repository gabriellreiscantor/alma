import React, { useEffect, useState } from 'react';
import { Payment } from '@mercadopago/sdk-react';
import { LoadingScreen } from '../LoadingScreen';
import { ErrorMessage } from './ErrorMessage';
import { PaymentSummary } from './PaymentSummary';
import { usePayment } from '../../lib/mercadopago/hooks/usePayment';

interface MercadoPagoCheckoutProps {
  planId: string;
  planName: string;
  planPrice: number;
}

export function MercadoPagoCheckout({ planId, planName, planPrice }: MercadoPagoCheckoutProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const { loading, error, createPayment } = usePayment();

  useEffect(() => {
    async function initPayment() {
      const id = await createPayment(planId);
      if (id) setPreferenceId(id);
    }

    initPayment();
  }, [planId, createPayment]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!preferenceId) return <ErrorMessage message="Erro ao iniciar pagamento" />;

  return (
    <div className="max-w-md mx-auto">
      <PaymentSummary planName={planName} planPrice={planPrice} />
      
      <Payment
        initialization={{ preferenceId }}
        customization={{ 
          paymentMethods: { 
            maxInstallments: 12 
          },
          visual: {
            style: {
              theme: 'default',
              customVariables: {
                formBackgroundColor: '#ffffff',
                baseColor: '#7C3AED'
              }
            }
          }
        }}
      />
    </div>
  );
}