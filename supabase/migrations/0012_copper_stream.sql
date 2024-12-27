/*
  # Fix subscription system

  1. Changes
    - Add update policy for subscriptions
    - Add missing indexes
    - Update handle_new_user function
  
  2. Security
    - Maintain RLS
    - Ensure proper user access control
*/

-- Remove existing policies
DROP POLICY IF EXISTS "Usuários podem ler própria assinatura" ON subscriptions;
DROP POLICY IF EXISTS "Usuários podem inserir própria assinatura" ON subscriptions;
DROP POLICY IF EXISTS "Usuários podem atualizar própria assinatura" ON subscriptions;

-- Create comprehensive policies
CREATE POLICY "Usuários podem ler própria assinatura"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir própria assinatura"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar própria assinatura"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert profile
  INSERT INTO profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert subscription with trial
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    trial_end,
    current_period_end
  )
  VALUES (
    new.id,
    'trial',
    'trial',
    now() + interval '3 days',
    now() + interval '3 days'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;