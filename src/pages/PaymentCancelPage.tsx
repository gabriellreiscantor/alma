import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Cancelado
        </h2>
        
        <p className="text-gray-600 mb-8">
          O processo de pagamento foi cancelado. Se você tiver alguma dúvida, entre em contato com nosso suporte.
        </p>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full hover:opacity-90 transition-all"
        >
          Voltar para Dashboard
        </button>
      </div>
    </div>
  );
}