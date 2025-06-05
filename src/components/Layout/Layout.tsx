
import React from 'react';
import { TopNavigation } from './TopNavigation';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();

  const nutricionista = {
    nome: user?.user_metadata?.nome_completo || user?.email || 'Usuário',
    email: user?.email || '',
    crn: 'CRN-3 12345',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        nutricionista={nutricionista}
        onSignOut={signOut}
      />
      
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};
