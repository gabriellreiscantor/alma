-- Função para atualizar status do pagamento
CREATE OR REPLACE FUNCTION update_payment_status()
RETURNS trigger AS $$
BEGIN
  -- Atualiza o plano do usuário quando o pagamento é aprovado
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE profiles
    SET 
      current_plan = CASE 
        WHEN NEW.amount >= 99 THEN 'yearly'
        ELSE 'monthly'
      END,
      plan_status = 'active'
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar status
DROP TRIGGER IF EXISTS on_payment_status_update ON payments;
CREATE TRIGGER on_payment_status_update
  AFTER UPDATE OF status ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_status();