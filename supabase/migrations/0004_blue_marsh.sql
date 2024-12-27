/*
  # Configuração de autenticação e perfis

  1. Ajustes
    - Adiciona campos necessários na tabela de perfis
    - Configura políticas de segurança
    - Atualiza trigger de novo usuário
*/

-- Atualiza a tabela de perfis
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamp
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Políticas de segurança adicionais
CREATE POLICY "Usuários podem ler perfis públicos"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);