import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { cpf } from 'cpf-cnpj-validator';
import { LoadingButton } from '../ui/LoadingButton';
import { formatPrice } from '../../lib/stripe/utils';
import { getStripeErrorMessage } from '../../lib/stripe/errors';
import { ErrorMessage } from './ErrorMessage';
import { Input } from '../ui/Input';

interface CustomCheckoutFormProps {
  planName: string;
  planPrice: number;
}

export function CustomCheckoutForm({ planName, planPrice }: CustomCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!cpf.isValid(formData.cpf)) {
      setError('CPF inválido');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: formData.name,
              tax_id: formData.cpf.replace(/\D/g, '')
            }
          }
        }
      });

      if (confirmError) {
        throw confirmError;
      }
    } catch (err: any) {
      console.error('Erro no pagamento:', err);
      setError(getStripeErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleCPFChange = (value: string) => {
    let formattedCPF = value.replace(/\D/g, '');
    if (formattedCPF.length <= 11) {
      formattedCPF = formattedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setFormData(prev => ({ ...prev, cpf: formattedCPF }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold">{planName}</h3>
            <p className="text-sm text-gray-500">Assinatura recorrente</p>
          </div>
          <span className="text-2xl font-bold font-display">
            {formatPrice(planPrice)}
          </span>
        </div>

        <div className="space-y-4">
          <Input
            label="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Digite seu nome completo"
            required
          />

          <Input
            label="CPF"
            value={formData.cpf}
            onChange={(e) => handleCPFChange(e.target.value)}
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div className="pt-4">
          <PaymentElement />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <LoadingButton
        type="submit"
        isLoading={loading}
        loadingText="Processando..."
        disabled={!stripe || !formData.name || !formData.cpf}
        className="w-full"
      >
        Finalizar Assinatura
      </LoadingButton>
    </form>
  );
}