import React, { useState } from 'react';
import { CheckoutSummary } from './CheckoutSummary';
import { LoadingButton } from '../ui/LoadingButton';

interface CheckoutFormProps {
  planName: string;
  planPrice: number;
}

export function CheckoutForm({ planName, planPrice }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.href = '/payment/success';
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <CheckoutSummary planName={planName} planPrice={planPrice} />

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          
          <input
            type="tel"
            placeholder="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
      </div>

      <LoadingButton
        type="submit"
        isLoading={loading}
        loadingText="Processando..."
        className="w-full"
      >
        Finalizar Assinatura
      </LoadingButton>
    </form>
  );
}