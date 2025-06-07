
import React from 'react';
import { TopNavigation } from './TopNavigation';
import { Footer } from './Footer';
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
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation 
        nutricionista={nutricionista}
        onSignOut={signOut}
      />
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};
