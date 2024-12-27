/*
  # Configuração das Mensagens do Chat

  1. Alterações
    - Adiciona coluna `type` na tabela messages para diferenciar mensagens do usuário e do bot
    - Adiciona coluna `response_to` para relacionar respostas
    - Atualiza políticas de segurança

  2. Índices
    - Adiciona índice para melhorar performance de consultas
*/

-- Adiciona novas colunas se não existirem
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'user',
ADD COLUMN IF NOT EXISTS response_to uuid REFERENCES messages(id);

-- Atualiza ou cria índice
CREATE INDEX IF NOT EXISTS idx_messages_type_user_id 
ON messages (type, user_id);

-- Atualiza política existente
DROP POLICY IF EXISTS "Usuários podem ler suas próprias mensagens" ON messages;
CREATE POLICY "Usuários podem ler suas próprias mensagens"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para inserção
DROP POLICY IF EXISTS "Usuários podem criar suas próprias mensagens" ON messages;
CREATE POLICY "Usuários podem criar suas próprias mensagens"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  (type = 'user' OR type = 'bot')
);