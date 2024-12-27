/*
  # Fix user registration and message handling

  1. Changes
    - Simplify handle_new_user function
    - Update messages table structure
    - Add message count functionality
    - Update security policies

  2. Security
    - Maintain RLS on all tables
    - Update policies for messages table
*/

-- Simplifica a função handle_new_user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insere apenas o perfil do usuário
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário')
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garante que a tabela messages existe com a estrutura correta
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    CREATE TABLE messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      content text NOT NULL,
      type text NOT NULL DEFAULT 'user',
      created_at timestamptz DEFAULT now()
    );

    -- Habilita RLS para messages
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Remove políticas existentes e cria novas
DO $$ 
BEGIN
  -- Remove políticas existentes se existirem
  DROP POLICY IF EXISTS "Usuários podem ler suas próprias mensagens" ON messages;
  DROP POLICY IF EXISTS "Usuários podem criar suas próprias mensagens" ON messages;
  
  -- Cria novas políticas
  CREATE POLICY "users_can_read_own_messages"
    ON messages FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "users_can_create_own_messages"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
END $$;

-- Cria função para contar mensagens
CREATE OR REPLACE FUNCTION get_user_message_count(user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM messages
    WHERE user_id = user_uuid
    AND type = 'user'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;