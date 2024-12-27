/*
  # Atualização do plano trial para limite de mensagens

  1. Alterações
    - Adiciona coluna message_count na tabela subscriptions
    - Atualiza função handle_new_user para inicializar message_count
    - Adiciona função para verificar limite de mensagens

  2. Segurança
    - Mantém as políticas RLS existentes
*/

-- Adiciona coluna de contagem de mensagens
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS message_count integer DEFAULT 0;

-- Função para verificar limite de mensagens
CREATE OR REPLACE FUNCTION check_message_limit()
RETURNS trigger AS $$
BEGIN
  -- Apenas verifica mensagens do usuário (não do bot)
  IF NEW.type = 'user' THEN
    -- Verifica se o usuário está no plano trial e atingiu o limite
    IF EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = NEW.user_id 
      AND plan = 'trial' 
      AND message_count >= 10
    ) THEN
      RAISE EXCEPTION 'Limite de mensagens do plano gratuito atingido';
    END IF;

    -- Incrementa o contador de mensagens
    UPDATE subscriptions 
    SET message_count = message_count + 1
    WHERE user_id = NEW.user_id AND plan = 'trial';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria trigger para verificar limite antes de inserir mensagem
DROP TRIGGER IF EXISTS check_message_limit_trigger ON messages;
CREATE TRIGGER check_message_limit_trigger
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION check_message_limit();

-- Atualiza a função handle_new_user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insere perfil
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário')
  );

  -- Insere assinatura com contador zerado
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    message_count
  )
  VALUES (
    new.id,
    'trial',
    'trial',
    0
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;