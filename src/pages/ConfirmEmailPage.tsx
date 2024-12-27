import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves } from 'lucide-react';

export function ConfirmEmailPage() {
  const [status, setStatus] = useState('verificando');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center mb-6">
            <Waves className="w-8 h-8 text-white wave-icon" />
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-4 font-display">
            Email Confirmado!
          </h2>
          
          <p className="text-center text-gray-600 mb-8">
            Sua conta foi verificada com sucesso. Você será redirecionado para a página de login em alguns segundos...
          </p>
          
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    </div>
  );
}