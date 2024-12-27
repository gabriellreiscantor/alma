/*
  # Atualização de Segurança e Políticas

  1. Atualizações
    - Adiciona novas políticas de segurança
    - Atualiza função de novo usuário
    - Garante que todas as tabelas têm RLS ativado
  
  2. Segurança
    - Políticas atualizadas para melhor controle de acesso
    - Função de novo usuário mais robusta
*/

-- Garante que RLS está ativado
DO $$ 
BEGIN
  -- Ativa RLS nas tabelas se ainda não estiver ativo
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'subscriptions' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem ler próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ler própria assinatura" ON subscriptions;

-- Cria novas políticas
CREATE POLICY "Usuários podem ler próprio perfil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem ler própria assinatura"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Atualiza função de novo usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insere perfil apenas se não existir
  INSERT INTO profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'Usuário'))
  ON CONFLICT (id) DO NOTHING;

  -- Insere assinatura apenas se não existir
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    trial_end,
    current_period_end
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'plan', 'trial'),
    'trial',
    now() + interval '3 days',
    now() + interval '3 days'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;