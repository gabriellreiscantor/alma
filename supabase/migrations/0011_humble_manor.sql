/*
  # Corrigir políticas RLS para subscriptions

  1. Alterações
    - Adiciona política para permitir inserção de assinaturas
    - Atualiza política de leitura existente
  
  2. Segurança
    - Mantém RLS ativo
    - Garante que usuários só podem manipular suas próprias assinaturas
*/

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem ler própria assinatura" ON subscriptions;
DROP POLICY IF EXISTS "Usuários podem inserir própria assinatura" ON subscriptions;

-- Cria novas políticas
CREATE POLICY "Usuários podem ler própria assinatura"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir própria assinatura"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Garante que RLS está ativo
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;