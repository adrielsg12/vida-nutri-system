
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserStatus } from '@/hooks/useUserStatus';
import { AcessoNegado } from '@/pages/AcessoNegado';
import { AcessoRejeitado } from '@/pages/AcessoRejeitado';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading, isApproved, isPending, isRejected } = useUserStatus();

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

  // Se está aprovado ou é admin, permitir acesso
  if (isApproved) {
    return <>{children}</>;
  }

  // Fallback para status desconhecido
  return <AcessoNegado />;
};
