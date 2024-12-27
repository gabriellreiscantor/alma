/*
  # Password Reset Flow Configuration
  
  1. Changes
    - Creates password_resets table to track reset attempts
    - Adds expiration handling
    - Adds security policies
  
  2. Security
    - Enables RLS
    - Adds appropriate policies
*/

-- Create password resets table
CREATE TABLE IF NOT EXISTS password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  token uuid DEFAULT gen_random_uuid(),
  expires_at timestamptz DEFAULT (now() + interval '1 hour'),
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  CONSTRAINT one_active_token_per_user UNIQUE (user_id, token)
);

-- Enable RLS
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own reset tokens"
  ON password_resets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create password reset token
CREATE OR REPLACE FUNCTION create_password_reset_token(user_uuid uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reset_token uuid;
BEGIN
  -- Invalidate any existing tokens
  UPDATE password_resets
  SET used_at = now()
  WHERE user_id = user_uuid
  AND used_at IS NULL;

  -- Create new token
  INSERT INTO password_resets (user_id)
  VALUES (user_uuid)
  RETURNING token INTO reset_token;

  RETURN reset_token;
END;
$$;

-- Function to validate reset token
CREATE OR REPLACE FUNCTION validate_reset_token(token_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM password_resets
    WHERE token = token_uuid
    AND used_at IS NULL
    AND expires_at > now()
  );
END;
$$;