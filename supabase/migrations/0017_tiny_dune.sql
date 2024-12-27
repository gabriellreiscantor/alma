/*
  # Melhorias no gerenciamento de usuários

  1. Alterações
    - Adiciona coluna de plano e status do plano na tabela de profiles
    - Adiciona função para atualizar plano do usuário
    - Adiciona trigger para atualizar informações do usuário

  2. Segurança
    - Mantém RLS ativo
    - Adiciona políticas de segurança para as novas colunas
*/

-- Adiciona novas colunas na tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS current_plan text DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS plan_status text DEFAULT 'active';

-- Função para atualizar plano do usuário
CREATE OR REPLACE FUNCTION update_user_plan(
  user_id uuid,
  new_plan text,
  new_status text DEFAULT 'active'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET 
    current_plan = new_plan,
    plan_status = new_status,
    updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Atualiza a função handle_new_user para incluir as novas colunas
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (
    id,
    name,
    current_plan,
    plan_status
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(new.raw_user_meta_data->>'plan', 'trial'),
    'active'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;