import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useUserFlow() {
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSurveyStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: responses } = await supabase
          .from('survey_responses')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        setHasCompletedSurvey(responses && responses.length > 0);
      } catch (error) {
        console.error('Erro ao verificar status do questionário:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSurveyStatus();
  }, []);

  const handleUserFlow = (destination: string) => {
    if (loading) return true;

    // Se não completou o questionário, salva o destino e redireciona
    if (hasCompletedSurvey === false) {
      localStorage.setItem('redirectAfterSurvey', destination);
      navigate('/survey/1');
      return true;
    }

    return false;
  };

  return {
    hasCompletedSurvey,
    loading,
    handleUserFlow
  };
}