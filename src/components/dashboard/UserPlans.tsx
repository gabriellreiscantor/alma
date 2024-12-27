import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface UserPlansProps {
  currentPlan: string;
  status: string;
  messageCount?: number;
}

export function UserPlans({ currentPlan, status, messageCount = 0 }: UserPlansProps) {
  const navigate = useNavigate();
  const remainingMessages = 10 - messageCount;

  const handlePlanSelect = (planType: 'monthly' | 'yearly') => {
    // Navega diretamente para a página de checkout do plano selecionado
    navigate(`/checkout/${planType}`, { replace: true });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display">Seu Plano</h2>
        {status === 'trial' && (
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
            {remainingMessages} mensagens restantes
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plano Gratuito */}
        <div className={`bg-white rounded-xl shadow-lg p-6 ${currentPlan === 'trial' ? 'ring-2 ring-purple-600' : ''}`}>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Plano Gratuito</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold font-display">R$ 0</span>
              <span className="text-gray-600">/Limitado</span>
            </div>
            <p className="text-gray-600">Experimente o Almma com 10 mensagens gratuitas!</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Acesso ao chatbot</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>10 mensagens gratuitas</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Suporte básico</span>
            </li>
          </ul>

          {currentPlan === 'trial' && (
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-purple-700 text-sm">
                Você já utilizou {messageCount} de 10 mensagens disponíveis.
              </p>
            </div>
          )}
        </div>

        {/* Plano Mensal */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Plano Mensal</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold font-display">{formatPrice(29.99)}</span>
              <span className="text-gray-600">/mês</span>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Acesso completo ao chatbot</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Conversas ilimitadas</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Suporte prioritário</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Histórico de conversas</span>
            </li>
          </ul>

          <button
            onClick={() => handlePlanSelect('monthly')}
            className="w-full px-6 py-3 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold transition-all"
          >
            Assinar Agora
          </button>
        </div>

        {/* Plano Anual */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm">
            Mais Popular
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Plano Anual</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold font-display">{formatPrice(99.99)}</span>
              <span className="text-gray-600">/ano</span>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Acesso completo ao chatbot</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Conversas ilimitadas</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Suporte VIP</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Histórico de conversas</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Conversa por voz</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Desconto de 30%</span>
            </li>
          </ul>

          <button
            onClick={() => handlePlanSelect('yearly')}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 font-semibold transition-all"
          >
            Assinar Agora
          </button>
        </div>
      </div>
    </div>
  );
}