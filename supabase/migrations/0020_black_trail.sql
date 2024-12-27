/*
  # Configuração de Pagamentos

  1. Nova Tabela
    - `payments`
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência a auth.users)
      - `preference_id` (texto, ID da preferência do MP)
      - `status` (texto)
      - `amount` (decimal)
      - `created_at` (timestamp)
  
  2. Segurança
    - Habilita RLS na tabela payments
    - Adiciona políticas para leitura e inserção
*/

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  preference_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilita RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seus próprios pagamentos"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar pagamentos"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_preference_id ON payments(preference_id);