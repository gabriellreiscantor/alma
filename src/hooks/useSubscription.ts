import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Subscription {
  plan: string;
  status: string;
  trial_end?: string;
  current_period_end?: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        // Get all subscriptions for the user
        const { data: subscriptions, error: fetchError } = await supabase
          .from('subscriptions')
          .select('plan, status, trial_end, current_period_end')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;

        // Use the most recent subscription or create a new one
        if (!subscriptions?.length && isMounted) {
          // Create default trial subscription
          const { data: newSub, error: insertError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              plan: 'trial',
              status: 'trial',
              trial_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              current_period_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select()
            .single();

          if (insertError) throw insertError;
          
          if (isMounted) {
            setSubscription(newSub);
          }
        } else if (isMounted && subscriptions?.length) {
          setSubscription(subscriptions[0]);
        }
      } catch (err: any) {
        console.error('Erro ao carregar assinatura:', err);
        if (isMounted) {
          setError(err.message);
          // Set default subscription state on error
          setSubscription({
            plan: 'trial',
            status: 'trial',
            trial_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            current_period_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSubscription();

    return () => {
      isMounted = false;
    };
  }, []);

  return { subscription, loading, error };
}