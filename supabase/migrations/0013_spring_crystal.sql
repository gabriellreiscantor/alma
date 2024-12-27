-- Simplifica a função handle_new_user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insere perfil
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário')
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garante que a tabela profiles existe com a estrutura correta
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Garante que RLS está ativo
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recria as políticas de segurança
DROP POLICY IF EXISTS "Usuários podem ler próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem ler próprio perfil"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);