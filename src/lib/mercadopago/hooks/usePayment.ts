import { useState } from 'react';
import { supabase } from '../../supabase';
import { getPlanPrice, getPlanTitle } from '../utils';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (planId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const amount = getPlanPrice(planId);
      const title = getPlanTitle(planId);

      const { data, error: prefError } = await supabase.functions.invoke('create-payment-preference', {
        body: { 
          planId,
          userId: user.id,
          email: user.email,
          amount,
          title
        }
      });

      if (prefError) throw prefError;
      if (!data?.preferenceId) throw new Error('ID de preferência não gerado');

      // Registra o pagamento no banco
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          preference_id: data.preferenceId,
          amount
        });

      if (paymentError) throw paymentError;

      return data.preferenceId;

    } catch (err: any) {
      console.error('Erro ao criar pagamento:', err);
      setError(err.message || 'Erro ao iniciar pagamento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPayment
  };
}