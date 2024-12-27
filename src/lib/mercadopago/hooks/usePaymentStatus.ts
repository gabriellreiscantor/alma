import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export function usePaymentStatus(preferenceId: string | null) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!preferenceId) return;

    const channel = supabase
      .channel(`payment_${preferenceId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'payments',
        filter: `preference_id=eq.${preferenceId}`,
      }, (payload) => {
        setStatus(payload.new.status);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [preferenceId]);

  useEffect(() => {
    async function checkStatus() {
      if (!preferenceId) return;

      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('preference_id', preferenceId)
          .single();

        if (error) throw error;
        if (data) setStatus(data.status);
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [preferenceId]);

  return { status, loading };
}