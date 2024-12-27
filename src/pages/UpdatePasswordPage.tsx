import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingButton } from '../components/ui/LoadingButton';
import { AuthInput } from '../components/auth/AuthInput';

export function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      navigate('/login', {
        state: { message: 'Senha atualizada com sucesso! Faça login com sua nova senha.' }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Nova senha
        </h2>
        <p className="text-gray-600">
          Digite sua nova senha
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <AuthInput
          id="password"
          type="password"
          label="Nova senha"
          value={password}
          onChange={setPassword}
          placeholder="Mínimo 6 caracteres"
          icon={<Lock className="w-5 h-5" />}
          required
        />

        <AuthInput
          id="confirmPassword"
          type="password"
          label="Confirme a nova senha"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Digite a senha novamente"
          icon={<Lock className="w-5 h-5" />}
          required
        />

        <LoadingButton
          type="submit"
          isLoading={loading}
          loadingText="Atualizando..."
          className="w-full"
        >
          Atualizar senha
        </LoadingButton>
      </form>
    </div>
  );
}