/*
  # Ajustes na estrutura de autenticação

  1. Alterações
    - Adiciona índice para melhor performance em consultas por email
    - Atualiza trigger para melhor tratamento de erros
*/

-- Adiciona índice para email
CREATE INDEX IF NOT EXISTS idx_auth_users_email 
ON auth.users (email);

-- Atualiza a função de tratamento de novo usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Inserir perfil com validação
  INSERT INTO profiles (id, name, email_confirmed)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
    false
  )
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;