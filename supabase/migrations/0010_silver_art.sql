/*
  # Criação da tabela de respostas da pesquisa inicial

  1. Nova Tabela
    - `survey_responses`
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência ao usuário)
      - `question` (texto da pergunta)
      - `answer` (resposta selecionada)
      - `created_at` (timestamp)

  2. Segurança
    - Habilita RLS
    - Adiciona políticas para leitura e escrita
*/

CREATE TABLE survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilita RLS
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ler suas próprias respostas"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias respostas"
  ON survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Índice para melhor performance
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);