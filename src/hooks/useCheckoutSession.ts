import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PLANS } from '../constants/plans';

export function useCheckoutSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createCheckoutSession = async (planType: keyof typeof PLANS) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Chama a função do Supabase para criar a sessão do Stripe
      const { data, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          planId: planType,
          userId: user.id,
          email: user.email,
          returnUrl: `${window.location.origin}/payment/success`
        }
      });

      if (checkoutError) {
        throw new Error('Erro ao criar sessão de checkout');
      }

      if (!data?.url) {
        throw new Error('URL de checkout não gerada');
      }

      // Redireciona para o Stripe Checkout
      window.location.href = data.url;

    } catch (err: any) {
      console.error('Erro ao criar sessão:', err);
      setError(err.message || 'Erro ao iniciar checkout');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createCheckoutSession
  };
}