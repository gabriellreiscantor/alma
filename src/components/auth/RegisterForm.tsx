import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthInput } from './AuthInput';
import { LoadingButton } from '../ui/LoadingButton';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signUp(email, password, name);
      if (result.success) {
        setSuccess(true);
        // Redireciona para a página de login após 5 segundos
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Por favor, verifique seu email e faça login após confirmar.' }
          });
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-green-600">Conta criada com sucesso!</h2>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800">
            Enviamos um email de confirmação para {email}.<br />
            Por favor, verifique sua caixa de entrada e confirme seu cadastro.
          </p>
        </div>
        <p className="text-gray-600">
          Você será redirecionado para a página de login em alguns segundos...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <AuthInput
        id="name"
        type="text"
        label="Nome completo"
        value={name}
        onChange={setName}
        placeholder="Seu nome completo"
        icon={<User className="w-5 h-5" />}
        required
      />

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
        placeholder="Mínimo 6 caracteres"
        icon={<Lock className="w-5 h-5" />}
        required
      />

      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText="Criando conta..."
        className="w-full"
      >
        Criar conta
      </LoadingButton>
    </form>
  );
}