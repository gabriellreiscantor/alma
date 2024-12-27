import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useTrialPeriod() {
  const navigate = useNavigate();
  const [isTrialActive, setIsTrialActive] = useState(true);

  useEffect(() => {
    const checkTrialStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { trial_end } = user.user_metadata;
      
      if (trial_end) {
        const trialEndDate = new Date(trial_end);
        const now = new Date();

        if (now > trialEndDate) {
          setIsTrialActive(false);
          navigate('/planos');
        }
      }
    };

    const interval = setInterval(checkTrialStatus, 60000); // Verifica a cada minuto
    checkTrialStatus();

    return () => clearInterval(interval);
  }, [navigate]);

  return { isTrialActive };
}