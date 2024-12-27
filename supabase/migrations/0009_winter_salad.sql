/*
  # Correção das políticas de autenticação
  
  1. Adiciona política para permitir criação de usuários
  2. Simplifica trigger de novo usuário
  3. Garante permissões corretas
*/

-- Permite criação de novos usuários
CREATE POLICY "Permitir criação de usuários"
ON auth.users
FOR INSERT
WITH CHECK (true);

-- Simplifica função de novo usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;