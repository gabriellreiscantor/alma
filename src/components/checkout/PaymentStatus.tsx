import React from 'react';
import { usePaymentStatus } from '../../lib/mercadopago/hooks/usePaymentStatus';
import { LoadingScreen } from '../LoadingScreen';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface PaymentStatusProps {
  preferenceId: string;
}

export function PaymentStatus({ preferenceId }: PaymentStatusProps) {
  const { status, loading } = usePaymentStatus(preferenceId);

  if (loading) return <LoadingScreen />;

  const statusConfig = {
    pending: {
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
      title: 'Pagamento Pendente',
      message: 'Aguardando confirmação do pagamento...'
    },
    approved: {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: 'Pagamento Aprovado!',
      message: 'Seu pagamento foi confirmado com sucesso.'
    },
    rejected: {
      icon: <XCircle className="w-8 h-8 text-red-500" />,
      title: 'Pagamento Recusado',
      message: 'Houve um problema com seu pagamento. Por favor, tente novamente.'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
        {config.icon}
      </div>
      <h2 className="text-2xl font-bold mb-4">{config.title}</h2>
      <p className="text-gray-600">{config.message}</p>
    </div>
  );
}