import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Crie sua conta
      </h2>

      <RegisterForm />

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
            Faça login
          </Link>
        </p>
      </div>
    </>
  );
}