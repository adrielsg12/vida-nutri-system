
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserStatus } from '@/hooks/useUserStatus';
import { AcessoNegado } from '@/pages/AcessoNegado';
import { AcessoRejeitado } from '@/pages/AcessoRejeitado';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AcessoInativo = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Conta Inativa
      </h1>
      <p className="text-gray-600 mb-6">
        Sua conta está inativa. Entre em contato com o suporte para mais informações.
      </p>
      <div className="text-sm text-gray-500">
        <p>📩 suporte@nutrisync.com</p>
      </div>
    </div>
  </div>
);

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading, isApproved, isPending, isRejected, isInactive } = useUserStatus();

  // Mostrar loading enquanto verifica autenticação e perfil
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Se não está logado, redirecionar para login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Se não encontrou o perfil do usuário, algo está errado
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar perfil do usuário.</p>
        </div>
      </div>
    );
  }

  // Verificar status do usuário
  if (isPending) {
    return <AcessoNegado />;
  }

  if (isRejected) {
    return <AcessoRejeitado />;
  }

  if (isInactive) {
    return <AcessoInativo />;
  }

  // Se está aprovado ou é admin, permitir acesso
  if (isApproved) {
    return <>{children}</>;
  }

  // Fallback para status desconhecido
  return <AcessoNegado />;
};
