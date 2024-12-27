import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { UserPlans } from '../components/dashboard/UserPlans';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold font-display mb-2">
            Olá, {user?.user_metadata?.name || 'Usuário'}!
          </h1>
          <p className="text-gray-600">
            {subscription?.status === 'trial' 
              ? 'Aproveite seu período de teste e explore todas as funcionalidades!'
              : 'Bem-vindo(a) de volta ao seu espaço de conexão.'}
          </p>
        </div>

        <Link 
          to="/chat"
          className="block w-full sm:w-auto mb-12 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl shadow-lg hover:opacity-90 transition-all"
        >
          <div className="flex items-center justify-center gap-3 px-6 py-4">
            <MessageSquare className="w-6 h-6" />
            <span className="text-lg font-semibold">Iniciar Conversa</span>
          </div>
        </Link>

        <UserPlans 
          currentPlan={subscription?.plan || 'trial'} 
          status={subscription?.status || 'trial'}
          trialEnd={subscription?.trial_end}
        />
      </main>
    </div>
  );
}