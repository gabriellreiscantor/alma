import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PLANS } from '../constants/plans';
import { formatPrice } from '../lib/utils';

export function Plans() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = (planType: keyof typeof PLANS) => {
    if (planType === 'TRIAL') {
      localStorage.setItem('selectedPlan', 'trial');
      navigate('/register');
      return;
    }

    const checkoutPath = `/checkout/${planType.toLowerCase()}`;
    
    if (!user) {
      // Se não estiver autenticado, redireciona para login com a URL de retorno
      navigate('/login', { 
        state: { from: { pathname: checkoutPath } }
      });
    } else {
      // Se estiver autenticado, vai direto para o checkout
      navigate(checkoutPath);
    }
  };

  return (
    <section className="py-24 px-4">
      <h2 className="text-4xl font-bold text-center mb-16 font-display">Escolha seu plano</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div
            key={plan.id}
            className={`
              relative bg-white rounded-2xl shadow-xl p-8
              ${key === 'YEARLY' ? 'ring-2 ring-purple-600 scale-105' : ''}
            `}
          >
            {key === 'YEARLY' && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm">
                Mais Popular
              </span>
            )}
            <h3 className="text-2xl font-bold mb-4 font-display">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold price-text">
                {formatPrice(plan.price)}
              </span>
              <span className="text-gray-500">/{plan.period}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {getPlanFeatures(key as keyof typeof PLANS).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick(key as keyof typeof PLANS)}
              className={`
                w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold
                ${key === 'YEARLY'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }
              `}
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function getPlanFeatures(planType: keyof typeof PLANS): string[] {
  const features = {
    TRIAL: [
      'Acesso ao chatbot',
      '10 mensagens gratuitas',
      'Suporte básico'
    ],
    MONTHLY: [
      'Acesso completo ao chatbot',
      'Conversas ilimitadas',
      'Suporte prioritário',
      'Histórico de conversas'
    ],
    YEARLY: [
      'Acesso completo ao chatbot',
      'Conversas ilimitadas',
      'Suporte VIP',
      'Histórico de conversas',
      'Conversa por voz',
      'Desconto de 30%'
    ]
  };

  return features[planType];
}