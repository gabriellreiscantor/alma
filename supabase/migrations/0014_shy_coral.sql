-- Desabilita confirmação de email para desenvolvimento
ALTER TABLE auth.users ALTER COLUMN email_confirmed_at SET DEFAULT NOW();

-- Atualiza usuários existentes
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;