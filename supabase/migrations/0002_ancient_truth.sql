/*
  # Atualização do sistema de assinaturas

  1. Alterações
    - Adiciona coluna `email_confirmed` na tabela profiles
    - Atualiza a tabela subscriptions com novas colunas
    - Atualiza a função handle_new_user
*/

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_confirmed boolean DEFAULT false;

-- Atualizar função de novo usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_plan text;
  trial_duration interval;
BEGIN
  -- Pegar o plano dos metadados do usuário
  user_plan := COALESCE(new.raw_user_meta_data->>'plan', 'trial');
  
  -- Definir duração do trial
  trial_duration := CASE 
    WHEN user_plan = 'trial' THEN interval '3 days'
    ELSE interval '0'
  END;

  -- Criar perfil
  INSERT INTO profiles (id, name, email_confirmed)
  VALUES (new.id, new.raw_user_meta_data->>'name', false);

  -- Criar assinatura
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    trial_end,
    current_period_end
  )
  VALUES (
    new.id,
    user_plan,
    CASE 
      WHEN user_plan = 'trial' THEN 'trial'
      ELSE 'pending'
    END,
    CASE 
      WHEN user_plan = 'trial' THEN now() + trial_duration
      ELSE null
    END,
    CASE 
      WHEN user_plan = 'trial' THEN now() + trial_duration
      ELSE null
    END
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;