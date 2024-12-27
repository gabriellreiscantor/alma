import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getStripePriceId } from '../lib/stripe-config';
import { PLANS } from '../constants/plans';

export function useCheckout() {
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

      const priceId = getStripePriceId(planType);

      const { data, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          userId: user.id,
          email: user.email
        }
      });

      if (checkoutError) throw checkoutError;

      // Redireciona para a página de checkout
      navigate(`/checkout/${planType.toLowerCase()}`, {
        state: { sessionId: data.sessionId }
      });

    } catch (err: any) {
      console.error('Erro ao criar sessão:', err);
      setError('Erro ao iniciar checkout. Por favor, tente novamente.');
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