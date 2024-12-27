import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareWarning } from 'lucide-react';

export function MessageLimitOverlay() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <MessageSquareWarning className="w-8 h-8 text-purple-600" />
          </div>
          
          <h2 className="text-2xl font-bold font-display">Limite Atingido</h2>
          
          <p className="text-gray-600">
            Você utilizou todas as suas 10 mensagens gratuitas! Para continuar conversando, 
            escolha um de nossos planos premium e aproveite conversas ilimitadas.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Ver Planos Disponíveis
          </button>
        </div>
      </div>
    </div>
  );
}