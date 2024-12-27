import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { STRIPE_PRICES } from '../lib/stripe-config';

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscription = async (planType: keyof typeof STRIPE_PRICES) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error: stripeError } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId: STRIPE_PRICES[planType],
          userId: user.id,
          email: user.email
        }
      });

      if (stripeError) throw stripeError;

      if (data?.sessionId) {
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      } else {
        throw new Error('Sessão de checkout não criada');
      }

    } catch (err: any) {
      console.error('Erro no checkout:', err);
      setError('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSubscription
  };
}