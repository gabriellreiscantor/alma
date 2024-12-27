import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, CheckCircle, Mail } from 'lucide-react';

export function RegisterSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', { 
        state: { 
          message: 'Por favor, faça login após confirmar seu email.' 
        }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Conta criada com sucesso!</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Mail className="w-5 h-5" />
          <span className="font-medium">Verifique seu email</span>
        </div>
        <p className="text-blue-700 text-sm">
          Enviamos um link de confirmação para seu email. 
          Por favor, verifique sua caixa de entrada e confirme seu cadastro 
          antes de fazer login.
        </p>
      </div>

      <p className="text-gray-600">
        Você será redirecionado para a página de login em alguns segundos...
      </p>

      <div className="animate-pulse">
        <Waves className="w-8 h-8 text-purple-600 mx-auto" />
      </div>
    </div>
  );
}