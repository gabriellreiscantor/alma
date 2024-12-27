import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingButton } from '../components/ui/LoadingButton';
import { AuthInput } from '../components/auth/AuthInput';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage('Link para redefinição de senha enviado! Verifique seu email.');
      setTimeout(() => navigate('/login'), 5000);
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
          Recuperar senha
        </h2>
        <p className="text-gray-600">
          Digite seu email para receber um link de recuperação
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {message}
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

        <LoadingButton
          type="submit"
          isLoading={loading}
          loadingText="Enviando..."
          className="w-full"
        >
          Enviar link de recuperação
        </LoadingButton>
      </form>
    </div>
  );
}