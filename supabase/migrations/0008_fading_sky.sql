/*
  # Correção do tratamento de novos usuários
  
  1. Simplifica a função handle_new_user
  2. Garante que as tabelas necessárias existem
  3. Atualiza as políticas de segurança
*/

-- Recria a tabela profiles se necessário
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recria a tabela subscriptions se necessário
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan text NOT NULL DEFAULT 'trial',
  status text NOT NULL DEFAULT 'trial',
  trial_end timestamptz DEFAULT (now() + interval '3 days'),
  current_period_end timestamptz DEFAULT (now() + interval '3 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Garante que RLS está ativado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Recria a função handle_new_user simplificada
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário')
  );

  INSERT INTO subscriptions (user_id, plan)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'plan', 'trial')
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recria o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Recria as políticas básicas
DROP POLICY IF EXISTS "Usuários podem ler próprio perfil" ON profiles;
CREATE POLICY "Usuários podem ler próprio perfil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem ler própria assinatura" ON subscriptions;
CREATE POLICY "Usuários podem ler própria assinatura"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);