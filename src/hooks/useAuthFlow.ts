import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useAuthFlow() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Verifica se o usuário já completou o questionário
        const { data: responses } = await supabase
          .from('survey_responses')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);

        if (!responses?.length) {
          // Se não completou o questionário, redireciona para ele
          navigate('/survey/1');
        } else {
          // Se já completou, redireciona para o dashboard
          navigate('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
}