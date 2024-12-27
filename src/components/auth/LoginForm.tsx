import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthInput } from './AuthInput';
import { LoadingButton } from '../ui/LoadingButton';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email.trim(), password.trim());
      // O redirecionamento é feito no hook useAuth
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <AuthInput
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="seu@email.com"
        icon={<Mail className="w-5 h-5" />}
        required
      />

      <AuthInput
        id="password"
        type="password"
        label="Senha"
        value={password}
        onChange={setPassword}
        placeholder="Sua senha"
        icon={<Lock className="w-5 h-5" />}
        required
      />

      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText="Entrando..."
        className="w-full"
      >
        Entrar
      </LoadingButton>
    </form>
  );
}