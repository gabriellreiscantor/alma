import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Bem-vindo de volta
      </h2>

      <LoginForm />

      <div className="mt-6 text-center text-sm space-y-2">
        <p>
          <Link 
            to="/reset-password" 
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            Esqueceu sua senha?
          </Link>
        </p>
        <p className="text-gray-600">
          Ainda não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
            Criar conta
          </Link>
        </p>
      </div>
    </>
  );
}