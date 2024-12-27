import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AuthLayout } from './components/layout/AuthLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
import { SurveyRouter } from './pages/SurveyRouter';
import { Chat } from './components/Chat';
import { DashboardPage } from './pages/DashboardPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentErrorPage } from './pages/PaymentErrorPage';
import { PrivateRoute } from './components/PrivateRoute';
import { LoadingScreen } from './components/LoadingScreen';
import { initMercadoPago } from './lib/mercadopago/config';

export function App() {
  useEffect(() => {
    initMercadoPago();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
          </Route>

          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          
          <Route path="/checkout/:planId" element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          } />
          
          <Route path="/payment/success" element={
            <PrivateRoute>
              <PaymentSuccessPage />
            </PrivateRoute>
          } />
          
          <Route path="/payment/error" element={
            <PrivateRoute>
              <PaymentErrorPage />
            </PrivateRoute>
          } />

          <Route path="/survey/*" element={
            <PrivateRoute>
              <SurveyRouter />
            </PrivateRoute>
          } />
          
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}