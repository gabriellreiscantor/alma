-- Atualizar view administrativa
CREATE OR REPLACE VIEW user_details AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.last_sign_in_at,
  p.name,
  p.current_plan,
  p.plan_status,
  s.message_count,
  s.trial_end,
  s.current_period_end
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
LEFT JOIN subscriptions s ON au.id = s.user_id;

-- Adicionar novas colunas em profiles se não existirem
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'current_plan'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_plan text DEFAULT 'trial';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'plan_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_status text DEFAULT 'active';
  END IF;
END $$;

-- Criar políticas de segurança se não existirem
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Usuários podem atualizar próprio perfil'
  ) THEN
    CREATE POLICY "Usuários podem atualizar próprio perfil"
      ON profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Usuários podem atualizar própria assinatura'
  ) THEN
    CREATE POLICY "Usuários podem atualizar própria assinatura"
      ON subscriptions FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;