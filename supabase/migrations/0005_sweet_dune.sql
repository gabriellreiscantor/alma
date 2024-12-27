/*
  # Configuração inicial das tabelas

  1. Novas Tabelas
    - Garante que todas as tabelas necessárias existam
    - Adiciona índices para melhor performance
  
  2. Segurança
    - Configura políticas RLS
    - Atualiza funções de trigger
*/

-- Verifica e cria tabela de mensagens se não existir
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilita RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para mensagens
CREATE POLICY "Usuários podem ler suas próprias mensagens"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias mensagens"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id 
ON messages (user_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at 
ON messages (created_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();